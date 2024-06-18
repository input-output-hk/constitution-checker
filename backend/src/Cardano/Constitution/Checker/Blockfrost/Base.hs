{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DerivingVia #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeFamilies #-}

module Cardano.Constitution.Checker.Blockfrost.Base (
  withProject,
) where

import Blockfrost.Client
import Cardano.Constitution.Checker.Blockfrost.Override

withProject :: BlockfrostClientT IO a -> IO (Either BlockfrostError a)
withProject bf = do
  projectFromFile bfTokenPath >>= flip runBlockfrost bf
