import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NavTabs from './NavTabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import BodyTableRow from './BodyTableRow'
import CommonButton from './CommonButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SearchBar from './SearchBar';
import useStore from '../store/store';

export default function BasicTable() {
  const { initialJsonState } = useStore(state => ({
    initialJsonState: state.initialJsonState,
  }));

  return (
    <Box sx={{height: '100vh', minWidth: '720px', padding: '16px'}}>
    <TableContainer component={Paper} sx={{height: `calc(100vh - 32px)`, overflowY: 'hidden'}}>
    <AppBar position="static">
    <Toolbar>
        <NavTabs />
    </Toolbar>
    </AppBar>
    <Toolbar sx={{ justifyContent: 'space-between' }} variant='dense'>
        <CommonButton text='Export Updated Proposal JSON' variant="outlined" startIcon={<SaveAltIcon />} />
        <SearchBar/>
      </Toolbar>
      <Box sx={{height: `calc(100vh - 128px)`, overflowY: 'auto'}}>
      <Table size="small" aria-label="simple table" stickyHeader>
      <TableHead sx={{backgroundColor: 'rgba(57, 82, 205, .08)'}}>
          <TableRow>
            <TableCell>Parameter Name</TableCell>
            <TableCell align="right">Proposed Value</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
       
        <TableBody>
          <BodyTableRow name='txFeePerByte' value={initialJsonState?.[0]} />
          <BodyTableRow name='txFeeFixed' value={initialJsonState?.[1]} />
          <BodyTableRow name='maxBlockBodySize' value={initialJsonState?.[2]} />
          <BodyTableRow name='maxTxSize' value={initialJsonState?.[3]} />
          <BodyTableRow name='maxBlockHeaderSize' value={initialJsonState?.[4]} />
          <BodyTableRow name='stakeAddressDeposit' value={initialJsonState?.[5]} />
          <BodyTableRow name='stakePoolDeposit' value={initialJsonState?.[6]} />
          <BodyTableRow name='poolRetireMaxEpoch' value={initialJsonState?.[7]} />
          <BodyTableRow name='stakePoolTargetNum' value={initialJsonState?.[8]} />
          <BodyTableRow name='poolPledgeInfluence' value={`${initialJsonState?.[9][0]}/${initialJsonState?.[9][1]}`} />
          <BodyTableRow name='monetaryExpansion' value={`${initialJsonState?.[10][0]}/${initialJsonState?.[10][1]}`} />
          <BodyTableRow name='treasuryCut' value={`${initialJsonState?.[11][0]}/${initialJsonState?.[11][1]}`} />
          <BodyTableRow name='minPoolCost' value={initialJsonState?.[16]} />
          <BodyTableRow name='utxoCostPerByte' value={initialJsonState?.[17]} />
          <BodyTableRow name='maxValueSize' value={initialJsonState?.[22]} />
          <BodyTableRow name='collateralPercentage' value={initialJsonState?.[23]} />
          <BodyTableRow name='maxCollateralInputs' value={initialJsonState?.[24]} />
          <BodyTableRow name='committeeMinSize' value={initialJsonState?.[27]} />
          <BodyTableRow name='committeeMaxTermLimit' value={initialJsonState?.[28]} />
          <BodyTableRow name='govActionLifetime' value={initialJsonState?.[29]} />
          <BodyTableRow name='govDeposit' value={initialJsonState?.[30]} />
          <BodyTableRow name='dRepDeposit' value={initialJsonState?.[31]} />
          <BodyTableRow name='dRepActivity' value={initialJsonState?.[32]} />
          <BodyTableRow name='minFeeRefScriptCoinsPerByte' value={initialJsonState?.[33]} />
          <BodyTableRow name='executionUnitPrices[priceSteps]' value={`${initialJsonState?.[19].priceSteps[0]}/${initialJsonState?.[19].priceSteps[1]}`} />
          <BodyTableRow name='executionUnitPrices[priceMemory]' value={`${initialJsonState?.[19].priceMemory[0]}/${initialJsonState?.[19].priceMemory[1]}`} />
          <BodyTableRow name='maxTxExecutionUnits[memory]' value={initialJsonState?.[20].mem} />
          <BodyTableRow name='maxTxExecutionUnits[steps]' value={initialJsonState?.[20].steps} />
          <BodyTableRow name='maxBlockExecutionUnits[memory]' value={initialJsonState?.[21].memory} /> <BodyTableRow name='maxBlockExecutionUnits[steps]' value={initialJsonState?.[21].steps} />
          <BodyTableRow name='poolVotingThresholds[committeeNoConfidence]' value={`${initialJsonState?.[25].committeeNoConfidence[0]}/${initialJsonState?.[25].committeeNoConfidence[1]}`} />
          <BodyTableRow name='poolVotingThresholds[committeeNormal]' value={`${initialJsonState?.[25].committeeNormal[0]}/${initialJsonState?.[25].committeeNormal[1]}`} />
          <BodyTableRow name='poolVotingThresholds[hardForkInitiation]' value={`${initialJsonState?.[25].hardForkInitiation[0]}/${initialJsonState?.[25].hardForkInitiation[1]}`} />
          <BodyTableRow name='poolVotingThresholds[motionNoConfidence]' value={`${initialJsonState?.[25].motionNoConfidence[0]}/${initialJsonState?.[25].motionNoConfidence[1]}`} />
          <BodyTableRow name='poolVotingThresholds[ppSecurityGroup]' value={`${initialJsonState?.[25].ppSecurityGroup[0]}/${initialJsonState?.[25].ppSecurityGroup[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[committeeNoConfidence]' value={`${initialJsonState?.[26].committeeNoConfidence[0]}/${initialJsonState?.[26].committeeNoConfidence[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[committeeNormal]' value={`${initialJsonState?.[26].committeeNormal[0]}/${initialJsonState?.[26].committeeNormal[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[hardForkInitiation]' value={`${initialJsonState?.[26].hardForkInitiation[0]}/${initialJsonState?.[26].hardForkInitiation[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[motionNoConfidence]' value={`${initialJsonState?.[26].motionNoConfidence[0]}/${initialJsonState?.[26].motionNoConfidence[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[ppEconomicGroup]' value={`${initialJsonState?.[26].ppEconomicGroup[0]}/${initialJsonState?.[26].ppEconomicGroup[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[ppGovernanceGroup]' value={`${initialJsonState?.[26].ppGovernanceGroup[0]}/${initialJsonState?.[26].ppGovernanceGroup[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[ppNetworkGroup]' value={`${initialJsonState?.[26].ppNetworkGroup[0]}/${initialJsonState?.[26].ppNetworkGroup[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[ppTechnicalGroup]' value={`${initialJsonState?.[26].ppTechnicalGroup[0]}/${initialJsonState?.[26].ppTechnicalGroup[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[treasuryWithdrawal]' value={`${initialJsonState?.[26].treasuryWithdrawal[0]}/${initialJsonState?.[26].treasuryWithdrawal[1]}`} />
          <BodyTableRow name='dRepVotingThresholds[updateConstitution]' value={`${initialJsonState?.[26].updateConstitution[0]}/${initialJsonState?.[26].updateConstitution[1]}`} />
        </TableBody>
        
      </Table>
      </Box>
    </TableContainer>
    </Box>
  );
}
