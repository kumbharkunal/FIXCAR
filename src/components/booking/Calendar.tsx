"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { booking } from "@/content/site";
import { cn } from "@/lib/cn";

/** yyyy-mm-dd for a local date. */
export const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const fromIso = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date: Date, months: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
};

const monthFormat = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
const dayFormat = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
// India starts the week on Sunday (Intl week info for en-IN).
const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2026, 1, 1 + i)).map((date) => ({
  short: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
  long: new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(date),
}));

interface CalendarProps {
  /** Selected date as yyyy-mm-dd, or "". */
  value: string;
  onChange: (iso: string) => void;
  /** Move focus into the calendar on mount (when it opens as a popover). */
  autoFocus?: boolean;
  /** Escape inside the calendar (the popover closes). */
  onEscape?: () => void;
}

/**
 * A month calendar for picking a booking date, from today onwards. One date button is in
 * the tab order; arrow keys move by day and week, Page Up and Down by month, Home and End
 * to the start and end of the week, Enter or Space picks.
 */
export function Calendar({ value, onChange, autoFocus = false, onEscape }: CalendarProps) {
  const headingId = useId();
  const gridRef = useRef<HTMLTableElement>(null);
  const moved = useRef(autoFocus);
  const [today] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [focused, setFocused] = useState(() => (value ? fromIso(value) : today));
  const month = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const isCurrentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();

  // Sunday-first grid of the focused month, with blank cells before the 1st.
  const lead = month.getDay();
  const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array.from({ length: lead }, () => null), ...Array.from({ length }, (_, i) => addDays(month, i))];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const focusedIso = toIso(focused);
  const clamp = (date: Date) => (date < today ? today : date);

  // After keyboard moves (or on open), focus follows the focused date.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusedIso}"]`)?.focus();
  }, [focusedIso]);

  const move = (date: Date) => {
    moved.current = true;
    setFocused(clamp(date));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -focused.getDay()),
      End: () => addDays(focused, 6 - focused.getDay()),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    if (event.key === "Escape" && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }
    const next = keys[event.key];
    if (!next) return;
    event.preventDefault();
    move(next());
  };

  const showMonth = (offset: number) => setFocused(clamp(addMonths(focused, offset)));

  return (
    <div className="calendar">
      <div className="calendar-head">
        <p id={headingId} className="calendar-title" aria-live="polite">
          {monthFormat.format(month)}
        </p>
        <div className="flex gap-1">
          <button type="button" className="calendar-nav" aria-label={booking.fields.previousMonth} disabled={isCurrentMonth} onClick={() => showMonth(-1)}>
            <span className="mask-icon icon-caret-left" aria-hidden />
          </button>
          <button type="button" className="calendar-nav" aria-label={booking.fields.nextMonth} onClick={() => showMonth(1)}>
            <span className="mask-icon icon-caret-right" aria-hidden />
          </button>
        </div>
      </div>
      <table ref={gridRef} role="grid" aria-labelledby={headingId} className="calendar-grid">
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day.long} scope="col" abbr={day.long}>
                {day.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find(Boolean)?.toDateString()}>
              {week.map((date, i) => {
                if (!date) return <td key={`blank-${i}`} />;
                const iso = toIso(date);
                const past = date < today;
                const selected = iso === value;
                return (
                  <td key={iso} role="gridcell" aria-selected={selected}>
                    <button
                      type="button"
                      data-date={iso}
                      tabIndex={iso === focusedIso ? 0 : -1}
                      disabled={past}
                      aria-label={dayFormat.format(date)}
                      aria-current={iso === toIso(today) ? "date" : undefined}
                      className={cn("calendar-day", selected && "is-selected")}
                      onKeyDown={onKeyDown}
                      onFocus={() => iso !== focusedIso && setFocused(date)}
                      onClick={() => onChange(iso)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
