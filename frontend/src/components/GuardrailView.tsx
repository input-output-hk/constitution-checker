import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BodyTableRow from "./BodyTableRow"
import useStore from "../store";

export default function GuardrailView() {

  const { currentJsonState, validationResults } = useStore();

  const getStatus = (field: string, guardrail: string) => {   
    const [level1, level2] = field.split('.');

    let status = (currentJsonState as any || {})[level1];
    if (level2) status = status[level2];
    if (status && status.checkStatus === 'unchecked') {
      return 'pending';
    }

    let result = (validationResults as any || {})[level1];
    if (level2) result = result[level2];
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

        {/* txFeePerByte */}
        <BodyTableRow name="TFPB-01" message={validationResults?.txFeePerByte.guardrails['TFPB-01'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte', 'TFPB-01')}/>
        <BodyTableRow name="TFPB-02" message={validationResults?.txFeePerByte.guardrails['TFPB-02'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte', 'TFPB-02')}/>
        <BodyTableRow name="TFPB-03" message={validationResults?.txFeePerByte.guardrails['TFPB-03'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte', 'TFPB-03')}/>
        <BodyTableRow name="TFGEN-01" message={validationResults?.txFeePerByte.guardrails['TFGEN-01'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte', 'TFGEN-01')}/>
        <BodyTableRow name="TFGEN-02" message={validationResults?.txFeePerByte.guardrails['TFGEN-02'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte', 'TFGEN-02')}/>

        {/* collateralPercentage */}
        <BodyTableRow name="CP-01" message={validationResults?.collateralPercentage.guardrails['CP-01'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage', 'CP-01')}/>
        <BodyTableRow name="CP-02" message={validationResults?.collateralPercentage.guardrails['CP-02'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage', 'CP-02')}/>
        <BodyTableRow name="CP-03" message={validationResults?.collateralPercentage.guardrails['CP-03'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage', 'CP-03')}/>
        <BodyTableRow name="CP-04" message={validationResults?.collateralPercentage.guardrails['CP-04'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage', 'CP-04')}/>

        {/* committeeMaxTermLimit */}
        <BodyTableRow name="CMTL-01" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-01'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit', 'CMTL-01')}/>
        <BodyTableRow name="CMTL-02" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-02'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit', 'CMTL-02')}/>
        <BodyTableRow name="CMTL-03" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-03'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit', 'CMTL-03')}/>
        <BodyTableRow name="CMTL-04" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-04'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit', 'CMTL-04')}/>
        <BodyTableRow name="CMTL-05" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-05'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit', 'CMTL-05')}/>

        {/* committeeMinSize */}
        <BodyTableRow name="CMS-01" message={validationResults?.committeeMinSize.guardrails['CMS-01'].message} parameter="collateralPercentage" status={getStatus('committeeMinSize', 'CMS-01')}/>
        <BodyTableRow name="CMS-02" message={validationResults?.committeeMinSize.guardrails['CMS-02'].message} parameter="collateralPercentage" status={getStatus('committeeMinSize', 'CMS-02')}/>
        <BodyTableRow name="CMS-03" message={validationResults?.committeeMinSize.guardrails['CMS-03'].message} parameter="collateralPercentage" status={getStatus('committeeMinSize', 'CMS-03')}/>

        {/* dRepActivity */}
        <BodyTableRow name="DRA-01" message={validationResults?.dRepActivity.guardrails['DRA-01'].message} parameter="collateralPercentage" status={getStatus('dRepActivity', 'DRA-01')}/>
        <BodyTableRow name="DRA-02" message={validationResults?.dRepActivity.guardrails['DRA-02'].message} parameter="collateralPercentage" status={getStatus('dRepActivity', 'DRA-02')}/>
        <BodyTableRow name="DRA-03" message={validationResults?.dRepActivity.guardrails['DRA-03'].message} parameter="collateralPercentage" status={getStatus('dRepActivity', 'DRA-03')}/>
        <BodyTableRow name="DRA-04" message={validationResults?.dRepActivity.guardrails['DRA-04'].message} parameter="collateralPercentage" status={getStatus('dRepActivity', 'DRA-04')}/>
        <BodyTableRow name="DRA-05" message={validationResults?.dRepActivity.guardrails['DRA-05'].message} parameter="collateralPercentage" status={getStatus('dRepActivity', 'DRA-05')}/>

        {/* dRepDeposit */}
        <BodyTableRow name="DRD-01" message={validationResults?.dRepDeposit.guardrails['DRD-01'].message} parameter="collateralPercentage" status={getStatus('dRepDeposit', 'DRD-01')}/>
        <BodyTableRow name="DRD-02" message={validationResults?.dRepDeposit.guardrails['DRD-02'].message} parameter="collateralPercentage" status={getStatus('dRepDeposit', 'DRD-02')}/>
        <BodyTableRow name="DRD-03" message={validationResults?.dRepDeposit.guardrails['DRD-03'].message} parameter="collateralPercentage" status={getStatus('dRepDeposit', 'DRD-03')}/>

        {/* dRepVotingThresholds */}
        <BodyTableRow name="VT-CC-01" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-CC-01'].message} parameter="dRepVotingThresholds[committeeNoConfidence][committeeNormal]" status={getStatus('dRepVotingThresholds.committeeNoConfidence', 'VT-CC-01')}/>
        <BodyTableRow name="VT-CC-01b" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-CC-01b'].message} parameter="dRepVotingThresholds[committeeNoConfidence][committeeNormal]" status={getStatus('dRepVotingThresholds.committeeNoConfidence', 'VT-CC-01b')}/>
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[committeeNoConfidence]" status={getStatus('dRepVotingThresholds.committeeNoConfidence', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[committeeNoConfidence]" status={getStatus('dRepVotingThresholds.committeeNoConfidence', 'VT-GEN-01b')}/>
        
        {/* dRepVotingThresholds[committeeNormal] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['committeeNormal'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[committeeNormal]" status={getStatus('dRepVotingThresholds.committeeNormal', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['committeeNormal'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[committeeNormal]" status={getStatus('dRepVotingThresholds.committeeNormal', 'VT-GEN-01b')}/>
        
        {/* dRepVotingThresholds[hardForkInitiation] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation', 'VT-GEN-01b')}/>
        <BodyTableRow name="VT-HF-01" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-HF-01'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation', 'VT-HF-01')}/>
        <BodyTableRow name="VT-HF-01b" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-HF-01b'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation', 'VT-HF-01b')}/>
        
        {/* dRepVotingThresholds[motionNoConfidence] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence', 'VT-GEN-01b')}/>
        <BodyTableRow name="VT-NC-01" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-NC-01'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence', 'VT-NC-01')}/>
        <BodyTableRow name="VT-NC-01b" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-NC-01b'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence', 'VT-NC-01b')}/>
        
        {/* dRepVotingThresholds[ppEconomicGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup', 'VT-GEN-01b')}/>
        <BodyTableRow name="VT-GEN-02" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-02'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup', 'VT-GEN-02')}/>
        <BodyTableRow name="VT-GEN-02b" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-02b'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup', 'VT-GEN-02b')}/>
        
        {/* dRepVotingThresholds[ppGovernanceGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup', 'VT-GEN-01b')}/>
        <BodyTableRow name="VT-GOV-01" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GOV-01'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup', 'VT-GOV-01')}/>
        <BodyTableRow name="VT-GOV-01b" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GOV-01b'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup', 'VT-GOV-01b')}/>
        
        {/* dRepVotingThresholds[ppNetworkGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup', 'VT-GEN-01b')}/>
        <BodyTableRow name="VT-GEN-02" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-02'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup', 'VT-GEN-02')}/>
        <BodyTableRow name="VT-GEN-02b" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-02b'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup', 'VT-GEN-02b')}/>
        
        {/* dRepVotingThresholds[ppTechnicalGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup', 'VT-GEN-01b')}/>
        <BodyTableRow name="VT-GEN-02" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-02'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup', 'VT-GEN-02')}/>
        <BodyTableRow name="VT-GEN-02b" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-02b'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup', 'VT-GEN-02b')}/>
        
        {/* dRepVotingThresholds[treasuryWithdrawal] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['treasuryWithdrawal'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[treasuryWithdrawal]" status={getStatus('dRepVotingThresholds.treasuryWithdrawal', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['treasuryWithdrawal'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[treasuryWithdrawal]" status={getStatus('dRepVotingThresholds.treasuryWithdrawal', 'VT-GEN-01b')}/>
        
        {/* dRepVotingThresholds[updateConstitution] */}
        <BodyTableRow name="VT-CON-01" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-CON-01'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution', 'VT-CON-01')}/>
        <BodyTableRow name="VT-CON-01b" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-CON-01b'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution', 'VT-CON-01b')}/>
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution', 'VT-GEN-01')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution', 'VT-GEN-01b')}/>

        {/* executionUnitPrices[priceMemory] */}
        <BodyTableRow name="EIUP-GEN-01" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-GEN-01'].message} parameter="collateralPercentage[priceMemory][priceSteps]" status={getStatus('executionUnitPrices.priceMemory', 'EIUP-GEN-01')}/>
        <BodyTableRow name="EIUP-GEN-02" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-GEN-02'].message} parameter="collateralPercentage[priceMemory][priceSteps]" status={getStatus('executionUnitPrices.priceMemory', 'EIUP-GEN-02')}/>
        <BodyTableRow name="EIUP-PM-01" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-PM-01'].message} parameter="collateralPercentage[priceMemory]" status={getStatus('executionUnitPrices.priceMemory', 'EIUP-PM-01')}/>
        <BodyTableRow name="EIUP-PM-02" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-PM-02'].message} parameter="collateralPercentage[priceMemory]" status={getStatus('executionUnitPrices.priceMemory', 'EIUP-PM-02')}/>
        <BodyTableRow name="EIUP-PS-01" message={validationResults?.executionUnitPrices['priceSteps'].guardrails['EIUP-PS-01'].message} parameter="collateralPercentage[priceSteps]" status={getStatus('executionUnitPrices.priceSteps', 'EIUP-PS-01')}/>
        <BodyTableRow name="EIUP-PS-02" message={validationResults?.executionUnitPrices['priceSteps'].guardrails['EIUP-PS-02'].message} parameter="collateralPercentage[priceSteps]" status={getStatus('executionUnitPrices.priceSteps', 'EIUP-PS-02')}/>

      </TableBody>    
    </Table>
  );
}
