{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.Web where

import Cardano.Constitution.Checker.Checks
import Cardano.Constitution.Checker.Params.Definition (allParams)
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Cardano.Constitution.Checker.Web.Internal
import Data.Aeson (ToJSON)
import Data.ByteString.Lazy.Char8 as BSL8
import Data.Functor.Identity (Identity (..))
import Data.List (sortOn)
import Data.String (fromString)
import Data.Text as Text
import Data.Text.Encoding
import Network.HTTP.Media ((//), (/:))
import Servant.API as Servant
import Servant.Server
import Web.FormUrlEncoded
import Prelude as Haskell

import qualified Data.Aeson as Aeson
import qualified Data.HashMap.Strict as HashMap
import qualified Data.Map as Map
import Debug.Trace (traceShow)

homePage :: Bool -> CurrentParams -> ParamChecks' -> Text
homePage viewParamsResult currentParams checks =
  [textF|src/Cardano/Constitution/Checker/Web/Template/master.html|]
 where
  viewParamResultInput = viewParamResult False viewParamsResult
  inputs = inputList currentParams checks
  mainView = [textF|src/Cardano/Constitution/Checker/Web/Template/main-view.html|]
  tabs = tabBar (not viewParamsResult) False
  table = tableView viewParamsResult False checks Nothing
  searchInput = [textF|src/Cardano/Constitution/Checker/Web/Template/search-bar.html|]

type SwapOOB = Bool

inputList :: CurrentParams -> ParamChecks' -> Text
inputList currentParams checks =
  Text.concat $
    Haskell.map
      input
      (inputsByCurrentParams currentParams checks)

tabButton :: Bool -> Text -> Text -> Text
tabButton active text btnName =
  [textF|src/Cardano/Constitution/Checker/Web/Template/tab-button.html|]
 where
  (buttonClass, activeClass) =
    if active
      then ("active", "active")
      else ("inactive", "inactive")

tabBar :: Bool -> Bool -> Text
tabBar fstActive swapOOB' =
  [textF|src/Cardano/Constitution/Checker/Web/Template/tabs.html|]
 where
  swapOOB = if swapOOB' then "true" else "false"
  tabButtons =
    Text.concat $
      Haskell.map
        (\(text, active, btnName) -> tabButton active text btnName)
        [ ("Guardrails", fstActive, "guardRails")
        , ("Proposal Parameters", not fstActive, "parameters")
        ]

viewParamResult :: Bool -> Bool -> Text
viewParamResult swapOOB' viewParams =
  [textF|src/Cardano/Constitution/Checker/Web/Template/view-params-result.html|]
 where
  swapOOB = if swapOOB' then "true" else "false"
  hiddenInput = if viewParams then "<input type=\"hidden\" name=\"view-params-result\"/>" else ""

type ShowParams = Bool
type Filter = Maybe Text

tableView :: ShowParams -> SwapOOB -> ParamChecks' -> Filter -> Text
tableView showParamResult swapOOB checks =
  if showParamResult
    then parameterTable swapOOB checks
    else guardrailsTable swapOOB checks

parameterTable :: SwapOOB -> ParamChecks' -> Filter -> Text
parameterTable swapOOB' (ParamChecks' proposed missing) filterM =
  [textF|src/Cardano/Constitution/Checker/Web/Template/parameters-table.html|]
 where
  swapOOB = if swapOOB' then "true" else "false"
  paramRows =
    Haskell.filter (filterParamRow filterM) $
      sortOn parameterRowParamName (proposedRows ++ missingRows)

  proposedRows = Haskell.concatMap (uncurry (toParameterRow encodeToForm)) $ Map.toList proposed
  missingRows = Haskell.concatMap (uncurry (toParameterRow (const "-"))) $ Map.toList missing
  fstColumn =
    let f ParameterRow{..} = parameterFstCell parameterRowStatus parameterRowParamName
     in Text.concat $ Haskell.map f paramRows
  proposedColumn =
    let f ParameterRow{..} = parameterProposedCell parameterRowValue
     in Text.concat $ Haskell.map f paramRows
  actionColumn =
    let f _ = [textF|src/Cardano/Constitution/Checker/Web/Template/parameter-action-cell.html|]
     in Text.concat $ Haskell.map f paramRows

parameterFstCell :: Bool -> Text -> Text
parameterFstCell result parameterName =
  let ellipseColorClass = if result then "green" else "red"
   in [textF|src/Cardano/Constitution/Checker/Web/Template/parameter-fst-cell.html|]

parameterProposedCell :: Text -> Text
parameterProposedCell proposedValue =
  [textF|src/Cardano/Constitution/Checker/Web/Template/parameter-proposed-cell.html|]

guardrailsTable :: SwapOOB -> ParamChecks' -> Filter -> Text
guardrailsTable swapOOB' ParamChecks'{..} filterM =
  traceShow filterM $ [textF|src/Cardano/Constitution/Checker/Web/Template/guardrails-table.html|]
 where
  swapOOB = if swapOOB' then "true" else "false"
  checksResults =
    Haskell.concatMap
      (Haskell.filter (filterGuardrailCheckRow filterM) . uncurry toGuardrailCheckRows)
      (sortOn fst $ Map.toList $ Map.union proposedChecks restChecks)
  fstColumn =
    let f GuardrailCheckRow{..} = guardrailFstCell guardrailCheckRowStatus guardrailCheckRowCaption
     in Text.concat $ Haskell.map f checksResults
  messageColumn =
    let f GuardrailCheckRow{..} =
          guardrailMessageCell
            (guardrailCheckRowStatus == Just False)
            guardrailCheckRowDescription
            guardrailCheckRowMessage
     in Text.concat $ Haskell.map f checksResults
  parameterColumn =
    let f GuardrailCheckRow{..} = guardrailParamCell guardrailCheckRowParamName
     in Text.concat $ Haskell.map f checksResults

filterGuardrailCheckRow :: Filter -> GuardrailCheckRow -> Bool
filterGuardrailCheckRow Nothing _ = True
filterGuardrailCheckRow (Just filterText) GuardrailCheckRow{..} =
  Text.isInfixOf (Text.toLower filterText) (Text.toLower guardrailCheckRowCaption)
    || Text.isInfixOf (Text.toLower filterText) (Text.toLower guardrailCheckRowDescription)
    || Text.isInfixOf (Text.toLower filterText) (Text.toLower guardrailCheckRowParamName)
    || case guardrailCheckRowMessage of
      Just message -> Text.isInfixOf (Text.toLower filterText) (Text.toLower message)
      Nothing -> False

data GuardrailCheckRow = GuardrailCheckRow
  { guardrailCheckRowStatus :: !(Maybe Bool)
  , guardrailCheckRowCaption :: !Text
  , guardrailCheckRowDescription :: !Text
  , guardrailCheckRowMessage :: !(Maybe Text)
  , guardrailCheckRowParamName :: !Text
  }

data ParameterRow = ParameterRow
  { parameterRowStatus :: !Bool
  , parameterRowValue :: !Text
  , parameterRowParamName :: !Text
  }

filterParamRow :: Filter -> ParameterRow -> Bool
filterParamRow Nothing _ = True
filterParamRow (Just filterText) ParameterRow{..} =
  Text.isInfixOf (Text.toLower filterText) (Text.toLower parameterRowParamName)
    || Text.isInfixOf (Text.toLower filterText) (Text.toLower parameterRowValue)

toParameterRow :: (forall a. (ToJSON a) => a -> Text) -> String -> GenericParamCheck -> [ParameterRow]
toParameterRow toValue _ (MkGenericParamCheck check@(ParamCheck{})) =
  toParameterRow' id toValue check
toParameterRow toValue pname (MkGenericParamCheck (ParamCheckList checks)) =
  let wrapName str = pname ++ " - " ++ str
   in Haskell.concatMap (toParameterRow' wrapName toValue) checks
toParameterRow _ _ (MkGenericParamCheck (ParamCheckCostModels{})) =
  -- TODO: implement cost models
  []

paramSucceeded :: [GuardrailResult] -> Bool
paramSucceeded [] = True
paramSucceeded ((GuardrailResult (Just False) _ _ _) : _) = False
paramSucceeded (_ : xs) = paramSucceeded xs

toParameterRow' :: (String -> String) -> (a -> Text) -> ParamCheck (Identity a) -> [ParameterRow]
toParameterRow' wrapName toValue (ParamCheck value param results) =
  let succeeded = paramSucceeded $ Map.elems results
      textValue = toValue value
      paramName' = Text.pack $ wrapName $ paramName param
   in [ParameterRow succeeded textValue paramName']

toGuardrailCheckRows :: String -> GenericParamCheck -> [GuardrailCheckRow]
toGuardrailCheckRows _ (MkGenericParamCheck check@(ParamCheck{})) =
  toGuardrailCheckRows' id check
toGuardrailCheckRows pname (MkGenericParamCheck (ParamCheckList checks)) =
  let wrapName str = pname ++ " - " ++ str
   in Haskell.concatMap (toGuardrailCheckRows' wrapName) checks
toGuardrailCheckRows _ (MkGenericParamCheck (ParamCheckCostModels{})) =
  -- TODO: implement cost models
  []

guardrailFstCell :: Maybe Bool -> Text -> Text
guardrailFstCell result guardrailName =
  let ellipseColorClass = case result of
        Just True -> "green"
        Just False -> "red"
        Nothing -> "gray"
   in [textF|src/Cardano/Constitution/Checker/Web/Template/guardrail-fst-cell.html|]

guardrailMessageCell :: Bool -> Text -> Maybe Text -> Text
guardrailMessageCell hasError description' message =
  let description = case message of
        Just msg | msg /= "" && hasError -> msg
        _otherwise -> description'
   in [textF|src/Cardano/Constitution/Checker/Web/Template/guardrail-message-cell.html|]

guardrailParamCell :: Text -> Text
guardrailParamCell pName =
  [textF|src/Cardano/Constitution/Checker/Web/Template/guardrail-parameter-cell.html|]

toGuardrailCheckRows' :: (String -> String) -> ParamCheck (Identity a) -> [GuardrailCheckRow]
toGuardrailCheckRows' wrapParamName (ParamCheck _ param results) =
  let rows = Haskell.map f $ Map.toList results
      f (caption, GuardrailResult{..}) =
        GuardrailCheckRow
          { guardrailCheckRowStatus = result
          , guardrailCheckRowCaption = fromString caption
          , guardrailCheckRowDescription = fromString description
          , guardrailCheckRowMessage = fromString <$> message
          , guardrailCheckRowParamName = fromString $ wrapParamName (paramName param)
          }
   in rows

data ParamChecks' = ParamChecks'
  { proposedChecks :: !(Map.Map String GenericParamCheck)
  , restChecks :: !(Map.Map String GenericParamCheck)
  }

data AllInputs = AllInputs
  { paramChange :: !ParametersChange
  , viewParamsResult :: !Bool
  , tabBtnName :: !(Maybe Text)
  , searchInput :: !(Maybe Text)
  }

instance FromForm AllInputs where
  fromForm form@(Form hs) = do
    checks <- fromForm form
    let tabBtnName = Text.concat <$> HashMap.lookup "tabBtnName" hs
    let searchInput = Text.concat <$> HashMap.lookup "searchInput" hs
    pure $ AllInputs checks (HashMap.member "view-params-result" hs) tabBtnName searchInput

inputsByCurrentParams :: CurrentParams -> ParamChecks' -> [InputProps]
inputsByCurrentParams (MkParametersChange mp) ParamChecks'{..} =
  sortOn caption $ Haskell.concatMap f $ Map.elems mp
 where
  f param@(MkParamValue p _) =
    inputsByParamValue param (Map.lookup (paramName p) proposedChecks)

getValueAndIconTypeForScalar :: Maybe GenericParamCheck -> (Text, IconType)
getValueAndIconTypeForScalar checkM = case checkM of
  (Just (MkGenericParamCheck (ParamCheck checkedVal _ ms))) ->
    let failed = Haskell.any ((== Just False) . result) $ Map.elems ms
     in (encodeToForm checkedVal, if failed then Error else Normal)
  _otherwise -> (Text.empty, Normal)

encodeToForm :: (ToJSON a) => a -> Text
encodeToForm val =
  let val' = fromString $ BSL8.unpack $ Aeson.encode val
   in transformBracketToFraction val'

transformBracketToFraction :: Text -> Text
transformBracketToFraction input' =
  case Text.stripPrefix "[" <$> Text.stripSuffix "]" input' of
    Just (Just content) ->
      let parts = Text.splitOn "," content
       in if Haskell.length parts == 2
            then Text.intercalate "/" (Haskell.map Text.strip parts)
            else input'
    _otherwise -> input'

inputsByParamValue :: ParamValue -> Maybe GenericParamCheck -> [InputProps]
inputsByParamValue (MkParamValue p@(Scalar{}) val) checkM =
  let caption = fromString $ paramName p
      (val', iconType) = getValueAndIconTypeForScalar checkM
   in [ InputProps
          caption
          caption
          val'
          iconType
          (encodeToForm val)
      ]
inputsByParamValue (MkParamValue p@(Collection _ _ params) val) checkM =
  let pName = paramName p
      scalarChecks = extractSubparamsChecks checkM
      h (sp, sv, scalarCheckM) =
        let caption = fromString $ pName ++ "[" ++ paramName sp ++ "]"
            (val', iconType) = getValueAndIconTypeForScalar scalarCheckM
            name = fromString $ pName ++ "-" ++ paramName sp
         in [ InputProps
                caption
                name
                val'
                iconType
                (encodeToForm sv)
            ]
   in Haskell.concatMap h $ Haskell.zip3 params val $ case scalarChecks of
        _ : _ | Haskell.length scalarChecks >= Haskell.length params -> Haskell.map Just scalarChecks
        _otherwise -> Haskell.repeat Nothing
inputsByParamValue (MkParamValue CostModels{} _) _ = []

extractSubparamsChecks :: Maybe GenericParamCheck -> [GenericParamCheck]
extractSubparamsChecks checkM = case checkM of
  (Just (MkGenericParamCheck (ParamCheckList xs))) -> Haskell.map MkGenericParamCheck xs
  _otherwise -> []

allParams' :: [Text]
allParams' = Haskell.concatMap f allParams
 where
  f :: Param' -> [Text]
  f (MkParam' p@(Scalar{})) =
    let caption = fromString $ paramName p
     in [input $ InputProps caption caption "" Normal "0"]
  f (MkParam' p@(Collection _ _ params)) =
    let pName = paramName p
        h sp =
          let caption = fromString $ pName ++ "[" ++ paramName sp ++ "]"
              name = fromString $ pName ++ "-" ++ paramName sp
           in [input $ InputProps caption name "" Normal "0"]
     in Haskell.concatMap h params
  f (MkParam' CostModels{}) = []

data IconType = Normal | Warning | Error
  deriving (Eq)

data InputProps = InputProps
  { caption :: !Text
  , name :: !Text
  , value :: !Text
  , iconType :: !IconType
  , placeholder :: !Text
  }

input :: InputProps -> Text
input InputProps{..} =
  [textF|src/Cardano/Constitution/Checker/Web/Template/Inputs/normal-input.html|]
 where
  (icon, containerClass, labelTextClass) = case iconType of
    Normal -> ("7", "text-field-normal", "label-text-normal")
    Warning -> ("11", "text-field-normal", "label-text-normal")
    Error -> ("8", "text-field-error", "label-text-error")
  onClick =
    if iconType == Error
      then ""
      else "clearAndTriggerHTMX('" <> name <> "-input')"

--------------------------------------------------------------------------------
--  Routes
--------------------------------------------------------------------------------

type HtmxAPI =
  QueryFlag "view-params" :> Get '[HTML] RawHtml
    :<|> ReqBody '[FormUrlEncoded] AllInputs
      :> Post '[HTML] RawHtml

homePageHandler :: Bool -> CurrentParams -> ParamChecks' -> Handler RawHtml
homePageHandler viewParamsResult currentValues =
  return . RawHtml . homePage viewParamsResult currentValues

paramsCheckHandler :: CurrentParams -> ParamChecks' -> AllInputs -> Handler RawHtml
paramsCheckHandler currentParams paramChecks (AllInputs _ viewParamsResult' tabBtnName filterM) = do
  return $
    RawHtml $
      inputs <> table <> viewParamResultInput <> tabs
 where
  inputs = inputList currentParams paramChecks
  table = tableView showParams True paramChecks filterM
  viewParamResultInput = viewParamResult True showParams
  showParams = case tabBtnName of
    Nothing -> viewParamsResult'
    Just "" -> viewParamsResult'
    _buttonClicked -> tabBtnName == Just "parameters"
  tabs = tabBar (not showParams) False

data HTML = HTML

newtype RawHtml = RawHtml {unRaw :: Text}

instance Accept HTML where
  contentType _ = "text" // "html" /: ("charset", "utf-8")

instance MimeRender HTML RawHtml where
  mimeRender _ = BSL8.fromStrict . encodeUtf8 . unRaw
