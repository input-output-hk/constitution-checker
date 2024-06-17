import { createTheme } from "@mui/material/styles";
import { lightModePalette, darkModePalette} from "./palette";

export const getTheme = (mode: 'light' | 'dark',) => createTheme({
    palette: {
        mode, 
        ...(mode === "light" ? lightModePalette : darkModePalette),
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      fontSize: 16,
      h1: {
        fontSize: "2.986rem",
      },
      h2: {
        fontSize: "2.488rem",
      },
      h3: {
        fontSize: "2.074rem",
      },
      h4: {
        fontSize: "1.728rem",
      },
      h5: {
        fontSize: "1.44rem",
      },
      h6: {
        fontSize: "1.2rem",
      },
      body1: {
        fontSize: '16px',
      },
      paragraphLarge: {
        fontSize: '18px',
      },
      paragraphMedium: {
        fontSize: '16px',
      },
      paragraphSmall: {
        fontSize: '14px',
      },
      paragraphXSmall: {
        fontSize: '14px',
      }
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          h5: ({theme}) => ({
            color: theme.palette.primary.main,
          }),
          body1: ({theme}) => ({
            color: theme.palette.onVariant.main,
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            textTransform: "none",
            boxShadow: "none",
            padding: "6px 10px",
          },
          contained: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              background: `linear-gradient(
                0deg, 
                ${theme.palette.primary.conOpacity1}, 
                ${theme.palette.primary.conOpacity1}
                ), ${theme.palette.primary.main}`,
                boxShadow: `
                0px 1px 2px rgb(0, 0, 0, .3),
                0px 1px 3px 1px rgb(0, 0, 0, .15)}
              `,
              '&:active': {
                background: `linear-gradient( 
                  0deg,
                  ${theme.palette.primary.conOpacity2}, 
                  ${theme.palette.primary.conOpacity2}
                  ), ${theme.palette.primary.main}`,
                  boxShadow: "none !important", 
              },
            },
            '&:focus': {
              background: `linear-gradient( 
                0deg,
                ${theme.palette.primary.conOpacity2}, 
                ${theme.palette.primary.conOpacity2}
                ), ${theme.palette.primary.main}`,
                boxShadow: "none !important", 
            },
          }),
          outlined: ({ theme }) => ({
            border: `1px solid ${theme.palette.primary.main}`,
              color: `${theme.palette.primary.main}`,
              '&:hover': {
                background: `linear-gradient(
              0deg, 
              ${theme.palette.primary.mainOpacity1}, 
              ${theme.palette.primary.mainOpacity1}
              )`,
                '&:active': {
                  background: `linear-gradient(
                    0deg, 
                    ${theme.palette.primary.mainOpacity2}, 
                    ${theme.palette.primary.mainOpacity2}
                  )`,
                },
              },
              '&:focus': {
                background: `linear-gradient(
                  0deg, 
                  ${theme.palette.primary.mainOpacity2}, 
                  ${theme.palette.primary.mainOpacity2}
                )`,
              }
          }),
          text: ({ theme }) => ({
            color: `${theme.palette.primary.main}`,
              '&:hover': {
                background: `linear-gradient(
              0deg, 
              ${theme.palette.primary.mainOpacity1}, 
              ${theme.palette.primary.mainOpacity1}
              )`,
                '&:active': {
                  background: `linear-gradient(
                    0deg, 
                    ${theme.palette.primary.mainOpacity2}, 
                    ${theme.palette.primary.mainOpacity2}
                  )`,
                },
              },  
              '&:focus': {
                background: `linear-gradient(
                  0deg, 
                  ${theme.palette.primary.mainOpacity2}, 
                  ${theme.palette.primary.mainOpacity2}
                )`,
              }
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: `${theme.palette.onVariant.main}`,
          }),
          colorSuccess: ({ theme }) => ({
            color: `${theme.palette.onVariant.main}`,
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:focus': {
              background: 'transparent !important',
            },
            '&:active': {
              backgroundColor: 'transparent',
            },
          }),
          colorPrimary: ({ theme }) => ({
            '&:hover': {
              backgroundColor: `${theme.palette.primary.mainOpacity1}`,
            },
            '&:focus': {
              backgroundColor: `${theme.palette.primary.mainOpacity2}`,
            },
            '&:active': {
              backgroundColor: `${theme.palette.primary.mainOpacity2}`,
            },
          }),
          colorSecondary: ({ theme }) => ({
            color: `${theme.palette.onVariant.main}`,
            '&:hover': {
              backgroundColor: `${theme.palette.onSurface.mainOpacity1}`,
            },
            '&:focus': {
              backgroundColor: `${theme.palette.onSurface.mainOpacity2}`,
            },
            '&:active': {
              backgroundColor: `${theme.palette.onSurface.mainOpacity2}`,
            },
          }),
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
          grouped: {
            width: "auto",
          },
          groupedOutlined: ({ theme }) => ({
            color: `${theme.palette.onVariant.main}`,
            border: `solid 1px ${theme.palette.outline.main}`,
            fontSize: '14px',
            '&:hover': {
              border: `solid 1px ${theme.palette.outline.main}`,
            },
          }),
        }
      },
      MuiSvgIcon: {
        defaultProps: {
          fontSize: 'small', 
        },
        styleOverrides: {
          colorAction: ({ theme }) => ({
            color: `${theme.palette.onVariant.main}`,
          }),
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: `${theme.palette.onSurface.main}`,
            fontSize: '1rem',
            '&.Mui-error .MuiInputAdornment-root': {
              color: `${theme.palette.error.main}`,
            },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            ".MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${theme.palette.outline.main}`,
            },
            ":hover .MuiOutlinedInput-notchedOutline": {
              borderColor: `${theme.palette.onSurface.main}`,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: `${theme.palette.primary.main}`,
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: `${theme.palette.error.main}`,
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.main,
            fontSize: '1rem !important',
          }),
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: '.75rem !important',
            marginLeft: '10px',
            color: `${theme.palette.onVariant.main}`,
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: `${theme.palette.onVariant.main}`,
          })
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: `${theme.palette.outlineVariant.main} !important`,
          })
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: `${theme.palette.containerLowest.main}`,
            boxShadow: 'none',
          })
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: ({theme}) => ({
            borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
            paddingLeft: '16px !important',
            height: '48px !important',
            minHeight: '48px !important',
            justifyContent: 'space-between',
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({theme}) => ({
            backgroundColor: theme.palette.containerLowest.main,
            borderRight: `1px solid ${theme.palette.outlineVariant.main}`,
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            color: `${theme.palette.onVariant.main}`,
            ":hover": {
              background: `${theme.palette.primary.mainOpacity1}`,
            },
            ":focus": {
              background: `${theme.palette.primary.mainOpacity2}`,
            },
          }),
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: ({theme}) => ({
            minWidth: '40px',
            color: theme.palette.onVariant.main,
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            ":hover": {
              background: `${theme.palette.primary.mainOpacity1}`,
            },
            ":focus": {
              background: `${theme.palette.primary.mainOpacity2}`,
            },
          }),
        },
      }, 
    },
  });