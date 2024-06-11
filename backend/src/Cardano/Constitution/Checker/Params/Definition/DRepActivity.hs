{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.DRepActivity where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

dRepActivity :: Param (Identity Integer)
dRepActivity =
  Scalar @Integer
    32
    "dRepActivity"
    -- 25
    [ ("DRA-01", "dRepActivity must not be lower than 13 epochs (2 months)") `MustBe` NL 13
    , ("DRA-02", "dRepActivity must not exceed 37 epochs (6 months)") `MustBe` NG 37
    , ("DRA-03", "dRepActivity must not be negative") `MustBe` NL 0
    , ("DRA-04", "dRepActivity must be greater than govActionLifetime") `ShouldSatisfy` \ctx val ->
      case ctx.merged.byName.getInteger "govActionLifetime" of
        Just govActionLifetime'
          | val > govActionLifetime' -> Satisfied
          | otherwise -> Unsatisfied "dRepActivity must be greater than govActionLifetime"
        Nothing -> Unsatisfied "govActionLifetime not found"
    , ("DRA-05", "dRepActivity should be calculated in human terms (2 months etc.)") `ShouldSatisfy` \_ _ ->
      Neutral "Please contribute to this check."
    ]

-- Complete as of June 12, 2024
