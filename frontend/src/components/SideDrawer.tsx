import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import CommonButton from './CommonButton';
import TextField from './TextField';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import useStore from '../store/store';
import Button from '@mui/material/Button';

export default function SideDrawerLeft() {
  const { initialJsonState, currentJsonState, validationResults, setCurrentJsonState, postParametersProposal, markFieldAsUnchecked } = useStore(state => ({
    initialJsonState: state.initialJsonState,
    currentJsonState: state.currentJsonState,
    validationResults: state.validationResults,
    setCurrentJsonState: state.setCurrentJsonState,
    postParametersProposal: state.postParametersProposal,
    markFieldAsUnchecked: state.markFieldAsUnchecked,
  }));

  const getErrorStatus = (paramName: string) => {
    if (!validationResults) return false;

    const selectedTBArray = paramName.split(/[.[\]]+/).filter(k => k);
    let tBDetails: any = validationResults;

    // Navigate through the nested structure
    for (const key of selectedTBArray) {
      if (tBDetails[key]) {
        tBDetails = tBDetails[key];
      } else {
        return false; // If any key is not found, return false
      }
    }

    return tBDetails?.summary === false;
  };

  const handleInputChange = (
    key: string,
    value: number | number[] | { [key: string]: number } | { [key: string]: number[] }
  ) => {
    if (currentJsonState) {
      const keys = key.split('.');
      const topKey = keys[0] as keyof typeof currentJsonState;
      const updatedJsonState = {
        ...currentJsonState,
        [topKey]: value,
      };
      setCurrentJsonState(updatedJsonState);
      markFieldAsUnchecked(key);
    }
  };

  const handleRunCheck = () => {
    if (currentJsonState) {
      postParametersProposal(currentJsonState);
    }
  };

  const buttons = [
    { label: 'Local File', onClick: () => console.log('Local File clicked') },
    { label: 'URL', onClick: () => console.log('URL clicked') },
    { label: 'Transaction ID', onClick: () => console.log('Transaction ID clicked') },
    { label: 'Start New', onClick: () => console.log('Start New') },
  ];

  return (
    <div className="perDrawerContainer">
      <Drawer
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
            <Typography variant={'h5'}>
              Proposal Parameter Checker
            </Typography>
        </Toolbar>
        
          <div className="child1DrawerContainer">
            <Box className="spBtwnDiv">
              <Typography variant={'h6'}>
                Import Parameters
              </Typography>
              <IconButton icon={<RefreshIcon />} />
            </Box>
            <ButtonGroup buttons={buttons} />
            <CommonButton fullWidth={true} text="Load Current Cardano State" startIcon={<DownloadIcon />}/>
          </div>

          <div className="child2DrawerContainer">
            <Box className="spBtwnDiv" >
              <Typography variant={'h6'}>
                  Change Parameter Value
              </Typography>
              <Button color='primary' variant='text' disableRipple disableFocusRipple onClick={handleRunCheck}>Run</Button>
            </Box>

            <div className="scrollBar">
                <TextField label="txFeePerByte" defaultValue={initialJsonState?.[0] ?? 'Default Value'}  onChange={(value) => handleInputChange("0", value)} error={getErrorStatus('txFeePerByte')} fullWidth={true} />
              
                <TextField label="txFeeFixed" defaultValue={initialJsonState?.[1] ?? 'Default Value'} onChange={(value) => handleInputChange("1", value)} error={getErrorStatus('txFeeFixed')} fullWidth={true} />

                <TextField label="maxBlockBodySize" defaultValue={initialJsonState?.[2] ?? 'Default Value'} onChange={(value) => handleInputChange("2", value)} error={getErrorStatus('maxBlockBodySize')} fullWidth={true} />
             
                <TextField label="maxTxSize" defaultValue={initialJsonState?.[3] ?? 'Default Value'} onChange={(value) => handleInputChange("3", value)} error={getErrorStatus('maxTxSize')} fullWidth={true} />
              
                <TextField label="maxBlockHeaderSize" defaultValue={initialJsonState?.[4] ?? 'Default Value'} onChange={(value) => handleInputChange("4", value)} error={getErrorStatus('maxBlockHeaderSize')} fullWidth={true} />
             
                <TextField label="stakeAddressDeposit" defaultValue={initialJsonState?.[5] ?? 'Default Value'} onChange={(value) => handleInputChange("5", value)} error={getErrorStatus('stakeAddressDeposit')} fullWidth={true} />
              
                <TextField label="stakePoolDeposit" defaultValue={initialJsonState?.[6] ?? 'Default Value'} onChange={(value) => handleInputChange("6", value)} error={getErrorStatus('stakePoolDeposit')} fullWidth={true} />
              
                <TextField label="poolRetireMaxEpoch" defaultValue={initialJsonState?.[7] ?? 'Default Value'} onChange={(value) => handleInputChange("7", value)} error={getErrorStatus('poolRetireMaxEpoch')} fullWidth={true} />
             
                <TextField label="stakePoolTargetNum" defaultValue={initialJsonState?.[8] ?? 'Default Value'} onChange={(value) => handleInputChange("8", value)} error={getErrorStatus('stakePoolTargetNum')} fullWidth={true} />

                <TextField label="poolPledgeInfluence" defaultValue={`${initialJsonState?.[9][0]}/${initialJsonState?.[9][1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("9", value)} error={getErrorStatus('poolPledgeInfluence')} fullWidth={true} />

                <TextField label="monetaryExpansion" defaultValue={`${initialJsonState?.[10][0]}/${initialJsonState?.[10][1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("10", value)} error={getErrorStatus('monetaryExpansion')} fullWidth={true} />

                <TextField label="treasuryCut" defaultValue={`${initialJsonState?.[11][0]}/${initialJsonState?.[11][1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("11", value)} error={getErrorStatus('treasuryCut')} fullWidth={true} />

                <TextField label="minPoolCost" defaultValue={initialJsonState?.[16] ?? 'Default Value'} onChange={(value) => handleInputChange("16", value)} error={getErrorStatus('minPoolCost')} fullWidth={true} />

                <TextField label="utxoCostPerByte" defaultValue={initialJsonState?.[17] ?? 'Default Value'} onChange={(value) => handleInputChange("17", value)} error={getErrorStatus('utxoCostPerByte')} fullWidth={true} />

                <TextField label="maxValueSize" defaultValue={initialJsonState?.[22] ?? 'Default Value'} onChange={(value) => handleInputChange("22", value)} error={getErrorStatus('maxValueSize')} fullWidth={true} />

                <TextField label="collateralPercentage" defaultValue={initialJsonState?.[23] ?? 'Default Value'} onChange={(value) => handleInputChange("23", value)} error={getErrorStatus('collateralPercentage')} fullWidth={true} />

                <TextField label="maxCollateralInputs" defaultValue={initialJsonState?.[24] ?? 'Default Value'} onChange={(value) => handleInputChange("24", value)} error={getErrorStatus('maxCollateralInputs')} fullWidth={true} />

                <TextField label="committeeMinSize" defaultValue={initialJsonState?.[27] ?? 'Default Value'} onChange={(value) => handleInputChange("27", value)} error={getErrorStatus('committeeMinSize')} fullWidth={true} />

                <TextField label="committeeMaxTermLimit" defaultValue={initialJsonState?.[28] ?? 'Default Value'} onChange={(value) => handleInputChange("28", value)} error={getErrorStatus('committeeMaxTermLimit')} fullWidth={true} />

                <TextField label="govActionLifetime" defaultValue={initialJsonState?.[29] ?? 'Default Value'} onChange={(value) => handleInputChange("29", value)} error={getErrorStatus('govActionLifetime')} fullWidth={true} />

                <TextField label="govDeposit" defaultValue={initialJsonState?.[30] ?? 'Default Value'} onChange={(value) => handleInputChange("30", value)} error={getErrorStatus('govDeposit')} fullWidth={true} />

                <TextField label="dRepDeposit" defaultValue={initialJsonState?.[31] ?? 'Default Value'} onChange={(value) => handleInputChange("31", value)} error={getErrorStatus('dRepDeposit')} fullWidth={true} />

                <TextField label="dRepActivity" defaultValue={initialJsonState?.[32] ?? 'Default Value'} onChange={(value) => handleInputChange("32", value)} error={getErrorStatus('dRepActivity')} fullWidth={true} />

                <TextField label="minFeeRefScriptCoinsPerByte" defaultValue={initialJsonState?.[33] ?? 'Default Value'} onChange={(value) => handleInputChange("33", value)} error={getErrorStatus('minFeeRefScriptCoinsPerByte')} fullWidth={true} />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                  executionUnitPrices
                </Typography>

                <TextField label="priceMemory" defaultValue={`${initialJsonState?.[19].priceMemory[0]}/${initialJsonState?.[19].priceMemory[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("19.priceMemory", { ...currentJsonState?.[19], priceMemory: value as [number, number] })} error={getErrorStatus('executionUnitPrices[priceMemory]')} fullWidth={true} />

                <TextField label="priceSteps"  defaultValue={`${initialJsonState?.[19].priceSteps[0]}/${initialJsonState?.[19].priceSteps[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("19.priceSteps", { ...currentJsonState?.[19], priceSteps: value as [number, number] })} error={getErrorStatus('executionUnitPrices[priceSteps]')} fullWidth={true} />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                  maxTxExecutionUnits
                </Typography>

                <TextField label="memory"  defaultValue={initialJsonState?.[20].mem ?? 'Default Value'} onChange={(value) => handleInputChange("20.mem", { mem: value as number, steps: currentJsonState?.[20]?.steps ?? 0 })} error={getErrorStatus('maxTxExecutionUnits[mem]')} fullWidth={true} />

                <TextField label="steps"  defaultValue={initialJsonState?.[20].steps ?? 'Default Value'} onChange={(value) => handleInputChange("20.steps", { steps: value as number, mem: currentJsonState?.[20]?.mem ?? 0 })} error={getErrorStatus('maxTxExecutionUnits[steps]')} fullWidth={true} />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                maxBlockExecutionUnits
                </Typography>

                <TextField label="memory"  defaultValue={initialJsonState?.[21].memory ?? 'Default Value'} onChange={(value) => handleInputChange("21.memory", { memory: value as number, steps: currentJsonState?.[21]?.steps ?? 0 })} error={getErrorStatus('maxBlockExecutionUnits[memory]')} fullWidth={true} />

                <TextField label="steps"  defaultValue={initialJsonState?.[21].steps ?? 'Default Value'} onChange={(value) => handleInputChange("21.steps", { steps: value as number, memory: currentJsonState?.[21]?.memory ?? 0 })} error={getErrorStatus('maxBlockExecutionUnits[steps]')} fullWidth={true} />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                poolVotingThresholds
                </Typography>

                <TextField label="committeeNoConfidence" defaultValue={`${initialJsonState?.[25].committeeNoConfidence[0]}/${initialJsonState?.[25].committeeNoConfidence[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("25.committeeNoConfidence", { ...currentJsonState?.[25], committeeNoConfidence: value as [number, number] })} error={getErrorStatus('poolVotingThresholds[committeeNoConfidence]')} fullWidth={true} />

                <TextField label="committeeNormal" defaultValue={`${initialJsonState?.[25].committeeNormal[0]}/${initialJsonState?.[25].committeeNormal[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("25.committeeNormal", { ...currentJsonState?.[25], committeeNormal: value as [number, number] })} error={getErrorStatus('poolVotingThresholds[committeeNormal]')} fullWidth={true} />

                <TextField label="hardForkInitiation" defaultValue={`${initialJsonState?.[25].hardForkInitiation[0]}/${initialJsonState?.[25].hardForkInitiation[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("25.hardForkInitiation", { ...currentJsonState?.[25], hardForkInitiation: value as [number, number] })} error={getErrorStatus('poolVotingThresholds[hardForkInitiation]')} fullWidth={true} />

                <TextField label="motionNoConfidence" defaultValue={`${initialJsonState?.[25].motionNoConfidence[0]}/${initialJsonState?.[25].motionNoConfidence[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("25.motionNoConfidence", { ...currentJsonState?.[25], motionNoConfidence: value as [number, number] })} error={getErrorStatus('poolVotingThresholds[motionNoConfidence]')} fullWidth={true} />

                <TextField label="ppSecurityGroup" defaultValue={`${initialJsonState?.[25].ppSecurityGroup[0]}/${initialJsonState?.[25].ppSecurityGroup[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("25.ppSecurityGroup", { ...currentJsonState?.[25], ppSecurityGroup: value as [number, number] })} error={getErrorStatus('poolVotingThresholds[ppSecurityGroup]')} fullWidth={true} />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                dRepVotingThresholds
                </Typography>

                <TextField label="committeeNoConfidence" defaultValue={`${initialJsonState?.[26].committeeNoConfidence[0]}/${initialJsonState?.[26].committeeNoConfidence[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.committeeNoConfidence", { ...currentJsonState?.[26], committeeNoConfidence: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds')} fullWidth={true} />

                <TextField label="committeeNormal" defaultValue={`${initialJsonState?.[26].committeeNormal[0]}/${initialJsonState?.[26].committeeNormal[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.committeeNormal", { ...currentJsonState?.[26], committeeNormal: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[committeeNormal]')} fullWidth={true} />

                <TextField label="hardForkInitiation" defaultValue={`${initialJsonState?.[26].hardForkInitiation[0]}/${initialJsonState?.[26].hardForkInitiation[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.hardForkInitiation", { ...currentJsonState?.[26], hardForkInitiation: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[hardForkInitiation]')} fullWidth={true} />

                <TextField label="motionNoConfidence" defaultValue={`${initialJsonState?.[26].motionNoConfidence[0]}/${initialJsonState?.[26].motionNoConfidence[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.motionNoConfidence", { ...currentJsonState?.[26], motionNoConfidence: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[motionNoConfidence]')} fullWidth={true} />

                <TextField label="ppEconomicGroup" defaultValue={`${initialJsonState?.[26].ppEconomicGroup[0]}/${initialJsonState?.[26].ppEconomicGroup[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.ppEconomicGroup", { ...currentJsonState?.[26], ppEconomicGroup: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[ppEconomicGroup]')} fullWidth={true} />

                <TextField label="ppGovernanceGroup" defaultValue={`${initialJsonState?.[26].ppGovernanceGroup[0]}/${initialJsonState?.[26].ppGovernanceGroup[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.ppGovernanceGroup", { ...currentJsonState?.[26], ppGovernanceGroup: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[ppGovernanceGroup]')} fullWidth={true} />

                <TextField label="ppNetworkGroup" defaultValue={`${initialJsonState?.[26].ppNetworkGroup[0]}/${initialJsonState?.[26].ppNetworkGroup[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.ppNetworkGroup", { ...currentJsonState?.[26], ppNetworkGroup: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[ppNetworkGroup]')} fullWidth={true} />

                <TextField label="ppTechnicalGroup" defaultValue={`${initialJsonState?.[26].ppTechnicalGroup[0]}/${initialJsonState?.[26].ppTechnicalGroup[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.ppTechnicalGroup", { ...currentJsonState?.[26], ppTechnicalGroup: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[ppTechnicalGroup]')} fullWidth={true} />

                <TextField label="treasuryWithdrawal" defaultValue={`${initialJsonState?.[26].treasuryWithdrawal[0]}/${initialJsonState?.[26].treasuryWithdrawal[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.treasuryWithdrawal", { ...currentJsonState?.[26], treasuryWithdrawal: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[treasuryWithdrawal]')} fullWidth={true} />

                <TextField label="updateConstitution" defaultValue={`${initialJsonState?.[26].updateConstitution[0]}/${initialJsonState?.[26].updateConstitution[1]}` ?? 'Default Value'} onChange={(value) => handleInputChange("26.updateConstitution", { ...currentJsonState?.[26], updateConstitution: value as [number, number] })} error={getErrorStatus('dRepVotingThresholds[updateConstitution]')} fullWidth={true} />
             
            </div>
          </div>
        
      </Drawer>
    </div>
  );
}
