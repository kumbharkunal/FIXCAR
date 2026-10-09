import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import Image from "next/image";
import { ServicesMotionLoader } from "@/components/motion/loaders";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ServicesRail } from "@/components/ui/ServicesRail";
import { images } from "@/content/images";
import { services, servicesSection, ui, whatsappCopy } from "@/content/site";
import { waLink } from "@/lib/whatsapp";

/**
 * Six service bays. Touch: a native horizontal swipe with scroll-snap and a progress line.
 * Desktop: the row pins and scroll moves the bays sideways, with a sticky index that
 * highlights the bay in view (GSAP, loaded lazily). Without GSAP or with reduced motion,
 * the row stays natively scrollable and the index links still work.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" data-track="services" className="section overflow-x-clip">
      <div className="container-x">
        <h2 id="services-title" data-section-heading className="type-display-l">
          {servicesSection.title}
        </h2>
        <p className="type-lead mt-5 max-w-[48ch] text-stone">{servicesSection.intro}</p>
      </div>

      <div data-services-pin className="mt-12 lg:mt-16">
        <div className="container-x lg:grid lg:grid-cols-12 lg:gap-6">
          <nav aria-label={ui.servicesNav} className="hidden lg:col-span-3 lg:block">
            <ol data-services-index className="grid gap-1 border-l border-hairline">
              {services.map((service, i) => (
                <li key={service.id}>
                  <a
                    href={`#service-${service.id}`}
                    aria-current={i === 0 ? "true" : undefined}
                    className="services-index-link"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div data-services-viewport className="services-viewport lg:col-span-9">
            <ServicesRail>
              {services.map((service) => (
                <li key={service.id} id={`service-${service.id}`} data-bay className="services-bay">
                  <div className="frame aspect-[4/5]">
                    <Image
                      src={images[service.image]}
                      alt={service.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 23rem, 84vw"
                      placeholder="blur"
                      quality={60}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="type-display-m mt-6">{service.name}</h3>
                  <p className="mt-3 max-w-[34ch]">{service.outcome}</p>
                  <ul className="mt-4 grid gap-1.5">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 type-small text-stone">
                        <CheckIcon size={16} weight="bold" className="mt-0.5 shrink-0 text-racing" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(whatsappCopy.bookService(service.bookingPhrase))}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={`service-${service.id}`}
                    className="btn btn-primary has-glyph mt-7"
                  >
                    <BrandLogo name="whatsapp" size={28} id={`bay-${service.id}`} />
                    {servicesSection.bookThis}
                    <span className="sr-only">: {service.name}</span>
                  </a>
                </li>
              ))}
            </ServicesRail>
          </div>
        </div>
      </div>

      <div className="container-x mt-14 lg:mt-20">
        <h3 className="type-small text-stone">{servicesSection.moreTitle}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {servicesSection.more.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <ServicesMotionLoader />
    </section>
  );
}
