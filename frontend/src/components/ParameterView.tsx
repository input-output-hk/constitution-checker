import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BodyTableRow from "./BodyTableRow"
import useStore from "../store";

const FIELDS = [
  ['txFeePerByte'],
  ['txFeeFixed'],
  ['maxBlockBodySize'],
  ['maxTxSize'],
  ['maxBlockHeaderSize'],
  ['stakeAddressDeposit'],
  ['stakePoolDeposit'],
  ['poolRetireMaxEpoch'],
  ['stakePoolTargetNum'],
  ['poolPledgeInfluence'],
  ['monetaryExpansion'],
  ['treasuryCut'],
  ['minPoolCost'],
  ['utxoCostPerByte'],
  ['maxValueSize'],
  ['collateralPercentage'],
  ['maxCollateralInputs'],
  ['committeeMinSize'],
  ['committeeMaxTermLimit'],
  ['govActionLifetime'],
  ['govDeposit'],
  ['dRepDeposit'],
  ['dRepActivity'],
  ['minFeeRefScriptCoinsPerByte'],
  ['executionUnitPrices', 'priceSteps'],
  ['executionUnitPrices', 'priceMemory'],
  ['maxTxExecutionUnits', 'memory'],
  ['maxTxExecutionUnits', 'steps'],
  ['maxBlockExecutionUnits', 'memory'], 
  ['maxBlockExecutionUnits', 'steps'],
  ['poolVotingThresholds', 'committeeNoConfidence'],
  ['poolVotingThresholds', 'committeeNormal'],
  ['poolVotingThresholds', 'hardForkInitiation'],
  ['poolVotingThresholds', 'motionNoConfidence'],
  ['poolVotingThresholds', 'ppSecurityGroup'],
  ['dRepVotingThresholds', 'committeeNoConfidence'],
  ['dRepVotingThresholds', 'committeeNormal'],
  ['dRepVotingThresholds', 'hardForkInitiation'],
  ['dRepVotingThresholds', 'motionNoConfidence'],
  ['dRepVotingThresholds', 'ppEconomicGroup'],
  ['dRepVotingThresholds', 'ppGovernanceGroup'],
  ['dRepVotingThresholds', 'ppNetworkGroup'],
  ['dRepVotingThresholds', 'ppTechnicalGroup'],
  ['dRepVotingThresholds', 'treasuryWithdrawal'],
  ['dRepVotingThresholds', 'updateConstitution'],
];

export default function ParameterView() {
  const { currentJsonState, validationResults } = useStore();

  const getName = (field: string[]) => {
    if (field.length === 1) {
      return field[0];
    } else {
      return `${field[0]}[${field[1]}]`;
    }
  }

  const getValue = (field: string[]) => {
    if (field.length === 1) {
      return (currentJsonState as any || {})[field[0]]?.value;
    } else {
      return (currentJsonState as any || {})[field[0]]?.[field[1]]?.value;
    }
  }

  const getStatus = (field: string[]) => { 
    let status = (currentJsonState as any || {})[field[0]];  
    if (field.length > 1) {
      status = status[field[1]];
    }
    if (status && status.checkStatus === 'unchecked') {
      return 'disabled';
    }

    let result = (validationResults as any || {})[field[0]];  
    if (field.length > 1) {
      result = result[field[1]];
    }
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
        {FIELDS.map((field, index) => (
          <BodyTableRow
            key={index}
            name={getName(field)}
            value={getValue(field)}
            status={getStatus(field)}
          />
        ))}
      </TableBody>
    </Table>
  );
}
