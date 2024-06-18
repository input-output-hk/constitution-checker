import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

interface ButtonInfo {
    label: string;
    onClick: () => void;  
  }
  
  interface PHAButtonGroupProps {
    buttons: ButtonInfo[];  
  }

  export default function PHAButtonGroup({ buttons }: PHAButtonGroupProps) {
    return (
      <ButtonGroup variant="outlined" fullWidth disableRipple sx={{paddingBottom: '10px'}}>
        {buttons.map((button, index) => (
          <Button key={index} onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
