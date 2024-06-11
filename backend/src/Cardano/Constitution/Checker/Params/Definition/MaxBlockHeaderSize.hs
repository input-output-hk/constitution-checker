{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxBlockHeaderSize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)
import Distribution.Compat.Graph (Node(N))

maxBlockHeaderSize :: Param (Identity Integer)
maxBlockHeaderSize =
  Scalar @Integer
    4
    "maxBlockHeaderSize"
    -- 1_100
    [ ("MBHS-01", "maxBlockHeaderSize must not exceed 5,000 Bytes") `MustBe` NG 5_000
    , ("MBHS-02", "maxBlockHeaderSize must not be negative") `MustBe` NL 0
    , ("MBHS-03", "*maxBlockHeaderSize* **must** be large enough for the largest valid header") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    , ("MBHS-04", "*maxBlockHeaderSize* **should** only normally be increased if the protocol changes") `ShouldSatisfy` \ctx val -> 
      case ctx.currentValues.byName.getInteger "maxBlockHeaderSize" of
        Just maxBlockHeaderSize'
          | val >= maxBlockHeaderSize' -> Satisfied
          | otherwise -> Unsatisfied "maxBlockHeaderSize must not be decreased"
        Nothing -> Unsatisfied "maxBlockHeaderSize not found"
    , ("MBHS-05", "*maxBlockHeaderSize* **should** be within TCP's initial congestion window (3 or 10 MTUs)") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024