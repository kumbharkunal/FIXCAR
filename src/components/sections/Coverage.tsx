import Image from "next/image";
import { AreaSearch } from "@/components/ui/AreaSearch";
import { images } from "@/content/images";
import { coverage } from "@/content/site";

/** "Do we come to you?": a live locality search over the 43 areas, with the Doon valley as atmosphere. */
export function Coverage() {
  return (
    <section id="areas" aria-labelledby="areas-title" data-track="areas">
      <figure>
        <div className="relative h-[clamp(14rem,36vw,34rem)] bg-paper">
          <Image
            src={images[coverage.image]}
            alt={coverage.imageAlt}
            fill
            sizes="100vw"
            placeholder="blur"
            quality={60}
            className="object-cover"
          />
        </div>
        <figcaption className="container-x caption">{coverage.caption}</figcaption>
      </figure>

      <div className="container-x pb-[clamp(4.5rem,10vw,10rem)] pt-14 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="areas-title" data-section-heading className="type-display-l lg:col-span-6">
            {coverage.title}
          </h2>
          <p className="type-lead max-w-[40ch] text-stone lg:col-span-5 lg:col-start-8 lg:self-end">{coverage.intro}</p>
        </div>
        <AreaSearch />
      </div>
    </section>
  );
}
