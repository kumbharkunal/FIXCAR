"use client";

import { track } from "@vercel/analytics";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { booking, brands, business, services, whatsappCopy, type When } from "@/content/site";
import { cn } from "@/lib/cn";
import { buildBookingMessage, waLink } from "@/lib/whatsapp";
import { AreaCombobox } from "./AreaCombobox";
import type { BookingPrefill } from "./BookingContext";
import { Select, type SelectOption } from "./Select";

// The calendar only loads once someone chooses "Pick a date".
const Calendar = dynamic(() => import("./Calendar").then((mod) => mod.Calendar), {
  ssr: false,
  loading: () => <div className="calendar-placeholder" aria-hidden />,
});

// The placeholder lives in the field, not in the list.
const serviceOptions: SelectOption[] = [
  ...services.map((item) => ({ value: item.id, label: item.name })),
  { value: "other", label: booking.fields.serviceOther },
];
const brandOptions: SelectOption[] = [
  ...brands.map((item) => ({ value: item, label: item })),
  { value: "other", label: booking.fields.brandOther },
];
const whenOptions: SelectOption[] = [{ value: "", label: booking.fields.whenAnyTime }, ...booking.fields.whenOptions];

const shortDate = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
/** "Sat, 11 Oct" for a yyyy-mm-dd date. */
function formatShortDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return shortDate.format(new Date(year, month - 1, day));
}

interface BookingComposerProps {
  /** "bar": the glass pill in the desktop hero. "sheet": the full form in the booking sheet. */
  variant: "bar" | "sheet";
  initial?: BookingPrefill;
  source: string;
  onSubmitted?: () => void;
  className?: string;
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const service = services.find((item) => item.id === serviceId);
  const message = buildBookingMessage({
    servicePhrase: service?.bookingPhrase,
    brand: brand && brand !== "other" ? brand : undefined,
    area,
    when: when || undefined,
    date,
    name,
  });

  /** Closes the bar's calendar; without a picked date, "When" goes back to "Any time". */
  const closeCalendar = (picked?: string, refocus = true) => {
    setCalendarOpen(false);
    if (picked) setDate(picked);
    else if (!date) setWhen("");
    if (refocus) document.getElementById(`${id}-when`)?.focus();
  };

  // A pointer press outside the open calendar closes it.
  const closeCalendarRef = useRef(closeCalendar);
  useEffect(() => {
    closeCalendarRef.current = closeCalendar;
  });
  useEffect(() => {
    if (!calendarOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!calendarRef.current?.contains(event.target as Node)) closeCalendarRef.current(undefined, false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [calendarOpen]);

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
  if (variant === "bar") {
    return (
      <form {...formProps} className={cn("glass flex items-stretch rounded-pill p-1.5", className)} aria-label={booking.sheetTitle}>
        {fallbackText}
        <BarField label={booking.fields.service} htmlFor={`${id}-service`} className="grow-[1.35]">
          <Select
            id={`${id}-service`}
            labelId={`${id}-service-label`}
            variant="bar"
            value={serviceId}
            options={serviceOptions}
            placeholder={booking.fields.servicePlaceholder}
            onChange={setServiceId}
          />
        </BarField>
        <BarField label={booking.fields.brand} htmlFor={`${id}-brand`} className="grow-[1.35]">
          <Select
            id={`${id}-brand`}
            labelId={`${id}-brand-label`}
            variant="bar"
            value={brand}
            options={brandOptions}
            placeholder={booking.fields.brandPlaceholder}
            onChange={setBrand}
          />
        </BarField>
        <BarField label={booking.fields.area} htmlFor={`${id}-area`}>
          <AreaCombobox id={`${id}-area`} variant="bar" value={area} placeholder={booking.fields.areaPlaceholder} onChange={setArea} />
        </BarField>
        <BarField label={booking.fields.when} htmlFor={`${id}-when`}>
          <Select
            id={`${id}-when`}
            labelId={`${id}-when-label`}
            variant="bar"
            value={when}
            options={whenOptions}
            placeholder={booking.fields.whenAnyTime}
            display={when === "date" ? (date ? formatShortDate(date) : booking.fields.datePlaceholder) : undefined}
            onChange={(next) => {
              if (next === "date") {
                setWhen("date");
                setCalendarOpen(true);
              } else {
                setWhen(next as When | "");
                setDate("");
                setCalendarOpen(false);
              }
            }}
          />
          {calendarOpen ? (
            <div ref={calendarRef} role="dialog" aria-label={booking.fields.calendarLabel} className="popover popover-calendar">
              <Calendar value={date} autoFocus onChange={(picked) => closeCalendar(picked)} onEscape={() => closeCalendar()} />
            </div>
          ) : null}
        </BarField>
        <BarField label={booking.fields.nameShort} htmlFor={`${id}-name`} className="hidden grow-[0.8] xl:flex">
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
        <label id={`${id}-service-label`} className="field-label" htmlFor={`${id}-service`}>
          {booking.fields.service}
        </label>
        <Select
          id={`${id}-service`}
          labelId={`${id}-service-label`}
          variant="field"
          value={serviceId}
          options={serviceOptions}
          placeholder={booking.fields.servicePlaceholder}
          onChange={setServiceId}
        />
      </div>

      <div className="field">
        <label id={`${id}-brand-label`} className="field-label" htmlFor={`${id}-brand`}>
          {booking.fields.brand}
        </label>
        <Select
          id={`${id}-brand`}
          labelId={`${id}-brand-label`}
          variant="field"
          value={brand}
          options={brandOptions}
          placeholder={booking.fields.brandPlaceholder}
          onChange={setBrand}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`${id}-area`}>
          {booking.fields.area}
        </label>
        <AreaCombobox id={`${id}-area`} variant="field" value={area} placeholder={booking.fields.areaPlaceholder} onChange={setArea} />
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
          <div role="group" aria-label={booking.fields.date} className="calendar-panel mt-3">
            <Calendar value={date} onChange={setDate} />
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
      <label id={`${htmlFor}-label`} htmlFor={htmlFor} className="text-[0.8125rem] font-semibold leading-none text-stone">
        {label}
      </label>
      {children}
    </div>
  );
}
