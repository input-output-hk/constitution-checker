{-# LANGUAGE DataKinds #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.API where

import Servant hiding (Context (..))
import Servant.Swagger.UI

import Cardano.Constitution.Checker.Checks hiding (description)

import Cardano.Constitution.Checker.Context
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Control.Lens hiding (Context (..), (.=))
import Data.Map (Map)
import Data.Swagger as SWG hiding (URL)
import Network.HTTP.Conduit (simpleHttp)
import Servant.Swagger

import Cardano.Constitution.Checker.Blockfrost
import Cardano.Constitution.Checker.Web
import Control.Monad.IO.Class (MonadIO (liftIO))
import Data.Aeson
import Data.String
import Data.Text (Text, unpack)
import Servant.Client (BaseUrl, parseBaseUrl, showBaseUrl)

import qualified Data.Map as Map
import Network.Wai.Middleware.Cors

type API =
  "parameters"
    :> "proposal"
    :> ( ReqBody '[JSON] ParametersChange :> Post '[JSON] ParamChecks
          :<|> "by-url" :> ReqBody '[JSON] URL :> Post '[JSON] ParamChecks
       )
    :<|> "current-values" :> Get '[JSON] EpochParameters
    :<|> "transactions" :> Capture "transactionId" Text :> Get '[JSON] ParametersChange

type StaticAPI = Raw

type FullApi = HtmxAPI :<|> API :<|> StaticAPI

newtype URL = URL BaseUrl

server :: ServerCaps -> Server FullApi
server ServerCaps{..} =
  (homePageHandler' :<|> paramsCheckHandler')
    :<|> ( ( parametersChange
              :<|> parametersChangeByUrl
           )
            :<|> getAllCurrentParamsValues
            :<|> transactionHandler
         )
    :<|> serveDirectoryWebApp "./web"
 where
  transactionHandler :: Text -> Handler ParametersChange
  transactionHandler transactionId = do
    resp <- liftIO $ getProposal transactionId
    case resp of
      Right (ProposalTx change) -> return change
      Left err -> throwError err500{errBody = fromString err}

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
  let jsonData = eitherDecode' response
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

newtype ServerCaps = ServerCaps
  { getProtocolParams :: IO (Map Epoch ProtocolParams)
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
