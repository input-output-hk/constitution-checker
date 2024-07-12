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
  const { drawerOpen, validationResults, selectedRowName, currentTab, toggleMoreDetailsDrawer } = useStore(state => ({
    validationResults: state.validationResults,
    drawerOpen: state.drawerOpen,
    selectedRowName: state.selectedRowName,
    currentTab: state.currentTab,
    toggleMoreDetailsDrawer: state.toggleMoreDetailsDrawer,
  }));

  const handleCloseDrawer = () => {
    toggleMoreDetailsDrawer(false);
  };
   
  const getRowDetails = () => {
    if (!validationResults || !selectedRowName || selectedRowName.length < 1) {
      return null;
    }

    let rowDetails: any = validationResults;
    console.log(rowDetails);
    let guardrails: { [key: string]: any } = {};

    if (currentTab === 'Proposal Parameters') {
      const selectedRowArray = selectedRowName[0].split(/[.[\]]+/).filter((k: string) => k);

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

      guardrails = (rowDetails as ParameterValidationResult).guardrails;
    } else if (currentTab === 'Guardrails') {
      const paramName = selectedRowName[1];
      const guardrailName = selectedRowName[0];

      const selectedRowArray = paramName.split(/[.[\]]+/).filter((k: string) => k);

      for (const key of selectedRowArray) {
        if (rowDetails[key]) {
          rowDetails = rowDetails[key];
        } else {
          return <Typography>No details available for {selectedRowName}</Typography>;
        }
      }

      const paramDetails = rowDetails as ParameterValidationResult;

      if (!paramDetails || !('guardrails' in paramDetails)) {
        return <Typography>No details available for {selectedRowName}</Typography>;
      }

      const specificGuardrail = paramDetails.guardrails[guardrailName];
      guardrails = { [guardrailName]: specificGuardrail };
    }

    // Display guardrails content
    return (
      <div>
        {Object.entries(guardrails).map(([key, value]) => {
          let variant: 'successText' | 'errorText' | 'body3';
          if (value.result === true) {
            variant = 'successText';
          } else if (value.result === false) {
            variant = 'errorText';
          } else {
            variant = 'body3';
          }

          return (
            <div key={key}>
              <Typography variant={variant}>{key}</Typography>
              <Typography variant='body1'>
                {value.description}
              </Typography>
              <Divider sx={{ margin: '16px 0px' }} />
            </div>
          );
        })}
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
            <Typography variant={'h6'} sx={{overflowWrap: 'anywhere'}}>
              {selectedRowName[0]} Details
            </Typography>
            <IconButton icon={<CloseIcon />} color="default" onClick={handleCloseDrawer}/>
        </Toolbar>
        <div className="scrollBar2">
          {getRowDetails()}
        </div>
      </Drawer>
  );
}
