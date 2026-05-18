import { createTheme, alpha } from "@mui/material/styles";

// ─── Paleta MindBalance ─────────────────────────────────────────────
// Inspirada en paisajes de bienestar: salvia, espuma marina, arena cálida.
// Contrastes accesibles AA, transmite calma sin ser apagada.
const SAGE = {
  50: "#F1F8F6",
  100: "#DDEEE9",
  200: "#B8DCD2",
  300: "#8FC6B7",
  400: "#5FAE9C",
  500: "#3A998A", // primary
  600: "#2A8478",
  700: "#1F6A60",
  800: "#175149",
  900: "#0E3832",
};

const SAND = {
  50: "#FBF7F1",
  100: "#F6EEDF",
  200: "#EDDCBE",
  300: "#E3C99B",
  400: "#D6B57A",
  500: "#C29A5B", // accent cálido
  600: "#A37D45",
  700: "#7E5F34",
};

const INK = {
  900: "#1F3A40", // texto principal
  700: "#3F5D63", // texto secundario
  500: "#6B868A",
  300: "#A5B8BB",
  100: "#E2EAEB",
};

const CORAL = "#E8806B";

const theme = createTheme({
  palette: {
    primary: {
      main: SAGE[500],
      light: SAGE[300],
      dark: SAGE[700],
      contrastText: "#ffffff",
    },
    secondary: {
      main: SAND[500],
      light: SAND[300],
      dark: SAND[700],
      contrastText: "#ffffff",
    },
    background: {
      default: "#F7FBF9", // crema con un pelín de verde, muy suave
      paper: "#ffffff",
    },
    text: {
      primary: INK[900],
      secondary: INK[700],
    },
    success: { main: SAGE[500] },
    warning: { main: "#E2B658", contrastText: INK[900] },
    error: { main: CORAL },
    info: { main: "#5C8FA5" },
    divider: "rgba(31, 58, 64, 0.06)",
  },

  typography: {
    fontFamily:
      "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.15 },
    h3: { fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h4: { fontWeight: 700, letterSpacing: "-0.018em", lineHeight: 1.25 },
    h5: { fontWeight: 600, letterSpacing: "-0.012em", lineHeight: 1.3 },
    h6: { fontWeight: 600, letterSpacing: "-0.008em", lineHeight: 1.35 },
    subtitle1: { fontWeight: 500, letterSpacing: 0 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
    overline: { letterSpacing: "0.12em", fontWeight: 600 },
  },

  shape: {
    borderRadius: 16,
  },

  // Sombras suaves, en tono salvia muy diluido (más coherente que negro puro).
  shadows: [
    "none",
    "0 1px 2px rgba(31, 58, 64, 0.04)",
    "0 2px 6px rgba(31, 58, 64, 0.05)",
    "0 4px 12px rgba(31, 58, 64, 0.06)",
    "0 6px 18px rgba(31, 58, 64, 0.07)",
    "0 8px 24px rgba(31, 58, 64, 0.08)",
    "0 10px 30px rgba(31, 58, 64, 0.09)",
    "0 12px 36px rgba(31, 58, 64, 0.10)",
    "0 14px 42px rgba(31, 58, 64, 0.11)",
    "0 16px 48px rgba(31, 58, 64, 0.12)",
    "0 18px 54px rgba(31, 58, 64, 0.13)",
    "0 20px 60px rgba(31, 58, 64, 0.14)",
    "0 22px 66px rgba(31, 58, 64, 0.15)",
    "0 24px 72px rgba(31, 58, 64, 0.16)",
    "0 26px 78px rgba(31, 58, 64, 0.17)",
    "0 28px 84px rgba(31, 58, 64, 0.18)",
    "0 30px 90px rgba(31, 58, 64, 0.19)",
    "0 32px 96px rgba(31, 58, 64, 0.20)",
    "0 34px 102px rgba(31, 58, 64, 0.21)",
    "0 36px 108px rgba(31, 58, 64, 0.22)",
    "0 38px 114px rgba(31, 58, 64, 0.23)",
    "0 40px 120px rgba(31, 58, 64, 0.24)",
    "0 42px 126px rgba(31, 58, 64, 0.25)",
    "0 44px 132px rgba(31, 58, 64, 0.26)",
    "0 46px 138px rgba(31, 58, 64, 0.27)",
  ],

  transitions: {
    easing: {
      // Ease "fluido" tipo Apple — sensación zen
      easeInOut: "cubic-bezier(0.32, 0.72, 0, 1)",
      easeOut: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      easeIn: "cubic-bezier(0.55, 0, 0.6, 0.2)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 140,
      shorter: 200,
      short: 260,
      standard: 320,
      complex: 420,
      enteringScreen: 320,
      leavingScreen: 240,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Fondo con dos auras muy difuminadas que dan sensación de profundidad
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 0% 0%, ${alpha(SAGE[300], 0.12)} 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 100% 100%, ${alpha(SAND[300], 0.10)} 0%, transparent 55%)
          `,
          backgroundAttachment: "fixed",
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "9px 22px",
          fontWeight: 600,
          letterSpacing: "0.01em",
          boxShadow: "none",
          transition:
            "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.28s cubic-bezier(0.32, 0.72, 0, 1), background 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            transition: "transform 0.12s ease",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${SAGE[500]} 0%, ${SAGE[600]} 100%)`,
          boxShadow: `0 6px 18px ${alpha(SAGE[500], 0.22)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${SAGE[500]} 0%, ${SAGE[700]} 100%)`,
            boxShadow: `0 10px 26px ${alpha(SAGE[500], 0.32)}`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${SAND[500]} 0%, ${SAND[600]} 100%)`,
          boxShadow: `0 6px 18px ${alpha(SAND[500], 0.22)}`,
        },
        outlined: {
          borderWidth: 1.5,
          "&:hover": { borderWidth: 1.5, backgroundColor: alpha(SAGE[500], 0.05) },
        },
        text: {
          "&:hover": { backgroundColor: alpha(SAGE[500], 0.06) },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 2px 8px rgba(31, 58, 64, 0.04)",
          border: `1px solid ${alpha(INK[900], 0.05)}`,
          transition:
            "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.32s cubic-bezier(0.32, 0.72, 0, 1), border-color 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 20 },
        outlined: { borderColor: alpha(INK[900], 0.06) },
      },
    },

    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            backgroundColor: "#fff",
            transition: "box-shadow 0.24s ease, border-color 0.24s ease",
            "& fieldset": {
              borderColor: alpha(INK[900], 0.12),
              transition: "border-color 0.24s ease",
            },
            "&:hover fieldset": {
              borderColor: alpha(SAGE[500], 0.45),
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha(SAGE[500], 0.12)}`,
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1.5,
              borderColor: SAGE[500],
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 999,
          letterSpacing: "0.01em",
        },
        outlined: {
          borderColor: alpha(INK[900], 0.12),
        },
        colorPrimary: {
          backgroundColor: alpha(SAGE[500], 0.1),
          color: SAGE[700],
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "saturate(180%) blur(18px)",
          WebkitBackdropFilter: "saturate(180%) blur(18px)",
          color: INK[900],
          borderBottom: `1px solid ${alpha(INK[900], 0.06)}`,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${alpha(INK[900], 0.05)}`,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          margin: "3px 10px",
          paddingTop: 9,
          paddingBottom: 9,
          transition:
            "background-color 0.28s cubic-bezier(0.32, 0.72, 0, 1), color 0.28s cubic-bezier(0.32, 0.72, 0, 1), transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
          "&:hover": {
            backgroundColor: alpha(SAGE[500], 0.07),
            transform: "translateX(2px)",
          },
          "&.Mui-selected": {
            background: `linear-gradient(135deg, ${alpha(SAGE[500], 0.14)} 0%, ${alpha(SAGE[500], 0.08)} 100%)`,
            color: SAGE[700],
            "& .MuiListItemIcon-root": { color: SAGE[600] },
            "&:hover": {
              background: `linear-gradient(135deg, ${alpha(SAGE[500], 0.18)} 0%, ${alpha(SAGE[500], 0.12)} 100%)`,
            },
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 44,
          letterSpacing: "0.005em",
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 8,
          backgroundColor: alpha(SAGE[500], 0.1),
        },
        bar: {
          borderRadius: 999,
          background: `linear-gradient(90deg, ${SAGE[400]} 0%, ${SAGE[500]} 100%)`,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 14, fontWeight: 500 },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha(INK[900], 0.92),
          fontSize: 12.5,
          fontWeight: 500,
          borderRadius: 10,
          padding: "7px 11px",
          boxShadow: "0 10px 30px rgba(31, 58, 64, 0.15)",
        },
        arrow: { color: alpha(INK[900], 0.92) },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: alpha(INK[900], 0.06) },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${alpha(SAGE[500], 0.15)}`,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "background-color 0.24s ease, transform 0.24s ease",
          "&:hover": {
            backgroundColor: alpha(SAGE[500], 0.08),
            transform: "translateY(-1px)",
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 22,
          boxShadow: "0 30px 80px rgba(31, 58, 64, 0.18)",
        },
      },
    },
  },
});

export default theme;
