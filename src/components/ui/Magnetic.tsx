"use client";

import { useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { PointerEvent, ReactNode } from "react";

const PULL = 6; // px, maximum
const SPRING = { stiffness: 450, damping: 40 };

/**
 * A subtle magnetic pull (at most 6 px) toward a fine pointer. Motion values only,
 * so pointer movement never re-renders React. Off for touch and reduced motion.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * PULL);
    y.set(Math.max(-1, Math.min(1, dy)) * PULL);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div className="inline-flex" style={{ x, y }} onPointerMove={onPointerMove} onPointerLeave={reset}>
      {children}
    </m.div>
  );
}
