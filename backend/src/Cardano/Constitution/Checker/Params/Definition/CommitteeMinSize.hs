{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Definition.CommitteeMinSize where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity
import Prelude hiding (Rational)

committeeMinSize :: Param (Identity Integer)
committeeMinSize =
  Scalar @Integer
    27
    "committeeMinSize"
    -- 3
    [ ("CMS-01", "committeeMinSize must not be negative") `MustBe` NL 0
    , ("CMS-02", "committeeMinSize must not be lower than 3") `MustBe` NL 3
    , ("CMS-03", "committeeMinSize must not exceed 10") `MustBe` NG 10
    ]
