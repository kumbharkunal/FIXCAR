"use client";

import { gsap, MEDIA, useGSAP } from "@/lib/gsap";

/**
 * Process: the technician's route. Desktop pins the section while the route draws
 * (DrawSVG) and the car drives along it (MotionPath); each step lights up as the car
 * reaches its stop. Phones fill a vertical line and move the car down as steps pass.
 * Reduced motion keeps the server-rendered finished state.
 */
export default function ProcessMotion() {
  useGSAP(() => {
    const section = document.getElementById("how-it-works");
    if (!section) return;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
    const setActive = (count: number) =>
      steps.forEach((step, i) => {
        if (i < count) step.setAttribute("data-active", "");
        else step.removeAttribute("data-active");
      });

    const mm = gsap.matchMedia();

    mm.add(MEDIA.desktop, () => {
      const pin = section.querySelector<HTMLElement>("[data-process-pin]");
      const route = section.querySelector<SVGPathElement>("[data-route-path]");
      const car = section.querySelector<HTMLElement>("[data-route-car]");
      if (!pin || !route || !car) return;

      // Hand the car's position over from CSS (last stop) to the motion path.
      gsap.set(car, { left: 0, top: 0, xPercent: 0, yPercent: 0 });
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => setActive(Math.min(steps.length, Math.floor(self.progress * 3 + 0.02) + 1)),
        },
      });
      timeline
        .fromTo(route, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 }, 0)
        .fromTo(
          car,
          { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
          { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: 1 },
          0,
        );
      setActive(1);
      return () => {
        gsap.set(car, { clearProps: "all" });
        setActive(steps.length);
      };
    });

    mm.add(MEDIA.touch, () => {
      const list = section.querySelector<HTMLElement>("[data-process-list]");
      const line = section.querySelector<HTMLElement>("[data-route-progress]");
      const car = section.querySelector<HTMLElement>("[data-route-car-mobile]");
      if (!list || !line || !car) return;

      const thresholds = steps.map((step) => step.offsetTop / list.clientHeight);
      gsap.set(car, { top: 0, bottom: "auto" });
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: list,
          start: "top 70%",
          end: "bottom 65%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(thresholds.filter((t) => self.progress >= t - 0.02).length),
        },
      });
      timeline
        .fromTo(line, { scaleY: 0 }, { scaleY: 1 }, 0)
        .fromTo(car, { y: 0 }, { y: () => list.clientHeight - car.offsetHeight }, 0);
      setActive(1);
      return () => {
        gsap.set([car, line], { clearProps: "all" });
        setActive(steps.length);
      };
    });
  });
  return null;
}
