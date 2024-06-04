{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxBlockHeaderSize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxBlockHeaderSize :: Param (Identity Integer)
maxBlockHeaderSize =
  Scalar @Integer
    4
    "maxBlockHeaderSize"
    -- 1_100
    [ ("MBHS-01", "maxBlockHeaderSize must not exceed 5,000 Bytes") `MustNotBe` NG 5_000
    , ("MBHS-02", "maxBlockHeaderSize must not be negative") `MustNotBe` NL 0
    ]
