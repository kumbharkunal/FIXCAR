import { BookButton } from "@/components/booking/BookButton";
import { MagneticMotionLoader } from "@/components/motion/loaders";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { images } from "@/content/images";
import { business, finalCta, ui } from "@/content/site";

/** Racing green over the dusk hill road: the last invitation, with the workshop address. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" data-fab-hide data-track="final-cta" className="surface-racing cv-auto relative isolate overflow-hidden">
      <Photo
        src={images[finalCta.image]}
        blur={false}
        alt={finalCta.imageAlt}
        fill
        sizes="100vw"
        quality={60}
        className="-z-20 object-cover grayscale-[35%]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-racing/90" />
      <div className="container-x section">
        <h2 id="cta-title" className="type-display-l max-w-[14ch]">
          {finalCta.title}
        </h2>
        <p className="type-lead mt-6 max-w-[40ch] text-limewash/90">{finalCta.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <BookButton source="final-cta" className="btn btn-primary has-glyph min-h-14">
              <BrandLogo name="whatsapp" size={30} />
              {ui.bookOnWhatsApp}
            </BookButton>
          </Magnetic>
          <Magnetic>
            <a href={business.phone.href} className="btn btn-ghost min-h-14" data-track="final-cta">
              {ui.call}
            </a>
          </Magnetic>
          <MagneticMotionLoader />
        </div>
        <p className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-1 type-small text-limewash/90">
          <span>{business.address.full}</span>
          <a className="link inline-flex min-h-11 items-center" href={business.google.directionsUrl} target="_blank" rel="noopener noreferrer">
            {ui.getDirections}
          </a>
        </p>
      </div>
    </section>
  );
}
