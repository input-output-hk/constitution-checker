{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards #-}

module Cardano.Constitution.Checker.Params.Definition (
  module X,
  allParamsWithCurrentValues,
  allParams,
) where

import Blockfrost.Client (unQuantity)
import Cardano.Constitution.Checker.Blockfrost.Base
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Data.List (sortOn)
import Data.Text (Text)
import Prelude hiding (Rational)

import Cardano.Constitution.Checker.Params.Definition.CollateralPercentage as X
import Cardano.Constitution.Checker.Params.Definition.CommitteeMaxTermLimit as X
import Cardano.Constitution.Checker.Params.Definition.CommitteeMinSize as X
import Cardano.Constitution.Checker.Params.Definition.CostModels as X
import Cardano.Constitution.Checker.Params.Definition.DRepActivity as X
import Cardano.Constitution.Checker.Params.Definition.DRepDeposit as X
import Cardano.Constitution.Checker.Params.Definition.DRepVotingThresholds as X
import Cardano.Constitution.Checker.Params.Definition.ExecutionUnitPrices as X
import Cardano.Constitution.Checker.Params.Definition.GovActionLifetime as X
import Cardano.Constitution.Checker.Params.Definition.GovDeposit as X
import Cardano.Constitution.Checker.Params.Definition.MaxBlockBodySize as X
import Cardano.Constitution.Checker.Params.Definition.MaxBlockExecutionUnits as X
import Cardano.Constitution.Checker.Params.Definition.MaxBlockHeaderSize as X
import Cardano.Constitution.Checker.Params.Definition.MaxCollateralInputs as X
import Cardano.Constitution.Checker.Params.Definition.MaxTxExecutionUnits as X
import Cardano.Constitution.Checker.Params.Definition.MaxTxSize as X
import Cardano.Constitution.Checker.Params.Definition.MaxValueSize as X
import Cardano.Constitution.Checker.Params.Definition.MinFeeRefScriptCoinsPerByte as X
import Cardano.Constitution.Checker.Params.Definition.MinPoolCost as X
import Cardano.Constitution.Checker.Params.Definition.MonetaryExpansion as X
import Cardano.Constitution.Checker.Params.Definition.PoolPledgeInfluence as X
import Cardano.Constitution.Checker.Params.Definition.PoolRetireMaxEpoch as X
import Cardano.Constitution.Checker.Params.Definition.PoolVotingThresholds as X
import Cardano.Constitution.Checker.Params.Definition.StakeAddressDeposit as X
import Cardano.Constitution.Checker.Params.Definition.StakePoolDeposit as X
import Cardano.Constitution.Checker.Params.Definition.StakePoolTargetNum as X
import Cardano.Constitution.Checker.Params.Definition.TreasuryCut as X
import Cardano.Constitution.Checker.Params.Definition.TxFeeFixed as X
import Cardano.Constitution.Checker.Params.Definition.TxFeePerByte as X
import Cardano.Constitution.Checker.Params.Definition.UtxoCostPerByte as X

import qualified Data.Map as Map

allParams :: [Param']
allParams = map fromParamWithCurrentValues allParamsWithCurrentValues

_fakeFetcher :: (Monoid_ a) => b -> a
_fakeFetcher _ = unsure'

class Monoid_ a where
  unsure' :: a

instance Monoid_ Integer where
  unsure' = -1

instance Monoid_ Rational where
  unsure' = -1

instance (Monoid_ a) => Monoid_ (Identity a) where
  unsure' = Identity unsure'

instance (Monoid_ a) => Monoid_ [a] where
  unsure' = []

allParamsWithCurrentValues :: [ParamWithCurrentValue]
allParamsWithCurrentValues =
  [ ParamWithCurrentValue
      txFeePerByte
      -- OK
      (Identity . _protocolParamsMinFeeA)
  , --
    ParamWithCurrentValue
      txFeeFixed
      -- OK
      (Identity . _protocolParamsMinFeeB)
  , --
    ParamWithCurrentValue
      utxoCostPerByte
      -- OK
      (Identity . fromIntegral . _protocolParamsCoinsPerUtxoWord)
  , --
    ParamWithCurrentValue
      maxBlockBodySize
      -- OK
      (Identity . _protocolParamsMaxBlockSize)
  , --
    ParamWithCurrentValue
      maxTxSize
      -- OK
      (Identity . _protocolParamsMaxTxSize)
  , --
    ParamWithCurrentValue
      maxBlockHeaderSize
      -- OK
      (Identity . _protocolParamsMaxBlockHeaderSize)
  , --
    ParamWithCurrentValue
      minPoolCost
      -- OK
      (Identity . fromIntegral . _protocolParamsMinPoolCost)
  , --
    ParamWithCurrentValue
      maxValueSize
      -- OK
      (Identity . unQuantity . _protocolParamsMaxValSize)
  , --
    ParamWithCurrentValue
      collateralPercentage
      -- OK
      (Identity . _protocolParamsCollateralPercent)
  , --
    ParamWithCurrentValue
      maxCollateralInputs
      -- OK
      (Identity . _protocolParamsMaxCollateralInputs)
  , --
    ParamWithCurrentValue
      stakeAddressDeposit
      -- OK
      (Identity . fromIntegral . _protocolParamsKeyDeposit)
  , --
    ParamWithCurrentValue
      stakePoolDeposit
      -- OK
      (Identity . fromIntegral . _protocolParamsPoolDeposit)
  , --
    ParamWithCurrentValue
      poolRetireMaxEpoch
      -- OK
      (Identity . _protocolParamsEMax)
  , ParamWithCurrentValue
      stakePoolTargetNum
      -- OK
      (Identity . _protocolParamsNOpt)
  , --
    ParamWithCurrentValue
      poolPledgeInfluence
      -- OK
      (Identity . MkRational . _protocolParamsA0)
  , --
    ParamWithCurrentValue minFeeRefScriptCoinsPerByte $
      const unsure'
  , --
    ParamWithCurrentValue
      govDeposit
      -- not sure
      (Identity . fromIntegral . _protocolParamsGovActionDeposit)
  , --
    ParamWithCurrentValue
      dRepDeposit
      (Identity . fromIntegral . _protocolParamsDrepDeposit)
  , --
    ParamWithCurrentValue
      dRepActivity
      (Identity . unQuantity . _protocolParamsDrepActivity)
  , --
    ParamWithCurrentValue
      govActionLifetime
      (Identity . unQuantity . _protocolParamsGovActionLifetime)
  , --
    ParamWithCurrentValue
      committeeMaxTermLimit
      -- OK
      (Identity . unQuantity . _protocolParamsCommitteeMaxTermLength)
  , --
    ParamWithCurrentValue
      committeeMinSize
      -- OK
      (Identity . unQuantity . _protocolParamsCommitteeMinSize)
  , --
    ParamWithCurrentValue
      monetaryExpansion
      -- OK
      (Identity . MkRational . _protocolParamsRho)
  , --
    ParamWithCurrentValue
      treasuryCut
      -- OK
      (Identity . MkRational . _protocolParamsTau)
  , --
    ParamWithCurrentValue poolVotingThresholds $ \ProtocolParams{..} ->
      map
        MkRational
        [ _protocolParamsPvtMotionNoConfidence
        , _protocolParamsPvtCommitteeNormal
        , _protocolParamsPvtCommitteeNoConfidence
        , _protocolParamsPvtHardForkInitiation
        ]
        ++ [unsure']
  , --
    ParamWithCurrentValue dRepVotingThresholds $ \ProtocolParams{..} ->
      map
        MkRational
        [ _protocolParamsDvtMotionNoConfidence
        , _protocolParamsDvtCommitteeNormal
        , _protocolParamsDvtCommitteeNoConfidence
        , _protocolParamsDvtUpdateToConstitution
        , _protocolParamsDvtHardForkInitiation
        , _protocolParamsDvtP_PNetworkGroup
        , _protocolParamsDvtP_PEconomicGroup
        , _protocolParamsDvtP_PTechnicalGroup
        , _protocolParamsDvtP_PGovGroup
        , _protocolParamsDvtTreasuryWithdrawal
        ]
  , --
    ParamWithCurrentValue executionUnitPrices $ \ProtocolParams{..} ->
      map MkRational [_protocolParamsPriceMem, _protocolParamsPriceStep]
  , --
    ParamWithCurrentValue maxBlockExecutionUnits $ \ProtocolParams{..} ->
      -- OK
      map unQuantity [_protocolParamsMaxBlockExMem, _protocolParamsMaxBlockExSteps]
  , --
    ParamWithCurrentValue maxTxExecutionUnits $ \ProtocolParams{..} ->
      -- OK
      map unQuantity [_protocolParamsMaxTxExMem, _protocolParamsMaxTxExSteps]
  , ParamWithCurrentValue costModels $ \ProtocolParams{..} ->
      let m = unCostModels _protocolParamsCostModels
          p1 = toValues <$> Map.lookup "plutusV1" m
          p2 = toValues <$> Map.lookup "plutusV2" m
          p3 = toValues <$> Map.lookup "plutusV3" m

          toValues :: Map.Map Text Integer -> [Integer]
          toValues kv = map snd $ sortOn fst $ Map.toList kv
       in (p1, p2, p3)
  ]
