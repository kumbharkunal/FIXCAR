import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BookingProvider } from "@/components/booking/BookingContext";
import { BookingSheet } from "@/components/booking/BookingSheet";
import { AnchorLinks } from "@/components/layout/AnchorLinks";
import { BootAttributes } from "@/components/layout/BootAttributes";
import { ClickTracker } from "@/components/layout/ClickTracker";
import { Footer } from "@/components/layout/Footer";
import { IntroShutter } from "@/components/layout/IntroShutter";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Nav } from "@/components/layout/Nav";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { SvgSprite } from "@/components/ui/SvgSprite";
import { business, seo, ui } from "@/content/site";
import { noindex, onVercel, siteUrl } from "@/lib/env";
import { tokens } from "@/lib/tokens";
import "./globals.css";

// Archivo variable (wdth + wght), subset to the characters the site uses (scripts/font-subset.mjs).
const archivo = localFont({
  src: "./fonts/archivo-subset.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: business.name,
    title: seo.ogTitle,
    description: seo.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.ogTitle,
    description: seo.ogDescription,
  },
  robots: noindex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  category: "automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: tokens.limewash,
  colorScheme: "light",
};

/**
 * Runs while the HTML is parsed, before first paint:
 * - data-intro: the shutter intro plays once per session (skipped for reduced motion)
 * - data-accent: ?accent=blue previews the client's blue as the accent
 * - fonts-ready: the hero width animation only runs if Archivo loads within 1 s
 */
const fontFamily = archivo.style.fontFamily.split(",")[0].trim();
const bootScript = `(function(){var d=document.documentElement,b={intro:"play"};try{if(new URLSearchParams(location.search).get("accent")==="blue"){d.setAttribute("data-accent","blue");b.accent="blue"}}catch(e){}var r=false;try{r=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}var s=false;try{s=sessionStorage.getItem("fixcar-intro")==="1";sessionStorage.setItem("fixcar-intro","1")}catch(e){}if(s||r)b.intro="skip";d.setAttribute("data-intro",b.intro);window.__fixcarBoot=b;try{var late=false,t=setTimeout(function(){late=true},1000);document.fonts.load(${JSON.stringify(`800 1em ${fontFamily}`)}).then(function(f){clearTimeout(t);if(!late&&f.length){d.classList.add("fonts-ready");b.fonts=true}})}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={archivo.variable} data-intro="play" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SvgSprite />
        <a href="#main" className="skip-link" data-inert-group>
          {ui.skipLink}
        </a>
        <IntroShutter />
        <MotionProvider>
          <BookingProvider>
            <Nav />
            {children}
            <Footer />
            <WhatsAppFab />
            <BookingSheet closeIcon={<XIcon size={20} weight="bold" aria-hidden />} />
          </BookingProvider>
        </MotionProvider>
        <SmoothScroll />
        <AnchorLinks />
        <ClickTracker />
        <BootAttributes />
        {onVercel ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
