{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE ExistentialQuantification #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE ViewPatterns #-}

module Cardano.Constitution.Checker.Checks where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Control.Lens hiding (Context (..), (.=))
import Data.Aeson
import Data.Map (Map)

import Data.Aeson.QQ

-- (Map, fromList, toList, unions,empty)

import Cardano.Constitution.Checker.Params.Definition (allParams)
import Data.Aeson.Key (fromString)
import Data.Data (Proxy (..))
import qualified Data.Map as Map
import qualified Data.Set as Set
import qualified Data.String as Haskell
import Data.Swagger hiding (Param)
import Data.Text (Text)
import qualified GHC.IsList as Haskell

newtype MissingParams = MissingParams (Map String ParamValue)
data ParamChecks = ParamChecks
  { paramChecks :: !(Map String GenericParamCheck)
  , paramChecksMissing :: !MissingParams
  }

instance ToJSON MissingParams where
  toJSON (MissingParams missingParams') = object $ f <$> Map.toList missingParams'
   where
    f :: (String, ParamValue) -> (Key, Value)
    f (name', MkParamValue param' val') = (fromString name', paramValToValue (MkParamValue param' val'))

instance ToJSON ParamChecks where
  toJSON (ParamChecks checks missingParams') =
    object $
      (f <$> Map.toList checks) <> ["missingParamCurrentValues" .= missingParams']
   where
    f :: (String, GenericParamCheck) -> (Key, Value)
    f (name', MkGenericParamCheck check') = (fromString name', toJSON check')

data GenericParamCheck = forall a. (ToJSON a) => MkGenericParamCheck (ParamCheck a)

instance ToJSON GenericParamCheck where
  toJSON (MkGenericParamCheck check') = toJSON check'

data ParamCheck a where
  ParamCheck :: !a -> !(Param (Identity a)) -> !(Map String GuardrailResult) -> ParamCheck (Identity a)
  ParamCheckList :: (ToJSON a) => [ParamCheck (Identity a)] -> ParamCheck [a]
  ParamCheckCostModels ::
    (Maybe PV1, Maybe PV2, Maybe PV3) ->
    Param (Maybe PV1, Maybe PV2, Maybe PV3) ->
    !(Map String GuardrailResult, Map String GuardrailResult, Map String GuardrailResult) ->
    ParamCheck (Maybe PV1, Maybe PV2, Maybe PV3)

instance (ToJSON a) => ToJSON (ParamCheck a) where
  toJSON (ParamCheck val param' check') =
    object
      [ "value" .= paramValToValue (MkParamValue param' (Identity val))
      , "guardrails" .= check'
      , "summary" .= checkGuardrailsMap check'
      ]
  toJSON (ParamCheckList checks) =
    let keys = flip fmap checks \(ParamCheck _ (paramName -> name') _) ->
          Haskell.fromString name'
        values = fmap toJSON checks
        allResults = map (\(ParamCheck _ _ results) -> checkGuardrailsMap results) checks
        allValid = and allResults
     in object $ zip keys values <> [("summary", toJSON allValid)]
  toJSON (ParamCheckCostModels (v1, v2, v3) _ (check1, check2, check3)) =
    let
      keys = map Haskell.fromString ["plutusV1" :: String, "plutusV2", "plutusV3"]
      f (value, check') =
        object
          [ "value" .= toJSON value
          , "guardrails" .= check'
          , "summary" .= checkGuardrailsMap check'
          ]
      values = map f [(v1, check1), (v2, check2), (v3, check3)]
      allResults = map checkGuardrailsMap [check1, check2, check3]
      allValid = and allResults
     in
      object $ zip keys values <> [("summary", toJSON allValid)]

checkGuardrailsMap :: Map a GuardrailResult -> Bool
checkGuardrailsMap = not . any failed . Map.toList
 where
  failed (_, GuardrailResult result' _ _) = result' == Just False

getParamGuardrailsSchema :: Param (Identity a) -> Referenced Schema
getParamGuardrailsSchema (Scalar _ _ assertions) =
  Inline $
    mempty
      & type_ ?~ SwaggerObject
      & properties .~ Haskell.fromList (allAssertionSchema assertions)
      & required .~ fmap (Haskell.fromString . fst . assertionDescription) assertions

getCostModelsGuardrailsSchema :: [Assertion (Maybe [Integer])] -> Referenced Schema
getCostModelsGuardrailsSchema assertions =
  Inline $
    mempty
      & type_ ?~ SwaggerObject
      & properties .~ Haskell.fromList (allAssertionSchema assertions)
      & required .~ fmap (Haskell.fromString . fst . assertionDescription) assertions

allAssertionSchema :: [Assertion a] -> [(Text, Referenced Schema)]
allAssertionSchema = fmap toProperty
 where
  toProperty :: Assertion a -> (Text, Referenced Schema)
  toProperty assertion =
    ( Haskell.fromString $ fst $ assertionDescription assertion
    , toSchemaRef (Proxy :: Proxy GuardrailResult)
    )

paramCheckSchema :: Param' -> Schema
paramCheckSchema (MkParam' param'@(Scalar{})) =
  mempty
    & type_ ?~ SwaggerObject
    & properties
      .~ [ ("summary", toSchemaRef (Proxy :: Proxy Bool))
         , ("value", Inline $ paramToSchema param')
         , ("guardrails", getParamGuardrailsSchema param')
         ]
    & required .~ ["summary", "value", "guardrails"]
paramCheckSchema (MkParam' (Collection _ _ params)) =
  let subParamSchemas = map (Inline . paramCheckSchema . MkParam') params
      subParamKeys = map (Haskell.fromString . paramName) params
      subParamProperties = zip subParamKeys subParamSchemas
   in mempty
        & type_ ?~ SwaggerObject
        & required .~ ("summary" : subParamKeys)
        & properties
          .~ Haskell.fromList
            ( ("summary", toSchemaRef (Proxy :: Proxy Bool)) : subParamProperties
            )
paramCheckSchema (MkParam' (CostModels _ v1a v2a v3a)) =
  let ex assertions =
        mempty
          & type_ ?~ SwaggerObject
          & properties
            .~ [ ("summary", toSchemaRef (Proxy :: Proxy Bool))
               , ("value", toSchemaRef (Proxy :: Proxy [Integer]))
               , ("guardrails", getCostModelsGuardrailsSchema assertions)
               ]
          & required .~ ["summary", "value", "guardrails"]
   in mempty
        & type_ ?~ SwaggerObject
        & required .~ ["summary"]
        & properties
          .~ Haskell.fromList
            [ ("summary", toSchemaRef (Proxy :: Proxy Bool))
            , ("plutusV1", Inline $ ex v1a)
            , ("plutusV2", Inline $ ex v2a)
            , ("plutusV3", Inline $ ex v3a)
            ]

paramValToValue :: ParamValue -> Value
paramValToValue (MkParamValue (Scalar{}) val) = toJSON (runIdentity val)
paramValToValue (MkParamValue (Collection _ _ params) val) =
  toJSON $ foldr collect (mempty :: Map String Value) $ zip params val
 where
  collect :: (Param (Identity a), a) -> Map String Value -> Map String Value
  collect (param'@(Scalar{}), val') =
    let jsonValue = (paramValToValue $ MkParamValue param' (Identity val')) -- (toJSON (runIdentity val)) acc
     in Map.insert (paramName param') jsonValue
paramValToValue (MkParamValue (CostModels{}) (v1, v2, v3)) =
  toJSON
    [aesonQQ| { "plutusV1":  #{v1} ,
                "plutusV2":  #{v2} ,
                "plutusV3":  #{v3}
              }|]

instance ToSchema MissingParams where
  declareNamedSchema _ = do
    let schemas = map (\(MkParam' param) -> Inline $ paramToSchema param) allParams
        keys = map (\(MkParam' param') -> Haskell.fromString $ paramName param') allParams
        xs = zip keys schemas
    let schema' =
          mempty
            & type_
              ?~ SwaggerObject
            & properties
              .~ Haskell.fromList xs

    return $ NamedSchema (Just "MissingParams") schema'

instance ToSchema ParamChecks where
  declareNamedSchema _ = do
    _ <- declareSchemaRef (Proxy :: Proxy GuardrailResult)
    missingParamsSchema <- declareSchemaRef (Proxy :: Proxy MissingParams)
    let schemas = map (Inline . paramCheckSchema) allParams
        keys = map (\(MkParam' param') -> Haskell.fromString $ paramName param') allParams
        xs = zip keys schemas
    let schema' =
          mempty
            & type_
              ?~ SwaggerObject
            & properties
              .~ (Haskell.fromList xs <> [("missingParamCurrentValues", missingParamsSchema)])

    return $ NamedSchema (Just "ParamChecks") schema'

data GuardrailResult = GuardrailResult
  { result :: !(Maybe Bool)
  , description :: !String
  , message :: !(Maybe String)
  }

instance ToJSON GuardrailResult where
  toJSON (GuardrailResult result' description' message') =
    object
      [ "result" .= result'
      , "description" .= description'
      , "message" .= message'
      ]

instance ToSchema GuardrailResult where
  declareNamedSchema _ = do
    stringSchema <- declareSchemaRef (Proxy :: Proxy String)
    boolSchema <- declareSchemaRef (Proxy :: Proxy Bool)
    let schema' =
          mempty
            & type_
              ?~ SwaggerObject
            & properties
              .~ [ ("result", boolSchema)
                 , ("description", stringSchema)
                 , ("message", stringSchema)
                 ]
            & required .~ ["description"]
    return $ NamedSchema (Just "GuardrailResult") schema'

checkAssertion :: (Ord a, Show a) => Assertion a -> Context -> a -> SatisfactionResult
checkAssertion ((_, _) `MustBe` constraint) _ val =
  if check' constraint
    then Satisfied
    else Unsatisfied $ getUnsatisfiedMessage constraint
 where
  check' (NL l) = l <= val
  check' (NG g) = g >= val
  check' (NLEQ le) = le < val
  check' (NGEQ ge) = ge > val
  check' (NEQ e) = e /= val

  getUnsatisfiedMessage (NL l) = prefix' ++ "less than " ++ show l
  getUnsatisfiedMessage (NG g) = prefix' ++ "greater than " ++ show g
  getUnsatisfiedMessage (NLEQ le) = prefix' ++ "less than or equal to " ++ show le
  getUnsatisfiedMessage (NGEQ ge) = prefix' ++ "greater than or equal to " ++ show ge
  getUnsatisfiedMessage (NEQ e) = prefix' ++ "equal to " ++ show e

  prefix' = "Value (" ++ show val ++ ") must not be "
checkAssertion ((_, _) `ShouldSatisfy` f) ctx val = f ctx val

paramCheck :: forall a. Context -> Param a -> a -> ParamCheck a
paramCheck ctx param'@(Scalar _ _ assertions) (Identity val) =
  ParamCheck val param' (toGuardrailResults ctx assertions val)
paramCheck ctx (Collection _ _ params) valColl =
  let
    paired = zip params $ fmap Identity valColl
    checks = fmap (uncurry $ paramCheck ctx) paired
   in
    ParamCheckList checks
paramCheck ctx param'@(CostModels _ av1 av2 av3) val@(v1, v2, v3) =
  ParamCheckCostModels
    val
    param'
    ( toGuardrailResults ctx av1 v1
    , toGuardrailResults ctx av2 v2
    , toGuardrailResults ctx av3 v3
    )

toGuardrailResults ::
  (Ord a, Show a) =>
  Context ->
  [Assertion a] ->
  a ->
  Map String GuardrailResult
toGuardrailResults ctx assertions val =
  let checks = fmap (\assertion -> checkAssertion assertion ctx val) assertions
      zipped = zip assertions checks
      guardRailResults = Map.fromList $ fmap (uncurry toGuardrailResult) zipped
   in guardRailResults

toGuardrailResult :: Assertion a -> SatisfactionResult -> (String, GuardrailResult)
toGuardrailResult (assertionDescription -> (gId, desc)) = \case
  Satisfied -> (gId, GuardrailResult (Just True) desc Nothing)
  Unsatisfied msg -> (gId, GuardrailResult (Just False) desc (Just msg))
  Neutral msg -> (gId, GuardrailResult Nothing desc (Just msg))

type CurrentParams = ParametersChange
checkParams :: CurrentParams -> Context -> ParametersChange -> ParamChecks
checkParams (MkParametersChange currentParams) ctx (unParametersChange -> m) =
  ParamChecks
    { paramChecks = Map.fromList $ foldr collect mempty (Map.toList m)
    , paramChecksMissing =
        MissingParams $
          Map.fromList $
            filter (\(k, _) -> not $ Set.member k allProvidedParamsNames) $
              (\(_, param@(MkParamValue p _)) -> (paramName p, param))
                <$> Map.toList currentParams
    }
 where
  allProvidedParamsNames :: Set.Set String =
    Set.fromList $
      (\(MkParamValue p _) -> paramName p) <$> Map.elems m
  collect ::
    (Integer, ParamValue) ->
    [(String, GenericParamCheck)] ->
    [(String, GenericParamCheck)]
  collect (_, MkParamValue param' val) acc =
    (paramName param', MkGenericParamCheck (paramCheck ctx param' val)) : acc
