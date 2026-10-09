import { getLenis } from "@/lib/lenis-store";

/** Height reserved for the floating nav when scrolling to a section. */
export const NAV_OFFSET = 96;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scrolls to a section and moves focus to its heading so keyboard and screen-reader
 * users continue from there. Uses Lenis when it is running (desktop), native scroll otherwise.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const focusTarget = () => {
    const heading = target.querySelector<HTMLElement>("[data-section-heading]") ?? target;
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  };
  const lenis = getLenis();
  if (lenis && !reducedMotion()) {
    lenis.scrollTo(target, { offset: -NAV_OFFSET, duration: 1.1, onComplete: focusTarget });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
    focusTarget();
  }
  history.replaceState(null, "", `#${id}`);
}

/* ------------------------------------------------------------------ */
/* Scroll lock shared by the mobile menu and the booking sheet.         */
/* Reference counted, so overlapping or rapid open/close cannot leak.   */
/* The page never moves while locked: window.scrollY stays where it is, */
/* so ScrollTrigger and Motion see no scroll jump (no layout, no jank). */
/* ------------------------------------------------------------------ */
let locks = 0;
let mode: "lenis" | "touch" | "overflow" = "overflow";

/** iOS fallback: block page scrolling by touch outside the open sheet. */
function blockTouchScroll(event: TouchEvent) {
  const target = event.target;
  if (target instanceof Element && target.closest("[data-scroll-lock-allow]")) return;
  if (event.cancelable) event.preventDefault();
}

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  const lenis = getLenis();
  if (lenis) {
    mode = "lenis";
    lenis.stop();
    return;
  }
  if (window.matchMedia("(pointer: coarse)").matches) {
    // Touch: blocking touchmove outside the sheet is enough, and it changes no styles,
    // so opening a sheet costs no page relayout.
    mode = "touch";
  } else {
    mode = "overflow";
    document.documentElement.style.overflow = "hidden";
  }
  document.addEventListener("touchmove", blockTouchScroll, { passive: false });
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks > 0) return;
  if (mode === "lenis") {
    getLenis()?.start();
    return;
  }
  if (mode === "overflow") document.documentElement.style.overflow = "";
  document.removeEventListener("touchmove", blockTouchScroll);
}

let inertTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Makes the page inert (or restores it) after `delay` ms. Toggling inert recalculates
 * styles for the whole page, so sheets apply it once their open animation has settled.
 * A newer request always replaces a pending one.
 */
export function setPageInertAfter(keep: Element | null, on: boolean, delay: number) {
  clearTimeout(inertTimer);
  if (delay <= 0) {
    setPageInert(keep, on);
    return;
  }
  inertTimer = setTimeout(() => setPageInert(keep, on), delay);
}

/** Makes every [data-inert-group] that does not contain `keep` inert (or restores it). */
export function setPageInert(keep: Element | null, on: boolean) {
  document.querySelectorAll<HTMLElement>("[data-inert-group]").forEach((element) => {
    if (keep && element.contains(keep)) return;
    if (on) {
      element.inert = true;
      element.setAttribute("data-inerted", "");
    } else if (element.hasAttribute("data-inerted")) {
      element.inert = false;
      element.removeAttribute("data-inerted");
    }
  });
}
