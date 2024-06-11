{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.TxFeeFixed where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

txFeeFixed :: Param (Identity Integer)
txFeeFixed =
  Scalar @Integer
    1
    "txFeeFixed"
    -- 155_381
    [ ("TFF-01", "txFeeFixed must not be lower than 100,000 (0.1 ada)") `MustBe` NL 100_000
    , ("TFF-02", "txFeeFixed must not exceed 10,000,000 (10 ada)") `MustBe` NG 10_000_000
    , ("TFF-03", "txFeeFixed must not be negative") `MustBe` NL 0
    ]
