{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.CommitteeMaxTermLimit where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

committeeMaxTermLimit :: Param (Identity Integer)
committeeMaxTermLimit =
  Scalar @Integer
    28
    "committeeMaxTermLimit"
    -- 50
    [ ("CMTL-01", "committeeMaxTermLimit must not be zero") `MustBe` NEQ 0
    , ("CMTL-02", "committeeMaxTermLimit must not be negative") `MustBe` NL 0
    , ("CMTL-03", "committeeMaxTermLimit must not be lower than 18 epochs (90 days, or approximately 3 months)") `MustBe` NL 18
    , ("CMTL-04", "committeeMaxTermLimit must not exceed 293 epochs (approximately 4 years)") `MustBe` NG 293
    , ("CMTL-05", "committeeMaxTermLimit should not exceed 220 epochs (approximately 3 years)") `ShouldSatisfy` \_ val ->
        if val <= 220
          then Satisfied
          else Unsatisfied "committeeMaxTermLimit should not exceed 220 epochs (approximately 3 years)"
    ]


-- Complete as of June 12, 2024