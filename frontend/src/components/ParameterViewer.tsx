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
import CommonButton from './CommonButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CircleIcon from '@mui/icons-material/Circle';
import SearchBar from './SearchBar';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

interface RowData {
  name: string;
  value: string;
  status: 'success' | 'error' | 'disabled';
}

const rows: RowData[] = [
  { name: 'maxBlockBodySize', value: '90112', status: 'success' },
  { name: 'maxTxSize', value: '11231', status: 'error' },
  { name: 'maxBlockHeaderSize', value: '1100', status: 'success' },
  { name: 'stakeAddressDeposit', value: '21310003', status: 'disabled' },
  { name: 'poolVotingThresholds', value: '1', status: 'success' },
  { name: 'dRepVotingThreshold', value: '1', status: 'error' },
  { name: 'govDeposit', value: '150000010008', status: 'success' },
  { name: 'stakePoolDeposit', value: '3700000000', status: 'success' },
  { name: 'dRepActivity', value: '25', status: 'disabled' },
  { name: 'poolMinCost', value: '343000000', status: 'error' },
  { name: 'dRepDeposit', value: 'no proposed value', status: 'disabled' },
  { name: 'monetaryExpansion', value: '[3, 1000]', status: 'success' }
];

export default function BasicTable() {

  return (
    <Box sx={{padding: '16px'}}>
    <TableContainer component={Paper}>
    <AppBar position="static">
    <Toolbar>
        <NavTabs />
    </Toolbar>
    </AppBar>
    <Toolbar sx={{ justifyContent: 'space-between' }} variant='dense'>
        <CommonButton text='Export Updated Proposal JSON' variant="outlined" startIcon={<SaveAltIcon />} />
        <SearchBar/>
      </Toolbar>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
      <TableHead sx={{backgroundColor: 'rgba(57, 82, 205, .08)'}}>
          <TableRow>
            <TableCell>Parameter Name</TableCell>
            <TableCell align="right">Proposed Value</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              hover
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
            >
              <TableCell component="th" scope="row">
              <CircleIcon color={row.status} sx={{width: '12px', height: '12px', verticalAlign: 'middle', marginRight: '8px'}} />
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">
                <CommonButton variant='text' text='View More Details' startIcon={<RemoveRedEyeOutlinedIcon/>}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}
