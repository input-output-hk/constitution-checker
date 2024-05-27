{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE ExistentialQuantification #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE ViewPatterns #-}

module Cardano.Constitution.Checker.Checks where

import Cardano.Constitution.Checker.Params.Intervals
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Control.Lens hiding (Context (..), (.=))
import Data.Aeson
import Data.Map (Map)

-- (Map, fromList, toList, unions,empty)

import Cardano.Constitution.Checker.Params.Definition (allParams)
import Data.Aeson.Key (fromString)
import Data.Data (Proxy (..))
import qualified Data.Map as Map
import qualified Data.String as Haskell
import Data.Swagger hiding (Param)
import Data.Text (Text)
import qualified GHC.IsList as Haskell

newtype ParamChecks = ParamChecks (Map String GenericParamCheck)

instance ToJSON ParamChecks where
  toJSON (ParamChecks checks) = object $ f <$> Map.toList checks
   where
    f :: (String, GenericParamCheck) -> (Key, Value)
    f (name', MkGenericParamCheck check') = (fromString name', toJSON check')

data GenericParamCheck = forall a. (ToJSON a) => MkGenericParamCheck (ParamCheck a)

instance ToJSON GenericParamCheck where
  toJSON (MkGenericParamCheck check') = toJSON check'

data ParamCheck a where
  ParamCheck :: !a -> !(Param (Identity a)) -> !(Map String GuardrailResult) -> ParamCheck (Identity a)
  ParamCheckList :: (ToJSON a) => [ParamCheck (Identity a)] -> ParamCheck [a]

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

checkGuardrailsMap :: Map a GuardrailResult -> Bool
checkGuardrailsMap = not . any failed . Map.toList
 where
  failed (_, GuardrailResult result' _ _) = not result'

getParamGuardrailsSchema :: Param a -> Referenced Schema
getParamGuardrailsSchema (Scalar _ _ assertions) =
  Inline $
    mempty
      & type_ ?~ SwaggerObject
      & properties .~ Haskell.fromList (allAssertionSchema assertions)
      & required .~ fmap (Haskell.fromString . fst . assertionDescription) assertions
getParamGuardrailsSchema (Collection _ _ params) = do
  let properties' = concatMap (allAssertionSchema . getParamAssertions) params
      requiredProps = map fst properties'
  Inline $
    mempty
      & type_ ?~ SwaggerObject
      & properties .~ Haskell.fromList properties'
      & required .~ requiredProps

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

paramValToValue :: ParamValue -> Value
paramValToValue (MkParamValue (Scalar{}) val) = toJSON (runIdentity val)
paramValToValue (MkParamValue (Collection _ _ params) val) =
  toJSON $ foldr collect (mempty :: Map String Value) $ zip params val
 where
  collect :: (Param (Identity a), a) -> Map String Value -> Map String Value
  collect (param'@(Scalar{}), val') =
    let jsonValue = (paramValToValue $ MkParamValue param' (Identity val')) -- (toJSON (runIdentity val)) acc
     in Map.insert (paramName param') jsonValue

instance ToSchema ParamChecks where
  declareNamedSchema _ = do
    _ <- declareSchemaRef (Proxy :: Proxy GuardrailResult)
    let schemas = map (Inline . paramCheckSchema) allParams
        keys = map (\(MkParam' param') -> Haskell.fromString $ paramName param') allParams
        xs = zip keys schemas
    let schema' =
          mempty
            & type_
              ?~ SwaggerObject
            & properties
              .~ Haskell.fromList xs

    return $ NamedSchema (Just "ParamChecks") schema'

data GuardrailResult = GuardrailResult
  { result :: !Bool
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
            & required .~ ["result", "description"]
    return $ NamedSchema (Just "GuardrailResult") schema'

checkAssertion :: (Ord a, Show a) => Assertion a -> Context -> a -> SatisfactionResult
checkAssertion ((_, _) `MustNotBe` constraint) _ val =
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
    -- in ParamCheck valColl param' guardRailResults
    ParamCheckList checks

toGuardrailResults :: (Ord a, Show a) => Context -> [Assertion a] -> a -> Map String GuardrailResult
toGuardrailResults ctx assertions val =
  let checks = fmap (\assertion -> checkAssertion assertion ctx val) assertions
      zipped = zip assertions checks
      guardRailResults = Map.fromList $ fmap (uncurry toGuardrailResult) zipped
   in guardRailResults

toGuardrailResult :: Assertion a -> SatisfactionResult -> (String, GuardrailResult)
toGuardrailResult (assertionDescription -> (gId, desc)) = \case
  Satisfied -> (gId, GuardrailResult True desc Nothing)
  Unsatisfied msg -> (gId, GuardrailResult False desc (Just msg))

checkParams :: Context -> ParametersChange -> ParamChecks
checkParams ctx (unParametersChange -> m) =
  ParamChecks $ Map.fromList $ foldr collect mempty (Map.toList m)
 where
  collect ::
    (Integer, ParamValue) ->
    [(String, GenericParamCheck)] ->
    [(String, GenericParamCheck)]
  collect (_, MkParamValue param' val) acc =
    (paramName param', MkGenericParamCheck (paramCheck ctx param' val)) : acc
