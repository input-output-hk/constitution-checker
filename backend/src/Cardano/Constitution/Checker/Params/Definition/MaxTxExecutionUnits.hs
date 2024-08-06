{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxTxExecutionUnits where

import Cardano.Constitution.Checker.Params.Definition.Base
import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

import qualified Data.Map as Map

maxTxExecutionUnits :: Param [Integer]
maxTxExecutionUnits =
  Collection
    20
    "maxTxExecutionUnits"
    [ Scalar
        0
        "mem"
        -- 20_000_000
        [ ("MTEU-M-01", "maxTxExecutionUnits[memory] must not exceed 40,000,000 units") `MustBe` NG 40_000_000
        , ("MTEU-M-02", "maxTxExecutionUnits[memory] must not be negative") `MustBe` NL 0
        , ("MTEU-M-03", "maxTxExecutionUnits[memory] must not be decreased") `ShouldSatisfy` \ctx val ->
            case Map.lookup "mem" $ ctx.currentValues.byName.getIntegers "maxTxExecutionUnits" of
              Just maxTxExecutionUnitsMem' ->
                if val >= maxTxExecutionUnitsMem'
                  then Satisfied
                  else Unsatisfied "maxTxExecutionUnits[memory] must not be decreased"
              Nothing -> Neutral "Critical Error: maxTxExecutionUnits[memory] not found"
        , ("MTEU-M-04", "maxTxExecutionUnits[memory] should not be increased by more than 2,500,000 units in any epoch") `ShouldSatisfy` \ctx val ->
            case Map.lookup "mem" $ ctx.currentValues.byName.getIntegers "maxTxExecutionUnits" of
              Just maxTxExecutionUnitsMem' ->
                if val - maxTxExecutionUnitsMem' <= 2_500_000
                  then Satisfied
                  else Unsatisfied "maxTxExecutionUnits[memory] should not be increased by more than 2,500,000 units in any epoch"
              Nothing -> Neutral "Critical Error: maxTxExecutionUnits[memory] not found"
        , ("NETWORK-01", "No individual network parameter **should** change more than once per two epochs")
            `ShouldSatisfy` network01Check "maxTxExecutionUnits" "mem"
        , ("NETWORK-02", "Only one network parameter **should** be changed per epoch unless they are directly correlated")
            `ShouldSatisfy` network02Check "maxTxExecutionUnits" "mem" maxTxExecutionUnitsNames
        ]
    , Scalar
        1
        "steps"
        -- 10_000_000_000
        [ ("MTEU-S-01", "maxTxExecutionUnits[steps] must not exceed 15,000,000,000 (15Bn) units") `MustBe` NG 15_000_000_000
        , ("MTEU-S-02", "maxTxExecutionUnits[steps] must not be negative") `MustBe` NL 0
        , ("MTEU-S-03", "maxTxExecutionUnits[steps] must not be decreased") `ShouldSatisfy` \ctx val ->
            case Map.lookup "steps" $ ctx.currentValues.byName.getIntegers "maxTxExecutionUnits" of
              Just maxTxExecutionUnitsSteps' ->
                if val >= maxTxExecutionUnitsSteps'
                  then Satisfied
                  else Unsatisfied "maxTxExecutionUnits[steps] must not be decreased"
              Nothing -> Neutral "Critical Error: maxTxExecutionUnits[steps] not found"
        , ("MTEU-S-04", "maxTxExecutionUnits[steps] should not be increased by more than 500,000,000 (500M) units in any epoch (5 days)") `ShouldSatisfy` \ctx val ->
            case Map.lookup "steps" $ ctx.currentValues.byName.getIntegers "maxTxExecutionUnits" of
              Just maxTxExecutionUnitsSteps' ->
                if val - maxTxExecutionUnitsSteps' <= 500_000_000
                  then Satisfied
                  else Unsatisfied "maxTxExecutionUnits[steps] should not be increased by more than 500,000,000 (500M) units in any epoch"
              Nothing -> Neutral "Critical Error: maxTxExecutionUnits[steps] not found"
        , ("MTEU-S-04", "*maxTxExecutionUnits[steps]* **should not** be increased by more than 500,000,000 (500M) units in any epoch (5 days)")
            `ShouldSatisfy` \_ _ -> Neutral "Please contribute to this check."
        , ("NETWORK-01", "No individual network parameter **should** change more than once per two epochs")
            `ShouldSatisfy` network01Check "maxTxExecutionUnits" "steps"
        , ("NETWORK-02", "Only one network parameter **should** be changed per epoch unless they are directly correlated")
            `ShouldSatisfy` network02Check "maxTxExecutionUnits" "steps" maxTxExecutionUnitsNames
        ]
    ]

-- Complete as of June 12, 2024
