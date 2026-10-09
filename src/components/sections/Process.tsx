import { CarProfileIcon } from "@phosphor-icons/react/dist/ssr/CarProfile";
import { WrenchIcon } from "@phosphor-icons/react/dist/ssr/Wrench";
import { ProcessMotionLoader } from "@/components/motion/loaders";
import { processSection, ui } from "@/content/site";

/**
 * The route the technician drives, in a 1200×220 drawing. Stops sit at the start of each
 * of the four step columns (the grid has no gap, so stops and text line up at any width).
 * Each segment is the same S-curve, so the stops fall at exactly 0, 1/3, 2/3 and 1 of the path.
 */
const STOPS = [
  { x: 24, y: 150 },
  { x: 324, y: 70 },
  { x: 624, y: 150 },
  { x: 924, y: 70 },
];
const ROUTE = "M24 150 C174 150 174 70 324 70 C474 70 474 150 624 150 C774 150 774 70 924 70";
const last = STOPS[STOPS.length - 1];

/**
 * The server renders the finished state (route drawn, car at the last stop, every step
 * active). GSAP rewinds it only for scrolling: on desktop the section pins while the route
 * draws and the car drives it; on phones a vertical line fills as the steps pass.
 */
export function Process() {
  return (
    <section id="how-it-works" aria-labelledby="process-title" data-track="process" className="section overflow-x-clip">
      <div data-process-pin className="container-x lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-24">
        <h2 id="process-title" data-section-heading className="type-display-l max-w-[18ch]">
          {processSection.title}
        </h2>

        <div className="relative mt-14 hidden lg:block" data-route>
          <svg viewBox="0 0 1200 220" className="block h-auto w-full overflow-visible" aria-hidden focusable="false">
            <path d={ROUTE} fill="none" stroke="var(--color-hairline)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 10" />
            <path d={ROUTE} data-route-path fill="none" stroke="var(--color-racing)" strokeWidth="3" strokeLinecap="round" />
            {STOPS.map((stop, i) => (
              <g key={stop.x} data-route-stop>
                <circle cx={stop.x} cy={stop.y} r="21" fill="var(--color-paper)" stroke="var(--color-racing)" strokeWidth="2" />
                <text
                  x={stop.x}
                  y={stop.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--color-ink)"
                  fontSize="17"
                  fontWeight="700"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
          <div
            data-route-car
            className="absolute grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill bg-racing text-limewash shadow-sheet"
            style={{ left: `${(last.x / 1200) * 100}%`, top: `${(last.y / 220) * 100}%` }}
          >
            <CarProfileIcon size={26} weight="fill" aria-hidden className="-scale-x-100" />
          </div>
        </div>

        <ol data-process-list className="relative mt-12 grid gap-10 lg:mt-6 lg:grid-cols-4 lg:gap-0">
          <span aria-hidden className="absolute bottom-6 left-[1.3125rem] top-6 w-0.5 bg-hairline lg:hidden" />
          <span
            aria-hidden
            data-route-progress
            className="absolute bottom-6 left-[1.3125rem] top-6 w-0.5 origin-top bg-racing lg:hidden"
          />
          <span
            aria-hidden
            data-route-car-mobile
            className="absolute bottom-0 left-0 z-10 grid size-11 place-items-center rounded-pill bg-racing text-limewash shadow-sheet lg:hidden"
          >
            <CarProfileIcon size={22} weight="fill" aria-hidden className="rotate-90 -scale-x-100" />
          </span>
          {processSection.steps.map((step, i) => (
            <li key={step.title} data-step data-active="" className="process-step relative pl-16 lg:pl-0 lg:pr-8">
              <span aria-hidden className="process-num lg:hidden">
                {i + 1}
              </span>
              <h3 className="type-display-m">
                <span className="sr-only">{ui.step(i + 1)}</span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-[30ch] text-stone">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 flex max-w-[60ch] items-start gap-3 type-small text-ink lg:mt-14">
          <WrenchIcon size={20} weight="light" className="mt-0.5 shrink-0 text-racing" aria-hidden />
          {processSection.workshopNote}
        </p>
      </div>
      <ProcessMotionLoader />
    </section>
  );
}
