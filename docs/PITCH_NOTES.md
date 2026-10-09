# Pitch notes: Fixcar.in homepage

Notes for presenting the redesigned homepage to the Fixcar.in team: what changed, how it compares with the current Wix site, what still needs their input, and what to recommend next.

## The short version

The current homepage is slow on phones, scrolls sideways on desktop, uses stock imagery and makes customers hunt for a way to book. The new homepage is built around one job: a car owner in Dehradun, on a phone, books on WhatsApp or calls in under 30 seconds, and trusts Fixcar.in on the way. It loads about four times lighter, scores 96 on mobile Lighthouse (up from 61), and every word on it comes from Fixcar.in's own site, blog and Google profile.

## Before and after

Current site: PageSpeed Insights on 8 October 2026. New homepage: Lighthouse 13.5 on the production build, same mobile and desktop profiles as PageSpeed, served over HTTP/2 like Vercel, median of three runs, with placeholder photos.

| | Wix, mobile | New, mobile | Wix, desktop | New, desktop |
|---|---|---|---|---|
| Performance | 61 | **96** | 58 | **100** |
| Accessibility | 96 | **100** | 96 | **100** |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 (with indexing on) | 100 | 100 (with indexing on) |
| First contentful paint | 2.6 s | **1.1 s** | 0.7 s | **0.3 s** |
| Largest contentful paint | 5.4 s | **2.8 s** | 1.3 s | **0.6 s** |
| Total blocking time | 340 ms | **59 ms** | 2,170 ms | **0 ms** |
| Cumulative layout shift | 0.003 | 0 | 0.002 | 0 |
| Speed index | 8.3 s | **2.3 s** | 3.6 s | **0.8 s** |
| Requests / page weight | 158 / about 1.6 MB | **32 / 452 KB** | | |
| JavaScript | 106 files, about 915 KB | **22 files, 264 KB** (172 KB before the page is interactive) | | |

Also fixed: the desktop page no longer scrolls sideways (the Wix page is 1507 px wide in a 1425 px window), and every text colour now passes WCAG AA contrast (Wix has one failure).

Honest caveats:

- These are lab numbers from a laptop. Re-run PageSpeed on the deployed demo URL (`https://pagespeed.web.dev/analysis?url=<demo URL>`) before the meeting and quote those.
- Real photos will add some weight. The hero photo has a 180 KB budget; check it with `npm run qa:js` after swapping.
- The demo is deliberately hidden from Google (noindex), so the live PageSpeed run will show SEO below 100 for that one reason. With indexing switched on it scores 100.
- Mobile LCP (2.8 s) is the one budget the demo does not meet (target 2.0 s). Lighthouse's simulation counts all of Next.js's start-up JavaScript as blocking the first photo. On a real phone the hero paints much sooner (about 0.2 s in local tests at 4x CPU slowdown). Vercel Speed Insights reports real visitors' numbers once the site is live.

## Why it should lift bookings

- **Booking in one step.** "Book on WhatsApp" opens a short composer (service, car brand, area, when, name). WhatsApp then opens with a complete message, for example "Hi Fixcar.in, I'd like to book a periodic service for my Hyundai at Rajpur Road, tomorrow." Nothing is sent until the customer presses send. A call button sits next to it everywhere.
- **Always within reach.** Book and Call are in the hero, every service, the menu, the FAQ, the final section and a floating WhatsApp button.
- **"Do we come to you?"** Customers type their area and get a direct yes (all 43 localities, with common spellings like Ghanta Ghar or EC Road) and a booking button pre-filled with that area.
- **Trust, shown not claimed.** The founder story, the 4.8 Google rating (61 reviews, dated), verbatim customer reviews, the eight reasons from their own site as an inspection checklist, and the workshop address with directions.
- **Fast on phones.** Most of their customers are on mobile; the page paints quickly and stays responsive while animations load in the background.

## What is real and what is not

- All copy comes from fixcar.in, its blog, its Google profile and listings; edits are for clarity only (`docs/CONTENT.md` shows the original next to the edit).
- Reviews are verbatim. Nothing is invented: no prices, warranties, counts or reviews. Counts on the page are derived from the data (43 localities, 17 brands, founded 2022).
- The founder photo is their own. All other photos are labelled placeholders; `docs/ASSETS.md` has a shot list and prompts.
- The Google rating is shown with its date, as text only. It is not added to search markup (self-served review markup breaks Google's guidelines).

## Questions for the client

1. Founder: how should the founder be named on the site? Approve or rewrite the draft quote ("Car care should come to you, done honestly and in front of you.").
2. Opening hours: Google suggests 9:30 am to 7 pm with Monday and Wednesday closed. Is that right? Hours are hidden until confirmed.
3. Pickup and drop for workshop jobs: their blog says it is available. Confirm.
4. Facebook: is there a page? The demo links to a Facebook search for now.
5. Instagram: is @fixcar.in or @fixcar.in_dehradun the main account?
6. Google rating: OK to show "4.8 on Google, from 61 reviews"?
7. Testimonials: keep the Siddharth Kapoor Design Studio review (see below), or use Google reviews instead?
8. Prices and warranty: would they publish package prices and a service warranty?
9. Photography: uniform colours for the technicians, and a half-day shoot?
10. Logo colour: racing green as in the demo, or their current blue (show `?accent=blue`)?

### The SKDS testimonial (handle gently)

The first testimonial on the current site is from "Siddharth Kapoor Design Studio" (skdsdesignstudio.com). The same name bylines all ten blog posts, the studio's own site promotes Fixcar.in, and Fixcar.in's Sulekha account has reviewed the studio. It may well be a friend, partner or the agency that runs the site. The demo keeps the quote, word for word, but places it last. Suggested wording: "Customers trust reviews from people they don't know. Shall we feature three Google reviews here instead, and keep this one for the about page?"

## Recommendations

1. **Publish prices.** Even "periodic service from ₹X" packages for hatchback, sedan and SUV remove the biggest reason people call around. A competitor already publishes prices.
2. **Offer a written warranty** on service and parts (for example 1,000 km or 30 days), and say so on the page.
3. **Digital job cards.** Send a WhatsApp photo report after each service (before and after, parts replaced). It builds trust and gives the page real photos.
4. **A half-day photo shoot** with uniformed technicians at real Dehradun homes, to replace the placeholders (shot list in `docs/ASSETS.md`).
5. **A Google review habit.** Send the review link after every job; the page links straight to their Google reviews.
6. **A Hindi version** of the homepage for customers who prefer it.
7. **Full site on the same system,** with every current URL kept as it is: `/about-fixcar`, `/contact`, `/blog`, and all ten `/post/<slug>` URLs. Anything that must move gets a 301 redirect (list in `docs/CONTENT.md`).
8. **Carry over Google Ads and Google Tag Manager** from the Wix site at launch, so conversion tracking keeps working. Track WhatsApp and call taps as conversions.
9. **A short privacy page,** needed once analytics and ads tracking run.
10. **Hosting on the client's own Vercel Pro account.** Vercel's free Hobby plan is for non-commercial use only; a business site needs Pro (about $20 a month per member). Custom analytics events also need Pro.

## Showing the demo

- The intro shutter plays once per browser session. Open a new private window to see it again.
- `?accent=blue` swaps racing green for a deepened Fixcar blue, for the logo colour conversation.
- Try the composer on a phone: choose a service, a brand, an area and a day; WhatsApp opens with the full message.
- Type an area into "Do we come to you?" (try "ghanta ghar" or "rajpur").
- The demo is hidden from Google, so it cannot compete with the live site.

## Launch checklist (when it replaces the live site)

1. Swap in real photos; confirm the questions above; remove the demo note in the footer (`footer.liveSiteNote` in `src/content/site.ts`).
2. On Vercel: `NEXT_PUBLIC_NOINDEX=false`, `NEXT_PUBLIC_SITE_URL=https://www.fixcar.in`.
3. Add the domain in Vercel and point DNS at it; keep `www` and the apex redirecting to one canonical host.
4. Add the 301 redirects from `docs/CONTENT.md`; re-submit the sitemap in Google Search Console.
5. Add Google Tag Manager and the Ads conversion tags.
6. Update the website link on the Google Business Profile, JustDial, Sulekha and IndiaMART listings.
7. Enable Vercel Analytics and Speed Insights; watch real-visitor LCP and INP for the first two weeks.
