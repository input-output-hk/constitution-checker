// ThemeContext.tsx
import { createContext, useContext, useMemo, ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";

type ThemeModeContextType = {
  mode: 'light';
};

const ThemeModeContext = createContext<ThemeModeContextType>({ 
mode: 'light'
});


export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
    const mode = 'light';
    const theme = useMemo(() => getTheme(mode), [mode]);
  
   
  
    return (
      <ThemeModeContext.Provider value={{ mode }}>
        <MUIThemeProvider theme={theme}>
          {children}
        </MUIThemeProvider>
      </ThemeModeContext.Provider>
    );
  };