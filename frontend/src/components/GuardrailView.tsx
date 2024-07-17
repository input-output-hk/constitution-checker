import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import BodyTableRow from './BodyTableRow'
import useStore from '../store/store';
import { ParameterValidationResult } from '../store/types';

export default function GuardrailView() {
  const { validationResults, checkedStatus } = useStore(state => ({
    validationResults: state.validationResults,
    checkedStatus: state.checkedStatus || {},
  }));

  const getStatus = (paramName: string, paramId: string, guardrailKey: string, nestedParamId?: string) => {    
    let status = checkedStatus[paramId];  

    if (nestedParamId && typeof status === 'object' && status !== null) {
      status = status[nestedParamId];
    }

    if (status === 'unchecked') {
      return 'warning';
    }
  
   // Check if the key exists in validationResults
   const summaryKeys = paramName.split(/[.[\]]+/).filter(k => k);
   let jsonKey: any = validationResults;
   for (const key of summaryKeys) {
     if (jsonKey[key]) {
       jsonKey = jsonKey[key];
     } else {
       return 'warning';
     }
   }

   const guardrails = (jsonKey as ParameterValidationResult).guardrails;

   if (guardrails && guardrailKey in guardrails) {
    const guardrailResult = guardrails[guardrailKey].result;

    if (status === 'checked') {
      if (guardrailResult === true) {
        return 'active';
      } else if (guardrailResult === false) {
        return 'inactive';
      }
    }
  }

  return 'warning';
};

  return (
      <Table size="small" aria-label="simple table" stickyHeader>
      <TableHead>
          <TableRow>
            <TableCell>Guardrail Name</TableCell>
            <TableCell align="right">Parameter</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
       
        <TableBody>
          {/* txFeePerByte */}
          <BodyTableRow name="TFPB-01" parameter="txFeePerByte" status={getStatus('txFeePerByte', '0', 'TFPB-01')}/>
          <BodyTableRow name="TFPB-02" parameter="txFeePerByte" status={getStatus('txFeePerByte', '0', 'TFPB-02')}/>
          <BodyTableRow name="TFPB-03" parameter="txFeePerByte" status={getStatus('txFeePerByte', '0', 'TFPB-03')}/>
          <BodyTableRow name="TFGEN-01" parameter="txFeePerByte" status={getStatus('txFeePerByte', '0', 'TFGEN-01')}/>
          <BodyTableRow name="TFGEN-02" parameter="txFeePerByte" status={getStatus('txFeePerByte', '0', 'TFGEN-02')}/>

          {/* utxoCostPerByte */}
          <BodyTableRow name="UCPB-01" parameter="utxoCostPerByte" status={getStatus('utxoCostPerByte', '17', 'UCPB-01')}/>
          <BodyTableRow name="UCPB-02" parameter="utxoCostPerByte" status={getStatus('utxoCostPerByte', '17', 'UCPB-02')}/>
          <BodyTableRow name="UCPB-03" parameter="utxoCostPerByte" status={getStatus('utxoCostPerByte', '17', 'UCPB-03')}/>
          <BodyTableRow name="UCPB-04" parameter="utxoCostPerByte" status={getStatus('utxoCostPerByte', '17', 'UCPB-04')}/>
          <BodyTableRow name="UCPB-05" parameter="utxoCostPerByte" status={getStatus('utxoCostPerByte', '17', 'UCPB-05')}/>

          {/* stakeAddressDeposit */}
          <BodyTableRow name="SAD-01" parameter="stakeAddressDeposit" status={getStatus('stakeAddressDeposit', '5', 'SAD-01')}/>
          <BodyTableRow name="SAD-02" parameter="stakeAddressDeposit" status={getStatus('stakeAddressDeposit', '5', 'SAD-02')}/>
          <BodyTableRow name="SAD-03" parameter="stakeAddressDeposit" status={getStatus('stakeAddressDeposit', '5', 'SAD-03')}/>

          {/* stakePoolDeposit */}
          <BodyTableRow name="SDP-03" parameter="stakePoolDeposit" status={getStatus('stakePoolDeposit', '6', 'SDP-03')}/>
          <BodyTableRow name="SPD-01" parameter="stakePoolDeposit" status={getStatus('stakePoolDeposit', '6', 'SPD-01')}/>
          <BodyTableRow name="SPD-02" parameter="stakePoolDeposit" status={getStatus('stakePoolDeposit', '6', 'SPD-02')}/>

          {/* minPoolCost */}
          <BodyTableRow name="MPC-01" parameter="minPoolCost" status={getStatus('minPoolCost', '16', 'MPC-01')}/>
          <BodyTableRow name="MPC-02" parameter="minPoolCost" status={getStatus('minPoolCost', '16', 'MPC-02')}/>
          <BodyTableRow name="MPC-03" parameter="minPoolCost" status={getStatus('minPoolCost', '16', 'MPC-03')}/>

          {/* treasuryCut */}
          <BodyTableRow name="TC-01" parameter="treasuryCut" status={getStatus('treasuryCut', '11', 'TC-01')}/>
          <BodyTableRow name="TC-02" parameter="treasuryCut" status={getStatus('treasuryCut', '11', 'TC-02')}/>
          <BodyTableRow name="TC-03" parameter="treasuryCut" status={getStatus('treasuryCut', '11', 'TC-03')}/>
          <BodyTableRow name="TC-04" parameter="treasuryCut" status={getStatus('treasuryCut', '11', 'TC-04')}/>
          <BodyTableRow name="TC-05" parameter="treasuryCut" status={getStatus('treasuryCut', '11', 'TC-05')}/>

          {/* monetaryExpansion */}
          <BodyTableRow name="ME-01" parameter="monetaryExpansion" status={getStatus('monetaryExpansion', '10', 'ME-01')}/>
          <BodyTableRow name="ME-02" parameter="monetaryExpansion" status={getStatus('monetaryExpansion', '10', 'ME-02')}/>
          <BodyTableRow name="ME-03" parameter="monetaryExpansion" status={getStatus('monetaryExpansion', '10', 'ME-03')}/>
          <BodyTableRow name="ME-04" parameter="monetaryExpansion" status={getStatus('monetaryExpansion', '10', 'ME-04')}/>
          <BodyTableRow name="ME-05" parameter="monetaryExpansion" status={getStatus('monetaryExpansion', '10', 'ME-05')}/>

           {/* executionUnitPrices */}
          <BodyTableRow name="EIUP-GEN-01" parameter={"executionUnitPrices[priceMemory]"} status={getStatus('executionUnitPrices[priceMemory]', '28', "EIUP-GEN-01", 'priceMemory')}/>
          <BodyTableRow name="EIUP-GEN-02" parameter={"executionUnitPrices[priceMemory]"} status={getStatus('executionUnitPrices[priceMemory]', '28', "EIUP-GEN-02", 'priceMemory')}/>
          <BodyTableRow name="EIUP-PM-01" parameter="executionUnitPrices[priceMemory]" status={getStatus('executionUnitPrices[priceMemory]', '28', "EIUP-PM-01", 'priceMemory')}/>
          <BodyTableRow name="EIUP-PM-02" parameter="executionUnitPrices[priceMemory]" status={getStatus('executionUnitPrices[priceMemory]', '28', "EIUP-PM-02", 'priceMemory')}/>
          <BodyTableRow name="EIUP-GEN-01" parameter={"executionUnitPrices[priceSteps]"} status={getStatus('executionUnitPrices[priceSteps]', '28', "EIUP-GEN-01", 'priceSteps')}/>
          <BodyTableRow name="EIUP-GEN-02" parameter={"executionUnitPrices[priceSteps]"} status={getStatus('executionUnitPrices[priceSteps]', '28', "EIUP-GEN-02", 'priceSteps')}/>
          <BodyTableRow name="EIUP-PS-01" parameter="executionUnitPrices[priceSteps]" status={getStatus('executionUnitPrices[priceSteps]', '28', "EIUP-PS-01", 'priceSteps')}/>
          <BodyTableRow name="EIUP-PS-02" parameter="executionUnitPrices[priceSteps]" status={getStatus('executionUnitPrices[priceSteps]', '28', "EIUP-PS-02", 'priceSteps')}/>

          {/* minFeeRefScriptCoinsPerByte */}
          <BodyTableRow name="MFRS-01" parameter="minFeeRefScriptCoinsPerByte" status={getStatus('minFeeRefScriptCoinsPerByte', '33', "MFRS-01")}/>
          <BodyTableRow name="MFRS-02" parameter="minFeeRefScriptCoinsPerByte" status={getStatus('minFeeRefScriptCoinsPerByte', '33', "MFRS-02")}/>
          <BodyTableRow name="MFRS-03" parameter="minFeeRefScriptCoinsPerByte" status={getStatus('minFeeRefScriptCoinsPerByte', '33', "MFRS-03")}/>
          <BodyTableRow name="MFRS-04" parameter="minFeeRefScriptCoinsPerByte" status={getStatus('minFeeRefScriptCoinsPerByte', '33', "MFRS-04")}/>

          {/* maxBlockBodySize */}
          <BodyTableRow name="MBBS-01" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-01")}/>
          <BodyTableRow name="MBBS-02" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-02")}/>
          <BodyTableRow name="MBBS-03" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-03")}/>
          <BodyTableRow name="MBBS-04" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-04")}/>
          <BodyTableRow name="MBBS-05" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-05")}/>
          <BodyTableRow name="MBBS-06" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-06")}/>
          <BodyTableRow name="MBBS-07" parameter="maxBlockBodySize" status={getStatus('maxBlockBodySize', '2', "MBBS-07")}/>

          {/* maxTxSize */}
          <BodyTableRow name="MTS-01" parameter="maxTxSize" status={getStatus('maxTxSize', '3', "MTS-01")}/>
          <BodyTableRow name="MTS-02" parameter="maxTxSize" status={getStatus('maxTxSize', '3', "MTS-02")}/>
          <BodyTableRow name="MTS-03" parameter="maxTxSize" status={getStatus('maxTxSize', '3', "MTS-03")}/>
          <BodyTableRow name="MTS-04" parameter="maxTxSize" status={getStatus('maxTxSize', '3', "MTS-04")}/>
          <BodyTableRow name="MTS-05" parameter="maxTxSize" status={getStatus('maxTxSize', '3', "MTS-05")}/>
          <BodyTableRow name="MTS-06" parameter="maxTxSize" status={getStatus('maxTxSize', '3', "MTS-06")}/>

          {/* maxBlockExecutionUnits */}
          <BodyTableRow name="MBEU-M-01" parameter="maxBlockExecutionUnits[memory]" status={getStatus('maxBlockExecutionUnits[memory]', '21', "MBEU-M-01", 'memory')}/>
          <BodyTableRow name="MBEU-M-02" parameter="maxBlockExecutionUnits[memory]" status={getStatus('maxBlockExecutionUnits[memory]', '21', "MBEU-M-02", 'memory')}/>
          <BodyTableRow name="MBEU-M-03" parameter="maxBlockExecutionUnits[memory]" status={getStatus('maxBlockExecutionUnits[memory]', '21', "MBEU-M-03", 'memory')}/>
          <BodyTableRow name="MBEU-M-04" parameter="maxBlockExecutionUnits[memory]" status={getStatus('maxBlockExecutionUnits[memory]', '21', "MBEU-M-04", 'memory')}/>
          <BodyTableRow name="MEU-M-01" parameter="maxBlockExecutionUnits[memory]" status={getStatus('maxBlockExecutionUnits[memory]', '21', "MEU-M-01", 'memory')}/>
          <BodyTableRow name="MBEU-S-01" parameter="maxBlockExecutionUnits[steps]" status={getStatus('maxBlockExecutionUnits[steps]', '21', "MBEU-S-01", 'steps')}/>
          <BodyTableRow name="MBEU-S-02" parameter="maxBlockExecutionUnits[steps]" status={getStatus('maxBlockExecutionUnits[steps]', '21', "MBEU-S-02", 'steps')}/>
          <BodyTableRow name="MBEU-S-03" parameter="maxBlockExecutionUnits[steps]" status={getStatus('maxBlockExecutionUnits[steps]', '21', "MBEU-S-03", 'steps')}/>
          <BodyTableRow name="MBEU-S-04" parameter="maxBlockExecutionUnits[steps]" status={getStatus('maxBlockExecutionUnits[steps]', '21', "MBEU-S-04", 'steps')}/>
          <BodyTableRow name="MEU-S-01" parameter="maxBlockExecutionUnits[steps]" status={getStatus('maxBlockExecutionUnits[steps]', '21', "MEU-S-01", 'steps')}/>

          {/* maxTxExecutionUnits */}
          <BodyTableRow name="MTEU-M-01" parameter="maxTxExecutionUnits[mem]" status={getStatus('maxTxExecutionUnits[mem]', '20', "MTEU-M-01", 'mem')}/>
          <BodyTableRow name="MTEU-M-02" parameter="maxTxExecutionUnits[mem]" status={getStatus('maxTxExecutionUnits[mem]', '20', "MTEU-M-02", 'mem')}/>
          <BodyTableRow name="MTEU-M-03" parameter="maxTxExecutionUnits[mem]" status={getStatus('maxTxExecutionUnits[mem]', '20', "MTEU-M-03", 'mem')}/>
          <BodyTableRow name="MTEU-M-04" parameter="maxTxExecutionUnits[mem]" status={getStatus('maxTxExecutionUnits[mem]', '20', "MTEU-M-04", 'mem')}/>
          <BodyTableRow name="MTEU-S-01" parameter="maxTxExecutionUnits[steps]" status={getStatus('maxTxExecutionUnits[steps]', '20', "MTEU-S-01", 'steps')}/>
          <BodyTableRow name="MTEU-S-02" parameter="maxTxExecutionUnits[steps]" status={getStatus('maxTxExecutionUnits[steps]', '20', "MTEU-S-02", 'steps')}/>
          <BodyTableRow name="MTEU-S-03" parameter="maxTxExecutionUnits[steps]" status={getStatus('maxTxExecutionUnits[steps]', '20', "MTEU-S-03", 'steps')}/>
          <BodyTableRow name="MTEU-S-04" parameter="maxTxExecutionUnits[steps]" status={getStatus('maxTxExecutionUnits[steps]', '20', "MTEU-S-04", 'steps')}/>

          {/* maxBlockHeaderSize */}
          <BodyTableRow name="MBHS-01" parameter="maxBlockHeaderSize" status={getStatus('maxBlockHeaderSize', '4', "MBHS-01")}/>
          <BodyTableRow name="MBHS-02" parameter="maxBlockHeaderSize" status={getStatus('maxBlockHeaderSize', '4', "MBHS-02")}/>
          <BodyTableRow name="MBHS-03" parameter="maxBlockHeaderSize" status={getStatus('maxBlockHeaderSize', '4', "MBHS-03")}/>
          <BodyTableRow name="MBHS-04" parameter="maxBlockHeaderSize" status={getStatus('maxBlockHeaderSize', '4', "MBHS-04")}/>
          <BodyTableRow name="MBHS-05" parameter="maxBlockHeaderSize" status={getStatus('maxBlockHeaderSize', '4', "MBHS-05")}/>

          {/* stakePoolTargetNum */}
          <BodyTableRow name="SPTN-01" parameter="stakePoolTargetNum" status={getStatus('stakePoolTargetNum', '8', "SPTN-01")}/>
          <BodyTableRow name="SPTN-02" parameter="stakePoolTargetNum" status={getStatus('stakePoolTargetNum', '8', "SPTN-02")}/>
          <BodyTableRow name="SPTN-03" parameter="stakePoolTargetNum" status={getStatus('stakePoolTargetNum', '8', "SPTN-03")}/>
          <BodyTableRow name="SPTN-04" parameter="stakePoolTargetNum" status={getStatus('stakePoolTargetNum', '8', "SPTN-04")}/>

          {/* poolPledgeInfluence */}
          <BodyTableRow name="PPI-01" parameter="poolPledgeInfluence" status={getStatus('poolPledgeInfluence', '9', "PPI-01")}/>
          <BodyTableRow name="PPI-02" parameter="poolPledgeInfluence" status={getStatus('poolPledgeInfluence', '9', "PPI-02")}/>
          <BodyTableRow name="PPI-03" parameter="poolPledgeInfluence" status={getStatus('poolPledgeInfluence', '9', "PPI-03")}/>
          <BodyTableRow name="PPI-04" parameter="poolPledgeInfluence" status={getStatus('poolPledgeInfluence', '9', "PPI-04")}/>

          {/* poolRetireMaxEpoch */}
          <BodyTableRow name="PRME-01" parameter="poolRetireMaxEpoch" status={getStatus('poolRetireMaxEpoch', '7', "PRME-01")}/>
          <BodyTableRow name="PRME-02" parameter="poolRetireMaxEpoch" status={getStatus('poolRetireMaxEpoch', '7', "PRME-02")}/>

        {/* collateralPercentage */}
          <BodyTableRow name="CP-01" parameter="collateralPercentage" status={getStatus('collateralPercentage', '23',"CP-01")}/>
          <BodyTableRow name="CP-02" parameter="collateralPercentage" status={getStatus('collateralPercentage', '23', "CP-02")}/>
          <BodyTableRow name="CP-03" parameter="collateralPercentage" status={getStatus('collateralPercentage', '23', "CP-03")}/>
          <BodyTableRow name="CP-04" parameter="collateralPercentage" status={getStatus('collateralPercentage', '23', "CP-04")}/>

          {/* maxCollateralInputs */}
          <BodyTableRow name="MCI-01" parameter="maxCollateralInputs" status={getStatus('maxCollateralInputs', '24', "MCI-01")}/>

          {/* maxValueSize */}
          <BodyTableRow name="MVS-01" parameter="maxValueSize" status={getStatus('maxValueSize', '22', "MVS-01")}/>
          <BodyTableRow name="MVS-02" parameter="maxValueSize" status={getStatus('maxValueSize', '22', "MVS-02")}/>
          <BodyTableRow name="MVS-03" parameter="maxValueSize" status={getStatus('maxValueSize', '22', "MVS-03")}/>
          <BodyTableRow name="MVS-04" parameter="maxValueSize" status={getStatus('maxValueSize', '22', "MVS-04")}/>
          <BodyTableRow name="MVS-05" parameter="maxValueSize" status={getStatus('maxValueSize', '22', "MVS-05")}/>

          {/* govDeposit */}
          <BodyTableRow name="GD-01" parameter="govDeposit" status={getStatus('govDeposit', '30', "GD-01")}/>
          <BodyTableRow name="GD-02" parameter="govDeposit" status={getStatus('govDeposit', '30', "GD-02")}/>
          <BodyTableRow name="GD-03" parameter="govDeposit" status={getStatus('govDeposit', '30', "GD-03")}/>
          <BodyTableRow name="GD-04" parameter="govDeposit" status={getStatus('govDeposit', '30', "GD-04")}/>

           {/* dRepDeposit */}
          <BodyTableRow name="DRD-01" parameter="dRepDeposit" status={getStatus('dRepDeposit', '31', "DRD-01")}/>
          <BodyTableRow name="DRD-02" parameter="dRepDeposit" status={getStatus('dRepDeposit', '31', "DRD-02")}/>
          <BodyTableRow name="DRD-03" parameter="dRepDeposit" status={getStatus('dRepDeposit', '31', "DRD-03")}/>
          <BodyTableRow name="DRD-04" parameter="dRepDeposit" status={getStatus('dRepDeposit', '31', "DRD-04")}/>

           {/* dRepActivity */}
          <BodyTableRow name="DRA-01" parameter="dRepActivity" status={getStatus('dRepActivity', '32', "DRA-01")}/>
          <BodyTableRow name="DRA-02" parameter="dRepActivity" status={getStatus('dRepActivity', '32', "DRA-02")}/>
          <BodyTableRow name="DRA-03" parameter="dRepActivity" status={getStatus('dRepActivity', '32', "DRA-03")}/>
          <BodyTableRow name="DRA-04" parameter="dRepActivity" status={getStatus('dRepActivity', '32', "DRA-04")}/>
          <BodyTableRow name="DRA-05" parameter="dRepActivity" status={getStatus('dRepActivity', '32', "DRA-05")}/>

          {/* dRepVotingThresholds */}
          <BodyTableRow name="VT-CC-01" parameter={"dRepVotingThresholds[committeeNoConfidence]"} status={getStatus('dRepVotingThresholds[committeeNoConfidence]', '26', 'VT-CC-01', 'committeeNoConfidence')}/>
          <BodyTableRow name="VT-CC-01b" parameter={"dRepVotingThresholds[committeeNoConfidence]"} status={getStatus('dRepVotingThresholds[committeeNoConfidence]', '26', "VT-CC-01b", 'committeeNoConfidence')}/>
          <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[committeeNoConfidence]" status={getStatus('dRepVotingThresholds[committeeNoConfidence]', '26', "VT-GEN-01", 'committeeNoConfidence')}/>
          <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[committeeNoConfidence]" status={getStatus('dRepVotingThresholds[committeeNoConfidence]', '26', "VT-GEN-01b", 'committeeNoConfidence')}/>

          <BodyTableRow name="VT-CC-01" parameter={"dRepVotingThresholds[committeeNormal]"} status={getStatus('dRepVotingThresholds[committeeNormal]', '26', 'VT-CC-01', 'committeeNormal')}/>
          <BodyTableRow name="VT-CC-01b" parameter={"dRepVotingThresholds[committeeNormal]"} status={getStatus('dRepVotingThresholds[committeeNormal]', '26', "VT-CC-01b", 'committeeNormal')}/>
          <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[committeeNormal]" status={getStatus('dRepVotingThresholds[committeeNormal]', '26', 'VT-GEN-01', 'committeeNormal')}/>
          <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[committeeNormal]" status={getStatus('dRepVotingThresholds[committeeNormal]', '26', "VT-GEN-01b", 'committeeNormal')}/>
        
          <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds[hardForkInitiation]', '26', "VT-GEN-01", 'hardForkInitiation')}/>
          <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds[hardForkInitiation]', '26', "VT-GEN-01b", 'hardForkInitiation')}/>
          <BodyTableRow name="VT-HF-01" parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds[hardForkInitiation]', '26', "VT-HF-01", 'hardForkInitiation')}/>
          <BodyTableRow name="VT-HF-01b" parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds[hardForkInitiation]', '26', "VT-HF-01b", 'hardForkInitiation')}/>
        
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds[motionNoConfidence]', '26', 'VT-GEN-01', 'motionNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds[motionNoConfidence]', '26', 'VT-GEN-01b', 'motionNoConfidence')}/>
        <BodyTableRow name="VT-NC-01" parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds[motionNoConfidence]', '26', 'VT-NC-01', 'motionNoConfidence')}/>
        <BodyTableRow name="VT-NC-01b" parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds[motionNoConfidence]', '26', 'VT-NC-01b', 'motionNoConfidence')}/>
        
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds[ppEconomicGroup]', '26', 'VT-GEN-01', 'ppEconomicGroup')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds[ppEconomicGroup]', '26', 'VT-GEN-01b', 'ppEconomicGroup')}/>
        <BodyTableRow name="VT-GEN-02" parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds[ppEconomicGroup]', '26', 'VT-GEN-02', 'ppEconomicGroup')}/>
        <BodyTableRow name="VT-GEN-02b" parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds[ppEconomicGroup]', '26', 'VT-GEN-02b', 'ppEconomicGroup')}/>
        
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds[ppGovernanceGroup]', '26', 'VT-GEN-01', 'ppGovernanceGroup')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds[ppGovernanceGroup]', '26', 'VT-GEN-01b', 'ppGovernanceGroup')}/>
        <BodyTableRow name="VT-GOV-01" parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds[ppGovernanceGroup]', '26', 'VT-GOV-01', 'ppGovernanceGroup')}/>
        <BodyTableRow name="VT-GOV-01b" parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds[ppGovernanceGroup]', '26', 'VT-GOV-01b', 'ppGovernanceGroup')}/>
       
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds[ppNetworkGroup]', '26', 'VT-GEN-01', 'ppNetworkGroup')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds[ppNetworkGroup]', '26', 'VT-GEN-01b', 'ppNetworkGroup')}/>
        <BodyTableRow name="VT-GEN-02" parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds[ppNetworkGroup]', '26', 'VT-GEN-02', 'ppNetworkGroup')}/>
        <BodyTableRow name="VT-GEN-02b" parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds[ppNetworkGroup]', '26', 'VT-GEN-02b', 'ppNetworkGroup')}/>
        
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds[ppTechnicalGroup]', '26', 'VT-GEN-01', 'ppTechnicalGroup')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds[ppTechnicalGroup]', '26', 'VT-GEN-01b', 'ppTechnicalGroup')}/>
        <BodyTableRow name="VT-GEN-02" parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds[ppTechnicalGroup]', '26', 'VT-GEN-02', 'ppTechnicalGroup')}/>
        <BodyTableRow name="VT-GEN-02b" parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds[ppTechnicalGroup]', '26', 'VT-GEN-02b', 'ppTechnicalGroup')}/>
        
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[treasuryWithdrawal]" status={getStatus('dRepVotingThresholds[treasuryWithdrawal]', '26', 'VT-GEN-01', 'treasuryWithdrawal')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[treasuryWithdrawal]" status={getStatus('dRepVotingThresholds[treasuryWithdrawal]', '26', 'VT-GEN-01b', 'treasuryWithdrawal')}/>
        
        <BodyTableRow name="VT-CON-01" parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds[updateConstitution]', '26', 'VT-CON-01', 'updateConstitution')}/>
        <BodyTableRow name="VT-CON-01b" parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds[updateConstitution]', '26', 'VT-CON-01b', 'updateConstitution')}/>
        <BodyTableRow name="VT-GEN-01" parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds[updateConstitution]', '26', 'VT-GEN-01', 'updateConstitution')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds[updateConstitution]', '26', 'VT-GEN-01b', 'updateConstitution')}/>

        {/* poolVotingThresholds */}
        <BodyTableRow name="VT-CC-01" parameter="poolVotingThresholds[committeeNoConfidence]" status={getStatus('poolVotingThresholds[committeeNoConfidence]', '25', 'VT-CC-01', 'committeeNoConfidence')}/>
        <BodyTableRow name="VT-CC-01b" parameter="poolVotingThresholds[committeeNoConfidence]" status={getStatus('poolVotingThresholds[committeeNoConfidence]', '25', 'VT-CC-01b', 'committeeNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01" parameter="poolVotingThresholds[committeeNoConfidence]" status={getStatus('poolVotingThresholds[committeeNoConfidence]', '25', 'VT-GEN-01', 'committeeNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="poolVotingThresholds[committeeNoConfidence]" status={getStatus('poolVotingThresholds[committeeNoConfidence]', '25', 'VT-GEN-01b', 'committeeNoConfidence')}/>

        <BodyTableRow name="VT-CC-01" parameter="poolVotingThresholds[committeeNormal]" status={getStatus('poolVotingThresholds[committeeNormal]', '25', 'VT-CC-01', 'committeeNormal')}/>
        <BodyTableRow name="VT-CC-01b" parameter="poolVotingThresholds[committeeNormal]" status={getStatus('poolVotingThresholds[committeeNormal]', '25', 'VT-CC-01b', 'committeeNormal')}/>
        <BodyTableRow name="VT-GEN-01" parameter="poolVotingThresholds[committeeNormal]" status={getStatus('poolVotingThresholds[committeeNormal]', '25', 'VT-GEN-01', 'committeeNormal')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="poolVotingThresholds[committeeNormal]" status={getStatus('poolVotingThresholds[committeeNormal]', '25', 'VT-GEN-01b', 'committeeNormal')}/>

        <BodyTableRow name="VT-GEN-01" parameter="poolVotingThresholds[hardForkInitiation]" status={getStatus('poolVotingThresholds[hardForkInitiation]', '25', 'VT-GEN-01', 'hardForkInitiation')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="poolVotingThresholds[hardForkInitiation]" status={getStatus('poolVotingThresholds[hardForkInitiation]', '25', 'VT-GEN-01b', 'hardForkInitiation')}/>
        <BodyTableRow name="VT-HF-01" parameter="poolVotingThresholds[hardForkInitiation]" status={getStatus('poolVotingThresholds[hardForkInitiation]', '25', 'VT-HF-01', 'hardForkInitiation')}/>
        <BodyTableRow name="VT-HF-01b" parameter="poolVotingThresholds[hardForkInitiation]" status={getStatus('poolVotingThresholds[hardForkInitiation]', '25', 'VT-HF-01b', 'hardForkInitiation')}/>

        <BodyTableRow name="VT-GEN-01" parameter="poolVotingThresholds[motionNoConfidence]" status={getStatus('poolVotingThresholds[motionNoConfidence]', '25', 'VT-GEN-01', 'motionNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="poolVotingThresholds[motionNoConfidence]" status={getStatus('poolVotingThresholds[motionNoConfidence]', '25', 'VT-GEN-01b', 'motionNoConfidence')}/>
        <BodyTableRow name="VT-NC-01" parameter="poolVotingThresholds[motionNoConfidence]" status={getStatus('poolVotingThresholds[motionNoConfidence]', '25', 'VT-NC-01', 'motionNoConfidence')}/>
        <BodyTableRow name="VT-NC-01b" parameter="poolVotingThresholds[motionNoConfidence]" status={getStatus('poolVotingThresholds[motionNoConfidence]', '25', 'VT-NC-01b', 'motionNoConfidence')}/>

        <BodyTableRow name="VT-GEN-01" parameter="poolVotingThresholds[ppSecurityGroup]" status={getStatus('poolVotingThresholds[ppSecurityGroup]', '25', 'VT-GEN-01', 'ppSecurityGroup')}/>
        <BodyTableRow name="VT-GEN-01b" parameter="poolVotingThresholds[ppSecurityGroup]" status={getStatus('poolVotingThresholds[ppSecurityGroup]', '25', 'VT-GEN-01b', 'ppSecurityGroup')}/>

        {/* govActionLifetime */}
        <BodyTableRow name="GAL-01" parameter="govActionLifetime" status={getStatus('govActionLifetime', '29', "GAL-01")}/>
        <BodyTableRow name="GAL-02" parameter="govActionLifetime" status={getStatus('govActionLifetime', '29', "GAL-02")}/>
        <BodyTableRow name="GAL-03" parameter="govActionLifetime" status={getStatus('govActionLifetime', '29', "GAL-03")}/>
        <BodyTableRow name="GAL-04" parameter="govActionLifetime" status={getStatus('govActionLifetime', '29', "GAL-04")}/>
        <BodyTableRow name="GAL-05" parameter="govActionLifetime" status={getStatus('govActionLifetime', '29', "GAL-05")}/>

        {/* committeeMaxTermLimit */}
          <BodyTableRow name="CMTL-01" parameter="committeeMaxTermLimit" status={getStatus('committeeMaxTermLimit', '28', "CMTL-01")}/>
          <BodyTableRow name="CMTL-02" parameter="committeeMaxTermLimit" status={getStatus('committeeMaxTermLimit', '28', "CMTL-02")}/>
          <BodyTableRow name="CMTL-03" parameter="committeeMaxTermLimit" status={getStatus('committeeMaxTermLimit', '28', "CMTL-03")}/>
          <BodyTableRow name="CMTL-04" parameter="committeeMaxTermLimit" status={getStatus('committeeMaxTermLimit', '28', "CMTL-04")}/>
          <BodyTableRow name="CMTL-05" parameter="committeeMaxTermLimit" status={getStatus('committeeMaxTermLimit', '28', "CMTL-05")}/>

          {/* committeeMinSize */}
          <BodyTableRow name="CMS-01" parameter="committeeMinSize" status={getStatus('committeeMinSize', '27', "CMS-01")}/>
          <BodyTableRow name="CMS-02" parameter="committeeMinSize" status={getStatus('committeeMinSize', '27', "CMS-02")}/>
          <BodyTableRow name="CMS-03" parameter="committeeMinSize" status={getStatus('committeeMinSize', '27', "CMS-03")}/>

        </TableBody>
        
      </Table>
  );
}
