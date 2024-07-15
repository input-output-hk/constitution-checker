import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BodyTableRow from "./BodyTableRow"
import useStore from "../store";

export default function ParameterView() {
  const { currentJsonState, validationResults } = useStore();

  const getStatus = (field: string) => {   
    const [level1, level2] = field.split('.');

    let status = (currentJsonState as any || {})[level1];
    if (level2) status = status[level2];
    if (status && status.checkStatus === 'unchecked') {
      return 'disabled';
    }

    let result = (validationResults as any || {})[level1];
    if (level2) result = result[level2];
    if (result) {
      return result.summary ? 'active' : 'inactive';
    } 

    return 'disabled';
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
          <BodyTableRow name='txFeePerByte' value={currentJsonState?.txFeePerByte.value} status={getStatus('txFeePerByte')}/>
          <BodyTableRow name='txFeeFixed' value={currentJsonState?.txFeeFixed.value} status={getStatus('txFeeFixed')}/>
          <BodyTableRow name='maxBlockBodySize' value={currentJsonState?.maxBlockBodySize.value} status={getStatus('maxBlockBodySize')}/>
          <BodyTableRow name='maxTxSize' value={currentJsonState?.maxTxSize.value} status={getStatus('maxTxSize')}/>
          <BodyTableRow name='maxBlockHeaderSize' value={currentJsonState?.maxBlockHeaderSize.value} status={getStatus('maxBlockHeaderSize')}/>
          <BodyTableRow name='stakeAddressDeposit' value={currentJsonState?.stakeAddressDeposit.value} status={getStatus('stakeAddressDeposit')}/>
          <BodyTableRow name='stakePoolDeposit' value={currentJsonState?.stakePoolDeposit.value} status={getStatus('stakePoolDeposit')}/>
          <BodyTableRow name='poolRetireMaxEpoch' value={currentJsonState?.poolRetireMaxEpoch.value} status={getStatus('poolRetireMaxEpoch')}/>
          <BodyTableRow name='stakePoolTargetNum' value={currentJsonState?.stakePoolTargetNum.value} status={getStatus('stakePoolTargetNum')}/>
          <BodyTableRow name='poolPledgeInfluence' value={currentJsonState?.poolPledgeInfluence.value} status={getStatus('poolPledgeInfluence')}/>
          <BodyTableRow name='monetaryExpansion' value={currentJsonState?.monetaryExpansion.value} status={getStatus('monetaryExpansion')}/>
          <BodyTableRow name='treasuryCut' value={currentJsonState?.treasuryCut.value} status={getStatus('treasuryCut')}/>
          <BodyTableRow name='minPoolCost' value={currentJsonState?.minPoolCost.value} status={getStatus('minPoolCost')}/>
          <BodyTableRow name='utxoCostPerByte' value={currentJsonState?.utxoCostPerByte.value} status={getStatus('utxoCostPerByte')}/>
          <BodyTableRow name='maxValueSize' value={currentJsonState?.maxValueSize.value} status={getStatus('maxValueSize')}/>
          <BodyTableRow name='collateralPercentage' value={currentJsonState?.collateralPercentage.value} status={getStatus('collateralPercentage')}/>
          <BodyTableRow name='maxCollateralInputs' value={currentJsonState?.maxCollateralInputs.value} status={getStatus('maxCollateralInputs')}/>
          <BodyTableRow name='committeeMinSize' value={currentJsonState?.committeeMinSize.value} status={getStatus('committeeMinSize')}/>
          <BodyTableRow name='committeeMaxTermLimit' value={currentJsonState?.committeeMaxTermLimit.value} status={getStatus('committeeMaxTermLimit')}/>
          <BodyTableRow name='govActionLifetime' value={currentJsonState?.govActionLifetime.value} status={getStatus('govActionLifetime')}/>
          <BodyTableRow name='govDeposit' value={currentJsonState?.dRepDeposit.value} status={getStatus('govDeposit')}/>
          <BodyTableRow name='dRepDeposit' value={currentJsonState?.dRepDeposit.value} status={getStatus('dRepDeposit')}/>
          <BodyTableRow name='dRepActivity' value={currentJsonState?.dRepActivity.value} status={getStatus('dRepActivity')}/>
          <BodyTableRow name='minFeeRefScriptCoinsPerByte' value={currentJsonState?.minFeeRefScriptCoinsPerByte.value} status={getStatus('minFeeRefScriptCoinsPerByte')}/>

          {/* executionUnitPrices */}
          <BodyTableRow name='executionUnitPrices[priceSteps]' value={currentJsonState?.executionUnitPrices.priceSteps.value} status={getStatus('executionUnitPrices.priceSteps')}/>
          <BodyTableRow name='executionUnitPrices[priceMemory]' value={currentJsonState?.executionUnitPrices.priceMemory.value} status={getStatus('executionUnitPrices.priceMemory')}/>

          {/* maxTxExecutionUnits */}
          <BodyTableRow name='maxTxExecutionUnits[memory]' value={currentJsonState?.maxTxExecutionUnits.mem.value} status={getStatus('maxTxExecutionUnits.mem')}/>
          <BodyTableRow name='maxTxExecutionUnits[steps]' value={currentJsonState?.maxTxExecutionUnits.steps.value} status={getStatus('maxTxExecutionUnits.steps')}/>

          {/* maxBlockExecutionUnits */}
          <BodyTableRow name='maxBlockExecutionUnits[memory]' value={currentJsonState?.maxBlockExecutionUnits.memory.value} status={getStatus('maxBlockExecutionUnits.memory')}/> 
          <BodyTableRow name='maxBlockExecutionUnits[steps]' value={currentJsonState?.maxBlockExecutionUnits.steps.value} status={getStatus('maxBlockExecutionUnits.steps')}/>

          {/* poolVotingThresholds */}
          <BodyTableRow name='poolVotingThresholds[committeeNoConfidence]' value={currentJsonState?.poolVotingThresholds.committeeNoConfidence.value} status={getStatus('poolVotingThresholds.committeeNoConfidence')}/>
          <BodyTableRow name='poolVotingThresholds[committeeNormal]' value={currentJsonState?.poolVotingThresholds.committeeNormal.value} status={getStatus('poolVotingThresholds.committeeNormal')}/>
          <BodyTableRow name='poolVotingThresholds[hardForkInitiation]' value={currentJsonState?.poolVotingThresholds.hardForkInitiation.value} status={getStatus('poolVotingThresholds.hardForkInitiation')}/>
          <BodyTableRow name='poolVotingThresholds[motionNoConfidence]' value={currentJsonState?.poolVotingThresholds.motionNoConfidence.value} status={getStatus('poolVotingThresholds.motionNoConfidence')}/>
          <BodyTableRow name='poolVotingThresholds[ppSecurityGroup]' value={currentJsonState?.poolVotingThresholds.ppSecurityGroup.value} status={getStatus('poolVotingThresholds.ppSecurityGroup')}/>

          {/* dRepVotingThresholds */}
          <BodyTableRow name='dRepVotingThresholds[committeeNoConfidence]' value={currentJsonState?.dRepVotingThresholds.committeeNoConfidence.value} status={getStatus('dRepVotingThresholds.committeeNoConfidence')}/>
          <BodyTableRow name='dRepVotingThresholds[committeeNormal]' value={currentJsonState?.dRepVotingThresholds.committeeNormal.value} status={getStatus('dRepVotingThresholds.committeeNormal')}/>
          <BodyTableRow name='dRepVotingThresholds[hardForkInitiation]' value={currentJsonState?.dRepVotingThresholds.hardForkInitiation.value} status={getStatus('dRepVotingThresholds.hardForkInitiation')}/>
          <BodyTableRow name='dRepVotingThresholds[motionNoConfidence]' value={currentJsonState?.dRepVotingThresholds.motionNoConfidence.value} status={getStatus('dRepVotingThresholds.motionNoConfidence')}/>
          <BodyTableRow name='dRepVotingThresholds[ppEconomicGroup]' value={currentJsonState?.dRepVotingThresholds.ppEconomicGroup.value} status={getStatus('dRepVotingThresholds.ppEconomicGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[ppGovernanceGroup]' value={currentJsonState?.dRepVotingThresholds.ppGovernanceGroup.value} status={getStatus('dRepVotingThresholds.ppGovernanceGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[ppNetworkGroup]' value={currentJsonState?.dRepVotingThresholds.ppNetworkGroup.value} status={getStatus('dRepVotingThresholds.ppGovernanceGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[ppTechnicalGroup]' value={currentJsonState?.dRepVotingThresholds.ppTechnicalGroup.value} status={getStatus('dRepVotingThresholds.ppTechnicalGroup')}/>
          <BodyTableRow name='dRepVotingThresholds[treasuryWithdrawal]' value={currentJsonState?.dRepVotingThresholds.treasuryWithdrawal.value} status={getStatus('dRepVotingThresholds.treasuryWithdrawal')}/>
          <BodyTableRow name='dRepVotingThresholds[updateConstitution]' value={currentJsonState?.dRepVotingThresholds.updateConstitution.value} status={getStatus('dRepVotingThresholds.updateConstitution')}/>
        </TableBody>
        
      </Table>
  );
}
