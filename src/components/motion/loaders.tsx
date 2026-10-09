"use client";

/**
 * Client loaders for the GSAP motion modules. Each module is code-split with
 * next/dynamic(ssr:false) and only requested once the browser is idle, so GSAP is never
 * part of first-load JS and never runs on the server. The markup they animate is
 * server-rendered in its final state; the modules only enhance it.
 */
import dynamic from "next/dynamic";
import { IdleMount } from "./IdleMount";

const HeroMotion = dynamic(() => import("./HeroMotion"), { ssr: false });
const MarqueeMotion = dynamic(() => import("./MarqueeMotion"), { ssr: false });
const ServicesMotion = dynamic(() => import("./ServicesMotion"), { ssr: false });
const ProcessMotion = dynamic(() => import("./ProcessMotion"), { ssr: false });
const FounderMotion = dynamic(() => import("./FounderMotion"), { ssr: false });
const ChecklistMotion = dynamic(() => import("./ChecklistMotion"), { ssr: false });
const OdometerMotion = dynamic(() => import("./OdometerMotion"), { ssr: false });
const FooterMotion = dynamic(() => import("./FooterMotion"), { ssr: false });

export function HeroMotionLoader() {
  return (
    <IdleMount>
      <HeroMotion />
    </IdleMount>
  );
}

export function MarqueeMotionLoader() {
  return (
    <IdleMount>
      <MarqueeMotion />
    </IdleMount>
  );
}

export function ServicesMotionLoader() {
  return (
    <IdleMount>
      <ServicesMotion />
    </IdleMount>
  );
}

export function ProcessMotionLoader() {
  return (
    <IdleMount>
      <ProcessMotion />
    </IdleMount>
  );
}

export function FounderMotionLoader() {
  return (
    <IdleMount>
      <FounderMotion />
    </IdleMount>
  );
}

export function ChecklistMotionLoader() {
  return (
    <IdleMount>
      <ChecklistMotion />
    </IdleMount>
  );
}

export function OdometerMotionLoader() {
  return (
    <IdleMount>
      <OdometerMotion />
    </IdleMount>
  );
}

export function FooterMotionLoader() {
  return (
    <IdleMount>
      <FooterMotion />
    </IdleMount>
  );
}
