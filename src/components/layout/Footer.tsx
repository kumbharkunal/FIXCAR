import { MapPinIcon } from "@phosphor-icons/react/dist/ssr/MapPin";
import { FooterMotionLoader } from "@/components/motion/loaders";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Wordmark } from "@/components/ui/Wordmark";
import { business, footer, navLinks, services, ui } from "@/content/site";
import { waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer
      id="footer"
      data-inert-group
      data-fab-hide
      data-track="footer"
      className="surface-racing cv-auto relative overflow-hidden pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <div className="container-x grid gap-12 pt-16 lg:grid-cols-12 lg:pt-24">
        <p className="type-display-m max-w-[16ch] lg:col-span-4">{footer.tagline}</p>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <div className="col-span-2 sm:col-span-1">
            <h2 className="type-small text-limewash/75">{footer.columns.contact}</h2>
            <ul className="mt-4 grid gap-1">
              <li>
                <a className="link footer-link inline-flex min-h-11 items-center" href={business.phone.href}>
                  {business.phone.display}
                </a>
              </li>
              <li>
                <a className="link footer-link inline-flex min-h-11 items-center" href={waLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a className="link footer-link inline-flex min-h-11 items-center break-all" href={business.email.href}>
                  {business.email.address}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label={ui.footerNav}>
            <h2 className="type-small text-limewash/75">{footer.columns.explore}</h2>
            <ul className="mt-4 grid gap-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a className="link footer-link inline-flex min-h-11 items-center" href={`#${link.id}`}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="link footer-link inline-flex min-h-11 items-center" href={business.blogUrl} target="_blank" rel="noopener noreferrer">
                  {footer.blogLink}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="type-small text-limewash/75">{footer.columns.services}</h2>
            <ul className="mt-4 grid gap-1">
              {services.map((service) => (
                <li key={service.id}>
                  <a className="link footer-link inline-flex min-h-11 items-center" href="#services">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The workshop: address and directions above a full-width map. */}
      <div className="container-x mt-16 lg:mt-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6" data-map-text>
          <div>
            <h2 className="type-small text-limewash/75">{footer.columns.workshop}</h2>
            <address className="type-lead mt-3 max-w-[34ch] not-italic">{business.address.full}</address>
          </div>
          <a className="btn btn-ghost min-h-12 shrink-0" href={business.google.directionsUrl} target="_blank" rel="noopener noreferrer">
            {ui.getDirections}
          </a>
        </div>
        <div className="mt-8 lg:mt-10">
          <MapEmbed
            src={business.google.mapEmbedUrl}
            title={footer.mapTitle}
            placeholder={
              <>
                <MapPinIcon size={30} weight="fill" className="map-pin" />
                <span>{footer.mapLoading}</span>
              </>
            }
          />
        </div>
      </div>

      <div className="container-x mt-14 flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-1">
          <a
            href={business.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={business.social.instagram.label}
            className="grid size-11 place-items-center rounded-pill"
          >
            <BrandLogo name="instagram" size={26} />
          </a>
          <a
            href={business.social.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={business.social.facebook.label}
            className="grid size-11 place-items-center rounded-pill"
          >
            <BrandLogo name="facebook" size={26} />
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ui.whatsAppFab}
            className="grid size-11 place-items-center rounded-pill"
          >
            <BrandLogo name="whatsapp" size={26} />
          </a>
        </div>
        <p className="type-small">{footer.copyright}</p>
      </div>

      <div className="container-x mt-10" data-footer-wordmark>
        <Wordmark className="h-auto w-full text-limewash" title={business.wordmark} />
      </div>
      <p className="container-x mt-6 type-small text-limewash/75">{footer.liveSiteNote}</p>
      <FooterMotionLoader />
    </footer>
  );
}
