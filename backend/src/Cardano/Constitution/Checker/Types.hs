{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveDataTypeable #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE ExistentialQuantification #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE MultiWayIf #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE RecordWildCards #-}

module Cardano.Constitution.Checker.Types (
  ParameterChange,
  mkParameterChangeUnsafe,
  ParamValue (..),
) where

import Cardano.Constitution.Checker.Params.Definition
import Cardano.Constitution.Checker.Params.Types

import Control.Monad (foldM)
import Data.Aeson
import Data.Aeson.Types (Parser)
import Data.Functor.Identity
import Data.Map
import Data.Proxy
import Data.String

import Control.Lens hiding ((.=))

import Data.Swagger hiding (Param)
import qualified Data.Vector as V

-- import qualified Data.Swagger as SWG

newtype ParameterChange = MkParameterChange (Map Integer ParamValue)
  deriving (Show, Eq)

mkParameterChangeUnsafe :: [ParamValue] -> ParameterChange
mkParameterChangeUnsafe = Prelude.foldr f (MkParameterChange empty)
 where
  f :: ParamValue -> ParameterChange -> ParameterChange
  f (MkParamValue param val) (MkParameterChange m) =
    MkParameterChange $ insert (paramIx param) (MkParamValue param val) m

data ParamValue = forall a. MkParamValue !(Param a) !a

instance Show ParamValue where
  show (MkParamValue (Scalar _ name' _) val) = name' ++ ": " ++ show (runIdentity val)
  show (MkParamValue (Collection _ name' _) val) = name' ++ ": " ++ show val

instance Eq ParamValue where
  (MkParamValue (Scalar{}) a) == (MkParamValue (Scalar{}) b) = show a == show b
  (MkParamValue (Collection{}) a) == (MkParamValue (Collection{}) b) = show a == show b
  _ == _ = False

instance ToJSON ParameterChange where
  toJSON (MkParameterChange m) = object $ f <$> toList m
   where
    f :: (Integer, ParamValue) -> (Key, Value)
    f (paramIx', MkParamValue ((Scalar{})) val) =
      (fromString $ show paramIx', toJSON (runIdentity val))
    f (paramIx', MkParamValue ((Collection{})) val) =
      (fromString $ show paramIx', toJSON val)

instance FromJSON ParameterChange where
  parseJSON = withObject "ParamValue" $ \o -> do
    -- for all allParams, parse the value from the object and accumulate them
    -- into Map Integer ParamValue
    MkParameterChange <$> foldM (f o) empty allParams
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
parseCollection (Collection _ _ params) = withArray "Collection" $ \arr ->
  mapM parseParam (zip params (V.toList arr))
 where
  parseParam :: (Param (Identity a), Value) -> Parser a
  parseParam (param, value) = do
    val <- parseScalar param value
    return $ runIdentity val

parseScalar :: Param (Identity a) -> Value -> Parser (Identity a)
parseScalar (Scalar _ paramName _) value =
  case fromJSON value of
    Success a -> return a
    Error e -> fail $ paramName ++ ": " ++ e

instance ToSchema ParameterChange where
  declareNamedSchema _ = do
    certOptNumTestsSchema <- declareSchemaRef (Proxy :: Proxy ())
    return $
      NamedSchema (Just "ParametersChange") $
        mempty
          & type_ ?~ SwaggerObject
          & properties
            .~ [("certOptNumTests", certOptNumTestsSchema)]

-- & type_ ?~ SwaggerString
-- & SL.pattern ?~ ghAccessTokenPattern
