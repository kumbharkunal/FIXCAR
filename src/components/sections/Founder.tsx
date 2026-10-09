import Image from "next/image";
import { FounderMotionLoader } from "@/components/motion/loaders";
import { images } from "@/content/images";
import { founder } from "@/content/site";

/**
 * The brand's emotional core: Uttarakhand's first female-owned automobile startup.
 * The founder's real photo (from fixcar.in), never a generated one. The quote is a draft
 * and says so on the page until the founder approves it.
 */
export function Founder() {
  return (
    <section id="our-story" aria-labelledby="founder-title" data-track="founder" className="section">
      <div className="container-x">
        <h2
          id="founder-title"
          data-section-heading
          data-founder-title
          className="max-w-[17ch] text-[clamp(2.5rem,1.35rem+4.8vw,6.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] [font-stretch:112%]"
        >
          {founder.title}
        </h2>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <figure className="lg:col-span-5">
            <div className="frame aspect-[4/5]" data-founder-photo>
              <Image
                src={images.founder}
                alt={founder.photoAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                quality={75}
                className="object-cover"
              />
            </div>
            <figcaption className="caption">{founder.name ? `${founder.name}, ${founder.caption}` : founder.caption}</figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            {founder.body.map((paragraph) => (
              <p key={paragraph} className="type-lead mt-5 max-w-[40ch] first:mt-0">
                {paragraph}
              </p>
            ))}
            <figure className="mt-12 border-l-2 border-racing pl-6">
              <blockquote>
                <p className="type-quote max-w-[24ch]">“{founder.quote.text}”</p>
              </blockquote>
              <figcaption className="mt-4 type-small text-stone">{founder.caption}</figcaption>
            </figure>
            {founder.quote.approved ? null : <p className="mt-4 type-small text-stone">{founder.quote.draftNote}</p>}
          </div>
        </div>
      </div>
      <FounderMotionLoader />
    </section>
  );
}
