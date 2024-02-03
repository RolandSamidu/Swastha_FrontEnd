const textLight = {
    primary: 'rgba(52, 49, 76, 1)',
    secondary: 'rgba(52, 49, 76, 0.54)',
    disabled: 'rgba(52, 49, 76, 0.38)',
    hint: 'rgba(52, 49, 76, 0.38)',
}

const textUniversity = {
    primary: 'rgba(0,0,0, 1)',
    sidenaveTextColor: 'rgba(255,255,255, 1)',
    secondary: 'rgba(52, 49, 76, 0.54)',
    disabled: 'rgba(52, 49, 76, 0.38)',
    hint: 'rgba(52, 49, 76, 0.38)',
}


const secondaryColor = {
    light: '#f9a352',
    main: '#ff9e43',
    dark: '#ff932e',
    contrastText: textLight.primary,
}
const errorColor = {
    main: '#FF3D57',
}

export const themeColors = {
    whitePurple: {
        palette: {
            type: 'light',
            primary: {
                main: '#ffffff',
                contrastText: textLight.primary,
            },
            secondary: {
                main: '#7467ef',
                contrastText: '#ffffff',
            },
            error: errorColor,
            text: textLight,
        },
    },
    whiteBlue: {
        palette: {
            type: 'light',
            primary: {
                main: '#ffffff',
                contrastText: textLight.primary,
            },
            secondary: {
                main: '#1976d2',
                contrastText: '#ffffff',
            },
            text: textLight,
        },
    },
    whiteBlueTopBar: {
        palette: {
            type: 'light',
            primary: {
                main: '#06b6d4',
                contrastText: textLight.primary,
            },
            secondary: {
                main: '#1976d2',
                contrastText: '#ffffff',
            },
            text: textLight,
        },
    },
    whiteBlueNav: {
        palette: {
            type: 'light',
            primary: {
                main: '#f1f3f4',
                contrastText: textLight.primary,
            },
            secondary: {
                main: '#717272',
                contrastText: '#ffffff',
            },
            text: textLight,
        },
    },
    slateDark1: {
        palette: {
            type: 'dark',
            primary: {
                main: '#222A45',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            background: {
                paper: '#222A45',
                default: '#1a2038',
            },
        },
    },
    slateDark2: {
        palette: {
            type: 'dark',
            primary: {
                main: '#1a2038',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            background: {
                paper: '#222A45',
                default: '#1a2038',
            },
        },
    },
    purple1: {
        palette: {
            type: 'light',
            primary: {
                main: '#7467ef',
                contrastText: '#ffffff',
            },
            secondary: secondaryColor,
            error: errorColor,
            text: textLight,
        },
    },
    purple2: {
        palette: {
            type: 'light',
            primary: {
                main: '#6a75c9',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            text: textLight,
        },
    },
    purpleDark1: {
        palette: {
            type: 'dark',
            primary: {
                main: '#7467ef',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            background: {
                paper: '#222A45',
                default: '#1a2038',
            },
        },
    },
    purpleDark2: {
        palette: {
            type: 'dark',
            primary: {
                main: '#6a75c9',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            background: {
                paper: '#222A45',
                default: '#1a2038',
            },

        },
    },
    blue: {
        palette: {
            type: 'light',
            primary: {
                main: '#1a73e8',
                contrastText: '#ffff',
            },
            secondary: {
                main: '#FFAF38',
                contrastText: textLight.primary,
            },
            light: {
                main: '#1a73e8',
                contrastText: '#ffffff',
            },

            error: errorColor,
            text: textUniversity,
            background: {
                paper: '#ffffff',
                default: '#f5f8f8',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },
    },
    universityColor: {
        palette: {
            type: 'light',
            primary: {
                main: '#9d0b0f',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            text: textUniversity,
            background: {
                paper: '#ffffff',
                default: '#fffdeb',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },
    universityColorLilac: {
        palette: {
            type: 'light',
            primary: {
                main: '#d55edb',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            text: textUniversity,
            background: {
                paper: '#ffffff',
                default: '#ffffff',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },

    universityColorCream: {
        palette: {
            type: 'light',
            primary: {
                main: '#fbebc9',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            text: textLight,
            background: {
                paper: '#ffffff',
                default: '#f1eee5',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },

    lightGray: {
        palette: {
            type: 'light',
            primary: {
                main: '#807f7f',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            text: textUniversity,
            background: {
                paper: '#ffffff',
                default: '#f2f2f2',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },
    blueGray: {
        palette: {
            type: 'light',
            primary: {
                main: '#5b75a6',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#ff9e43',
                contrastText: textLight.primary,
            },
            error: errorColor,
            text: textUniversity,
            background: {
                paper: '#ffffff',
                default: '#f1eee5',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },
    whiteLight: {
        palette: {
            type: 'light',
            primary: {
                main: '#ffffff',
                contrastText: textLight.primary,
            },
            secondary: {
                main: '#1976d2',
                contrastText: '#ffffff',
            },
            text: textLight,

            background: {
                paper: '#ffffff',
                default: '#f1eee5',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },
    whiteGray: {
        palette: {
            type: 'light',
            primary: {
                main: '#ffffff',
                contrastText: textLight.primary,
            },
            secondary: {
                main: '#1976d2',
                contrastText: '#ffffff',
            },
            text: textLight,

            background: {
                paper: '#ffffff',
                default: '#f1eee5',
            },
            facultyColors: {
                fogs: { main: '#00427a', light: 'rgb(12,109,192 ,0.5)' },
                fom: { main: '#8bc53f', light: 'rgb(139, 197, 63 ,0.5)' },
                fova: { main: '#d91c5c', light: 'rgb(217, 28, 92,0.5)' },
                fodd: { main: '#f6921e', light: 'rgb(246, 146, 30 ,0.5)' },
            }
        },

    },

    blueDark: {
        palette: {
            type: 'dark',
            primary: {
                main: '#1976d2',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#FF4F30',
                contrastText: textLight.primary,
            },
            error: errorColor,
            background: {
                paper: '#222A45',
                default: '#1a2038',
            },
        },
    },
    red: {
        palette: {
            type: 'dark',
            primary: {
                main: '#e53935',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#FFAF38',
                contrastText: textLight.primary,
            },
            error: errorColor,
        },
    },
}
