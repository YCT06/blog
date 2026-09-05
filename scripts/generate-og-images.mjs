// One-off asset generator: renders the five category default OG images
// (public/og/<category>.png) from SVG built in code, reusing the same
// colors/marks/patterns as ArticleCover.astro's no-cover card design.
// Run manually with `node scripts/generate-og-images.mjs` when the
// category palette or copy changes; the output PNGs are committed, this
// script is not part of `npm run build`.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { CATEGORY_LABELS } from "../src/data/taxonomy.ts";
import { categoryMarks } from "../src/lib/presentation.ts";

const WIDTH = 1200;
const HEIGHT = 630;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

const categories = {
  development: {
    background: "#345b68",
    pattern: `
      <pattern id="pat" patternUnits="userSpaceOnUse" width="52" height="52" patternTransform="rotate(135)">
        <rect width="52" height="52" fill="none"/>
        <rect width="3" height="52" fill="#f3efe51f"/>
      </pattern>`,
    ring: `<circle cx="${CX}" cy="${CY}" r="190" fill="none" stroke="#fff8eb59" stroke-width="2"/>`,
  },
  "digital-art": {
    background: "#9b6558",
    pattern: `
      <circle cx="${WIDTH * 0.26}" cy="${HEIGHT * 0.3}" r="150" fill="#e7bd78" opacity="0.85"/>
      <circle cx="${WIDTH * 0.74}" cy="${HEIGHT * 0.68}" r="230" fill="#294e59" opacity="0.85"/>`,
    ring: `<ellipse cx="${CX}" cy="${CY}" rx="330" ry="165" fill="none" stroke="#fff8eb70" stroke-width="2" transform="rotate(-14 ${CX} ${CY})"/>`,
  },
  reading: {
    background: "#596958",
    pattern: `
      <rect x="${CX - 12}" y="0" width="24" height="${HEIGHT}" fill="#f3efe524"/>
      <pattern id="pat" patternUnits="userSpaceOnUse" width="1" height="96">
        <rect width="1" height="4" fill="#f3efe51a"/>
      </pattern>`,
    ring: `<rect x="${CX - 165}" y="${CY - 108}" width="330" height="216" rx="6" fill="none" stroke="#fff8eb70" stroke-width="2"/>`,
  },
  "language-learning": {
    background: "#596a76",
    pattern: `
      <pattern id="pat" patternUnits="userSpaceOnUse" width="50" height="50">
        <circle cx="25" cy="25" r="3" fill="#f3efe52e"/>
      </pattern>`,
    ring: `<rect x="${CX - 165}" y="${CY - 90}" width="330" height="180" rx="70" fill="none" stroke="#fff8eb70" stroke-width="2" transform="rotate(6 ${CX} ${CY})"/>`,
  },
  life: {
    background: "#8b7355",
    pattern: `
      <polygon points="${WIDTH * 0.34},0 ${WIDTH * 0.5},0 ${WIDTH * 0.16},${HEIGHT} 0,${HEIGHT}" fill="#e7bd784f"/>`,
    ring: `<rect x="${CX - 115}" y="${CY - 115}" width="230" height="230" rx="6" fill="none" stroke="#fff8eb70" stroke-width="2" transform="rotate(45 ${CX} ${CY})"/>`,
  },
};

function buildSvg(id) {
  const { background, pattern, ring } = categories[id];
  const mark = categoryMarks[id];
  const label = CATEGORY_LABELS[id];
  const hasPatternDef = pattern.includes("<pattern");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    ${hasPatternDef ? pattern : ""}
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="45%" stop-color="#17201d" stop-opacity="0"/>
      <stop offset="100%" stop-color="#17201d" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${background}"/>
  ${hasPatternDef ? `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#pat)"/>` : pattern}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
  ${ring}
  <rect x="${CX - 85 + 14}" y="${CY - 104 + 14}" width="170" height="208" rx="8" fill="#17201d2b"/>
  <rect x="${CX - 85}" y="${CY - 104}" width="170" height="208" rx="8" fill="#a84032"/>
  <text x="${CX}" y="${CY + 32}" font-size="92" font-weight="700" fill="#fff8eb" text-anchor="middle" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif">${mark}</text>
  <text x="56" y="76" font-size="30" fill="#fff8ebd9" letter-spacing="2" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif">蔡鎰群的個人筆記</text>
  <text x="56" y="574" font-size="44" font-weight="500" fill="#fff8eb" letter-spacing="3" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif">${label}</text>
</svg>`;
}

const outDir = new URL("../public/og/", import.meta.url);
mkdirSync(outDir, { recursive: true });

for (const id of Object.keys(categories)) {
  const svg = buildSvg(id);
  const resvg = new Resvg(svg, { font: { loadSystemFonts: true } });
  const png = resvg.render().asPng();
  const outPath = new URL(`${id}.png`, outDir);
  writeFileSync(outPath, png);
  console.log("wrote", outPath.pathname.replace(/^\//, ""));
}
