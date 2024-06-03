{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# OPTIONS_GHC -Wno-orphans #-}

module Cardano.Constitution.Checker.Params.Lookup where

import Cardano.Constitution.Checker.Params.Types
import Data.Functor.Identity

import Data.Map (Map)

import qualified Data.Map as Map
import Prelude hiding (Rational)

instance Lookup (Identity Rational) where
  lookupRational' (Identity val) = [val]
  lookupInteger' _ = []

instance Lookup (Identity Integer) where
  lookupRational' _ = []
  lookupInteger' (Identity val) = [val]

instance Lookup [Rational] where
  lookupRational' val = val
  lookupInteger' _ = []

instance Lookup [Integer] where
  lookupRational' _ = []
  lookupInteger' val = val

lookup' :: (a -> [b]) -> Param a -> a -> Map String b
lookup' f (Scalar _ name _) val = Map.fromList $ zip [name] $ f val
lookup' f (Collection _ _ params) val =
  let names = map paramName params
   in Map.fromList $ zip names $ f val
lookup' _ (CostModels{}) _ = Map.empty

lookupRational :: forall a. (Lookup a) => Param a -> a -> Map String Rational
lookupRational = lookup' lookupRational'

lookupInteger :: forall a. (Lookup a) => Param a -> a -> Map String Integer
lookupInteger = lookup' lookupInteger'
