"use client";

import { useState, type ReactNode } from "react";
import { ui } from "@/content/site";

/**
 * Pause and play for the brand marquee (moving content must be pausable, WCAG 2.2.2).
 * The icons are rendered on the server and passed in, so they add no client JavaScript.
 */
export function MarqueePause({ pauseIcon, playIcon }: { pauseIcon: ReactNode; playIcon: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = !paused;
    setPaused(next);
    event.currentTarget.closest<HTMLElement>("[data-marquee]")?.setAttribute("data-paused", String(next));
  };
  return (
    <button type="button" className="icon-btn motion-reduce:hidden" aria-label={paused ? ui.playBrands : ui.pauseBrands} onClick={toggle}>
      {paused ? playIcon : pauseIcon}
    </button>
  );
}
