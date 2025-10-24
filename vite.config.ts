import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ✅ Allow React Router paths (like /admin/login) to work on Vercel
  server: {
    historyApiFallback: true,
    port: 5173,
  },
  preview: {
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
