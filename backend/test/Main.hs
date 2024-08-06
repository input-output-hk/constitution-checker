{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE TypeApplications #-}

import Data.Aeson
import Data.Aeson.QQ
import Test.Tasty
import Test.Tasty.HUnit

import Cardano.Constitution.Checker.Blockfrost
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
    , testCase "Simple blockfrost parameter decoding" $
        let expect = ProposalTx $ mkParametersChangeUnsafe [MkParamValue stakeAddressDeposit 1000000]
            bs =
              encode
                [aesonQQ|
          {
            "tx_hash": "4864566ddbf27933f7c85f9ab0c58e345de0e40ce03926f5a83be3da2f928ffe",
            "cert_index": 0,
            "governance_type": "parameter_change",
            "governance_description": {
              "tag": "ParameterChange",
              "contents": [
                null,
                {
                  "stakeAddressDeposit": 1000000
                },
                "edcd84c10e36ae810dc50847477083069db796219b39ccde790484e0"
              ]
            },
            "deposit": "100000000000",
            "return_address": "stake_test1uqy0zgdnd2ljhnwhm23928q7vef5zwnccsv7zuxnxxvjf5c0swgr8",
            "ratified_epoch": null,
            "enacted_epoch": null,
            "dropped_epoch": null,
            "expired_epoch": null,
            "expiration": 425,
            "anchor_url": "https://raw.githubusercontent.com/Ryun1/metadata/main/cip108/treasury-withdrawal.jsonld",
            "anchor_hash": "931f1d8cdfdc82050bd2baadfe384df8bf99b00e36cb12bfb8795beab3ac7fe5"
          }
        |]
         in decode bs @?= Just expect
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
