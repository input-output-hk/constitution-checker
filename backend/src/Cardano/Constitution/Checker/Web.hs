{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.Web where

import Cardano.Constitution.Checker.Checks
import Cardano.Constitution.Checker.Params.Definition (allParams)
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Cardano.Constitution.Checker.Web.Internal
import Data.Aeson (encode)
import Data.ByteString.Lazy.Char8 as BSL8
import Data.Functor.Identity (Identity (..))
import qualified Data.HashMap.Strict as HashMap
import Data.List (sortOn)
import qualified Data.Map as Map
import Data.String (fromString)
import Data.Text as Text
import Data.Text.Encoding
import Debug.Trace (traceShow)
import Network.HTTP.Media ((//), (/:))
import Servant.API as Servant
import Servant.Server
import Web.FormUrlEncoded
import Prelude as Haskell

homePage :: Bool -> CurrentParams -> ParamChecks' -> Text
homePage viewParamsResult currentParams checks =
  [textF|src/Cardano/Constitution/Checker/Web/Template/master.html|]
 where
  inputs =
    Text.concat $
      Haskell.map
        input
        (inputsByCurrentParams currentParams checks)
  mainView = [textF|src/Cardano/Constitution/Checker/Web/Template/main-view.html|]
  tabs = tabBar (not viewParamsResult)
  table = guardrailsTable False checks

type SwapOOB = Bool

tabButton :: Bool -> Text -> Text
tabButton active text =
  [textF|src/Cardano/Constitution/Checker/Web/Template/tab-button.html|]
 where
  (buttonClass, activeClass) =
    if active
      then ("active", "active")
      else ("inactive", "inactive")

tabBar :: Bool -> Text
tabBar fstActive =
  [textF|src/Cardano/Constitution/Checker/Web/Template/tabs.html|]
 where
  tabButtons =
    Text.concat $
      Haskell.map
        (\(text, active) -> tabButton active text)
        [("Guardrails", fstActive), ("Proposal Parameters", not fstActive)]

viewParamResult :: Bool -> Bool -> Text
viewParamResult swapOOB' viewParams =
  [textF|src/Cardano/Constitution/Checker/Web/Template/view-params-result.html|]
 where
  swapOOB = if swapOOB' then "true" else "false"
  hiddenInput = ""

guardrailsTable :: SwapOOB -> ParamChecks' -> Text
guardrailsTable swapOOB' checks =
  [textF|src/Cardano/Constitution/Checker/Web/Template/guardrails-table.html|]
 where
  swapOOB = if swapOOB' then "true" else "false"
  checksResults =
    Haskell.concatMap
      (uncurry toGuardrailCheckRows)
      $ sortOn fst
      $ Map.toList checks
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

data GuardrailCheckRow = GuardrailCheckRow
  { guardrailCheckRowStatus :: !(Maybe Bool)
  , guardrailCheckRowCaption :: !Text
  , guardrailCheckRowDescription :: !Text
  , guardrailCheckRowMessage :: !(Maybe Text)
  , guardrailCheckRowParamName :: !Text
  }

toGuardrailCheckRows :: String -> GenericParamCheck -> [GuardrailCheckRow]
toGuardrailCheckRows _ (MkGenericParamCheck check@(ParamCheck{})) =
  toGuardrailCheckRows' id check
toGuardrailCheckRows pname (MkGenericParamCheck (ParamCheckList checks)) =
  let wrapName str = pname ++ " - " ++ str
   in Haskell.concatMap (toGuardrailCheckRows' wrapName) checks
toGuardrailCheckRows _ (MkGenericParamCheck (ParamCheckCostModels{})) =
  error "not implemented"

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

type ParamChecks' = Map.Map String GenericParamCheck

data AllInputs = AllInputs
  { paramChange :: !ParametersChange
  , viewParamsResult :: !Bool
  }

instance FromForm AllInputs where
  fromForm form@(Form hs) = do
    checks <- fromForm form
    pure $ AllInputs checks (HashMap.member "view-params-result" hs)

inputsByCurrentParams :: CurrentParams -> ParamChecks' -> [InputProps]
inputsByCurrentParams (MkParametersChange mp) checks =
  sortOn caption $ Haskell.concatMap f $ Map.elems mp
 where
  f param@(MkParamValue p _) =
    inputsByParamValue param (Map.lookup (paramName p) checks)

getValueAndIconTypeForScalar :: Maybe GenericParamCheck -> (ByteString, IconType)
getValueAndIconTypeForScalar checkM = case checkM of
  (Just (MkGenericParamCheck (ParamCheck checkedVal _ ms))) ->
    let failed = Haskell.any ((== Just False) . result) $ Map.elems ms
     in (encode checkedVal, if failed then Error else Normal)
  _otherwise -> (BSL8.empty, Normal)

inputsByParamValue :: ParamValue -> Maybe GenericParamCheck -> [InputProps]
inputsByParamValue (MkParamValue p@(Scalar{}) val) checkM =
  let caption = fromString $ paramName p
      (val', iconType) = getValueAndIconTypeForScalar checkM
   in [ InputProps
          caption
          caption
          (fromString $ BSL8.unpack val')
          iconType
          (fromString $ BSL8.unpack $ encode val)
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
                (fromString $ BSL8.unpack val')
                iconType
                (fromString $ BSL8.unpack $ encode sv)
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

type HtmxMain =
  QueryFlag "view-params" :> Get '[HTML] RawHtml
    :<|> ReqBody '[FormUrlEncoded] AllInputs
      :> Post '[HTML] RawHtml

homePageHandler :: Bool -> CurrentParams -> ParamChecks' -> Handler RawHtml
homePageHandler viewParamsResult currentValues =
  return . RawHtml . homePage viewParamsResult currentValues

paramsCheckHandler :: CurrentParams -> ParamChecks -> AllInputs -> Handler RawHtml
paramsCheckHandler currentParams ParamChecks{..} (AllInputs paramChange viewParamsResult) = do
  traceShow paramChange $
    return $
      RawHtml $
        inputs <> table
 where
  inputs = Text.concat $ Haskell.map input (inputsByCurrentParams currentParams paramChecks)
  table = guardrailsTable True paramChecks

data HTML = HTML

newtype RawHtml = RawHtml {unRaw :: Text}

instance Accept HTML where
  contentType _ = "text" // "html" /: ("charset", "utf-8")

instance MimeRender HTML RawHtml where
  mimeRender _ = BSL8.fromStrict . encodeUtf8 . unRaw
