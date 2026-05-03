import { createTheme } from "@mui/material/styles";

// Cria uma instância de tema. Você pode sobrescrever cores, fontes, etc. aqui depois.
export const theme = createTheme({
  palette: {
    // Exemplo de configuração, usando as cores padrão do MUI
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
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
  },
});
