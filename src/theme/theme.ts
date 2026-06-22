import { createTheme } from "@mui/material/styles";

const typography = {
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0055EB",
    },
    secondary: {
      main: "#212529",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FAFAFA"
    }
  },
  typography,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#B6D0FE",
    },
    secondary: {
      main: "#212529",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography,
});
