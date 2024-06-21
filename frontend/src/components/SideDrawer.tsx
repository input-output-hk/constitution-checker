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

export default function SideDrawerLeft() {
  const { initialJsonState } = useStore(state => ({
    initialJsonState: state.initialJsonState,
  }));

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
            <Box className="spBtwnDiv" >
              <Typography variant={'h6'}>
                Import Parameters
              </Typography>
              <IconButton icon={<RefreshIcon />} />
            </Box>
            <ButtonGroup buttons={buttons} />
            <CommonButton fullWidth={true} text="Load Current Cardano State" startIcon={<DownloadIcon />}/>
          </div>

          <div className="child2DrawerContainer">
            <Typography variant={'h6'}>
                Change Parameter Value
            </Typography>

            <div className="scrollBar">
                <TextField fullWidth={true} defaultValue={initialJsonState?.[0] ?? 'Default Value'} label="txFeePerByte" error={false}  />
              
                <TextField fullWidth={true} defaultValue={initialJsonState?.[1] ?? 'Default Value'}label="txFeeFixed" error={false}  />
             
                <TextField fullWidth={true} defaultValue={initialJsonState?.[2] ?? 'Default Value'} label="maxBlockBodySize" error={false}  />
              
                <TextField fullWidth={true} defaultValue={initialJsonState?.[3] ?? 'Default Value'} label="maxTxSize" error={false}  />
             
                <TextField fullWidth={true} defaultValue={initialJsonState?.[4] ?? 'Default Value'} label="maxBlockHeaderSize" error={false}  />
              
                <TextField fullWidth={true} defaultValue={initialJsonState?.[5] ?? 'Default Value'} label="stakeAddressDeposit" error={false}  />
              
                <TextField fullWidth={true} defaultValue={initialJsonState?.[6] ?? 'Default Value'} label="stakePoolDeposit" error={false}  />
             
                <TextField fullWidth={true} defaultValue={initialJsonState?.[7] ?? 'Default Value'} label="poolRetireMaxEpoch" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[8] ?? 'Default Value'} label="stakePoolTargetNum" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[9][0]}/${initialJsonState?.[9][1]}` ?? 'Default Value'} label="poolPledgeInfluence" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[10][0]}/${initialJsonState?.[10][1]}` ?? 'Default Value'} label="monetaryExpansion" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[11][0]}/${initialJsonState?.[11][1]}` ?? 'Default Value'} label="treasuryCut" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[16] ?? 'Default Value'} label="minPoolCost" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[17] ?? 'Default Value'} label="utxoCostPerByte" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[22] ?? 'Default Value'} label="maxValueSize" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[23] ?? 'Default Value'} label="collateralPercentage" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[24] ?? 'Default Value'} label="maxCollateralInputs" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[27] ?? 'Default Value'} label="committeeMinSize" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[28] ?? 'Default Value'} label="committeeMaxTermLimit" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[29] ?? 'Default Value'} label="govActionLifetime" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[30] ?? 'Default Value'} label="govDeposit" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[31] ?? 'Default Value'} label="dRepDeposit" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[32] ?? 'Default Value'} label="dRepActivity" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[33] ?? 'Default Value'} label="minFeeRefScriptCoinsPerByte" error={false}  />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                  executionUnitPrices
                </Typography>

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[19].priceSteps[0]}/${initialJsonState?.[19].priceSteps[1]}` ?? 'Default Value'} label="priceSteps" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[19].priceMemory[0]}/${initialJsonState?.[19].priceMemory[1]}` ?? 'Default Value'} label="priceMemory" error={false}  />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                  maxTxExecutionUnits
                </Typography>

                <TextField fullWidth={true} defaultValue={initialJsonState?.[20].mem ?? 'Default Value'} label="memory" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[20].steps ?? 'Default Value'} label="steps" error={false}  />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                maxBlockExecutionUnits
                </Typography>

                <TextField fullWidth={true} defaultValue={initialJsonState?.[21].memory ?? 'Default Value'} label="memory" error={false}  />

                <TextField fullWidth={true} defaultValue={initialJsonState?.[21].steps ?? 'Default Value'} label="steps" error={false}  />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                poolVotingThresholds
                </Typography>

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[25].committeeNoConfidence[0]}/${initialJsonState?.[25].committeeNoConfidence[1]}` ?? 'Default Value'} label="committeeNoConfidence" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[25].committeeNormal[0]}/${initialJsonState?.[25].committeeNormal[1]}` ?? 'Default Value'} label="committeeNormal" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[25].hardForkInitiation[0]}/${initialJsonState?.[25].hardForkInitiation[1]}` ?? 'Default Value'} label="hardForkInitiation" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[25].motionNoConfidence[0]}/${initialJsonState?.[25].motionNoConfidence[1]}` ?? 'Default Value'} label="motionNoConfidence" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[25].ppSecurityGroup[0]}/${initialJsonState?.[25].ppSecurityGroup[1]}` ?? 'Default Value'} label="ppSecurityGroup" error={false}  />

                <Typography variant={'body1'} sx={{marginTop: '8px'}}>
                dRepVotingThresholds
                </Typography>

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].committeeNoConfidence[0]}/${initialJsonState?.[26].committeeNoConfidence[1]}` ?? 'Default Value'} label="committeeNoConfidence" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].committeeNormal[0]}/${initialJsonState?.[26].committeeNormal[1]}` ?? 'Default Value'} label="committeeNormal" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].hardForkInitiation[0]}/${initialJsonState?.[26].hardForkInitiation[1]}` ?? 'Default Value'} label="hardForkInitiation" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].motionNoConfidence[0]}/${initialJsonState?.[26].motionNoConfidence[1]}` ?? 'Default Value'} label="motionNoConfidence" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].ppEconomicGroup[0]}/${initialJsonState?.[26].ppEconomicGroup[1]}` ?? 'Default Value'} label="ppEconomicGroup" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].ppGovernanceGroup[0]}/${initialJsonState?.[26].ppGovernanceGroup[1]}` || 'Default Value'} label="ppGovernanceGroup" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].ppNetworkGroup[0]}/${initialJsonState?.[26].ppNetworkGroup[1]}` ?? 'Default Value'} label="ppNetworkGroup" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].ppTechnicalGroup[0]}/${initialJsonState?.[26].ppTechnicalGroup[1]}` ?? 'Default Value'} label="ppTechnicalGroup" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].treasuryWithdrawal[0]}/${initialJsonState?.[26].treasuryWithdrawal[1]}` ?? 'Default Value'} label="treasuryWithdrawal" error={false}  />

                <TextField fullWidth={true} defaultValue={`${initialJsonState?.[26].updateConstitution[0]}/${initialJsonState?.[26].updateConstitution[1]}` ?? 'Default Value'} label="updateConstitution" error={false}  />
             
            </div>
          </div>
        
      </Drawer>
    </div>
  );
}
