module Main where

import Cardano.Constitution.Checker.API
import Cardano.Constitution.Checker.Blockfrost (Epoch, ProtocolParams)
import Cardano.Constitution.Checker.Blockfrost.Sync
import Control.Concurrent (ThreadId, forkIO)
import Control.Concurrent.MVar
import Control.Monad (void)
import Control.Monad.Except
import Control.Monad.Reader
import Data.Map (Map)
import Network.Wai.Handler.Warp

monitor :: MVar (Map Epoch ProtocolParams) -> IO (Either IOError ThreadId)
monitor mvar = runMonad startMonitoring' (SyncEnv "data" (liftIO . putStrLn))
 where
  runMonad m = runReaderT (runExceptT m)
  startMonitoring' = do
    -- TODO:  get from cli args
    let firstEpoch = 362
        delaySeconds = 10
    log' <- asks getLogger
    env <- ask
    liftIO $ log' "Syncing parameters for the first time"
    initiateParamsFromFolder mvar
    syncParams firstEpoch mvar
    liftIO $ do
      log' "Starting monitoring"
      forkIO $ void $ runMonad (startMonitoring delaySeconds firstEpoch mvar) env

main :: IO ()
main = do
  let port = 8081
  mvar <- newMVar mempty
  _ <- monitor mvar
  putStrLn $ "Server running on port " ++ show port
  putStrLn $ "API swagger available at: " ++ "http://localhost:" ++ show port ++ "/swagger-ui"
  run port (app (dummyServerCaps mvar))

dummyServerCaps :: MVar (Map Epoch ProtocolParams) -> ServerCaps
dummyServerCaps mvar =
  ServerCaps
    { getProtocolParams = readMVar mvar
    }
