{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxBlockBodySize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

maxBlockBodySize :: Param (Identity Integer)
maxBlockBodySize =
  Scalar @Integer
    2
    "maxBlockBodySize"
    -- 90_112
    [ ("MBBS-01", "maxBlockBodySize must not exceed 122,880 Bytes (120KB)") `MustBe` NG 122_880
    , ("MBBS-02", "maxBlockBodySize must not be lower than 24,576 Bytes (24KB)") `MustBe` NL 24_576
    ]
