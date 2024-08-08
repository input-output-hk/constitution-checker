import "@mui/material"

declare module "@mui/material/styles" {

  interface Components {
    MuiSearch?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiSearch'];
    };
    MuiSearchIcon?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiSearchIcon'];
    }
    MuiSearchInput?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiSearchInput'];
    }
    MuiTableBox?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiTableBox'];
    }
    MuiTableBoxContainer?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiTableBoxContainer'];
    }
    MuiScrollBar?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiScrollBar'];
    }
    MuiScrollBar2?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiScrollBar2'];
    }
    MuiSpBtwn?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiSpBtwn'];
    }
    MuiChildContain1?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiChildContain1'];
    }
    MuiChildContain2?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiChildContain2'];
    }
    MuiPerContain?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiPerContain'];
    }
    MuiMain?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiMain'];
    }
    MuiBody?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiBody'];
    }
    MuiLoading?: {
      root?: React.CSSProperties;
      styleOverrides?: ComponentsOverrides<Theme>['MuiLoading'];
    }
  }
  interface Palette {
    tertiary: Palette["primary"];
    surfaceDim: Palette["primary"];
    surface: Palette["primary"];
    surfaceBright: Palette["primary"];
    containerLowest: Palette["primary"];
    containerLow: Palette["primary"];
    container: Palette["primary"];
    containerHigh: Palette["primary"];
    containerHighest: Palette["primary"];
    onSurface: Palette["primary"];
    onVariant: Palette["primary"];
    outline: Palette["primary"];
    outlineVariant: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary: PaletteOptions["primary"];
    surfaceDim: PaletteOptions["primary"];
    surface: PaletteOptions["primary"];
    surfaceBright: PaletteOptions["primary"];
    containerLowest: PaletteOptions["primary"];
    containerLow: PaletteOptions["primary"];
    container: PaletteOptions["primary"];
    containerHigh: PaletteOptions["primary"];
    containerHighest: PaletteOptions["primary"];
    onSurface: PaletteOptions["primary"];
    onVariant: PaletteOptions["primary"];
    outline: PaletteOptions["primary"];
    outlineVariant: PaletteOptions["primary"];
  }

  interface PaletteColor {
    onMain?: string;
    mainOpacity1?: string;
    mainOpacity2?: string;
    container?: string;
    conOpacity1?: string;
    conOpacity2?: string;
    onContainer?: string;
  }

  interface SimplePaletteColorOptions {
    onMain?: string;
    mainOpacity1?: string;
    mainOpacity2?: string;
    container?: string;
    conOpacity1?: string;
    conOpacity2?: string;
    onContainer?: string;
  }

  interface TypographyVariants {
    successText?: React.CSSProperties;
    warningText?: React.CSSProperties;
    errorText?: React.CSSProperties;
    body3?: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    successText?: React.CSSProperties;
    warningText?: React.CSSProperties;
    errorText?: React.CSSProperties;
    body3?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    successText: true;
    warningText: true;
    errorText: true;
    body3: true;
  }
}