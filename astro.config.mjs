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
  vite: {
    build: {
      // Scripts under Vite's default 4KB threshold get inlined as
      // <script type="module"> with no src, which our CSP script-src
      // (no 'unsafe-inline') then silently blocks in production.
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-dark", dark: "github-dark" },
    },
  },
});
