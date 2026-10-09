"use client";

import { XIcon } from "@phosphor-icons/react/X";
import { AnimatePresence, useDragControls } from "motion/react";
import * as m from "motion/react-m";
import { useId, useRef } from "react";
import { booking } from "@/content/site";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSheetLock } from "@/hooks/useSheetLock";
import { BookingComposer } from "./BookingComposer";
import { useBooking } from "./BookingContext";

const SHEET_SPRING = { type: "spring", stiffness: 380, damping: 36 } as const;

/**
 * The booking composer as a modal: a bottom sheet on phones (drag the handle down to
 * dismiss) and a centred dialog on desktop. Locks scroll, makes the page inert,
 * closes on Escape or a backdrop tap, and returns focus to the button that opened it.
 */
export function BookingSheet() {
  const { sheetOpen, closeBooking, prefill, getTrigger } = useBooking();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const titleId = useId();

  useSheetLock(sheetOpen, sheetRef, { onEscape: closeBooking, returnFocus: getTrigger, inertDelay: 380 });

  const motionProps = isDesktop
    ? { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 } }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return (
    <AnimatePresence>
      {sheetOpen ? (
        <div key="booking" className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center lg:p-6">
          <m.div
            aria-hidden
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeBooking}
          />
          <m.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            data-scroll-lock-allow
            className="relative max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto overscroll-contain rounded-t-sheet bg-paper shadow-sheet lg:max-w-[34rem] lg:rounded-sheet"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            {...motionProps}
            transition={SHEET_SPRING}
            drag={isDesktop ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) closeBooking();
            }}
          >
            {isDesktop ? null : (
              <div
                className="flex cursor-grab touch-none justify-center pb-1 pt-3"
                onPointerDown={(event) => dragControls.start(event)}
                aria-hidden
              >
                <span className="h-1.5 w-12 rounded-pill bg-ink/20" />
              </div>
            )}
            <div className="flex items-center justify-between gap-4 px-6 pt-3 lg:pt-7">
              <h2 id={titleId} className="type-display-m">
                {booking.sheetTitle}
              </h2>
              <button type="button" className="icon-btn" aria-label={booking.close} onClick={closeBooking}>
                <XIcon size={20} weight="bold" aria-hidden />
              </button>
            </div>
            <div className="px-6 pt-6">
              <BookingComposer variant="sheet" initial={prefill} source="sheet" onSubmitted={closeBooking} />
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
