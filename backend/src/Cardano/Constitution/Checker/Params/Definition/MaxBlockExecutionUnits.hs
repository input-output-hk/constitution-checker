{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxBlockExecutionUnits where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

maxBlockExecutionUnits :: Param [Integer]
maxBlockExecutionUnits =
  Collection @Integer
    21
    "maxBlockExecutionUnits"
    [ Scalar
        0
        "memory"
        [ ("MBEU-M-01", "maxBlockExecutionUnits[memory] must not exceed 120,000,000 units") `MustNotBe` NG 120_000_000
        , ("MBEU-M-02", "maxBlockExecutionUnits[memory] must not be negative") `MustNotBe` NL 0
        ]
    , Scalar
        1
        "steps"
        [ ("MBEU-S-01", "maxBlockExecutionUnits[steps] must not exceed 40,000,000,000 (40Bn) units") `MustNotBe` NG 40_000_000_000
        , ("MBEU-S-02", "maxBlockExecutionUnits[steps] must not be negative") `MustNotBe` NL 0
        ]
    ]
