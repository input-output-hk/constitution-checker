import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import IconButton from './IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import useStore from '../store/store';
import { ParameterValidationResult } from '../store/types';

export default function MoreDetailsDrawer() {
  const { drawerOpen, validationResults, selectedRowName, toggleMoreDetailsDrawer } = useStore(state => ({
    validationResults: state.validationResults,
    drawerOpen: state.drawerOpen,
    selectedRowName: state.selectedRowName,
    toggleMoreDetailsDrawer: state.toggleMoreDetailsDrawer,
  }));

  const handleCloseDrawer = () => {
    toggleMoreDetailsDrawer(false);
  };
   
  const getRowDetails = () => {
    if (!validationResults || !selectedRowName) {
      return null;
    }

    const selectedRowArray = selectedRowName.split(/[.[\]]+/).filter(k => k);
    let rowDetails: any = validationResults;

    // Navigate through the nested structure
    for (const key of selectedRowArray) {
      if (rowDetails[key]) {
        rowDetails = rowDetails[key];
      } else {
        return <Typography>No details available for {selectedRowName}</Typography>;
      }
    }

    if (!('guardrails' in rowDetails)) {
      return <Typography>No details available for {selectedRowName}</Typography>;
    }

    const guardrails = (rowDetails as ParameterValidationResult).guardrails;

    // Display guardrails content
    return (
      <div>
        {Object.entries(guardrails).map(([key, value]) => (
          <div key={key}>
            <Typography variant={value.result === true ? 'successText' : 'errorText'}>{key}</Typography>
            <Typography variant='body1'>
              {value.description}
            </Typography>
            <Divider sx={{ margin: '16px 0px' }} />
          </div>
        ))}
      </div>
    );
  };

  return (
      <Drawer
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        
      >
        <Toolbar className="spBtwnToolbar">
            <Typography variant={'h6'}>
              {selectedRowName} Details
            </Typography>
            <IconButton icon={<CloseIcon />} color="default" onClick={handleCloseDrawer}/>
        </Toolbar>
        <div className="scrollBar2">
          {getRowDetails()}
        </div>
      </Drawer>
  );
}
