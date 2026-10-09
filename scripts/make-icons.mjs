// Builds the app icon from the traced wordmark: the "f" (with the start of its long
// crossbar) in limewash on racing green.
// Outputs src/app/icon.svg and src/app/apple-icon.png (180×180).
// Usage: node scripts/make-icons.mjs   (run after scripts/trace-logo.mjs)
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const RACING = "#1F4532";
const LIMEWASH = "#F2EBDD";

const svg = readFileSync("public/brand/fixcar-wordmark.svg", "utf8");
const viewBox = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
const d = svg.match(/ d="([^"]+)"/)[1];
const [, , width, height] = viewBox;

// Find where the "f" ends: the first empty column after ink has started, scanning only
// the lower 70% of the glyphs (the "i" dot sits above that band, close to the f's hook).
const { data, info } = await sharp(Buffer.from(svg.replace("currentColor", "#000")))
  .flatten({ background: "#fff" })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
let inkStarted = false;
let fEnd = width;
const bandTop = Math.round(info.height * 0.3);
for (let x = 0; x < info.width; x += 1) {
  let ink = false;
  for (let y = bandTop; y < info.height; y += 1) {
    if (data[y * info.width + x] < 128) {
      ink = true;
      break;
    }
  }
  if (ink) inkStarted = true;
  else if (inkStarted) {
    fEnd = (x / info.width) * width;
    break;
  }
}

const size = 512;
const glyphHeight = 330;
const scale = glyphHeight / height;
const glyphWidth = fEnd * scale;
const tx = (size - glyphWidth) / 2;
const ty = (size - glyphHeight) / 2;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="112" fill="${RACING}"/>
  <clipPath id="f"><rect x="0" y="0" width="${fEnd.toFixed(1)}" height="${height}"/></clipPath>
  <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(4)})">
    <path clip-path="url(#f)" fill="${LIMEWASH}" fill-rule="evenodd" d="${d}"/>
  </g>
</svg>
`;
writeFileSync("src/app/icon.svg", icon);
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile("src/app/apple-icon.png");
console.log(`icon: "f" ends at x=${fEnd.toFixed(1)} of ${width}; wrote src/app/icon.svg and src/app/apple-icon.png`);
