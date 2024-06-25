{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE RankNTypes #-}

module Cardano.Constitution.Checker.Context (
  mkContext,
) where

import Cardano.Constitution.Checker.Blockfrost (Epoch, ProtocolParams (..))
import Cardano.Constitution.Checker.Params.Lookup
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Control.Applicative ((<|>))
import Data.Map
import qualified GHC.IsList as Haskell

-- import qualified Data.Swagger as SWG

mkContext ::
  ParametersChange ->
  ProtocolParams ->
  Epoch ->
  Map Epoch ProtocolParams ->
  Context
mkContext (MkParametersChange m') currentValues' latestEpoch' allEpochParams =
  Context
    { proposal = proposal'
    , merged = merged'
    , currentValues = currentParams'
    , latestEpoch = latestEpoch'
    , valuesByEpoch = valuesByEpoch'
    }
 where
  proposal' = paramsAccess m'
  currentParams' = paramsAccess currentParams
  valuesByEpoch' epoch' = paramsAccess $
    case Data.Map.lookup epoch' allEpochParams of
      Nothing -> mempty
      Just x ->
        let EpochParameters _ (MkParametersChange epochParams) = protocolParamsToEpochParams x
         in epochParams
  merged' =
    ParamsAccess
      { byName = mergedByParameter byName
      , byIx = mergedByParameter byIx
      }
  mergedByParameter :: (ParamsAccess -> ByParameter a) -> ByParameter a
  mergedByParameter f =
    ByParameter
      { getInteger = searchInBoth f getInteger
      , getRational = searchInBoth f getRational
      , getIntegers = searchInBoth' f getIntegers
      , getRationals = searchInBoth' f getRationals
      , getCostModels = \ix' ->
          let (pV1, pV2, pV3) = getCostModels (f proposal') ix'
              (cV1, cV2, vV3) = getCostModels (f currentParams') ix'
           in (pV1 <|> cV1, pV2 <|> cV2, pV3 <|> vV3)
      }

  searchInBoth ::
    (ParamsAccess -> ByParameter a) ->
    (ByParameter a -> (a -> Maybe b)) ->
    a ->
    Maybe b
  searchInBoth f extractor ix' =
    let a = extractor (f proposal') ix'
        b = extractor (f currentParams') ix'
     in a <|> b

  searchInBoth' ::
    (ParamsAccess -> ByParameter a) ->
    (ByParameter a -> (a -> Map String b)) ->
    a ->
    Map String b
  searchInBoth' f extractor ix' =
    let a = extractor (f proposal') ix'
        b = extractor (f currentParams') ix'
     in a <> b

  EpochParameters _ (MkParametersChange currentParams) =
    protocolParamsToEpochParams currentValues'

paramsAccess :: Map Integer ParamValue -> ParamsAccess
paramsAccess m = ParamsAccess (byName' xs) (byIx' m)
 where
  xs = snd <$> toList m

-- ~~ utils ~~
byName' :: [ParamValue] -> ByParameter String
byName' xs = byParameter' (withParamName xs)

byIx' :: Map Integer ParamValue -> ByParameter Integer
byIx' m = byParameter' (withParamIx m)

withParamName :: [ParamValue] -> (forall a. Maybe (Param a, a) -> b) -> String -> b
withParamName xs f name' =
  let
    nameMap = Haskell.fromList $ zip (allNames xs) xs
    allNames = fmap (\(MkParamValue p _) -> paramName p)
   in
    case Data.Map.lookup name' nameMap of
      Just (MkParamValue p v) -> f $ Just (p, v)
      Nothing -> f Nothing

withParamIx :: Map Integer ParamValue -> (forall a. Maybe (Param a, a) -> b) -> Integer -> b
withParamIx m f ix' = case Data.Map.lookup ix' m of
  Just (MkParamValue p v) -> f $ Just (p, v)
  Nothing -> f Nothing

byParameter' ::
  (forall b. (forall a. Maybe (Param a, a) -> b) -> s -> b) ->
  ByParameter s
byParameter' f =
  ByParameter
    { getInteger = f \case
        Just (Scalar{}, val) | [v] <- lookupInteger' val -> Just v
        _otherwise -> Nothing
    , getRational = f \case
        Just (Scalar{}, val) | [v] <- lookupRational' val -> Just v
        _otherwise -> Nothing
    , getIntegers = f \case
        Just (param@Collection{}, val) -> lookupInteger param val
        _otherwise -> empty
    , getRationals = f \case
        Just (param@Collection{}, val) -> lookupRational param val
        _otherwise -> empty
    , getCostModels = f \case
        Just (param, val) -> lookupCostModels param val
        _otherwise -> (Nothing, Nothing, Nothing)
    }
