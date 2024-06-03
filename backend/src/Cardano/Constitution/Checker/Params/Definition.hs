{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE ViewPatterns #-}

module Cardano.Constitution.Checker.Params.Definition where

import Blockfrost.Client (unQuantity)
import Cardano.Constitution.Checker.Blockfrost
import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Data.List (sortOn)
import Data.Text (Text)
import Prelude hiding (Rational)

import qualified Data.Map as Map

txFeePerByte :: Param (Identity Integer)
txFeePerByte =
  Scalar @Integer
    0
    "txFeePerByte"
    -- 44
    [ ("TFPB-01", "txFeePerByte must not be lower than 30 (0.000030 ada)") `MustNotBe` NL 30
    , ("TFPB-02", "txFeePerByte must not exceed 1,000 (0.001 ada)") `MustNotBe` NG 1_000
    , ("TFPB-03", "txFeePerByte must not be negative") `MustNotBe` NL 0
    ]

txFeeFixed :: Param (Identity Integer)
txFeeFixed =
  Scalar @Integer
    1
    "txFeeFixed"
    -- 155_381
    [ ("TFF-01", "txFeeFixed must not be lower than 100,000 (0.1 ada)") `MustNotBe` NL 100_000
    , ("TFF-02", "txFeeFixed must not exceed 10,000,000 (10 ada)") `MustNotBe` NG 10_000_000
    , ("TFF-03", "txFeeFixed must not be negative") `MustNotBe` NL 0
    ]

utxoCostPerByte :: Param (Identity Integer)
utxoCostPerByte =
  Scalar @Integer
    17
    "utxoCostPerByte"
    -- 4_310
    [ ("UCPB-01", "utxoCostPerByte must not be lower than 3,000 (0.003 ada)") `MustNotBe` NL 3_000
    , ("UCPB-02", "utxoCostPerByte must not exceed 6,500 (0.0065 ada)") `MustNotBe` NG 6_500
    , ("UCPB-03", "utxoCostPerByte must not be set to 0") `MustNotBe` NEQ 0
    , ("UCPB-04", "utxoCostPerByte must not be negative") `MustNotBe` NL 0
    ]

stakeAddressDeposit :: Param (Identity Integer)
stakeAddressDeposit =
  Scalar @Integer
    5
    "stakeAddressDeposit"
    -- 2_000_000
    [ ("SAD-01", "stakeAddressDeposit must not be lower than 1,000,000 (1 ada)") `MustNotBe` NL 1_000_000
    , ("SAD-02", "stakeAddressDeposit must not exceed 5,000,000 (5 ada)") `MustNotBe` NG 5_000_000
    , ("SAD-03", "stakeAddressDeposit must not be negative") `MustNotBe` NL 0
    ]

stakePoolDeposit :: Param (Identity Integer)
stakePoolDeposit =
  Scalar @Integer
    6
    "stakePoolDeposit"
    -- 500_000_000
    [ ("SPD-01", "stakePoolDeposit must not be lower than 250,000,000 (250 ada)") `MustNotBe` NL 250_000_000
    , ("SPD-02", "stakePoolDeposit must not exceed 500,000,000 (500 ada)") `MustNotBe` NG 500_000_000
    , ("SDP-03", "stakePoolDeposit must not be negative") `MustNotBe` NL 0
    ]

minPoolCost :: Param (Identity Integer)
minPoolCost =
  Scalar @Integer
    16
    "minPoolCost"
    -- 170_000_000
    [ ("MPC-01", "minPoolCost must not be negative") `MustNotBe` NL 0
    , ("MPC-02", "minPoolCost must not exceed 500,000,000 (500 ada)") `MustNotBe` NG 500_000_000
    ]

treasuryCut :: Param (Identity Rational)
treasuryCut =
  Scalar @Rational
    11
    "treasuryCut"
    -- 0.3
    [ ("TC-01", "treasuryCut must not be lower than 0.1 (10%)") `MustNotBe` NL 0.1
    , ("TC-02", "treasuryCut must not exceed 0.3 (30%)") `MustNotBe` NG 0.3
    , ("TC-03", "treasuryCut must not be negative") `MustNotBe` NL 0
    , ("TC-04", "treasuryCut must not exceed 1.0 (100%)") `MustNotBe` NG 1.0
    ]

monetaryExpansion :: Param (Identity Rational)
monetaryExpansion =
  Scalar @Rational
    10
    "monetaryExpansion"
    -- 0.003
    [ ("ME-01", "monetaryExpansion must not exceed 0.005") `MustNotBe` NG 0.005
    , ("ME-02", "monetaryExpansion must not be lower than 0.001") `MustNotBe` NL 0.001
    , ("ME-03", "monetaryExpansion must not be negative") `MustNotBe` NL 0
    ]

executionUnitPrices :: Param [Rational]
executionUnitPrices =
  Collection @Rational
    19
    "executionUnitPrices"
    [ Scalar
        0
        "priceMemory"
        -- (577 % 10_000)
        [ ("EIUP-PM-01", "executionUnitPrices[priceMemory] must not exceed 2_000 / 10_000") `MustNotBe` NG (2_000 % 10_000)
        , ("EIUP-PM-02", "executionUnitPrices[priceMemory] must not be lower than 400 / 10_000") `MustNotBe` NL (400 % 10_000)
        ]
    , Scalar
        1
        "priceSteps"
        -- (721 % 10_000_000)
        [ ("EIUP-PS-01", "executionUnitPrices[priceSteps] must not exceed 2,000 / 10,000,000") `MustNotBe` NG (2_000 % 10_000_000)
        , ("EIUP-PS-02", "executionUnitPrices[priceSteps] must not be lower than 500 / 10,000,000") `MustNotBe` NL (500 % 10_000_000)
        ]
    ]

minFeeRefScriptCoinsPerByte :: Param (Identity Integer)
minFeeRefScriptCoinsPerByte =
  Scalar @Integer
    33
    "minFeeRefScriptCoinsPerByte"
    -- 1
    [ ("MFRS-01", "minFeeRefScriptCoinsPerByte must not exceed 1,000 (0.001 ada)") `MustNotBe` NG 1_000
    , ("MFRS-02", "minFeeRefScriptCoinsPerByte must not be negative") `MustNotBe` NL 0
    ]

maxBlockBodySize :: Param (Identity Integer)
maxBlockBodySize =
  Scalar @Integer
    2
    "maxBlockBodySize"
    -- 90_112
    [ ("MBBS-01", "maxBlockBodySize must not exceed 122,880 Bytes (120KB)") `MustNotBe` NG 122_880
    , ("MBBS-02", "maxBlockBodySize must not be lower than 24,576 Bytes (24KB)") `MustNotBe` NL 24_576
    ]

maxTxSize :: Param (Identity Integer)
maxTxSize =
  Scalar @Integer
    3
    "maxTxSize"
    -- 16_384
    [ ("MTS-01", "maxTxSize must not exceed 32,768 Bytes (32KB)") `MustNotBe` NG 32_768
    , ("MTS-02", "maxTxSize must not be negative") `MustNotBe` NL 0
    ]

maxBlockExecutionUnits :: Param [Integer]
maxBlockExecutionUnits =
  Collection @Integer
    21
    "maxBlockExecutionUnits"
    [ Scalar
        0
        "memory"
        [ ("MBEU-M-01", "maxBlockExecutionUnits[memory] must not exceed 120,000,000 units") `MustNotBe` NG 120_000_000
        , ("MBEU-M-02", "maxBlockExecutionUnits[memory] must not be negative") `MustNotBe` NL 0
        ]
    , Scalar
        1
        "steps"
        [ ("MBEU-S-01", "maxBlockExecutionUnits[steps] must not exceed 40,000,000,000 (40Bn) units") `MustNotBe` NG 40_000_000_000
        , ("MBEU-S-02", "maxBlockExecutionUnits[steps] must not be negative") `MustNotBe` NL 0
        ]
    ]

maxTxExecutionUnits :: Param [Integer]
maxTxExecutionUnits =
  Collection
    20
    "maxTxExecutionUnits"
    [ Scalar
        0
        "mem"
        -- 20_000_000
        [ ("MTEU-M-01", "maxTxExecutionUnits[memory] must not exceed 40,000,000 units") `MustNotBe` NG 40_000_000
        , ("MTEU-M-02", "maxTxExecutionUnits[memory] must not be negative") `MustNotBe` NL 0
        ]
    , Scalar
        1
        "steps"
        -- 10_000_000_000
        [ ("MTEU-S-01", "maxTxExecutionUnits[steps] must not exceed 15,000,000,000 (15Bn) units") `MustNotBe` NG 15_000_000_000
        , ("MTEU-S-02", "maxTxExecutionUnits[steps] must not be negative") `MustNotBe` NL 0
        ]
    ]

maxBlockHeaderSize :: Param (Identity Integer)
maxBlockHeaderSize =
  Scalar @Integer
    4
    "maxBlockHeaderSize"
    -- 1_100
    [ ("MBHS-01", "maxBlockHeaderSize must not exceed 5,000 Bytes") `MustNotBe` NG 5_000
    , ("MBHS-02", "maxBlockHeaderSize must not be negative") `MustNotBe` NL 0
    ]

stakePoolTargetNum :: Param (Identity Integer)
stakePoolTargetNum =
  Scalar @Integer
    8
    "stakePoolTargetNum"
    -- 500
    [ ("SPTN-01", "stakePoolTargetNum must not be lower than 250") `MustNotBe` NL 250
    , ("SPTN-02", "stakePoolTargetNum must not exceed 2,000") `MustNotBe` NG 2_000
    , ("SPTN-03", "stakePoolTargetNum must not be negative") `MustNotBe` NL 0
    , ("SPTN-04", "stakePoolTargetNum must not be zero") `MustNotBe` NEQ 0
    ]

poolPledgeInfluence :: Param (Identity Rational)
poolPledgeInfluence =
  Scalar @Rational
    9
    "poolPledgeInfluence"
    -- 0.3
    [ ("PPI-01", "poolPledgeInfluence must not be lower than 0.1") `MustNotBe` NL (1 % 10)
    , ("PPI-02", "poolPledgeInfluence must not exceed 1.0") `MustNotBe` NG (10 % 10)
    , ("PPI-03", "poolPledgeInfluence must not be negative") `MustNotBe` NL 0
    ]

poolRetireMaxEpoch :: Param (Identity Integer)
poolRetireMaxEpoch =
  Scalar @Integer
    7
    "poolRetireMaxEpoch"
    -- 18
    [ ("PRME-01", "poolRetireMaxEpoch must not be negative") `MustNotBe` NL 0
    ]

collateralPercentage :: Param (Identity Integer)
collateralPercentage =
  Scalar @Integer
    23
    "collateralPercentage"
    -- 150
    [ ("CP-01", "collateralPercentage must not be lower than 100") `MustNotBe` NL 100
    , ("CP-02", "collateralPercentage must not exceed 200") `MustNotBe` NG 200
    , ("CP-03", "collateralPercentage must not be negative") `MustNotBe` NL 0
    , ("CP-04", "collateralPercentage must not be set to 0") `MustNotBe` NEQ 0
    ]

maxCollateralInputs :: Param (Identity Integer)
maxCollateralInputs =
  Scalar @Integer
    24
    "maxCollateralInputs"
    -- 3
    [ ("MCI-01", "maxCollateralInputs must not be lower than 1") `MustNotBe` NL 1
    ]

maxValueSize :: Param (Identity Integer)
maxValueSize =
  Scalar @Integer
    22
    "maxValueSize"
    -- 5_000
    [ ("MVS-01", "maxValueSize must not exceed 12,288 Bytes (12KB)") `MustNotBe` NG 12_288
    , ("MVS-02", "maxValueSize must not be negative") `MustNotBe` NL 0
    ]

govDeposit :: Param (Identity Integer)
govDeposit =
  Scalar @Integer
    30
    "govDeposit"
    -- 1_000_000
    [ ("GD-01", "govDeposit must not be negative") `MustNotBe` NL 0
    , ("GD-02", "govDeposit must not be lower than 1,000,000 (1 ada)") `MustNotBe` NL 1_000_000
    , ("GD-03", "govDeposit must not exceed 10,000,000,000,000 (10 Million ada)") `MustNotBe` NG 10_000_000_000_000
    ]

dRepDeposit :: Param (Identity Integer)
dRepDeposit =
  Scalar @Integer
    31
    "dRepDeposit"
    -- 1_000_000
    [ ("DRD-01", "dRepDeposit must not be negative") `MustNotBe` NL 0
    , ("DRD-02", "dRepDeposit must not be lower than 1,000,000 (1 ada)") `MustNotBe` NL 1_000_000
    , ("DRD-03", "dRepDeposit must be no more than 100,000,000,000 (100,000 ada)") `MustNotBe` NG 100_000_000_000
    ]

dRepActivity :: Param (Identity Integer)
dRepActivity =
  Scalar @Integer
    32
    "dRepActivity"
    -- 25
    [ ("DRA-01", "dRepActivity must not be lower than 13 epochs (2 months)") `MustNotBe` NL 13
    , ("DRA-02", "dRepActivity must not exceed 37 epochs (6 months)") `MustNotBe` NG 37
    , ("DRA-03", "dRepActivity must not be negative") `MustNotBe` NL 0
    ]

poolVotingThresholds :: Param [Rational]
poolVotingThresholds =
  Collection @Rational
    25
    "poolVotingThresholds"
    [ Scalar
        0
        "motionNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-NC-01", "No confidence action thresholds must be in the range 51%-75%")
            `MustNotBe` NL (51 % 100)
        , ("VT-NC-01b", "No confidence action thresholds must be in the range 51%-75%") `MustNotBe` NG (75 % 100)
        ]
    , Scalar
        1
        "committeeNormal"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustNotBe` NL (65 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustNotBe` NG (90 % 100)
        ]
    , Scalar
        2
        "committeeNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustNotBe` NL (65 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustNotBe` NG (90 % 100)
        ]
    , Scalar
        3
        "hardForkInitiation"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-HF-01", "Hard fork action thresholds must be in the range 51%-80%")
            `MustNotBe` NL (51 % 100)
        , ("VT-HF-01b", "Hard fork action thresholds must be in the range 51%-80%")
            `MustNotBe` NG (80 % 100)
        ]
    , Scalar
        4
        "ppSecurityGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        ]
    ]

dRepVotingThresholds :: Param [Rational]
dRepVotingThresholds =
  Collection @Rational
    26
    "dRepVotingThresholds"
    [ Scalar
        0
        "motionNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-NC-01", "No confidence action thresholds must be in the range 51%-75%") `MustNotBe` NL (51 % 100)
        , ("VT-NC-01b", "No confidence action thresholds must be in the range 51%-75%") `MustNotBe` NG (75 % 100)
        ]
    , Scalar
        1
        "committeeNormal"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 65%-90%") `MustNotBe` NL (65 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 65%-90%") `MustNotBe` NG (90 % 100)
        ]
    , Scalar
        2
        "committeeNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 65%-90%") `MustNotBe` NL (65 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 65%-90%") `MustNotBe` NG (90 % 100)
        ]
    , Scalar
        3
        "updateConstitution"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-CON-01", "Update Constitution or proposal policy action thresholds must be in the range 65%-90%") `MustNotBe` NL (65 % 100)
        , ("VT-CON-01b", "Update Constitution or proposal policy action thresholds must be in the range 65%-90%") `MustNotBe` NG (90 % 100)
        ]
    , Scalar
        4
        "hardForkInitiation"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-HF-01", "Hard fork action thresholds must be in the range 51%-80%") `MustNotBe` NL (51 % 100)
        , ("VT-HF-01b", "Hard fork action thresholds must be in the range 51%-80%") `MustNotBe` NG (80 % 100)
        ]
    , Scalar
        5
        "ppNetworkGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-GEN-02", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustNotBe` NL (51 % 100)
        , ("VT-GEN-02b", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustNotBe` NG (75 % 100)
        ]
    , Scalar
        6
        "ppEconomicGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-GEN-02", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustNotBe` NL (51 % 100)
        , ("VT-GEN-02b", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustNotBe` NG (75 % 100)
        ]
    , Scalar
        7
        "ppTechnicalGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-GEN-02", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustNotBe` NL (51 % 100)
        , ("VT-GEN-02b", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustNotBe` NG (75 % 100)
        ]
    , Scalar
        8
        "ppGovernanceGroup"
        -- (4 % 5)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        , ("VT-GOV-01", "Governance parameter thresholds must be in the range 75%-90%") `MustNotBe` NL (75 % 100)
        , ("VT-GOV-01b", "Governance parameter thresholds must be in the range 75%-90%") `MustNotBe` NG (90 % 100)
        ]
    , Scalar
        9
        "treasuryWithdrawal"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustNotBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustNotBe` NG (1 % 1)
        ]
    ]

govActionLifetime :: Param (Identity Integer)
govActionLifetime =
  Scalar @Integer
    29
    "govActionLifetime"
    -- 5
    [ ("GAL-01", "govActionLifetime must not be lower than 1 epoch (5 days)") `MustNotBe` NL 1
    , ("GAL-02", "govActionLifetime must not be greater than 15 epochs (75 days)") `MustNotBe` NG 15
    , ("GAL-05", "govActionLifetime must be less than dRepActivity")
        `ShouldSatisfy` \(byName -> findInteger "dRepActivity" -> dRepActivityM) val ->
          case dRepActivityM of
            Just dRepActivity'
              | val < dRepActivity' -> Satisfied
              | otherwise -> Unsatisfied "govActionLifetime must be less than dRepActivity"
            Nothing -> Unsatisfied "dRepActivity not found"
    ]

committeeMaxTermLimit :: Param (Identity Integer)
committeeMaxTermLimit =
  Scalar @Integer
    28
    "committeeMaxTermLimit"
    -- 50
    [ ("CMTL-01", "committeeMaxTermLimit must not be zero") `MustNotBe` NEQ 0
    , ("CMTL-02", "committeeMaxTermLimit must not be negative") `MustNotBe` NL 0
    , ("CMTL-03", "committeeMaxTermLimit must not be lower than 18 epochs (90 days, or approximately 3 months)") `MustNotBe` NL 18
    , ("CMTL-04", "committeeMaxTermLimit must not exceed 293 epochs (approximately 4 years)") `MustNotBe` NG 293
    ]

committeeMinSize :: Param (Identity Integer)
committeeMinSize =
  Scalar @Integer
    27
    "committeeMinSize"
    -- 3
    [ ("CMS-01", "committeeMinSize must not be negative") `MustNotBe` NL 0
    , ("CMS-02", "committeeMinSize must not be lower than 3") `MustNotBe` NL 3
    , ("CMS-03", "committeeMinSize must not exceed 10") `MustNotBe` NG 10
    ]

costModels :: Param (Maybe PV1, Maybe PV2, Maybe PV3)
costModels = CostModels 18 [] [] []

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

scalarX :: (ProtocolParams -> a) -> ProtocolParams -> Identity Integer
scalarX = undefined

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
