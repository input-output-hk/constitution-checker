{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.DRepDeposit where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

dRepDeposit :: Param (Identity Integer)
dRepDeposit =
  Scalar @Integer
    31
    "dRepDeposit"
    -- 1_000_000
    [ ("DRD-01", "dRepDeposit must not be negative") `MustNotBe` NL 0
    , ("DRD-02", "dRepDeposit must not be lower than 1,000,000 (1 ada)") `MustNotBe` NL 1_000_000
    , ("DRD-03", "dRepDeposit must be no more than 100,000,000,000 (100,000 ada)") `MustNotBe` NG 100_000_000_000
    ]
