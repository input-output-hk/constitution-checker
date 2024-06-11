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
    , ("TFGEN-01", "To maintain a consistent level of protection against denial-of-service attacks, *txFeeFixed* and *txFeeFixed* **should** be adjusted whenever Plutus Execution prices are adjusted (executionUnitPrices[steps/memory]).") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    , ("TFGEN-02", "Any changes to  *txFeeFixed* or *txFeeFixed* **must** consider the implications of reducing the cost of a denial-of-service attack or increasing the maximum transaction fee so that it becomes impossible to construct a transaction.") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
