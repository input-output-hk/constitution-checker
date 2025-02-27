{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE ScopedTypeVariables #-}

module Main where

import Cardano.Constitution.Checker.API
import Cardano.Constitution.Checker.Blockfrost (Epoch, NetworkType (..), ProtocolParams)
import Cardano.Constitution.Checker.Blockfrost.Sync
import Control.Concurrent.Async (Async, async, link)
import Control.Concurrent.MVar
import Control.Monad (void)
import Control.Monad.Except
import Control.Monad.Reader
import Data.Map (Map)
import Data.Maybe (fromMaybe)
import Network.Wai.Handler.Warp
import Options.Applicative
import System.Exit (ExitCode (..), exitWith)
import System.IO (hPutStrLn, stderr)
import Text.Read (readEither)

data Args = Args
  { port :: !Int
  , firstEpoch :: !Epoch
  , monitoringDelay :: !Int
  , token :: !TokenArg
  , networkType :: !NetworkType
  }

data TokenArg = TokenValue !String | TokenFile !(Maybe FilePath)

tokenPathByNetworkType :: NetworkType -> FilePath
tokenPathByNetworkType Mainnet = "secrets/mainnet.txt"
tokenPathByNetworkType Sanchonet = "secrets/sanchonet.txt"

showTokenArg :: NetworkType -> TokenArg -> String
showTokenArg _ (TokenValue token) | length token < 21 = "<<REDACTED>>"
showTokenArg _ (TokenValue token) =
  -- redact part of it
  take 20 token ++ replicate (length token - 20) '-'
showTokenArg _ (TokenFile (Just file)) = file
showTokenArg nt (TokenFile Nothing) = tokenPathByNetworkType nt

epochReader :: ReadM Epoch
epochReader = do
  epochStr <- str
  case readEither epochStr of
    Left _ -> readerError "Invalid epoch"
    Right (epoch :: Integer) -> return $ fromIntegral epoch

networkTypeReader :: ReadM NetworkType
networkTypeReader = do
  networkTypeStr <- str
  case networkTypeStr of
    "mainnet" -> return Mainnet
    "sanchonet" -> return Sanchonet
    _ -> readerError "Invalid network type"

argsParser :: Parser Args
argsParser =
  Args
    <$> option
      auto
      ( long "port"
          <> metavar "PORT"
          <> help "Port to run the server on"
          <> short 'p'
          <> showDefault
          <> value 8081
      )
    <*> option
      epochReader
      ( long "first-epoch"
          <> metavar "FIRST_EPOCH"
          <> help "First epoch to start monitoring from"
          <> short 'f'
          <> showDefault
          <> value 400
      )
    <*> option
      auto
      ( long "monitoring-delay"
          <> metavar "MONITORING_DELAY"
          <> help "Delay in seconds between monitoring cycles"
          <> short 'd'
          <> showDefault
          <> value 10
      )
    <*> ( TokenValue
            <$> strOption
              ( long "token"
                  <> metavar "TOKEN"
                  <> help "Blockfrost API token"
                  <> short 't'
              )
              <|> TokenFile
            <$> optional
              ( strOption
                  ( long "token-file"
                      <> metavar "TOKEN_FILE"
                      <> help "File containing the Blockfrost API token\n (default: secrets/<<network-type>>.txt)"
                      <> short 'T'
                  )
              )
        )
    -- data NetworkType = Mainnet | Sanchonet
    -- choose from "mainnet" or "sanchonet"
    <*> option
      networkTypeReader
      ( long "network-type"
          <> metavar "NETWORK_TYPE"
          <> help "Network type to monitor (mainnet or sanchonet)\n (default: sanchonet)"
          <> short 'n'
          <> value Sanchonet
      )
dataFolder :: FilePath
dataFolder = "data"

monitor ::
  MVar (Map Epoch ProtocolParams) ->
  Epoch ->
  Int ->
  NetworkType ->
  String ->
  IO (Either IOError (Async ()))
monitor mvar firstEpoch delaySeconds nt authToken =
  runMonad startMonitoring' (SyncEnv dataFolder (liftIO . putStrLn) authToken nt)
 where
  runMonad m = runReaderT (runExceptT m)
  startMonitoring' = do
    -- TODO:  get from cli args
    log' <- asks getLogger
    env <- ask
    liftIO $ log' "Syncing parameters for the first time"
    initiateParamsFromFolder mvar
    syncParams firstEpoch mvar
    _ <- syncAllProposals
    liftIO $ do
      log' "Starting monitoring"
      async $ void $ runMonad (startMonitoring delaySeconds firstEpoch mvar) env

exitWithError :: Int -> String -> IO a
exitWithError code msg = do
  -- Print the error message to stderr
  hPutStrLn stderr msg
  -- Exit with the specified code
  exitWith (ExitFailure code)

dummyServerCaps :: MVar (Map Epoch ProtocolParams) -> ServerCaps
dummyServerCaps mvar =
  ServerCaps
    { getProtocolParams = readMVar mvar
    , dataPath = dataFolder
    }

argsInfo :: ParserInfo Args
argsInfo =
  info
    (argsParser <**> helper)
    ( fullDesc
        <> header "constitution-checker-backend-exe - a simple server for checking Cardano protocol parameters"
    )
main :: IO ()
main = do
  Args{..} <- execParser argsInfo
  putStrLn $ "First epoch to start monitoring from: " ++ show firstEpoch
  putStrLn $ "Monitoring delay: " ++ show monitoringDelay ++ "s"
  putStrLn $ "Blockfrost API token: " ++ showTokenArg networkType token
  putStrLn $ "Network type: " ++ show networkType
  mvar <- newMVar mempty
  auth <- case token of
    TokenValue tokenValue -> return tokenValue
    TokenFile bfTokenPathM -> do
      let bfTokenPath = fromMaybe (tokenPathByNetworkType networkType) bfTokenPathM
      filter (/= '\n') <$> readFile bfTokenPath
  monitoringThread <- do
    ret <- monitor mvar firstEpoch monitoringDelay networkType auth
    case ret of
      Left e -> do
        putStrLn $ "Error starting monitoring thread: " ++ show e
        -- Fail the thread to propagate the error
        exitWithError 1 $ "Error starting monitoring thread: " ++ show e
      Right asyncHandler -> do
        putStrLn "Monitoring thread started..."
        return asyncHandler

  -- Link the monitoring thread to the main thread
  -- If the monitoring thread dies, the main thread will also die
  link monitoringThread

  putStrLn $ "Server running on port " ++ show port
  putStrLn $ "API swagger available at: " ++ "http://localhost:" ++ show port ++ "/swagger-ui"
  run port (app (dummyServerCaps mvar))
