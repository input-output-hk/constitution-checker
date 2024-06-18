{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxTxSize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxTxSize :: Param (Identity Integer)
maxTxSize =
  Scalar @Integer
    3
    "maxTxSize"
    -- 16_384
    [ ("MTS-01", "maxTxSize must not exceed 32,768 Bytes (32KB)") `MustBe` NG 32_768
    , ("MTS-02", "maxTxSize must not be negative") `MustBe` NL 0
    , ("MTS-03", "*maxTxSize* **must not** be decreased") `ShouldSatisfy` \ctx val ->
        case ctx.currentValues.byName.getInteger "maxTxSize" of
          Just maxTxSize'
            | val >= maxTxSize' -> Satisfied
            | otherwise -> Unsatisfied "maxTxSize must not be decreased"
          Nothing -> Unsatisfied "maxTxSize not found"
    , ("MTS-04", "*maxTxSize* **must not** exceed *maxBlockBodySize*") `ShouldSatisfy` \ctx val ->
        case ctx.merged.byName.getInteger "maxBlockBodySize" of
          Just maxBlockBodySize'
            | val <= maxBlockBodySize' -> Satisfied
            | otherwise -> Unsatisfied "maxTxSize must not exceed maxBlockBodySize"
          Nothing -> Unsatisfied "maxBlockBodySize not found"
    , ( "MTS-05"
      , "*maxTxSize* **should not** be increased by more than 2,560 Bytes (2.5KB) in any epoch"
          ++ " and preferably **should** be increased by 2,048 Bytes (2KB) or less per epoch"
      )
        `ShouldSatisfy` \ctx val ->
          Neutral "Please contribute to the check"
    , ("MTS-06", "*maxTxSize* **should not** exceed 1/4 of the block size") `ShouldSatisfy` \ctx val ->
        Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
