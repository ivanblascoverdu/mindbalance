import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 800,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors pesados para mejorar caché y carga inicial
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          "vendor-charts": ["chart.js", "react-chartjs-2", "recharts"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-motion": ["framer-motion"],
          "vendor-forms": ["react-hook-form", "yup"],
        },
      },
    },
  },
  esbuild: {
    // En producción, eliminar console.log y debugger; mantener console.error/warn
    pure:
      process.env.NODE_ENV === "production"
        ? ["console.log", "console.debug", "console.info"]
        : [],
    drop: process.env.NODE_ENV === "production" ? ["debugger"] : [],
  },
  server: {
    port: 5173,
  },
});
