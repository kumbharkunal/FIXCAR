"use client";

import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/**
 * Footer: the workshop map opens like a shutter as it arrives (the map settling inside its
 * frame, the address rising beside it), and the big wordmark draws in from left to right
 * as the page ends, like the long bar of the logo being drawn. Reduced motion keeps
 * everything in place.
 */
export default function FooterMotion() {
  useGSAP(() => {
    const wordmark = document.querySelector<SVGElement>("[data-footer-wordmark] svg");
    const map = document.querySelector<HTMLElement>("[data-map-frame]");
    const mapInner = map?.querySelector<HTMLElement>("[data-map-inner]");
    const mapText = gsap.utils.toArray<HTMLElement>("[data-map-text] > *");
    if (!wordmark) return;
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      if (map && mapInner) {
        gsap
          .timeline({ scrollTrigger: { trigger: map, start: "top 88%", once: true } })
          .fromTo(map, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.2, ease: "expo.out" })
          .fromTo(mapInner, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
          .fromTo(mapText, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.1);
      }
      gsap.fromTo(
        wordmark,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: wordmark, start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        },
      );
    });
  });
  return null;
}
