import { OdometerMotionLoader } from "@/components/motion/loaders";
import { Odometer } from "@/components/ui/Odometer";
import { numbers } from "@/content/site";

/** Three honest numbers only, set as odometer readings. "Hundreds of car owners" stays as words elsewhere. */
export function Numbers() {
  return (
    <section aria-labelledby="numbers-title" data-track="numbers" className="cv-auto pb-[clamp(4.5rem,10vw,10rem)]">
      <h2 id="numbers-title" className="sr-only">
        {numbers.title}
      </h2>
      <dl className="container-x grid grid-cols-2 gap-x-6 gap-y-12 border-t border-hairline pt-12 lg:grid-cols-12 lg:items-end lg:gap-6 lg:pt-16">
        {numbers.readings.map((reading, i) => (
          <div
            key={reading.caption}
            className={i === 0 ? "col-span-2 flex flex-col-reverse gap-3 lg:col-span-6" : "flex flex-col-reverse gap-3 lg:col-span-3"}
          >
            <dt className="type-small max-w-[22ch] text-stone lg:min-h-[2.9em]">{reading.caption}</dt>
            <dd className={i === 0 ? "type-numeral text-racing" : "odo-small text-racing"}>
              <Odometer value={reading.value} />
            </dd>
          </div>
        ))}
      </dl>
      <OdometerMotionLoader />
    </section>
  );
}
