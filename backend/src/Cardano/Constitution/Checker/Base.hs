module Cardano.Constitution.Checker.Base where

-- NOTE: original found in `extra` . If other functions are needed,
-- we should import the whole dependency
mapLeft :: (a -> c) -> Either a b -> Either c b
mapLeft f = either (Left . f) Right
