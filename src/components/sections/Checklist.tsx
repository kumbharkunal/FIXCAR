import { ChecklistMotionLoader } from "@/components/motion/loaders";
import { Photo } from "@/components/ui/Photo";
import { Wordmark } from "@/components/ui/Wordmark";
import { images } from "@/content/images";
import { checklist } from "@/content/site";

/**
 * The eight reasons, styled as a mechanic's inspection checklist: square boxes like a
 * printed job card, each ticked with a pen stroke as its row comes into view.
 */
export function Checklist() {
  return (
    <section aria-labelledby="checklist-title" data-track="checklist" className="section cv-auto">
      <div className="container-x">
        <h2 id="checklist-title" data-section-heading className="type-display-l max-w-[16ch]">
          {checklist.title}
        </h2>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className="job-card lg:col-span-8" data-job-card>
            <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
              <p className="font-bold [font-stretch:106%]">{checklist.cardTitle}</p>
              <Wordmark className="h-5 w-auto text-stone" />
            </div>
            <ul className="grid sm:grid-cols-2 sm:gap-x-10">
              {checklist.items.map((item) => (
                <li key={item.title} className="job-row" data-job-row>
                  <span className="job-box" aria-hidden>
                    <svg viewBox="0 0 24 24" className="job-tick" focusable="false">
                      <path data-job-tick d="M4.5 12.5 9.5 17.5 20 6" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold leading-snug">{item.title}</p>
                    <p className="mt-1 type-small text-stone">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <figure className="lg:col-span-4 lg:self-end">
            <div className="frame aspect-square">
              <Photo
                src={images[checklist.image]}
                alt={checklist.imageAlt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                quality={60}
                className="object-cover"
              />
            </div>
            <figcaption className="caption">{checklist.caption}</figcaption>
          </figure>
        </div>
      </div>
      <ChecklistMotionLoader />
    </section>
  );
}
