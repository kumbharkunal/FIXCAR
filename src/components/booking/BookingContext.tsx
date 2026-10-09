"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ServiceId } from "@/content/site";

export interface BookingPrefill {
  serviceId?: ServiceId;
  area?: string;
}

interface BookingContextValue {
  sheetOpen: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill, trigger?: HTMLElement | null) => void;
  closeBooking: () => void;
  /** The element that opened the sheet; focus returns to it on close. */
  getTrigger: () => HTMLElement | null;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((next: BookingPrefill = {}, from: HTMLElement | null = null) => {
    trigger.current = from;
    setPrefill(next);
    setSheetOpen(true);
  }, []);
  const closeBooking = useCallback(() => setSheetOpen(false), []);
  const getTrigger = useCallback(() => trigger.current, []);

  const value = useMemo(
    () => ({ sheetOpen, prefill, openBooking, closeBooking, getTrigger, menuOpen, setMenuOpen }),
    [sheetOpen, prefill, openBooking, closeBooking, getTrigger, menuOpen],
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const value = useContext(BookingContext);
  if (!value) throw new Error("useBooking must be used inside <BookingProvider>");
  return value;
}
