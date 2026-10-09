import type Lenis from "lenis";

/**
 * Holds the root Lenis instance once SmoothScroll has created it (desktop only).
 * Components read it from here instead of importing lenis/react, which keeps Lenis
 * out of first-load JS.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
