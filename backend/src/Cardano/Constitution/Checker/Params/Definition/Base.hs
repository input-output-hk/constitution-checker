module Cardano.Constitution.Checker.Params.Definition.Base where

import Blockfrost.Client (Epoch)
import Cardano.Constitution.Checker.Params.Types
import Prelude hiding (Rational)

import qualified Data.Map as Map

type FullParamName = (String, Maybe String)

network01Check :: String -> String -> Context -> a -> SatisfactionResult
network01Check pName subPName ctx _ =
  let changedNow = hasBeenChangedSinceLatestEpoch ctx pName (Just subPName)
      changedInLastEpochs = hasBeenChangedInLastEpochs ctx 1 pName (Just subPName)
   in if changedNow && changedInLastEpochs
        then Unsatisfied ""
        else Satisfied

network02Check :: String -> String -> [FullParamName] -> Context -> a -> SatisfactionResult
network02Check pName subPName exclude ctx _ =
  let
    changedNow = hasBeenChangedSinceLatestEpoch ctx pName (Just subPName)
    otherNetParamsChangedToo =
      or $
        changedParamsSinceLatestEpoch
          ctx
          (networkParamsNames `excludeParamNames` exclude)
   in
    if changedNow && otherNetParamsChangedToo
      then Unsatisfied ""
      else Satisfied

subParamNamesToFullNames :: (String, [String]) -> [FullParamName]
subParamNamesToFullNames (pName, subPNames) =
  map (\subPName -> (pName, Just subPName)) subPNames

executionUnitPricesNames :: [FullParamName]
executionUnitPricesNames =
  subParamNamesToFullNames
    ("executionUnitPrices", ["priceMemory", "priceSteps"])

maxBlockExecutionUnitsNames :: [FullParamName]
maxBlockExecutionUnitsNames =
  subParamNamesToFullNames ("maxBlockExecutionUnits", ["memory", "steps"])

maxTxExecutionUnitsNames :: [FullParamName]
maxTxExecutionUnitsNames =
  subParamNamesToFullNames ("maxTxExecutionUnits", ["memory", "steps"])

networkParamsNames :: [FullParamName]
networkParamsNames =
  executionUnitPricesNames
    ++ maxBlockExecutionUnitsNames
    ++ maxTxExecutionUnitsNames

excludeParamNames :: [FullParamName] -> [FullParamName] -> [FullParamName]
excludeParamNames allNames excludedNames =
  filter (`notElem` excludedNames) allNames

changedParamsSinceLatestEpoch :: Context -> [FullParamName] -> [Bool]
changedParamsSinceLatestEpoch ctx =
  map (uncurry $ hasBeenChangedSinceLatestEpoch ctx)

hasBeenChangedInLastEpochs ::
  Context ->
  Epoch ->
  String ->
  Maybe String ->
  Bool
hasBeenChangedInLastEpochs ctx epoch' pName subPName =
  -- get the current value in string
  let currentValM = getStrValue ctx.currentValues pName subPName
      -- get the current epoch
      cEpoch = ctx.latestEpoch
      -- home many epochs we have to search for
      sEpoch = ctx.latestEpoch - epoch'
   in case currentValM of
        Nothing -> False
        Just val -> hasBeenChanged ctx pName subPName sEpoch (cEpoch - 1) val

hasBeenChangedSinceLatestEpoch ::
  Context ->
  String ->
  Maybe String ->
  Bool
hasBeenChangedSinceLatestEpoch ctx pName subPName =
  let currentValM = getStrValue ctx.proposal pName subPName
      -- get the current epoch
      cEpoch = ctx.latestEpoch
   in -- home many epochs we have to search for
      case currentValM of
        Nothing -> False
        Just val -> hasBeenChanged ctx pName subPName cEpoch cEpoch val

-- compare epoch by epoch if the value has changed
hasBeenChanged :: Context -> String -> Maybe String -> Epoch -> Epoch -> String -> Bool
hasBeenChanged ctx pName subPName epochLimit stepEpoch currentValue
  | stepEpoch < epochLimit = False
  | otherwise =
      let epochValue = getStrValue (ctx.valuesByEpoch stepEpoch) pName subPName
       in case epochValue of
            Nothing -> True
            Just val
              | val /= currentValue -> True
              | otherwise ->
                  hasBeenChanged
                    ctx
                    pName
                    subPName
                    epochLimit
                    (stepEpoch - 1)
                    val

getStrValue :: ParamsAccess -> String -> Maybe String -> Maybe String
getStrValue paccess pName subPName =
  let (int, rational) = case subPName of
        Nothing ->
          ( paccess.byName.getInteger pName
          , paccess.byName.getRational pName
          )
        Just subPName' ->
          ( Map.lookup subPName' $ paccess.byName.getIntegers pName
          , Map.lookup subPName' $ paccess.byName.getRationals pName
          )
   in case (int, rational) of
        (Just v, _) -> Just $ show v
        (_, Just v) -> Just $ show v
        _otherwise -> Nothing

-- | Determine if the given number of epochs can be described in a human-readable time span
type Year = Integer

type Month = Integer
type Week = Integer
type Day = Integer

data HumanReadableTimeSpan = HumanReadableTimeSpan
  { hrtsCheck :: !Bool
  , hrtsYears :: !Year
  , hrtsMonths :: !Month
  , hrtsWeeks :: !Week
  , hrtsDays :: !Day
  }
epochIsHumanReadable :: Integer -> HumanReadableTimeSpan
epochIsHumanReadable epochs =
  let days = epochs * 5
      years = days `div` 365
      months = (days `mod` 365) `div` 30
      weeks = ((days `mod` 365) `mod` 30) `div` 7
      remDays = ((days `mod` 365) `mod` 30) `mod` 7
      check =
        ( (years > 0 && months == 0 && weeks == 0 && remDays == 0)
            || (months > 0 && years == 0 && weeks == 0 && remDays == 0)
            || (weeks > 0 && years == 0 && months == 0 && (remDays == 0 || remDays == 1 || remDays == 6))
            || (remDays > 0 && years == 0 && months == 0 && weeks == 0) -- almost two weeks like 3 epochs is 15 days (roughly 2 weeks) and 4 epochs is 20 days (roughly 3 weeks)
            || (years >= 0 && months == 6 && weeks == 0 && remDays == 0)
            || (years == 0 && months > 0 && weeks == 2 && (remDays == 0 || remDays == 1 || remDays == 6)) -- half a year
            || ((days `mod` 10 == 0 && days < 100) || (days `mod` 100 == 0 && days < 1000)) -- months and a half or two weeks
            -- 10 days, 20 days, 30 days, 40 days, 50 days, 100 days, 200 days, 300 days, 400 days, 500 days
        )
   in HumanReadableTimeSpan check years months weeks remDays
