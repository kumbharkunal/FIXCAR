"use client";

import type { LenisRef, ReactLenis as ReactLenisType } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { setLenis } from "@/lib/lenis-store";

interface Loaded {
  ReactLenis: typeof ReactLenisType;
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
}

/**
 * Desktop smooth scroll. On fine pointers without reduced motion, GSAP and Lenis load
 * after the page is idle; Lenis is then driven by gsap.ticker and feeds ScrollTrigger.
 * Touch devices keep native scroll. Until Lenis exists, native scroll works as normal.
 */
export function SmoothScroll() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    let cancelled = false;
    const load = () => {
      Promise.all([import("lenis/react"), import("@/lib/gsap")]).then(([lenisReact, registry]) => {
        if (cancelled) return;
        setLoaded({ ReactLenis: lenisReact.ReactLenis, gsap: registry.gsap, ScrollTrigger: registry.ScrollTrigger });
      });
    };
    const handle = window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 1500 }) : window.setTimeout(load, 700);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let frame = 0;
    let detach: (() => void) | undefined;
    const attach = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) {
        frame = requestAnimationFrame(attach);
        return;
      }
      const tick = (time: number) => lenis.raf(time * 1000);
      loaded.gsap.ticker.add(tick);
      loaded.gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", loaded.ScrollTrigger.update);
      setLenis(lenis);
      loaded.ScrollTrigger.refresh();
      detach = () => {
        loaded.gsap.ticker.remove(tick);
        lenis.off("scroll", loaded.ScrollTrigger.update);
        setLenis(null);
      };
    };
    attach();
    return () => {
      cancelAnimationFrame(frame);
      detach?.();
    };
  }, [loaded]);

  if (!loaded) return null;
  const { ReactLenis } = loaded;
  return <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, smoothWheel: true, anchors: false }} />;
}
