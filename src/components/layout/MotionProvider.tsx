"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((module) => module.default);

/**
 * Motion with only the `m` component in first-load JS. The domMax features (layout and
 * drag) load asynchronously. reducedMotion="user" turns transform and layout animations
 * off for people who ask for reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 420, damping: 38 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
