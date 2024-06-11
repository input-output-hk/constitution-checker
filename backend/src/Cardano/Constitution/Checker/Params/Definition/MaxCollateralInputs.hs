{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxCollateralInputs where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxCollateralInputs :: Param (Identity Integer)
maxCollateralInputs =
  Scalar @Integer
    24
    "maxCollateralInputs"
    -- 3
    [ ("MCI-01", "maxCollateralInputs must not be lower than 1") `MustBe` NL 1
    ]

-- Complete as of June 12, 2024
