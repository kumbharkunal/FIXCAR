"use client";

import { AnimatePresence, LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import { useDeferredValue, useId, useMemo, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { areaAliases, areas, coverage, workshopArea, whatsappCopy, type Area } from "@/content/site";
import { waLink } from "@/lib/whatsapp";

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");

const aliasIndex = new Map(Object.entries(areaAliases).map(([alias, area]) => [normalize(alias), area]));

interface Result {
  list: readonly Area[];
  match?: Area;
  count: number;
}

function search(query: string): Result {
  const q = normalize(query);
  if (!q) return { list: areas, count: areas.length };
  const alias = aliasIndex.get(q);
  const found = areas.filter((area) => normalize(area).includes(q) || alias === area);
  const exact = alias ?? areas.find((area) => normalize(area) === q) ?? (found.length === 1 ? found[0] : undefined);
  return { list: found, match: exact, count: found.length };
}

/**
 * Type an area and the list filters live (Motion layout animation). A match answers
 * "Yes, we come to …" with a pre-filled WhatsApp booking; no match still invites a question.
 * The search icon is rendered on the server and passed in.
 */
export function AreaSearch({ searchIcon }: { searchIcon: ReactNode }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const result = useMemo(() => search(deferred), [deferred]);
  const trimmed = deferred.trim();

  let message: string | null = null;
  let action: { label: string; href: string } | null = null;
  if (trimmed) {
    if (result.match) {
      message = result.match === workshopArea ? coverage.workshopMatch(result.match) : coverage.match(result.match);
      action = { label: coverage.bookFor(result.match), href: waLink(whatsappCopy.bookArea(result.match)) };
    } else if (result.count > 1) {
      message = coverage.partial(result.count);
    } else {
      message = coverage.noMatch(trimmed);
      action = { label: coverage.askOnWhatsApp, href: waLink(whatsappCopy.askArea(trimmed)) };
    }
  }
  const list = trimmed && result.count === 0 ? areas : result.list;
  // Layout animation only while filtering: idle, the list adds no work to other animations.
  const animateLayout = query.trim().length > 0;

  return (
    <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-5">
        <div className="field">
          <label htmlFor={`${id}-area`} className="field-label">
            {coverage.inputLabel}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-stone">{searchIcon}</span>
            <input
              id={`${id}-area`}
              type="search"
              className="input min-h-14 pl-12"
              value={query}
              autoComplete="off"
              spellCheck={false}
              aria-describedby={`${id}-help ${id}-result`}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <p id={`${id}-help`} className="type-small text-stone">
            {coverage.inputHelp}
          </p>
        </div>

        <div id={`${id}-result`} aria-live="polite" className="mt-6 min-h-[7.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {message ? (
              <m.div key={message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <p className="type-display-m">{message}</p>
                {action ? (
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="areas"
                    className="btn btn-primary has-glyph mt-5"
                  >
                    <BrandLogo name="whatsapp" size={28} />
                    {action.label}
                  </a>
                ) : null}
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <LayoutGroup>
        <m.ul layout={animateLayout} className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3" aria-label={coverage.listLabel}>
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((area) => (
              <m.li
                key={area}
                layout={animateLayout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={area === result.match ? "py-1.5 font-semibold text-racing" : "py-1.5"}
              >
                {area}
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </LayoutGroup>
    </div>
  );
}
