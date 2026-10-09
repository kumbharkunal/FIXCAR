# ui-ux-pro-max output (second opinion)

Captured 9 October 2026. Treated as input, not orders. What was kept and rejected is in docs/PLAN.md §2.

## Design system: `"premium doorstep car service local automotive" --design-system -p "FixCar" --variance 7 --motion 7 --density 3`

## Design System: FixCar

### Design Dials
- **Variance:** 7/10 — Balanced / Modern
- **Motion:** 7/10 — Standard
- **Density:** 3/10 — Spacious

### Pattern
- **Name:** Hero-Centric Design
- **Conversion Focus:** One primary CTA. Let the hero dominate the initial viewport without hiding the next content cue. Use a static hero and non-pulsing CTA when reduced motion is requested; provide video controls. Pause hero media offscreen/hidden and keep the final hero message and CTA static under reduced motion.
- **CTA Placement:** Hero dominant (center/bottom) + Sticky nav CTA
- **Color Strategy:** Hero: High-impact visual. Minimal text. Verify CTA label text against the button fill at 4.5:1 minimum; use 7:1 only for an explicit AAA normal-text target.
- **Sections:** Full-bleed Hero (headline + visual) > Single value prop strip > Key benefit or proof > Primary CTA

### Style
- **Name:** Motion-Driven
- **Mode Support:** Light supported | Dark supported
- **Keywords:** Animation-heavy, microinteractions, smooth transitions, scroll effects, parallax, entrance anim, page transitions
- **Best For:** Portfolio sites, storytelling platforms, interactive experiences, entertainment apps, creative, SaaS
- **Performance:** cost:low|drivers:none | **Accessibility:** risk:conditional|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1E293B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#334155` | `--color-secondary` |
| On Secondary | `#FFFFFF` | `--color-on-secondary` |
| Accent/CTA | `#DC2626` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#0F172A` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#0F172A` | `--color-card-foreground` |
| Muted | `#E9EDF1` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#E2E8F0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#1E293B` | `--color-ring` |

*Notes: Premium dark + action red*

### Typography
- **Heading:** Syncopate
- **Body:** Space Mono
- **Mood:** kinetic, motion, futuristic, speed, wide, tech
- **Best For:** Music festivals, automotive, high-energy brands
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syncopate:wght@400;700&display=swap
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syncopate:wght@400;700&display=swap');
```

### Key Effects
Scroll anim (Intersection Observer), hover (300-400ms), entrance, parallax (3-5 layers), page transitions

### Motion
**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`
```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```
*Framework notes: grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger; Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately*
- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI

### Avoid (Anti-patterns)
- Static product pages
- Poor UX

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px


## Domain: style, "glassmorphism floating navigation pill light"

## UI Pro Max Search Results
**Domain:** style | **Query:** glassmorphism floating navigation pill light
**Source:** styles.csv | **Found:** 1 results

### Result 1
- **Style ID:** glassmorphism
- **Style Category:** Glassmorphism
- **Aliases:** 
- **Status:** active
- **Parent Style ID:** 
- **Preferred Mode:** auto
- **Type:** General
- **Keywords:** Frosted glass, transparent, blurred background, layered, vibrant background, light source, depth, multi-layer
- **Primary Colors:** Translucent white: rgba(255,255,255,0.1-0.3)
- **Effects & Animation:** Backdrop blur (10-20px), subtle border (1px solid rgba white 0.2), light reflection, Z-depth
- **Best For:** Modern SaaS, financial dashboards, high-end corporate, lifestyle apps, modal overlays, navigation
- **Light Mode ✓:** supported
- **Dark Mode ✓:** supported
- **Performance:** cost:low|drivers:none
- **Accessibility:** risk:conditional|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion
- **Framework Compatibility:** tailwind|mui|chakra
- **Complexity:** Medium
- **AI Prompt Keywords:** Design a glassmorphic interface with frosted glass effect. Use backdrop blur (10-20px), translucent overlays (rgba 10-30% opacity), vibrant background colors, subtle borders, light source reflection, layered depth. Perfect for modern overlays and cards.
- **CSS/Technical Keywords:** backdrop-filter: blur(15px), background: rgba(255, 255, 255, 0.15), border: 1px solid rgba(255,255,255,0.2), -webkit-backdrop-filter: blur(15px), z-index layering for depth
- **Implementation Checklist:** ☐ Backdrop-filter blur 10-20px, ☐ Translucent white 15-30% opacity, ☐ Subtle border 1px light, ☐ Vibrant background verified, ☐ Text contrast 4.5:1 checked
- **Design System Variables:** --blur-amount: 15px, --glass-opacity: 0.15, --border-color: rgba(255,255,255,0.2), --background: vibrant color, --text-color: light/dark based on BG


## Domain: ux, "mobile menu hamburger sheet focus trap scroll lock"

## UI Pro Max Search Results
**Domain:** ux | **Query:** mobile menu hamburger sheet focus trap scroll lock
**Source:** ux-guidelines.csv | **Found:** 6 results

### Result 1
- **Category:** Navigation
- **Issue:** Smooth Scroll
- **Platform:** Web
- **Description:** Anchor links should scroll smoothly to target section
- **Do:** Use scroll-behavior: smooth on html element
- **Don't:** Jump directly without transition
- **Code Example Good:** html { scroll-behavior: smooth; }
- **Code Example Bad:** <a href='#section'> without CSS
- **Severity:** High

### Result 2
- **Category:** Responsive
- **Issue:** Horizontal Scroll
- **Platform:** Web
- **Description:** Avoid horizontal scrolling
- **Do:** Ensure content fits viewport width
- **Don't:** Content wider than viewport
- **Code Example Good:** max-w-full overflow-x-hidden
- **Code Example Bad:** Horizontal scrollbar on mobile
- **Severity:** High

### Result 3
- **Category:** Accessibility
- **Issue:** Focus Appearance
- **Platform:** Web
- **Description:** WCAG 2.2 AAA defines minimum area and contrast for focus indicators
- **Do:** Use an indicator at least as large as a 2 CSS px perimeter with 3:1 state contrast
- **Don't:** Present this enhanced AAA criterion as an AA requirement or use a thin low-contrast outline
- **Code Example Good:** outline: 2px solid currentColor; outline-offset: 2px
- **Code Example Bad:** box-shadow: 0 0 1px low-contrast
- **Severity:** Medium

### Result 4
- **Category:** Accessibility
- **Issue:** Motion Sensitivity
- **Platform:** All
- **Description:** Parallax/Scroll-jacking causes nausea
- **Do:** Honor prefers-reduced-motion and present the final readable state without parallax or scroll-jacking
- **Don't:** Force scroll effects
- **Code Example Good:** @media (prefers-reduced-motion)
- **Code Example Bad:** ScrollTrigger.create()
- **Severity:** High

### Result 5
- **Category:** Interaction
- **Issue:** Focus States
- **Platform:** All
- **Description:** Keyboard focus, including controls inside a modal, needs a visible indicator
- **Do:** Use a visible focus ring on every interactive control, including modal controls
- **Don't:** Remove focus outline without replacement
- **Code Example Good:** focus:ring-2 focus:ring-blue-500
- **Code Example Bad:** outline-none without alternative
- **Severity:** High

### Result 6
- **Category:** Accessibility
- **Issue:** Focus Not Obscured (Enhanced)
- **Platform:** Web
- **Description:** WCAG 2.2 AAA requires keyboard focus to remain fully visible
- **Do:** Keep the entire focused component unobscured by author-created content
- **Don't:** Present this enhanced AAA criterion as an AA requirement or allow persistent UI to hide any part of focus
- **Code Example Good:** close persistent overlay before focus moves behind it
- **Code Example Bad:** sticky footer covers half the focused button
- **Severity:** Medium


## Domain: typography, "automotive expanded grotesk variable width premium"

## UI Pro Max Search Results
**Domain:** typography | **Query:** automotive expanded grotesk variable width premium
**Source:** typography.csv | **Found:** 4 results

### Result 1
- **Font Pairing Name:** Kinetic Motion
- **Category:** Display + Mono
- **Heading Font:** Syncopate
- **Body Font:** Space Mono
- **Mood/Style Keywords:** kinetic, motion, futuristic, speed, wide, tech
- **Best For:** Music festivals, automotive, high-energy brands
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syncopate:wght@400;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syncopate:wght@400;700&display=swap');
- **Tailwind Config:** fontFamily: { display: ['Syncopate', 'sans-serif'], mono: ['Space Mono', 'monospace'] }
- **Notes:** Syncopate's wide stance works well with motion effects.

### Result 2
- **Font Pairing Name:** Premium Sans (DM Sans)
- **Category:** Sans + Sans
- **Heading Font:** DM Sans
- **Body Font:** DM Sans
- **Mood/Style Keywords:** premium, modern, clean, sophisticated, versatile, balanced
- **Best For:** Premium brands, modern agencies, SaaS, portfolios, startups
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
- **Tailwind Config:** fontFamily: { sans: ['DM Sans', 'sans-serif'] }
- **Notes:** Single importable Google family with balanced weights for premium sans layouts.

### Result 3
- **Font Pairing Name:** Kinetic Brutalism (Space Grotesk)
- **Category:** Geometric Sans (Single Dominant)
- **Heading Font:** Space Grotesk
- **Body Font:** Space Grotesk
- **Mood/Style Keywords:** kinetic, brutalist, aggressive, uppercase, oversized, display, motion, street, bold, high-energy, zine
- **Best For:** Music/culture apps, sports platforms, brand flagship mobile, performance dashboards, underground product drops
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
- **Tailwind Config:** fontFamily: { display: ['Space Grotesk', 'sans-serif'], body: ['Space Grotesk', 'sans-serif'] }
- **Notes:** Dominant single-family system: Space Grotesk 700 for display, with 400–600 available for body and supporting hierarchy. Scale: Hero 60–120pt (windowWidth/375*size), Section 40–50pt, Card titles 28–32pt, Body 18–20pt, Labels 12pt. ALL display/buttons/nav: UPPERCASE, letterSpacing -1 (large) / +2 (lab...

### Result 4
- **Font Pairing Name:** Neo Brutalism Mobile (Space Grotesk Bold)
- **Category:** Geometric Sans (Bold-Only)
- **Heading Font:** Space Grotesk
- **Body Font:** Space Grotesk
- **Mood/Style Keywords:** neo brutalism, pop art, loud, bold, heavy, stickers, mechanical, high contrast, cream, gen-z
- **Best For:** Creative tools, Gen-Z marketing, e-commerce for youth culture, content portfolios, collage-style apps
- **Google Fonts URL:** https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap
- **CSS Import:** @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');
- **Tailwind Config:** fontFamily: { display: ['Space Grotesk', 'sans-serif'], body: ['Space Grotesk', 'sans-serif'] }
- **Notes:** Single-weight system using the loaded Space Grotesk 700 (Bold). Display: 48–64px. Heading: 24–32px. Body: 18–20px for deliberate brutalist density. Labels: 14px ALL CAPS letterSpacing 2. All buttons and navigation: uppercase. Use a bold sans-serif system fallback. No italic or thin weights.

