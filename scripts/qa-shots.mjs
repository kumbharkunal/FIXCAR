// Screenshots every section at the four review viewports (plus reduced motion and the
// open mobile menu) using the installed Chrome. Run against `npm run start`.
// Usage: node scripts/qa-shots.mjs [--only=390x844,1440x900]
// Output: qa/screens/<viewport>/<nn>-<section>.png
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:3100";
const OUT = "qa/screens";
const only = process.argv.find((arg) => arg.startsWith("--only="))?.slice(7).split(",");

const viewports = [
  { name: "390x844", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "768x1024", width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
].filter((viewport) => !only || only.includes(viewport.name));

const sections = [
  ["hero", '[data-track="hero"]'],
  ["brands", '[data-track="brands"]'],
  ["services", '[data-track="services"]'],
  ["process", '[data-track="process"]'],
  ["founder", '[data-track="founder"]'],
  ["checklist", '[data-track="checklist"]'],
  ["numbers", '[data-track="numbers"]'],
  ["reviews", '[data-track="reviews"]'],
  ["areas", '[data-track="areas"]'],
  ["faq", '[data-track="faq"]'],
  ["journal", '[data-track="journal"]'],
  ["final-cta", '[data-track="final-cta"]'],
  ["footer", '[data-track="footer"]'],
];

/** Scrolls through the page so lazy images load and one-time animations finish. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const viewport of viewports) {
    const dir = join(OUT, viewport.name);
    mkdirSync(dir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.isMobile ?? false,
      hasTouch: viewport.hasTouch ?? false,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
    page.on("pageerror", (error) => errors.push(String(error)));

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(2400); // intro shutter + hero load
    await page.screenshot({ path: join(dir, "00-first-view.png") });
    await settle(page);

    let n = 1;
    for (const [name, selector] of sections) {
      const locator = page.locator(selector).first();
      if (!(await locator.count())) {
        console.warn(`  missing ${name}`);
        continue;
      }
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(dir, `${String(n).padStart(2, "0")}-${name}.png`) });
      n += 1;
    }

    if (viewport.isMobile) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(dir, "90-menu-open.png") });
      await page.getByRole("button", { name: "Close menu" }).click();
      await page.waitForTimeout(500);
      await page.locator('[data-track="hero"] a[aria-haspopup="dialog"]').first().click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(dir, "91-booking-sheet.png") });
    }

    console.log(`${viewport.name}: ${n - 1} sections${errors.length ? `, console errors:\n  ${errors.join("\n  ")}` : ", no console errors"}`);
    await context.close();
  }

  // Reduced motion: the first view must already be in its final state.
  for (const viewport of viewports.filter((v) => v.name === "390x844" || v.name === "1440x900")) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce", isMobile: viewport.isMobile ?? false, hasTouch: viewport.hasTouch ?? false });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(OUT, viewport.name, "80-reduced-motion-first-view.png") });
    await context.close();
  }
} finally {
  await browser.close();
}
