{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE RankNTypes #-}

module Cardano.Constitution.Checker.Params.Types where

import Cardano.Constitution.Checker.Params.Intervals
import Data.Aeson
import Data.Functor.Identity

data Assertion a = MustNotBe !(String, String) !(RangeConstraint a)

data Param a where
  Scalar ::
    (FromJSON a, ToJSON a, Show a, Num a, Ord a) =>
    Integer ->
    String ->
    [Assertion a] ->
    Param (Identity a)
  Collection ::
    (FromJSON a, ToJSON a, Show a, Num a, Ord a) =>
    Integer ->
    String ->
    [Param (Identity a)] ->
    Param [a]

data Param' = forall a. MkParam' (Param a)

paramIx :: Param a -> Integer
paramIx (Scalar ix _ _) = ix
paramIx (Collection ix _ _) = ix
