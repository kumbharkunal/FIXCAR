"use client";

import { springValue, styleEffect } from "motion";
import { useEffect } from "react";

const PULL = 6; // px, maximum
const SPRING = { stiffness: 450, damping: 40 };

/**
 * Pulls every [data-magnetic] element up to 6 px toward the mouse with Motion springs.
 * Spring values write straight to style, so pointer movement never re-renders React.
 * Off with reduced motion; the loader only mounts this for fine pointers.
 */
export default function MagneticMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cleanups = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"), (element) => {
      const x = springValue<number>(0, SPRING);
      const y = springValue<number>(0, SPRING);
      const stopStyle = styleEffect(element, { x, y });
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const rect = element.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        x.set(Math.max(-1, Math.min(1, dx)) * PULL);
        y.set(Math.max(-1, Math.min(1, dy)) * PULL);
      };
      const onLeave = () => {
        x.set(0);
        y.set(0);
      };
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      return () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
        stopStyle();
        x.destroy();
        y.destroy();
        element.style.transform = "";
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
  return null;
}
