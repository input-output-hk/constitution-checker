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
    , ("TFGEN-01", "To maintain a consistent level of protection against denial-of-service attacks, txFeeFixed and txFeeFixed should be adjusted whenever Plutus Execution prices are adjusted (executionUnitPrices[steps/memory])") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    , ("TFGEN-02", "Any changes to  txFeeFixed or txFeeFixed must consider the implications of reducing the cost of a denial-of-service attack or increasing the maximum transaction fee so that it becomes impossible to construct a transaction.") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
