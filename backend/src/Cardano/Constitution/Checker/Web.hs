{-# LANGUAGE DataKinds #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeOperators #-}

module Cardano.Constitution.Checker.Web where

import Cardano.Constitution.Checker.Web.Internal
import Data.ByteString.Lazy.Char8 as BSL8
import Data.String (fromString)
import Data.Text as Text
import Servant.API as Servant
import Servant.Server

import Data.Text.Encoding
import Network.HTTP.Media ((//), (/:))

import Cardano.Constitution.Checker.Checks
import Cardano.Constitution.Checker.Params.Definition (allParams)
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Data.Aeson (ToJSON (..), encode)
import qualified Data.Map as Map
import Debug.Trace (traceShow)
import Web.FormUrlEncoded
import Prelude as Haskell

homePage :: CurrentParams -> ParamChecks' -> Text
homePage currentParams checks = [textF|src/Cardano/Constitution/Checker/Web/Template/master.html|]
 where
  inputs =
    Text.concat $ Haskell.map input (inputsByCurrentParams currentParams checks)

sampleInputs :: [Text]
sampleInputs =
  Haskell.map
    input
    [ InputProps "txFeedFixed" "txFeedFixed" "155301" Normal "0"
    , InputProps "maxBlockBodySize" "maxBlockBodySize" "90112" Normal "0"
    , InputProps "dRepDeposit" "dRepDeposit" "" Warning "no proposed value"
    , InputProps "maxBlockHeaderSize" "maxBlockHeaderSize" "1100" Normal "0"
    , InputProps "stakeAddressDeposit" "stakeAddressDeposit" "21310003" Normal "0"
    , InputProps "govDeposit" "govDeposit" "150000010008" Normal "0"
    , InputProps "poolVotingThresholds[mem]" "poolVotingThresholds-mem" "1" Error "0"
    , InputProps "poolVotingThresholds[steps]" "poolVotingThresholds-steps" "2" Error "0"
    ]

type ParamChecks' = Map.Map String GenericParamCheck
inputsByCurrentParams :: CurrentParams -> ParamChecks' -> [InputProps]
inputsByCurrentParams (MkParametersChange mp) checks =
  Haskell.concatMap f $ Map.elems mp
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
-- 22
type HtmxMain =
  Get '[HTML] RawHtml
    :<|> "params-check"
      :> Capture "param" Text
      :> ReqBody '[FormUrlEncoded] ParametersChange
      :> Post '[HTML] RawHtml

{-
  ( Get '[HTML] RawHtml
      :<|> "accounts"
        :> Get '[HTML] RawHtml
      :<|> "accounts"
        :> (Capture "profileId" Integer :> Get '[HTML] RawHtml)
      :<|> "transactions"
        :> Get '[HTML] RawHtml
      :<|> "billing"
        :> Get '[HTML] RawHtml
  )
-}

homePageHandler :: CurrentParams -> ParamChecks' -> Handler RawHtml
homePageHandler currentValues = return . RawHtml . homePage currentValues

paramsCheckHandler :: CurrentParams -> ParamChecks -> Text -> ParametersChange -> Handler RawHtml
paramsCheckHandler currentParams ParamChecks{..} name paramChange = do
  let inputs = Text.concat $ Haskell.map input (inputsByCurrentParams currentParams paramChecks)
  traceShow paramChange $
    return $
      RawHtml inputs

-- where
-- genericParamM = case Map.lookup (Text.unpack name) paramChecks of
-- Nothing -> InputProps "asda" name "-" Normal "0"

data HTML = HTML

newtype RawHtml = RawHtml {unRaw :: Text}

instance Accept HTML where
  contentType _ = "text" // "html" /: ("charset", "utf-8")

instance MimeRender HTML RawHtml where
  mimeRender _ = BSL8.fromStrict . encodeUtf8 . unRaw
