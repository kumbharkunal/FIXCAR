// Lighthouse against the production server (`npm run start -- -p 3100`), mobile and desktop,
// median of several runs, each in a fresh Chrome. Mobile uses Lighthouse's default
// simulated slow 4G and 4x CPU slowdown, the same profile as PageSpeed Insights.
//
// Budgets: Performance >= 95, Accessibility 100, Best Practices 100, LCP <= 2.0 s,
// CLS <= 0.03, TBT <= 150 ms. SEO is reported. The demo is noindex by default, which fails
// "is-crawlable" on purpose; build with NEXT_PUBLIC_NOINDEX=false and pass --seo to require 100.
//
// PageSpeed measures Vercel over HTTP/2; plain localhost is HTTP/1.1, which Lighthouse models
// as six cold connections and so overstates LCP. For PSI-like numbers run scripts/h2-proxy.mjs
// and set QA_URL=https://localhost:3443.
//
// Usage: node scripts/qa-lighthouse.mjs [--runs=3] [--only=mobile|desktop] [--seo] [--no-intro]
//   --no-intro  measures a repeat visit in the same session (the intro shutter is skipped)
// A discarded warm-up run comes first (cold image cache, fresh Chrome profile scans).
// Each run prints Lighthouse's CPU benchmark index: simulated throttling assumes a fast
// desktop (roughly 1000 or more), so runs on a busy or power-limited machine score low.
// Reports: qa/lighthouse/<form>[-no-intro].json (the median run)
import { mkdirSync, writeFileSync } from "node:fs";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import puppeteer from "puppeteer-core";

const BASE = process.env.QA_URL ?? "http://localhost:3100";
const arg = (name) => process.argv.find((value) => value.startsWith(`--${name}`));
const runs = Number(arg("runs")?.split("=")[1] ?? 3);
const forms = arg("only") ? [arg("only").split("=")[1]] : ["mobile", "desktop"];
const requireSeo = Boolean(arg("seo"));
const skipIntro = Boolean(arg("no-intro"));
const OUT = "qa/lighthouse";
mkdirSync(OUT, { recursive: true });

async function runOnce(form) {
  // The local HTTP/2 proxy (scripts/h2-proxy.mjs) uses a self-signed certificate.
  const insecure = /^https:\/\/(localhost|127\.0\.0\.1)/.test(BASE) ? ["--ignore-certificate-errors"] : [];
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-first-run", "--disable-extensions", ...insecure] });
  try {
    const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}`, defaultViewport: null });
    const page = await browser.newPage();
    if (skipIntro) await page.evaluateOnNewDocument(() => sessionStorage.setItem("fixcar-intro", "1"));
    const result = await lighthouse(
      BASE,
      { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] },
      form === "desktop" ? desktopConfig : undefined,
      page,
    );
    await browser.disconnect();
    return result.lhr;
  } finally {
    try {
      await chrome.kill();
    } catch {
      // Windows sometimes keeps the temporary profile locked for a moment; harmless.
    }
  }
}

const score = (lhr, id) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
const metric = (lhr, id) => lhr.audits[id]?.numericValue ?? NaN;
let failed = false;

for (const form of forms) {
  await runOnce(form);
  const results = [];
  for (let i = 0; i < runs; i += 1) results.push(await runOnce(form));
  results.sort((a, b) => score(a, "performance") - score(b, "performance") || metric(b, "largest-contentful-paint") - metric(a, "largest-contentful-paint"));
  const median = results[Math.floor(results.length / 2)];
  writeFileSync(`${OUT}/${form}${skipIntro ? "-no-intro" : ""}.json`, JSON.stringify(median));

  const s = { perf: score(median, "performance"), a11y: score(median, "accessibility"), bp: score(median, "best-practices"), seo: score(median, "seo") };
  const m = {
    fcp: metric(median, "first-contentful-paint"),
    lcp: metric(median, "largest-contentful-paint"),
    tbt: metric(median, "total-blocking-time"),
    cls: metric(median, "cumulative-layout-shift"),
    si: metric(median, "speed-index"),
  };
  const checks = [
    ["Performance >= 95", s.perf >= 95, s.perf],
    ["Accessibility 100", s.a11y === 100, s.a11y],
    ["Best Practices 100", s.bp === 100, s.bp],
    ["LCP <= 2.0 s", m.lcp <= 2000, `${(m.lcp / 1000).toFixed(2)} s`],
    ["CLS <= 0.03", m.cls <= 0.03, m.cls.toFixed(3)],
    ["TBT <= 150 ms", m.tbt <= 150, `${Math.round(m.tbt)} ms`],
  ];
  if (requireSeo) checks.push(["SEO 100", s.seo === 100, s.seo]);

  console.log(`\n${form}${skipIntro ? " (repeat visit, no intro)" : ""}: median of ${runs}`);
  console.log(`      Perf ${s.perf}  A11y ${s.a11y}  BP ${s.bp}  SEO ${s.seo}`);
  console.log(`      FCP ${(m.fcp / 1000).toFixed(2)} s  LCP ${(m.lcp / 1000).toFixed(2)} s  TBT ${Math.round(m.tbt)} ms  CLS ${m.cls.toFixed(3)}  SI ${(m.si / 1000).toFixed(2)} s`);
  console.log(`      all runs: Perf ${results.map((r) => score(r, "performance")).join(", ")}; LCP ${results.map((r) => (metric(r, "largest-contentful-paint") / 1000).toFixed(2)).join(", ")} s; CPU benchmark ${results.map((r) => Math.round(r.environment.benchmarkIndex)).join(", ")}`);
  const lcpElement = median.audits["lcp-breakdown-insight"]?.details?.items?.find((item) => item.type === "node")?.snippet;
  if (lcpElement) console.log(`      LCP element: ${lcpElement.slice(0, 110)}`);
  for (const [name, ok, value] of checks) {
    failed ||= !ok;
    console.log(`${ok ? "pass" : "FAIL"}  ${name}  (${value})`);
  }
  // Anything that cost points, so a failure says why.
  for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
    const refs = median.categories[category]?.auditRefs ?? [];
    for (const ref of refs) {
      const audit = median.audits[ref.id];
      if (ref.weight > 0 && audit && audit.score !== null && audit.score < 0.9 && category !== "performance") {
        console.log(`      ${category}: ${audit.id} (${audit.title})`);
      }
    }
  }
  const opportunities = Object.values(median.audits).filter((audit) => audit.details?.type === "opportunity" && (audit.numericValue ?? 0) > 0 && audit.score !== null && audit.score < 0.9);
  for (const audit of opportunities) console.log(`      opportunity: ${audit.id} (${audit.displayValue ?? ""})`);
}

process.exit(failed ? 1 : 0);
