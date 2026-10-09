"use client";

import { useEffect, useState, type ReactNode } from "react";
import { renderSectionsGradually } from "@/lib/scroll";

/**
 * Renders its children once the browser is idle after hydration (or after `timeout` ms) and
 * every deferred section has its real height. Used to load GSAP motion modules without
 * competing with the first paint or hydration, and so they never measure placeholders.
 */
export function IdleMount({ children, timeout = 1200 }: { children: ReactNode; timeout?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      renderSectionsGradually().then(() => {
        if (!cancelled) setReady(true);
      });
    };
    if (window.requestIdleCallback) {
      const handle = window.requestIdleCallback(start, { timeout });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(handle);
      };
    }
    const handle = window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [timeout]);
  return ready ? children : null;
}
