{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.GovDeposit where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

govDeposit :: Param (Identity Integer)
govDeposit =
  Scalar @Integer
    30
    "govDeposit"
    -- 1_000_000
    [ ("GD-01", "govDeposit must not be negative") `MustBe` NL 0
    , ("GD-02", "govDeposit must not be lower than 1,000,000 (1 ada)") `MustBe` NL 1_000_000
    , ("GD-03", "govDeposit must not exceed 10,000,000,000,000 (10 Million ada)") `MustBe` NG 10_000_000_000_000
    , ("GD-04", "*govDeposit* **should** be adjusted in line with fiat changes") `ShouldSatisfy` \ctx val -> Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024