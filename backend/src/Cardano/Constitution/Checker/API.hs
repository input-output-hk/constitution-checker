{-# LANGUAGE DataKinds #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.API where

import Servant
import Servant.Swagger.UI

import Cardano.Constitution.Checker.Checks hiding (description)

import Cardano.Constitution.Checker.Types
import Control.Lens hiding (Context (..), (.=))
import Data.Swagger as SWG hiding (URL)
import Network.HTTP.Conduit (simpleHttp)
import Servant.Swagger

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
newtype URL = URL BaseUrl

server :: Server API
server =
  parametersChange
    :<|> parametersChangeByUrl
 where
  parametersChange :: ParametersChange -> Handler ParamChecks
  parametersChange paramChange = pure $ checkParams (mkContext paramChange) paramChange
  parametersChangeByUrl :: URL -> Handler ParamChecks
  parametersChangeByUrl url = do
    param <- fetchParamCheck url
    parametersChange param

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

-- | Servant server for an API
serverWithDoc :: Server APIWithDoc
serverWithDoc =
  swaggerSchemaUIServer swaggerJson :<|> server

app :: Application
app = serve apiWithDoc serverWithDoc
