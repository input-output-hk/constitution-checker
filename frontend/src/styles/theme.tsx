import { createTheme } from "@mui/material/styles";
import { lightModePalette, darkModePalette} from "./palette";

export const getTheme = (mode: 'light' | 'dark',) => createTheme({
    palette: {
        mode, 
        ...(mode === "light" ? lightModePalette : darkModePalette),
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      fontSize: 12,
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
        fontSize: "15.19px",
        fontWeight: 500,
      },
      h6: {
        fontSize: "13.5px",
        fontWeight: 500,
      },
      body1: {
        fontSize: '12px',
      },
      body3: {
        fontSize: '12px',
        fontWeight: 600,
      },
      successText: {
        fontSize: '12px',
        color: '#39CD6B !important',
        fontWeight: 600,
        margin: '12px 0px 0px 0px',
        display: 'block',
      },
      errorText: {
        fontSize: '12px',
        color: '#BA1A1A !important',
        fontWeight: 600,
        margin: '12px 0px 0px 0px',
        display: 'block',
      }
    },
    spacing: 4,
    components: {
      MuiTypography: {
        styleOverrides: {
          root: ({theme}) => ({
            color: theme.palette.onVariant.main,
          }),
          h5: ({theme}) => ({
            color: theme.palette.primary.main,
          }),
          h6: ({theme}) => ({
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
            lineHeight: 'normal',
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
              color: theme.palette.primary.main,
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
            color: theme.palette.onVariant.main,
              '&:hover': {
                color: theme.palette.secondary.main,
                background: 'transparent',
                '&:active': {
                  background: 'transparent',
                },
              },  
              '&:focus': {
                background: 'transparent',
              }
          }),
          textPrimary: ({ theme }) => ({
            color: theme.palette.primary.onContainer,
              '&:hover': {
                color: theme.palette.primary.main,
                background: 'transparent',
                '&:active': {
                  background: 'transparent',
                },
              },  
              '&:focus': {
                background: 'transparent',
              }
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.onVariant.main,
          }),
          colorSuccess: ({ theme }) => ({
            color: theme.palette.onVariant.main,
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
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.mainOpacity1,
            },
            '&:focus': {
              backgroundColor: theme.palette.primary.mainOpacity2,
            },
            '&:active': {
              backgroundColor: theme.palette.primary.mainOpacity2,
            },
          }),
          colorSecondary: ({ theme }) => ({
            color: theme.palette.onVariant.main,
            '&:hover': {
              backgroundColor: theme.palette.onSurface.mainOpacity1,
            },
            '&:focus': {
              backgroundColor: theme.palette.onSurface.mainOpacity2,
            },
            '&:active': {
              backgroundColor: theme.palette.onSurface.mainOpacity2,
            },
          }),
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            marginBottom: '8px',
          },
          grouped: {
            flexGrow: 1,
            flexBasis: 'auto',
            whiteSpace: 'nowrap',
          },
          groupedOutlined: ({ theme }) => ({
            color: theme.palette.onVariant.main,
            border: `solid 1px ${theme.palette.outline.main}`,
            fontSize: '12px',
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
            color: theme.palette.onVariant.main,
          }),
          colorDisabled: ({ theme }) => ({
            color: theme.palette.outline.main,
          }),
          fontSizeSmall: {
            width: '18px',
            height: '18px',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.onSurface.main,
            fontSize: '12px',
            '&.Mui-error .MuiInputAdornment-root': {
              color: theme.palette.error.main,
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
              borderColor: theme.palette.onSurface.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.error.main,
            },
          }),
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            marginTop: '12px',
            marginBottom: '4px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.main,
          }),
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: ({ theme }) => ({
            marginLeft: '10px',
            color: theme.palette.onVariant.main,
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.palette.onVariant.main,
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
            backgroundColor: theme.palette.containerLowest.main,
            boxShadow: 'none',
          })
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: ({theme}) => ({
            borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
            paddingLeft: '16px !important',
            paddingRight: '16px !important',
            height: '48px !important',
            minHeight: '48px !important',
            '&.spBtwnToolbar': {
              height: 'fit-content !important',
              padding: '12px',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paperAnchorDockedLeft: ({theme}) => ({
            backgroundColor: theme.palette.containerLowest.main,
            width: '350px',
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
            boxShadow: '0px 2px 6px 0px rgba(16, 24, 40, 6%)',
          }),
          paperAnchorDockedRight: ({theme}) => ({
            background: `linear-gradient(
              0deg, 
              ${theme.palette.primary.mainOpacity1}, 
              ${theme.palette.primary.mainOpacity1}
              ), ${theme.palette.common.white}`,
            width: '300px',
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
            boxShadow: '0px 2px 6px 0px rgba(16, 24, 40, 6%)',
          }),
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: ({theme}) => ({
            backgroundColor: theme.palette.containerLowest.main,
            boxShadow: '0px 2px 6px 0px rgba(16, 24, 40, 6%)',
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            color: theme.palette.onVariant.main,
            ':focus': {
              background: 'transparent',
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
              background: theme.palette.primary.mainOpacity1,
            },
            ":focus": {
              background: theme.palette.primary.mainOpacity2,
            },
          }),
        },
      }, 
      MuiTableRow: {
        styleOverrides: {
          hover: ({ theme }) => ({
              backgroundColor: 'rgba(27, 27, 31, 0.1)',
          }),
        },
      }, 
      MuiTableCell: {
        styleOverrides: {
          stickyHeader: ({ theme }) => ({
              background: `linear-gradient(
                0deg, 
                ${theme.palette.primary.mainOpacity1}, 
                ${theme.palette.primary.mainOpacity1}
                ), ${theme.palette.common.white}`,
          }),
        },
      }, 
    },
  });