{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.API where

import Servant hiding (Context (..))
import Servant.Swagger.UI

import Cardano.Constitution.Checker.Checks hiding (description)

import Cardano.Constitution.Checker.Context
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Control.Lens hiding (Context (..), (.=), (<.>))
import Data.Map (Map, elems)
import Data.Swagger as SWG hiding (URL)
import Network.HTTP.Conduit (simpleHttp)
import Servant.Swagger

import Cardano.Constitution.Checker.Blockfrost
import Cardano.Constitution.Checker.Blockfrost.Sync as Sync
import Cardano.Constitution.Checker.Web
import Control.Monad.IO.Class (MonadIO (liftIO))
import Data.Aeson as Aeson
import Data.String
import Data.Text (Text, pack, unpack)
import Network.Wai.Middleware.Cors
import Servant.Client (BaseUrl, parseBaseUrl, showBaseUrl)
import System.Directory (doesFileExist, listDirectory)
import System.FilePath

import qualified Data.Aeson.KeyMap as KM
import qualified Data.Map as Map

type API =
  "parameters"
    :> "proposal"
    :> ( ReqBody '[JSON] ParametersChange :> Post '[JSON] ParamChecks
          :<|> "by-url" :> ReqBody '[JSON] URL :> Post '[JSON] ParamChecks
       )
    :<|> "current-values" :> Get '[JSON] EpochParameters
    :<|> "transactions" :> Capture "transactionId" Text :> Get '[JSON] ParametersChange
    :<|> "transactions" :> Capture "transactionId" Text :> "details" :> Get '[JSON] ProposalDetailsWithCheck
    :<|> "transactions" :> Get '[JSON] [Text]

type StaticAPI = Raw

type FullApi = HtmxAPI :<|> API :<|> StaticAPI

newtype URL = URL BaseUrl

data ProposalDetailsWithCheck = ProposalDetailsWithCheck
  { proposalDetails :: !ProposalDetails
  , proposalDetailsValid :: !Bool
  }

instance ToJSON ProposalDetailsWithCheck where
  toJSON ProposalDetailsWithCheck{..} = Object (x <> y)
   where
    x = case toJSON proposalDetails of
      Object obj -> obj
      _otherwise -> KM.empty
    y = KM.fromList ["valid" .= proposalDetailsValid]

instance ToSchema ProposalDetailsWithCheck where
  declareNamedSchema _ = do
    profileSchema <- declareSchema (Proxy :: Proxy ProposalDetails)
    boolSchema <- declareSchemaRef (Proxy :: Proxy Bool)
    return $
      NamedSchema (Just "ProfileSummaryDTO") $
        profileSchema
          & properties
            %~ ( `mappend`
                  [ ("valid", boolSchema)
                  ]
               )
          & required %~ (<> ["role", "profileId", "runStats"])

server :: ServerCaps -> Server FullApi
server ServerCaps{..} =
  (homePageHandler' :<|> paramsCheckHandler')
    :<|> ( ( parametersChange
              :<|> parametersChangeByUrl
           )
            :<|> getAllCurrentParamsValues
            :<|> transactionHandler
            :<|> transactionDetailsHandler
            :<|> getAllTransactionsHandler
         )
    :<|> serveDirectoryWebApp "./web"
 where
  getAllTransactionsHandler :: Handler [Text]
  getAllTransactionsHandler = do
    let folder = dataPath </> proposalsFolder
    files <- liftIO $ listDirectory folder
    return $ map (pack . dropExtension) files

  transactionsHandlerGen :: (FromJSON a) => (a -> b) -> Text -> Handler b
  transactionsHandlerGen f transactionId = do
    let filePath = dataPath </> proposalsFolder </> unpack transactionId <.> "json"
    exists <- liftIO $ doesFileExist filePath
    if not exists
      then throwError err404{errBody = fromString "not found"}
      else do
        content <- liftIO $ readFile filePath
        case Aeson.eitherDecode' $ fromString content of
          Left err -> throwError err500{errBody = fromString err}
          Right x -> return $ f x

  transactionDetailsHandler :: Text -> Handler ProposalDetailsWithCheck
  transactionDetailsHandler tx = do
    details <- transactionsHandlerGen id tx
    change <- transactionsHandlerGen unProposalTx tx
    ParamChecks checks _ <- parametersChange change
    let allMandatoryValid = all check $ elems checks
    pure $ ProposalDetailsWithCheck details allMandatoryValid
   where
    check :: GenericParamCheck -> Bool
    check (MkGenericParamCheck (ParamCheck _ _ check')) = checkMandatoryGuardrailsMap check'
    check (MkGenericParamCheck (ParamCheckList checks)) =
      let mandatoryResults = map (\(ParamCheck _ _ results) -> checkMandatoryGuardrailsMap results) checks
       in and mandatoryResults
    check (MkGenericParamCheck (ParamCheckCostModels _ _ (check1, check2, check3))) =
      let
        mandatoryResults = map checkMandatoryGuardrailsMap [check1, check2, check3]
       in
        and mandatoryResults

  transactionHandler :: Text -> Handler ParametersChange
  transactionHandler = transactionsHandlerGen unProposalTx

  getLatestEpochProtocolParams :: Map Epoch ProtocolParams -> Either String ProtocolParams
  getLatestEpochProtocolParams protocolParams =
    let maxEpoch = maximum $ Map.keys protocolParams
     in case Map.lookup maxEpoch protocolParams of
          Nothing -> Left "No protocol parameters available"
          Just params -> Right params
  homePageHandler' :: Bool -> Handler RawHtml
  homePageHandler' viewParamsResult = do
    (EpochParameters _ currentParams) <- getAllCurrentParamsValues
    homePageHandler viewParamsResult currentParams (ParamChecks' Map.empty Map.empty)

  paramsCheckHandler' :: AllInputs -> Handler RawHtml
  paramsCheckHandler' inputs@(AllInputs paramChange _ _ _) = do
    (ctx, EpochParameters _ currentParams) <- mkContext' paramChange
    let (ParamChecks proposed' (MissingParams missing)) = checkParams currentParams ctx paramChange
    paramsCheckHandler currentParams (ParamChecks' proposed' missing) inputs

  getAllCurrentParamsValues :: Handler EpochParameters
  getAllCurrentParamsValues = do
    protocolParamsE <- getLatestEpochProtocolParams <$> liftIO getProtocolParams
    case protocolParamsE of
      Left err -> throwError err500{errBody = fromString err}
      Right protocolParams -> pure $ protocolParamsToEpochParams protocolParams

  parametersChange :: ParametersChange -> Handler ParamChecks
  parametersChange paramChange = do
    (ctx, EpochParameters _ currentParams) <- mkContext' paramChange
    pure $ checkParams currentParams ctx paramChange

  parametersChangeByUrl :: URL -> Handler ParamChecks
  parametersChangeByUrl url' = do
    param <- fetchParamCheck url'
    parametersChange param

  mkContext' :: ParametersChange -> Handler (Context, EpochParameters)
  mkContext' paramChange = do
    epochParams <- liftIO getProtocolParams
    let protocolParamsE = getLatestEpochProtocolParams epochParams
    case protocolParamsE of
      Left err -> throwError err500{errBody = fromString err}
      Right protocolParams ->
        let currentEpochParams = protocolParamsToEpochParams protocolParams
         in pure
              ( mkContext paramChange protocolParams (epoch currentEpochParams) epochParams
              , currentEpochParams
              )

-- TODO: guard checks against exploits
fetchParamCheck :: URL -> Handler ParametersChange
fetchParamCheck (URL baseUrl) = do
  -- Replace with your URL
  response <- simpleHttp $ showBaseUrl baseUrl
  let jsonData = Aeson.eitherDecode' response
  case jsonData of
    Right data' -> return data'
    Left err -> throwError err400{errBody = fromString err}

api :: Proxy API
api = Proxy

type APIWithDoc =
  SwaggerSchemaUI "swagger-ui" "swagger.json"
    :<|> FullApi

instance ToSchema URL where
  declareNamedSchema _ = do
    let
      schema' = mempty & type_ ?~ SwaggerString
    return $ NamedSchema (Just "URL") schema'

instance FromJSON URL where
  parseJSON = withText "URL" $ \t -> do
    case parseBaseUrl $ unpack t of
      Just u -> pure $ URL u
      Nothing -> error "Invalid URL"

instance ToJSON URL where
  toJSON (URL u) = toJSON $ showBaseUrl u

apiWithDoc :: Proxy APIWithDoc
apiWithDoc = Proxy

swaggerJson :: Swagger
swaggerJson =
  toSwagger (Proxy :: Proxy API)
    & info . title .~ "Constitution Checker API"
    & info . SWG.version .~ "0.1.0.0"
    & info . description ?~ "This is the API for the Constitution Checker."

data ServerCaps = ServerCaps
  { getProtocolParams :: !(IO (Map Epoch ProtocolParams))
  , dataPath :: !FilePath
  }

-- | Servant server for an API
serverWithDoc :: ServerCaps -> Server APIWithDoc
serverWithDoc caps =
  swaggerSchemaUIServer swaggerJson :<|> server caps

customCorsPolicy :: CorsResourcePolicy
customCorsPolicy =
  simpleCorsResourcePolicy
    { corsOrigins = Nothing -- This allows all origins
    , corsMethods = ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
    , corsRequestHeaders = ["Authorization", "Content-Type"]
    , corsExposedHeaders = Nothing -- Expose all headers
    , corsMaxAge = Nothing
    }
app :: ServerCaps -> Application
app = cors (const $ Just customCorsPolicy) . serve apiWithDoc . serverWithDoc
