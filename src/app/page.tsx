import { BrandsMarquee } from "@/components/sections/BrandsMarquee";
import { Checklist } from "@/components/sections/Checklist";
import { Coverage } from "@/components/sections/Coverage";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Founder } from "@/components/sections/Founder";
import { Hero } from "@/components/sections/Hero";
import { Journal } from "@/components/sections/Journal";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { autoRepairJsonLd, faqPageJsonLd, toJsonLd } from "@/lib/jsonld";

/** The whole page must stay static (prerendered once, served from the CDN). */
export const ensureStatic = "navigation";

export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} data-inert-group>
      <Hero />
      <BrandsMarquee />
      <Services />
      <Process />
      <Founder />
      <Checklist />
      <Numbers />
      <Reviews />
      <Coverage />
      <Faq />
      <Journal />
      <FinalCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(autoRepairJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqPageJsonLd()) }} />
    </main>
  );
}
