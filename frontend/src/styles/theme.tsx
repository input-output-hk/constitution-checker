import { createTheme, alpha, Theme  } from "@mui/material/styles";
import { palette} from "./palette";

export const getTheme = (mode: 'light') => createTheme({
    palette: {
        mode, 
        ...palette,
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
      warningText: {
        fontSize: '12px',
        color: '#C1CD39 !important',
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
            '&.drawerh6': {
              overflowWrap: 'anywhere'
            }
          }),
          body1: {
            marginTop: '8px'
          }
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
            '&.selectedButton': {
              background: 'rgba(57, 82, 205, 0.12)',
            }
          },
          contained: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            marginTop: '8px',
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
              '&:focus': {
              background: `linear-gradient( 
                0deg,
                ${theme.palette.primary.conOpacity2}, 
                ${theme.palette.primary.conOpacity2}
                ), ${theme.palette.primary.main}`,
                boxShadow: "none !important", 
              },
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
          colorSecondary: {
            color: '#C1CD39',
          },
          colorAction: ({ theme }) => ({
            color: theme.palette.onVariant.main,
          }),
          colorDisabled: ({ theme }) => ({
            color: theme.palette.outline.main,
          }),
          fontSizeSmall: {
            width: '18px',
            height: '18px',
            '&.circleIcon': {
            width: '12px',
            height: '12px',
            verticalAlign: 'middle',
            marginRight: '8px'
           },
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
            '&.drawerDivider': {
              margin: '16px 0px',
            },
            '&.menuDivider': {
              margin: '4px 0px',
            }
          })
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: '6px',
            marginTop: '4px',
            minWidth: '180px',
            color: 'rgb(55, 65, 81)',
            boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '&.MuiMenu-list': {
              padding: '4px 0px',
            },
            '& .MuiMenuItem-root': {
              '& .MuiSvgIcon-root': {
                fontSize: '18px',
                color: 'rgba(0, 0, 0, 0.6) !important',
                marginRight: '6px',
              },
              '&:active': {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity,
                ),
              },
            }
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
            },
            '&.tableToolbar': {
              justifyContent: 'space-between',
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
          root: {
          '&:last-child td': {
            border: 0
          },
          }
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
      MuiSearch: {
        styleOverrides: {
          root: ({ theme }: {theme: Theme }) => ({
            display: 'flex',
            alignItems: 'center',
            backgroundColor: alpha(theme.palette.containerLowest.main, 0.15),
            maxWidth: '350px',
            borderRadius: '20px',
            border: `1px solid ${theme.palette.outline.main}`,
            [theme.breakpoints.up('sm')]: {
              width: 'auto',
            },
          })
        }
      },
      MuiSearchIcon: {
        styleOverrides: {
          root: ({ theme }: {theme: Theme }) => ({
            padding: theme.spacing(0, 2),
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })
        }
      },
      MuiSearchInput: {
        styleOverrides: {
          root: ({ theme }: {theme: Theme }) => ({
            width: '100%',
            '& .MuiInputBase-input': {
              padding: theme.spacing(1, 1, 1, 1),
              // vertical padding + font size from searchIcon
              paddingLeft: '1em',
              transition: theme.transitions.create('width'),
            },
          })
        }
      },
      MuiTableBox: {
        styleOverrides: {
          root: {
            height: 'calc(100vh - 128px)',
            overflowY: 'auto',
          }
        }
      },
      MuiTableBoxContainer: {
        styleOverrides: {
          root: {
            height: '100vh',
            minWidth: '720px',
            padding: '16px',
          }
        }
      },
      MuiScrollBar: {
        styleOverrides: {
          root: {
            height: '100%',
            overflow: 'auto',
            paddingRight: '16px',
            paddingBottom: '48px',
            paddingTop: '4px',
          }
        }
      },
      MuiScrollBar2: {
        styleOverrides: {
          root: {
            height: '100vh',
            overflow: 'auto',
            padding: '16px',
          }
        }
      },
      MuiSpBtwn: {
        styleOverrides: {
          root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '4px',
          }
        }
      },
      MuiChildContain1: {
        styleOverrides: {
          root: {
            padding: '12px 16px',
          }
        }
      },
      MuiChildContain2: {
        styleOverrides: {
          root: {
            paddingTop: '12px',
            paddingLeft: '16px', 
            height: 'calc(100vh - 200px)'
          }
        }
      },
      MuiPerContain: {
        styleOverrides: {
          root: {
            height: '100vh'
          }
        }
      },
      MuiMain: {
        styleOverrides: {
          root: {
            display: 'grid',
            gridTemplateColumns: '350px auto',
            gridTemplateRows: '100vh',
            background: `linear-gradient(
              0deg, 
              rgba(57, 82, 205, 0.04), 
              rgba(57, 82, 205, 0.04)
              ), #FEFBFF`,
          }
        }
      },
      MuiBody: {
        styleOverrides: {
          root: {
            margin: 0,
            background: `linear-gradient(
              0deg, 
              rgba(57, 82, 205, 0.04), 
              rgba(57, 82, 205, 0.04)
              ), #FEFBFF`,
          }
        }
      },
      MuiLoading: {
        styleOverrides: {
          root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', 
          }
        }
      },
    },
  });

  