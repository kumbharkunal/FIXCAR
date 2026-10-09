"use client";

import { AnimatePresence, useMotionValueEvent, useScroll, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { BookButton } from "@/components/booking/BookButton";
import { useBooking } from "@/components/booking/BookingContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Wordmark } from "@/components/ui/Wordmark";
import { business, navLinks, ui } from "@/content/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSheetLock } from "@/hooks/useSheetLock";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/scroll";
import { waLink } from "@/lib/whatsapp";

const SECTION_IDS = navLinks.map((link) => link.id);
const UI_SPRING = { type: "spring", stiffness: 420, damping: 38 } as const;
const COLLAPSE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] } as const;

const listVariants: Variants = {
  hidden: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.04 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, transition: { duration: 0.12 } },
  visible: { opacity: 1, y: 0, transition: UI_SPRING },
};

export function Nav() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const activeId = useActiveSection(SECTION_IDS);
  const { setMenuOpen, sheetOpen } = useBooking();

  /** `open`: the links are shown. `expanded`: the pill has the sheet shape (stays true while links exit). */
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const openRef = useRef(false);
  const pendingTarget = useRef<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => {
    pendingTarget.current = null;
    openRef.current = true;
    setExpanded(true);
    setOpen(true);
  }, []);

  const closeMenu = useCallback((target?: string) => {
    pendingTarget.current = target ?? null;
    openRef.current = false;
    setOpen(false);
  }, []);

  /** Immediate close (no exit sequence), used when the booking sheet takes over. */
  const closeMenuNow = useCallback(() => {
    pendingTarget.current = null;
    openRef.current = false;
    setOpen(false);
    setExpanded(false);
  }, []);

  // The links have finished hiding: collapse the sheet back into the pill.
  const onMenuAnimationComplete = useCallback((definition: unknown) => {
    if (definition === "hidden" && !openRef.current) setExpanded(false);
  }, []);

  useSheetLock(expanded && !isDesktop, sheetRef, {
    onEscape: () => closeMenu(),
    returnFocus: () => (pendingTarget.current ? null : toggleRef.current),
    autoFocus: false,
    // Applied once the links have settled (the style recalculation would otherwise land mid-animation).
    inertDelay: 800,
    // A link tap moves focus into the page, so inert must lift at once; otherwise wait for the collapse.
    inertReleaseDelay: () => (pendingTarget.current ? 0 : 320),
  });

  // After the collapse, scroll to the section a link asked for (the lock has been released by now).
  useEffect(() => {
    if (expanded || !pendingTarget.current) return;
    const target = pendingTarget.current;
    pendingTarget.current = null;
    const frame = requestAnimationFrame(() => scrollToSection(target));
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  // Move focus to the first link once the links are in.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() =>
      sheetRef.current?.querySelector<HTMLElement>("#mobile-menu a")?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => setMenuOpen(expanded), [expanded, setMenuOpen]);

  // Crossing into desktop, or opening the booking sheet, closes the menu at once.
  useEffect(() => {
    if ((isDesktop || sheetOpen) && openRef.current) closeMenuNow();
  }, [isDesktop, sheetOpen, closeMenuNow]);

  /* ---------------- Scroll state (Motion useScroll, no scroll listeners) ---------------- */
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const atTopRef = useRef(true);
  const hiddenRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;

    const nextAtTop = y < 24;
    if (nextAtTop !== atTopRef.current) {
      atTopRef.current = nextAtTop;
      setAtTop(nextAtTop);
    }

    const heroEnd = (document.getElementById("top")?.offsetHeight ?? 640) - 96;
    const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
    let nextHidden = hiddenRef.current;
    if (openRef.current || focusInside || y < heroEnd) nextHidden = false;
    else if (delta > 6) nextHidden = true;
    else if (delta < -6) nextHidden = false;
    if (nextHidden !== hiddenRef.current) {
      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
    }
  });

  const onAnchor = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (openRef.current) closeMenu(id);
    else scrollToSection(id);
  };

  const onLogo = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (openRef.current) closeMenu("top");
    else scrollToSection("top");
  };

  return (
    <>
      <AnimatePresence>
        {expanded && !isDesktop ? (
          <m.div
            key="menu-backdrop"
            aria-hidden
            className="fixed inset-0 z-[45] bg-ink/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeMenu()}
          />
        ) : null}
      </AnimatePresence>

      <m.header
        ref={headerRef}
        data-inert-group
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] lg:px-6 lg:pt-[calc(env(safe-area-inset-top)+1rem)]"
        initial={false}
        animate={{ y: hidden ? "-130%" : "0%" }}
        transition={UI_SPRING}
      >
        <m.div
          ref={sheetRef}
          layout
          className={cn(
            "glass pointer-events-auto mx-auto w-full max-w-[57.5rem] overflow-hidden",
            "max-h-[calc(100svh-1.5rem)] lg:overflow-visible",
            atTop && !expanded && "nav-flat",
            expanded && "glass-sheet overflow-y-auto overscroll-contain",
          )}
          style={{ borderRadius: expanded ? 28 : 999 }}
          transition={{ layout: expanded ? UI_SPRING : COLLAPSE }}
          data-lenis-prevent={expanded ? "" : undefined}
          data-scroll-lock-allow={expanded ? "" : undefined}
        >
          <m.div layout="position" className="flex h-14 items-center gap-1.5 pl-4 pr-1.5 lg:h-16 lg:gap-1 lg:pl-5 lg:pr-2">
            <a href="#top" className="-ml-1 flex h-11 items-center rounded-pill px-1" aria-label={`${business.name}, back to top`} onClick={onLogo}>
              <Wordmark className="h-[1.375rem] w-auto lg:h-6" />
            </a>

            <nav aria-label={ui.mainNav} className="mx-auto hidden lg:block">
              <ul className="flex items-center">
                {navLinks.map((link) => {
                  const active = activeId === link.id;
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        className="nav-link"
                        aria-current={active ? "location" : undefined}
                        onClick={(event) => onAnchor(event, link.id)}
                      >
                        {active && isDesktop ? <m.span layoutId="nav-active" className="nav-active" transition={UI_SPRING} /> : null}
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <BookButton source="nav" className="btn btn-primary btn-sm ml-auto lg:ml-0" onBeforeOpen={closeMenuNow}>
              {ui.book}
            </BookButton>

            <button
              ref={toggleRef}
              type="button"
              className="icon-btn is-bare lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? ui.closeMenu : ui.openMenu}
              onClick={() => (openRef.current ? closeMenu() : openMenu())}
            >
              <MenuIcon open={open} />
            </button>
          </m.div>

          {/* Always mounted (hidden and inert while closed), so opening only animates. */}
          <m.div
            id="mobile-menu"
            hidden={!expanded}
            inert={!open}
            className="px-5 pb-5 pt-2 lg:hidden"
            initial={false}
            animate={open ? "visible" : "hidden"}
            variants={listVariants}
            onAnimationComplete={onMenuAnimationComplete}
          >
            <nav aria-label={ui.menuLabel}>
              <ul>
                {navLinks.map((link) => (
                  <m.li key={link.id} variants={itemVariants}>
                    <a
                      href={`#${link.id}`}
                      className="menu-link"
                      aria-current={activeId === link.id ? "location" : undefined}
                      onClick={(event) => onAnchor(event, link.id)}
                    >
                      {link.label}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <m.div variants={itemVariants} className="mt-6 grid gap-3">
              <BookButton source="menu" className="btn btn-primary has-glyph w-full min-h-14" onBeforeOpen={closeMenuNow}>
                <BrandLogo name="whatsapp" size={30} />
                {ui.bookOnWhatsApp}
              </BookButton>
              <a href={business.phone.href} className="btn btn-ghost w-full min-h-14" data-track="menu">
                {ui.call}
              </a>
            </m.div>
            <m.div variants={itemVariants} className="mt-6 flex items-end justify-between gap-4">
              <p className="type-small max-w-[16rem] text-stone">{business.address.full}</p>
              <div className="flex">
                <a
                  href={business.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={business.social.instagram.label}
                  className="grid size-11 place-items-center rounded-pill"
                >
                  <BrandLogo name="instagram" />
                </a>
                <a
                  href={business.social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={business.social.facebook.label}
                  className="grid size-11 place-items-center rounded-pill"
                >
                  <BrandLogo name="facebook" />
                </a>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ui.whatsAppFab}
                  data-track="menu-social"
                  className="grid size-11 place-items-center rounded-pill"
                >
                  <BrandLogo name="whatsapp" />
                </a>
              </div>
            </m.div>
          </m.div>
        </m.div>
      </m.header>
    </>
  );
}

/** Two bars that turn into an X (transform only). */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3.5 w-5">
      <span
        className={cn(
          "absolute left-0 top-0 h-[1.5px] w-full rounded-pill bg-ink transition-transform duration-300 ease-out-expo motion-reduce:transition-none",
          open && "translate-y-[6.25px] rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[1.5px] w-full rounded-pill bg-ink transition-transform duration-300 ease-out-expo motion-reduce:transition-none",
          open && "-translate-y-[6.25px] -rotate-45",
        )}
      />
    </span>
  );
}
