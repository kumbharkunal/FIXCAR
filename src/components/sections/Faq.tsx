import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { faqSection, ui, whatsappCopy } from "@/content/site";
import { waLink } from "@/lib/whatsapp";

/**
 * Native exclusive accordion: <details name="faq"> keeps one answer open at a time with
 * correct semantics and no JavaScript. The height animates where the browser supports
 * ::details-content with interpolate-size, and is instant elsewhere.
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" data-track="faq" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-28">
          <h2 id="faq-title" data-section-heading className="type-display-l">
            {faqSection.title}
          </h2>
          <p className="mt-5 max-w-[30ch] text-stone">{faqSection.stillUnsure}</p>
          <a
            href={waLink(whatsappCopy.question)}
            target="_blank"
            rel="noopener noreferrer"
            data-track="faq"
            className="btn btn-primary has-glyph mt-6"
          >
            <BrandLogo name="whatsapp" size={28} id="faq-wa" />
            {ui.askOnWhatsApp}
          </a>
        </div>

        <div className="border-t border-hairline lg:col-span-8">
          {faqSection.items.map((item) => (
            <details key={item.q} name="faq" className="faq-item">
              <summary>
                {item.q}
                <PlusIcon size={22} weight="bold" className="faq-caret text-racing" aria-hidden />
              </summary>
              <p className="max-w-[62ch] pb-7 pr-10">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
