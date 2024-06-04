{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.TxFeePerByte where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

txFeePerByte :: Param (Identity Integer)
txFeePerByte =
  Scalar @Integer
    0
    "txFeePerByte"
    -- 44
    [ ("TFPB-01", "txFeePerByte must not be lower than 30 (0.000030 ada)") `MustBe` NL 30
    , ("TFPB-02", "txFeePerByte must not exceed 1,000 (0.001 ada)") `MustBe` NG 1_000
    , ("TFPB-03", "txFeePerByte must not be negative") `MustBe` NL 0
    ]
