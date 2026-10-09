"use client";

import { track } from "@vercel/analytics";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { areas, booking, brands, business, services, whatsappCopy, type When } from "@/content/site";
import { cn } from "@/lib/cn";
import { buildBookingMessage, waLink } from "@/lib/whatsapp";
import type { BookingPrefill } from "./BookingContext";

interface BookingComposerProps {
  /** "bar": the glass pill in the desktop hero. "sheet": the full form in the booking sheet. */
  variant: "bar" | "sheet";
  initial?: BookingPrefill;
  source: string;
  onSubmitted?: () => void;
  className?: string;
}

/** The earliest bookable date (today, local time), set on the date input after it mounts. */
function setMinToToday(input: HTMLInputElement | null) {
  if (!input || input.min) return;
  const now = new Date();
  input.min = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** Opens WhatsApp in a new tab or the app, from a user gesture. */
function openWhatsApp(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 * Composes a booking message and opens WhatsApp with it. Before JavaScript loads, the
 * form is a plain GET to wa.me with a generic message, so booking always works.
 */
export function BookingComposer({ variant, initial, source, onSubmitted, className }: BookingComposerProps) {
  const id = useId();
  const [serviceId, setServiceId] = useState<string>(initial?.serviceId ?? "");
  const [brand, setBrand] = useState("");
  const [area, setArea] = useState(initial?.area ?? "");
  const [when, setWhen] = useState<When | "">("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");

  const service = services.find((item) => item.id === serviceId);
  const message = buildBookingMessage({
    servicePhrase: service?.bookingPhrase,
    brand: brand && brand !== "other" ? brand : undefined,
    area,
    when: when || undefined,
    date,
    name,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    track("booking_submit", { source, service: serviceId || "none", when: when || "none" });
    openWhatsApp(waLink(message));
    onSubmitted?.();
  };

  const formProps = {
    action: `https://wa.me/${business.whatsapp.number}`,
    method: "get" as const,
    target: "_blank",
    onSubmit,
  };
  const fallbackText = <input type="hidden" name="text" value={whatsappCopy.generic} />;
  const areaList = (
    <datalist id={`${id}-areas`}>
      {areas.map((item) => (
        <option key={item} value={item} />
      ))}
    </datalist>
  );

  const serviceOptions = (
    <>
      <option value="">{booking.fields.servicePlaceholder}</option>
      {services.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
      <option value="other">{booking.fields.serviceOther}</option>
    </>
  );
  const brandOptions = (
    <>
      <option value="">{booking.fields.brandPlaceholder}</option>
      {brands.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
      <option value="other">{booking.fields.brandOther}</option>
    </>
  );

  if (variant === "bar") {
    return (
      <form {...formProps} className={cn("glass flex items-stretch rounded-pill p-1.5", className)} aria-label={booking.sheetTitle}>
        {fallbackText}
        <BarField label={booking.fields.service} htmlFor={`${id}-service`}>
          <select id={`${id}-service`} className="bar-control" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {serviceOptions}
          </select>
        </BarField>
        <BarField label={booking.fields.brand} htmlFor={`${id}-brand`}>
          <select id={`${id}-brand`} className="bar-control" value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brandOptions}
          </select>
        </BarField>
        <BarField label={booking.fields.area} htmlFor={`${id}-area`}>
          <input
            id={`${id}-area`}
            className="bar-control"
            list={`${id}-areas`}
            value={area}
            autoComplete="off"
            placeholder={booking.fields.areaPlaceholder}
            onChange={(e) => setArea(e.target.value)}
          />
          {areaList}
        </BarField>
        <BarField label={booking.fields.when} htmlFor={`${id}-when`}>
          {when === "date" ? (
            <input
              id={`${id}-when`}
              type="date"
              ref={setMinToToday}
              className="bar-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={(e) => {
                if (!e.target.value) setWhen("");
              }}
            />
          ) : (
            <select id={`${id}-when`} className="bar-control" value={when} onChange={(e) => setWhen(e.target.value as When | "")}>
              <option value="">{booking.fields.whenAnyTime}</option>
              {booking.fields.whenOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </BarField>
        <BarField label={booking.fields.nameShort} htmlFor={`${id}-name`} className="hidden xl:flex">
          <input
            id={`${id}-name`}
            className="bar-control"
            placeholder={booking.fields.nameOptional}
            value={name}
            autoComplete="given-name"
            onChange={(e) => setName(e.target.value)}
          />
        </BarField>
        <button type="submit" className="btn btn-primary has-glyph ml-1.5 min-h-14 self-center">
          <BrandLogo name="whatsapp" size={30} />
          {booking.submit}
        </button>
      </form>
    );
  }

  return (
    <form {...formProps} className={cn("grid gap-5", className)}>
      {fallbackText}
      <div className="field">
        <label className="field-label" htmlFor={`${id}-service`}>
          {booking.fields.service}
        </label>
        <div className="select-wrap">
          <select id={`${id}-service`} className="input" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {serviceOptions}
          </select>
          <span className="select-caret" aria-hidden />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`${id}-brand`}>
          {booking.fields.brand}
        </label>
        <div className="select-wrap">
          <select id={`${id}-brand`} className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brandOptions}
          </select>
          <span className="select-caret" aria-hidden />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`${id}-area`}>
          {booking.fields.area}
        </label>
        <input
          id={`${id}-area`}
          className="input"
          list={`${id}-areas`}
          value={area}
          autoComplete="off"
          placeholder={booking.fields.areaPlaceholder}
          onChange={(e) => setArea(e.target.value)}
        />
        {areaList}
      </div>

      <fieldset className="field">
        <legend className="field-label mb-2">{booking.fields.when}</legend>
        <div className="segment">
          {booking.fields.whenOptions.map((option) => (
            <span key={option.value} className="contents">
              <input
                type="radio"
                id={`${id}-when-${option.value}`}
                name={`${id}-when`}
                className="sr-only"
                value={option.value}
                checked={when === option.value}
                onChange={() => setWhen(option.value)}
              />
              <label htmlFor={`${id}-when-${option.value}`}>{option.label}</label>
            </span>
          ))}
        </div>
        {when === "date" ? (
          <div className="field mt-3">
            <label className="field-label" htmlFor={`${id}-date`}>
              {booking.fields.date}
            </label>
            <input id={`${id}-date`} ref={setMinToToday} type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        ) : null}
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor={`${id}-name`}>
          {booking.fields.name}
        </label>
        <input id={`${id}-name`} className="input" value={name} autoComplete="given-name" onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid gap-2">
        <p className="field-label">{booking.previewLabel}</p>
        <p className="rounded-sheet bg-limewash px-5 py-4 type-small text-ink">{message}</p>
      </div>

      <div className="grid gap-3">
        <button type="submit" className="btn btn-primary has-glyph w-full min-h-14">
          <BrandLogo name="whatsapp" size={30} />
          {booking.submit}
        </button>
        <p className="type-small text-stone">{booking.help}</p>
        <a className="link type-small justify-self-start" href={waLink(whatsappCopy.generic)} target="_blank" rel="noopener noreferrer" data-track={`${source}-skip`}>
          {booking.skip}
        </a>
      </div>
    </form>
  );
}

function BarField({ label, htmlFor, children, className }: { label: string; htmlFor: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("bar-field", className)}>
      <label htmlFor={htmlFor} className="text-[0.8125rem] font-semibold leading-none text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}
