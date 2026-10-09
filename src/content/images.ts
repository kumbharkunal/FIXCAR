/**
 * Static imports of every photo in public/images. Next.js reads each file's real
 * dimensions and generates a blur placeholder at build time, so replacing a file
 * and rebuilding is all it takes to swap a photo.
 */
import type { StaticImageData } from "next/image";
import ctaHillRoad from "../../public/images/cta-hill-road.webp";
import doonValley from "../../public/images/doon-valley.webp";
import founder from "../../public/images/founder.jpg";
import heroMobile from "../../public/images/hero-doorstep-mobile.webp";
import heroDesktop from "../../public/images/hero-doorstep.webp";
import serviceDentingPainting from "../../public/images/service-denting-painting.webp";
import serviceDiagnostics from "../../public/images/service-diagnostics.webp";
import serviceMechanical from "../../public/images/service-mechanical.webp";
import servicePeriodic from "../../public/images/service-periodic.webp";
import serviceQuickfix from "../../public/images/service-quickfix.webp";
import serviceWash from "../../public/images/service-wash.webp";
import toolkit from "../../public/images/toolkit-flatlay.webp";
import type { ImageKey } from "./site";

export const images: Record<ImageKey, StaticImageData> = {
  heroDesktop,
  heroMobile,
  servicePeriodic,
  serviceMechanical,
  serviceDiagnostics,
  serviceDentingPainting,
  serviceWash,
  serviceQuickfix,
  toolkit,
  doonValley,
  ctaHillRoad,
  founder,
};
