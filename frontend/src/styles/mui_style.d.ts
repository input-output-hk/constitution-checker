import "@mui/material"

declare module "@mui/material/styles" {
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
    errorText?: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    successText?: React.CSSProperties;
    errorText?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    successText: true;
    errorText: true;
  }
}