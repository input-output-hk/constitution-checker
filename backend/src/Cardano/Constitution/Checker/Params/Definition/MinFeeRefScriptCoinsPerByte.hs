{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE NumericUnderscores #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.MinFeeRefScriptCoinsPerByte where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

minFeeRefScriptCoinsPerByte :: Param (Identity Integer)
minFeeRefScriptCoinsPerByte =
  Scalar @Integer
    33
    "minFeeRefScriptCoinsPerByte"
    -- 1
    [ ("MFRS-01", "minFeeRefScriptCoinsPerByte must not exceed 1,000 (0.001 ada)") `MustBe` NG 1_000
    , ("MFRS-02", "minFeeRefScriptCoinsPerByte must not be negative") `MustBe` NL 0
    ]
