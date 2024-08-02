{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeApplications #-}

module Cardano.Constitution.Checker.Params.Types where

import Cardano.Constitution.Checker.Blockfrost
import Cardano.Constitution.Checker.Params.Farey
import Cardano.Constitution.Checker.Params.Intervals
import Data.Aeson
import Data.Functor.Identity

import qualified Data.Ratio as R
import Data.Swagger (Schema)

import Data.Text.Read (decimal)
import qualified GHC.IsList as Haskell

import Data.Char (isSpace)
import Data.Map (Map)
import qualified Data.Text as T

import Prelude hiding (Rational)

newtype Rational = MkRational (R.Ratio Integer)
  deriving (Eq, Ord)

infixl 7 %
(%) :: Integer -> Integer -> Rational
a % b = MkRational $ a R.% b

numerator :: Rational -> Integer
numerator (MkRational a) = R.numerator a

denominator :: Rational -> Integer
denominator (MkRational a) = R.denominator a

instance Num Rational where
  (MkRational a) + (MkRational b) = MkRational $ a + b
  (MkRational a) - (MkRational b) = MkRational $ a - b
  (MkRational a) * (MkRational b) = MkRational $ a * b
  abs (MkRational a) = MkRational $ abs a
  signum (MkRational a) = MkRational $ signum a
  fromInteger a = MkRational $ fromInteger a

instance Fractional Rational where
  (MkRational a) / (MkRational b) = MkRational $ a / b
  fromRational = MkRational

instance FromJSON Rational where
  parseJSON (Array v) = do
    let xs = Haskell.toList v
    case xs of
      [a, b] -> do
        num <- parseJSON a
        den <- parseJSON b
        return $ num % den
      _otherwise -> fail rationalParsingFailMsg
  parseJSON (Number n) = return $ MkRational $ toRational n
  parseJSON (String str) = do
    case parseRational str of
      Just (num, den) -> return $ num % den
      Nothing -> fail rationalParsingFailMsg
  parseJSON _ = fail rationalParsingFailMsg

rationalParsingFailMsg :: String
rationalParsingFailMsg =
  "Rational: Expected a number , two-element array or a string in the form of 'numerator/denominator'"
parseRational :: T.Text -> Maybe (Integer, Integer)
parseRational input = do
  let cleaned = T.filter (not . isSpace) input
  (numerator', rest) <- either (const Nothing) Just (decimal cleaned)
  denominator' <- case T.uncons rest of
    Just ('/', denomStr) -> fst <$> either (const Nothing) Just (decimal denomStr)
    _otherwise -> Nothing
  return (numerator', denominator')

instance ToJSON Rational where
  toJSON a = toJSON [toJSON $ numerator a, toJSON $ denominator a]

instance Show Rational where
  show a = show (numerator a) ++ " % " ++ show (denominator a)

data Assertion a
  = MustBe !(String, String) !(RangeConstraint a)
  | ShouldBe !(String, String) !(RangeConstraint a)
  | MustSatisfy !(String, String) !(Context -> a -> SatisfactionResult)
  | ShouldSatisfy !(String, String) !(Context -> a -> SatisfactionResult)

assertionDescription :: Assertion a -> (String, String)
assertionDescription (MustBe desc' _) = desc'
assertionDescription (ShouldSatisfy desc' _) = desc'
assertionDescription (MustSatisfy desc' _) = desc'
assertionDescription (ShouldBe desc' _) = desc'

data ByParameter a = ByParameter
  { getInteger :: !(a -> Maybe Integer)
  , getRational :: !(a -> Maybe Rational)
  , getIntegers :: !(a -> Map String Integer)
  , getRationals :: !(a -> Map String Rational)
  , getCostModels :: !(a -> (Maybe PV1, Maybe PV2, Maybe PV3))
  }

findInteger :: a -> ByParameter a -> Maybe Integer
findInteger = flip getInteger

findRational :: ByParameter a -> a -> Maybe Rational
findRational = getRational

findIntegers :: ByParameter a -> a -> Map String Integer
findIntegers = getIntegers

findRationals :: ByParameter a -> a -> Map String Rational
findRationals = getRationals

data ParamsAccess = ParamsAccess
  { byName :: !(ByParameter String)
  , byIx :: !(ByParameter Integer)
  }

data Context = Context
  { proposal :: !ParamsAccess
  , merged :: !ParamsAccess
  , currentValues :: !ParamsAccess
  , latestEpoch :: !Epoch
  , valuesByEpoch :: !(Epoch -> ParamsAccess)
  }

data SatisfactionResult
  = Satisfied
  | Unsatisfied !String
  | Neutral !String

type PV1 = [Integer]
type PV2 = [Integer]
type PV3 = [Integer]

data Param a where
  Scalar ::
    ( FromJSON a
    , ToJSON a
    , ParamToSchema (Identity a)
    , Lookup (Identity a)
    , HasDomain a
    , IntervalEnum a
    , Show a
    , Num a
    , Ord a
    ) =>
    Integer ->
    String ->
    [Assertion a] ->
    Param (Identity a)
  Collection ::
    ( FromJSON a
    , ToJSON a
    , ParamToSchema (Identity a)
    , Lookup [a]
    , HasDomain a
    , IntervalEnum a
    , Show a
    , Num a
    , Ord a
    ) =>
    Integer ->
    String ->
    [Param (Identity a)] ->
    Param [a]
  CostModels ::
    Integer ->
    [Assertion (Maybe PV1)] ->
    [Assertion (Maybe PV2)] ->
    [Assertion (Maybe PV3)] ->
    Param (Maybe PV1, Maybe PV2, Maybe PV3)

-- TODO: not the best approach, but it works for now
class Lookup a where
  lookupRational' :: a -> [Rational]
  lookupInteger' :: a -> [Integer]

class ParamToSchema a where
  paramToSchema :: Param a -> Schema

data ParamWithCurrentValue = forall a. (ParamToSchema a) => ParamWithCurrentValue !(Param a) !(ProtocolParams -> a)
data Param' = forall a. (ParamToSchema a) => MkParam' !(Param a)

fromParamWithCurrentValues :: ParamWithCurrentValue -> Param'
fromParamWithCurrentValues (ParamWithCurrentValue p _) = MkParam' p

class IntervalEnum a where
  boundaryPred :: Boundary a -> a
  boundarySucc :: Boundary a -> a

instance IntervalEnum Integer where
  boundaryPred (Closed a) = a - 1
  boundaryPred (Open a) = a
  boundarySucc (Closed a) = a + 1
  boundarySucc (Open a) = a

instance IntervalEnum Rational where
  boundaryPred (Closed (MkRational a)) =
    MkRational $ fst $ findTightestRationalBounds a 64
  boundaryPred (Open a) = a
  boundarySucc (Closed (MkRational a)) =
    MkRational $ snd $ findTightestRationalBounds a 64
  boundarySucc (Open a) = a

paramIx :: Param a -> Integer
paramIx (Scalar ix _ _) = ix
paramIx (Collection ix _ _) = ix
paramIx (CostModels ix _ _ _) = ix

paramName :: Param a -> String
paramName (Scalar _ n _) = n
paramName (Collection _ n _) = n
paramName (CostModels{}) = costModelsParamName

costModelsParamName :: String
costModelsParamName = "costModels"

getParamAssertions :: Param (Identity a) -> [Assertion a]
getParamAssertions (Scalar _ _ assertions) = assertions

-- getAssertionRangeAndStr :: Assertion (RangeConstraint a) -> (String, RangeConstraint a)
-- getAssertionRangeAndStr (MustBe (g, _) range) = (g, range)


getAllRangeConstraints :: forall a. Param (Identity a) -> [(String, RangeConstraint a)]
getAllRangeConstraints (Scalar _ _ assertions) =
  foldr f [] assertions
 where
  f (MustBe (g, _) range) acc = (g, range) : acc
  f _ acc = acc

-- rangeConstraintAssertions :: [Assertion a] -> [Assertion (RangeConstraint a)]
-- rangeConstraintAssertions = foldr go []

-- go :: Assertion a -> [Assertion (RangeConstraint a)] -> [Assertion (RangeConstraint a)]
-- go assertion@(MustBe g range) acc = _ : acc
-- go _ acc = acc

class HasDomain a where
  domain :: (a, a)

instance HasDomain Integer where
  domain = (fromIntegral $ minBound @Int, fromIntegral $ maxBound @Int)

instance HasDomain Rational where
  domain =
    ( MkRational $ toRational $ minBound @Int
    , MkRational $ toRational $ maxBound @Int
    )

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

