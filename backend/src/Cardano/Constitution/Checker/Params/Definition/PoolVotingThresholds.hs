{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.PoolVotingThresholds where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

poolVotingThresholds :: Param [Rational]
poolVotingThresholds =
  Collection @Rational
    25
    "poolVotingThresholds"
    [ Scalar
        0
        "motionNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-NC-01", "No confidence action thresholds must be in the range 51%-75%")
            `MustBe` NL (51 % 100)
        , ("VT-NC-01b", "No confidence action thresholds must be in the range 51%-75%") `MustBe` NG (75 % 100)
        ]
    , Scalar
        1
        "committeeNormal"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustBe` NL (65 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustBe` NG (90 % 100)
        ]
    , Scalar
        2
        "committeeNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustBe` NL (65 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 65%-90%")
            `MustBe` NG (90 % 100)
        ]
    , Scalar
        3
        "hardForkInitiation"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-HF-01", "Hard fork action thresholds must be in the range 51%-80%")
            `MustBe` NL (51 % 100)
        , ("VT-HF-01b", "Hard fork action thresholds must be in the range 51%-80%")
            `MustBe` NG (80 % 100)
        ]
    , Scalar
        4
        "ppSecurityGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        ]
    ]

-- Complete as of June 12, 2024