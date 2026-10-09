// Verifies WCAG contrast for every colour pairing the design uses.
// Reads tokens from src/app/globals.css (falls back to docs/DESIGN.md).
// Usage: node scripts/contrast.mjs   (exits 1 if any pair fails)
import { existsSync, readFileSync } from "node:fs";

const sources = ["src/app/globals.css", "docs/DESIGN.md"];
const source = sources.find((path) => existsSync(path));
const css = readFileSync(source, "utf8");

/** Reads the first `--color-<name>: #RRGGBB` declaration (the default, not the accent preview). */
function token(name) {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --color-${name} not found in ${source}`);
  return match[1];
}

/** Reads a hex value from the [data-accent="blue"] block for the pitch preview. */
function previewToken(name) {
  const block = css.slice(css.indexOf('[data-accent="blue"]'));
  const match = block.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  return match ? match[1] : null;
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const channel = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Alpha-composite `fg` at `alpha` over `bg`. */
const mix = (fg, bg, alpha) => {
  const f = toRgb(fg);
  const b = toRgb(bg);
  return toHex(f.map((v, i) => alpha * v + (1 - alpha) * b[i]));
};

const c = {
  limewash: token("limewash"),
  paper: token("paper"),
  ink: token("ink"),
  stone: token("stone"),
  racing: token("racing"),
  racingHover: token("racing-hover"),
  racingPress: token("racing-press"),
};

const TEXT = 4.5; // normal text
const UI = 3; // non-text: control boundaries, focus indicators

const checks = [
  ["ink on limewash (body)", c.ink, c.limewash, TEXT],
  ["ink on paper (sheets, job card)", c.ink, c.paper, TEXT],
  ["stone on limewash (secondary text)", c.stone, c.limewash, TEXT],
  ["stone on paper (secondary text)", c.stone, c.paper, TEXT],
  ["racing on limewash (links, odometer)", c.racing, c.limewash, TEXT],
  ["racing on paper", c.racing, c.paper, TEXT],
  ["limewash on racing (primary buttons, CTA, footer)", c.limewash, c.racing, TEXT],
  ["paper on racing", c.paper, c.racing, TEXT],
  ["limewash on racing-hover", c.limewash, c.racingHover, TEXT],
  ["limewash on racing-press", c.limewash, c.racingPress, TEXT],
  ["racing text on limewash button (on racing surfaces)", c.racing, c.limewash, TEXT],
  ["ink on glass over black (worst case)", c.ink, mix(c.paper, "#000000", 0.62), TEXT],
  ["limewash on racing 80% over a light photo (worst case)", c.limewash, mix(c.racing, "#D8D2C4", 0.8), TEXT],
  ["stone input border on paper", c.stone, c.paper, UI],
  ["stone input border on limewash", c.stone, c.limewash, UI],
  ["ink ghost-button outline on limewash", c.ink, c.limewash, UI],
  ["racing focus ring on limewash", c.racing, c.limewash, UI],
  ["limewash focus ring on racing", c.limewash, c.racing, UI],
];

const blue = previewToken("racing");
if (blue) {
  checks.push(["limewash on accent preview (?accent=blue)", c.limewash, blue, TEXT]);
  checks.push(["accent preview on limewash", blue, c.limewash, TEXT]);
  const blueHover = previewToken("racing-hover");
  if (blueHover) checks.push(["limewash on accent preview hover", c.limewash, blueHover, TEXT]);
}

let failed = 0;
console.log(`Contrast check (tokens from ${source})\n`);
for (const [label, fg, bg, min] of checks) {
  const value = ratio(fg, bg);
  const ok = value >= min;
  if (!ok) failed += 1;
  console.log(`${ok ? "pass" : "FAIL"}  ${value.toFixed(2).padStart(5)}:1  (needs ${min}:1)  ${label}  [${fg} on ${bg}]`);
}
console.log(`\nNever used: ink on racing = ${ratio(c.ink, c.racing).toFixed(2)}:1`);
console.log(failed ? `\n${failed} pair(s) failed.` : "\nAll pairs pass.");
process.exit(failed ? 1 : 0);
