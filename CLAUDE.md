# Fixcar.in homepage demo

A pitch demo of a redesigned homepage for Fixcar.in, a doorstep multi-brand car service in Dehradun. Next.js 16 (App Router) on Vercel. The page's job: a car owner on a phone books on WhatsApp or calls in under 30 seconds.

## Read first
- `docs/PLAN.md`: the approved plan (scope, decisions, budgets). Source of truth.
- `docs/PROGRESS.md`: what is done and what is next. Update it as you work.
- `docs/DESIGN.md`: tokens, type, components, motion, do's and don'ts.
- `docs/CONTENT.md`: original client wording next to edited copy.
- `docs/ASSETS.md`: image manifest and shot list.
- `AGENTS.md`: Next.js agent rules from create-next-app (Next 16 APIs differ from older training data).
After any context compaction, re-read PLAN, PROGRESS and this file before continuing.

## Commands
- `npm run dev`, `npm run build`, `npm run start`
- `npm run lint` (ESLint flat config, `eslint .`; `next lint` no longer exists in Next 16)
- `npm run typecheck` (`tsc --noEmit`)
- `npm run assets:placeholders`, `npm run assets:logo`
- `npm run qa:shots`, `qa:menu`, `qa:a11y`, `qa:lighthouse`, `qa:js` (run against `npm run start` on port 3000)

## Content
- Every piece of business content lives in `src/content/site.ts`. Components never hard-code copy, phone numbers or URLs.
- Brand name in copy is "Fixcar.in". The logo is the lowercase "fixcar.in" wordmark (`src/components/ui/Wordmark.tsx`).
- Never invent facts, prices, warranties, reviews or counts. Counts derive from data (`areas.length`, `brands.length`).
- Client TODOs live in `site.ts` (`clientTodos`) and `docs/PITCH_NOTES.md`, never as code comments.
- Copy: sentence case, active voice, Indian English (tyre, colour), `lang="en-IN"`. No em or en dashes, no ALL CAPS labels, no eyebrows, no "→" on buttons, no "A · B · C" meta strings. Buttons say what happens ("Book on WhatsApp", "Call 81682 11587").

## Design rules
- Light theme only. One accent: racing green. Tokens only (no raw hex in components). See `docs/DESIGN.md`.
- Radius: pill (999px) for nav, buttons, chips, inputs, FAB; 28px for photo frames, sheets, the job card. Nothing else. Full-bleed means no radius.
- Glass only on the nav pill, mobile menu sheet, WhatsApp FAB and the hero composer bar.
- Typeface: Archivo variable only (wdth + wght), via `next/font/google`. The width axis animates only in the hero.
- Numbered markers only in the doorstep process. No pills or labels on photos (captions go below).

## Code rules
- Server components by default. Client components only for interaction or animation, kept as small leaf islands.
- GSAP: only inside motion modules under `src/components/**/motion/`, loaded with `next/dynamic(..., { ssr: false })` from a client loader, using `useGSAP({ scope })` from `@gsap/react`. Plugins are registered once in `src/lib/gsap.ts`. Use `gsap.matchMedia()` for desktop, mobile and reduced-motion branches. Never call GSAP during SSR.
- Motion: `LazyMotion` + `m` (from `motion/react`), `domMax` loaded async. Use motion values (`useMotionValue`, `useScroll`, `useMotionValueEvent`), never React state, for continuous values.
- Never let two libraries animate the same property on the same element.
- No `window.addEventListener('scroll')`. Use Motion `useScroll`, ScrollTrigger, IntersectionObserver or Lenis events.
- Final state first: the server renders final states; JS only resets off-screen elements before animating them in. Every animation has a reduced-motion path (instant or opacity only).
- Animate transform, opacity and clip-path only (exceptions: the hero `font-stretch` moment and the FAQ height).
- Lenis runs on desktop fine pointers only, created after GSAP loads, `autoRaf: false`, driven by `gsap.ticker`. Stop it while any sheet is open.
- Next 16 notes: Turbopack is the default bundler; `cacheComponents` is on, so no `new Date()` or `Math.random()` in server components; use `preload` (not `priority`) on the hero image; any image quality other than 75 must be listed in `images.qualities`.
- Accessibility: WCAG 2.2 AA. Visible 2px racing-green focus ring with offset, 44px touch targets, one h1, landmarks, skip link, `inert` behind open sheets.

## Performance budgets
Mobile Lighthouse on the production build: Performance ≥ 95, Accessibility 100, Best Practices 100. LCP ≤ 2.0 s, CLS ≤ 0.03, INP ≤ 150 ms, TBT ≤ 150 ms. First-load JS ≈ ≤ 180 KB gzipped. Hero image ≤ 180 KB served. One font file preloaded. No third-party embeds on load.

## Environment
- `NEXT_PUBLIC_SITE_URL`: canonical/OG base. Falls back to the Vercel production URL, then `https://www.fixcar.in`.
- `NEXT_PUBLIC_NOINDEX`: `true` by default (demo must not compete with the live site). Drives `robots.ts`, `metadata.robots` and an `X-Robots-Tag` header.
- The project folder syncs through OneDrive. If installs or builds hit EBUSY/EPERM, pause OneDrive sync.

## Git
Commit at the end of every phase. End commit messages with:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
