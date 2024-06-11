{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.UtxoCostPerByte where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

utxoCostPerByte :: Param (Identity Integer)
utxoCostPerByte =
  Scalar @Integer
    17
    "utxoCostPerByte"
    -- 4_310
    [ ("UCPB-01", "utxoCostPerByte must not be lower than 3,000 (0.003 ada)") `MustBe` NL 3_000
    , ("UCPB-02", "utxoCostPerByte must not exceed 6,500 (0.0065 ada)") `MustBe` NG 6_500
    , ("UCPB-03", "utxoCostPerByte must not be set to 0") `MustBe` NEQ 0
    , ("UCPB-04", "utxoCostPerByte must not be negative") `MustBe` NL 0
    , ("UCPB-05", "Changes need to account for i) The acceptable cost of attack ii) The acceptable time for an attack (at least one epoch is assumed) iii) The acceptable memory configuration for full node users (assumed to be 16GB for wallets or 24GB for stake pools) iv) The sizes of UTxOs (~200B per UTxO minimum, up to about 10KB) and v) The current total node memory usage)") `ShouldSatisfy` \ctx val -> 
      Neutral "Please contribute to the check"
    ]

-- Complete as of June 12, 2024
