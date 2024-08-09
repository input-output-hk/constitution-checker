{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxBlockExecutionUnits where

import Cardano.Constitution.Checker.Params.Definition.Base
import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types

import qualified Data.Map as Map

import Prelude hiding (Rational)

maxBlockExecutionUnits :: Param [Integer]
maxBlockExecutionUnits =
  Collection @Integer
    21
    "maxBlockExecutionUnits"
    [ Scalar
        0
        "memory"
        [ ("MBEU-M-01", "maxBlockExecutionUnits[memory] must not exceed 120,000,000 units") `MustBe` NG 120_000_000
        , ("MBEU-M-02", "maxBlockExecutionUnits[memory] must not be negative") `MustBe` NL 0
        , ("MBEU-M-03", "maxBlockExecutionUnits[memory] should not be changed (increased or decreased) by more than 10,000,000 units in any epoch") `ShouldSatisfy` \ctx val ->
            case Map.lookup "mem" $ ctx.merged.byName.getIntegers "maxBlockExecutionUnits" of
              Nothing -> Unsatisfied "maxBlockExecutionUnits[memory] not found"
              Just maxBlockExecutionUnitsMem' ->
                if abs (val - maxBlockExecutionUnitsMem') <= 10_000_000
                  then Satisfied
                  else Unsatisfied $ "maxBlockExecutionUnits[memory] should not be changed (increased or decreased) by more than 10,000,000 units in any epoch. Your change was for " <> show (abs (val - maxBlockExecutionUnitsMem')) <> " units."
        , ("MBEU-M-04", "The impact of any change to maxBlockExecutionUnits[memory] must be confirmed by detailed benchmarking/simulation and not exceed the requirements of the diffusion/propagation time budgets, as also impacted by (maxBlockExecutionUnits[steps]).") `ShouldSatisfy` \ctx val ->
            Neutral "Please contribute to this check."
        , ("MEU-M-01", "maxBlockExecutionUnits[memory] must not be less than maxTxExecutionUnits[memory]") `ShouldSatisfy` \ctx val ->
            case Map.lookup "mem" $ ctx.merged.byName.getIntegers "maxTxExecutionUnits" of
              Nothing -> Unsatisfied "maxTxExecutionUnits[memory] not found"
              Just maxTxExecutionUnitsMem' ->
                if val >= maxTxExecutionUnitsMem'
                  then Satisfied
                  else Unsatisfied "maxBlockExecutionUnits[memory] must not be less than maxTxExecutionUnits[memory]"
        , ("NETWORK-01", "No individual network parameter **should** change more than once per two epochs")
            `ShouldSatisfy` network01Check "maxBlockExecutionUnits" "memory"
        , ("NETWORK-02", "Only one network parameter **should** be changed per epoch unless they are directly correlated")
            `ShouldSatisfy` network02Check "maxBlockExecutionUnits" "memory" maxBlockExecutionUnitsNames
        ]
    , Scalar
        1
        "steps"
        [ ("MBEU-S-01", "maxBlockExecutionUnits[steps] must not exceed 40,000,000,000 (40Bn) units") `MustBe` NG 40_000_000_000
        , ("MBEU-S-02", "maxBlockExecutionUnits[steps] must not be negative") `MustBe` NL 0
        , ("MBEU-S-03", "maxBlockExecutionUnits[steps] should not be changed (increased or decreased) by more than 2,000,000,000 (2Bn) units in any epoch (5 days)") `ShouldSatisfy` \ctx val ->
            case Map.lookup "steps" $ ctx.merged.byName.getIntegers "maxBlockExecutionUnits" of
              Nothing -> Unsatisfied "maxBlockExecutionUnits[steps] not found"
              Just maxBlockExecutionUnitsSteps' ->
                if abs (val - maxBlockExecutionUnitsSteps') <= 2_000_000_000
                  then Satisfied
                  else Unsatisfied $ "maxBlockExecutionUnits[steps] should not be changed (increased or decreased) by more than 2,000,000,000 (2Bn) units in any epoch (5 days). Your change was for " <> show (abs (val - maxBlockExecutionUnitsSteps')) <> " units."
        , ("MBEU-S-04", "The impact of the change to maxBlockExecutionUnits[steps] must be confirmed by detailed benchmarking/simulation and not exceed the requirements of the block diffusion/propagation time budgets, as also impacted by maxBlockExecutionUnits[memory]. Any increase must also consider previously identified future requirements for the total block size (maxBlockBodySize) measured against the total block diffusion target of 3s with 95% block propagation within 5s. Future Plutus performance improvements may allow the per-block limit to be increased, but must be balanced against the overall diffusion limits as specified in the previous sentence, and future requirements") `ShouldSatisfy` \ctx val ->
            Neutral "Please contribute to this check."
        , ("MEU-S-01", "maxBlockExecutionUnits[steps] must not be less than maxTxExecutionUnits[steps]") `ShouldSatisfy` \ctx val ->
            case Map.lookup "steps" $ ctx.merged.byName.getIntegers "maxTxExecutionUnits" of
              Nothing -> Unsatisfied "maxTxExecutionUnits[steps] not found"
              Just maxTxExecutionUnitsSteps' ->
                if val >= maxTxExecutionUnitsSteps'
                  then Satisfied
                  else Unsatisfied "maxBlockExecutionUnits[steps] must not be less than maxTxExecutionUnits[steps]"
        , ("NETWORK-01", "No individual network parameter **should** change more than once per two epochs")
            `ShouldSatisfy` network01Check "maxBlockExecutionUnits" "steps"
        , ("NETWORK-02", "Only one network parameter **should** be changed per epoch unless they are directly correlated")
            `ShouldSatisfy` network02Check "maxBlockExecutionUnits" "steps" maxBlockExecutionUnitsNames
        ]
    ]

-- Complete as of June 12, 2024
