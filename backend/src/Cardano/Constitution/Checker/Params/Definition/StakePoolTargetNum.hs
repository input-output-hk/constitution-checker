{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.StakePoolTargetNum where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

stakePoolTargetNum :: Param (Identity Integer)
stakePoolTargetNum =
  Scalar @Integer
    8
    "stakePoolTargetNum"
    -- 500
    [ ("SPTN-01", "stakePoolTargetNum must not be lower than 250") `MustBe` NL 250
    , ("SPTN-02", "stakePoolTargetNum must not exceed 2,000") `MustBe` NG 2_000
    , ("SPTN-03", "stakePoolTargetNum must not be negative") `MustBe` NL 0
    , ("SPTN-04", "stakePoolTargetNum must not be zero") `MustBe` NEQ 0
    ]

-- Complete as of June 12, 2024