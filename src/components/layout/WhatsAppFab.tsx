"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ui, whatsappCopy } from "@/content/site";
import { waLink } from "@/lib/whatsapp";

/**
 * The floating WhatsApp button: a glass circle with the official logo. It appears once
 * the hero has scrolled away and hides while the final call to action, the footer or any
 * sheet is on screen (elements marked data-fab-hide), so it never covers another CTA.
 */
export function WhatsAppFab() {
  const { sheetOpen, menuOpen } = useBooking();
  const [clear, setClear] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("[data-fab-hide]"));
    const intersecting = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) intersecting.set(entry.target, entry.isIntersecting);
      setClear(![...intersecting.values()].some(Boolean));
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const visible = clear && !sheetOpen && !menuOpen;

  return (
    <div data-inert-group>
      <AnimatePresence>
        {visible ? (
          <m.a
            key="fab"
            href={waLink(whatsappCopy.fab)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ui.whatsAppFab}
            data-track="fab"
            className="fab glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <BrandLogo name="whatsapp" size={32} />
          </m.a>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
