/**
 * GSAP registry. Imported only by motion modules that load with next/dynamic(ssr:false),
 * so GSAP never runs on the server and never lands in first-load JS.
 */
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { renderAllSections } from "@/lib/scroll";

// Real section heights before ScrollTrigger measures anything (pins, starts and ends).
// The loaders have normally rendered every section by now; this is the safety net.
renderAllSections();
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

/** matchMedia conditions shared by every motion module. */
export const MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  touch: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export { DrawSVGPlugin, gsap, MotionPathPlugin, ScrollTrigger, SplitText, useGSAP };
