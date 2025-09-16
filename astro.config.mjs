// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  // Platform-specific build configuration
  build: {
    // Ensure consistent builds across platforms
    inlineStylesheets: "auto",
  },
  // Vite configuration for platform compatibility
  vite: {
    build: {
      // Target Node.js 18+ for better compatibility
      target: "node18",
      // Ensure consistent output across platforms
      rollupOptions: {
        external: ["sharp"],
      },
    },
    // Optimize for different platforms
    optimizeDeps: {
      include: ["stripe", "typed.js"],
    },
  },
  // Astro automatically loads .env files, no special configuration needed
});
