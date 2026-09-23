import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Reached through the nginx front published on :8300, so the HMR client
    // must dial that host port rather than Vite's own.
    hmr: { clientPort: 8300 },
    watch: { usePolling: true },
  },
});
