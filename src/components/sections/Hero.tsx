import { CarIcon } from "@phosphor-icons/react/dist/ssr/Car";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr/MapPin";
import { SealCheckIcon } from "@phosphor-icons/react/dist/ssr/SealCheck";
import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { BookButton } from "@/components/booking/BookButton";
import { BookingComposer } from "@/components/booking/BookingComposer";
import { HeroMotionLoader } from "@/components/motion/loaders";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { images } from "@/content/images";
import { business, hero, ui, type IconKey } from "@/content/site";

const proofIcons: Partial<Record<IconKey, typeof MapPinIcon>> = {
  MapPin: MapPinIcon,
  Car: CarIcon,
  SealCheck: SealCheckIcon,
};

const index = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Desktop: type-led. The two-line expanded headline sits on limewash above a wide framed photo.
 * Mobile: photo-led. A full-bleed portrait photo dissolves into the limewash ("morning haze")
 * where the headline sits. The load choreography is pure CSS (globals.css), so nothing here
 * waits for JavaScript; the photo is never hidden, so it can paint as the LCP element.
 */
export function Hero() {
  const desktop = getImageProps({
    src: images.heroDesktop,
    alt: hero.image.alt,
    sizes: "(min-width: 1480px) 1360px, 92vw",
    quality: 60,
  }).props;
  const mobile = getImageProps({
    src: images.heroMobile,
    alt: hero.image.alt,
    sizes: "100vw",
    quality: 60,
    loading: "eager",
    fetchPriority: "high",
  }).props;

  preload(mobile.src, {
    as: "image",
    imageSrcSet: mobile.srcSet,
    imageSizes: mobile.sizes,
    fetchPriority: "high",
    media: "(max-width: 1023px)",
  });
  preload(desktop.src, {
    as: "image",
    imageSrcSet: desktop.srcSet,
    imageSizes: desktop.sizes,
    fetchPriority: "high",
    media: "(min-width: 1024px)",
  });

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-fab-hide
      data-track="hero"
      className="relative flex min-h-[100svh] flex-col lg:block lg:min-h-0"
    >
      <div className="container-x relative z-10 order-2 -mt-24 pb-10 lg:mt-0 lg:pb-0 lg:pt-36">
        <h1 id="hero-title" className="hero-title" data-hero-title>
          <span className="sr-only">{hero.headline}</span>
          <span aria-hidden className="block lg:hidden">
            {hero.lines.mobile.map((line, i) => (
              <span key={line} className="hero-line">
                <span style={index(i)}>{line}</span>
              </span>
            ))}
          </span>
          <span aria-hidden className="hidden lg:block">
            {hero.lines.desktop.map((line, i) => (
              <span key={line} className="hero-line">
                <span style={index(i)}>{line}</span>
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-5 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <p className="hero-fade type-lead max-w-[38ch] text-ink lg:col-span-6" style={index(0)}>
            {hero.subtext}
          </p>
          <ul className="hero-fade hidden gap-3 lg:col-span-5 lg:col-start-8 lg:grid" style={index(2)}>
            {hero.proof.map((item) => {
              const Icon = proofIcons[item.icon] ?? MapPinIcon;
              return (
                <li key={item.text} className="flex items-center gap-3 type-small text-ink">
                  <Icon size={22} weight="light" className="shrink-0 text-racing" aria-hidden />
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Phones and tablets: two clear buttons. The first opens the booking sheet. */}
        <div className="hero-fade mt-7 grid gap-3 sm:max-w-md lg:hidden" style={index(1)}>
          <BookButton source="hero" className="btn btn-primary has-glyph min-h-14 w-full">
            <BrandLogo name="whatsapp" size={30} id="hero-wa" />
            {ui.bookOnWhatsApp}
          </BookButton>
          <a href={business.phone.href} className="btn btn-ghost min-h-14 w-full" data-track="hero">
            {ui.call}
          </a>
        </div>

        {/* Desktop: the booking composer as a glass pill bar. */}
        <div className="hero-fade mt-10 hidden items-center gap-3 lg:flex" style={index(1)}>
          <BookingComposer variant="bar" source="hero" className="min-w-0 flex-1" />
          <a href={business.phone.href} className="btn btn-ghost min-h-14 shrink-0" data-track="hero">
            {ui.call}
          </a>
        </div>

        <ul className="hero-fade mt-8 grid gap-3 lg:hidden" style={index(2)}>
          {hero.proof.map((item) => {
            const Icon = proofIcons[item.icon] ?? MapPinIcon;
            return (
              <li key={item.text} className="flex items-center gap-3 type-small text-ink">
                <Icon size={22} weight="light" className="shrink-0 text-racing" aria-hidden />
                {item.text}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="order-1 flex min-h-[13rem] flex-1 flex-col lg:container-x lg:mt-12 lg:block lg:min-h-0">
        <div className="relative flex-1 overflow-hidden lg:aspect-video lg:rounded-sheet lg:bg-paper" data-hero-frame>
          <div className="absolute inset-x-0 -bottom-[6%] -top-[6%]" data-hero-parallax>
            <picture>
              <source media="(min-width: 1024px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
              <img {...mobile} alt={hero.image.alt} className="hero-photo hero-haze h-full w-full object-cover" />
            </picture>
          </div>
          <div className="hero-frame-shutter" aria-hidden />
        </div>
        <p className="caption hidden lg:block">{hero.caption}</p>
      </div>
      <HeroMotionLoader />
    </section>
  );
}
