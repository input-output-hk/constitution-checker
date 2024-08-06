# Constitution checker

Constitution checker is a web-based tool that checks the constitutionality of a Parameter Update Proposal.
It implements checks for the guardrails from the [Constitution](https://raw.githubusercontent.com/IntersectMBO/interim-constitution/main/cardano-constitution-0.txt).

We are currently checking for 112 out of the 143 guardrails. If you would like to help us complete the list, please feel free to contribute.

Here is the list of guardrails we are currently checking for:

## GUARDRAILS AND GUIDELINES ON PROTOCOL PARAMETER UPDATE ACTIONS

- [ ] PARAM-01
- [x] PARAM-02
- [ ] PARAM-03
- [ ] PARAM-04
- [ ] PARAM-05
- [ ] PARAM-06

### Changes to Specific Economic Parameters

#### Transaction fee per byte (txFeePerByte) and fixed transaction fee (txFeeFixed)

- [x] TFPB-01
- [x] TFPB-02
- [x] TFPB-03
- [x] TFF-01
- [x] TFF-02
- [x] TFF-03
- [ ] TFGEN-01
- [ ] TFGEN-02

#### UTxO cost per byte (utxoCostPerByte)

- [x] UCPB-01
- [x] UCPB-02
- [x] UCPB-03
- [x] UCPB-04
- [ ] UCPB-05

#### Stake address deposit (stakeAddressDeposit)

- [x] SAD-01
- [x] SAD-02
- [x] SAD-03

#### Stake pool deposit (stakePoolDeposit)

- [x] SPD-01
- [x] SPD-02
- [x] SPD-03

#### Minimum Pool Cost (minPoolCost)

- [x] MPC-01
- [x] MPC-02
- [ ] MPC-03

#### Treasury Cut (treasuryCut)

- [x] TC-01
- [x] TC-02
- [x] TC-03
- [x] TC-04
- [ ] TC-05

#### Monetary Expansion Rate (monetaryExpansion)

- [x] ME-01
- [x] ME-02
- [x] ME-03
- [x] ME-04
- [ ] ME-05

#### Plutus Script Execution Prices (executionUnitPrices[priceSteps/priceMemory])

- [x] EIUP-PS-01
- [x] EIUP-PS-02
- [x] EIUP-PM-01
- [x] EIUP-PM-02
- [ ] EIUP-GEN-01
- [ ] EIUP-GEN-02 

#### Transaction fee per byte for a reference script (minFeeRefScriptCoinsPerByte)

- [x] MFRS-01
- [x] MFRS-02
- [x] MFRS-03
- [ ] MFRS-04

## Network Parameters

- [ ] NETWORK-01
- [ ] NETWORK-02

### Changes to Specific Network Parameters

#### Block Size (maxBlockBodySize)

- [x] MBBS-01
- [x] MBBS-02
- [x] MBBS-03 (partial)
- [x] MBBS-04
- [x] MBBS-05
- [ ] MBBS-06
- [ ] MBBS-07

#### Transaction Size (maxTxSize)

- [x] MTS-01
- [x] MTS-02
- [x] MTS-03
- [x] MTS-04
- [ ] MTS-05
- [x] MTS-06

#### Memory Unit Limits (maxBlockExecutionUnits[memory], maxTxExecutionUnits[memory])

- [x] MTEU-M-01
- [x] MTEU-M-02
- [x] MTEU-M-03
- [x] MTEU-M-04
- [x] MBEU-M-01
- [x] MBEU-M-02
- [x] MBEU-M-03
- [ ] MBEU-M-04

- [x] MEU-M-01

#### CPU Unit Limits (maxBlockExecutionUnits[steps], maxTxExecutionUnits[steps])

- [x] MTEU-S-01
- [x] MTEU-S-02
- [x] MTEU-S-03
- [x] MTEU-S-04
- [x] MBEU-S-01
- [x] MBEU-S-02
- [x] MBEU-S-03
- [ ] MBEU-S-04

- [x] MEU-S-01

#### Block Header Size (maxBlockHeaderSize)

- [x] MBHS-01
- [x] MBHS-02
- [ ] MBHS-03
- [x] MBHS-04
- [ ] MBHS-05

## Technical/Security Parameters

### Changes to Specific Technical/Security Parameters

#### Target Number of Stake Pools (stakePoolTargetNum)

- [x] SPTN-01
- [x] SPTN-02
- [x] SPTN-03
- [x] SPTN-04

#### Pledge Influence Factor (poolPledgeInfluence)

- [x] PPI-01
- [x] PPI-02
- [x] PPI-03
- [ ] PPI-04

#### Pool Retirement Window (poolRetireMaxEpoch)

- [x] PRME-01
- [x] PRME-02

#### Collateral Percentage (collateralPercentage)

- [x] CP-01
- [x] CP-02
- [x] CP-03
- [x] CP-04

#### Maximum number of collateral inputs (maxCollateralInputs)

- [x] MCI-01

#### Maximum Value Size (maxValueSize)

- [x] MVS-01
- [x] MVS-02
- [x] MVS-03
- [x] MVS-04
- [ ] MVS-05

#### Plutus Cost Models (costModels)

- [ ] PCM-01
- [ ] PCM-02
- [ ] PCM-03
- [ ] PCM-04

## Governance Parameters

### Changes to Specific Governance Parameters

#### Deposit for Governance Actions (govDeposit)

- [x] GD-01
- [x] GD-02
- [x] GD-03
- [ ] GD-04

#### Deposit for DReps (dRepDeposit)

- [x] DRD-01
- [x] DRD-02
- [x] DRD-03
- [ ] DRD-04

#### DRep Activity Period (dRepActivity)

- [x] DRA-01
- [x] DRA-02
- [x] DRA-03
- [x] DRA-04
- [x] DRA-05

#### DRep and SPO Governance Action Thresholds (dRepVotingThresholds[...],poolVotingThresholds[...])

- [x] VT-GEN-01
- [x] VT-GEN-02
- [x] VT-GEN-03
- [x] VT-HF-01
- [x] VT-CON-01
- [x] VT-CC-01
- [x] VT-NC-01

#### Governance Action Lifetime (govActionLifetime)

- [x] GAL-01
- [x] GAL-02
- [x] GAL-03
- [x] GAL-04
- [x] GAL-05

#### Maximum Constitutional Committee Term (committeeMaxTermLimit)

- [x] CMTL-01
- [x] CMTL-02
- [x] CMTL-03
- [x] CMTL-04
- [x] CMTL-05

#### The minimum size of the Constitutional Committee (committeeMinSize)

- [x] CMS-01
- [x] CMS-02
- [x] CMS-03