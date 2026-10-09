// Traces the "fixcar.in" wordmark from the client's large white logo into a clean SVG.
// The large PNG (15417×7757, white on transparent) has an icon badge on the left whose
// corners reach into the same columns as the "f". So the script labels connected shapes:
// shapes that start left of the badge/wordmark gap belong to the badge, the rest is the
// wordmark. Only wordmark shapes are traced (potrace).
// Outputs:
//   public/brand/fixcar-wordmark.svg       standalone SVG (fill: currentColor)
//   src/components/ui/wordmark-data.ts     viewBox + path for the inline React component
// Usage: node scripts/trace-logo.mjs
import { writeFileSync } from "node:fs";
import potrace from "potrace";
import sharp from "sharp";

const SOURCE = "public/brand/fixcar-logo-white-large.png";
const DOWNSCALE = 4; // label shapes at quarter resolution (the source is 15417 px wide)
const TRACE_HEIGHT = 360; // trace resolution: crisp curves, small path data

const meta = await sharp(SOURCE).metadata();
const w = Math.round(meta.width / DOWNSCALE);
const h = Math.round(meta.height / DOWNSCALE);
const { data: alpha } = await sharp(SOURCE)
  .extractChannel("alpha")
  .resize(w, h, { kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });
const ink = (x, y) => alpha[y * w + x] > 128;

/** Runs of occupied columns within rows y0..y1. */
function columnRuns(y0, y1) {
  const runs = [];
  let open = null;
  for (let x = 0; x < w; x += 1) {
    let any = false;
    for (let y = y0; y <= y1 && !any; y += 1) any = ink(x, y);
    if (any && !open) open = { start: x, end: x };
    if (any) open.end = x;
    if (!any && open) {
      runs.push(open);
      open = null;
    }
  }
  if (open) runs.push(open);
  return runs;
}

// 1. The wordmark band: the vertical extent of the widest run in the right part of the
//    artwork (the long bar over "xcar"). The leftmost run merges the badge with "fi".
const allRuns = columnRuns(0, h - 1).filter((run) => run.start / w > 0.25);
const widest = allRuns.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));
let bandTop = h;
let bandBottom = 0;
for (let y = 0; y < h; y += 1) {
  for (let x = widest.start; x <= widest.end; x += 1) {
    if (ink(x, y)) {
      bandTop = Math.min(bandTop, y);
      bandBottom = Math.max(bandBottom, y);
      break;
    }
  }
}

// 2. Inside the band, the widest gap between 25% and 60% of the width separates badge and "f".
const bandRuns = columnRuns(bandTop, bandBottom);
let split = 0;
let gapWidth = -1;
for (let i = 1; i < bandRuns.length; i += 1) {
  const gap = bandRuns[i].start - bandRuns[i - 1].end;
  const position = bandRuns[i].start / w;
  if (position > 0.25 && position < 0.6 && gap > gapWidth) {
    gapWidth = gap;
    split = bandRuns[i].start;
  }
}

// 3. Label connected shapes (8-connectivity).
const labels = new Int32Array(w * h);
const boxes = [null];
for (let start = 0; start < w * h; start += 1) {
  if (labels[start] || alpha[start] <= 128) continue;
  const id = boxes.length;
  const box = { minX: w, minY: h, maxX: 0, maxY: 0 };
  const stack = [start];
  labels[start] = id;
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p - x) / w;
    if (x < box.minX) box.minX = x;
    if (x > box.maxX) box.maxX = x;
    if (y < box.minY) box.minY = y;
    if (y > box.maxY) box.maxY = y;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (!labels[q] && alpha[q] > 128) {
          labels[q] = id;
          stack.push(q);
        }
      }
    }
  }
  boxes.push(box);
}

// 4. Wordmark shapes start at or right of the split; badge shapes start left of it.
const keep = new Set();
const crop = { minX: w, minY: h, maxX: 0, maxY: 0 };
boxes.forEach((box, id) => {
  if (!box || box.minX < split - 1) return;
  keep.add(id);
  crop.minX = Math.min(crop.minX, box.minX);
  crop.minY = Math.min(crop.minY, box.minY);
  crop.maxX = Math.max(crop.maxX, box.maxX);
  crop.maxY = Math.max(crop.maxY, box.maxY);
});
const cw = crop.maxX - crop.minX + 1;
const ch = crop.maxY - crop.minY + 1;
console.log(`shapes ${boxes.length - 1}; wordmark shapes ${keep.size}; split x=${split * DOWNSCALE} (gap ${gapWidth * DOWNSCALE}px); wordmark ${cw * DOWNSCALE}×${ch * DOWNSCALE}px`);

// 5. Black-on-white bitmap containing only wordmark shapes (keep antialiasing from the alpha).
const bitmap = Buffer.alloc(cw * ch, 255);
for (let y = 0; y < ch; y += 1) {
  for (let x = 0; x < cw; x += 1) {
    const sx = crop.minX + x;
    const sy = crop.minY + y;
    const p = sy * w + sx;
    let near = keep.has(labels[p]);
    for (let dy = -1; dy <= 1 && !near; dy += 1) {
      for (let dx = -1; dx <= 1 && !near; dx += 1) {
        const nx = sx + dx;
        const ny = sy + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h) near = keep.has(labels[ny * w + nx]);
      }
    }
    if (near) bitmap[y * cw + x] = 255 - alpha[p];
  }
}
const traceWidth = Math.round((cw / ch) * TRACE_HEIGHT);
const png = await sharp(bitmap, { raw: { width: cw, height: ch, channels: 1 } })
  .resize(traceWidth, TRACE_HEIGHT, { kernel: "lanczos3" })
  .png()
  .toBuffer();

const svg = await new Promise((resolve, reject) => {
  potrace.trace(
    png,
    { threshold: 128, turdSize: 8, optTolerance: 0.35, alphaMax: 1, color: "currentColor", background: "transparent" },
    (error, result) => (error ? reject(error) : resolve(result)),
  );
});
const d = svg.match(/ d="([^"]+)"/)?.[1];
if (!d) throw new Error("No path found in potrace output");
const viewBox = `0 0 ${traceWidth} ${TRACE_HEIGHT}`;

writeFileSync(
  "public/brand/fixcar-wordmark.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="fixcar.in"><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`,
);
writeFileSync(
  "src/components/ui/wordmark-data.ts",
  `// Generated by scripts/trace-logo.mjs from the client's large logo. Do not edit by hand.\n` +
    `export const WORDMARK_VIEWBOX = "${viewBox}";\n` +
    `export const WORDMARK_RATIO = ${(traceWidth / TRACE_HEIGHT).toFixed(4)};\n` +
    `export const WORDMARK_PATH =\n  "${d}";\n`,
);
console.log(`traced ${traceWidth}×${TRACE_HEIGHT}, path ${(d.length / 1024).toFixed(1)} KB`);
