{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.ExecutionUnitPrices where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

executionUnitPrices :: Param [Rational]
executionUnitPrices =
  Collection @Rational
    19
    "executionUnitPrices"
    [ Scalar
        0
        "priceMemory"
        -- (577 % 10_000)
        [ ("EIUP-PM-01", "executionUnitPrices[priceMemory] must not exceed 2_000 / 10_000") `MustBe` NG (2_000 % 10_000)
        , ("EIUP-PM-02", "executionUnitPrices[priceMemory] must not be lower than 400 / 10_000") `MustBe` NL (400 % 10_000)
        , ("EIUP-GEN-01", "The execution prices **must** be set so that i) the cost of executing a transaction with maximum CPU steps is similar to the cost of a maximum sized non-script transaction and ii) the cost of executing a transaction with maximum memory units is similar to the cost of a maximum sized non-script transaction") `ShouldSatisfy` \ctx val ->
          Neutral "Please contribute to this check."
        , ("EIUP-GEN-02", "The execution prices **should** be adjusted whenever transaction fees are adjusted (*txFeeFixed/txFeePerByte*). The goal is to ensure that the processing delay is similar for \"full\" transactions, regardless of their type. This helps ensure that the requirements on block diffusion/propagation times are met.") `ShouldSatisfy` \ctx val ->
          Neutral "Please contribute to this check."
        ]
    , Scalar
        1
        "priceSteps"
        -- (721 % 10_000_000)
        [ ("EIUP-PS-01", "executionUnitPrices[priceSteps] must not exceed 2,000 / 10,000,000") `MustBe` NG (2_000 % 10_000_000)
        , ("EIUP-PS-02", "executionUnitPrices[priceSteps] must not be lower than 500 / 10,000,000") `MustBe` NL (500 % 10_000_000)
        , ("EIUP-GEN-01", "The execution prices **must** be set so that i) the cost of executing a transaction with maximum CPU steps is similar to the cost of a maximum sized non-script transaction and ii) the cost of executing a transaction with maximum memory units is similar to the cost of a maximum sized non-script transaction") `ShouldSatisfy` \ctx val ->
          Neutral "Please contribute to this check."
        , ("EIUP-GEN-02", "The execution prices **should** be adjusted whenever transaction fees are adjusted (*txFeeFixed/txFeePerByte*). The goal is to ensure that the processing delay is similar for \"full\" transactions, regardless of their type. This helps ensure that the requirements on block diffusion/propagation times are met.") `ShouldSatisfy` \ctx val ->
          Neutral "Please contribute to this check."
        ]
    ]

-- Complete as of June 12, 2024