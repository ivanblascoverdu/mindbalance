import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A9D8F",
      light: "#4DB6AC",
      dark: "#00695C",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E76F51",
      light: "#FF8A65",
      dark: "#BF360C",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F4F9F9",
      paper: "#ffffff",
    },
    text: {
      primary: "#264653",
      secondary: "#5F7D88",
    },
    success: { main: "#2A9D8F" },
    warning: { main: "#E9C46A", contrastText: "#264653" },
    error: { main: "#E63946" },
    info: { main: "#457B9D" },
    divider: "rgba(38, 70, 83, 0.08)",
  },
  typography: {
    fontFamily: "'Outfit', 'Inter', 'Roboto', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.015em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 280,
      leavingScreen: 220,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: "8px 22px",
          boxShadow: "none",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(42, 157, 143, 0.25)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2A9D8F 0%, #26A69A 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #2A9D8F 0%, #00897B 100%)",
            boxShadow: "0 6px 20px rgba(42, 157, 143, 0.35)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #E76F51 0%, #F4845F 100%)",
        },
        outlined: {
          borderWidth: 1.5,
          "&:hover": { borderWidth: 1.5 },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 2px 12px rgba(38, 70, 83, 0.05)",
          border: "1px solid rgba(38, 70, 83, 0.05)",
          transition:
            "box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 18 },
        elevation1: {
          boxShadow: "0 2px 12px rgba(38, 70, 83, 0.05)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "rgba(38, 70, 83, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(42, 157, 143, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          color: "#264653",
          borderBottom: "1px solid rgba(38, 70, 83, 0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid rgba(38, 70, 83, 0.06)",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "2px 8px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&.Mui-selected": {
            backgroundColor: "rgba(42, 157, 143, 0.1)",
            "&:hover": { backgroundColor: "rgba(42, 157, 143, 0.15)" },
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
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "rgba(42, 157, 143, 0.1)",
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(38, 70, 83, 0.92)",
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 8,
          padding: "6px 10px",
        },
      },
    },
  },
});

export default theme;
