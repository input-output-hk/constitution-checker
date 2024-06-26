// ThemeContext.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';

type ThemeModeContextType = {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
};

const ThemeModeContext = createContext<ThemeModeContextType>({ toggleTheme: () => {}, 
mode: 'light'
});


export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const theme = useMemo(() => getTheme(mode), [mode]);
  
    const toggleTheme = () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };
  
    return (
      <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
        <MUIThemeProvider theme={theme}>
          {children}
        </MUIThemeProvider>
      </ThemeModeContext.Provider>
    );
  };