{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.DRepActivity where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

dRepActivity :: Param (Identity Integer)
dRepActivity =
  Scalar @Integer
    32
    "dRepActivity"
    -- 25
    [ ("DRA-01", "dRepActivity must not be lower than 13 epochs (2 months)") `MustBe` NL 13
    , ("DRA-02", "dRepActivity must not exceed 37 epochs (6 months)") `MustBe` NG 37
    , ("DRA-03", "dRepActivity must not be negative") `MustBe` NL 0
    ]
