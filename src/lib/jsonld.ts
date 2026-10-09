import { areas, business, faqSection, services } from "@/content/site";
import { siteUrl } from "@/lib/env";

/** LocalBusiness (AutoRepair) structured data. Founder and opening hours are added once the client confirms them. */
export function autoRepairJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${business.liveSiteUrl}/#business`,
    name: business.name,
    url: business.liveSiteUrl,
    description: business.description,
    telephone: business.phone.e164,
    email: business.email.address,
    logo: `${siteUrl}/brand/fixcar-wordmark.svg`,
    image: `${siteUrl}/opengraph-image`,
    foundingDate: String(business.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.countryCode,
    },
    hasMap: business.google.profileUrl,
    areaServed: areas.map((area) => ({ "@type": "Place", name: `${area}, Dehradun` })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.name, description: service.outcome },
      })),
    },
    sameAs: [business.social.instagram.url, business.google.profileUrl],
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSection.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function toJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
