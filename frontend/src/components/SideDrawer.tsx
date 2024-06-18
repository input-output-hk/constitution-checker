import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import CommonButton from './CommonButton';
import TextField from './TextField';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadFileIcon from '@mui/icons-material/UploadFile';


export default function SideDrawerLeft() {
  const buttons = [
    { label: 'Local File', onClick: () => console.log('Local File clicked') },
    { label: 'URL', onClick: () => console.log('URL clicked') },
    { label: 'Transaction ID', onClick: () => console.log('Transaction ID clicked') },
    { label: 'Cardano State', onClick: () => console.log('Cardano State clicked') },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          flexShrink: 0,
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
            <Typography variant={'h5'}>
              Proposal Parameter Checker
            </Typography>
            {/* <IconButton color="default" icon={<ArrowBackIosNewIcon />} /> */}
        </Toolbar>
        
        <Box>
          <Box sx={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '16px' }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '5px'}} >
              <Typography variant={'h6'}>
                Import Parameters
              </Typography>
              <IconButton icon={<RefreshIcon />} />
            </Box>
            <ButtonGroup buttons={buttons} />
            <CommonButton fullWidth={true} text="Upload local JSON file" startIcon={<UploadFileIcon />} />
          </Box>

          <Box sx={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '24px' }}>
            <Typography variant={'h6'}>
                Change Parameter Value
            </Typography>
            <Box sx={{marginTop: '10px'}}>
              <TextField fullWidth={true} defaultValue="Input" label="Label" helperText="Supporting Text" error={false}  />
            </Box>
            <Box sx={{marginTop: '10px'}}>
              <TextField fullWidth={true} defaultValue="Input" label="Label" helperText="Supporting Text" error={true}  />
            </Box>
            <Box sx={{marginTop: '10px'}}>
              <TextField fullWidth={true} defaultValue="Input" label="Label" helperText="Supporting Text" error={true}  />
            </Box>
            <Box sx={{marginTop: '10px'}}>
              <TextField fullWidth={true} defaultValue="Input" label="Label" helperText="Supporting Text" error={false}  />
            </Box>
            <Box sx={{marginTop: '10px'}}>
              <TextField fullWidth={true} defaultValue="Input" label="Label" helperText="Supporting Text" error={false}  />
            </Box>
            {/* <Box sx={{marginTop: '10px'}}>
              <TextField defaultValue="Input" label="Label" helperText="Supporting Text" error={false}  />
            </Box>
            <Box sx={{marginTop: '10px'}}>
              <TextField defaultValue="Input" label="Label" helperText="Supporting Text" error={false}  />
            </Box> */}
          </Box>
        </Box>
        
      </Drawer>
    </Box>
  );
}
