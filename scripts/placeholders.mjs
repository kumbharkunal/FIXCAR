// Writes tasteful placeholder photos at the exact paths and sizes in docs/ASSETS.md.
// A limewash-to-stone gradient, labelled with the filename, size and use.
// Safe to re-run: a file you have replaced with a real photo is never overwritten
// (placeholders are recognised by the hashes stored in scripts/.placeholder-hashes.json).
// Usage: node scripts/placeholders.mjs [--force]
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/images";
const HASHES = "scripts/.placeholder-hashes.json";
const force = process.argv.includes("--force");

/** Mirrors the manifest in docs/ASSETS.md. */
export const manifest = [
  { file: "hero-doorstep.webp", w: 2400, h: 1350, use: "Hero, desktop", note: "Doorstep scene at a lime-washed gate. Subject centre-right." },
  { file: "hero-doorstep-mobile.webp", w: 1080, h: 1620, use: "Hero, mobile", note: "Same scene, portrait. Subject in the top half; lower 40% quiet ground." },
  { file: "service-periodic.webp", w: 1200, h: 1500, use: "Periodic service", note: "Oil being poured at an open bonnet. Hands only." },
  { file: "service-mechanical.webp", w: 1200, h: 1500, use: "Engine, clutch, suspension", note: "Technician at the wheel arch and suspension." },
  { file: "service-diagnostics.webp", w: 1200, h: 1500, use: "Computer diagnostics", note: "Scanner plugged in under the dashboard." },
  { file: "service-denting-painting.webp", w: 1200, h: 1500, use: "Denting and painting", note: "A polished door panel reflecting the sky." },
  { file: "service-wash.webp", w: 1200, h: 1500, use: "Car wash and dry-cleaning", note: "Foam on a dark car at a gate." },
  { file: "service-quickfix.webp", w: 1200, h: 1500, use: "Battery, tyres, AC, breakdown", note: "A battery swap at the kerb." },
  { file: "toolkit-flatlay.webp", w: 1600, h: 1600, use: "Why Fixcar.in checklist", note: "Top-down flat lay of tools, oil and filters." },
  { file: "doon-valley.webp", w: 2400, h: 1030, use: "Coverage", note: "The Doon valley from the ridge, morning haze." },
  { file: "cta-hill-road.webp", w: 2400, h: 1350, use: "Final call to action", note: "A dusk hill road with switchbacks and streetlights." },
];

const LIMEWASH = "#F2EBDD";
const STONE_TINT = "#C9C1AE"; // limewash mixed with stone, keeps the placeholder calm
const INK = "#1B2620";
const STONE = "#5D5A50";

const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");
const escapeXml = (text) => text.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]);

function svgFor({ file, w, h, use, note }) {
  const base = Math.min(w, h);
  const title = Math.round(base * 0.052);
  const body = Math.round(base * 0.028);
  const x = Math.round(w * 0.07);
  const y = Math.round(h * 0.5 - title * 1.4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${LIMEWASH}"/>
      <stop offset="1" stop-color="${STONE_TINT}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g font-family="Archivo, Segoe UI, Arial, sans-serif">
    <text x="${x}" y="${y}" font-size="${title}" font-weight="700" fill="${INK}">${escapeXml(file)}</text>
    <text x="${x}" y="${y + title * 1.25}" font-size="${body}" font-weight="500" fill="${STONE}">${w} × ${h} px, for: ${escapeXml(use)}</text>
    <text x="${x}" y="${y + title * 1.25 + body * 1.6}" font-size="${body}" fill="${STONE}">${escapeXml(note)}</text>
    <text x="${x}" y="${y + title * 1.25 + body * 3.2}" font-size="${body}" fill="${STONE}">Placeholder. Replace this file with your photo and rebuild.</text>
  </g>
</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });
const known = existsSync(HASHES) ? JSON.parse(readFileSync(HASHES, "utf8")) : {};
const next = { ...known };
let written = 0;
let skipped = 0;

for (const item of manifest) {
  const path = join(OUT_DIR, item.file);
  if (existsSync(path) && !force) {
    const current = sha(readFileSync(path));
    if (known[item.file] !== current) {
      console.log(`keep   ${path} (a real photo; not a placeholder)`);
      skipped += 1;
      continue;
    }
  }
  const buffer = await sharp(Buffer.from(svgFor(item))).webp({ quality: 82, effort: 5 }).toBuffer();
  writeFileSync(path, buffer);
  next[item.file] = sha(buffer);
  written += 1;
  console.log(`write  ${path} ${item.w}×${item.h} ${(buffer.length / 1024).toFixed(1)} KB`);
}

writeFileSync(HASHES, JSON.stringify(next, null, 2) + "\n");
console.log(`\n${written} written, ${skipped} kept.`);
