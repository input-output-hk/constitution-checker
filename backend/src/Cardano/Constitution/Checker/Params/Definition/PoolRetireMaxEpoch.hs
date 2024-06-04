{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.PoolRetireMaxEpoch where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

poolRetireMaxEpoch :: Param (Identity Integer)
poolRetireMaxEpoch =
  Scalar @Integer
    7
    "poolRetireMaxEpoch"
    -- 18
    [ ("PRME-01", "poolRetireMaxEpoch must not be negative") `MustNotBe` NL 0
    ]
