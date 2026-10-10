# Fixcar.in homepage (pitch demo)

A redesigned homepage for [Fixcar.in](https://www.fixcar.in), a doorstep multi-brand car service in Dehradun. Its one job: a car owner on a phone books on WhatsApp or calls in under 30 seconds, and trusts Fixcar.in on the way.

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Motion, GSAP with ScrollTrigger, and Lenis. Built to deploy on Vercel.

## Quick start

Needs Node.js 20.9 or later.

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build
npm run start -- -p 3100     # production build on http://localhost:3100
```

### Testing on a phone

Open the "Network" address that `npm run dev` prints (for example `http://192.168.1.20:3000`) on a phone on the same Wi-Fi. `next.config.ts` allows private LAN addresses through `allowedDevOrigins`; without it Next.js 16 serves the page but blocks its scripts, so the menu and the animations do nothing. For a true feel of the motion, test the production build instead (`npm run build && npm run start`, same address): dev mode is unminified and much slower on a phone. Windows may ask once to let Node.js through the firewall.

Phones get a lighter motion set than desktop on purpose: native scrolling instead of Lenis, a swipeable services rail instead of the pinned one, and a vertical process line instead of the pinned route. The hero load, parallax, founder reveal, checklist ticks, odometer, footer wipe, menu and booking sheet all run on phones.

## Where things live

```
src/content/site.ts        every word, number, link, area, brand, review, FAQ and post on the page
src/content/images.ts      static imports of the photos in public/images
src/app/                   layout (fonts, metadata, boot script), page, OG image, icons, robots, sitemap
src/components/sections/   the homepage sections, in page order
src/components/layout/     nav and mobile menu, footer, intro shutter, WhatsApp button, smooth scroll
src/components/booking/    the WhatsApp booking composer and its sheet
src/components/motion/     GSAP motion modules, loaded on idle (never in first-load JavaScript)
src/lib/                   WhatsApp links, scroll helpers, GSAP registry, JSON-LD, env
scripts/                   asset generators and QA scripts
docs/                      plan, progress, design system, content, assets, pitch notes
```

## Editing content

All copy lives in `src/content/site.ts`; components never hard-code text, numbers or links. Keep the house style: sentence case, Indian English, no em or en dashes, no ALL CAPS, buttons that say what happens ("Book on WhatsApp", "Call 81682 11587"). `docs/CONTENT.md` shows the client's original wording next to every edit. Counts such as "43 localities" are derived from the data, so adding an area to `areas` updates them.

Open questions for the client are listed in `clientTodos` in the same file and in `docs/PITCH_NOTES.md`.

## Swapping photos

Overwrite a file in `public/images/` with a photo of the same name and aspect ratio, then rebuild. Blur placeholders and sizes are generated at build time. The manifest, sizes and a shot list with prompts are in [`docs/ASSETS.md`](docs/ASSETS.md). After swapping, run `npm run qa:js` to check the hero stays under 180 KB.

## Environment variables

| Variable | Default | What it does |
|---|---|---|
| `NEXT_PUBLIC_NOINDEX` | `true` (anything except `"false"`) | Hides the demo from search engines: `robots.txt` disallows everything, a `noindex, nofollow` meta tag and an `X-Robots-Tag` header. Set to `false` only when this replaces the live site. |
| `NEXT_PUBLIC_SITE_URL` | Vercel production URL, else `https://www.fixcar.in` | Base for the canonical URL, Open Graph image and sitemap. |

Both are read at build time, so redeploy after changing them. Vercel sets `VERCEL` and `VERCEL_PROJECT_PRODUCTION_URL` itself; Vercel Analytics and Speed Insights only load on Vercel. See `.env.example`.

## Pitch preview switches

- `?accent=blue` swaps the racing-green accent for a deepened Fixcar blue, to discuss the logo colour.
- The intro shutter plays once per browser session (open a private window to replay it). It never plays with reduced motion.

## Deploying to Vercel

Dashboard:

1. Push this repository to GitHub (a private repository is fine).
2. In Vercel, choose **Add New**, then **Project**, and import the repository. The framework preset is detected as Next.js; keep the default build settings.
3. Under **Environment Variables**, add `NEXT_PUBLIC_NOINDEX` = `true`. Leave `NEXT_PUBLIC_SITE_URL` unset for the demo.
4. Click **Deploy**. Every push to the main branch redeploys; other branches get preview URLs.
5. Optional: in the project, open **Analytics** and **Speed Insights** and enable them to collect real-visitor data.

CLI (`npm i -g vercel`):

```bash
vercel login
vercel link                                  # once, creates the project
vercel env add NEXT_PUBLIC_NOINDEX production   # enter: true
vercel --prod
```

When it replaces the live site: set `NEXT_PUBLIC_NOINDEX=false` and `NEXT_PUBLIC_SITE_URL=https://www.fixcar.in`, add the domain under **Settings**, then **Domains**, and follow the launch checklist in `docs/PITCH_NOTES.md` (redirects, analytics, listings). A business site needs a Vercel Pro plan.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run check:contrast      # every text and control colour pair against WCAG AA
```

The QA scripts use the installed Chrome through Playwright and run against the production build on port 3100 (port 3000 may be taken by another app):

```bash
npm run build && npm run start -- -p 3100
npm run qa:menu             # mobile menu and booking sheet: focus, inert, scroll lock, rapid taps, frame timing
npm run qa:a11y             # axe (WCAG 2.2 AA) plus console errors, phone and desktop, with and without reduced motion
npm run qa:shots            # screenshots of every section at 390, 768, 1440 and 1920 px, into qa/screens
npm run qa:js               # first-load JavaScript (gzip) and hero image bytes
npm run qa:lighthouse       # Lighthouse mobile and desktop, median of three runs
```

Vercel serves over HTTP/2, while `next start` is HTTP/1.1, which Lighthouse's simulation treats as six cold connections (it overstates LCP by about a second). For PageSpeed-like numbers, run Lighthouse through the local HTTP/2 proxy:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout qa/certs/key.pem -out qa/certs/cert.pem \
  -days 30 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
npm run qa:h2                                         # https://localhost:3443
QA_URL=https://localhost:3443 npm run qa:lighthouse
```

Add `-- --seo` to require SEO 100 (only meaningful on a build made with `NEXT_PUBLIC_NOINDEX=false`).

## Budgets and latest results

Measured on the production build over HTTP/2, placeholder photos, 9 October 2026.

| Budget | Target | Mobile | Desktop |
|---|---|---|---|
| Lighthouse Performance | 95 or more | 96 | 100 |
| Accessibility / Best practices | 100 / 100 | 100 / 100 | 100 / 100 |
| SEO (indexing on) | | 100 | 100 |
| Largest contentful paint | 2.0 s or less | 2.8 s (simulated, see below) | 0.6 s |
| Total blocking time | 150 ms or less | 59 ms | 0 ms |
| Cumulative layout shift | 0.03 or less | 0 | 0 |
| First-load JavaScript | about 180 KB gzip | 172 KB gzip (149 KB brotli) | |
| Hero image | 180 KB or less | 7 to 13 KB (placeholder) | |

Mobile LCP misses its budget in Lighthouse's simulation, which counts all of Next.js's start-up JavaScript as blocking the hero photo. In real loads with a 4x CPU slowdown the hero paints in about 0.2 s. Check real visitors in Vercel Speed Insights.

## Docs

- [`docs/PLAN.md`](docs/PLAN.md): the approved plan (scope, decisions, budgets)
- [`docs/PROGRESS.md`](docs/PROGRESS.md): what was done, phase by phase, and the decision log
- [`docs/DESIGN.md`](docs/DESIGN.md): tokens, type, components and their states, motion, do's and don'ts
- [`docs/CONTENT.md`](docs/CONTENT.md): original wording beside the edited copy, SEO intent map, URLs to keep
- [`docs/ASSETS.md`](docs/ASSETS.md): photo manifest, shot list, brand assets, fonts
- [`docs/PITCH_NOTES.md`](docs/PITCH_NOTES.md): before and after, client questions, recommendations, launch checklist
- [`CLAUDE.md`](CLAUDE.md): working conventions for this codebase
