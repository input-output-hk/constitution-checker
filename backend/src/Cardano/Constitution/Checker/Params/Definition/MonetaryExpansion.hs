{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MonetaryExpansion where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types

import Data.Foldable

import Data.Functor.Identity
import Prelude hiding (Rational)

monetaryExpansion :: Param (Identity Rational)
monetaryExpansion =
  Scalar @Rational
    10
    "monetaryExpansion"
    -- 0.003
    [ ("ME-01", "monetaryExpansion must not exceed 0.005") `MustBe` NG 0.005
    , ("ME-02", "monetaryExpansion must not be lower than 0.001") `MustBe` NL 0.001
    , ("ME-03", "monetaryExpansion must not be negative") `MustBe` NL 0
    , ("ME-04", "monetaryExpansion should not be varied by more than +/- 10% in any 73-epoch period (approximately 12 months)")
        `ShouldSatisfy` \ctx value ->
          let
            startEpoch = ctx.latestEpoch - 72
            epochs = [startEpoch .. ctx.latestEpoch]
            valuesM = map (\e -> (e, (ctx.valuesByEpoch e).byName.getRational "monetaryExpansion")) epochs
            values = foldl' accumulate [] valuesM
            accumulate acc (_, Nothing) = acc
            accumulate acc (epoch, Just x) = (epoch, x) : acc
            failed = find cond values
            cond (_, epochValue) = epochValue < value * 0.9 || epochValue > value * 1.1
           in
            if null values
              then Neutral "No data available to check"
            else
              case failed of
                Nothing -> Satisfied
                Just (epoch, epochValue) ->
                  Unsatisfied $
                    "monetaryExpansion varied by more than +/- 10% from epoch "
                      <> show epoch
                      <> " where monetaryExpansion was: "
                      <> show epochValue
                      <> ")"
    , ("ME-05", "monetaryExpansion should not be changed more than once in any 36-epoch period (approximately 6 months)") `ShouldSatisfy` \ctx val ->
        Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
