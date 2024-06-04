{-# LANGUAGE FlexibleInstances #-}

module Cardano.Constitution.Checker.Params.Definition.CostModels where

import Cardano.Constitution.Checker.Params.Lookup ()
import Cardano.Constitution.Checker.Params.Swagger ()
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

costModels :: Param (Maybe PV1, Maybe PV2, Maybe PV3)
costModels = CostModels 18 [] [] []
