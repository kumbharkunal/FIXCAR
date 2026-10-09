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
- [ ] Screenshots at 390×844, 768×1024, 1440×900, 1920×1080
- [x] Critique pass 1 and fixes (390 and 1440: odometer alignment, two-column readings on phones, marquee edge fade, composer name placeholder, final CTA overlay, footer links and grid)
- [ ] Critique pass 2 and fixes
- [x] Menu stress test, keyboard, screen reader names, reduced motion (`qa-menu.mjs`)
- [x] axe (`qa-a11y.mjs`, 4/4 clean)
- [ ] Reduced-motion screenshots reviewed
- [ ] Lighthouse mobile and desktop (production build); SEO with noindex off
- [ ] First-load JS and hero bytes measured
- [ ] Commit

## Phase 6: Ship
- [ ] README
- [ ] PITCH_NOTES
- [ ] Final build, lint, typecheck
- [ ] Commit and summary

## Notes and decisions log
- 2026-10-09: Plan approved without edits.
- 2026-10-09: Phases 3 and 4 committed together. The Phase 3 gate (menu frame timing at 4x CPU) was only met after the sections were built, so there was no clean point for a separate Phase 3 commit that builds on its own.
- 2026-10-09: Menu performance. The body `position: fixed` lock was replaced by a touch-only lock (no relayout, scroll position never moves), the menu content stays mounted (hidden and inert while closed), and page `inert` lands 800 ms after opening. Tab and Shift+Tab are wrapped inside the sheet from the first frame, so focus never escapes during that window.
- 2026-10-09: Reviews carousel slides are `div role="group"` (axe `list` rule).
