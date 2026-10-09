"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders its children once the browser is idle after hydration (or after `timeout` ms).
 * Used to load GSAP motion modules without competing with the first paint or hydration.
 */
export function IdleMount({ children, timeout = 1200 }: { children: ReactNode; timeout?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => setReady(true);
    if (window.requestIdleCallback) {
      const handle = window.requestIdleCallback(done, { timeout });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(done, 400);
    return () => window.clearTimeout(handle);
  }, [timeout]);
  return ready ? children : null;
}
