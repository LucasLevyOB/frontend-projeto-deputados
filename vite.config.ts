import { fileURLToPath, URL } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/material/styles",
      "@mui/x-charts",
      "@emotion/react",
      "@emotion/styled",
      "@tanstack/react-virtual",
      "axios",
      "firebase/app",
      "firebase/analytics",
    ],
  },
  ssr: {
    noExternal: ['@mui/**', '@emotion/**'],
  },
});
