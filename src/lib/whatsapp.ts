import { business, whatsappCopy, type When } from "@/content/site";

/** A wa.me deep link that opens WhatsApp with the message pre-filled (nothing is sent until the user taps send). */
export function waLink(text: string = whatsappCopy.generic) {
  return `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export interface BookingDetails {
  /** The service phrase, for example "a periodic service". */
  servicePhrase?: string;
  brand?: string;
  area?: string;
  when?: When;
  /** ISO date (yyyy-mm-dd) when `when` is "date". */
  date?: string;
  name?: string;
}

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long" });

function formatWhen(when?: When, date?: string) {
  if (when === "today") return "today";
  if (when === "tomorrow") return "tomorrow";
  if (when === "date" && date) {
    const [year, month, day] = date.split("-").map(Number);
    if (year && month && day) return `on ${dateFormat.format(new Date(year, month - 1, day))}`;
  }
  return "";
}

/**
 * Builds the booking message, leaving out anything the user skipped:
 * "Hi Fixcar.in, I'd like to book a periodic service for my Hyundai at Rajpur Road, tomorrow. Name: Ankit."
 */
export function buildBookingMessage(details: BookingDetails) {
  let message = `${whatsappCopy.greeting} I'd like to book ${details.servicePhrase?.trim() || "a car service"}`;
  if (details.brand?.trim()) message += ` for my ${details.brand.trim()}`;
  if (details.area?.trim()) message += ` at ${details.area.trim()}`;
  const when = formatWhen(details.when, details.date);
  if (when) message += `, ${when}`;
  message += ".";
  if (details.name?.trim()) message += ` Name: ${details.name.trim()}.`;
  return message;
}
