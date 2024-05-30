module Main where

import Cardano.Constitution.Checker.API
import Network.Wai.Handler.Warp

main :: IO ()
main = do
  let port = 8081
  putStrLn $ "Server running on port " ++ show port
  putStrLn $ "API swagger available at: " ++ "http://localhost:" ++ show port ++ "/swagger-ui"
  run port app
