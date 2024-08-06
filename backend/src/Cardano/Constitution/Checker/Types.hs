{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedRecordDot #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE ScopedTypeVariables #-}

module Cardano.Constitution.Checker.Types (
  EpochParameters (..),
  ParametersChange (..),
  mkParametersChangeUnsafe,
  ParamValue (..),
  unParametersChange,
  protocolParamsToEpochParams,
) where

import Cardano.Constitution.Checker.Base
import Cardano.Constitution.Checker.Params.Definition
import Cardano.Constitution.Checker.Params.Types
import Data.Aeson.QQ

import qualified Data.Aeson.KeyMap as KM

import Blockfrost.Client (Epoch)
import Cardano.Constitution.Checker.Blockfrost.Base (ProtocolParams (..))
import Control.Applicative ((<|>))
import Control.Lens hiding (Context, (.=))
import Control.Monad (foldM)
import Data.Aeson
import Data.Aeson.Types (Parser)
import Data.Data (Proxy (..))
import Data.HashMap.Strict (HashMap)
import qualified Data.HashMap.Strict as HashMap
import Data.Map
import Data.String
import Data.Swagger hiding (Param)
import Data.Text (Text)
import qualified Data.Text as Text
import qualified GHC.IsList as Haskell
import Web.FormUrlEncoded

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

--------------------------------------------------------------------------------
-- TODO: move these from Types (maybe into API)
paramValueFromCurrent :: ProtocolParams -> ParamWithCurrentValue -> ParamValue
paramValueFromCurrent currentValues' (ParamWithCurrentValue param@(Scalar{}) f) =
  MkParamValue param (f currentValues')
paramValueFromCurrent currentValues' (ParamWithCurrentValue param@(Collection{}) f) =
  MkParamValue param (f currentValues')
paramValueFromCurrent currentValues' (ParamWithCurrentValue param@(CostModels{}) f) =
  MkParamValue param (f currentValues')

protocolParamsToEpochParams :: ProtocolParams -> EpochParameters
protocolParamsToEpochParams currentValues' =
  EpochParameters (_protocolParamsEpoch currentValues') $
    mkParametersChangeUnsafe $
      fmap (paramValueFromCurrent currentValues') allParamsWithCurrentValues

--------------------------------------------------------------------------------

instance Show ParamValue where
  show (MkParamValue (Scalar _ name' _) val) = name' ++ ": " ++ show (runIdentity val)
  show (MkParamValue (Collection _ name' _) val) = name' ++ ": " ++ show val
  show (MkParamValue (CostModels{}) val) = "costModels" ++ ": " ++ show val

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
    f (paramIx', MkParamValue ((CostModels{})) (v1, v2, v3)) =
      ( fromString $ show paramIx'
      , toJSON
          [aesonQQ| { "plutusV1":  #{v1} ,
                "plutusV2":  #{v2} ,
                "plutusV3":  #{v3}
              }|]
      )

instance FromForm ParametersChange where
  fromForm (Form hs) = do
    MkParametersChange <$> foldM parseParam empty allParams
   where
    parseParam ::
      Map Integer ParamValue ->
      Param' ->
      Either Text (Map Integer ParamValue)
    parseParam acc (MkParam' param@(Scalar paramIx' paramName' _)) = do
      valueM <- searchSingleParam hs paramName'
      case valueM of
        Nothing -> pure acc
        Just value -> pure $ insert paramIx' (MkParamValue param value) acc
    parseParam acc (MkParam' param@(Collection paramIx' pname xs)) = do
      let subParamFormName = ((pname ++ "-") ++) . paramName
          subParamFormNames = fmap subParamFormName xs
          anyParamExists =
            let pExists pname' = case (`HashMap.lookup` hs) $ Text.pack pname' of
                  Just (x : _) | x /= "" -> True
                  _other -> False
             in any pExists subParamFormNames
      xs' <- mapM (searchSingleParam hs) (fmap subParamFormName xs)
      case (sequence xs', anyParamExists) of
        (_, False) -> pure acc
        (Nothing, _) ->
          Left $
            "not all values provided for collection \"" <> Text.pack pname <> "\""
        (Just xs'', _)
          | Identity vs <- sequence xs'' ->
              pure $ insert paramIx' (MkParamValue param vs) acc
    -- TODO: asda
    parseParam acc (MkParam' CostModels{}) = pure acc

searchSingleParam ::
  (FromJSON a) =>
  HashMap Text [Text] ->
  String ->
  Either Text (Maybe (Identity a))
searchSingleParam hs pname = do
  let textM = HashMap.lookup (Text.pack pname) hs
  case textM of
    Nothing -> pure Nothing
    Just [] -> pure Nothing
    Just ("" : _) -> pure Nothing
    Just (text : _) ->
      -- if text contains "/" add " around it
      let text' = if "/" `Text.isInfixOf` text then "\"" <> text <> "\"" else text
       in Just
            <$> mapLeft
              (Text.pack . ((pname ++ ": ") ++))
              (eitherDecode' $ fromString $ Text.unpack text')

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
        Nothing -> pure acc
        Just (paramIx', value) -> pure $ insert paramIx' value acc

    parseParam :: Object -> Param' -> Parser (Maybe (Integer, ParamValue))
    parseParam o (MkParam' param@(Scalar paramIx' paramName' _)) = do
      valueM <- extractFromIxOrName o paramIx' paramName'
      case valueM of
        Nothing -> pure Nothing
        Just value -> do
          val <- parseScalar param value
          pure $ Just (paramIx', MkParamValue param val)
    parseParam o (MkParam' param@(Collection paramIx' paramName' _)) = do
      valueM <- extractFromIxOrName o paramIx' paramName'
      case valueM of
        Nothing -> pure Nothing
        Just value -> do
          val <- parseCollection param value
          pure $ Just (paramIx', MkParamValue param val)
    parseParam o (MkParam' param@(CostModels paramIx' _ _ _)) = do
      valueM <- extractFromIxOrName o paramIx' "costModels"
      case valueM of
        Nothing -> pure Nothing
        Just value -> do
          val <- parseCostModels param value
          pure $ Just (paramIx', MkParamValue param val)

extractFromIxOrName :: Object -> Integer -> String -> Parser (Maybe Value)
extractFromIxOrName o paramIx' paramName' = do
  valueFromIxM :: Maybe Value <- o .:? fromString (show paramIx')
  valueFromNameM :: Maybe Value <- o .:? fromString paramName'
  pure $ valueFromIxM <|> valueFromNameM

parseCollection :: Param [a] -> Value -> Parser [a]
parseCollection (Collection _ _ params) = withObject "Collection" $ \obj ->
  mapM (parseParam obj) params
 where
  parseParam :: Object -> Param (Identity a) -> Parser a
  parseParam obj param = do
    let paramName' = fromString $ paramName param
    value <- obj .: paramName'
    val <- parseScalar param value
    pure $ runIdentity val

parseScalar :: Param (Identity a) -> Value -> Parser (Identity a)
parseScalar (Scalar _ paramName' _) value =
  case fromJSON value of
    Success a -> pure a
    Error e -> fail $ paramName' ++ ": " ++ e

parseCostModels :: Param (Maybe PV1, Maybe PV2, Maybe PV3) -> Value -> Parser (Maybe PV1, Maybe PV2, Maybe PV3)
parseCostModels CostModels{} = withObject "CostModels" $ \obj ->
  (,,) <$> obj .:? "plutusV1" <*> obj .:? "plutusV2" <*> obj .:? "plutusV3"

instance ToSchema ParametersChange where
  declareNamedSchema _ = do
    pure $
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

data EpochParameters = EpochParameters
  { epoch :: !Epoch
  , parameters :: !ParametersChange
  }
  deriving (Show)

instance ToJSON EpochParameters where
  -- extends ParametersChange JSON instance with epoch field
  toJSON (EpochParameters epoch' params) =
    Object (x <> y)
   where
    x = case toJSON params of
      Object obj -> obj
      _otherwise -> KM.empty
    y = KM.fromList ["epoch" .= epoch']

instance FromJSON EpochParameters where
  -- extends ProtocolParams JSON instance with epoch field
  parseJSON = withObject "EpochParameters" $ \o -> do
    epoch' <- o .: "epoch"
    params <- parseJSON (Object o)
    pure $ EpochParameters epoch' params

instance ToSchema EpochParameters where
  declareNamedSchema _ = do
    epochSchema <- declareSchemaRef (Proxy :: Proxy Int)
    parametersSchema <- declareSchema (Proxy :: Proxy ParametersChange)
    pure $
      NamedSchema (Just "EpochParameters") $
        parametersSchema
          & properties %~ (`mappend` [("epoch", epochSchema)])
          & required %~ (<> ["epoch"])
