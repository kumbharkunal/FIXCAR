# DESIGN.md: Fixcar.in

> The garage that comes to your gate. Lime-washed walls, racing-green shutters, morning haze over the Doon valley, and a mechanic's job card. Calm, specific, fast.

## 1. Visual theme and atmosphere

**Style:** Doon Morning. Editorial, photography-led, light only.
**Keywords:** limewash, racing green, morning haze, workshop vernacular, expanded grotesque, editorial grid, calm confidence, local.
**Tone:** premium and plain, NOT luxury-glossy, NOT tech, NOT a template.
**Feel:** a well-kept Dalanwala bungalow at 8 am, a technician kneeling at the front wheel, the job card filled in neatly.

**Interaction tier:** L3 for exactly two places (the hero and the doorstep route); L2 everywhere else.
**Dependencies:** GSAP 3.15 (ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin) + `@gsap/react`, Motion 14 (`LazyMotion`, `m`, `domMax`), Lenis 1.3 (desktop only). The hero load is pure CSS.

Signature moments (spend boldness here only):
1. **Hero:** the rolling-shutter reveal and the headline that "accelerates" from condensed to expanded width.
2. **The route:** the technician's route draws from the Dalanwala workshop to your gate while a car glyph drives along it.

The recurring motif is **the line**: the long crossbar of the client's own wordmark becomes the route in the process section and draws across the footer wordmark.

## 2. Colour palette and roles

```css
:root {
  /* Surfaces */
  --color-limewash: #F2EBDD;      /* page background */
  --color-paper: #FAF6EE;         /* raised surfaces, sheets, glass tint, inputs */
  --color-racing: #1F4532;        /* the single accent: primary buttons, active states, focus, CTA band, footer */
  --color-racing-hover: #24503A;
  --color-racing-press: #183828;

  /* Text */
  --color-ink: #1B2620;           /* text, ghost-button outline */
  --color-stone: #5D5A50;         /* secondary text, input borders */

  /* Lines */
  --color-hairline: rgb(27 38 32 / 0.12);  /* dividers only, never a control boundary */

  /* RGB helpers for rgb(var(--x) / alpha) */
  --rgb-limewash: 242 235 221;
  --rgb-paper: 250 246 238;
  --rgb-ink: 27 38 32;
  --rgb-racing: 31 69 50;

  /* Brand marks (inside their official logos only) */
  --color-whatsapp: #25D366;
  --color-facebook: #0866FF;
}

/* Pitch preview: ?accent=blue swaps the accent to a deepened Fixcar blue. */
:root[data-accent="blue"] {
  --color-racing: #0E4C80;
  --color-racing-hover: #13599A;
  --color-racing-press: #0B3E69;
  --rgb-racing: 14 76 128;
}
```

| Pair | Ratio | Use |
|---|---|---|
| ink on limewash | 13.16:1 | body and headings |
| ink on paper | 14.49:1 | sheets, job card |
| stone on limewash / paper | 5.82 / 6.40:1 | secondary text, captions, input borders (≥ 3:1) |
| racing on limewash / paper | 9.05 / 9.96:1 | links, focus ring, odometer |
| limewash on racing | 9.05:1 | primary buttons, CTA band, footer |
| limewash on racing-hover / press | 7.75 / 10.83:1 | button states |
| ink on glass over black (worst case) | 5.49:1 | nav over the hero photo |
| limewash on racing 80% over a light photo (worst case) | 5.77:1 | final CTA band |
| ink on racing | **1.45:1** | **never** |
| hairline on limewash | 1.26:1 | decorative only |
| blue preview #0E4C80 with limewash | 7.49:1 | `?accent=blue` |

`scripts/contrast.mjs` recomputes this table and fails the build check if any pair drops below its threshold.

**Colour rules**
- Components reference tokens only. No raw hex in components.
- One accent. Racing green is the only chromatic UI colour. WhatsApp green, Facebook blue and the Instagram gradient appear only inside their official logos.
- Never set ink text on racing. On racing surfaces text is limewash or paper.
- The logo is one colour: ink on light surfaces, limewash on racing. The original blue logo stays in `public/brand/` for reference.

## 3. Typography rules

**Font:** Archivo variable (width 62 to 125, weight 100 to 900), self-hosted through `next/font/local` as a subset of the characters the site uses (`npm run assets:font` fetches it from Google Fonts):

```ts
import localFont from "next/font/local";
const archivo = localFont({
  src: "./fonts/archivo-subset.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
```

```css
--font-sans: var(--font-archivo), "Arial", ui-sans-serif, system-ui, sans-serif;
```

One woff2 file (60.8 KB: printable ASCII plus © ‘ ’ “ ” … × ₹ and the non-breaking space), preloaded through a `Link` header. The `font-stretch` range in `declarations` is what lets `font-stretch` drive the width axis. Digits are tabular with `font-variant-numeric: tabular-nums`.

| Role | Size | Weight | Width | Line height | Tracking |
|---|---|---|---|---|---|
| Hero h1 (< 1024) | `clamp(2.625rem, 11.2vw, 4.5rem)`, 4 locked lines | 800 | 100% (animates from 75%) | 0.95 | -0.02em |
| Hero h1 (≥ 1024) | `min(6.6vw, 6.25rem)`, 2 locked lines | 800 | 112% (animates from 75%) | 0.95 | -0.02em |
| Display L (h2) | `clamp(2.25rem, 1.5rem + 3.2vw, 4.5rem)` | 750 | 112% | 1.0 | -0.015em |
| Display M (h3) | `clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)` | 700 | 106% | 1.1 | -0.01em |
| Pull quote | `clamp(1.625rem, 1.2rem + 1.75vw, 3rem)` | 500 | 100% | 1.15 | -0.01em |
| Lead | `clamp(1.1875rem, 1.1rem + 0.35vw, 1.375rem)` | 400 | 100% | 1.45 | 0 |
| Body | `1.0625rem` | 400 | 100% | 1.6 | 0 |
| Small / caption | `0.9375rem` | 500 | 100% | 1.45 | 0 |
| UI (nav, buttons, inputs) | `1rem` | 600 | 100% | 1 | 0 |
| Odometer numeral | `clamp(4rem, 2.5rem + 6.5vw, 9rem)` | 800 | 125% | 1 | -0.02em |

```css
@utility type-display-l { font-size: clamp(2.25rem, 1.5rem + 3.2vw, 4.5rem); line-height: 1; letter-spacing: -0.015em; font-weight: 750; font-stretch: 112%; text-wrap: balance; }
@utility type-display-m { font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem); line-height: 1.1; letter-spacing: -0.01em; font-weight: 700; font-stretch: 106%; text-wrap: balance; }
@utility type-quote { font-size: clamp(1.625rem, 1.2rem + 1.75vw, 3rem); line-height: 1.15; letter-spacing: -0.01em; font-weight: 500; text-wrap: balance; }
@utility type-lead { font-size: clamp(1.1875rem, 1.1rem + 0.35vw, 1.375rem); line-height: 1.45; text-wrap: pretty; }
@utility type-body { font-size: 1.0625rem; line-height: 1.6; text-wrap: pretty; }
@utility type-small { font-size: 0.9375rem; line-height: 1.45; font-weight: 500; }
@utility type-numeral { font-size: clamp(4rem, 2.5rem + 6.5vw, 9rem); line-height: 1; letter-spacing: -0.02em; font-weight: 800; font-stretch: 125%; font-variant-numeric: tabular-nums; }
```

**Typography rules**
- Sentence case everywhere. No ALL CAPS labels, no eyebrows, no monospace.
- Never accent a single word in a headline (no italic, colour or weight change on one word).
- Body text ≤ 65ch. Headings use `text-wrap: balance`, body uses `pretty`.
- The width axis animates only in the hero. Everything else uses static widths.
- Minimum body size 17 px; inputs 16 px or more (prevents iOS zoom).
- **NEVER use:** Inter, Roboto, Arial as a visible face, any serif, any monospace, Syncopate, Space Grotesk.

**Text decoration:** no gradients, no text shadows, no outlined text. Hierarchy comes from size, width and weight only.

## 4. Component stylings

### Buttons
```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.625rem;
  min-height: 3rem; padding-inline: 1.5rem;
  border-radius: 999px;
  font: 600 1rem/1 var(--font-sans); font-stretch: 100%;
  white-space: nowrap; text-decoration: none;
  touch-action: manipulation; -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s var(--ease-out-expo), color 0.2s var(--ease-out-expo),
    box-shadow 0.2s var(--ease-out-expo), transform 0.2s var(--ease-out-expo);
}
.btn:active { transform: scale(0.98); }
.btn:focus-visible { outline: 2px solid var(--color-racing); outline-offset: 3px; }
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.45; pointer-events: none; }

.btn-primary { background: var(--color-racing); color: var(--color-limewash); }
.btn-primary:hover { background: var(--color-racing-hover); }
.btn-primary:active { background: var(--color-racing-press); }

.btn-ghost { background: transparent; color: var(--color-ink); box-shadow: inset 0 0 0 1.5px var(--color-ink); }
.btn-ghost:hover { background: rgb(var(--rgb-ink) / 0.06); }
.btn-ghost:active { background: rgb(var(--rgb-ink) / 0.1); }

/* On racing surfaces (final CTA, footer) */
.surface-racing .btn-primary { background: var(--color-limewash); color: var(--color-racing); }
.surface-racing .btn-primary:hover { background: var(--color-paper); }
.surface-racing .btn-ghost { color: var(--color-limewash); box-shadow: inset 0 0 0 1.5px var(--color-limewash); }
.surface-racing .btn-ghost:hover { background: rgb(var(--rgb-limewash) / 0.1); }
.surface-racing :focus-visible { outline-color: var(--color-limewash); }
```
- The primary WhatsApp button carries the official WhatsApp logo (24 px) at its start. No arrows on any button.
- One label per intent: booking is always "Book…" ("Book on WhatsApp", "Book", "Book this service", "Book for {area}"); calling is always "Call 81682 11587".

### Navigation pill (desktop) and glass
```css
.glass {
  background: rgb(var(--rgb-paper) / 0.62);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.55), 0 0 0 1px rgb(var(--rgb-ink) / 0.08), 0 8px 30px rgb(var(--rgb-ink) / 0.08);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass { background: rgb(var(--rgb-paper) / 0.94); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: rgb(var(--rgb-paper) / 0.96); -webkit-backdrop-filter: none; backdrop-filter: none; }
}

.nav-pill { height: 4rem; max-width: 57.5rem; border-radius: 999px; display: flex; align-items: center; gap: 0.25rem; padding-inline: 1.25rem 0.5rem; }
.nav-pill[data-glass="false"] { background: transparent; box-shadow: none; -webkit-backdrop-filter: none; backdrop-filter: none; }
.nav-link { position: relative; display: inline-flex; align-items: center; min-height: 2.75rem; padding-inline: 0.875rem; border-radius: 999px; color: var(--color-stone); font: 600 0.9375rem/1 var(--font-sans); transition: color 0.2s var(--ease-out-expo); }
.nav-link:hover, .nav-link[aria-current="location"] { color: var(--color-ink); }
.nav-link:focus-visible { outline: 2px solid var(--color-racing); outline-offset: 2px; }
.nav-active { position: absolute; inset: 0; z-index: -1; border-radius: 999px; background: rgb(var(--rgb-racing) / 0.1); }
```
States: transparent at the hero top (desktop only), glass after 24 px of scroll, hidden (translateY -120%) when scrolling down past the hero, shown on any upward scroll, never hidden while focus is inside or a sheet is open.

### Mobile menu sheet
```css
.menu-sheet { position: fixed; inset: 0.75rem 0.75rem auto; max-height: calc(100svh - 1.5rem); border-radius: 28px; overflow: auto; overscroll-behavior: contain; }
.menu-link { display: flex; align-items: center; min-height: 3.5rem; font-size: clamp(1.75rem, 7vw, 2.25rem); font-weight: 700; font-stretch: 106%; color: var(--color-ink); }
.menu-link[aria-current="location"] { color: var(--color-racing); }
.menu-backdrop { position: fixed; inset: 0; background: rgb(var(--rgb-ink) / 0.24); }
```
The closed pill and the open sheet are the same element (Motion layout animation, radius set through `style`).

### Inputs, selects, segmented choice
```css
.field { display: grid; gap: 0.5rem; }
.field-label { font: 500 0.9375rem/1.2 var(--font-sans); color: var(--color-ink); }
.input {
  appearance: none; width: 100%; min-height: 3rem; padding-inline: 1.125rem;
  border-radius: 999px; border: 1px solid var(--color-stone);
  background: var(--color-paper); color: var(--color-ink);
  font: 400 1rem/1.2 var(--font-sans);
  transition: border-color 0.2s var(--ease-out-expo);
}
.input:hover { border-color: var(--color-ink); }
.input:focus-visible { outline: 2px solid var(--color-racing); outline-offset: 2px; border-color: var(--color-racing); }
.input:disabled { opacity: 0.5; }
.input::placeholder { color: var(--color-stone); }
select.input { padding-inline-end: 2.75rem; }  /* a Phosphor CaretDown sits in the end padding */

.segment { display: inline-flex; gap: 0.25rem; padding: 0.25rem; border-radius: 999px; box-shadow: inset 0 0 0 1px var(--color-stone); }
.segment label { min-height: 2.5rem; padding-inline: 1rem; display: inline-flex; align-items: center; border-radius: 999px; cursor: pointer; }
.segment input:checked + label { background: var(--color-racing); color: var(--color-limewash); }
.segment input:focus-visible + label { outline: 2px solid var(--color-racing); outline-offset: 2px; }
```
Labels sit above inputs; helper text sits below. No placeholder-as-label. The area field uses a native `<datalist>`; service and brand use native `<select>` (OS pickers on phones).

### Booking composer bar (desktop hero) and booking sheet
- **Bar:** a glass pill, about 72 px tall, with inline selects separated by hairlines and a primary "Book on WhatsApp" at the end. It sits on the limewash above the photo.
- **Sheet:** paper, radius 28 px, with the sheet shadow.
  - Mobile: it slides up from the bottom, drag to dismiss, max height `calc(100dvh - 1.5rem)`, bottom padding `env(safe-area-inset-bottom)`.
  - Desktop: a centred dialog, max width 32rem.
- **Message preview:** a paper block in `type-small`, labelled "Your WhatsApp message".

### Photo frames and captions
```css
.frame { position: relative; overflow: hidden; border-radius: 28px; background: var(--color-paper); isolation: isolate; }
.frame > img { width: 100%; height: 100%; object-fit: cover; }
.caption { margin-top: 0.75rem; max-width: 60ch; font: 500 0.9375rem/1.45 var(--font-sans); color: var(--color-stone); }
```
- Nothing is ever overlaid on a photo. Captions go below.
- Full-bleed photos have no radius.

### Chips (non-interactive service list)
```css
.chip { display: inline-flex; align-items: center; min-height: 2.5rem; padding-inline: 1rem; border-radius: 999px; background: var(--color-paper); box-shadow: inset 0 0 0 1px var(--color-hairline); font: 500 0.9375rem/1 var(--font-sans); color: var(--color-ink); }
```

### Job card (checklist)
```css
.job-card { background: var(--color-paper); border-radius: 28px; padding: clamp(1.5rem, 3vw, 2.5rem); box-shadow: 0 0 0 1px var(--color-hairline); }
.job-row { display: grid; grid-template-columns: 1.75rem 1fr; gap: 0.875rem; padding-block: 1rem; border-bottom: 1px solid var(--color-hairline); }
.job-box { width: 1.5rem; height: 1.5rem; box-shadow: inset 0 0 0 1.5px var(--color-ink); }   /* square, like a printed form */
.job-tick { stroke: var(--color-racing); stroke-width: 2.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
```

### Odometer
```css
.odo { display: inline-flex; font-variant-numeric: tabular-nums; }
.odo-digit { display: inline-block; height: 1em; overflow: clip; }
.odo-strip { display: flex; flex-direction: column; }   /* 0 to 9 stacked, translated by GSAP */
```
The server renders the final digits. Screen readers get the number once (the wheels are `aria-hidden`).

### Accordion (FAQ)
```css
.faq-item { border-bottom: 1px solid var(--color-hairline); }
.faq-item > summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 3.5rem; padding-block: 1.25rem; cursor: pointer; font: 700 clamp(1.125rem, 1rem + 0.5vw, 1.375rem)/1.3 var(--font-sans); font-stretch: 104%; }
.faq-item > summary::-webkit-details-marker { display: none; }
.faq-item > summary:hover { color: var(--color-racing); }
.faq-item > summary:focus-visible { outline: 2px solid var(--color-racing); outline-offset: 4px; }
.faq-item[open] .faq-caret { transform: rotate(45deg); }
.faq-item::details-content { block-size: 0; overflow: clip; transition: block-size 0.45s var(--ease-out-expo), content-visibility 0.45s allow-discrete; }
.faq-item[open]::details-content { block-size: auto; }
:root { interpolate-size: allow-keywords; }
```
Native `<details name="faq">` makes it exclusive (one open at a time) with correct semantics and no JavaScript.

### Links
```css
.link { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; text-decoration-color: rgb(var(--rgb-ink) / 0.4); transition: text-decoration-color 0.2s var(--ease-out-expo); }
.link:hover { text-decoration-color: currentColor; }
.link:focus-visible { outline: 2px solid var(--color-racing); outline-offset: 2px; }
```

### Icon buttons (menu toggle, carousel arrows, marquee pause, sheet close)
```css
.icon-btn { display: inline-grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 999px; color: var(--color-ink); box-shadow: inset 0 0 0 1.5px var(--color-ink); transition: background-color 0.2s var(--ease-out-expo); }
.icon-btn:hover { background: rgb(var(--rgb-ink) / 0.06); }
.icon-btn:active { transform: scale(0.96); }
.icon-btn:focus-visible { outline: 2px solid var(--color-racing); outline-offset: 2px; }
.icon-btn:disabled { opacity: 0.35; }
```

### Floating WhatsApp button
```css
.fab { position: fixed; z-index: 40; right: max(1rem, env(safe-area-inset-right)); bottom: calc(1rem + env(safe-area-inset-bottom)); width: 3.5rem; height: 3.5rem; border-radius: 999px; display: grid; place-items: center; }
```
A glass circle holding the official WhatsApp logo (32 px). It appears after the hero and hides over the final CTA, the footer and open sheets.

### Social logos
Official marks, unmodified colours, at least 24 px, inside a 44 px hit area with 8 px clear space, each with an accessible name ("Fixcar.in on Instagram").

## 5. Layout principles

```css
:root { --gutter: clamp(1rem, 4vw, 3.5rem); }
.container-x { width: 100%; max-width: calc(85rem + 2 * var(--gutter)); margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: clamp(4.5rem, 10vw, 10rem); scroll-margin-top: 6rem; }
.grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 1.5rem; }
html { scroll-padding-top: 6rem; scroll-padding-bottom: 6rem; }
```
- **Container:** max content width 1360 px (85rem). Side gutter 16 px on phones, up to 56 px on desktop.
- **Spacing scale (4 px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Section padding 72 to 160 px.
- **Grid:** 12 columns with 24 px gutters from 1024 px; a single column below 768 px; tablets use 6 or 8 columns where helpful.
- **Alignment:** left-aligned type throughout. Nothing centred except the intro wordmark.
- **Radius:** 999 px for nav, buttons, chips, inputs and the FAB; 28 px for photo frames, sheets and the job card. Nothing else.
- **Layout families:** each section uses a different one (stack, marquee band, pinned track, route diagram, editorial split, card plus photo, odometer strip, single quote, search plus grid, sticky title plus accordion, asymmetric list, full-bleed band).

## 6. Depth and elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | none | sections, photos, chips |
| Hairline | `0 0 0 1px var(--color-hairline)` | job card edge, chips |
| Glass | the `.glass` recipe above | nav pill, menu sheet, FAB, hero composer bar |
| Sheet | `0 24px 64px rgb(var(--rgb-ink) / 0.16)` | menu sheet, booking sheet |

No card shadows anywhere else. Shadows are tinted with ink, never black.

**z-index scale:** content 0, FAB 40, nav 50, backdrop 60, sheet 70, intro 100, skip link 110.

## 7. Animation and interaction

**Motion philosophy:** one orchestrated moment (the hero load). Everything else answers scroll or a person's action, and each animation says something specific to its content: the shutter, the route, the job-card ticks, the odometer. Motion explains; it does not decorate.

**Tier:** L3 for the hero and the route; L2 elsewhere.

### Tokens
```css
@theme {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-shutter: cubic-bezier(0.7, 0, 0.2, 1);
}
:root { --dur-1: 0.2s; --dur-2: 0.45s; --dur-3: 0.8s; --dur-4: 1.2s; }
```
- **GSAP:** `expo.out` for reveals; `none` or `power2.inOut` for scrubs.
- **Motion springs:** UI `{ stiffness: 420, damping: 38 }`; sheet `{ stiffness: 380, damping: 36 }`; magnetic `{ stiffness: 450, damping: 40 }`.

### Base setup (desktop smooth scroll, after GSAP has loaded)
```ts
const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on("scroll", ScrollTrigger.update);
ScrollTrigger.config({ ignoreMobileResize: true });
```
- **Where Lenis runs:** only on `(hover: hover) and (pointer: fine)` without reduced motion. Touch devices keep native scroll.
- **Sheets:** Lenis stops while any sheet is open.
- **CSS smooth scrolling:** `scroll-behavior: smooth` applies only without Lenis.

### Entrance (hero, pure CSS, first-paint safe)
```css
@keyframes shutter-up { to { transform: translateY(-101%); } }
@keyframes hero-rise { from { transform: translateY(105%); } to { transform: none; } }
@keyframes hero-accelerate { from { font-stretch: 75%; } to { font-stretch: var(--hero-stretch); } }
@keyframes hero-settle { from { transform: scale(1.06); } to { transform: none; } }
@keyframes hero-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

:root { --hero-delay: 0.55s; }                 /* first visit: starts as the shutter passes */
:root[data-intro="skip"] { --hero-delay: 0.1s; }

.intro { position: fixed; inset: 0; z-index: 100; background: var(--color-racing); animation: shutter-up 0.8s var(--ease-shutter) 0.25s both; pointer-events: none; }
:root[data-intro="skip"] .intro { display: none; }
.hero-line > span { display: block; animation: hero-rise 0.9s var(--ease-out-expo) calc(var(--hero-delay) + var(--i) * 0.08s) both; }
.fonts-ready .hero-title { animation: hero-accelerate 1.2s var(--ease-out-expo) var(--hero-delay) both; }
.hero-photo { animation: hero-settle 1.6s var(--ease-out-expo) var(--hero-delay) both; }
.hero-fade { animation: hero-fade 0.6s var(--ease-out-expo) calc(var(--hero-delay) + 0.35s + var(--i) * 0.06s) both; }
```
- **The photo is never clipped or hidden.** The intro shutter is a sibling overlay, so the hero image paints at first paint and LCP is unaffected.
- **No reflow:** each h1 line is a locked `nowrap` block, so the width animation never re-wraps text.
- **Font gating:** a small head script adds `fonts-ready` only if Archivo loads within 1 s; otherwise the width animation is skipped.

### Scroll behaviour
| Section | What happens |
|---|---|
| Hero | Photo parallax (yPercent to -10 inside the frame) and the headline drifts up 40 px; scrubbed. |
| Brands | CSS loop; GSAP `quickTo` skews the wrapper (±6°) with scroll velocity on desktop. A pause button stops it. |
| Services | **Desktop:** the section pins and the track translates on a scrub; the index highlights via `containerAnimation`. **Touch:** native scroll-snap with a progress line. |
| Process | The route draws (DrawSVG) and the car follows it (MotionPath). Steps activate on arrival. Pinned on desktop; scrubbed without a pin on mobile. |
| Founder | The photo unmasks like a shutter (clip-path) and the statement lines rise through masks (SplitText `autoSplit` + `onSplit`). |
| Checklist | Each tick draws as its row enters (`ScrollTrigger.batch` + DrawSVG). |
| Odometer | The digit wheels roll once to their values. |
| Footer | The wordmark's bar draws and the letters rise, on a scrub. |

**Rule:** the server renders final states. JS resets only off-screen elements before animating them, so nothing flashes and everything works without JavaScript.

### Hover and focus
- Every interactive element has hover, active (scale 0.98), focus-visible (2 px racing ring with offset, limewash on racing surfaces) and disabled states.
- Hover changes colour, never layout.
- Magnetic pull (≤ 6 px) only on the final CTA buttons, only for fine pointers.

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  .intro { display: none; }
  .hero-line > span, .hero-title, .hero-photo, .hero-fade { animation: none !important; }
  .marquee-track { animation: none; }
  .faq-item::details-content { transition: none; }
  *, *::before, *::after { scroll-behavior: auto !important; }
}
```
- **GSAP:** `gsap.matchMedia()` has a `(prefers-reduced-motion: reduce)` branch that leaves everything in its final state (route drawn, ticks drawn, final digits, no pins).
- **Motion:** components use `useReducedMotion()` for instant open and close with a 150 ms opacity fade.
- **Lenis:** not created.

## 8. Do's and don'ts

### Do
- Lead with real Fixcar.in content and Dehradun specifics in every section.
- Keep the photo the protagonist; put captions below photos.
- Use one accent (racing green) and the two radii (pill, 28 px).
- Give every animation a reduced-motion version and a reason you can say in one sentence.
- Keep booking reachable in one tap from anywhere (nav "Book", hero, FAB, final CTA).
- Measure: Lighthouse, first-load JS, hero bytes, contrast script.

### Don't
- ❌ No eyebrow labels, ALL CAPS labels, monospace labels or "A · B · C" meta strings.
- ❌ No em or en dashes in site copy; no "→" on buttons or links.
- ❌ No accenting a single word in a headline.
- ❌ No three-equal-card rows, gradient blobs, mesh gradients, purple, or fake UI built from divs.
- ❌ No pills, tags or labels on photos; no scroll cues; no decorative status dots.
- ❌ No numbered markers except the doorstep process.
- ❌ No stock clichés: handshakes, thumbs-up mechanics, generic skylines; no car badges or number plates in photos.
- ❌ No `window.addEventListener('scroll')`; no animating width, height, top or left (exceptions: the hero font-stretch moment and the FAQ height).
- ❌ No two libraries animating the same property on the same element.
- ❌ No ink text on racing green; no hairline as a control border.
- ❌ No invented facts, prices, warranties, counts or reviews.
- ❌ No third-party embeds on load (maps and social are links).

## 9. Responsive behaviour

| Name | Width | Key changes |
|---|---|---|
| Phone | < 768 | Single column, 16 px gutters. Mobile nav pill and menu sheet. Photo-led hero with haze, 4-line headline. Services as a native swipe row. Vertical route. Booking as a bottom sheet. |
| Tablet | 768 to 1023 | Still the mobile nav and swipe patterns (touch). Two-column grids where content allows (coverage list, journal). |
| Desktop | ≥ 1024 | Floating nav pill with links. Type-led hero, 2-line headline, inline composer bar. Pinned services and route. Lenis on fine pointers. |
| Wide | ≥ 1440 | Container caps at 1360 px; type caps at its clamp maximum. |

- **Touch targets:** minimum 44 × 44 px (buttons are 48 px tall).
- **Viewport units:** `100svh` for the hero (fits under the browser bars), `100dvh` for sheets, `env(safe-area-inset-*)` for the nav, FAB and sheets.
- **Short screens:** under 700 px tall, the hero photo shrinks first (minimum 140 px) and the headline steps down one size so the primary CTA stays above the fold.
- **No horizontal overflow at any width:** `overflow-x: clip` on `body` as a safety net, but every section is built not to need it.

```css
@media (max-width: 767px) { .grid-12 { grid-template-columns: minmax(0, 1fr); } }
@media (max-height: 700px) and (max-width: 1023px) { .hero-photo-wrap { min-height: 140px; } .hero-title { font-size: clamp(2.375rem, 10vw, 3rem); } }
body { overflow-x: clip; }
```
