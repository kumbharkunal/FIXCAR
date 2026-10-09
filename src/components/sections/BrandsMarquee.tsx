import { PauseIcon } from "@phosphor-icons/react/dist/ssr/Pause";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr/Play";
import { MarqueeMotionLoader } from "@/components/motion/loaders";
import { MarqueePause } from "@/components/ui/MarqueePause";
import { brands, ui } from "@/content/site";

/**
 * The 17 brands set in the display face (type, not manufacturer logos). A CSS loop moves
 * the track; on desktop GSAP skews the wrapper slightly with scroll velocity. Pauses on
 * hover and with the pause button (WCAG 2.2.2). Reduced motion shows a static wrapped list.
 */
export function BrandsMarquee() {
  const list = (hidden: boolean) => (
    <ul className={hidden ? "marquee-copy flex shrink-0 items-center" : "flex shrink-0 flex-wrap items-center motion-safe:flex-nowrap"} aria-hidden={hidden || undefined}>
      {brands.map((brand) => (
        <li
          key={brand}
          className="whitespace-nowrap px-5 text-[clamp(1.75rem,1.25rem+2.2vw,3.25rem)] font-extrabold leading-none tracking-[-0.02em] text-ink [font-stretch:118%] lg:px-9"
        >
          {brand}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="brands-title" data-track="brands" className="border-y border-hairline py-6 lg:py-9">
      <h2 id="brands-title" className="sr-only">
        {ui.brandsTitle}
      </h2>
      <div className="marquee flex items-center gap-2 pr-3 lg:pr-6" data-marquee>
        <div className="min-w-0 flex-1 overflow-hidden" data-marquee-skew>
          <div className="marquee-track">
            {list(false)}
            {list(true)}
          </div>
        </div>
        <MarqueePause pauseIcon={<PauseIcon size={18} weight="fill" aria-hidden />} playIcon={<PlayIcon size={18} weight="fill" aria-hidden />} />
      </div>
      <MarqueeMotionLoader />
    </section>
  );
}
