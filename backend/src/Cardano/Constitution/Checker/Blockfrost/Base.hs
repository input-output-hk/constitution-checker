{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE DerivingVia #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeFamilies #-}

module Cardano.Constitution.Checker.Blockfrost.Base (
  ProtocolParams (..),
  Epoch (..),
  CostModels (..),
) where

import Blockfrost.Client hiding (CostModels (..), ProtocolParams)

import Data.Bifunctor
import Data.Map (Map)
import Data.Text (Text)
import Deriving.Aeson

import qualified Data.Aeson.Key
import qualified Data.Aeson.KeyMap
import qualified Data.Char
import qualified Data.Map

import Data.Aeson

-- | Protocol parameters
data ProtocolParams = ProtocolParams
  { _protocolParamsEpoch :: !Epoch
  -- ^ Epoch number
  , _protocolParamsMinFeeA :: !Integer
  -- ^ The linear factor for the minimum fee calculation for given epoch
  , _protocolParamsMinFeeB :: !Integer
  -- ^ The constant factor for the minimum fee calculation
  , _protocolParamsMaxBlockSize :: !Integer
  -- ^ Maximum block body size in Bytes
  , _protocolParamsMaxTxSize :: !Integer
  -- ^ Maximum transaction size
  , _protocolParamsMaxBlockHeaderSize :: !Integer
  -- ^ Maximum block header size
  , _protocolParamsKeyDeposit :: !Lovelaces
  -- ^ The amount of a key registration deposit in Lovelaces
  , _protocolParamsPoolDeposit :: !Lovelaces
  -- ^ The amount of a pool registration deposit in Lovelaces
  , _protocolParamsEMax :: !Integer
  -- ^ Epoch bound on pool retirement
  , _protocolParamsNOpt :: !Integer
  -- ^ Desired number of pools
  , _protocolParamsA0 :: !Rational
  -- ^ Pool pledge influence
  , _protocolParamsRho :: !Rational
  -- ^ Monetary expansion
  , _protocolParamsTau :: !Rational
  -- ^ Treasury expansion
  , _protocolParamsDecentralisationParam :: !Rational
  -- ^ Percentage of blocks produced by federated nodes
  , _protocolParamsExtraEntropy :: !(Maybe Text)
  -- ^ Seed for extra entropy
  , _protocolParamsProtocolMajorVer :: !Integer
  -- ^ Accepted protocol major version
  , _protocolParamsProtocolMinorVer :: !Integer
  -- ^ Accepted protocol minor version
  , _protocolParamsMinUtxo :: !Lovelaces
  -- ^ Minimum UTXO value
  , _protocolParamsMinPoolCost :: !Lovelaces
  -- ^ Minimum stake cost forced on the pool
  , _protocolParamsNonce :: !Text
  -- ^ Epoch number only used once
  , _protocolParamsCostModels :: !CostModels
  -- ^ Cost models parameters for Plutus Core scripts
  , _protocolParamsPriceMem :: !Rational
  -- ^ The per word cost of script memory usage
  , _protocolParamsPriceStep :: !Rational
  -- ^ The cost of script execution step usage
  , _protocolParamsMaxTxExMem :: !Quantity
  -- ^ The maximum number of execution memory allowed to be used in a single transaction
  , _protocolParamsMaxTxExSteps :: !Quantity
  -- ^ The maximum number of execution steps allowed to be used in a single transaction
  , _protocolParamsMaxBlockExMem :: !Quantity
  -- ^ The maximum number of execution memory allowed to be used in a single block
  , _protocolParamsMaxBlockExSteps :: !Quantity
  -- ^ The maximum number of execution steps allowed to be used in a single block
  , _protocolParamsMaxValSize :: !Quantity
  -- ^ The maximum Val size
  , _protocolParamsCollateralPercent :: !Integer
  -- ^ The percentage of the transactions fee which must be provided as collateral when including non-native scripts
  , _protocolParamsMaxCollateralInputs :: !Integer
  -- ^ The maximum number of collateral inputs allowed in a transaction
  , _protocolParamsCoinsPerUtxoSize :: !Lovelaces
  -- ^ The cost per UTxO size. Cost per UTxO *word* for Alozno. Cost per UTxO *byte* for Babbage and later
  , _protocolParamsCoinsPerUtxoWord :: !Lovelaces
  -- ^ The cost per UTxO word (DEPRECATED)
  , _protocolParamsCommitteeMaxTermLength :: !Quantity
  , _protocolParamsCommitteeMinSize :: !Quantity
  , _protocolParamsGovActionDeposit :: !Lovelaces
  , _protocolParamsDrepDeposit :: !Lovelaces
  -- ^ drep_deposit
  , _protocolParamsDrepActivity :: !Quantity
  -- ^ drep_activity
  , _protocolParamsGovActionLifetime :: !Quantity
  -- ^ gov_action_lifetime
  -- "pvt_motion_no_confidence": 0.6,
  , _protocolParamsPvtMotionNoConfidence :: !Rational
  , -- "pvt_committee_normal": 0.6,
    _protocolParamsPvtCommitteeNormal :: !Rational
  , -- "pvt_committee_no_confidence": 0.51,
    _protocolParamsPvtCommitteeNoConfidence :: !Rational
  , -- "pvt_hard_fork_initiation": 0.51,
    _protocolParamsPvtHardForkInitiation :: !Rational
  , -- "dvt_motion_no_confidence": 0.67,
    _protocolParamsDvtMotionNoConfidence :: !Rational
  , -- "dvt_committee_normal": 0.67,
    _protocolParamsDvtCommitteeNormal :: !Rational
  , -- "dvt_committee_no_confidence": 0.6,
    _protocolParamsDvtCommitteeNoConfidence :: !Rational
  , -- "dvt_update_to_constitution": 0.75,
    _protocolParamsDvtUpdateToConstitution :: !Rational
  , -- "dvt_hard_fork_initiation": 0.6,
    _protocolParamsDvtHardForkInitiation :: !Rational
  , -- "dvt_p_p_network_group": 0.67,
    _protocolParamsDvtP_PNetworkGroup :: !Rational
  , -- "dvt_p_p_economic_group": 0.67,
    _protocolParamsDvtP_PEconomicGroup :: !Rational
  , -- "dvt_p_p_technical_group": 0.67,
    _protocolParamsDvtP_PTechnicalGroup :: !Rational
  , -- "dvt_p_p_gov_group": 0.75,
    _protocolParamsDvtP_PGovGroup :: !Rational
  , -- "dvt_treasury_withdrawal": 0.67,
    _protocolParamsDvtTreasuryWithdrawal :: !Rational
  }
  deriving stock (Show, Eq, Generic)
  deriving
    (FromJSON, ToJSON)
    via CustomJSON '[FieldLabelModifier '[StripPrefix "_protocolParams", CamelToSnake]] ProtocolParams

--

-- | Information about an epoch
newtype CostModels = CostModels {unCostModels :: Map Text (Map Text Integer)}
  deriving (Eq, Show, Generic)

instance ToJSON CostModels where
  toJSON =
    object
      . map
        ( bimap
            (Data.Aeson.Key.fromString . show)
            (object . map (bimap Data.Aeson.Key.fromText toJSON) . Data.Map.toList)
        )
      . Data.Map.toList
      . unCostModels

instance FromJSON CostModels where
  parseJSON = withObject "CostModel" $ \o -> do
    let parseParams = withObject "CostModelParams" $ \po -> do
          mapM (parseJSON . toJSON) $ Data.Aeson.KeyMap.toList po

    langs <-
      mapM
        ( \(kLang, vParams) -> do
            l <-
              parseJSON
                $ toJSON
                $ ( \case
                      [] -> fail "Absurd empty language in CostModels"
                      (x : xs) -> Data.Char.toLower x : xs
                  )
                $ Data.Aeson.Key.toString kLang
            ps <- parseParams vParams
            pure (l, Data.Map.fromList ps)
        )
        $ Data.Aeson.KeyMap.toList o

    pure $ CostModels $ Data.Map.fromList langs
