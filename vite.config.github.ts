// GitHub Pages static build configuration.
// Keep vite.config.ts untouched so the normal Lovable build remains unchanged.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    spa: { enabled: true },
  },
  nitro: false,
  vite: {
    base: "/resident-realm-roots/",
  },
});