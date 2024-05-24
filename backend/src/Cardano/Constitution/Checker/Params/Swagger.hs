{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# OPTIONS_GHC -Wno-orphans #-}

module Cardano.Constitution.Checker.Params.Swagger where

import Cardano.Constitution.Checker.Params.Types

import Data.Aeson
import Data.Functor.Identity
import Data.String

import Control.Lens hiding ((.=))

import Data.Swagger hiding (Param)

import qualified GHC.IsList as Haskell
import Prelude hiding (Rational)

instance ParamToSchema (Identity Integer) where
  paramToSchema param@(Scalar _ name' _) = do
    let (lowerM, upperM) = boundaries param
        prefix' = case lowerM of
          Just lower -> show lower ++ " <= "
          Nothing -> ""
        suffix = case upperM of
          Just upper -> " <= " ++ show upper
          Nothing -> ""
    mempty
      & type_
        ?~ SwaggerInteger
      & title
        ?~ fromString name'
      & description
        ?~ fromString (prefix' ++ name' ++ suffix)

instance ParamToSchema (Identity Rational) where
  paramToSchema param@(Scalar _ name' _) = do
    let (lowerM, upperM) = boundaries param
        prefix' = case lowerM of
          Just lower -> "[" ++ show (numerator lower) ++ "," ++ show (denominator lower) ++ "] <= "
          Nothing -> ""
        suffix = case upperM of
          Just upper -> " <= [" ++ show (numerator upper) ++ "," ++ show (denominator upper) ++ "]"
          Nothing -> ""
    -- declareNamedSchema (Proxy :: Proxy a)
    mempty
      & type_
        ?~ SwaggerArray
      & title
        ?~ fromString name'
      & minItems
        ?~ 2
      & maxItems
        ?~ 2
      & example
        ?~ ( case (lowerM, upperM) of
              (Just lower, _) ->
                toJSON ([numerator lower, denominator lower] :: [Integer])
              (_, Just upper) ->
                toJSON ([numerator upper, denominator upper] :: [Integer])
              _otherwise -> toJSON ([1, 1] :: [Integer])
           )
      & description
        ?~ fromString (prefix' ++ name' ++ suffix)

instance ParamToSchema [Rational] where
  paramToSchema = paramToSchemaCol

instance ParamToSchema [Integer] where
  paramToSchema = paramToSchemaCol

paramToSchemaCol :: (ParamToSchema (Identity a)) => Param [a] -> Schema
paramToSchemaCol (Collection _ name' params) = do
  let schemas = Inline <$> Prelude.map paramToSchema params
      paramNames = Prelude.map (fromString . paramName) params
  mempty
    & type_
      ?~ SwaggerObject
    & title
      ?~ fromString name'
    & properties
      .~ Haskell.fromList (zip paramNames schemas)
    & required
      .~ paramNames
