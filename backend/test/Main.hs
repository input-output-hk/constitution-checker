{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE TypeApplications #-}

import Data.Aeson
import Data.Aeson.QQ
import Test.Tasty
import Test.Tasty.HUnit

import Cardano.Constitution.Checker.Params.Definition
import Cardano.Constitution.Checker.Params.Types
import Cardano.Constitution.Checker.Types
import Data.Functor.Identity (Identity (Identity))

-- import Data.Ratio

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
         in decode bs @?= Just (mkParametersChangeUnsafe [MkParamValue txFeePerByte 1])
    , testCase "Simple rational parameter encoding works with tuple of integers" $
        let bs = encode [aesonQQ| { "11":  [6,5] }|]
         in decode bs @?= Just (mkParametersChangeUnsafe [MkParamValue treasuryCut (Identity (6 % 5))])
    , testCase "Simple rational parameter encoding works with scientific" $
        let bs = encode [aesonQQ| { "11":  1.2 }|]
         in decode bs @?= Just (mkParametersChangeUnsafe [MkParamValue treasuryCut (Identity (6 % 5))])
    , testCase "More than 2 array elements for rational it's failing" $
        let bs = encode [aesonQQ| { "11":  [6,5,4] }|]
         in decode bs @?= Nothing @ParametersChange
    , testCase "Less than 2 array elements for rational it's failing" $
        let bs = encode [aesonQQ| { "11":  [6] }|]
         in decode bs @?= Nothing @ParametersChange
    , testCase "Wrong simple parameter encoding" $
        let bs = encode [aesonQQ| { "0":  [6,5] }|]
         in decode bs @?= Nothing @ParametersChange
    , testCase "Successfully decodes a collection" $
        let bs =
              encode
                [aesonQQ| {
                  "19":  {
                    "priceMemory": [ 1, 25 ],
                    "priceSteps": [ 1, 20000 ]
                  } } |]
         in decode bs
              @?= Just
                ( mkParametersChangeUnsafe
                    [ MkParamValue
                        executionUnitPrices
                        [ 1 % 25
                        , 1 % 20000
                        ]
                    ]
                )
    , testCase "Fails to decode a collection becouse of missing element" $
        let bs = encode [aesonQQ| { "19":  { "priceSteps": [ 1, 20000 ] } } |]
         in decode bs @?= Nothing @ParametersChange
    ]
