{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.DRepVotingThresholds where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

dRepVotingThresholds :: Param [Rational]
dRepVotingThresholds =
  Collection @Rational
    26
    "dRepVotingThresholds"
    [ Scalar
        0
        "motionNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-NC-01", "No confidence action thresholds must be in the range 51%-75%") `MustBe` NL (51 % 100)
        , ("VT-NC-01b", "No confidence action thresholds must be in the range 51%-75%") `MustBe` NG (75 % 100)
        ]
    , Scalar
        1
        "committeeNormal"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 51%-90%") `MustBe` NL (51 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 51%-90%") `MustBe` NG (90 % 100)
        ]
    , Scalar
        2
        "committeeNoConfidence"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-CC-01", "Update Constitutional Committee action thresholds must be in the range 51%-90%") `MustBe` NL (51 % 100)
        , ("VT-CC-01b", "Update Constitutional Committee action thresholds must be in the range 51%-90%") `MustBe` NG (90 % 100)
        ]
    , Scalar
        3
        "updateConstitution"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-CON-01", "Update Constitution or proposal policy action thresholds must be in the range 65%-90%") `MustBe` NL (65 % 100)
        , ("VT-CON-01b", "Update Constitution or proposal policy action thresholds must be in the range 65%-90%") `MustBe` NG (90 % 100)
        ]
    , Scalar
        4
        "hardForkInitiation"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-HF-01", "Hard fork action thresholds must be in the range 51%-80%") `MustBe` NL (51 % 100)
        , ("VT-HF-01b", "Hard fork action thresholds must be in the range 51%-80%") `MustBe` NG (80 % 100)
        ]
    , Scalar
        5
        "ppNetworkGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-GEN-02", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustBe` NL (51 % 100)
        , ("VT-GEN-02b", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustBe` NG (75 % 100)
        ]
    , Scalar
        6
        "ppEconomicGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-GEN-02", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustBe` NL (51 % 100)
        , ("VT-GEN-02b", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustBe` NG (75 % 100)
        ]
    , Scalar
        7
        "ppTechnicalGroup"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-GEN-02", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustBe` NL (51 % 100)
        , ("VT-GEN-02b", "Economic, network, and technical parameters thresholds must be in the range 51%-75%") `MustBe` NG (75 % 100)
        ]
    , Scalar
        8
        "ppGovernanceGroup"
        -- (4 % 5)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        , ("VT-GOV-01", "Governance parameter thresholds must be in the range 75%-90%") `MustBe` NL (75 % 100)
        , ("VT-GOV-01b", "Governance parameter thresholds must be in the range 75%-90%") `MustBe` NG (90 % 100)
        ]
    , Scalar
        9
        "treasuryWithdrawal"
        -- (2 % 3)
        [ ("VT-GEN-01", "All thresholds must be in the range 50%-100%") `MustBe` NL (1 % 2)
        , ("VT-GEN-01b", "All thresholds must be in the range 50%-100%") `MustBe` NG (1 % 1)
        ]
    ]

-- Complete as of June 12, 2024