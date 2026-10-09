import type { ReactNode } from "react";

/**
 * Marks its children for a subtle magnetic pull toward a fine pointer. The pull itself
 * lives in MagneticMotion, loaded on idle and only for fine pointers, so phones get
 * plain markup and no extra JavaScript.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  return (
    <span data-magnetic className="inline-flex">
      {children}
    </span>
  );
}
