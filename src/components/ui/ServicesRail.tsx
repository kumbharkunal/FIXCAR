"use client";

import { useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

/**
 * The horizontal row of service bays. On touch screens it scrolls natively with
 * scroll-snap; a thin racing-green line shows how far along the row you are.
 */
export function ServicesRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: ref });
  return (
    <>
      <ul ref={ref} data-services-track className="services-track">
        {children}
      </ul>
      <div className="container-x mt-6 lg:hidden" aria-hidden>
        <m.div className="h-0.5 origin-left rounded-pill bg-racing" style={{ scaleX: scrollXProgress }} />
      </div>
    </>
  );
}
