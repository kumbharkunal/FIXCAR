"use client";

import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/**
 * Hero on scroll: the photo drifts within its frame (parallax, at most 10%) while the
 * headline lifts away. The load choreography itself is CSS; this only adds scroll.
 */
export default function HeroMotion() {
  useGSAP(() => {
    const section = document.getElementById("top");
    const parallax = section?.querySelector<HTMLElement>("[data-hero-parallax]");
    const title = section?.querySelector<HTMLElement>("[data-hero-title]");
    if (!section || !parallax || !title) return;

    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      const scrollTrigger = { trigger: section, start: "top top", end: "bottom top", scrub: 0.5 };
      gsap.to(parallax, { yPercent: 10, ease: "none", scrollTrigger });
      gsap.to(title, { y: -40, ease: "none", scrollTrigger: { ...scrollTrigger } });
    });
  });
  return null;
}
