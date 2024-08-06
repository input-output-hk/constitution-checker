{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxBlockBodySize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxBlockBodySize :: Param (Identity Integer)
maxBlockBodySize =
  Scalar @Integer
    2
    "maxBlockBodySize"
    -- 90_112
    [ ("MBBS-01", "maxBlockBodySize must not exceed 122,880 Bytes (120KB)") `MustBe` NG 122_880
    , ("MBBS-02", "maxBlockBodySize must not be lower than 24,576 Bytes (24KB)") `MustBe` NL 24_576
    , ("MBBS-03", "maxBlockBodySize must not be decreased, other than in exceptional circumstances where there are potential problems with security, performance or functionality")
        `ShouldSatisfy` \ctx val -> 
          case ctx.currentValues.byName.getInteger "maxBlockBodySize" of
            Just maxBlockBodySize'
              | val >= maxBlockBodySize' -> Satisfied
              | otherwise -> Unsatisfied "maxBlockBodySize must not be decreased"
            Nothing -> Unsatisfied "maxBlockBodySize not found"
    , ("MBBS-04", "maxBlockBodySize must be large enough to include at least one transaction (that is, maxBlockBodySize must be at least maxTxSize)") `ShouldSatisfy` \ctx val -> 
      case ctx.merged.byName.getInteger "maxTxSize" of
        Just maxTxSize'
          | val >= maxTxSize' -> Satisfied
          | otherwise -> Unsatisfied "maxBlockBodySize must be large enough to include at least one transaction"
        Nothing -> Unsatisfied "maxTxSize not found"
    , ("MBBS-05", "maxBlockBodySize should be changed by at most 10,240 Bytes (10KB) per epoch (5 days), and preferably by 8,192 Bytes (8KB) or less per epoch") `ShouldSatisfy` \ctx val ->
      case ctx.currentValues.byName.getInteger "maxBlockBodySize" of
        Just maxBlockBodySize'
          | abs (val - maxBlockBodySize') <= 10_240 -> Satisfied
          | otherwise -> Unsatisfied $ "maxBlockBodySize should be changed by at most 10,240 Bytes (10KB) per epoch (5 days). Your change was for " <> show (abs (val - maxBlockBodySize')) <> " Bytes"
        Nothing -> Unsatisfied "maxBlockBodySize not found"
    , ("MBBS-06", "The block size should not induce an additional TCP round trip.") `ShouldSatisfy` \ctx val -> Neutral "Please contribute to the check"
    , ("MBBS-07", "The impact of any change to maxBlockBodySize must be confirmed by detailed benchmarking/simulation and not exceed the requirements of the block diffusion/propagation time budgets, as described below. Any increase to maxBlockBodySize must also consider future requirements for Plutus script execution (maxBlockExecutionUnits[steps]) against the total block diffusion target of 3s with 95% block propagation within 5s. The limit on maximum block size may be increased in the future if this is supported by benchmarking and monitoring results") `ShouldSatisfy` \ctx val -> Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024