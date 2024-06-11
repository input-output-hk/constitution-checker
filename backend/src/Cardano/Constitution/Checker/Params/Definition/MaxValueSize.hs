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
    ]
