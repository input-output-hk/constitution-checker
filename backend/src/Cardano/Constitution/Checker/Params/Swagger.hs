{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE UndecidableInstances #-}
{-# OPTIONS_GHC -Wno-orphans #-}

module Cardano.Constitution.Checker.Params.Swagger where

import Cardano.Constitution.Checker.Params.Types

import Data.Aeson
import Data.Functor.Identity
import Data.String

import Control.Lens hiding ((.=))

import Data.Swagger hiding (Param)

import Data.Data (Proxy (..))
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
      & example
        ?~ ( case (lowerM, upperM) of
              (Just lower, _) ->
                toJSON lower
              (_, Just upper) ->
                toJSON upper
              _otherwise -> toJSON ([1, 1] :: [Integer])
           )

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

instance (ParamToSchema (Identity a)) => ParamToSchema [a] where
  paramToSchema = paramToSchemaCol

instance ParamToSchema (Maybe PV1, Maybe PV2, Maybe PV3) where
  paramToSchema _ = do
    let listSchema = toSchemaRef (Proxy :: Proxy [Integer])

    mempty
      & type_
        ?~ SwaggerObject
      & title
        ?~ fromString "costModels"
      & properties
        .~ [ ("plutusV1", listSchema)
           , ("plutusV2", listSchema)
           , ("plutusV3", listSchema)
           ]

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
