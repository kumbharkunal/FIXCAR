"use client";

import { gsap, MEDIA, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Founder: the photo opens like a shop shutter rolling up (clip-path), then the
 * statement rises line by line through masks. SplitText re-splits after fonts load or
 * the viewport resizes (autoSplit + onSplit). Reduced motion leaves both as rendered.
 */
export default function FounderMotion() {
  useGSAP(() => {
    const photo = document.querySelector<HTMLElement>("[data-founder-photo]");
    const title = document.querySelector<HTMLElement>("[data-founder-title]");
    if (!photo || !title) return;

    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      if (!ScrollTrigger.isInViewport(photo)) {
        gsap.fromTo(
          photo,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: photo, start: "top 78%", once: true },
          },
        );
      }

      if (!ScrollTrigger.isInViewport(title)) {
        SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: title, start: "top 82%", once: true },
            }),
        });
      }
    });
  });
  return null;
}
