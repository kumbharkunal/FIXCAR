"use client";

import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/**
 * Footer: the big wordmark draws in from left to right as the page ends, like the long
 * bar of the logo being drawn. Scrubbed; reduced motion keeps it fully visible.
 */
export default function FooterMotion() {
  useGSAP(() => {
    const wordmark = document.querySelector<SVGElement>("[data-footer-wordmark] svg");
    if (!wordmark) return;
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
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
