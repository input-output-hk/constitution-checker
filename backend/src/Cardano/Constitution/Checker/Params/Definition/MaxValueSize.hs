{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxValueSize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxValueSize :: Param (Identity Integer)
maxValueSize =
  Scalar @Integer
    22
    "maxValueSize"
    -- 5_000
    [ ("MVS-01", "maxValueSize must not exceed 12,288 Bytes (12KB)") `MustBe` NG 12_288
    , ("MVS-02", "maxValueSize must not be negative") `MustBe` NL 0
    , ("MVS-03", "*maxValueSize* **must** be less than *maxTxSize*" ) `ShouldSatisfy` \ctx val -> 
      case ctx.merged.byName.getInteger "maxTxSize" of
        Just maxTxSize'
          | val < maxTxSize' -> Satisfied
          | otherwise -> Unsatisfied "maxValueSize must be less than maxTxSize"
        Nothing -> Unsatisfied "maxTxSize not found"
    , ("MVS-04", "*maxValueSize* **must not** be reduced") `ShouldSatisfy` \ctx val -> 
      case ctx.currentValues.byName.getInteger "maxValueSize" of
        Just maxValueSize'
          | val >= maxValueSize' -> Satisfied
          | otherwise -> Unsatisfied "maxValueSize must not be reduced"
        Nothing -> Unsatisfied "maxValueSize not found"
    , ("MVS-05", "*maxValueSize* **must** be large enough to allow sensible outputs") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
