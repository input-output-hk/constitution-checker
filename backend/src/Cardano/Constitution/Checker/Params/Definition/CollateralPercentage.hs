{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.CollateralPercentage where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

collateralPercentage :: Param (Identity Integer)
collateralPercentage =
  Scalar @Integer
    23
    "collateralPercentage"
    -- 150
    [ ("CP-01", "collateralPercentage must not be lower than 100") `MustNotBe` NL 100
    , ("CP-02", "collateralPercentage must not exceed 200") `MustNotBe` NG 200
    , ("CP-03", "collateralPercentage must not be negative") `MustNotBe` NL 0
    , ("CP-04", "collateralPercentage must not be set to 0") `MustNotBe` NEQ 0
    ]
