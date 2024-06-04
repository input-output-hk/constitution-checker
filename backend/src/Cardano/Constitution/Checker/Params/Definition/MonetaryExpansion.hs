{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MonetaryExpansion where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

monetaryExpansion :: Param (Identity Rational)
monetaryExpansion =
  Scalar @Rational
    10
    "monetaryExpansion"
    -- 0.003
    [ ("ME-01", "monetaryExpansion must not exceed 0.005") `MustBe` NG 0.005
    , ("ME-02", "monetaryExpansion must not be lower than 0.001") `MustBe` NL 0.001
    , ("ME-03", "monetaryExpansion must not be negative") `MustBe` NL 0
    ]
