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
    [ ("UCPB-01", "utxoCostPerByte must not be lower than 3,000 (0.003 ada)") `MustNotBe` NL 3_000
    , ("UCPB-02", "utxoCostPerByte must not exceed 6,500 (0.0065 ada)") `MustNotBe` NG 6_500
    , ("UCPB-03", "utxoCostPerByte must not be set to 0") `MustNotBe` NEQ 0
    , ("UCPB-04", "utxoCostPerByte must not be negative") `MustNotBe` NL 0
    ]
