import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { roRO } from "@mui/material/locale";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: '"Helvetica","Arial",sans-serif',
    h1: {
      color: "#222326",
      fontSize: "2rem",
      fontWeight: "600",
    },
    body1: {
      fontSize: "14px",
    },
  },
  palette: {
    primary: {
      main: "#2648F1",
    },
    secondary: {
      main: "#F0F2F5",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          borderRadius: "4px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: "none",
          fontSize: "14px",
          color: "#ffffff",
        },
        text: {
          fontSize: "14px",
          fontWeight: "600",
          textTransform: "none",
          color: "#505259",
        },
      },
    },
  },
});

export default theme;
