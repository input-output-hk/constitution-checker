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
import Data.List (sortOn)
import qualified Data.Map as Map
import Data.String (fromString)
import Data.Text as Text
import Data.Text.Encoding
import Debug.Trace (traceShow)
import Network.HTTP.Media ((//), (/:))
import Servant.API as Servant
import Servant.Server
import Prelude as Haskell

homePage :: CurrentParams -> ParamChecks' -> Text
homePage currentParams checks = [textF|src/Cardano/Constitution/Checker/Web/Template/master.html|]
 where
  inputs =
    Text.concat $
      Haskell.map
        input
        (inputsByCurrentParams currentParams checks)
  mainView = [textF|src/Cardano/Constitution/Checker/Web/Template/main-view.html|]
  table = guardrailsTable False checks

type SwapOOB = Bool
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
inputsByParamValue (MkParamValue CostModels{} _) check = []

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

--------------------------------------------------------------------------------
--  Routes
--------------------------------------------------------------------------------

type HtmxMain =
  Get '[HTML] RawHtml
    :<|> "params-check"
      -- :> Capture "param" Text
      :> ReqBody '[FormUrlEncoded] ParametersChange
      :> Post '[HTML] RawHtml

homePageHandler :: CurrentParams -> ParamChecks' -> Handler RawHtml
homePageHandler currentValues = return . RawHtml . homePage currentValues

paramsCheckHandler :: CurrentParams -> ParamChecks -> ParametersChange -> Handler RawHtml
paramsCheckHandler currentParams ParamChecks{..} paramChange = do
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
