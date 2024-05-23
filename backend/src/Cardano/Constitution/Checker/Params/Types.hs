{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.Params.Types where

import Cardano.Constitution.Checker.Params.Farey
import Cardano.Constitution.Checker.Params.Intervals
import Data.Aeson
import Data.Functor.Identity
import Data.Ratio

import Data.Swagger (Schema)

data Assertion a = MustNotBe !(String, String) !(RangeConstraint a)

data Param a where
  Scalar ::
    (FromJSON a, ToJSON a, HasDomain a, IntervalEnum a, Show a, Num a, Ord a) =>
    Integer ->
    String ->
    [Assertion a] ->
    Param (Identity a)
  Collection ::
    (FromJSON a, ToJSON a, HasDomain a, IntervalEnum a, Show a, Num a, Ord a) =>
    Integer ->
    String ->
    [Param (Identity a)] ->
    Param [a]

class ParamToSchema a where
  paramToSchema :: Param a -> Schema

data Param' = forall a. (ParamToSchema a) => MkParam' (Param a)

class IntervalEnum a where
  boundaryPred :: Boundary a -> a
  boundarySucc :: Boundary a -> a

instance IntervalEnum Integer where
  boundaryPred (Closed a) = a - 1
  boundaryPred (Open a) = a
  boundarySucc (Closed a) = a + 1
  boundarySucc (Open a) = a

instance (a ~ Integer) => IntervalEnum (Ratio a) where
  boundaryPred (Closed a) = fst $ findTightestRationalBounds a 64
  boundaryPred (Open a) = a
  boundarySucc (Closed a) = snd $ findTightestRationalBounds a 64
  boundarySucc (Open a) = a

paramIx :: Param a -> Integer
paramIx (Scalar ix _ _) = ix
paramIx (Collection ix _ _) = ix

paramName :: Param a -> String
paramName (Scalar _ n _) = n
paramName (Collection _ n _) = n

getAssertionRangeAndStr :: Assertion a -> (String, RangeConstraint a)
getAssertionRangeAndStr (MustNotBe (g, _) range) = (g, range)

getAllRangeConstraints :: Param (Identity a) -> [(String, RangeConstraint a)]
getAllRangeConstraints (Scalar _ _ assertions) = map getAssertionRangeAndStr assertions

class HasDomain a where
  domain :: (a, a)

instance HasDomain Integer where
  domain = (fromIntegral $ minBound @Int, fromIntegral $ maxBound @Int)

instance HasDomain Rational where
  domain = (toRational $ minBound @Int, toRational $ maxBound @Int)

boundaries ::
  forall a.
  (IntervalEnum a, HasDomain a, Num a, Ord a) =>
  Param (Identity a) ->
  (Maybe a, Maybe a)
boundaries x =
  let
    (lower, upper) = (domain @a)
    (lowerBound, upperBound) = boundaries' (lower, upper) x
   in
    ( if lowerBound == lower then Nothing else Just lowerBound
    , if upperBound == upper then Nothing else Just upperBound
    )

boundaries' ::
  (IntervalEnum a, Num a, Ord a) =>
  (a, a) ->
  Param (Identity a) ->
  (a, a)
boundaries' domain' x =
  let constraints = map snd $ getAllRangeConstraints x
      xs = gapsWithinRange domain' constraints
      (start, end) = case xs of
        [] -> error "No domain to choose values from"
        xs' -> (fst $ head xs', snd $ last xs')
   in case (start, end) of
        (Open a, Open b) -> (boundaryPred $ Open a, boundarySucc $ Open b)
        (Closed a, Open b) -> (a, boundarySucc $ Open b)
        (Open a, Closed b) -> (boundaryPred $ Open a, b)
        (Closed a, Closed b) -> (a, b)
