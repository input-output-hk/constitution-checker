{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.StakeAddressDeposit where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

stakeAddressDeposit :: Param (Identity Integer)
stakeAddressDeposit =
  Scalar @Integer
    5
    "stakeAddressDeposit"
    -- 2_000_000
    [ ("SAD-01", "stakeAddressDeposit must not be lower than 1,000,000 (1 ada)") `MustBe` NL 1_000_000
    , ("SAD-02", "stakeAddressDeposit must not exceed 5,000,000 (5 ada)") `MustBe` NG 5_000_000
    , ("SAD-03", "stakeAddressDeposit must not be negative") `MustBe` NL 0
    ]
