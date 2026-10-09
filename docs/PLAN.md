> Approved on 9 October 2026. This is the source of truth for scope; progress lives in docs/PROGRESS.md.

# Fixcar.in homepage redesign: pitch demo plan

## Context

Fixcar.in is a doorstep, multi-brand car service in Dehradun (workshop in Dalanwala) whose Wix site is slow and generic. On mobile PageSpeed it scores 61, with LCP 5.4 s. It also uses stock imagery, scrolls sideways on desktop and offers no instant booking. You are pitching a redesigned homepage as a demo: award-level, photography-led, mobile-first, deployable on Vercel. The page's one job is to let a Dehradun car owner on a phone book through WhatsApp or a call in under 30 seconds, and to earn trust on the way. The project folder is empty (greenfield). This plan covers research findings, the design system, every section, motion, architecture, budgets, assets, copy, risks and the build phases.

---

## 1. Research summary

### Verified facts (live pages, all 10 blog posts, listings, Google)
| Fact | Finding | Source |
|---|---|---|
| Name styling | The logo is lowercase **"fixcar.in"**. Body copy and titles use **"Fixcar.in"**; "FixCar" appears once. **Decision: "Fixcar.in" in all copy, wordmark as the logo.** | home, about, logo |
| Story | "It is first female owned Automobile startup of Uttarakhand." | /about-fixcar |
| Founded | "serving the community since 2022" | Sulekha |
| Address | 14/1 Laxmi Road, near Kidzee School, Dalanwala, Dehradun, Uttarakhand **248001** | site, Google, Sulekha, JustPing |
| Contact | +91 81682 11587, fixcar.in@gmail.com, Instagram @fixcar.in (linked from site) | site |
| Google profile | "Fixcar.in \| Doorstep Car Service \| Best Car Mechanics in Dehradun", **4.8 from 61 Google reviews** (8 Oct 2026), "car repair and maintenance service", on-site services. Place ID `ChIJwbl4SmArCTkRhdz7hN_e-U4`, CID `5690824655749504133` | Google search panel |
| Hours | Google: "closes 7 pm"; Sulekha: "opens 09:30 AM"; Carchhe (old GBP scrape): 9:30 am–7 pm, **Mon and Wed closed** (suspicious) | hidden, client TODO |
| Facebook | None found. `facebook.com/fixcarsin` is unverified, likely another business | fallback link + TODO |
| Second Instagram | @fixcar.in_dehradun, with a matching bio | confirm which is primary |
| Listings | JustDial, Sulekha (verified), IndiaMART /fixcar, Carchhe, Magicpin, JustPing | sameAs candidates |
| Areas | 43 unique localities: home (29) and contact (43) merged. "EC Road" is the same as "East Canal Road"; Turner Road appears only on home | site.ts |
| Brands | 17. Ford appears only in the FAQ and footer strip | site.ts |
| Why-choose (8) | Live wording is **"Certified & Experienced Technicians"** (not "trained"), Genuine Spare Parts & Premium Engine Oils, Transparent & Affordable Pricing, Doorstep Car Service Across Dehradun, Multi-Brand Car Service Specialists, Advanced Computer Diagnostics, Quick Turnaround Time, Trusted by Hundreds of Local Car Owners | home |
| FAQs | 3 on home + 3 on contact (merged to 4) + 3 from the blog | see §9 |
| Blog | 10 posts, 22 Mar to 31 Jul 2026, **all bylined "Siddharth Kapoor"**. Latest 3: "7 Warning Signs Your Car Needs Servicing" (31 Jul 2026, 5 min); "Best Car Garage in Dehradun…" (17 Apr, 2 min); "Best Car Service in Dehradun…" (17 Apr, 2 min) | sitemap + posts |
| Blog facts used | oil change 30–60 min; oil every 5,000–10,000 km or 6 months, sooner in the city; service every 10,000 km/6 months, 7,000–8,000 km in heavy traffic, about 7,000 km on Uttarakhand hill roads; "pickup and drop is available"; independent, not tied to authorised centres | posts |
| Not used | The blog's generic cost ranges (₹1,500–5,000): these aren't FixCar prices | posts |
| Logo | Header/footer PNG is 887×297, **blue #0C68AE on an opaque white box**. Large logo is 15417×7757, white on transparent, with a wrench/gear/piston badge. Signature detail: the **"f" crossbar extends as a long line over "xcar"** | canvas sampling |
| Founder photo | 1440×1800 (4:5), a casual phone photo of her holding a framed certificate that visibly reads **"Raashi Taneja, Mentor, Techstars Startup Weekend Dehradun"**. The current OG image is the same photo | Wix CDN |
| Analytics | The live site runs Google Ads and GTM tags. Carry them over at launch (pitch note) | network |

### Pitch-sensitive finding
The first testimonial is from **"Siddharth Kapoor Design Studio"**, linked to skdsdesignstudio.com. The same name bylines all 10 blog posts, SKDS's own site has a post promoting Fixcar.in, and Fixcar's Sulekha account has reviewed SKDS. It is likely a related party, and possibly whoever runs the current site. I'll keep the quote, since it is real and exact, but place it last. The pitch notes suggest replacing it with Google reviews, worded tactfully.

### Current site baseline (before), PageSpeed 8 Oct 2026 ([report](https://pagespeed.web.dev/analysis/https-www-fixcar-in/omlpfgjl3g))
| | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| Mobile | 61 | 96 | 100 | 100 | 2.6 s | 5.4 s | 340 ms | 0.003 | 8.3 s |
| Desktop | 58 | 96 | 100 | 100 | 0.7 s | 1.3 s | 2,170 ms | 0.002 | 3.6 s |

Also: no CrUX field data; 158 requests, about 1.6 MB, 106 script files (~915 KB); the desktop page is 1507 px wide in a 1425 px viewport; one contrast failure.

### Gaps that become client TODOs
Founder name and quote approval, hours, Facebook, primary Instagram, pickup-and-drop confirmation, uniform colours for photos, prices and warranty (recommended, not invented), permission to show the Google rating, whether to keep the SKDS quote, and the logo colour direction.

### Assumptions (veto any at approval)
1. §0 defaults apply: no founder name (caption "Founder, Fixcar.in"), WhatsApp is the phone number, hours hidden, no IG photos, no studio credit.
2. **The Google rating is shown** ("4.8 on Google, from 61 reviews", dated October 2026) with a "More reviews on Google" link, because the search you asked for found it. It is not put in JSON-LD, since self-serving review markup breaks Google's guidelines.
3. Build in place in the OneDrive folder (see risks).
4. Keep the create-next-app 16.4 defaults (Turbopack, `cacheComponents`, AGENTS.md). Pin **TypeScript 5.9.3 and ESLint 9.39.5**, the lines it scaffolds, not TS 7 or ESLint 10.
5. `metadataBase` resolves from `NEXT_PUBLIC_SITE_URL`, then the Vercel production URL, then `https://www.fixcar.in`. This keeps WhatsApp link previews of the demo working.
6. A mobile-menu link tap moves focus to the target section, so keyboard users don't restart from the top. Esc, backdrop and toggle return focus to the toggle.
7. The FAQ uses native `<details name>` (one open at a time, zero JS, correct semantics).
8. Pickup and drop is mentioned (from their blog's FAQ) and flagged for confirmation.

### Skills read
All requested skills are present: frontend-design, design-taste-frontend (v2), redesign-existing-projects, high-end-visual-design (soft), full-output-enforcement (output), ui-ux-pro-max, gsap-core, timeline, scrolltrigger, plugins, react, performance and utils, and web-design. I also read the Tesla, Ferrari, Airbnb and Apple references (local) and Mastercard (getdesign.md).

---

## 2. Design direction and tokens

**Design read:** a local-service homepage for Dehradun car owners on phones, with a calm, photography-led "Doon Morning" language. It leans on an editorial 12-column grid, one expanded variable grotesque, and workshop-vernacular motion.
**Line:** *The garage that comes to your gate.*

### Your proposal: what I kept and what I changed
- **Kept:** Doon Morning, limewash with racing green, Archivo, Phosphor, the editorial grid, the radius system, glass limited to nav/menu/FAB/composer, and every anti-slop rule.
- **Archivo is validated:** width axis 62–125 and weight 100–900 are available through next/font; it's **one 88 KB woff2** (latin) and its digits are tabular. The width axis costs about 55 KB over a weight-only file, and it earns that as the hero signature.
- **Panchang + Switzer rejected:** two families means more bytes, and Panchang is already common on Awwwards, so Archivo's width axis is more distinctive.
- **Hero art direction by breakpoint:**
  - **Desktop is type-led.** The 2-line expanded headline sits on limewash above a wide framed photo. This guarantees contrast, makes the width "acceleration" read best, and contrasts sharply with their current dark video hero.
  - **Mobile is photo-led.** A full-bleed portrait photo sits behind the glass pill and dissolves into limewash ("morning haze", a CSS mask) where the type sits. The photo dominates the first phone screen while text stays AA.
- **Hero load choreography is CSS, not GSAP.** CSS starts at first paint with zero JS dependency. GSAP set-from states after hydration would flash the content or delay LCP. The intro shutter is a fixed CSS overlay that never clips the hero, so LCP is unaffected (LCP ignores occlusion). GSAP still drives hero parallax.
- **GSAP is lazy:** each section's `useGSAP` lives in an idle-loaded motion module (`next/dynamic`, `ssr:false`). That keeps ~60 KB of GSAP out of first-load JS.
- **"The line":** the logo's long crossbar becomes a motif used twice. It is the process route the technician drives, and the bar that draws across the footer wordmark.
- **Logo colour reconciliation:** see below.
- **Other changes:**
  - The marquee gets a pause button (WCAG 2.2.2, Level A).
  - Testimonials show a verbatim pull sentence plus the full review.
  - The journal is an asymmetric list, not a three-card row.
  - The numbers become an asymmetric odometer strip, with counts derived from data (`areas.length`, `brands.length`) so they never drift.

### Colour tokens (contrast measured)
| Token | Value | Role | Contrast |
|---|---|---|---|
| limewash | #F2EBDD | page background | ink 13.2:1, stone 5.8:1, racing 9.1:1 |
| paper | #FAF6EE | raised surfaces, sheets, glass tint | ink 14.5:1, stone 6.4:1 |
| ink | #1B2620 | text, ghost-button border | never on racing (1.45:1) |
| racing | #1F4532 | the single accent: primary buttons, active, focus ring, CTA band, footer | limewash/paper on it 9.1/10.0:1 |
| racing-hover / press | #24503A / #183828 | button states | 7.8:1 / 10.8:1 |
| stone | #5D5A50 | secondary text, input borders | 5.8:1 (≥3:1 non-text ✓) |
| hairline | rgba(27,38,32,.12) | dividers only, decorative | not for control borders |
| focus | 2px racing, 2px offset (limewash ring on racing surfaces) | | ≥9:1 |
| WhatsApp #25D366, IG gradient, FB #0866FF | inside their official logos only | | |

**Logo reconciliation.** The logo blue (#0C68AE, 4.9:1 on limewash) fights racing green. My recommendation:
1. Render a clean **SVG trace of the wordmark in one colour**: ink on limewash, limewash on racing.
2. Keep the original blue logo files in `public/brand/` for reference.
3. Add a hidden pitch switch, **`?accent=blue`**, that swaps the accent token to a deepened Fixcar blue (#0E4C80, 7.5:1) for live comparison in the meeting.

Recommend the colour refresh in the pitch notes.

Taste-skill note: limewash sits in the "cream" family that the skill flags as an AI default. It stays because you require cream. It is differentiated by a green-black ink (not espresso), a racing-green accent (no brass, clay or terracotta), no serif, and cream that comes from real lime-washed walls in the photography.

### Type (Archivo variable, `next/font/google`, `axes:['wdth']`, latin, swap, preloaded)
| Role | Size, mobile to desktop | Weight | Width (`font-stretch`) | Line height | Tracking |
|---|---|---|---|---|---|
| Display XL (h1) | clamp 40 to 108 px | 800 | 100% mobile, 112% desktop (animates from 75%) | 0.95 | −0.02em |
| Display L (h2) | 36 to 72 px | 750 | 112% | 1.0 | −0.015em |
| Display M (h3, bays, steps) | 24 to 36 px | 700 | 106% | 1.1 | −0.01em |
| Pull quote | 26 to 48 px | 500 | 100% | 1.15 | −0.01em |
| Lead | 19 to 22 px | 400 | 100% | 1.45 | 0 |
| Body | 17 px | 400 | 100% | 1.6 | 0 |
| Small, caption | 15 px | 500 | 100% | 1.45 | 0 |
| UI (nav, buttons, inputs) | 16 px | 600 | 100% | 1 | 0 |
| Odometer numerals | 64 to 144 px | 800 | 125%, `tabular-nums` | 1 | −0.02em |

Type rules: sentence case only; `text-wrap: balance` on headings and `pretty` on body; body ≤ 65ch; the width axis animates only in the hero.

### Spacing, grid, radius, depth, glass, motion
- **Spacing:** 4 px base; scale 4/8/12/16/24/32/48/64/96/128/160; section padding `clamp(72px, 10vw, 160px)`.
- **Grid:** 12 columns, 24 px gutters, container 1360 px, side margins `clamp(16px, 4vw, 56px)`. Mobile is a single column with 16 px gutters and no horizontal overflow.
- **Radius:** pill 999 px (nav, buttons, chips, inputs, FAB); 28 px (photo frames, sheets, job card). Nothing else, and full-bleed means no radius.
- **Glass (brief recipe):**
  - `rgba(250,246,238,.62)` + `blur(18px) saturate(140%)` (with the `-webkit-` prefix), an inset 1 px `rgba(255,255,255,.55)` highlight, a 1 px `rgba(27,38,32,.08)` ring, and shadow `0 8px 30px rgba(27,38,32,.08)`.
  - Fallback `@supports not` → `rgba(250,246,238,.94)`.
  - Worst-case ink on glass over a black photo is 5.5:1.
- **Depth:** flat by default; glass for nav, menu, FAB and hero composer; the sheet shadow `0 24px 64px rgba(27,38,32,.16)` only on the menu and booking sheets; no card shadows.
- **Motion tokens:**
  - Durations 0.2 / 0.45 / 0.8 / 1.2 s.
  - CSS ease-out-expo `cubic-bezier(.16,1,.3,1)`.
  - GSAP `expo.out` for reveals, `none` or `power2.inOut` for scrubs.
  - Motion springs: UI 420/38, sheet 380/36, magnetic 450/40.
- **z-index scale:** content 0, FAB 40, nav 50, backdrop 60, sheet 70, intro 100, skip link 110.

### ui-ux-pro-max second opinion
Its proposal was the "Hero-Centric" pattern and "Motion-Driven" style, slate #1E293B with action red #DC2626, and Syncopate with Space Mono.
- **Kept:** one dominant hero CTA plus a sticky nav CTA, the "wide type suits automotive" signal, CTA label contrast checks, a 150–300 ms hover range, test widths 375/768/1024/1440, a static hero under reduced motion, the 10–20 px glass blur band, and "focus not obscured" (I'll add `scroll-padding` for the nav and FAB).
- **Rejected:**
  - The red/slate palette (generic racing cliché, reads as warning).
  - Syncopate (caps-only, conflicts with the no-caps rule).
  - Space Mono body (mono labels are banned, and it's poor for reading).
  - "Motion-Driven" page transitions and 3–5-layer parallax.
  - `back.out` overshoot staggers on grids.
  - Heroicons/Lucide (Phosphor instead).

### Skill conflicts (the brief wins)
- **No eyebrows**, although taste allows one per 3 sections and soft wants pill eyebrows.
- **No double-bezel frames** (they'd add a third radius). The soft skill's "button-in-button" survives only as the WhatsApp glyph in a circle inside the primary pill, with no arrows.
- **Light theme only**, overriding taste's dark-mode rule.
- **No ambient background effects** (web-design's "6 signature categories").
- **18 px blur kept**, against web-design's ≤ 14 px, because it only applies to small fixed elements.
- **Pins stay at 2 or fewer:** services and process.
- **Client TODOs live in docs and typed data**, never as `// TODO` in code, per the output skill.

### Self-review: what read as generic, and what changed
1. **Cream, glass pill nav and marquee** are 2025-26 staples. To make them specific: the cream comes from the limewash photography, the nav pill physically becomes the menu sheet, and the marquee is the real 17-brand list with a pause control.
2. **Hero proof points** risked a feature-bullet look. They're now one quiet row with light icons and no boxes.
3. **A stats band** is the "big number plus label" default. It's now mechanical odometer wheels, asymmetric, with three honest figures.
4. **Blog cards in a row** became an asymmetric typographic list.
5. **A testimonial carousel with dots** became one big verbatim pull quote with arrows, no dots and no autoplay.
6. **The pinned horizontal scroll** is an Awwwards trope. It's used once, with a sticky "workshop board" index that does real navigation, and native swipe on touch.
7. **A scroll-drawn path** can be pure decoration. Here it's the real sequence (workshop to your gate), and steps activate when the car arrives.

---

## 3. Wireframes

Desktop is 1440×900 and mobile is 390×844 (100svh is about 664 with Safari bars).

**0. Intro (first visit per session, ≤ 1.05 s)**
```
DESKTOP + MOBILE: full-viewport racing green, faint horizontal shutter ribs,
limewash wordmark centred → rolls up (translateY −101%) revealing the hero
```
**1–2. Nav and hero**
```
DESKTOP
        ( fixcar.in  Services  How it works  Our story  Reviews  Areas  FAQ  [Book] )   pill ≤920px, 16px+safe top
  Car service at your gate,                                  h1 ~104px, 800, wdth 112
  anywhere in Dehradun.
  Periodic service, repairs, diagnostics,      ◦ Doorstep service across Dehradun
  denting and car wash for every major…        ◦ 17 brands, including Mercedes-Benz, BMW and Audi
                                               ◦ Genuine parts, transparent pricing
  ( Service ▾ | Car brand ▾ | Area ____ | When ▾ | Name __ | [◉ Book on WhatsApp] )   ( Call 81682 11587 )
 ╭──────────────────────────────────────────────────────────────────────────────╮
 │ hero-doorstep 16:9, r28, ~55% above the fold, parallax inside the frame        │
 ╰──────────────────────────────────────────────────────────────────────────────╯
  caption: Morning service at a Dalanwala gate.
MOBILE
 ┌────────────────────────────┐
 │( fixcar.in   [Book]  [≡] ) │ glass over photo
 │ hero-doorstep-mobile 2:3   │ subject in the top half; photo flex-grows (min 200px)
 │░░░░ haze dissolve ░░░░░░░░░│ mask fades to limewash
 │ Car service                │ h1 ~44px, 4 locked lines
 │ at your gate,              │
 │ anywhere in                │
 │ Dehradun.                  │
 │ Periodic service, …        │ subtext (18 words)
 │ [◉ Book on WhatsApp      ] │ opens the bottom-sheet composer
 │ [  Call 81682 11587      ] │
 ├ ─ fold ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
 │ ◦ 3 proof points (rows)    │
 └────────────────────────────┘
```
**3. Brands strip:** `Maruti Suzuki   Hyundai   Tata   Mahindra … Audi` (display face, 112% width). Desktop: an infinite band with velocity skew and a ⏸ button at the right. Mobile: the same band, slower, no skew.

**4. Services, "What we fix"**
```
DESKTOP (pinned 100vh; track scrubs left)
  What we fix
  ┌ index (sticky) ┐  ╭────────╮  ╭────────╮  ╭────────╮ →
  │ ▌Periodic svc  │  │ 4:5    │  │ 4:5    │  │ 4:5    │
  │  Engine, clutch│  ╰────────╯  ╰────────╯  ╰────────╯
  │  Diagnostics   │  Periodic service   Engine, clutch and suspension …
  │  Denting, paint│  outcome line       outcome line
  │  Wash, dry-cln │  includes: 4–6 short items
  │  Battery, tyres│  [◉ Book this service]
  └────────────────┘
  (unpinned below) Also: Brake repair  Oil and filter change  Coolant top-ups  Gearbox …  chips
MOBILE
  What we fix
  [bay 85vw][bay][bay] → native scroll-snap; progress line (no track) under
  chips wrap below
```
**5. Process, "How doorstep service works"**
```
DESKTOP (pinned +120%, route scrubs)
  ●1━━━━━╮      ╭━━━━━●2━━━━━━╮     ╭━━━━●3━━━━━━━●4   🚗 travels, steps light up on arrival
         ╰━━━━━━╯             ╰━━━━━╯
  Book on WhatsApp   A technician      Serviced in        Pay and
  or call            comes to you      front of you       drive on
  Jobs that need a lift or a paint booth go to our Dalanwala workshop.
MOBILE (no pin)
  │● 1 Book on WhatsApp or call   vertical route on the left draws as you scroll;
  │● 2 A technician comes to you  🚗 moves down; steps light up
  │● 3 Serviced in front of you
  │● 4 Pay and drive on
```
**6. Founder, "Our story"**
```
DESKTOP
  Uttarakhand's first female-owned                 full-width statement, Display L
  automobile startup.
  ╭─────────────╮   Fixcar.in started in Dehradun in 2022 …   (body, 2–3 sentences)
  │ founder 4:5 │   "Car care should come to you …"  (quote)
  │ r28, shutter│   Draft quote, awaiting the founder's approval.  (caption)
  ╰─────────────╯
  Founder, Fixcar.in
MOBILE: statement → photo (full width, 4:5) → caption → body → quote
```
**7. Checklist, "Why Dehradun trusts Fixcar.in"**
```
DESKTOP
  ╭ job card (paper, r28) ─────────────────╮  ╭ toolkit-flatlay 1:1 ╮
  │ Inspection checklist      Fixcar.in    │  │                     │
  │ ☑ Certified and experienced technicians│  │                     │
  │ ☑ Genuine spare parts and premium oils │  ╰─────────────────────╯
  │ … 8 ruled rows, 2 columns of 4         │
  ╰────────────────────────────────────────╯
MOBILE: photo (square) → card with 8 rows, single column
```
**8. Numbers (odometer strip, asymmetric)**
```
DESKTOP  2 0 2 2 (cols 1–6, largest)     4 3 (cols 7–9)        1 7 (cols 10–12)
         Serving Dehradun since          localities we cover   car brands we service
MOBILE   2022 full width, then 43 | 17 side by side
```
**9. Reviews**
```
DESKTOP
  What our customers say          4.8 on Google, from 61 reviews   More reviews on Google
  "I've used Fixcar.in five times, and their service has always been excellent."   (pull, verbatim)
  Full review text (body, 65ch)
  Adv. Kushal Aditya                                              (←) (→)
MOBILE: same stack, swipe/drag, arrows below
```
**10. Coverage, "Do we come to you?"**
```
DESKTOP
  ╭ doon-valley 21:9 band (full-bleed atmosphere) ╮
  Do we come to you?
  ( Your area ________________ )   Yes, we come to Rajpur Road.  [◉ Book for Rajpur Road]
  Araghar        Balliwala       Ballupur       Banjarawala      ← 43 areas, alphabetical grid,
  Canal Road     Chakrata Road   Clement Town   Clock Tower …      filters live with layout animation
MOBILE: photo band → title → search → result message/button → 2-column list
```
**11. FAQ, "Before you book"**
```
DESKTOP  Before you book (sticky left)        ▸ Do you provide doorstep car service in Dehradun?
         Still unsure? [◉ Ask on WhatsApp]     ▸ Which car brands do you service?  … (7)
MOBILE   title → accordion → Ask on WhatsApp
```
**12. Journal, "From the Fixcar.in blog"**
```
DESKTOP ┌ featured (7 cols) ───────────────┐ ┌ (5 cols) ─────────────────┐
        │ 31 July 2026, 5 min read          │ │ 17 April 2026, 2 min read  │
        │ 7 warning signs your car needs    │ │ Best car garage in Dehradun│
        │ servicing   (+ excerpt)           │ ├────────────────────────────┤
        └───────────────────────────────────┘ │ Best car service in …      │
                                              └────────────────────────────┘   All posts (fixcar.in)
MOBILE: stacked list, the first item with an excerpt
```
**13–14. Final CTA and footer**
```
DESKTOP ┌ cta-hill-road full-bleed, racing at 80% over it ─────────────────────────┐
        │ Book your doorstep service                                               │
        │ Our workshop is in Dalanwala. We come to you anywhere in Dehradun.       │
        │ [◉ Book on WhatsApp] (Call 81682 11587)   ← magnetic, ≤6px               │
        │ 14/1 Laxmi Road, near Kidzee School, Dalanwala 248001  Get directions    │
        ├ footer (racing continues) ───────────────────────────────────────────────┤
        │ Contact | Explore (anchors + Blog) | Services | ◎IG ◎FB ◎WA             │
        │ fixcar.in   ← giant limewash wordmark; bar draws, letters rise           │
        │ © 2026 Fixcar.in                                                         │
MOBILE: same stack; footer columns stack; wordmark fills the width
```
**Floating WhatsApp FAB:** a 56 px glass circle holding the official logo, bottom-right at `16px + env(safe-area-inset-bottom)`. It appears after the hero and hides over the final CTA, footer and open sheets.
**Booking composer:** an inline glass pill bar in the desktop hero; a bottom sheet on mobile; a centred paper sheet on desktop when triggered from the nav or the final CTA.

---

## 4. Motion table
| # | Section | Trigger | What moves | Lib | Duration / ease | Reduced motion |
|---|---|---|---|---|---|---|
| 1 | Intro shutter | first paint, first visit per session (head boot script) | green shutter translateY 0 → −101% | CSS | 0.25 s hold + 0.8 s `cubic-bezier(.7,0,.2,1)` | not shown |
| 2 | Hero load | first paint (0.55 s delay on first visit, 0.1 s after) | photo scale 1.06 → 1; in-frame shutter on repeat visits; h1 lines rise through masks while `font-stretch` 75% → final (only if fonts ready ≤ 1 s); subtext, CTAs and proof fade + 12 px | CSS | photo 1.6 s, lines 0.9 s (+0.08 s stagger), width 1.2 s, all ease-out-expo | static final |
| 3 | Hero scroll | scroll through hero | photo yPercent → −10 inside frame; h1 y → −40 px | GSAP ST scrub | scrub 0.5, none | off |
| 4 | Nav glass / hide | leave hero top; scroll direction past hero | glass fades in; pill hides on scroll down, returns on scroll up | Motion `useScroll` + `useMotionValueEvent` | 0.45 s | opacity only |
| 5 | Nav active pill | section visibility (IO) | highlight slides between links | Motion `layoutId` | spring 420/38 | instant |
| 6 | Mobile menu | toggle tap | pill → sheet layout morph; links stagger in; bars → X | Motion | see §5 | 150 ms fade |
| 7 | Booking sheet | Book buttons | slides up / drag to dismiss (mobile); 0.98 → 1 + fade (desktop) | Motion drag | spring 380/36 | 150 ms fade |
| 8 | Brands | continuous; scroll velocity | track translateX −50% loop; wrapper skewX ±6° (desktop) | CSS keyframes + GSAP `quickTo` | 40 s linear; skew settles 0.45 s | static wrapped row |
| 9 | Services (desktop) | pinned scroll | track translateX; index highlight via containerAnimation | GSAP ST pin | scrub 1, none | no pin, native scroll-snap |
| 10 | Services (touch) | swipe | progress line scaleX | Motion `useScroll({container})` | live | same |
| 11 | Process | pinned (desktop) / scroll (mobile) | route DrawSVG 0 → 100%; car on MotionPath; steps activate on arrival | GSAP ST + DrawSVG + MotionPath | scrub 0.6, none; step state 0.45 s | fully drawn, all active |
| 12 | Founder | enters 70% | photo clip-path inset(100% 0 0 0) → 0 (shutter); statement lines rise (SplitText masks, autoSplit + onSplit) | GSAP + SplitText | 1.2 s / 0.8 s expo.out | static |
| 13 | Checklist | each row at 85% | tick stroke draws | GSAP ST.batch + DrawSVG | 0.45 s power2.out, 0.12 stagger | ticks drawn |
| 14 | Odometer | strip at 75%, once | digit columns roll to value | GSAP | 1.2 s expo.out, 0.06 stagger | final digits |
| 15 | Reviews | drag / arrows / ←→ keys | slide x | Motion drag | spring 420/38 | instant |
| 16 | Coverage | typing | items exit/enter, grid reflows | Motion AnimatePresence + layout | 0.2–0.45 s | instant |
| 17 | FAQ | toggle | answer height (`::details-content` + `interpolate-size`; instant where unsupported), chevron | CSS | 0.45 s | instant |
| 18 | Final CTA | pointer (fine pointers) | buttons pull ≤ 6 px | Motion springs | 450/40 | off |
| 19 | Footer | footer enters | wordmark bar draws; letters rise via clip-path | GSAP ST scrub | scrub 0.8 | static |
| 20 | WhatsApp FAB | hero leaves / CTA enters | scale 0.9 → 1 + fade | Motion AnimatePresence | spring 420/38 | fade |
| 21 | Buttons | hover/press | tone shift; press scale 0.98 | CSS | 0.2 s | colour only |

**Principles:**
- **Final state first:** the server renders final states, and JS only resets *off-screen* elements before animating them in. Nothing flashes, and everything works without JS.
- **One library per property per element:** CSS drives the marquee track, GSAP skews its parent.
- **Lenis:** desktop only, created after GSAP loads, `autoRaf:false`, driven by `gsap.ticker` with `lagSmoothing(0)` and `lenis.on('scroll', ScrollTrigger.update)`. Stopped while any sheet is open.
- **ScrollTrigger:** `ScrollTrigger.config({ignoreMobileResize:true})`; `gsap.matchMedia` provides desktop, mobile and reduced branches.

---

## 5. Navbar and mobile menu

**Desktop (≥ 1024 px)**
- **Geometry:** a 920 px max centred pill, 16 px + safe area from the top, 64 px tall. Logo left, 6 links centre, Book pill right.
- **States:**
  - At the hero top: no glass, since it sits on limewash.
  - Past 24 px or the hero top: glass fades in (0.45 s).
  - Scrolling down past the hero: hides with translateY −120% (0.45 s).
  - Any upward scroll over 8 px: returns.
  - It never hides while focus is inside it or a sheet is open.
- **Scroll source:** Motion `useScroll` and `useMotionValueEvent`, with no window scroll listeners.
- **Active link:** a racing-tint pill (`rgba(31,69,50,.10)`) slides via `layoutId`. The active section comes from an IntersectionObserver (rootMargin −45%/−50%).
- **Anchors:** `lenis.scrollTo(target,{offset:-navHeight})` (native `scrollIntoView` when Lenis is off), then focus the target `h2[tabindex=-1]` with `preventScroll`. Sections also get `scroll-margin-top`.
- **Book pill:** opens the booking sheet.

**Mobile (< 1024 px)**
- **Closed:** a pill 12 px from the edges with the logo, a Book pill and a 44×44 menu button. It's always glass, because it sits over the photo.
- **Open (`m.header layout`, radius set via `style`):**
  - The same element morphs to a 28 px-radius sheet inset 12 px, max `calc(100svh - 24px)`, using spring stiffness 420 / damping 38 (~420 ms, no wobble).
  - Links stagger in (y 16 → 0, opacity 0 → 1, 40 ms apart) in Display M.
  - The bottom holds WhatsApp and Call buttons, the address and the social logos.
  - The backdrop fades to `rgba(27,38,32,.24)`.
- **Close (~300 ms total):**
  - Links exit in reverse at 120 ms.
  - `onExitComplete` then triggers the layout collapse (tween 0.3 s ease-out-expo).
- **Icon:** two bars rotate to an X (transform only). The accessible name switches "Open menu" / "Close menu", with `aria-expanded` and `aria-controls`.
- **While open:** `lenis.stop()`; iOS-safe scroll lock (body `position:fixed; top:-scrollY`, restored exactly, with no jump); `inert` on `main`, footer and FAB; focus starts on the first link and is trapped by `inert`.
- **Close paths:** Esc, backdrop and toggle close it and return focus to the toggle. A link tap closes first, then scrolls, then focuses the section (assumption 6).
- **Robustness:**
  - State machine `closed | opening | open | closing`. A tap while `closing` reverses to `opening`.
  - The lock is reference-counted (shared with the booking sheet) and released only on `closed`, so rapid taps can't leak a lock.
- **Constraints:**
  - Animate only transform, opacity and the layout-driven radius.
  - Reduced motion: instant layout plus a 150 ms fade.
  - Respect `env(safe-area-inset-*)`, `svh`/`dvh` and `scroll-padding`.
- **Tests (Playwright, 390×844):**
  - 20 rapid toggles leave a consistent state (no lock, no inert, `aria-expanded` matches).
  - Keyboard open, Tab cycling, Esc, focus return.
  - `scrollY` unchanged after close; labels by role and name.
  - Reduced-motion variant.
  - rAF frame sampling at 4× CPU throttle, target p95 frame under 20 ms.

---

## 6. Architecture

**Component tree (server by default; client islands in *italics*)**
```
app/layout.tsx  <html lang="en-IN" suppressHydrationWarning>  head: boot script (intro flag, fonts-ready ≤1s, ?accent)
 ├ SkipLink · IntroShutter (server markup + CSS)
 ├ *MotionProvider* (LazyMotion, async domMax)
 │  ├ *Nav* → *MobileMenu*, *ActivePill*
 │  ├ <main> app/page.tsx: Hero, BrandsMarquee, Services, Process, Founder, Checklist, Numbers,
 │  │         Reviews, Coverage, Faq, Journal, FinalCta   (+ JSON-LD scripts)
 │  │   islands: *HeroComposer*, *HeroMotion*†, *MarqueeMotion*†, *ServicesMotion*†, *ServicesSwipe*,
 │  │            *ProcessMotion*†, *FounderMotion*†, *ChecklistMotion*†, *Odometer*†, *ReviewsCarousel*,
 │  │            *AreaSearch*, *Magnetic*
 │  ├ Footer (+ *FooterMotion*†)
 │  ├ *WhatsAppFab* · *BookingSheet* (one instance, opened via a context)
 │  └ *SmoothScroll* (desktop: idle-loads gsap + lenis)
 └ *Analytics*, *SpeedInsights* (Vercel production only)
† motion module loaded with next/dynamic(ssr:false) on idle; inside it, useGSAP({scope}) with the section ref
```

**Files**
```
src/app/            layout.tsx, page.tsx, globals.css (@theme tokens, keyframes), opengraph-image.tsx,
                    twitter-image.tsx, icon.svg, apple-icon.png, sitemap.ts, robots.ts, manifest.ts,
                    fonts/Archivo-ExpandedExtraBold.woff (OG only)
src/components/layout/  SmoothScroll, MotionProvider, Nav, MobileMenu, WhatsAppFab, Footer, IntroShutter, SkipLink
src/components/sections/ Hero, BrandsMarquee, Services, Process, Founder, Checklist, Numbers, Reviews,
                    Coverage, Faq, Journal, FinalCta (+ */motion/*.tsx islands)
src/components/ui/  Button, BrandLogo (IG/FB/WA official marks), Wordmark (traced SVG, currentColor),
                    Odometer, BookingComposer, BookingSheet, AreaSearch, Magnetic, Icon (Phosphor SSR re-exports)
src/hooks/          useSheet (lock + inert + Esc + focus), useActiveSection, useBooking (context)
src/lib/            gsap.ts (registration: ScrollTrigger, SplitText, DrawSVG, MotionPath, useGSAP), whatsapp.ts,
                    jsonld.ts, cn.ts (clsx), analytics.ts, env.ts (site URL chain, NOINDEX)
src/content/        site.ts (single typed source: business, copy, services, areas+aliases, reviews, faqs,
                    posts, clientTodos), images.ts (static imports → auto blurDataURL)
scripts/            brand-assets.mjs, trace-logo.mjs, logo-colours.mjs, placeholders.mjs, contrast.mjs,
                    qa-shots.mjs, qa-menu.mjs, qa-a11y.mjs, qa-lighthouse.mjs, qa-js.mjs
public/brand/       original logos (3 PNG) + fixcar-wordmark.svg      public/images/  11 placeholders + founder.jpg
docs/               PLAN, PROGRESS, CONTENT, DESIGN, ASSETS, PITCH_NOTES     CLAUDE.md (→ docs, AGENTS.md), README.md, .env.example
```
**Key decisions:**
- **Blur-up:** `images.ts` statically imports `public/images/*`, so Next generates `blurDataURL` and real dimensions at build. Overwriting a file and rebuilding is all you need, and sharp still makes the placeholders.
- **Hero art direction:** `getImageProps` + `<picture>` with mobile and desktop sources, `preload` and `fetchPriority="high"`.
- **`next.config.ts`:** `images.formats ['image/avif','image/webp']` and `images.qualities [60,75]`. Headers: X-Content-Type-Options, Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy (camera, mic, geo, browsing-topics off), CSP `frame-ancestors 'none'`, and `X-Robots-Tag: noindex` when `NEXT_PUBLIC_NOINDEX=true`.

**Dependencies (exact pins)**
| Runtime | | Dev | |
|---|---|---|---|
| next | 16.4.0 | typescript | 5.9.3 |
| react / react-dom | 19.3.0 | @types/react, @types/react-dom | 19.3.0 |
| gsap | 3.15.0 | @types/node | 22.20.5 |
| @gsap/react | 2.1.2 | eslint / eslint-config-next | 9.39.5 / 16.4.0 |
| motion | 14.0.0 (APIs verified) | tailwindcss + @tailwindcss/postcss (or /turbopack, as scaffolded) | 4.3.3 |
| lenis | 1.3.26 | sharp | 0.35.5 |
| @phosphor-icons/react | 2.1.10 (`/dist/ssr`) | potrace | 2.1.8 |
| clsx | 2.1.1 | playwright | 1.64.0 (system Chrome via `channel:'chrome'`) |
| @vercel/analytics | 2.0.1 | @axe-core/playwright | 4.13.0 |
| @vercel/speed-insights | 2.0.0 | lighthouse | 13.5.0 |

**Not used:** three.js, tailwind-merge (saves ~7 KB), shadcn.
**Optional WebGL moment:** a raw-WebGL "haze drift" over the Doon valley photo (desktop, lazy after LCP, off for reduced motion). It costs about 3 KB gz plus GPU, versus about 150 KB gz with three.js. **Recommend skipping**; build it only if every budget passes with room after QA.
**npm scripts:** dev, build, start, lint (`eslint .`), typecheck (`tsc --noEmit`), `assets:*`, `qa:*`.

---

## 7. Meeting the budgets
| Budget | How |
|---|---|
| LCP ≤ 2.0 s | Static prerender on the CDN. The hero photo is the LCP element: preloaded, high priority, accurate `sizes`, AVIF ≤ 180 KB, never clipped or hidden (the shutter is an overlay). One 88 KB font is preloaded. No render-blocking JS. Measured with and without the intro; the intro is dropped if over budget. Fallback lever: a custom-subset Archivo via next/font/local (about 60 KB). |
| CLS ≤ 0.03 | Every image sized. h1 lines are locked `nowrap` blocks with the final (widest) width reserved, so the width animation and font swap never reflow. Pin spacers are created below the fold right after hydration. Nothing is injected above content. |
| INP ≤ 150 ms / TBT ≤ 150 ms | First-load JS is only Next, React, LazyMotion `m`, Nav and the composer. GSAP, Lenis and Motion's domMax load on idle. No third-party scripts. Filtering 43 items is trivial. SplitText runs only on the founder section. |
| First-load JS ≈ 180 KB gz | Estimate about 140 KB: Next+React ~105, LazyMotion `m` ~5, islands ~25. Lazy, not counted: GSAP+plugins ~60, domMax ~25, Lenis ~4. Measured by `qa-js.mjs`, which sums compressed JS before `load` versus total, since Next 16's build output no longer prints sizes. |
| Hero image ≤ 180 KB | AVIF at quality 60, widths capped at what each layout needs; verified from Playwright response sizes. |
| Fonts ≤ 2 preloaded | One file (Archivo variable, latin, swap, size-adjusted fallback). The OG font is never loaded by the page. |
| No embeds on load | Maps is a link (place ID), social are links, there's no Instagram embed, and Vercel Analytics is first-party and deferred. |
| A11y 100 / WCAG 2.2 AA | Contrast above, skip link, landmarks, one h1, alt text, 44 px targets, focus rings, `inert`, the marquee pause, a native-select composer, the native `details` FAQ, carousel roles, reduced motion everywhere; axe plus Lighthouse. |
| SEO | Title, description, canonical, OG/Twitter image, AutoRepair and FAQPage JSON-LD, sitemap, robots (noindex default). Lighthouse SEO is checked once with `NEXT_PUBLIC_NOINDEX=false`. |

---

## 8. Assets

### Manifest (saved to `docs/ASSETS.md`), names and sizes exactly as you specified
| File | Used in | Ratio | Size | Art direction (for your ChatGPT prompts) |
|---|---|---|---|---|
| hero-doorstep.webp | Hero desktop | 16:9 | 2400×1350 | A technician in dark coveralls at the front wheel of a white hatchback, inside the gate of a limewashed Dalanwala bungalow with dark green shutters, soft morning haze. Subject centre-right. No logos, plates or thumbs-up. |
| hero-doorstep-mobile.webp | Hero mobile | 2:3 | 1080×1620 | The same scene, portrait. **Subject in the top half**; the bottom 40% is quiet gravel or driveway (it fades into the haze behind the text). |
| service-periodic.webp | Periodic | 4:5 | 1200×1500 | Oil being poured at an open bonnet, hands only, morning light. |
| service-mechanical.webp | Engine/clutch/suspension | 4:5 | 1200×1500 | A technician at the wheel arch and suspension, tools laid out. |
| service-diagnostics.webp | Diagnostics | 4:5 | 1200×1500 | An OBD scanner plugged in under the dash, with a tablet showing a generic chart (no fake UI text). |
| service-denting-painting.webp | Denting & painting | 4:5 | 1200×1500 | Panel sanding or a polished door panel reflecting the sky. |
| service-wash.webp | Wash & dry-clean | 4:5 | 1200×1500 | Foam on a dark car at a gate, or a seat being dry-cleaned. |
| service-quickfix.webp | Battery/tyres/AC/breakdown | 4:5 | 1200×1500 | A battery swap at the kerb, or a jump-start at dusk. |
| toolkit-flatlay.webp | Checklist | 1:1 | 1600×1600 | A top-down flat-lay of tools, an oil can and a paper job card on a limewash surface. |
| doon-valley.webp | Coverage | 21:9 | 2400×1030 | The Doon valley from the Mussoorie ridge, morning haze, sal forest. |
| cta-hill-road.webp | Final CTA | 16:9 | 2400×1350 | A dusk hill road with switchbacks and streetlights (it sits under 80% racing green). |
| founder.jpg | Founder | 4:5 | 1440×1800 | The client's real photo (downloaded). |

Banned for all images: generic skylines, handshakes, thumbs-up, recognisable car badges and number plates. Uniform colour is a client TODO.

### Placeholders, brand assets and icons
- **Placeholders:** `scripts/placeholders.mjs` (sharp) writes all 11 files at the exact paths and sizes. Each is a limewash-to-stone gradient with the filename, size and usage centred in ink. Overwrite the file and run `npm run build`.
- **Brand downloads, after approval:**
  - header logo 132 KB, large logo 1.4 MB, footer logo 132 KB, founder photo 188 KB (originals, `/v1/…` stripped);
  - the static Archivo 125/800 WOFF for the OG image (~8–20 KB);
  - three Simple Icons paths (CC0; hexes match Meta: FB #0866FF, WA #25D366, IG gradient #FFD600→#FF7A00→#FF0069→#D300C5→#7638FA).
  - Their 1.3 MB OG PNG is not needed.
- **Logo:** `trace-logo.mjs` crops the wordmark from the large PNG (auto-splitting at the alpha gap after the icon badge), traces it with potrace, and makes the long crossbar a separate stroke for the footer draw. `logo-colours.mjs` reports the palette.
- **Icons and OG image:** `icon.svg` and `apple-icon.png` show the traced "f" in limewash on racing. The OG image (1200×630, ImageResponse) shows the wordmark and headline in expanded Archivo on limewash with a racing bar.
- **"From the garage" strip:** skipped (no `public/images/ig/`).

---

## 9. Copy drafts (sentence case, no dashes, Indian English)

**Meta:** title "Doorstep Car Service & Repair in Dehradun | Fixcar.in" (53 characters); description "Doorstep car service anywhere in Dehradun: periodic service, repairs, diagnostics, denting, painting and car wash for 17 brands. Book on WhatsApp." (146).

**Hero:**
- **h1 (recommended):** "Car service at your gate, anywhere in Dehradun." It's plain, local and vivid, and the gate links to the photo. The SEO-literal alternative is "Doorstep car service, anywhere in Dehradun."; "doorstep" lives in the title, the subtext and the FAQ either way.
- **Subtext (18 words):** "Periodic service, repairs, diagnostics, denting and car wash for every major brand, done at your home or office."
- **CTAs:** "Book on WhatsApp", "Call 81682 11587".
- **Proof points:** "Doorstep service across Dehradun" · "17 brands, including Mercedes-Benz, BMW and Audi" · "Genuine parts, transparent pricing" (shown as separate items).
- **Photo caption:** "Morning service at a Dalanwala gate."

**Section titles:** Brands (visually hidden h2 "Car brands we service") · **What we fix** · **How doorstep service works** · **Uttarakhand's first female-owned automobile startup** · **Why Dehradun trusts Fixcar.in** · Numbers (hidden h2 "Fixcar.in at a glance") · **What our customers say** · **Do we come to you?** · **Before you book** · **From the Fixcar.in blog** · **Book your doorstep service**

**Bays (name / outcome):**
1. Periodic service / keep it running smoothly, with safety checked.
2. Engine, clutch and suspension / reliability and comfort restored.
3. Computer diagnostics / find the fault fast, so repairs cost less.
4. Denting and painting / a finish matched to your factory paint (includes insurance claim help).
5. Car wash and dry-cleaning / washed, polished and cleaned at your gate.
6. Battery, tyres, AC and breakdown help / quick fixes where your car stands.

Each bay's "includes" list comes from their copy, and each has a "Book this service" button.

**Process steps:**
1. Book on WhatsApp or call: "Tell us your car, your area and a time that suits you."
2. A technician comes to you: "At your home or office, anywhere in Dehradun."
3. Serviced in front of you: "Genuine parts and premium oils, with the work done where you can see it."
4. Pay and drive on: "Transparent pricing, then you're on your way."

Workshop note: "Jobs that need a lift or a paint booth go to our Dalanwala workshop, with pickup and drop." (pickup and drop flagged to confirm)

**Founder:**
- **Body:** "Fixcar.in started in Dehradun in 2022 with a simple idea: car care should come to you. Expert mechanics bring the garage to your home or office, so you never wait at a workshop."
- **Quote (draft):** "Car care should come to you, done honestly and in front of you."
- **Captions:** "Founder, Fixcar.in" and "Draft quote, awaiting the founder's approval."

**Checklist:** the 8 items in sentence case, each with one supporting line drawn from their copy.

**Odometer captions:** "Serving Dehradun since" 2022 · "localities we cover" 43 · "car brands we service" 17

**Reviews:** each shows a verbatim pull sentence plus the full text. Order: Kushal Aditya, Vyom Rastogi, Siddharth Kapoor Design Studio.

**Coverage:**
- Label: "Your area" (helper "For example, Rajpur Road or Clement Town").
- Match: "Yes, we come to {Area}." with "Book for {Area}".
- Dalanwala: "Yes, we come to Dalanwala. Our workshop is here too."
- No match: "We haven't listed {query} yet, but we cover most of Dehradun." with "Ask on WhatsApp".
- Aliases: Ghanta Ghar → Clock Tower, EC Road → East Canal Road, Kanwali → Kaonli, Sahasradhara, Cantt.

**FAQ (7):**
1. Do you provide doorstep car service in Dehradun?
2. Which car brands do you service?
3. Which areas do you cover?
4. What makes Fixcar.in different from other garages in Dehradun?
5. How long does an oil change take? (30 to 60 minutes)
6. How often should I change engine oil?
7. How often should I service my car? (including the hill-road interval)

**Composer:**
- Fields: Service, Car brand, Area (datalist), When (Today / Tomorrow / Pick a date), Your name (optional).
- Preview: "Your WhatsApp message".
- Example message: "Hi Fixcar.in, I'd like to book a periodic service for my Hyundai at Rajpur Road, tomorrow. Name: Ankit."
- Helper: "WhatsApp opens with this message. Nothing is sent until you press send."
- Links: "Skip and just open WhatsApp".
- Pre-JS fallback: the form `GET`s wa.me with a generic `text`.

**Final CTA:** "Our workshop is in Dalanwala. We come to you anywhere in Dehradun." **Footer:** "© 2026 Fixcar.in".

---

## 10. Risks, client questions, phases

### Risks
| Risk | Mitigation |
|---|---|
| **OneDrive syncing** `node_modules` and `.next` (file locks, quota, slow builds) | Pause OneDrive sync while I build (recommended). If installs hit EBUSY or EPERM I'll stop and ask about moving to a non-synced path. |
| LCP with the intro and an 88 KB font | Overlay technique, preload, measure both ways; drop the intro or subset the font. |
| Very fresh packages (Motion 14.0.0 is 7 days old; Next 16.4) | Exact pins; fallback to motion 13.5.x if a regression appears. |
| GSAP lazy load arrives after a fast scroller | Final-state-first rendering; modules load on idle (about 1 s); pins sit below the fold; `ScrollTrigger.refresh` after fonts and modules, and re-scroll to any URL hash. |
| AI-photo quality and composition | Shot list with explicit framing; the layouts are robust to imperfect photos (type-led on desktop); a real half-day shoot is recommended. |
| Stale Google rating, unclear hours, SKDS quote | Dated rating, hidden hours, quote placed last; all in TODOs and pitch notes. |
| Trademarks | Car brands as text only; social marks unmodified, at least 20 px with clear space. |
| Windows scripting | All scripts are Node `.mjs` (cross-platform paths). Playwright uses the installed Chrome; if that fails, `npx playwright install chromium` (about 170 MB) and I'll tell you. |

### Short questions for the client (go into PITCH_NOTES)
- Founder name, and approval of the quote.
- Opening hours (Google suggests Mon and Wed closed?).
- Pickup and drop.
- Facebook page.
- Which Instagram is primary.
- Uniform colours for the shoot.
- Publishing package prices and a service warranty.
- OK to show the Google rating.
- Keep the SKDS testimonial?
- Logo colour: racing green or blue?

### Phases (commit at the end of each)
| Phase | Work | Verification gate |
|---|---|---|
| 0 Persist | `git init`; docs/PLAN.md (this plan), PROGRESS.md, CLAUDE.md | files exist; first commit |
| 1 Content | Refetch pages and posts; CONTENT.md (original vs edited, SEO intent map, slug and 301 list); `site.ts`; brand downloads; logo colours; wordmark trace; save the ui-ux-pro-max output to docs | `site.ts` typechecks; 43 areas, 17 brands, 3 reviews, 7 FAQs, 3 posts; zero em or en dashes in copy (grep) |
| 2 Design | DESIGN.md (web-design 9 chapters, every component state, ≥ 8 don'ts); `@theme` tokens; `contrast.mjs` | every text pair ≥ 4.5:1 (large ≥ 3:1), controls ≥ 3:1 |
| 3 Foundations | Scaffold create-next-app 16.4.0 in the scratchpad (`--yes --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-react-compiler --disable-git --no-agent-feedback`), move it in, pin exact versions (`.npmrc save-exact=true`); boot script, providers, GSAP registry, placeholders, `whatsapp.ts`; **Nav and MobileMenu perfected first** | build, lint and typecheck clean; `qa-menu.mjs` passes (rapid taps, keyboard, labels, no scroll bleed, inert, focus, reduced motion, p95 frame < 20 ms at 4× CPU) |
| 4 Sections | In page order, each with its motion module and reduced path | per section: real content, no console errors, 390 and 1440 screenshots reviewed, reduced-motion screenshot |
| 5 QA | `qa-shots` at 390×844, 768×1024, 1440×900 and 1920×1080; two critique passes against DESIGN.md and the anti-slop rules (eyebrow count 0, dash grep, radius audit, accent audit); axe; slow 4G + 4× CPU; `next build` + `start` + Lighthouse mobile and desktop; a SEO run with noindex off; `qa-js` | Perf ≥ 95, A11y 100, BP 100; LCP ≤ 2.0 s, CLS ≤ 0.03, TBT ≤ 150 ms; first-load JS ≈ ≤ 180 KB gz; hero ≤ 180 KB |
| 6 Ship | README (run, env vars, swapping images, editing `site.ts`, `?accent=blue`, Vercel deploy); PITCH_NOTES (Wix vs new with scores, why it lifts bookings, recommendations: prices, warranty, digital job cards, a half-day shoot, Google reviews, Hindi version, full site with slugs preserved and 301s, Google Ads/GTM carried over, privacy page, client's own Vercel Pro); final summary | final build, lint and typecheck clean; §14 checklist ticked |

---

## Verification (end to end)
1. **Build and test:** `npm run build && npm run lint && npm run typecheck` are clean; `npm run start` serves the production build.
2. **Screenshots and checks:**
   - `node scripts/qa-shots.mjs` captures every section at 4 viewports for review.
   - `qa-menu.mjs` stress-tests the menu and booking sheet.
   - `qa-a11y.mjs` runs axe on the default and reduced-motion views.
3. **Performance:** `node scripts/qa-lighthouse.mjs` (mobile and desktop JSON summaries, plus an SEO run with `NEXT_PUBLIC_NOINDEX=false`) and `node scripts/qa-js.mjs` (first-load JS, hero bytes).
4. **Manual:**
   - Composer links decode to the right WhatsApp text.
   - Every `tel:`, `mailto:`, Maps, Instagram and blog link resolves.
   - noindex is present in the meta, robots.txt and the header.
   - `?accent=blue` swaps the accent.
   - The intro shows once per session.
5. **Before/after:** the Wix numbers above versus the local Lighthouse results, plus the PSI link template for the Vercel URL once you deploy.
