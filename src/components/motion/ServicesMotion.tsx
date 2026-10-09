"use client";

import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis-store";
import { scrollToSection } from "@/lib/scroll";

const NAV_CLEARANCE = 88;

/**
 * Services, desktop: pin the row and translate the bays sideways as the page scrolls.
 * The sticky index highlights the bay in view (containerAnimation) and jumps to a bay
 * on click. Keyboard focus inside a bay scrolls that bay into view.
 */
export default function ServicesMotion() {
  useGSAP(() => {
    const section = document.getElementById("services");
    const pin = section?.querySelector<HTMLElement>("[data-services-pin]");
    const viewport = section?.querySelector<HTMLElement>("[data-services-viewport]");
    const track = section?.querySelector<HTMLElement>("[data-services-track]");
    if (!section || !pin || !viewport || !track) return;
    const bays = gsap.utils.toArray<HTMLElement>("[data-bay]", track);
    const indexLinks = gsap.utils.toArray<HTMLAnchorElement>("[data-services-index] a", section);

    const setActive = (active: number) =>
      indexLinks.forEach((link, i) => {
        if (i === active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });

    const mm = gsap.matchMedia();

    mm.add(MEDIA.desktop, () => {
      section.setAttribute("data-pinned", "");
      track.scrollLeft = 0;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: `top top+=${NAV_CLEARANCE}`,
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      bays.forEach((bay, i) =>
        ScrollTrigger.create({
          trigger: bay,
          containerAnimation: tween,
          start: "left 55%",
          end: "right 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        }),
      );

      /** Page scroll position at which `bay` is fully in view. */
      const scrollYFor = (bay: HTMLElement) => {
        const trigger = tween.scrollTrigger;
        if (!trigger) return window.scrollY;
        const progress = distance() ? Math.min(1, bay.offsetLeft / distance()) : 0;
        return trigger.start + (trigger.end - trigger.start) * progress;
      };
      const goTo = (bay: HTMLElement, smooth: boolean) => {
        const y = scrollYFor(bay);
        const lenis = getLenis();
        if (lenis && smooth) lenis.scrollTo(y, { duration: 1 });
        else window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
      };

      const onIndexClick = (event: MouseEvent) => {
        event.preventDefault();
        const i = indexLinks.indexOf(event.currentTarget as HTMLAnchorElement);
        if (bays[i]) goTo(bays[i], true);
      };
      const onFocusIn = (event: FocusEvent) => {
        const bay = (event.target as Element).closest<HTMLElement>("[data-bay]");
        if (bay) goTo(bay, false);
      };
      indexLinks.forEach((link) => link.addEventListener("click", onIndexClick));
      track.addEventListener("focusin", onFocusIn);

      return () => {
        section.removeAttribute("data-pinned");
        indexLinks.forEach((link) => link.removeEventListener("click", onIndexClick));
        track.removeEventListener("focusin", onFocusIn);
      };
    });

    // Desktop with reduced motion: no pin; the index scrolls the row natively.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
      const onIndexClick = (event: MouseEvent) => {
        event.preventDefault();
        const i = indexLinks.indexOf(event.currentTarget as HTMLAnchorElement);
        bays[i]?.scrollIntoView({ inline: "start", block: "nearest" });
        setActive(i);
        scrollToSection("services");
      };
      indexLinks.forEach((link) => link.addEventListener("click", onIndexClick));
      return () => indexLinks.forEach((link) => link.removeEventListener("click", onIndexClick));
    });
  });
  return null;
}
