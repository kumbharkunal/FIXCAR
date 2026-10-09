# Progress

Keep this file current. After any context compaction, re-read `docs/PLAN.md`, this file and `CLAUDE.md` before continuing.

## Phase 0: Persist context
- [x] `git init` (branch `main`)
- [x] `docs/PLAN.md` (approved plan)
- [x] `docs/PROGRESS.md`
- [x] `CLAUDE.md`
- [x] Commit

## Phase 1: Content
- [ ] Refetch pages and all 10 posts; confirm wording
- [ ] `docs/CONTENT.md` (original vs edited, SEO intent map, slug and 301 list)
- [ ] `src/content/site.ts` (single typed source)
- [ ] Download brand assets to `public/brand/` and founder photo to `public/images/founder.jpg`
- [ ] Logo colours reported (canvas sampling done in research: #0C68AE on white)
- [ ] Save ui-ux-pro-max output to `docs/research/ui-ux-pro-max.md`
- [ ] Gate: 43 areas, 17 brands, 3 reviews, 7 FAQs, 3 posts; zero em or en dashes in copy
- [x] Commit

## Phase 2: Design system
- [ ] `docs/DESIGN.md` (9 chapters, every component state, at least 8 don'ts)
- [ ] `scripts/contrast.mjs`
- [ ] Gate: every text pair ≥ 4.5:1 (large ≥ 3:1), controls ≥ 3:1
- [x] Commit

## Phase 3: Foundations
- [ ] Scaffold create-next-app 16.4.0 in scratchpad, move in, pin exact versions
- [ ] Install runtime and dev dependencies (exact)
- [ ] `next.config.ts` (images, headers, noindex), env chain, robots, sitemap, manifest
- [ ] Tokens in `globals.css` (`@theme`), Archivo via next/font
- [ ] Boot script (intro flag, fonts-ready, `?accent=blue`)
- [ ] MotionProvider (LazyMotion), SmoothScroll (idle GSAP + Lenis), GSAP registry
- [ ] `whatsapp.ts`, `analytics.ts`, `cn.ts`, `env.ts`, `jsonld.ts`
- [ ] Placeholders (`scripts/placeholders.mjs`), wordmark trace (`scripts/trace-logo.mjs`)
- [ ] Nav + MobileMenu perfected; BookingSheet + composer
- [ ] `scripts/qa-menu.mjs` passes
- [ ] Gate: build, lint, typecheck clean
- [x] Commit

## Phase 4: Sections (page order)
- [ ] IntroShutter
- [ ] Hero (+ composer, CSS load, scroll motion)
- [ ] BrandsMarquee
- [ ] Services (desktop pin, mobile swipe, chips)
- [ ] Process (route, car, steps)
- [ ] Founder
- [ ] Checklist
- [ ] Numbers (odometer)
- [ ] Reviews
- [ ] Coverage (area search)
- [ ] FAQ
- [ ] Journal
- [ ] FinalCta
- [ ] Footer
- [ ] WhatsAppFab
- [ ] OG image, icons, JSON-LD
- [x] Commit

## Phase 5: QA loop
- [ ] Screenshots at 390×844, 768×1024, 1440×900, 1920×1080
- [ ] Critique pass 1 and fixes
- [ ] Critique pass 2 and fixes
- [ ] Menu stress test, keyboard, screen reader names, reduced motion
- [ ] axe
- [ ] Lighthouse mobile and desktop (production build); SEO with noindex off
- [ ] First-load JS and hero bytes measured
- [x] Commit

## Phase 6: Ship
- [ ] README
- [ ] PITCH_NOTES
- [ ] Final build, lint, typecheck
- [ ] Commit and summary

## Notes and decisions log
- 2026-10-09: Plan approved without edits.
