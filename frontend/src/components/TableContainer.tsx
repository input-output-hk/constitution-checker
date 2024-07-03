import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NavTabs from './NavTabs';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import CommonButton from './CommonButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SearchBar from './SearchBar';
import ParameterView from './ParameterView';
import GuardrailView from './GuardrailView';
import useStore from '../store/store';

export default function BasicTable() {
  const { currentTab, changeSelectedTab } = useStore(state => ({
    currentTab: state.currentTab,
    changeSelectedTab: state.changeSelectedTab,
  }));

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    changeSelectedTab(newValue);
  };

  return (
    <Box className="tableContainerBox">
    <TableContainer component={Paper}>
    <AppBar position="static">
    <Toolbar>
        <NavTabs value={currentTab} onChange={handleTabChange} />
    </Toolbar>
    </AppBar>
    <Toolbar className="tableToolbar" variant='dense'>
        <CommonButton text='Export Updated Proposal JSON' variant="outlined" startIcon={<SaveAltIcon />} />
        <SearchBar/>
      </Toolbar>
      <Box className='tableBox'>
        {currentTab === 'Proposal Parameters' && <ParameterView />}
        {currentTab === 'Guardrails' && <GuardrailView />}
      </Box>
    </TableContainer>
    </Box>
  );
}
