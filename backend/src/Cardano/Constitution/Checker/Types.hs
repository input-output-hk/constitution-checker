{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RankNTypes #-}

module Cardano.Constitution.Checker.Types (
  ParametersChange,
  mkParametersChangeUnsafe,
  ParamValue (..),
  unParametersChange,
  mkContext,
  allCurrentParamsValues,
) where

import Cardano.Constitution.Checker.Params.Definition
import Cardano.Constitution.Checker.Params.Types

import Cardano.Constitution.Checker.Blockfrost (ProtocolParams)
import Cardano.Constitution.Checker.Params.Lookup
import Control.Lens hiding (Context, (.=))
import Control.Monad (foldM)
import Data.Aeson
import Data.Aeson.Types (Parser)
import Data.Map hiding (fromList)
import Data.String
import Data.Swagger hiding (Param)
import qualified GHC.IsList as Haskell

-- import qualified Data.Swagger as SWG

newtype ParametersChange = MkParametersChange (Map Integer ParamValue)
  deriving (Show, Eq)

mkContext :: ParametersChange -> ProtocolParams -> Context
mkContext (MkParametersChange m) = Context byName' byIx'
 where
  xs = snd <$> toList m
  byName' = byParameter' withParamName
  byIx' = byParameter' withParamIx

  nameMap :: Map String ParamValue
  nameMap = Haskell.fromList $ zip allNames xs

  allNames = fmap (\(MkParamValue p _) -> paramName p) xs

  withParamIx :: (forall a. Maybe (Param a, a) -> b) -> Integer -> b
  withParamIx f ix' = case Data.Map.lookup ix' m of
    Just (MkParamValue p v) -> f $ Just (p, v)
    Nothing -> f Nothing

  withParamName :: (forall a. Maybe (Param a, a) -> b) -> String -> b
  withParamName f name' = case Data.Map.lookup name' nameMap of
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
    }

unParametersChange :: ParametersChange -> Map Integer ParamValue
unParametersChange (MkParametersChange m) = m

mkParametersChangeUnsafe :: [ParamValue] -> ParametersChange
mkParametersChangeUnsafe = Prelude.foldr f (MkParametersChange empty)
 where
  f :: ParamValue -> ParametersChange -> ParametersChange
  f (MkParamValue param val) (MkParametersChange m) =
    MkParametersChange $ insert (paramIx param) (MkParamValue param val) m

data ParamValue = forall a. (ToJSON a) => MkParamValue !(Param a) !a

--------------------------------------------------------------------------------
-- TODO: move these from Types (maybe into API)
paramValueFromCurrent :: ProtocolParams -> ParamWithCurrentValue -> ParamValue
paramValueFromCurrent currentValues (ParamWithCurrentValue param@(Scalar{}) f) =
  MkParamValue param (f currentValues)
paramValueFromCurrent currentValues (ParamWithCurrentValue param@(Collection{}) f) =
  MkParamValue param (f currentValues)

allCurrentParamsValues :: ProtocolParams -> ParametersChange
allCurrentParamsValues currentValues =
  mkParametersChangeUnsafe $
    fmap (paramValueFromCurrent currentValues) allParamsWithCurrentValues

--------------------------------------------------------------------------------

instance Show ParamValue where
  show (MkParamValue (Scalar _ name' _) val) = name' ++ ": " ++ show (runIdentity val)
  show (MkParamValue (Collection _ name' _) val) = name' ++ ": " ++ show val

instance Eq ParamValue where
  (MkParamValue (Scalar{}) a) == (MkParamValue (Scalar{}) b) = show a == show b
  (MkParamValue (Collection{}) a) == (MkParamValue (Collection{}) b) = show a == show b
  _ == _ = False

instance ToJSON ParametersChange where
  toJSON (MkParametersChange m) = object $ f <$> toList m
   where
    f :: (Integer, ParamValue) -> (Key, Value)
    f (paramIx', MkParamValue ((Scalar{})) val) =
      (fromString $ show paramIx', toJSON (runIdentity val))
    f (paramIx', MkParamValue ((Collection _ _ params)) val) =
      let paramNames = fmap paramName params
          obj = object $ zipWith (\name' v -> fromString name' .= toJSON v) paramNames val
       in (fromString $ show paramIx', obj)

instance FromJSON ParametersChange where
  parseJSON = withObject "ParamValue" $ \o -> do
    -- for all allParams, parse the value from the object and accumulate them
    -- into Map Integer ParamValue
    MkParametersChange <$> foldM (f o) empty allParams
   where
    f :: Object -> Map Integer ParamValue -> Param' -> Parser (Map Integer ParamValue)
    f o acc param = do
      valueM <- parseParam o param
      case valueM of
        Nothing -> return acc
        Just (paramIx', value) -> return $ insert paramIx' value acc

    parseParam :: Object -> Param' -> Parser (Maybe (Integer, ParamValue))
    parseParam o (MkParam' pram@(Scalar paramIx' _ _)) = do
      valueM <- o .:? fromString (show paramIx')
      case valueM of
        Nothing -> return Nothing
        Just value -> do
          val <- parseScalar pram value
          return $ Just (paramIx', MkParamValue pram val)
    parseParam o (MkParam' pram@(Collection paramIx' _ _)) = do
      valueM <- o .:? fromString (show paramIx')
      case valueM of
        Nothing -> return Nothing
        Just value -> do
          val <- parseCollection pram value
          return $ Just (paramIx', MkParamValue pram val)

parseCollection :: Param [a] -> Value -> Parser [a]
parseCollection (Collection _ _ params) = withObject "Collection" $ \obj ->
  mapM (parseParam obj) params
 where
  parseParam :: Object -> Param (Identity a) -> Parser a
  parseParam obj param = do
    let paramName' = fromString $ paramName param
    value <- obj .: paramName'
    val <- parseScalar param value
    return $ runIdentity val

parseScalar :: Param (Identity a) -> Value -> Parser (Identity a)
parseScalar (Scalar _ paramName' _) value =
  case fromJSON value of
    Success a -> return a
    Error e -> fail $ paramName' ++ ": " ++ e

instance ToSchema ParametersChange where
  declareNamedSchema _ = do
    return $
      NamedSchema (Just "ParametersChange") $
        mempty
          & type_ ?~ SwaggerObject
          & properties
            .~ allProperties
   where
    allProperties = Haskell.fromList $ fmap toProperty' allParams
    toProperty' (MkParam' param) = toProperty param
    toProperty param =
      ( fromString $ show $ paramIx param
      , Inline $ paramToSchema param
      )

-- & type_ ?~ SwaggerString
-- & SL.pattern ?~ ghAccessTokenPattern
