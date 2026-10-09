"use client";

import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Odometer: when the strip comes into view, each wheel rolls up from zero to its digit,
 * right-hand wheels a touch later, like a real odometer settling. Odometers already on
 * screen when this loads keep their final digits.
 */
export default function OdometerMotion() {
  useGSAP(() => {
    const odometers = gsap.utils.toArray<HTMLElement>("[data-odometer]");
    if (!odometers.length) return;

    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      odometers.forEach((odometer) => {
        if (ScrollTrigger.isInViewport(odometer)) return;
        const strips = gsap.utils.toArray<HTMLElement>("[data-digit]", odometer);
        gsap.set(strips, { clearProps: "transform" });
        gsap.set(strips, { yPercent: 0 });
        ScrollTrigger.create({
          trigger: odometer,
          start: "top 82%",
          once: true,
          onEnter: () =>
            gsap.to(strips, {
              yPercent: (_, strip: HTMLElement) => -Number(strip.dataset.digit) * 10,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.06,
            }),
        });
      });
    });
  });
  return null;
}
