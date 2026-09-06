// One-off asset generator: rasterizes public/favicon.svg into public/favicon.ico
// (a single 64x64 PNG-frame ICO) so non-SVG-favicon clients get a matching icon.
// Run manually with `node scripts/generate-favicon-ico.mjs` after favicon.svg changes.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync(new URL("../public/favicon.svg", import.meta.url), "utf8");
const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 64 } });
const png = resvg.render().asPng();

const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0); // reserved
iconDir.writeUInt16LE(1, 2); // type: icon
iconDir.writeUInt16LE(1, 4); // image count

const entry = Buffer.alloc(16);
entry.writeUInt8(64, 0); // width
entry.writeUInt8(64, 1); // height
entry.writeUInt8(0, 2); // color count (0 = not a palette)
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8); // image data size
entry.writeUInt32LE(6 + 16, 12); // offset to image data

const ico = Buffer.concat([iconDir, entry, png]);
const outPath = new URL("../public/favicon.ico", import.meta.url);
writeFileSync(outPath, ico);
console.log("wrote", outPath.pathname.replace(/^\//, ""));
