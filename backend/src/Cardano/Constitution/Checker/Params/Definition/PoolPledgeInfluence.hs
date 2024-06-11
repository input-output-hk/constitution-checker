{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.PoolPledgeInfluence where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

poolPledgeInfluence :: Param (Identity Rational)
poolPledgeInfluence =
  Scalar @Rational
    9
    "poolPledgeInfluence"
    -- 0.3
    [ ("PPI-01", "poolPledgeInfluence must not be lower than 0.1") `MustBe` NL (1 % 10)
    , ("PPI-02", "poolPledgeInfluence must not exceed 1.0") `MustBe` NG (10 % 10)
    , ("PPI-03", "poolPledgeInfluence must not be negative") `MustBe` NL 0
    ]
