"use client";

import { useEffect, useRef, type RefObject } from "react";
import { lockScroll, setPageInertAfter, unlockScroll } from "@/lib/scroll";

interface SheetLockOptions {
  onEscape?: () => void;
  /** Where focus returns when the sheet closes (usually the trigger). */
  returnFocus?: () => HTMLElement | null | undefined;
  /** Focus the first focusable element inside the sheet when it opens. */
  autoFocus?: boolean;
  /** Apply inert this many ms after opening (after the open animation settles). */
  inertDelay?: number;
  /** Release inert this many ms after closing (read at close time). Keep 0 when focus returns into the page. */
  inertReleaseDelay?: () => number;
}

const FOCUSABLE =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * While `active`: stops Lenis and locks page scroll (iOS-safe), makes the rest of the
 * page inert, keeps Tab inside the sheet, and closes on Escape. Focus returns on release.
 */
export function useSheetLock(active: boolean, sheetRef: RefObject<HTMLElement | null>, options: SheetLockOptions = {}) {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    if (!active) return;
    const sheet = sheetRef.current;
    lockScroll();
    setPageInertAfter(sheet, true, optionsRef.current.inertDelay ?? 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // An open list or calendar inside the sheet handles its own Escape first.
        if (event.defaultPrevented) return;
        event.preventDefault();
        optionsRef.current.onEscape?.();
        return;
      }
      if (event.key !== "Tab" || !sheet) return;
      // Tab wraps inside the sheet, so focus is held even before the page turns inert.
      const items = [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.getClientRects().length > 0 && !element.closest("[inert]"),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (!sheet.contains(current) || (event.shiftKey ? current === first : current === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    let frame = 0;
    if (optionsRef.current.autoFocus !== false) {
      frame = requestAnimationFrame(() => sheet?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true }));
    }

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      setPageInertAfter(sheet, false, optionsRef.current.inertReleaseDelay?.() ?? 0);
      unlockScroll();
      optionsRef.current.returnFocus?.()?.focus({ preventScroll: true });
    };
  }, [active, sheetRef]);
}
