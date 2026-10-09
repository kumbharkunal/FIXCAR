"use client";

import { useLayoutEffect } from "react";

declare global {
  interface Window {
    __fixcarBoot?: { intro?: "play" | "skip"; accent?: "blue"; fonts?: boolean };
  }
}

/**
 * The head boot script sets data-intro, data-accent and the fonts-ready class before
 * first paint. In development, React Strict Mode remounts <html> and clears them, so
 * they are re-applied here. In production this is a no-op.
 */
export function BootAttributes() {
  useLayoutEffect(() => {
    const boot = window.__fixcarBoot;
    if (!boot) return;
    const root = document.documentElement;
    if (boot.intro && root.dataset.intro !== boot.intro) root.dataset.intro = boot.intro;
    if (boot.accent && root.dataset.accent !== boot.accent) root.dataset.accent = boot.accent;
    if (boot.fonts) root.classList.add("fonts-ready");
  }, []);
  return null;
}
