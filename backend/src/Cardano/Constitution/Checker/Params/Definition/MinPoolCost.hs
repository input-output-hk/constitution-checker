{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MinPoolCost where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

minPoolCost :: Param (Identity Integer)
minPoolCost =
  Scalar @Integer
    16
    "minPoolCost"
    -- 170_000_000
    [ ("MPC-01", "minPoolCost must not be negative") `MustBe` NL 0
    , ("MPC-02", "minPoolCost must not exceed 500,000,000 (500 ada)") `MustBe` NG 500_000_000
    ]
