{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DerivingVia #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.Blockfrost.Override (
  ProtocolParams (..),
  unCostModels,
  getParamsByEpoch,
  getLatestParams,
  getProposal,
  ProposalTx (..),
) where

import Data.Text (Text)
import Deriving.Aeson

import Blockfrost.Types.Shared
import Cardano.Constitution.Checker.Blockfrost.Base
import Data.Aeson
import Data.Proxy

import Cardano.Constitution.Checker.Types (ParametersChange)
import Network.HTTP.Client.TLS
import Servant.API
import Servant.Client

type ParamAPI =
  "api"
    :> "v0"
    :> Header "project_id" String
    :> ( ( "epochs"
            :> ( Capture "epoch" Epoch :> "parameters" :> Get '[JSON] ProtocolParams
                  :<|> "latest" :> "parameters" :> Get '[JSON] ProtocolParams
               )
         )
          :<|> "governance" :> "proposals" :> Capture "txHash" Text :> "0" :> Get '[JSON] ProposalTx
       )

newtype ProposalTx = ProposalTx {unProposalTx :: ParametersChange}
  deriving (Eq, Show)

instance FromJSON ProposalTx where
  parseJSON = withObject "ProposalTx" $ \o -> do
    (_, proposal, _) :: (Value, ParametersChange, Value) <- o .: "governance_description" >>= (.: "contents") >>= parseJSON
    pure $ ProposalTx proposal

api :: Proxy ParamAPI
api = Proxy

baseURL :: BaseUrl
baseURL = BaseUrl Https "cardano-sanchonet.blockfrost.io" 443 ""

endpoints ::
  [Char] ->
  ( (Epoch -> ClientM ProtocolParams)
      :<|> ClientM ProtocolParams
  )
    :<|> (Text -> ClientM ProposalTx)
endpoints auth = do
  client api (Just auth)

withClient ::
  ( (((Epoch -> ClientM ProtocolParams) :<|> ClientM ProtocolParams) :<|> (Text -> ClientM ProposalTx)) ->
    ClientM b
  ) ->
  IO (Either String b)
withClient m = do
  auth <- filter (/= '\n') <$> readFile bfTokenPath

  manager' <- newTlsManagerWith tlsManagerSettings

  let endpoints' = endpoints auth

  res <- runClientM (m endpoints') (mkClientEnv manager' baseURL)
  case res of
    Left err -> pure $ Left $ show err
    Right ret -> pure (Right ret)

getParamsByEpoch :: Epoch -> IO (Either String ProtocolParams)
getParamsByEpoch epoch = withClient $ \endpoints' -> do
  let (getParam :<|> _) :<|> _ = endpoints'
  getParam epoch

getLatestParams :: IO (Either String ProtocolParams)
getLatestParams = withClient $ \endpoints' -> do
  let (_ :<|> getLatestParams') :<|> _ = endpoints'
  getLatestParams'

getProposal :: Text -> IO (Either String ProposalTx)
getProposal txHash = withClient $ \endpoints' -> do
  let (_ :<|> _) :<|> getProposal' = endpoints'
  getProposal' txHash
