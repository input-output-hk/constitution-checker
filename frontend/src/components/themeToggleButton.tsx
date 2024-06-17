import React, { useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import { useThemeMode } from '../styles/themeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggleButton = () => {
  const { toggleTheme, mode } = useThemeMode();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    toggleTheme();
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  };

  return (
    <>
    <IconButton 
    ref={buttonRef}
    disableFocusRipple 
    disableRipple 
    disableTouchRipple 
    onClick={handleClick} 
    color="primary">
        {mode === 'dark' ? <Brightness7Icon color='action' /> : <Brightness4Icon color='action' />}
    </IconButton>
    </>
  );
};

export default ThemeToggleButton;
