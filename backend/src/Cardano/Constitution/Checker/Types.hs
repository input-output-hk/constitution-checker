{-# LANGUAGE GADTs #-}
{-# LANGUAGE OverloadedStrings #-}

module Cardano.Constitution.Checker.Types (
  ParametersChange,
  mkParametersChangeUnsafe,
  ParamValue (..),
  unParametersChange,
) where

import Cardano.Constitution.Checker.Params.Definition
import Cardano.Constitution.Checker.Params.Types

import Control.Monad (foldM)
import Data.Aeson
import Data.Aeson.Types (Parser)
import Data.Functor.Identity
import Data.Map hiding (fromList)
import Data.String

import Control.Lens hiding ((.=))

import Data.Swagger hiding (Param)

import qualified GHC.IsList as Haskell

-- import qualified Data.Swagger as SWG

newtype ParametersChange = MkParametersChange (Map Integer ParamValue)
  deriving (Show, Eq)

unParametersChange :: ParametersChange -> Map Integer ParamValue
unParametersChange (MkParametersChange m) = m

mkParametersChangeUnsafe :: [ParamValue] -> ParametersChange
mkParametersChangeUnsafe = Prelude.foldr f (MkParametersChange empty)
 where
  f :: ParamValue -> ParametersChange -> ParametersChange
  f (MkParamValue param val) (MkParametersChange m) =
    MkParametersChange $ insert (paramIx param) (MkParamValue param val) m

data ParamValue = forall a. (ToJSON a) => MkParamValue !(Param a) !a

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
    f (paramIx', MkParamValue ((Collection{})) val) =
      (fromString $ show paramIx', toJSON val)

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
