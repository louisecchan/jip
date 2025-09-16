// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  adapter: netlify({
    // Use Netlify Functions (Node) runtime
    // For Edge runtime, switch to '@astrojs/netlify/edge'
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
