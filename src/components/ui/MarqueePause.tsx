"use client";

import { PauseIcon } from "@phosphor-icons/react/Pause";
import { PlayIcon } from "@phosphor-icons/react/Play";
import { useState } from "react";
import { ui } from "@/content/site";

/** Pause and play for the brand marquee (moving content must be pausable, WCAG 2.2.2). */
export function MarqueePause() {
  const [paused, setPaused] = useState(false);
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = !paused;
    setPaused(next);
    event.currentTarget.closest<HTMLElement>("[data-marquee]")?.setAttribute("data-paused", String(next));
  };
  return (
    <button type="button" className="icon-btn motion-reduce:hidden" aria-label={paused ? ui.playBrands : ui.pauseBrands} onClick={toggle}>
      {paused ? <PlayIcon size={18} weight="fill" aria-hidden /> : <PauseIcon size={18} weight="fill" aria-hidden />}
    </button>
  );
}
