import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BodyTableRow from "./BodyTableRow"
import useStore from "../store";

const FIELDS = [
  {
    parameter: ['txFeePerByte'],
    guardrails: [
      'TFPB-01',
      'TFPB-02',
      'TFPB-03',
      'TFGEN-01',
      'TFGEN-02',
    ],
  },{
    parameter: ['utxoCostPerByte'],
    guardrails: [
      'UCPB-01',
      'UCPB-02',
      'UCPB-03',
      'UCPB-04',
      'UCPB-05',
    ],
  },{
    parameter: ['stakeAddressDeposit'],
    guardrails: [
      'SAD-01',
      'SAD-02',
      'SAD-03',
    ],
  },{
    parameter: ['stakePoolDeposit'],
    guardrails: [
      'SDP-01',
      'SDP-02',
      'SDP-03',
    ],
  },{
    parameter: ['minPoolCost'],
    guardrails: [
      'MPC-01',
      'MPC-02',
      'MPC-03',
    ],
  },{
    parameter: ['treasuryCut'],
    guardrails: [
      'TC-01',
      'TC-02',
      'TC-03',
      'TC-04',
      'TC-05',
    ],
  },{
    parameter: ['monetaryExpansion'],
    guardrails: [
      'ME-01',
      'ME-02',
      'ME-03',
      'ME-04',
      'ME-05',
    ],
  },{
    parameter: ['executionUnitPrices', 'priceMemory'],
    guardrails: [
      'EIUP-GEN-01',
      'EIUP-GEN-02',
      'EIUP-PM-01',
      'EIUP-PM-02',
    ],
  },{
    parameter: ['executionUnitPrices', 'priceSteps'],
    guardrails: [
      'EIUP-GEN-01',
      'EIUP-GEN-02',
      'EIUP-PS-01',
      'EIUP-PS-02',
    ],
  },{
    parameter: ['minFeeRefScriptCoinsPerByte'],
    guardrails: [
      'MFRS-01',
      'MFRS-02',
      'MFRS-03',
      'MFRS-04',
    ],
  },{
    parameter: ['maxBlockBodySize'],
    guardrails: [
      'MBBS-01',
      'MBBS-02',
      'MBBS-03',
      'MBBS-04',
      'MBBS-04',
      'MBBS-06',
      'MBBS-07',
    ],
  },{
    parameter: ['maxTxSize'],
    guardrails: [
      'MTS-01',
      'MTS-02',
      'MTS-03',
      'MTS-04',
      'MTS-04',
      'MTS-06',
    ],
  },{
    parameter: ['maxBlockExecutionUnits', 'memory'],
    guardrails: [
      'MBEU-M-01',
      'MBEU-M-02',
      'MBEU-M-03',
      'MBEU-M-04',
      'MBEU-M-05',
      'MEU-M-01',
    ],
  },{
    parameter: ['maxBlockExecutionUnits', 'steps'],
    guardrails: [
      'MBEU-M-01',
      'MBEU-M-02',
      'MBEU-M-03',
      'MBEU-M-04',
      'MBEU-M-05',
      'MEU-M-01',
    ],
  },{
    parameter: ['maxTxExecutionUnits', 'mem'],
    guardrails: [
      'MTEU-M-01',
      'MTEU-M-02',
      'MTEU-M-03',
      'MTEU-M-04',
    ],
  },{
    parameter: ['maxTxExecutionUnits', 'steps'],
    guardrails: [
      'MTEU-S-01',
      'MTEU-S-02',
      'MTEU-S-03',
      'MTEU-S-04',
    ],
  },{
    parameter: ['maxBlockHeaderSize'],
    guardrails: [
      'MBHS-01',
      'MBHS-02',
      'MBHS-03',
      'MBHS-04',
      'MBHS-05',
    ],
  },{
    parameter: ['stakePoolTargetNum'],
    guardrails: [
      'SPTN-01',
      'SPTN-02',
      'SPTN-03',
      'SPTN-04',
    ],
  },{
    parameter: ['poolPledgeInfluence'],
    guardrails: [
      'PPI-01',
      'PPI-02',
      'PPI-03',
      'PPI-04',
    ],
  },{
    parameter: ['poolRetireMaxEpoch'],
    guardrails: [
      'PRME-01',
      'PRME-02',
    ],
  },{
    parameter: ['collateralPercentage'],
    guardrails: [
      'CP-01',
      'CP-02',
      'CP-03',
      'CP-04',
    ],
  },{
    parameter: ['maxCollateralInputs'],
    guardrails: [
      'MCI-01',
    ],
  },{
    parameter: ['maxValueSize'],
    guardrails: [
      'MVS-01',
      'MVS-02',
      'MVS-03',
      'MVS-04',
      'MVS-05',
    ],
  },{
    parameter: ['govDeposit'],
    guardrails: [
      'GD-01',
      'GD-02',
      'GD-03',
      'GD-04',
    ],
  },{
    parameter: ['dRepDeposit'],
    guardrails: [
      'DRD-01',
      'DRD-02',
      'DRD-03',
      'DRD-04',
    ],
  },{
    parameter: ['dRepActivity'],
    guardrails: [
      'DRA-01',
      'DRA-02',
      'DRA-03',
      'DRA-04',
      'DRA-05',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'committeeNoConfidence'],
    guardrails: [
      'VT-CC-01',
      'VT-CC-01b',
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'committeeNormal'],
    guardrails: [
      'VT-CC-01',
      'VT-CC-01b',
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'hardForkInitiation'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-HF-01',
      'VT-HF-01b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'motionNoConfidence'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-NC-01',
      'VT-NC-01b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'ppEconomicGroup'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-GEN-02',
      'VT-GEN-02b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'ppGovernanceGroup'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-GOV-01',
      'VT-GOV-01b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'ppNetworkGroup'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-GEN-02',
      'VT-GEN-02b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'ppTechnicalGroup'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-GEN-02',
      'VT-GEN-02b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'treasuryWithdrawal'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['dRepVotingThresholds', 'updateConstitution'],
    guardrails: [
      'VT-CON-01',
      'VT-CON-01b',
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['poolVotingThresholds', 'committeeNoConfidence'],
    guardrails: [
      'VT-CC-01',
      'VT-CC-01b',
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['poolVotingThresholds', 'committeeNormal'],
    guardrails: [
      'VT-CC-01',
      'VT-CC-01b',
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['poolVotingThresholds', 'hardForkInitiation'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-HF-01',
      'VT-HF-01b',
    ],
  },{
    parameter: ['poolVotingThresholds', 'motionNoConfidence'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
      'VT-NC-01',
      'VT-NC-01b',
    ],
  },{
    parameter: ['poolVotingThresholds', 'ppSecurityGroup'],
    guardrails: [
      'VT-GEN-01',
      'VT-GEN-01b',
    ],
  },{
    parameter: ['govActionLifetime'],
    guardrails: [
      'GAL-01',
      'GAL-02',
      'GAL-03',
      'GAL-04',
      'GAL-05',
    ],
  },{
    parameter: ['committeeMaxTermLimit'],
    guardrails: [
      'CMTL-01',
      'CMTL-02',
      'CMTL-03',
      'CMTL-04',
      'CMTL-05',
    ],
  },{
    parameter: ['committeeMinSize'],
    guardrails: [
      'CMS-01',
      'CMS-02',
      'CMS-03',
    ],
  },
];

export default function GuardrailView() {

  const { currentJsonState, validationResults, searchValue } = useStore();

  const getParameter = (field: string[]) => {
    if (field.length === 1) {
      return field[0];
    } else {
      return `${field[0]}[${field[1]}]`;
    }
  }

  const getStatus = (field: string[], guardrail: string) => { 
    let guardrailDetails = (currentJsonState as any || {})[field[0]]; 
    
    if (field.length > 1) {
      guardrailDetails = guardrailDetails[field[1]];
    }
    if (guardrailDetails && (guardrailDetails.checkStatus === 'unchecked')) {
      return 'disabled';
    }

    let result = (validationResults as any || {})[field[0]];  
    if (field.length > 1) {
      result = result[field[1]];
    }
    if (result && result.guardrails && result.guardrails[guardrail] && result.guardrails[guardrail].result !== null) {
      
      if (!result.guardrails[guardrail].isMandatory) {
        return result.guardrails[guardrail].result ? 'notMandatory' : 'inactive';
      } else {
        return result.guardrails[guardrail].result ? 'active' : 'inactive';
      }
    } 
    return 'disabled';
  };

  const filteredFields = searchValue
    ? FIELDS.filter(field => 
      getParameter(field.guardrails).toLowerCase().includes(searchValue.toLowerCase())
      )
    : FIELDS;

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
        {filteredFields.map((field, fieldIndex) => (
          field.guardrails.map((guardrail, guardrailIndex) => (
            <BodyTableRow
              key={`${fieldIndex}.${guardrailIndex}`}
              name={guardrail}
              parameter={getParameter(field.parameter)}
              status={getStatus(field.parameter, guardrail)}
            />
          ))
        ))}
      </TableBody>    
    </Table>
  );
}
