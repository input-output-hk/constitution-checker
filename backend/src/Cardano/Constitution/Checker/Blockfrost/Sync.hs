{-# LANGUAGE BlockArguments #-}
{-# LANGUAGE ConstraintKinds #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}

module Cardano.Constitution.Checker.Blockfrost.Sync where

import Cardano.Constitution.Checker.Blockfrost.Base
import Cardano.Constitution.Checker.Blockfrost.Override

import Cardano.Constitution.Checker.Base (mapLeft)
import Control.Monad
import Control.Monad.Except

import Control.Concurrent (MVar, modifyMVar_, threadDelay)
import Control.Exception (SomeException)
import Control.Monad.Catch (MonadCatch, catchAll)
import Control.Monad.IO.Class
import Control.Monad.Reader
import Data.Aeson (FromJSON)
import Data.ByteString.Lazy.Char8
import Data.Foldable as Haskell
import Data.Map (Map)
import Data.Maybe
import Data.Set (Set, fromList, member)
import Data.String
import Data.Text (Text)
import System.Directory (createDirectoryIfMissing, listDirectory)
import System.Directory.Internal.Prelude (exitFailure)
import System.FilePath
import Text.Read (readEither)
import Prelude as Haskell

import qualified Data.Aeson as Aeson
import qualified Data.Map as Map
import qualified Data.Text as Text
import qualified System.Directory as Haskell

type SyncMonad env m =
  ( MonadError IOError m
  , MonadIO m
  , MonadReader env m
  , HasPath env
  , HasLogger env
  , MonadCatch m
  , InternalBFMonad env m
  )

class HasPath env where
  getPath :: env -> FilePath

class HasLogger env where
  getLogger :: env -> String -> IO ()

--------------------------------------------------------------------------------
--  Monitor
--------------------------------------------------------------------------------

startMonitoring ::
  forall m env.
  (SyncMonad env m) =>
  Int ->
  Epoch ->
  MVar (Map Epoch ProtocolParams) ->
  m ()
startMonitoring delayInSeconds firstEpoch mvar = do
  catchAll
    doWork
    catchAndCrash
 where
  catchAndCrash (e :: SomeException) = do
    log' <- asks getLogger
    liftIO $ do
      log' $ "Error: " <> show e
      exitFailure

  doWork :: m ()
  doWork = do
    log' <- asks getLogger
    void $ forever $ do
      _ <- liftIO $ do
        log' $ "Sleeping for " <> show delayInSeconds <> " seconds"
        threadDelay delayInMicroseconds
      syncParams firstEpoch mvar
      resyncOldProposals
      syncAllProposals
  delayInMicroseconds = delayInSeconds * 1000000

syncParams :: (SyncMonad env m) => Epoch -> MVar (Map Epoch ProtocolParams) -> m ()
syncParams firstEpoch mvar = do
  log' <- asks getLogger
  liftIO $ log' "Syncing with MVar"
  newParams <- syncAllParams firstEpoch
  liftIO $ modifyMVar_ mvar \oldMap ->
    pure $ Haskell.foldl' updateMap oldMap newParams
  liftIO $ log' $ "Synced " <> show (Haskell.length newParams) <> " new params"

updateMap :: Map Epoch ProtocolParams -> ProtocolParams -> Map Epoch ProtocolParams
updateMap m p = Map.insert (_protocolParamsEpoch p) p m

initiateParamsFromFolder :: (SyncMonad env m) => MVar (Map Epoch ProtocolParams) -> m ()
initiateParamsFromFolder mvar = do
  ensureFolderExistence epochFolder
  protocolParams <- readAllEpochs
  log' <- asks getLogger
  liftIO $
    log' $
      "Initiating MVar with stored epochs (" <> show (Haskell.length protocolParams) <> " epochs)"
  liftIO $ modifyMVar_ mvar \_ ->
    pure $ Map.fromList $ Haskell.map (\p -> (_protocolParamsEpoch p, p)) protocolParams

liftAndMapLeft :: (MonadError c m) => (a -> c) -> m (Either a b) -> m b
liftAndMapLeft f m = m >>= liftEither . mapLeft f

ensureFolderExistence :: (SyncMonad env m) => FilePath -> m ()
ensureFolderExistence folder = do
  path <- asks getPath
  liftIO $ createDirectoryIfMissing True $ path </> folder

-- sync all folders and returns new fetched params
syncAllParams :: (SyncMonad env m) => Epoch -> m [ProtocolParams]
syncAllParams firstEpoch = do
  -- ensure folder exists
  ensureFolderExistence epochFolder

  -- 1. get the last epoch
  EpochDetails{epdEpoch = latestEpoch} <- getLatestEpochDetails

  -- 2. get the last epoch from the folder
  lastStoredEpoch <- getLastStoredEpoch

  let start = maybe firstEpoch (+ 1) lastStoredEpoch
  let allToBeFetched = [start .. latestEpoch]

  -- 3. download all remaining epochs and store them in the folder
  log' <- asks getLogger
  liftIO $ log' $ "Fetching epochs, from " <> show start <> " to " <> show latestEpoch
  ret <- forM allToBeFetched \ep -> do
    params <- getParamsByEpoch ep
    writeParametersFile ep params
    liftIO $ log' $ show ep <> " stored"
    pure params
  liftIO $ log' "All epochs stored"
  pure ret

-- | Get the last epoch stored in the folder
eitherDecode' :: (MonadError IOError m, Aeson.FromJSON a) => String -> m a
eitherDecode' content = liftEither $ mapLeft userError $ Aeson.eitherDecode' $ fromString content

-- | Read all epochs stored within the folder
readAllEpochs :: (SyncMonad env m) => m [ProtocolParams]
readAllEpochs = do
  root <- asks getPath
  -- list all files in the folder
  files' <- liftIO $ listDirectory $ root </> epochFolder
  forM files' \file -> do
    content <- readFileFromFolder file
    eitherDecode' content

-- | Write the parameters to a file
writeParametersFile :: (SyncMonad env m, Show a, Aeson.ToJSON a) => Epoch -> a -> m ()
writeParametersFile (Epoch epoch') body = do
  writeFileToFolder (show epoch' <.> "json") (unpack (Aeson.encode body))

type FileName = String

epochFolder :: FilePath
epochFolder = "epochs"

proposalsFolder :: FilePath
proposalsFolder = "proposals"

lastProposalPage :: FilePath
lastProposalPage = "last-proposal-page"

-- | Read a file from the folder
readFileFromFolder :: (SyncMonad env m) => FileName -> m String
readFileFromFolder fileName = do
  path <- asks getPath
  liftIO $ Haskell.readFile $ path </> epochFolder </> fileName

-- | Write a file to the folder
writeFileToFolder :: (SyncMonad env m) => FileName -> String -> m ()
writeFileToFolder fileName content = do
  path <- asks getPath
  liftIO $ Haskell.writeFile (path </> epochFolder </> fileName) content

-- | Get the last stored epoch
getLastStoredEpoch :: (SyncMonad env m) => m (Maybe Epoch)
getLastStoredEpoch = do
  path <- asks getPath
  let folder = path </> epochFolder
  liftIO $ do
    files' <- listDirectory folder
    let epochNames = Haskell.map (Epoch . read . Haskell.takeWhile (/= '.')) files'

    pure $ case epochNames of
      [] -> Nothing
      _otherwise -> Just $ Haskell.maximum epochNames

-- | Get the epoch from the folder based on the epoch number
getEpochFromFolder :: (SyncMonad env m) => Epoch -> m ProtocolParams
getEpochFromFolder (Epoch epoch') = do
  fileContent <- readFileFromFolder $ show epoch'
  eitherDecode' fileContent

-- PROPOSALS SYNC

getLastProposalPageStored :: (SyncMonad env m) => m (Maybe Int)
getLastProposalPageStored = do
  path <- asks getPath
  log' <- asks getLogger
  let filePath' = path </> lastProposalPage
  exists <- liftIO $ Haskell.doesFileExist filePath'
  liftIO $ log' $ "Last proposal page file (" <> filePath' <> ") exists: " <> show exists
  if not exists
    then pure Nothing
    else do
      content <- liftIO $ Haskell.readFile filePath'
      case readEither content of
        Left err -> do
          liftIO $ log' $ "Error reading last proposal page: " <> err <> " for content: " <> content
          pure Nothing
        Right page' -> pure $ Just page'

syncAllProposals :: (SyncMonad env m) => m [ProposalInfo]
syncAllProposals = do
  log' <- asks getLogger
  -- ensure folder exists
  ensureFolderExistence proposalsFolder
  -- get last page stored
  lastPage <- getLastProposalPageStored
  liftIO $ log' $ "Last page stored: " <> show lastPage

  alreadyStored <- fromList <$> listAllProposalsHashFromDirectory
  syncProposalPages alreadyStored (fromMaybe 1 lastPage) []

getProposalFromFile :: (SyncMonad env m) => Text.Text -> m (Maybe ProposalTx)
getProposalFromFile = getProposalFromFileGen

getProposalDetailsFromFile :: (SyncMonad env m) => Text.Text -> m (Maybe ProposalDetails)
getProposalDetailsFromFile = getProposalFromFileGen

listAllProposalsHashFromDirectory :: (SyncMonad env m) => m [Text.Text]
listAllProposalsHashFromDirectory = do
  path <- asks getPath
  files' <- liftIO $ listDirectory $ path </> proposalsFolder
  -- remove extension
  pure $ Haskell.map (Text.pack . Haskell.takeWhile (/= '.')) files'

listAllProposalsFromDirectory :: (SyncMonad env m) => m [ProposalDetails]
listAllProposalsFromDirectory = do
  hashes <- listAllProposalsHashFromDirectory
  forM hashes \hash' -> do
    infoM <- getProposalDetailsFromFile hash'
    maybe
      (throwError $ userError $ "Error reading proposal info from file: " <> show hash')
      pure
      infoM

resyncOldProposals :: (SyncMonad env m) => m ()
resyncOldProposals = do
  log' <- asks getLogger
  liftIO $ log' "Resyncing old proposals"
  -- get all proposals from the folder
  allDetails <- listAllProposalsFromDirectory
  -- filter only the pending ones
  let allPendingDetails = Haskell.filter justPending allDetails
  forM_ allPendingDetails \details -> do
    let hash' = propDetailsTxHash details
    fetchAndSaveProposal (hash' :: Text.Text)
 where
  justPending ProposalDetails{..} =
    case (propDetailsEnactedEpoch, propDetailsDroppedEpoch) of
      (Nothing, Nothing) -> True
      _otherwise -> False

getProposalFromFileGen :: forall a env m. (SyncMonad env m, FromJSON a) => Text.Text -> m (Maybe a)
getProposalFromFileGen hash' = do
  path <- asks getPath
  let filePath' = path </> proposalsFolder </> Text.unpack hash' <.> "json"
  exist <- liftIO $ Haskell.doesFileExist filePath'
  if doesn't exist
    then pure Nothing
    else do
      -- read the file
      content <- liftIO $ Haskell.readFile filePath'
      -- decode the content
      let decoded = Aeson.eitherDecode' $ fromString content
      Just <$> liftEither (mapLeft userError decoded)

doesn't :: Bool -> Bool
doesn't = not

syncProposalPages :: (SyncMonad env m) => Set Text -> Int -> [ProposalInfo] -> m [ProposalInfo]
syncProposalPages alreadyStored page' acc = do
  log' <- asks getLogger
  liftIO $ log' $ "Fetching proposals page: " <> show page'
  proposals <- getProposalsInfo page'
  case proposals of
    [] -> do
      liftIO $ log' "No more proposals to fetch"
      pure acc
    _otherwise -> do
      -- TODO: filter out

      let isParameterChange = (== ParameterChange) . propInfoGovernanceType
          notInAlreadyStored = not . (`member` alreadyStored) . propInfoTxHash
          filtered = Haskell.filter (\x -> isParameterChange x && notInAlreadyStored x) proposals
      forM_ filtered (fetchAndSaveProposal . propInfoTxHash)

      -- save the page
      saveProposalPage

      -- fetch next page
      syncProposalPages alreadyStored (page' + 1) (acc <> filtered)
 where
  saveProposalPage = do
    -- this also has to fetch the proposals
    path <- asks getPath
    liftIO $ Haskell.writeFile (path </> lastProposalPage) (show page')

fetchAndSaveProposal :: (SyncMonad env m) => Text.Text -> m ()
fetchAndSaveProposal hash' = do
  log' <- asks getLogger
  -- fetch the proposal
  value <- getProposal hash'
  liftIO $ log' $ "Fetched proposal " <> show hash'
  let bs = Aeson.encode value
  -- save the proposal
  path <- asks getPath
  let filePath = path </> proposalsFolder </> Text.unpack hash' <> ".json"
  liftIO $ Haskell.writeFile filePath $ unpack bs

type SyncWorker env m a = ExceptT IOError (ReaderT env m) a
type SyncWorker' env a = SyncWorker env IO a

data SyncEnv = SyncEnv
  { filePath :: !FilePath
  , logger :: !(forall m. (MonadIO m) => String -> m ())
  , authToken :: !String
  , network :: !NetworkType
  }

instance HasPath SyncEnv where
  getPath (SyncEnv syncPath _ _ _) = syncPath

instance HasLogger SyncEnv where
  getLogger (SyncEnv _ logger' _ _) = logger'

instance HasToken SyncEnv where
  getToken (SyncEnv _ _ token' _) = token'

instance HasNetworkType SyncEnv where
  getNetworkType (SyncEnv _ _ _ network') = network'

-- JUST FOR PLAYING AROUND

syncAllParams' :: Epoch -> SyncWorker' SyncEnv [ProtocolParams]
syncAllParams' = syncAllParams -- (SyncEnv path)
