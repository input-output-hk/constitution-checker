import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import BodyTableRow from './BodyTableRow'
import useStore from '../store/store';

export default function ParameterView() {
  const { currentJsonState, validationResults, checkedStatus } = useStore(state => ({
    currentJsonState: state.currentJsonState,
    validationResults: state.validationResults,
    checkedStatus: state.checkedStatus || {},
  }));

  const getStatus = (paramName: string, paramId: string, nestedParamId?: string) => {
    
    let status = checkedStatus[paramId];  

    if (nestedParamId) {
      if (typeof status === 'object' && status !== null && status[nestedParamId] === 'unchecked') {
        return 'warning';
      }
    } else if (status === 'unchecked') {
      return 'warning';
    }
  
    // Check if the key exists in validationResults
    const summaryKeys = paramName.split(/[.[\]]+/).filter(k => k);
    let result: any = validationResults;
    for (const k of summaryKeys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        return "warning"; 
      }
    }
  
    // Handle nested ParameterValidationResult objects
    return result && typeof result === 'object' && 'summary' in result
        ? result.summary ? "active" : "inactive"
        : "warning";
  };

  return (
      <Table size="small" aria-label="simple table" stickyHeader>
      <TableHead>
          <TableRow>
            <TableCell>Parameter Name</TableCell>
            <TableCell align="right">Proposed Value</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
       
        <TableBody>
          <BodyTableRow name='txFeePerByte' value={currentJsonState?.[0]} status={getStatus('txFeePerByte', '0')}/>
          <BodyTableRow name='txFeeFixed' value={currentJsonState?.[1]} status={getStatus('txFeeFixed', '1')}/>
          <BodyTableRow name='maxBlockBodySize' value={currentJsonState?.[2]} status={getStatus('maxBlockBodySize', '2')}/>
          <BodyTableRow name='maxTxSize' value={currentJsonState?.[3]} status={getStatus('maxTxSize', '3')}/>
          <BodyTableRow name='maxBlockHeaderSize' value={currentJsonState?.[4]} status={getStatus('maxBlockHeaderSize', '4')}/>
          <BodyTableRow name='stakeAddressDeposit' value={currentJsonState?.[5]} status={getStatus('stakeAddressDeposit', '5')}/>
          <BodyTableRow name='stakePoolDeposit' value={currentJsonState?.[6]} status={getStatus('stakePoolDeposit', '6')}/>
          <BodyTableRow name='poolRetireMaxEpoch' value={currentJsonState?.[7]} status={getStatus('poolRetireMaxEpoch', '7')}/>
          <BodyTableRow name='stakePoolTargetNum' value={currentJsonState?.[8]} status={getStatus('stakePoolTargetNum', '8')}/>
          <BodyTableRow name='poolPledgeInfluence' value={`${currentJsonState?.[9][0]}/${currentJsonState?.[9][1]}`} status={getStatus('poolPledgeInfluence', '9')}/>
          <BodyTableRow name='monetaryExpansion' value={`${currentJsonState?.[10][0]}/${currentJsonState?.[10][1]}`} status={getStatus('monetaryExpansion', '10')}/>
          <BodyTableRow name='treasuryCut' value={`${currentJsonState?.[11][0]}/${currentJsonState?.[11][1]}`} status={getStatus('treasuryCut', '11')}/>
          <BodyTableRow name='minPoolCost' value={currentJsonState?.[16]} status={getStatus('minPoolCost', '16')}/>
          <BodyTableRow name='utxoCostPerByte' value={currentJsonState?.[17]} status={getStatus('utxoCostPerByte', '17')}/>
          <BodyTableRow name='maxValueSize' value={currentJsonState?.[22]} status={getStatus('maxValueSize', '22')}/>
          <BodyTableRow name='collateralPercentage' value={currentJsonState?.[23]} status={getStatus('collateralPercentage', '23')}/>
          <BodyTableRow name='maxCollateralInputs' value={currentJsonState?.[24]} status={getStatus('maxCollateralInputs', '24')}/>
          <BodyTableRow name='committeeMinSize' value={currentJsonState?.[27]} status={getStatus('committeeMinSize', '27')}/>
          <BodyTableRow name='committeeMaxTermLimit' value={currentJsonState?.[28]} status={getStatus('committeeMaxTermLimit', '28')}/>
          <BodyTableRow name='govActionLifetime' value={currentJsonState?.[29]} status={getStatus('govActionLifetime', '29')}/>
          <BodyTableRow name='govDeposit' value={currentJsonState?.[30]} status={getStatus('govDeposit', '30')}/>
          <BodyTableRow name='dRepDeposit' value={currentJsonState?.[31]} status={getStatus('dRepDeposit', '31')}/>
          <BodyTableRow name='dRepActivity' value={currentJsonState?.[32]} status={getStatus('dRepActivity', '32')}/>
          <BodyTableRow name='minFeeRefScriptCoinsPerByte' value={currentJsonState?.[33]} status={getStatus('minFeeRefScriptCoinsPerByte', '33')}/>

          {/* executionUnitPrices */}
          <BodyTableRow name='executionUnitPrices[priceSteps]' value={`${currentJsonState?.[19].priceSteps[0]}/${currentJsonState?.[19].priceSteps[1]}`} status={getStatus('executionUnitPrices[priceSteps]', '19', 'priceSteps')}/>
          <BodyTableRow name='executionUnitPrices[priceMemory]' value={`${currentJsonState?.[19].priceMemory[0]}/${currentJsonState?.[19].priceMemory[1]}`} status={getStatus('executionUnitPrices[priceMemory]', '19', 'priceMemory')}/>

          {/* maxTxExecutionUnits */}
          <BodyTableRow name='maxTxExecutionUnits[memory]' value={currentJsonState?.[20].mem} status={getStatus('maxTxExecutionUnits[mem]', '20', 'mem')}/>
          <BodyTableRow name='maxTxExecutionUnits[steps]' value={currentJsonState?.[20].steps} status={getStatus('maxTxExecutionUnits[steps]', '20', 'steps')}/>

          {/* maxBlockExecutionUnits */}
          <BodyTableRow name='maxBlockExecutionUnits[memory]' value={currentJsonState?.[21].memory} status={getStatus('maxBlockExecutionUnits[memory]', '21', 'memory')}/> 
          <BodyTableRow name='maxBlockExecutionUnits[steps]' value={currentJsonState?.[21].steps} status={getStatus('maxBlockExecutionUnits[steps]', '21', 'steps')}/>

          {/* poolVotingThresholds */}
          <BodyTableRow name='poolVotingThresholds[committeeNoConfidence]' value={`${currentJsonState?.[25].committeeNoConfidence[0]}/${currentJsonState?.[25].committeeNoConfidence[1]}`} status={getStatus('poolVotingThresholds[committeeNoConfidence]', '25', 'committeeNoConfidence')}/>
          <BodyTableRow name='poolVotingThresholds[committeeNormal]' value={`${currentJsonState?.[25].committeeNormal[0]}/${currentJsonState?.[25].committeeNormal[1]}`} status={getStatus('poolVotingThresholds[committeeNormal]', '25', 'committeeNormal')}/>
          <BodyTableRow name='poolVotingThresholds[hardForkInitiation]' value={`${currentJsonState?.[25].hardForkInitiation[0]}/${currentJsonState?.[25].hardForkInitiation[1]}`} status={getStatus('poolVotingThresholds[hardForkInitiation]', '25', 'hardForkInitiation')}/>
          <BodyTableRow name='poolVotingThresholds[motionNoConfidence]' value={`${currentJsonState?.[25].motionNoConfidence[0]}/${currentJsonState?.[25].motionNoConfidence[1]}`} status={getStatus('poolVotingThresholds[motionNoConfidence]', '25', 'motionNoConfidence')}/>
          <BodyTableRow name='poolVotingThresholds[ppSecurityGroup]' value={`${currentJsonState?.[25].ppSecurityGroup[0]}/${currentJsonState?.[25].ppSecurityGroup[1]}`} status={getStatus('poolVotingThresholds[ppSecurityGroup]', '25', 'ppSecurityGroup')}/>

          {/* dRepVotingThresholds */}
          <BodyTableRow name='dRepVotingThresholds[committeeNoConfidence]' value={`${currentJsonState?.[26].committeeNoConfidence[0]}/${currentJsonState?.[26].committeeNoConfidence[1]}`} status={getStatus('dRepVotingThresholds[committeeNoConfidence]', '26', 'committeeNoConfidence')}/>
          <BodyTableRow name='dRepVotingThresholds[committeeNormal]' value={`${currentJsonState?.[26].committeeNormal[0]}/${currentJsonState?.[26].committeeNormal[1]}`} status={getStatus('dRepVotingThresholds[committeeNormal]', '26', 'committeeNormal')}/>
          <BodyTableRow name='dRepVotingThresholds[hardForkInitiation]' value={`${currentJsonState?.[26].hardForkInitiation[0]}/${currentJsonState?.[26].hardForkInitiation[1]}`} status={getStatus('dRepVotingThresholds[hardForkInitiation]', '26', 'hardForkInitiation')}/>
          <BodyTableRow name='dRepVotingThresholds[motionNoConfidence]' value={`${currentJsonState?.[26].motionNoConfidence[0]}/${currentJsonState?.[26].motionNoConfidence[1]}`} status={getStatus('dRepVotingThresholds[motionNoConfidence]', '26', 'motionNoConfidence')}/>
          <BodyTableRow name='dRepVotingThresholds[ppEconomicGroup]' value={`${currentJsonState?.[26].ppEconomicGroup[0]}/${currentJsonState?.[26].ppEconomicGroup[1]}`} status={getStatus('dRepVotingThresholds[ppEconomicGroup]', '26', 'ppEconomicGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[ppGovernanceGroup]' value={`${currentJsonState?.[26].ppGovernanceGroup[0]}/${currentJsonState?.[26].ppGovernanceGroup[1]}`} status={getStatus('dRepVotingThresholds[ppGovernanceGroup]', '26', 'ppGovernanceGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[ppNetworkGroup]' value={`${currentJsonState?.[26].ppNetworkGroup[0]}/${currentJsonState?.[26].ppNetworkGroup[1]}`} status={getStatus('dRepVotingThresholds[ppNetworkGroup]', '26', 'ppGovernanceGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[ppTechnicalGroup]' value={`${currentJsonState?.[26].ppTechnicalGroup[0]}/${currentJsonState?.[26].ppTechnicalGroup[1]}`} status={getStatus('dRepVotingThresholds[ppTechnicalGroup]', '26', 'ppTechnicalGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[treasuryWithdrawal]' value={`${currentJsonState?.[26].treasuryWithdrawal[0]}/${currentJsonState?.[26].treasuryWithdrawal[1]}`} status={getStatus('dRepVotingThresholds[treasuryWithdrawal]', '26', 'treasuryWithdrawal')}/>
          <BodyTableRow name='dRepVotingThresholds[updateConstitution]' value={`${currentJsonState?.[26].updateConstitution[0]}/${currentJsonState?.[26].updateConstitution[1]}`} status={getStatus('dRepVotingThresholds[updateConstitution]', '26', 'updateConstitution')}/>
        </TableBody>
        
      </Table>
  );
}
