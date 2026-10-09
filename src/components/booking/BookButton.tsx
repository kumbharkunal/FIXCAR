"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { whatsappCopy } from "@/content/site";
import { waLink } from "@/lib/whatsapp";
import { useBooking, type BookingPrefill } from "./BookingContext";

interface BookButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  children: ReactNode;
  prefill?: BookingPrefill;
  /** Analytics source label. */
  source: string;
  /** Called before the sheet opens (for example to close the mobile menu). */
  onBeforeOpen?: () => void;
}

/**
 * A real WhatsApp link (works before JavaScript loads). Once hydrated, a plain click
 * opens the booking composer instead; modified clicks still follow the link.
 */
export function BookButton({ children, prefill, source, onBeforeOpen, ...rest }: BookButtonProps) {
  const { openBooking } = useBooking();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onBeforeOpen?.();
    openBooking(prefill, event.currentTarget);
  };
  return (
    <a
      {...rest}
      href={waLink(whatsappCopy.generic)}
      target="_blank"
      rel="noopener noreferrer"
      aria-haspopup="dialog"
      data-track={source}
      data-opens-sheet=""
      onClick={onClick}
    >
      {children}
    </a>
  );
}
