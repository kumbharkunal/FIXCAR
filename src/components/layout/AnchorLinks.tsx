"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/lib/scroll";

/**
 * Sends every in-page "#section" link (footer, FAQ, captions) through the same scroll
 * helper as the nav: Lenis on desktop, native smooth scroll elsewhere, focus moved to
 * the section heading. Links whose click was already handled are left alone.
 */
export function AnchorLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      scrollToSection(id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
