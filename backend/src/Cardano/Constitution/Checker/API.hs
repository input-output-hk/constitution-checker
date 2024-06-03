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
import Data.Swagger as SWG hiding (URL)
import Network.HTTP.Conduit (simpleHttp)
import Servant.Swagger

import Cardano.Constitution.Checker.Blockfrost
import Control.Monad.IO.Class (MonadIO (liftIO))
import Data.Aeson
import Data.String
import Data.Text (unpack)
import Servant.Client (BaseUrl, parseBaseUrl, showBaseUrl)

type API =
  "parameters"
    :> "proposal"
    :> ( ReqBody '[JSON] ParametersChange :> Post '[JSON] ParamChecks
          :<|> "by-url" :> ReqBody '[JSON] URL :> Post '[JSON] ParamChecks
       )
    :<|> "current-values" :> Get '[JSON] EpochParameters

newtype URL = URL BaseUrl

server :: ServerCaps -> Server API
server ServerCaps{..} =
  ( parametersChange
      :<|> parametersChangeByUrl
  )
    :<|> getAllCurrentParamsValues
 where
  getAllCurrentParamsValues :: Handler EpochParameters
  getAllCurrentParamsValues = do
    protocolParamsE <- liftIO getLatestEpochProtocolParams
    case protocolParamsE of
      Left err -> throwError err500{errBody = fromString err}
      Right protocolParams -> pure $ allCurrentParamsValues protocolParams

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
    protocolParamsE <- liftIO getLatestEpochProtocolParams
    case protocolParamsE of
      Left err -> throwError err500{errBody = fromString err}
      Right protocolParams ->
        pure
          ( mkContext paramChange protocolParams
          , allCurrentParamsValues protocolParams
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
    :<|> API

instance ToSchema URL where
  declareNamedSchema _ = do
    let
      schema' =
        mempty
          & type_ ?~ SwaggerString
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
  { getLatestEpochProtocolParams :: IO (Either String ProtocolParams)
  }

-- | Servant server for an API
serverWithDoc :: ServerCaps -> Server APIWithDoc
serverWithDoc caps =
  swaggerSchemaUIServer swaggerJson :<|> server caps

app :: ServerCaps -> Application
app = serve apiWithDoc . serverWithDoc

-- TODO:  replaceThis
dummyServerCaps :: ServerCaps
dummyServerCaps =
  ServerCaps
    { getLatestEpochProtocolParams = getLatestParams
    }
