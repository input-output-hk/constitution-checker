{-# LANGUAGE ConstraintKinds #-}
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
  getProposalsInfo,
  getLatestEpochDetails,
  ProposalTx (..),
  ProposalInfo (..),
  ProposalDetails (..),
  GovernanceType (..),
  InternalBFMonad,
  HasToken (..),
  NetworkType (..),
  HasNetworkType (..),
  EpochDetails (..),
) where

import Data.Text (Text)
import Deriving.Aeson

import Blockfrost.Types.Shared
import Cardano.Constitution.Checker.Blockfrost.Base
import Data.Aeson
import Data.Proxy

import Cardano.Constitution.Checker.Base (mapLeft)
import Cardano.Constitution.Checker.Types (ParametersChange)
import Control.Lens hiding (Context, (.=))
import Control.Monad.Except
import Control.Monad.Reader
import Data.Swagger hiding (Header, Https)
import Network.HTTP.Client.TLS
import Servant.API
import Servant.Client

data EpochDetails = EpochDetails
  { epdEpoch :: !Epoch
  , epdStartTime :: !Integer
  , epdEndTime :: !Integer
  , epdFirstBlockTime :: !Integer
  , epdLastBlockTime :: !Integer
  , epdBlockCount :: !Integer
  , epdTxCount :: !Integer
  , epdOutput :: !String
  , epdFees :: !String
  , epdActiveStake :: !String
  }
  deriving stock (Eq, Show)

instance FromJSON EpochDetails where
  parseJSON = withObject "EpochDetails" $ \o ->
    EpochDetails
      <$> o .: "epoch"
      <*> o .: "start_time"
      <*> o .: "end_time"
      <*> o .: "first_block_time"
      <*> o .: "last_block_time"
      <*> o .: "block_count"
      <*> o .: "tx_count"
      <*> o .: "output"
      <*> o .: "fees"
      <*> o .: "active_stake"

type ParamAPI =
  "api"
    :> "v0"
    :> Header "project_id" String
    :> ( ( "epochs"
            :> ( Capture "epoch" Epoch :> "parameters" :> Get '[JSON] ProtocolParams
                  :<|> "latest"
                    :> ( Get '[JSON] EpochDetails
                          :<|> "parameters" :> Get '[JSON] ProtocolParams
                       )
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
    (_, proposal, _) :: (Value, ParametersChange, Value) <-
      o .: "governance_description" >>= (.: "contents") >>= parseJSON
    pure $ ProposalTx proposal

api :: Proxy ParamAPI
api = Proxy

data NetworkType = Mainnet | Sanchonet
  deriving (Eq, Show)

baseURL :: NetworkType -> BaseUrl
baseURL nt = BaseUrl Https ("cardano-" <> network <> ".blockfrost.io") 443 ""
 where
  network = case nt of
    Mainnet -> "mainnet"
    Sanchonet -> "sanchonet"

type APISignature =
  ( (Epoch -> ClientM ProtocolParams)
      :<|> (ClientM EpochDetails :<|> ClientM ProtocolParams)
  )
    :<|> ( (Text -> ClientM Value)
            :<|> (Maybe Int -> ClientM [ProposalInfo])
         )

endpoints :: [Char] -> APISignature
endpoints auth = do
  client api (Just auth)

class HasToken env where
  getToken :: env -> String

class HasNetworkType env where
  getNetworkType :: env -> NetworkType

type InternalBFMonad env m =
  ( MonadError IOError m
  , MonadReader env m
  , HasToken env
  , HasNetworkType env
  , MonadIO m
  )

withClientM :: (InternalBFMonad env m) => (APISignature -> ClientM b) -> m b
withClientM f = do
  auth <- asks getToken
  networkType <- asks getNetworkType

  manager' <- newTlsManagerWith tlsManagerSettings

  let endpoints' = endpoints auth

  res <- liftIO $ runClientM (f endpoints') (mkClientEnv manager' (baseURL networkType))
  liftEither $ mapLeft (userError . show) res

getParamsByEpoch :: (InternalBFMonad env m) => Epoch -> m ProtocolParams
getParamsByEpoch epoch = withClientM $ \endpoints' -> do
  let (getParam :<|> _) :<|> _ = endpoints'
  getParam epoch

getLatestEpochDetails :: (InternalBFMonad env m) => m EpochDetails
getLatestEpochDetails = withClientM $ \endpoints' -> do
  let (_ :<|> (getLatestEpochDetails' :<|> _)) :<|> _ = endpoints'
  getLatestEpochDetails'

getLatestParams :: (InternalBFMonad env m) => m ProtocolParams
getLatestParams = withClientM $ \endpoints' -> do
  let (_ :<|> (_ :<|> getLatestParams')) :<|> _ = endpoints'
  getLatestParams'

getProposal :: (InternalBFMonad env m) => Text -> m Value
getProposal txHash = withClientM $ \endpoints' -> do
  let (_ :<|> _) :<|> (getProposal' :<|> _) = endpoints'
  getProposal' txHash

type Page = Int

getProposalsInfo :: (InternalBFMonad env m) => Page -> m [ProposalInfo]
getProposalsInfo page = withClientM $ \endpoints' -> do
  let (_ :<|> _) :<|> (_ :<|> getProposalInfos') = endpoints'
  getProposalInfos' $ Just page
