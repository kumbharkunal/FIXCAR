# Assets

Every photo, logo, icon and font the homepage uses, where it lives, and how to replace it.

## How photos work

- Photos live in `public/images/` and are statically imported in `src/content/images.ts`. At build time Next.js reads each file's real size and makes a blur placeholder, so swapping a photo needs no code change.
- Sections render photos through `src/components/ui/Photo.tsx` (next/image `getImageProps`, rendered on the server, no client JavaScript). The hero uses a `<picture>` with separate mobile and desktop photos, preloaded with high priority.
- Next.js serves AVIF (WebP as a fallback) at quality 60 (75 for the founder photo), resized to the widths each layout needs.
- Budget: the hero must stay under 180 KB as served. Check with `npm run qa:js` after swapping photos.

### Replacing a photo

1. Export the new photo at the size in the manifest below (same aspect ratio, same file name).
2. Overwrite the file in `public/images/`.
3. Run `npm run build` (and `npm run qa:js` to check the hero weight).

`npm run assets:placeholders` only ever rewrites files that are still placeholders (it recognises them by hash), so it never touches a real photo. `--force` rewrites everything.

## Manifest

| File | Used in | Ratio | Size (px) | Status |
|---|---|---|---|---|
| `hero-doorstep.webp` | Hero, desktop (wide frame) | 16:9 | 2400 × 1350 | placeholder |
| `hero-doorstep-mobile.webp` | Hero, mobile (full bleed, fades into the page) | 2:3 | 1080 × 1620 | placeholder |
| `service-periodic.webp` | Services: periodic service | 4:5 | 1200 × 1500 | placeholder |
| `service-mechanical.webp` | Services: engine, clutch and suspension | 4:5 | 1200 × 1500 | placeholder |
| `service-diagnostics.webp` | Services: computer diagnostics | 4:5 | 1200 × 1500 | placeholder |
| `service-denting-painting.webp` | Services: denting and painting | 4:5 | 1200 × 1500 | placeholder |
| `service-wash.webp` | Services: car wash and dry-cleaning | 4:5 | 1200 × 1500 | placeholder |
| `service-quickfix.webp` | Services: battery, tyres, AC and breakdown help | 4:5 | 1200 × 1500 | placeholder |
| `toolkit-flatlay.webp` | Why Dehradun trusts Fixcar.in (next to the checklist) | 1:1 | 1600 × 1600 | placeholder |
| `doon-valley.webp` | Do we come to you? (wide band above the area search) | 21:9 | 2400 × 1030 | placeholder |
| `cta-hill-road.webp` | Final call to action (under a 90% racing-green overlay, partly desaturated) | 16:9 | 2400 × 1350 | placeholder |
| `founder.jpg` | Our story | 4:5 | 1440 × 1800 | real (from fixcar.in) |

The founder photo is the client's own photo from their site. Never replace it with a generated person.

## Shot list and prompts

One look across every photo, "Doon Morning": soft early light, lime-washed walls, warm cream and stone tones, deep green accents, real Dehradun streets and gates. Technicians in the same dark uniform in every shot (confirm colours with the client).

Never: recognisable car badges or number plates, logos, readable text, thumbs-up or handshake poses, generic city skylines, people looking at the camera.

Prompts for an image model (also usable as a brief for a half-day shoot):

1. **hero-doorstep.webp** (16:9, 2400 × 1350): "Editorial photograph, early morning in Dehradun. A mechanic in dark navy coveralls kneels at the front wheel of a white hatchback parked just inside the gate of a lime-washed bungalow with dark green wooden shutters. Soft haze, low warm sun from the left, a tool case open on the driveway. Subject centre-right, calm empty space on the left. Natural colours, shallow depth of field, 35 mm. No logos, no badges, no number plates, no text."
2. **hero-doorstep-mobile.webp** (2:3, 1080 × 1620): "The same scene in portrait. The mechanic and the car's front wheel sit in the top half of the frame; the bottom 40 percent is quiet gravel driveway in soft focus, so text can sit over it. No logos, no plates, no text."
3. **service-periodic.webp** (4:5): "Close-up of gloved hands pouring fresh engine oil into an open bonnet, morning light, warm tones, oil catching the light. Hands only, no faces, no brand labels."
4. **service-mechanical.webp** (4:5): "A mechanic checking the suspension at a front wheel arch, wheel removed, tools laid neatly on a cloth beside it, morning light on a residential driveway. No logos."
5. **service-diagnostics.webp** (4:5): "A diagnostic scanner plugged into the port under a car's dashboard, a tablet resting on the seat showing an abstract chart with no readable text, soft daylight through the windscreen."
6. **service-denting-painting.webp** (4:5): "A freshly polished car door panel reflecting the morning sky and a lime-washed wall, a gloved hand finishing with a microfibre cloth. Deep, clean reflections. No badges."
7. **service-wash.webp** (4:5): "Thick white foam sliding down the side of a dark car parked at a gate, water droplets in morning light, a pressure-wash lance at the edge of the frame. No plates."
8. **service-quickfix.webp** (4:5): "A mechanic lifting a car battery into place at the kerb outside a house, jump leads coiled nearby, early evening light. No branding on the battery."
9. **toolkit-flatlay.webp** (1:1): "Top-down flat lay on a lime-washed surface: spanners, a torque wrench, a new oil filter, a small oil can, spark plugs and a paper job card with no readable writing, arranged with even spacing. Soft shadowless light."
10. **doon-valley.webp** (21:9): "The Doon valley seen from the ridge above Dehradun at dawn, layers of hills fading into morning haze, sal forest in the foreground, the city a soft blur in the valley. Calm, wide, no people."
11. **cta-hill-road.webp** (16:9): "A winding hill road above Dehradun at dusk, switchbacks lit by streetlights, the last blue light in the sky. It will sit under a dark green overlay, so keep strong shapes and avoid busy detail."

Export each image as WebP (quality around 85) at the exact size above. Next.js recompresses for delivery.

## Brand assets

| File | What it is |
|---|---|
| `public/brand/fixcar-logo-blue.png` | The header logo from fixcar.in (887 × 297, blue on an opaque white box). Kept for reference. |
| `public/brand/fixcar-logo-white-large.png` | The large logo from fixcar.in (15417 × 7757, white on transparent, with the wrench and piston badge). |
| `public/brand/fixcar-wordmark.svg` | A one-colour vector trace of the "fixcar.in" wordmark (no badge). The site draws it in ink or limewash. |

- The wordmark is traced from the large logo by `npm run assets:logo` (potrace) and written to `src/components/ui/wordmark-data.ts`. The page sends its path once, in an SVG sprite (`src/components/ui/SvgSprite.tsx`), and every use points at it.
- Logo colours, measured by `npm run assets:logo-colours`: the current wordmark blue is `#0C68AE` (pixel cluster around `#0060B0`), 4.9:1 on the new limewash background. The demo uses racing green `#1F4532` as its single accent. `?accent=blue` previews a deepened Fixcar blue (`#0E4C80`, 7.5:1) in the meeting.
- App icons (`src/app/icon.svg`, `src/app/apple-icon.png`) show the wordmark's "f" in limewash on racing green, generated by `npm run assets:icons`.
- The Open Graph image (`src/app/opengraph-image.tsx`) is rendered at build time: the wordmark and the headline in expanded Archivo on limewash.

## Icons and social marks

- Interface icons: Phosphor (MIT), rendered on the server; client components receive them as props.
- Instagram, Facebook and WhatsApp marks: official glyphs (Simple Icons, CC0) in the official colours, unmodified, shown at 20 px or larger with clear space.

## Fonts

- Archivo variable (SIL Open Font License): one file, width axis 62 to 125 and weight 100 to 900, subset to printable ASCII plus © ‘ ’ “ ” … × ₹ and the non-breaking space (60.8 KB instead of 90.6 KB). Regenerate with `npm run assets:font` if the copy ever needs another character, for example an accented name.
- The Open Graph image uses two static Archivo files in `src/app/fonts/`; the page never loads them.
