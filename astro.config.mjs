// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: { light: "github-dark", dark: "github-dark" },
    },
  },
});
