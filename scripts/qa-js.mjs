// JavaScript and hero image budgets, measured against the production server.
// - First-load JS: every script the HTML references (script tags and preloads), gzip -9.
// - Lazy JS: scripts fetched after that (idle motion modules, GSAP, Lenis, Motion features).
// - Hero image: bytes and format of the LCP photo at phone and desktop sizes.
// Run against `npm run start -- -p 3100`. Usage: node scripts/qa-js.mjs
import { brotliCompressSync, gzipSync } from "node:zlib";
import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:3100";
const BUDGET_JS = 180 * 1024;
const BUDGET_HERO = 180 * 1024;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function compressed(url) {
  const response = await fetch(new URL(url, BASE), { headers: { "accept-encoding": "identity" } });
  const raw = Buffer.from(await response.arrayBuffer());
  return { raw: raw.length, gzip: gzipSync(raw, { level: 9 }).length, brotli: brotliCompressSync(raw).length };
}

let failed = false;

// 1. First-load JS from the HTML.
const html = await (await fetch(BASE)).text();
// Scripts marked noModule (Next's legacy polyfills) are skipped by every modern browser.
const scriptTags = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)];
const legacy = new Set(scriptTags.filter((match) => /noModule/i.test(match[0])).map((match) => match[1]));
const initial = new Set(
  [...scriptTags, ...html.matchAll(/<link[^>]+rel="(?:preload|modulepreload)"[^>]+as="script"[^>]+href="([^"]+\.js)"/g), ...html.matchAll(/<link[^>]+href="([^"]+\.js)"[^>]+rel="(?:preload|modulepreload)"/g)]
    .map((match) => match[1])
    .filter((src) => !legacy.has(src)),
);
let firstLoad = { raw: 0, gzip: 0, brotli: 0 };
for (const src of initial) {
  const size = await compressed(src);
  firstLoad = { raw: firstLoad.raw + size.raw, gzip: firstLoad.gzip + size.gzip, brotli: firstLoad.brotli + size.brotli };
}
const inlineScripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).join("");
const inlineGzip = gzipSync(Buffer.from(inlineScripts), { level: 9 }).length;
const jsOk = firstLoad.gzip <= BUDGET_JS;
failed ||= !jsOk;
console.log(`${jsOk ? "pass" : "FAIL"}  first-load JS: ${initial.size} files, ${kb(firstLoad.gzip)} gzip (${kb(firstLoad.brotli)} brotli, ${kb(firstLoad.raw)} raw); budget ${kb(BUDGET_JS)}`);
console.log(`      inline scripts (RSC payload, boot script, JSON-LD): ${kb(inlineGzip)} gzip, part of the HTML document`);
for (const src of legacy) console.log(`      not counted: ${src} (noModule polyfill, ${kb((await compressed(src)).gzip)} gzip, legacy browsers only)`);

// 2. Everything fetched in a real session: load, idle, then a full scroll.
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const config of [
    { name: "phone 390, DPR 3", viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    { name: "phone 390, DPR 2", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    { name: "desktop 1440, DPR 1", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    { name: "desktop 1440, DPR 2", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  ]) {
    const { name, ...options } = config;
    const context = await browser.newContext(options);
    const page = await context.newPage();
    const scripts = new Map();
    const images = [];
    page.on("requestfinished", async (request) => {
      const url = request.url();
      const type = request.resourceType();
      try {
        const sizes = await request.sizes();
        if (type === "script") scripts.set(url, sizes.responseBodySize);
        if (type === "image") {
          const response = await request.response();
          images.push({ url, bytes: sizes.responseBodySize, type: response?.headers()["content-type"] ?? "?" });
        }
      } catch {}
    });
    await page.goto(BASE, { waitUntil: "load" });
    const atLoad = new Set(scripts.keys());
    await page.waitForTimeout(2500);
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    });
    await page.waitForTimeout(1500);
    const lazy = [...scripts.entries()].filter(([url]) => !atLoad.has(url));
    const lazyBytes = lazy.reduce((sum, [, bytes]) => sum + bytes, 0);
    const loadBytes = [...atLoad].reduce((sum, url) => sum + (scripts.get(url) ?? 0), 0);
    const hero = images.find((image) => /hero-doorstep/.test(decodeURIComponent(image.url)));
    const heroWidth = hero ? new URL(hero.url).searchParams.get("w") : "?";
    const heroOk = Boolean(hero) && hero.bytes <= BUDGET_HERO;
    failed ||= !heroOk;
    console.log(`\n${name}`);
    console.log(`      JS by load: ${atLoad.size} files, ${kb(loadBytes)} as served; after load (idle + scroll): ${lazy.length} files, ${kb(lazyBytes)}`);
    console.log(`${heroOk ? "pass" : "FAIL"}  hero image: ${hero ? `${kb(hero.bytes)} ${hero.type}, w=${heroWidth}` : "not found"}; budget ${kb(BUDGET_HERO)}`);
    await context.close();
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
