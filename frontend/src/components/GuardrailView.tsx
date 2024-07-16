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
    parameter: ['collateralPercentage'],
    guardrails: [
      'CP-01',
      'CP-02',
      'CP-03',
      'CP-04',
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
    parameter: ['dRepDeposit'],
    guardrails: [
      'DRD-01',
      'DRD-02',
      'DRD-03',
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
      'EIUP-PS-01',
      'EIUP-PS-02',
    ],
  },
];

export default function GuardrailView() {

  const { currentJsonState, validationResults } = useStore();

  const getParameter = (field: string[]) => {
    if (field.length === 1) {
      return field[0];
    } else {
      return `${field[0]}[${field[1]}]`;
    }
  }

  const getMessage = (field: string[], guardrail: string) => {
    if (field.length === 1) {
      return (validationResults as any || {})[field[0]]?.guardrails?.[guardrail]?.message;
    } else {
      return (validationResults as any || {})[field[0]]?.[field[1]]?.guardrails?.[guardrail]?.message;
    }
  }

  const getStatus = (field: string[], guardrail: string) => { 
    let status = (currentJsonState as any || {})[field[0]];  
    if (field.length > 1) {
      status = status[field[1]];
    }
    if (status && status.checkStatus === 'unchecked') {
      return 'pending';
    }

    let result = (validationResults as any || {})[field[0]];  
    if (field.length > 1) {
      result = result[field[1]];
    }
    if (result && result.guardrails && result.guardrails[guardrail] && result.guardrails[guardrail].result !== null) {
      return result.guardrails[guardrail].result ? 'active' : 'inactive';
    } 

    return 'disabled';
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
        {FIELDS.map((field, fieldIndex) => (
          field.guardrails.map((guardrail, guardrailIndex) => (
            <BodyTableRow
              key={`${fieldIndex}.${guardrailIndex}`}
              name={guardrail}
              parameter={getParameter(field.parameter)}
              message={getMessage(field.parameter, guardrail)}
              status={getStatus(field.parameter, guardrail)}
            />
          ))
        ))}
      </TableBody>    
    </Table>
  );
}
