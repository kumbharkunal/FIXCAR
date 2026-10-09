// Reports the colours in the client's logo files (for the brand notes in docs/ASSETS.md).
// Usage: node scripts/logo-colours.mjs
import sharp from "sharp";

const files = ["public/brand/fixcar-logo-blue.png", "public/brand/fixcar-logo-white-large.png"];
const hex = (r, g, b) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

for (const file of files) {
  const { data, info } = await sharp(file)
    .resize({ width: 600, withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const counts = new Map();
  let opaque = 0;
  let sum = [0, 0, 0];
  let saturated = 0;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue;
    opaque += 1;
    const key = hex(r & 0xf0, g & 0xf0, b & 0xf0);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if (Math.max(r, g, b) - Math.min(r, g, b) > 80) {
      sum = [sum[0] + r, sum[1] + g, sum[2] + b];
      saturated += 1;
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  console.log(`\n${file} (${info.width}×${info.height} sampled, ${opaque} opaque px)`);
  for (const [colour, n] of top) console.log(`  ${colour}  ${((n / opaque) * 100).toFixed(1)}%`);
  if (saturated) {
    console.log(`  brand hue (average of saturated px): ${hex(...sum.map((v) => Math.round(v / saturated)))}`);
  }
}
