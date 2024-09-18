{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DerivingVia #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE RecordWildCards #-}
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
  getProposalsInfo,
  ProposalInfo (..),
  ProposalDetails (..),
  GovernanceType (..),
) where

import Data.Text (Text)
import Deriving.Aeson

import Blockfrost.Types.Shared
import Cardano.Constitution.Checker.Blockfrost.Base
import Data.Aeson
import Data.Proxy

import Cardano.Constitution.Checker.Types (ParametersChange)
import Control.Lens hiding (Context, (.=))
import Data.Swagger hiding (Header, Https)
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
          :<|> "governance"
            :> "proposals"
            :> ( Capture "txHash" Text :> "0" :> Get '[JSON] Value
                  :<|> QueryParam "page" Int :> Get '[JSON] [ProposalInfo]
               )
       )

data ProposalDetails = ProposalDetails
  { propDetailsTxHash :: !Text
  , propDetailsRatifiedEpoch :: !(Maybe Epoch)
  , propDetailsDroppedEpoch :: !(Maybe Epoch)
  , propDetailsEnactedEpoch :: !(Maybe Epoch)
  , propDetailsExpiration :: !(Maybe Epoch)
  , propDetailsExpiredEpoch :: !(Maybe Epoch)
  , propDetailsReturnAddress :: !(Maybe Text)
  , propDetailsAnchorHash :: !(Maybe Text)
  , propDetailsAnchorUrl :: !(Maybe Text)
  , propDetailsCertIndex :: !Int
  , propDetailsDeposit :: !Lovelaces
  }

data ProposalInfo = ProposalInfo
  { propInfoTxHash :: !Text
  , propInfoCertIndex :: !Int
  , propInfoGovernanceType :: !GovernanceType
  }
  deriving (Eq, Show)

instance ToSchema ProposalDetails where
  declareNamedSchema _ = do
    textSchema <- declareSchemaRef (Proxy :: Proxy Text)
    intSchema <- declareSchemaRef (Proxy :: Proxy Int)
    lovelacesSchema <- declareSchemaRef (Proxy :: Proxy String)

    return $
      NamedSchema (Just "ProposalDetails") $
        mempty
          & type_ ?~ SwaggerObject
          & properties
            .~ [ ("tx_hash", textSchema)
               , ("ratified_epoch", intSchema)
               , ("dropped_epoch", intSchema)
               , ("enacted_epoch", intSchema)
               , ("expiration", intSchema)
               , ("expired_epoch", intSchema)
               , ("return_address", textSchema)
               , ("anchor_hash", textSchema)
               , ("anchor_url", textSchema)
               , ("cert_index", intSchema)
               , ("deposit", lovelacesSchema)
               ]
          & required .~ ["tx_hash", "cert_index", "deposit"]

instance FromJSON ProposalDetails where
  parseJSON = withObject "ProposalInfo" $ \o ->
    ProposalDetails
      <$> o .: "tx_hash"
      <*> o .:? "ratified_epoch"
      <*> o .:? "dropped_epoch"
      <*> o .:? "enacted_epoch"
      <*> o .:? "expiration"
      <*> o .:? "expired_epoch"
      <*> o .:? "return_address"
      <*> o .:? "anchor_hash"
      <*> o .:? "anchor_url"
      <*> o .: "cert_index"
      <*> o .: "deposit"

instance ToJSON ProposalDetails where
  toJSON ProposalDetails{..} =
    object
      [ "tx_hash" .= propDetailsTxHash
      , "ratified_epoch" .= propDetailsRatifiedEpoch
      , "dropped_epoch" .= propDetailsDroppedEpoch
      , "enacted_epoch" .= propDetailsEnactedEpoch
      , "expiration" .= propDetailsExpiration
      , "expired_epoch" .= propDetailsExpiredEpoch
      , "return_address" .= propDetailsReturnAddress
      , "anchor_hash" .= propDetailsAnchorHash
      , "anchor_url" .= propDetailsAnchorUrl
      , "cert_index" .= propDetailsCertIndex
      , "deposit" .= propDetailsDeposit
      ]
instance FromJSON ProposalInfo where
  parseJSON = withObject "ProposalInfo" $ \o ->
    ProposalInfo
      <$> o .: "tx_hash"
      <*> o .: "cert_index"
      <*> o .: "governance_type"

data GovernanceType
  = InfoAction
  | NewConstitution
  | NoConfidence
  | NewCommittee
  | TreasuryWithdrawals
  | HardForkInitiation
  | ParameterChange
  | UnknownGovernanceType !Text
  deriving (Eq, Show)

instance FromJSON GovernanceType where
  parseJSON = withText "GovernanceType" $ \case
    "info_action" -> pure InfoAction
    "new_constitution" -> pure NewConstitution
    "no_confidence" -> pure NoConfidence
    "new_committee" -> pure NewCommittee
    "treasury_withdrawals" -> pure TreasuryWithdrawals
    "hard_fork_initiation" -> pure HardForkInitiation
    "parameter_change" -> pure ParameterChange
    x -> pure $ UnknownGovernanceType x

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
    :<|> ( (Text -> ClientM Value)
            :<|> (Maybe Int -> ClientM [ProposalInfo])
         )
endpoints auth = do
  client api (Just auth)

withClient ::
  ( ( ((Epoch -> ClientM ProtocolParams) :<|> ClientM ProtocolParams)
        :<|> ( (Text -> ClientM Value)
                :<|> (Maybe Int -> ClientM [ProposalInfo])
             )
    ) ->
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

getProposal :: Text -> IO (Either String Value)
getProposal txHash = withClient $ \endpoints' -> do
  let (_ :<|> _) :<|> (getProposal' :<|> _) = endpoints'
  getProposal' txHash

type Page = Int

getProposalsInfo :: Page -> IO (Either String [ProposalInfo])
getProposalsInfo page = withClient $ \endpoints' -> do
  let (_ :<|> _) :<|> (_ :<|> getProposalInfos') = endpoints'
  getProposalInfos' $ Just page
