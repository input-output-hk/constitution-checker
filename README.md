# Constitution checker

Constitution checker is a web-based tool that checks the constitutionality of a Parameter Update Proposal.
It implements checks for the guardrails from the [Constitution](https://raw.githubusercontent.com/IntersectMBO/interim-constitution/main/cardano-constitution-0.txt).

We are currently checking for 113 out of the 143 guardrails. If you would like to help us complete the list, please feel free to contribute.

Here is the list of guardrails we are currently checking for:

## GUARDRAILS AND GUIDELINES ON PROTOCOL PARAMETER UPDATE ACTIONS (1/6)
<details>
  <summary>1/6 checked</summary>
  
- [ ] PARAM-01
- [x] PARAM-02
- [ ] PARAM-03
- [ ] PARAM-04
- [ ] PARAM-05
- [ ] PARAM-06
</details>


### Changes to Specific Economic Parameters

#### Transaction fee per byte (txFeePerByte) and fixed transaction fee (txFeeFixed)
<details>
  <summary>6/8 checked</summary>
  
- [x] TFPB-01
- [x] TFPB-02
- [x] TFPB-03
- [x] TFF-01
- [x] TFF-02
- [x] TFF-03
- [ ] TFGEN-01
- [ ] TFGEN-02
</details>


#### UTxO cost per byte (utxoCostPerByte)
<details>
  <summary>4/5 checked</summary>
  
- [x] UCPB-01
- [x] UCPB-02
- [x] UCPB-03
- [x] UCPB-04
- [ ] UCPB-05
</details>

#### Stake address deposit (stakeAddressDeposit)
<details>
  <summary> 3/3 checked</summary>

- [x] SAD-01
- [x] SAD-02
- [x] SAD-03
</details>

#### Stake pool deposit (stakePoolDeposit)
<details>
  <summary>3/3 checked</summary>

- [x] SPD-01
- [x] SPD-02
- [x] SPD-03
</details>

#### Minimum Pool Cost (minPoolCost)
<details>
  <summary>2/3 checked</summary>

- [x] MPC-01
- [x] MPC-02
- [ ] MPC-03
</details>

#### Treasury Cut (treasuryCut)
<details>
  <summary>4/5 checked</summary>

- [x] TC-01
- [x] TC-02
- [x] TC-03
- [x] TC-04
- [ ] TC-05
</details>

#### Monetary Expansion Rate (monetaryExpansion)
<details>
  <summary>4/5 checked</summary>

- [x] ME-01
- [x] ME-02
- [x] ME-03
- [x] ME-04
- [ ] ME-05
</details>

#### Plutus Script Execution Prices (executionUnitPrices[priceSteps/priceMemory])
<details>
  <summary>4/6 checked</summary>
  
- [x] EIUP-PS-01
- [x] EIUP-PS-02
- [x] EIUP-PM-01
- [x] EIUP-PM-02
- [ ] EIUP-GEN-01
- [ ] EIUP-GEN-02 
</details>

#### Transaction fee per byte for a reference script (minFeeRefScriptCoinsPerByte)
<details>
  <summary>3/4 checked</summary>

- [x] MFRS-01
- [x] MFRS-02
- [x] MFRS-03
- [ ] MFRS-04
</details>
## Network Parameters
<details>
  <summary>2/2 checked</summary>

- [x] NETWORK-01
- [x] NETWORK-02
</details>
### Changes to Specific Network Parameters

#### Block Size (maxBlockBodySize)
<details>
  <summary>5/7 checked</summary>

- [x] MBBS-01
- [x] MBBS-02
- [x] MBBS-03 (partial)
- [x] MBBS-04
- [x] MBBS-05
- [ ] MBBS-06
- [ ] MBBS-07
</details>
#### Transaction Size (maxTxSize)
<details>
  <summary>5/6 checked</summary>

- [x] MTS-01
- [x] MTS-02
- [x] MTS-03
- [x] MTS-04
- [ ] MTS-05
- [x] MTS-06
</details>
#### Memory Unit Limits (maxBlockExecutionUnits[memory], maxTxExecutionUnits[memory])
<details>
  <summary>8/9 checked</summary>

- [x] MTEU-M-01
- [x] MTEU-M-02
- [x] MTEU-M-03
- [x] MTEU-M-04
- [x] MBEU-M-01
- [x] MBEU-M-02
- [x] MBEU-M-03
- [ ] MBEU-M-04
- [x] MEU-M-01
</details>
#### CPU Unit Limits (maxBlockExecutionUnits[steps], maxTxExecutionUnits[steps])
<details>
  <summary>8/9 checked</summary>

- [x] MTEU-S-01
- [x] MTEU-S-02
- [x] MTEU-S-03
- [x] MTEU-S-04
- [x] MBEU-S-01
- [x] MBEU-S-02
- [x] MBEU-S-03
- [ ] MBEU-S-04
- [x] MEU-S-01
</details>
#### Block Header Size (maxBlockHeaderSize)
<details>
  <summary>3/5 checked</summary>

- [x] MBHS-01
- [x] MBHS-02
- [ ] MBHS-03
- [x] MBHS-04
- [ ] MBHS-05
</details>
## Technical/Security Parameters

### Changes to Specific Technical/Security Parameters

#### Target Number of Stake Pools (stakePoolTargetNum)
<details>
  <summary>4/4 checked</summary>

- [x] SPTN-01
- [x] SPTN-02
- [x] SPTN-03
- [x] SPTN-04
</details>
#### Pledge Influence Factor (poolPledgeInfluence)
<details>
  <summary>3/4 checked</summary>

- [x] PPI-01
- [x] PPI-02
- [x] PPI-03
- [ ] PPI-04
</details>
#### Pool Retirement Window (poolRetireMaxEpoch)
<details>
  <summary>2/2 checked</summary>

- [x] PRME-01
- [x] PRME-02
</details>
#### Collateral Percentage (collateralPercentage)
<details>
  <summary>4/4 checked</summary>

- [x] CP-01
- [x] CP-02
- [x] CP-03
- [x] CP-04
</details>
#### Maximum number of collateral inputs (maxCollateralInputs)
<details>
  <summary>1/1 checked</summary>

- [x] MCI-01
</details>
#### Maximum Value Size (maxValueSize)
<details>
  <summary>4/5 checked</summary>

- [x] MVS-01
- [x] MVS-02
- [x] MVS-03
- [x] MVS-04
- [ ] MVS-05
</details>
#### Plutus Cost Models (costModels)
<details>
  <summary>0/4 checked</summary>

- [ ] PCM-01
- [ ] PCM-02
- [ ] PCM-03
- [ ] PCM-04
</details>
## Governance Parameters

### Changes to Specific Governance Parameters

#### Deposit for Governance Actions (govDeposit)
<details>
  <summary>3/4 checked</summary>

- [x] GD-01
- [x] GD-02
- [x] GD-03
- [ ] GD-04
</details>
#### Deposit for DReps (dRepDeposit)
<details>
  <summary>3/4 checked</summary>

- [x] DRD-01
- [x] DRD-02
- [x] DRD-03
- [ ] DRD-04
</details>
#### DRep Activity Period (dRepActivity)
<details>
  <summary>5/5 checked</summary>

- [x] DRA-01
- [x] DRA-02
- [x] DRA-03
- [x] DRA-04
- [x] DRA-05
</details>
#### DRep and SPO Governance Action Thresholds (dRepVotingThresholds[...],poolVotingThresholds[...])
<details>
  <summary>7/7 checked</summary>

- [x] VT-GEN-01
- [x] VT-GEN-02
- [x] VT-GEN-03
- [x] VT-HF-01
- [x] VT-CON-01
- [x] VT-CC-01
- [x] VT-NC-01
</details>
#### Governance Action Lifetime (govActionLifetime)
<details>
  <summary>5/5 checked</summary>

- [x] GAL-01
- [x] GAL-02
- [x] GAL-03
- [x] GAL-04
- [x] GAL-05
</details>
#### Maximum Constitutional Committee Term (committeeMaxTermLimit)
<details>
  <summary>5/5 checked</summary>

- [x] CMTL-01
- [x] CMTL-02
- [x] CMTL-03
- [x] CMTL-04
- [x] CMTL-05
</details>
#### The minimum size of the Constitutional Committee (committeeMinSize)
<details>
  <summary>3/3 checked</summary>

- [x] CMS-01
- [x] CMS-02
- [x] CMS-03
</details>
