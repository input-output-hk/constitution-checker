module Main where

import Cardano.Constitution.Checker.API
import Network.Wai.Handler.Warp

main :: IO ()
main = do
  let port = 8081
  putStrLn $ "Server running on port " ++ show port
  run port app
