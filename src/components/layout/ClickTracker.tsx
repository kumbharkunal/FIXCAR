"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

/**
 * One delegated listener records WhatsApp and call clicks from any link on the page,
 * so links can stay in server components. The source comes from the nearest
 * data-track attribute (on the link or an ancestor section).
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      // Book buttons open the composer; the composer reports booking_submit itself.
      if (link.hasAttribute("data-opens-sheet")) return;
      const href = link.getAttribute("href") ?? "";
      const source = link.closest<HTMLElement>("[data-track]")?.dataset.track ?? "page";
      if (href.startsWith("https://wa.me/")) track("whatsapp_click", { source });
      else if (href.startsWith("tel:")) track("call_click", { source });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
