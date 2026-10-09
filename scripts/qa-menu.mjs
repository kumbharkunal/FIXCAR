// Stress test for the mobile menu and the booking sheet (390×844, touch).
// Run against `npm run start -- -p 3100`. Exits 1 if any check fails.
// Usage: node scripts/qa-menu.mjs
import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:3100";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "pass" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const settle = (page, ms = 650) => page.waitForTimeout(ms);

/** Snapshot of everything that must be consistent after the menu closes. */
async function state(page) {
  return page.evaluate(() => ({
    expanded: document.querySelector('[aria-controls="mobile-menu"]')?.getAttribute("aria-expanded"),
    menuPresent: (() => { const menu = document.getElementById("mobile-menu"); return Boolean(menu && !menu.hidden); })(),
    mainInert: document.getElementById("main")?.inert ?? null,
    bodyPosition: document.body.style.position,
    htmlOverflow: document.documentElement.style.overflow,
    locked: (() => { const e = new TouchEvent("touchmove", { cancelable: true, bubbles: true, touches: [] }); document.getElementById("main")?.dispatchEvent(e); return e.defaultPrevented; })(),
    scrollY: Math.round(window.scrollY),
    active: document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim().slice(0, 40) || document.activeElement?.tagName,
  }));
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await settle(page, 2200);

  const toggle = page.locator('[aria-controls="mobile-menu"]');

  // 1. Accessible name and state before opening.
  check("toggle named 'Open menu' with aria-expanded=false", (await toggle.getAttribute("aria-label")) === "Open menu" && (await toggle.getAttribute("aria-expanded")) === "false");

  // 2. Open from a scrolled position: lock, inert, focus moves into the menu.
  await page.evaluate(() => window.scrollTo(0, 600));
  await settle(page, 400);
  const before = await state(page);
  await toggle.click();
  // inert lands 800 ms after opening, once the links have settled (see Nav.tsx).
  await settle(page, 950);
  let s = await state(page);
  check("opens: aria-expanded=true, menu rendered", s.expanded === "true" && s.menuPresent);
  check("toggle renamed 'Close menu'", (await toggle.getAttribute("aria-label")) === "Close menu");
  check("page behind is inert", s.mainInert === true);
  check("scroll locked (touch scrolling blocked, position kept)", s.locked && s.scrollY === before.scrollY, `scrollY ${s.scrollY}`);
  check("focus moved to the first menu link", s.active === "Services", s.active);

  // 3. No scroll bleed while open.
  await page.mouse.wheel(0, 800);
  await settle(page, 300);

  // 4. Escape closes, restores scroll and focus.
  await page.keyboard.press("Escape");
  await settle(page, 800);
  s = await state(page);
  check("Escape closes the menu", s.expanded === "false" && !s.menuPresent);
  check("lock and inert released", s.mainInert === false && !s.locked && s.htmlOverflow === "");
  check("scroll position restored exactly", s.scrollY === before.scrollY, `${before.scrollY} -> ${s.scrollY}`);
  check("focus returned to the toggle", s.active === "Open menu", s.active);

  // 5. Twenty rapid taps cannot leave a stuck state.
  for (let i = 0; i < 20; i += 1) {
    await toggle.click({ delay: 0 });
    await page.waitForTimeout(25 + (i % 3) * 20);
  }
  await settle(page, 1200);
  s = await state(page);
  const consistent = s.expanded === "true" ? s.menuPresent && s.mainInert === true && s.locked : !s.menuPresent && s.mainInert === false && !s.locked && s.htmlOverflow === "";
  check("20 rapid taps leave a consistent state", consistent, JSON.stringify(s));
  if (s.expanded === "true") {
    await toggle.click();
    await settle(page, 800);
  }

  // 6. Backdrop tap closes.
  await toggle.click();
  await settle(page);
  await page.mouse.click(195, 830);
  await settle(page, 800);
  s = await state(page);
  check("backdrop tap closes", s.expanded === "false" && s.mainInert === false && s.bodyPosition === "");

  // 7. Tab and Shift+Tab stay inside the open menu, from the first frame (before inert lands).
  await toggle.click();
  await page.waitForTimeout(150);
  let escaped = false;
  for (let i = 0; i < 28; i += 1) {
    await page.keyboard.press(i < 16 ? "Tab" : "Shift+Tab");
    escaped ||= await page.evaluate(() => !document.querySelector("header")?.contains(document.activeElement));
  }
  check("Tab and Shift+Tab cycle inside the menu", !escaped);
  await settle(page);

  // 8. Link tap: closes first, then scrolls to the section and focuses its heading.
  await page.getByRole("link", { name: "Reviews", exact: true }).first().click();
  await settle(page, 1800);
  s = await state(page);
  const reviewsTop = await page.evaluate(() => Math.round(document.getElementById("reviews").getBoundingClientRect().top));
  check("link tap closes the menu", s.expanded === "false" && s.mainInert === false && s.bodyPosition === "");
  check("then scrolls to the section", Math.abs(reviewsTop - 96) < 160, `section top at ${reviewsTop}px`);
  check("and focuses the section heading", s.active?.startsWith("What our customers say") ?? false, s.active);

  // 9. Frame timing with 4x CPU throttling, three open/close cycles.
  //    Animation smoothness: p95 of frame times while the menu animates, after the first
  //    frame. Input response: time from the tap to the first animation frame (INP-like).
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 400);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const animationFrames = [];
  const phaseFrames = { open: [], close: [] };
  const inputDelays = [];
  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (const action of ["open", "close"]) {
      await page.evaluate(() => {
        window.__frames = [];
        window.__stop = false;
        const tick = (now) => {
          window.__frames.push(now);
          if (!window.__stop) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await page.waitForTimeout(120);
      const clickedAt = await page.evaluate(() => performance.now());
      await toggle.click();
      await page.waitForTimeout(action === "open" ? 950 : 750);
      const stamps = await page.evaluate(() => {
        window.__stop = true;
        return window.__frames;
      });
      const after = stamps.filter((t) => t > clickedAt);
      if (after.length) inputDelays.push(after[0] - clickedAt);
      for (let i = 1; i < after.length; i += 1) {
        if (after[i] - clickedAt < (action === "open" ? 900 : 700)) {
          animationFrames.push(after[i] - after[i - 1]);
          phaseFrames[action].push(after[i] - after[i - 1]);
        }
      }
    }
  }
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  animationFrames.sort((a, b) => a - b);
  inputDelays.sort((a, b) => a - b);
  const percentile = (list, q) => [...list].sort((a, b) => a - b)[Math.floor(list.length * q)] ?? 0;
  const p95 = percentile(animationFrames, 0.95);
  const worstInput = inputDelays[inputDelays.length - 1] ?? 0;
  const split = `open p95 ${percentile(phaseFrames.open, 0.95).toFixed(1)}, close p95 ${percentile(phaseFrames.close, 0.95).toFixed(1)}`;
  check("animation frames p95 under 20 ms at 4x CPU", p95 < 20, `${p95.toFixed(1)} ms over ${animationFrames.length} frames; ${split}`);
  check("tap to first frame under 150 ms at 4x CPU (INP budget)", worstInput < 150, `worst ${worstInput.toFixed(0)} ms`);

  // 10. Booking sheet: opens as a dialog, locks the page, Escape closes, focus returns.
  const book = page.locator('[data-track="hero"] a[aria-haspopup="dialog"]').first();
  await book.click();
  await settle(page, 700);
  const dialogVisible = await page.getByRole("dialog").isVisible();
  const sheetState = await state(page);
  check("booking sheet opens as a dialog over an inert page", dialogVisible && sheetState.mainInert === true);
  await page.keyboard.press("Escape");
  await settle(page, 800);
  const afterSheet = await state(page);
  const returned = await page.evaluate(() => document.activeElement?.matches('[data-track="hero"] a[aria-haspopup="dialog"]') ?? false);
  check("Escape closes the sheet and releases the page", !(await page.getByRole("dialog").count()) && afterSheet.mainInert === false && afterSheet.bodyPosition === "");
  check("focus returns to the Book button", returned);

  await context.close();

  // 11. Reduced motion: opens and closes immediately.
  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const rpage = await reduced.newPage();
  await rpage.goto(BASE, { waitUntil: "networkidle" });
  await settle(rpage, 600);
  const rtoggle = rpage.locator('[aria-controls="mobile-menu"]');
  await rtoggle.click();
  await rpage.waitForTimeout(250);
  const rOpen = await state(rpage);
  await rpage.keyboard.press("Escape");
  await rpage.waitForTimeout(450);
  const rClosed = await state(rpage);
  check("reduced motion: opens and closes promptly", rOpen.menuPresent && rOpen.expanded === "true" && !rClosed.menuPresent && rClosed.bodyPosition === "");
  await reduced.close();
} finally {
  await browser.close();
}

const failed = results.filter((result) => !result.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed.`);
process.exit(failed ? 1 : 0);
