# Progress

Keep this file current. After any context compaction, re-read `docs/PLAN.md`, this file and `CLAUDE.md` before continuing.

## Phase 0: Persist context
- [x] `git init` (branch `main`)
- [x] `docs/PLAN.md` (approved plan)
- [x] `docs/PROGRESS.md`
- [x] `CLAUDE.md`
- [x] Commit

## Phase 1: Content
- [x] Refetch pages and all 10 posts; confirm wording (archived in `docs/research/source/`)
- [x] `docs/CONTENT.md` (original vs edited, SEO intent map, slug and 301 list)
- [x] `src/content/site.ts` (single typed source; typecheck runs in Phase 3)
- [x] Download brand assets to `public/brand/` and founder photo to `public/images/founder.jpg` (header and footer logos were identical; kept one as `fixcar-logo-blue.png`)
- [x] Logo colours reported: wordmark blue #0C68AE (cluster #0060B0) on opaque white; large logo is white on transparent. Script version in Phase 3
- [x] Save ui-ux-pro-max output to `docs/research/ui-ux-pro-max.md`
- [x] Gate: 43 areas, 17 brands, 3 reviews, 7 FAQs, 3 posts; zero em or en dashes in `site.ts`
- [x] Commit

## Phase 2: Design system
- [x] `docs/DESIGN.md` (9 chapters, every component state, 12 don'ts)
- [x] `scripts/contrast.mjs` (reads globals.css, falls back to DESIGN.md)
- [x] Gate: all 21 pairs pass (lowest 5.49:1 text, 5.82:1 controls)
- [x] Commit

## Phase 3: Foundations
- [x] Scaffold create-next-app 16.4.0 in scratchpad, move in, pin exact versions (`.npmrc save-exact=true`)
- [x] Install runtime and dev dependencies (exact)
- [x] `next.config.ts` (images, headers, noindex), env chain, robots, sitemap, manifest
- [x] Tokens in `globals.css` (`@theme`), Archivo via next/font (one variable file, `wdth` axis)
- [x] Boot script (intro flag, fonts-ready, `?accent=blue`)
- [x] MotionProvider (LazyMotion), SmoothScroll (idle GSAP + Lenis), GSAP registry
- [x] `whatsapp.ts`, `cn.ts`, `env.ts`, `jsonld.ts`, `scroll.ts` (analytics events sent by `ClickTracker` and the composer through `track`)
- [x] Placeholders (`scripts/placeholders.mjs`), wordmark trace (`scripts/trace-logo.mjs`), icons (`scripts/make-icons.mjs`)
- [x] Nav + mobile menu; BookingSheet + composer
- [x] `scripts/qa-menu.mjs` passes 22/22 (frames at 4x CPU: p95 16.6 ms, open 16.7, close 8.5; tap to first frame 4 to 8 ms)
- [x] Gate: build, lint, typecheck clean
- [x] Commit (together with Phase 4, see the log)

## Phase 4: Sections (page order)
- [x] IntroShutter
- [x] Hero (+ composer, CSS load, scroll motion)
- [x] BrandsMarquee
- [x] Services (desktop pin, mobile swipe, chips)
- [x] Process (route, car, steps)
- [x] Founder
- [x] Checklist
- [x] Numbers (odometer)
- [x] Reviews
- [x] Coverage (area search)
- [x] FAQ
- [x] Journal
- [x] FinalCta
- [x] Footer
- [x] WhatsAppFab
- [x] OG image, icons, JSON-LD
- [x] Gate: real content in every section; zero console errors or warnings and zero axe violations at 390 and 1440, with and without reduced motion (`scripts/qa-a11y.mjs`); 390 and 1440 screenshots reviewed
- [x] Commit

## Phase 5: QA loop
- [x] Screenshots at 390×844, 768×1024, 1440×900, 1920×1080 (`qa:shots`; no console errors at any size)
- [x] Critique pass 1 and fixes (390 and 1440: odometer alignment, two-column readings on phones, marquee edge fade, composer name placeholder, final CTA overlay, footer links and grid)
- [x] Critique pass 2: anti-slop audit clean (no dashes, meta dots, arrows, caps, eyebrows, mono or coloured headline words; radii only 999px and 28px; racing green the only accent); tablet and large-desktop sheets reviewed
- [x] Menu stress test, keyboard, screen reader names, reduced motion (`qa:menu` 22/22)
- [x] axe (`qa:a11y`, 4/4 clean)
- [x] Reduced-motion screenshots reviewed (final state at first paint, no intro)
- [x] Lighthouse mobile and desktop (production build); SEO 100 with noindex off
- [x] First-load JS and hero bytes measured (`qa:js`: 172.4 KB gzip, 149.1 KB brotli)
- [x] Commit

## Phase 6: Ship
- [x] README (run, env vars, Vercel deploy, swapping photos, editing site.ts, `?accent=blue`, QA scripts, budgets)
- [x] `docs/ASSETS.md` (manifest, shot list prompts, placeholders, brand assets, logo colours, fonts)
- [x] `docs/PITCH_NOTES.md` (before and after, client questions, SKDS note, recommendations, launch checklist)
- [x] `.env.example`; empty `NEXT_PUBLIC_SITE_URL` falls back to the default
- [x] Final build, lint, typecheck clean; `qa:menu` 22/22, `qa:js` 172.5 KB gzip
- [x] Commit and summary

## Notes and decisions log
- 2026-10-09: Plan approved without edits.
- 2026-10-09: Phases 3 and 4 committed together. The Phase 3 gate (menu frame timing at 4x CPU) was only met after the sections were built, so there was no clean point for a separate Phase 3 commit that builds on its own.
- 2026-10-09: Menu performance. The body `position: fixed` lock was replaced by a touch-only lock (no relayout, scroll position never moves), the menu content stays mounted (hidden and inert while closed), and page `inert` lands 800 ms after opening. Tab and Shift+Tab are wrapped inside the sheet from the first frame, so focus never escapes during that window.
- 2026-10-09: Reviews carousel slides are `div role="group"` (axe `list` rule).
- 2026-10-09: Performance pass. Photos render on the server through `Photo` (getImageProps, no client image component); icons inside client components are rendered on the server and passed in as props; the select caret is a CSS mask; the magnetic pull loads on idle for fine pointers only (Motion `springValue` + `styleEffect`); repeated vectors (wordmark, social marks) come from one SVG sprite; Archivo is subset to the characters the site uses (90.6 KB to 60.8 KB, `assets:font`). First-load JS 192.8 to 172.4 KB gzip; HTML 64.9 to 54.2 KB gzip.
- 2026-10-09: Below-the-fold sections use `content-visibility: auto` and are rendered one per idle slice before the motion modules or Lenis measure anything (`renderSectionsGradually`); anchor scrolling renders them at once. First paint at 4x CPU: 372 to 200 ms.
- 2026-10-09: Lighthouse runs locally go through `scripts/h2-proxy.mjs` (HTTP/2, like Vercel). Plain localhost is HTTP/1.1, which Lighthouse simulates as six cold connections and so overstates LCP by about 1 s.
- 2026-10-09: Budget status. Mobile (HTTP/2): Perf 96, A11y 100, BP 100, SEO 100 with indexing on, TBT 59 ms, CLS 0, LCP 2.78 s simulated. LCP misses the 2.0 s budget: in the fast observed load the first frame is presented after the async Next.js chunks run, so Lighthouse's simulation counts all first-load JS (about 172 KB) as LCP-blocking. Real loads at 4x CPU paint the hero in about 0.2 s locally. Desktop: Perf 100, LCP 0.62 s.
