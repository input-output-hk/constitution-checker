{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.TreasuryCut where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

treasuryCut :: Param (Identity Rational)
treasuryCut =
  Scalar @Rational
    11
    "treasuryCut"
    -- 0.3
    [ ("TC-01", "treasuryCut must not be lower than 0.1 (10%)") `MustBe` NL 0.1
    , ("TC-02", "treasuryCut must not exceed 0.3 (30%)") `MustBe` NG 0.3
    , ("TC-03", "treasuryCut must not be negative") `MustBe` NL 0
    , ("TC-04", "treasuryCut must not exceed 1.0 (100%)") `MustBe` NG 1.0
    , ("TC-05", "*treasuryCut* **must not** be changed more than once in any 36 epoch period (approximately 6 months)") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024