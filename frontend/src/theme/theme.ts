import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A9D8F", // Teal calming
      light: "#4DB6AC",
      dark: "#00695C",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E76F51", // Warm accent
      light: "#FF8A65",
      dark: "#BF360C",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F4F9F9", // Very light mint/grey
      paper: "#ffffff",
    },
    text: {
      primary: "#264653", // Dark blue-green, softer than black
      secondary: "#5F7D88",
    },
    success: {
      main: "#2A9D8F",
    },
    warning: {
      main: "#E9C46A",
    },
    error: {
      main: "#E63946",
    },
  },
  typography: {
    fontFamily: "'Outfit', 'Roboto', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 }, // No uppercase buttons
  },
  shape: {
    borderRadius: 16, // More rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Pill shaped buttons
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(42, 157, 143, 0.2)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #2A9D8F 30%, #26A69A 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(0,0,0,0.02)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default theme;
