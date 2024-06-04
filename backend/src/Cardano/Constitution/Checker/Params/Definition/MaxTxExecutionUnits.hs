{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MaxTxExecutionUnits where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

maxTxExecutionUnits :: Param [Integer]
maxTxExecutionUnits =
  Collection
    20
    "maxTxExecutionUnits"
    [ Scalar
        0
        "mem"
        -- 20_000_000
        [ ("MTEU-M-01", "maxTxExecutionUnits[memory] must not exceed 40,000,000 units") `MustNotBe` NG 40_000_000
        , ("MTEU-M-02", "maxTxExecutionUnits[memory] must not be negative") `MustNotBe` NL 0
        ]
    , Scalar
        1
        "steps"
        -- 10_000_000_000
        [ ("MTEU-S-01", "maxTxExecutionUnits[steps] must not exceed 15,000,000,000 (15Bn) units") `MustNotBe` NG 15_000_000_000
        , ("MTEU-S-02", "maxTxExecutionUnits[steps] must not be negative") `MustNotBe` NL 0
        ]
    ]
