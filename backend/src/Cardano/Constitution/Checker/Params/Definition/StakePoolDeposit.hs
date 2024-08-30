{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.StakePoolDeposit where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

stakePoolDeposit :: Param (Identity Integer)
stakePoolDeposit =
  Scalar @Integer
    6
    "stakePoolDeposit"
    -- 500_000_000
    [ ("SPD-01", "stakePoolDeposit must not be lower than 250,000,000 (250 ada)") `MustBe` NL 250_000_000
    , ("SPD-02", "stakePoolDeposit must not exceed 500,000,000 (500 ada)") `MustBe` NG 500_000_000
    , ("SPD-03", "stakePoolDeposit must not be negative") `MustBe` NL 0
    ]

-- Complete as of June 12, 2024
