// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://blog.tsaiyichiun.com",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "never",
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-dark", dark: "github-dark" },
    },
  },
});
