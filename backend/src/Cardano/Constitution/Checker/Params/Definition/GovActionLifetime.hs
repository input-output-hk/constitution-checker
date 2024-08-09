{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.GovActionLifetime where

import Cardano.Constitution.Checker.Params.Definition.Base
import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

govActionLifetime :: Param (Identity Integer)
govActionLifetime =
  Scalar @Integer
    29
    "govActionLifetime"
    -- 5
    [ ("GAL-01", "govActionLifetime must not be lower than 1 epoch (5 days)") `MustBe` NL 1
    , ("GAL-02", "govActionLifetime must not be greater than 15 epochs (75 days)") `MustBe` NG 15
    , ("GAL-03", "govActionLifetime should not be lower than 2 epochs (10 days)") `ShouldSatisfy` \_ val ->
        if val >= 2 then Satisfied else Unsatisfied "govActionLifetime should not be lower than 2 epochs"
    , ("GAL-04", "govActionLifetime should be calibrated in human terms (eg 30 days, two weeks), to allow sufficient time for voting etc. to take place")
        `ShouldSatisfy` \_ val ->
          ( let HumanReadableTimeSpan check years months weeks days = epochIsHumanReadable val
             in if check
                  then Satisfied
                  else Unsatisfied $ "govActionLifetime should be calibrated in human terms (eg 30 days, two weeks), to allow sufficient time for voting etc. to take place but it is " ++ show (val * 5) ++ " days, which is " ++ show years ++ " years, " ++ show months ++ " months, " ++ show weeks ++ " weeks, " ++ show days ++ " days"
          )
    , ("GAL-05", "govActionLifetime must be less than dRepActivity")
        `MustSatisfy` \ctx val ->
          case ctx.merged.byName.getInteger "dRepActivity" of
            Just dRepActivity'
              | val < dRepActivity' -> Satisfied
              | otherwise -> Unsatisfied "govActionLifetime must be less than dRepActivity"
            Nothing -> Unsatisfied "dRepActivity not found"
    ]

-- Complete as of June 12, 2024
