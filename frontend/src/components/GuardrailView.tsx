import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BodyTableRow from "./BodyTableRow"
import useStore from "../store";

export default function GuardrailView() {

  const { currentJsonState, validationResults } = useStore();

  const getStatus = (field: string) => {   
    const [level1, level2] = field.split('.');

    let status = (currentJsonState as any || {})[level1];
    if (level2) status = status[level2];
    if (status && status.checkStatus === 'unchecked') {
      return 'warning';
    }

    let result = (validationResults as any || {})[level1];
    if (level2) result = result[level2];
    if (result && result.guardrails && result.guardrails.result) {
      return result.guardrails.result ? 'active' : 'inactive';
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
        <BodyTableRow name="TFPB-01" message={validationResults?.txFeePerByte.guardrails['TFPB-01'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte')}/>
        <BodyTableRow name="TFPB-02" message={validationResults?.txFeePerByte.guardrails['TFPB-02'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte')}/>
        <BodyTableRow name="TFPB-03" message={validationResults?.txFeePerByte.guardrails['TFPB-03'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte')}/>
        <BodyTableRow name="TFGEN-01" message={validationResults?.txFeePerByte.guardrails['TFGEN-01'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte')}/>
        <BodyTableRow name="TFGEN-02" message={validationResults?.txFeePerByte.guardrails['TFGEN-02'].message} parameter="txFeePerByte" status={getStatus('txFeePerByte')}/>

        {/* collateralPercentage */}
        <BodyTableRow name="CP-01" message={validationResults?.collateralPercentage.guardrails['CP-01'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage')}/>
        <BodyTableRow name="CP-02" message={validationResults?.collateralPercentage.guardrails['CP-02'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage')}/>
        <BodyTableRow name="CP-03" message={validationResults?.collateralPercentage.guardrails['CP-03'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage')}/>
        <BodyTableRow name="CP-04" message={validationResults?.collateralPercentage.guardrails['CP-04'].message} parameter="collateralPercentage" status={getStatus('collateralPercentage')}/>

        {/* committeeMaxTermLimit */}
        <BodyTableRow name="CMTL-01" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-01'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit')}/>
        <BodyTableRow name="CMTL-02" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-02'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit')}/>
        <BodyTableRow name="CMTL-03" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-03'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit')}/>
        <BodyTableRow name="CMTL-04" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-04'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit')}/>
        <BodyTableRow name="CMTL-05" message={validationResults?.committeeMaxTermLimit.guardrails['CMTL-05'].message} parameter="collateralPercentage" status={getStatus('committeeMaxTermLimit')}/>

        {/* committeeMinSize */}
        <BodyTableRow name="CMS-01" message={validationResults?.committeeMinSize.guardrails['CMS-01'].message} parameter="collateralPercentage" status={getStatus('committeeMinSize')}/>
        <BodyTableRow name="CMS-02" message={validationResults?.committeeMinSize.guardrails['CMS-02'].message} parameter="collateralPercentage" status={getStatus('committeeMinSize')}/>
        <BodyTableRow name="CMS-03" message={validationResults?.committeeMinSize.guardrails['CMS-03'].message} parameter="collateralPercentage" status={getStatus('committeeMinSize')}/>

        {/* dRepActivity */}
        <BodyTableRow name="DRA-01" message={validationResults?.dRepActivity.guardrails['DRA-01'].message} parameter="collateralPercentage" status={getStatus('dRepActivity')}/>
        <BodyTableRow name="DRA-02" message={validationResults?.dRepActivity.guardrails['DRA-02'].message} parameter="collateralPercentage" status={getStatus('dRepActivity')}/>
        <BodyTableRow name="DRA-03" message={validationResults?.dRepActivity.guardrails['DRA-03'].message} parameter="collateralPercentage" status={getStatus('dRepActivity')}/>
        <BodyTableRow name="DRA-04" message={validationResults?.dRepActivity.guardrails['DRA-04'].message} parameter="collateralPercentage" status={getStatus('dRepActivity')}/>
        <BodyTableRow name="DRA-05" message={validationResults?.dRepActivity.guardrails['DRA-05'].message} parameter="collateralPercentage" status={getStatus('dRepActivity')}/>

        {/* dRepDeposit */}
        <BodyTableRow name="DRD-01" message={validationResults?.dRepDeposit.guardrails['DRD-01'].message} parameter="collateralPercentage" status={getStatus('dRepDeposit')}/>
        <BodyTableRow name="DRD-02" message={validationResults?.dRepDeposit.guardrails['DRD-02'].message} parameter="collateralPercentage" status={getStatus('dRepDeposit')}/>
        <BodyTableRow name="DRD-03" message={validationResults?.dRepDeposit.guardrails['DRD-03'].message} parameter="collateralPercentage" status={getStatus('dRepDeposit')}/>

        {/* dRepVotingThresholds */}
        <BodyTableRow name="VT-CC-01" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-CC-01'].message} parameter={"dRepVotingThresholds[committeeNoConfidence] " + "[committeeNormal]"} status={getStatus('dRepVotingThresholds.committeeNoConfidence')}/>
        <BodyTableRow name="VT-CC-01b" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-CC-01b'].message} parameter={"dRepVotingThresholds[committeeNoConfidence] " + "[committeeNormal]"} status={getStatus('dRepVotingThresholds.committeeNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[committeeNoConfidence]" status={getStatus('dRepVotingThresholds.committeeNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['committeeNoConfidence'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[committeeNoConfidence]" status={getStatus('dRepVotingThresholds.committeeNoConfidence')}/>
        
        {/* dRepVotingThresholds[committeeNormal] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['committeeNormal'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[committeeNormal]" status={getStatus('dRepVotingThresholds.committeeNormal')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['committeeNormal'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[committeeNormal]" status={getStatus('dRepVotingThresholds.committeeNormal')}/>
        
        {/* dRepVotingThresholds[hardForkInitiation] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation')}/>
        <BodyTableRow name="VT-HF-01" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-HF-01'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation')}/>
        <BodyTableRow name="VT-HF-01b" message={validationResults?.dRepVotingThresholds['hardForkInitiation'].guardrails['VT-HF-01b'].message} parameter="dRepVotingThresholds[hardForkInitiation]" status={getStatus('dRepVotingThresholds.hardForkInitiation')}/>
        
        {/* dRepVotingThresholds[motionNoConfidence] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence')}/>
        <BodyTableRow name="VT-NC-01" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-NC-01'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence')}/>
        <BodyTableRow name="VT-NC-01b" message={validationResults?.dRepVotingThresholds['motionNoConfidence'].guardrails['VT-NC-01b'].message} parameter="dRepVotingThresholds[motionNoConfidence]" status={getStatus('dRepVotingThresholds.motionNoConfidence')}/>
        
        {/* dRepVotingThresholds[ppEconomicGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup')}/>
        <BodyTableRow name="VT-GEN-02" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-02'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup')}/>
        <BodyTableRow name="VT-GEN-02b" message={validationResults?.dRepVotingThresholds['ppEconomicGroup'].guardrails['VT-GEN-02b'].message} parameter="dRepVotingThresholds[ppEconomicGroup]" status={getStatus('dRepVotingThresholds.ppEconomicGroup')}/>
        
        {/* dRepVotingThresholds[ppGovernanceGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup')}/>
        <BodyTableRow name="VT-GOV-01" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GOV-01'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup')}/>
        <BodyTableRow name="VT-GOV-01b" message={validationResults?.dRepVotingThresholds['ppGovernanceGroup'].guardrails['VT-GOV-01b'].message} parameter="dRepVotingThresholds[ppGovernanceGroup]" status={getStatus('dRepVotingThresholds.ppGovernanceGroup')}/>
        
        {/* dRepVotingThresholds[ppNetworkGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup')}/>
        <BodyTableRow name="VT-GEN-02" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-02'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup')}/>
        <BodyTableRow name="VT-GEN-02b" message={validationResults?.dRepVotingThresholds['ppNetworkGroup'].guardrails['VT-GEN-02b'].message} parameter="dRepVotingThresholds[ppNetworkGroup]" status={getStatus('dRepVotingThresholds.ppNetworkGroup')}/>
        
        {/* dRepVotingThresholds[ppTechnicalGroup] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup')}/>
        <BodyTableRow name="VT-GEN-02" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-02'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup')}/>
        <BodyTableRow name="VT-GEN-02b" message={validationResults?.dRepVotingThresholds['ppTechnicalGroup'].guardrails['VT-GEN-02b'].message} parameter="dRepVotingThresholds[ppTechnicalGroup]" status={getStatus('dRepVotingThresholds.ppTechnicalGroup')}/>
        
        {/* dRepVotingThresholds[treasuryWithdrawal] */}
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['treasuryWithdrawal'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[treasuryWithdrawal]" status={getStatus('dRepVotingThresholds.treasuryWithdrawal')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['treasuryWithdrawal'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[treasuryWithdrawal]" status={getStatus('dRepVotingThresholds.treasuryWithdrawal')}/>
        
        {/* dRepVotingThresholds[updateConstitution] */}
        <BodyTableRow name="VT-CON-01" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-CON-01'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution')}/>
        <BodyTableRow name="VT-CON-01b" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-CON-01b'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution')}/>
        <BodyTableRow name="VT-GEN-01" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-GEN-01'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution')}/>
        <BodyTableRow name="VT-GEN-01b" message={validationResults?.dRepVotingThresholds['updateConstitution'].guardrails['VT-GEN-01b'].message} parameter="dRepVotingThresholds[updateConstitution]" status={getStatus('dRepVotingThresholds.updateConstitution')}/>

        {/* executionUnitPrices[priceMemory] */}
        <BodyTableRow name="EIUP-GEN-01" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-GEN-01'].message} parameter={"collateralPercentage[priceMemory] " + "[priceSteps]"} status={getStatus('executionUnitPrices.priceMemory')}/>
        <BodyTableRow name="EIUP-GEN-02" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-GEN-02'].message} parameter={"collateralPercentage[priceMemory] " + "[priceSteps]"} status={getStatus('executionUnitPrices.priceMemory')}/>
        <BodyTableRow name="EIUP-PM-01" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-PM-01'].message} parameter="collateralPercentage[priceMemory]" status={getStatus('executionUnitPrices.priceMemory')}/>
        <BodyTableRow name="EIUP-PM-02" message={validationResults?.executionUnitPrices['priceMemory'].guardrails['EIUP-PM-02'].message} parameter="collateralPercentage[priceMemory]" status={getStatus('executionUnitPrices.priceMemory')}/>
        <BodyTableRow name="EIUP-PS-01" message={validationResults?.executionUnitPrices['priceSteps'].guardrails['EIUP-PS-01'].message} parameter="collateralPercentage[priceSteps]" status={getStatus('executionUnitPrices.priceSteps')}/>
        <BodyTableRow name="EIUP-PS-02" message={validationResults?.executionUnitPrices['priceSteps'].guardrails['EIUP-PS-02'].message} parameter="collateralPercentage[priceSteps]" status={getStatus('executionUnitPrices.priceSteps')}/>

      </TableBody>    
    </Table>
  );
}
