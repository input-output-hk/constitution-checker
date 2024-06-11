{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MinFeeRefScriptCoinsPerByte where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

minFeeRefScriptCoinsPerByte :: Param (Identity Integer)
minFeeRefScriptCoinsPerByte =
  Scalar @Integer
    33
    "minFeeRefScriptCoinsPerByte"
    -- 1
    [ ("MFRS-01", "minFeeRefScriptCoinsPerByte must not exceed 1,000 (0.001 ada)") `MustBe` NG 1_000
    , ("MFRS-02", "minFeeRefScriptCoinsPerByte must not be negative") `MustBe` NL 0
    , ("MFRS-03", "To maintain a consistent level of protection against denial-of-service attacks, *minFeeRefScriptCoinsPerByte* **should** be adjusted whenever Plutus Execution prices are adjusted (*executionUnitPrices[steps/memory]*) and whenever *txFeeFixed* is adjusted") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    , ("MFRS-04", "Any changes to *minFeeRefScriptCoinsPerByte* **must** consider the implications of reducing the cost of a denial-of-service attack or increasing the maximum transaction fee") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
