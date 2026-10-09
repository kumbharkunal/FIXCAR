"use client";

import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Checklist: each tick is drawn with a pen stroke (DrawSVG) as its row enters.
 * Rows already on screen when this loads keep their ticks.
 */
export default function ChecklistMotion() {
  useGSAP(() => {
    const rows = gsap.utils.toArray<HTMLElement>("[data-job-row]");
    if (!rows.length) return;

    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      const pending = rows.filter((row) => !ScrollTrigger.isInViewport(row, 0.2));
      const tickOf = (row: Element) => row.querySelector<SVGPathElement>("[data-job-tick]");
      gsap.set(pending.map(tickOf), { drawSVG: "0%" });

      ScrollTrigger.batch(pending, {
        start: "top 86%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch.map(tickOf), {
            drawSVG: "100%",
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.12,
          }),
      });
    });
  });
  return null;
}
