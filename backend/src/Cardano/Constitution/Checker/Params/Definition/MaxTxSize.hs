{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxTxSize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxTxSize :: Param (Identity Integer)
maxTxSize =
  Scalar @Integer
    3
    "maxTxSize"
    -- 16_384
    [ ("MTS-01", "maxTxSize must not exceed 32,768 Bytes (32KB)") `MustNotBe` NG 32_768
    , ("MTS-02", "maxTxSize must not be negative") `MustNotBe` NL 0
    ]
