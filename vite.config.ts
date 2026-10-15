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
  server: {
    warmup: {
      clientFiles: ["./src/entry.client.tsx", "./src/root.tsx", "./src/layouts/**/*.tsx", "./src/pages/**/*.tsx"],
      ssrFiles: ["./src/root.tsx", "./src/layouts/**/*.tsx", "./src/pages/**/*.tsx"],
    },
  },
});
