"use client";

import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Brands strip, desktop only: the band leans slightly into the scroll (skewX from scroll
 * velocity, clamped to ±6°) and settles when scrolling stops. The CSS loop moves the inner
 * track; this skews its wrapper, so the two never animate the same element.
 */
export default function MarqueeMotion() {
  useGSAP(() => {
    const wrapper = document.querySelector<HTMLElement>("[data-marquee-skew]");
    if (!wrapper) return;
    const mm = gsap.matchMedia();
    mm.add(MEDIA.desktop, () => {
      const skewTo = gsap.quickTo(wrapper, "skewX", { duration: 0.45, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-6, 6);
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => skewTo(clamp(self.getVelocity() / -300)),
        onToggle: (self) => {
          if (!self.isActive) skewTo(0);
        },
      });
      const settle = () => skewTo(0);
      ScrollTrigger.addEventListener("scrollEnd", settle);
      return () => {
        ScrollTrigger.removeEventListener("scrollEnd", settle);
        gsap.set(wrapper, { skewX: 0 });
      };
    });
  });
  return null;
}
