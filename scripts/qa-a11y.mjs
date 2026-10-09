// Accessibility and console check: axe (WCAG 2.2 A and AA) at phone and desktop widths,
// with and without reduced motion, after scrolling the whole page so every reveal has run.
// Also fails on console errors, console warnings and uncaught page errors.
// Run against `npm run start -- -p 3100`. Usage: node scripts/qa-a11y.mjs
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:3100";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const runs = [
  { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "phone, reduced motion", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
  { name: "desktop, reduced motion", viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
];

/** Scrolls through the page so motion modules load and one-time reveals finish. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

let failed = 0;
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const { name, ...options } of runs) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    const problems = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") problems.push(`${message.type()}: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(2400);
    await scrollThrough(page);
    const { violations, incomplete } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    const ok = violations.length === 0 && problems.length === 0;
    if (!ok) failed += 1;
    console.log(`${ok ? "pass" : "FAIL"}  ${name}: ${violations.length} axe violations, ${problems.length} console problems, ${incomplete.length} needing review`);
    for (const violation of violations) {
      console.log(`      ${violation.impact ?? "minor"}  ${violation.id}: ${violation.help}`);
      for (const node of violation.nodes.slice(0, 4)) console.log(`        ${node.target.join(" ")}  ${node.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
    }
    for (const problem of problems.slice(0, 8)) console.log(`      ${problem}`);
    for (const item of incomplete) console.log(`      review  ${item.id} (${item.nodes.length}): ${item.help}`);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`\n${runs.length - failed}/${runs.length} runs clean.`);
process.exit(failed ? 1 : 0);
