{-# LANGUAGE DataKinds #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.API where

import Servant
import Servant.Swagger.UI

import Cardano.Constitution.Checker.Checks hiding (description)

import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Control.Lens hiding (Context (..), (.=))
import Data.Swagger as SWG
import Servant.Swagger

type API =
  "parameters" :> "proposal" :> ReqBody '[JSON] ParametersChange :> Post '[JSON] ParamChecks
    :<|> "other" :> Get '[JSON] ()

server :: Server API
server =
  parametersChange
    :<|> return ()
 where
  parametersChange :: ParametersChange -> Handler ParamChecks
  parametersChange paramChange = pure $ checkParams Context paramChange

api :: Proxy API
api = Proxy

type APIWithDoc =
  SwaggerSchemaUI "swagger-ui" "swagger.json"
    :<|> API

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
