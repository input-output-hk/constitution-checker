{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE TypeApplications #-}

import Data.Aeson
import Data.Aeson.QQ
import Test.Tasty
import Test.Tasty.HUnit

import Cardano.Constitution.Checker.Params.Definition
import Cardano.Constitution.Checker.Types
import Data.Functor.Identity (Identity (Identity))
import Data.Ratio

main :: IO ()
main = defaultMain tests

tests :: TestTree
tests = testGroup "Tests" [unitTests]

unitTests :: TestTree
unitTests =
  testGroup
    "Unit tests"
    [ testCase "Simple parameter encoding" $
        let bs = encode [aesonQQ| { "0":  1 }|]
         in decode bs @?= Just (mkParameterChangeUnsafe [MkParamValue txFeePerByte 1])
    , testCase "Simple rational parameter encoding" $
        let bs = encode [aesonQQ| { "11":  1.2 }|]
         in decode bs @?= Just (mkParameterChangeUnsafe [MkParamValue treasuryCut (Identity (130 % 100))])
    , testCase "Wrong simple parameter encoding" $
        let bs = encode [aesonQQ| { "0":  1.2 }|]
         in decode bs @?= Nothing @ParameterChange
    ]
