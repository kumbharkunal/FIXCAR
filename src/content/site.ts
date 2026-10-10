/**
 * Single source of truth for every piece of Fixcar.in business content.
 * Original wording and edits are documented in docs/CONTENT.md.
 * Components read from here; they never hard-code copy, numbers or URLs.
 */

export type ImageKey =
  | "heroDesktop"
  | "heroMobile"
  | "servicePeriodic"
  | "serviceMechanical"
  | "serviceDiagnostics"
  | "serviceDentingPainting"
  | "serviceWash"
  | "serviceQuickfix"
  | "toolkit"
  | "doonValley"
  | "ctaHillRoad"
  | "founder";

export type IconKey =
  | "MapPin"
  | "Car"
  | "SealCheck"
  | "Wrench"
  | "Phone"
  | "WhatsApp";

/* ------------------------------------------------------------------ */
/* Business                                                            */
/* ------------------------------------------------------------------ */

const placeId = "ChIJwbl4SmArCTkRhdz7hN_e-U4";
const addressForMaps = "Fixcar.in, 14/1 Laxmi Road, Dalanwala, Dehradun";

export const business = {
  name: "Fixcar.in",
  wordmark: "fixcar.in",
  description:
    "Doorstep multi-brand car service in Dehradun: periodic service, repairs, computer diagnostics, denting and painting, and car wash at your home or office.",
  foundingYear: 2022,
  phone: {
    e164: "+918168211587",
    display: "+91 81682 11587",
    short: "81682 11587",
    href: "tel:+918168211587",
  },
  whatsapp: {
    number: "918168211587",
    display: "+91 81682 11587",
  },
  email: {
    address: "fixcar.in@gmail.com",
    href: "mailto:fixcar.in@gmail.com",
  },
  address: {
    street: "14/1 Laxmi Road, near Kidzee School",
    locality: "Dalanwala",
    city: "Dehradun",
    region: "Uttarakhand",
    postalCode: "248001",
    countryCode: "IN",
    short: "14/1 Laxmi Road, near Kidzee School, Dalanwala",
    full: "14/1 Laxmi Road, near Kidzee School, Dalanwala, Dehradun, Uttarakhand 248001",
  },
  google: {
    placeId,
    cid: "5690824655749504133",
    rating: 4.8,
    reviewCount: 61,
    asOfIso: "2026-10-08",
    asOfLabel: "October 2026",
    profileUrl: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
    reviewsUrl: `https://search.google.com/local/reviews?placeid=${placeId}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressForMaps)}&destination_place_id=${placeId}`,
    /** Google Maps embed of the Business Profile (no API key needed). */
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2048.16076567717!2d78.05271191021797!3d30.30595666063414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092b604a78b9c1%3A0x4ef9dedf84fbdc85!2sFixcar.in%20%7C%20Doorstep%20Car%20Service%20%7C%20Best%20Car%20Mechanics%20in%20Dehradun!5e0!3m2!1sen!2sin!4v1791615133576!5m2!1sen!2sin",
  },
  social: {
    instagram: {
      handle: "@fixcar.in",
      url: "https://www.instagram.com/fixcar.in/",
      label: "Fixcar.in on Instagram",
    },
    facebook: {
      /** No public Facebook page found. Demo links to a Facebook search until the client confirms one. */
      url: "https://www.facebook.com/search/top?q=fixcar.in",
      label: "Fixcar.in on Facebook",
      isPlaceholder: true,
    },
  },
  /** Hidden until the client confirms. Google suggests 9:30 am to 7 pm with Monday and Wednesday closed. */
  hours: null as null | { days: string; opens: string; closes: string }[],
  liveSiteUrl: "https://www.fixcar.in",
  blogUrl: "https://www.fixcar.in/car-repair-blog-dehradun",
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type SectionId =
  | "services"
  | "how-it-works"
  | "our-story"
  | "reviews"
  | "areas"
  | "faq";

export const navLinks: { id: SectionId; label: string }[] = [
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "How it works" },
  { id: "our-story", label: "Our story" },
  { id: "reviews", label: "Reviews" },
  { id: "areas", label: "Areas" },
  { id: "faq", label: "FAQ" },
];

export const ui = {
  skipLink: "Skip to content",
  book: "Book",
  bookOnWhatsApp: "Book on WhatsApp",
  call: `Call ${business.phone.short}`,
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuLabel: "Main menu",
  whatsAppFab: "Chat with Fixcar.in on WhatsApp",
  getDirections: "Get directions",
  pauseBrands: "Pause the brand list",
  playBrands: "Play the brand list",
  previousReview: "Previous review",
  nextReview: "Next review",
  mainNav: "Main",
  footerNav: "Footer",
  servicesNav: "Services",
  brandsTitle: "Car brands we service",
  reviewsCarousel: "Customer reviews",
  askOnWhatsApp: "Ask on WhatsApp",
  step: (n: number) => `Step ${n}: `,
} as const;

/* ------------------------------------------------------------------ */
/* Brands and areas                                                    */
/* ------------------------------------------------------------------ */

export const brands = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Honda",
  "Toyota",
  "Kia",
  "Volkswagen",
  "Skoda",
  "Renault",
  "Nissan",
  "MG",
  "Jeep",
  "Ford",
  "Mercedes-Benz",
  "BMW",
  "Audi",
] as const;

export type Brand = (typeof brands)[number];

/** Merged from the home and contact pages (43 unique). "EC Road" is East Canal Road. */
export const areas = [
  "Araghar",
  "Balliwala",
  "Ballupur",
  "Banjarawala",
  "Canal Road",
  "Chakrata Road",
  "Clement Town",
  "Clock Tower",
  "Dalanwala",
  "Defence Colony",
  "Dehradun Cantt",
  "Dharampur",
  "Dobhalwala",
  "East Canal Road",
  "Garhi Cantt",
  "GMS Road",
  "Hathibarkala",
  "Indra Nagar",
  "ISBT",
  "Jakhan",
  "Kaonli",
  "Karanpur",
  "Kaulagarh Road",
  "Majra",
  "Mohabbewala",
  "Mothrowala",
  "Mussoorie Road",
  "Nehru Colony",
  "Niranjanpur",
  "Patel Nagar",
  "Prem Nagar",
  "Race Course",
  "Raipur Road",
  "Rajpur Road",
  "Sahastradhara Road",
  "Sewla Kalan",
  "Shimla Bypass",
  "Shimla Road",
  "Shyampur",
  "Subhash Nagar",
  "Turner Road",
  "Vasant Vihar",
  "Vijay Colony",
] as const;

export type Area = (typeof areas)[number];

/** Local names and spellings people type, mapped to the listed area. */
export const areaAliases: Record<string, Area> = {
  "ghanta ghar": "Clock Tower",
  "ec road": "East Canal Road",
  "e c road": "East Canal Road",
  kanwali: "Kaonli",
  "kanwali road": "Kaonli",
  sahasradhara: "Sahastradhara Road",
  sahastradhara: "Sahastradhara Road",
  "sahastra dhara": "Sahastradhara Road",
  "it park": "Sahastradhara Road",
  rajpur: "Rajpur Road",
  raipur: "Raipur Road",
  premnagar: "Prem Nagar",
  indranagar: "Indra Nagar",
  "hathi barkala": "Hathibarkala",
  "dobhal wala": "Dobhalwala",
  mohabewala: "Mohabbewala",
  "patel nagar": "Patel Nagar",
  "clement town": "Clement Town",
  "clementtown": "Clement Town",
  cantt: "Dehradun Cantt",
  "garhi": "Garhi Cantt",
  "isbt dehradun": "ISBT",
  "bus stand": "ISBT",
  kaulagarh: "Kaulagarh Road",
  chakrata: "Chakrata Road",
  mussoorie: "Mussoorie Road",
  "shimla bypass road": "Shimla Bypass",
  "subhash road": "Subhash Nagar",
  "vasant vihar dehradun": "Vasant Vihar",
};

/** The area where the workshop is. */
export const workshopArea: Area = "Dalanwala";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  headline: "Car service at your gate, anywhere in Dehradun.",
  /** Locked line breaks so the width animation never re-wraps text. */
  lines: {
    desktop: ["Car service at your gate,", "anywhere in Dehradun."],
    mobile: ["Car service", "at your gate,", "anywhere in", "Dehradun."],
  },
  subtext:
    "Periodic service, repairs, diagnostics, denting and car wash for every major brand, done at your home or office.",
  proof: [
    { icon: "MapPin", text: "Doorstep service across Dehradun" },
    { icon: "Car", text: `${brands.length} brands, including Mercedes-Benz, BMW and Audi` },
    { icon: "SealCheck", text: "Genuine parts, transparent pricing" },
  ] satisfies readonly { icon: IconKey; text: string }[],
  image: {
    desktop: "heroDesktop",
    mobile: "heroMobile",
    alt: "A Fixcar.in technician servicing a hatchback parked inside the gate of a lime-washed bungalow, in soft morning light.",
  },
  caption: "We service your car where it is parked, at home or at the office.",
} as const;

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServiceId =
  | "periodic"
  | "mechanical"
  | "diagnostics"
  | "denting-painting"
  | "wash"
  | "quickfix";

export interface Service {
  id: ServiceId;
  name: string;
  outcome: string;
  includes: string[];
  image: ImageKey;
  imageAlt: string;
  /** Used inside the WhatsApp message: "I'd like to book {bookingPhrase}". */
  bookingPhrase: string;
}

export const services: Service[] = [
  {
    id: "periodic",
    name: "Periodic service",
    outcome: "Keep your car running smoothly, with a full health check for safety and performance.",
    includes: [
      "Engine oil replacement",
      "Oil and air filter replacement",
      "Brake inspection",
      "Battery testing",
      "Coolant check and fluid top-up",
      "Complete vehicle health inspection",
    ],
    image: "servicePeriodic",
    imageAlt: "Fresh engine oil being poured into an open engine bay.",
    bookingPhrase: "a periodic service",
  },
  {
    id: "mechanical",
    name: "Engine, clutch and suspension",
    outcome: "Restore your car's reliability, fuel efficiency and driving comfort.",
    includes: [
      "Engine faults and unusual noises",
      "Clutch wear and gearbox problems",
      "Suspension and steering vibrations",
      "Overheating and poor performance",
    ],
    image: "serviceMechanical",
    imageAlt: "A technician working on a car's front suspension beside the wheel arch.",
    bookingPhrase: "an engine, clutch or suspension repair",
  },
  {
    id: "diagnostics",
    name: "Computer diagnostics",
    outcome: "Find the fault fast, so repairs cost less and take less time.",
    includes: [
      "Engine fault codes",
      "ABS issues",
      "Battery problems",
      "Sensor failures",
      "Warning lights",
      "Electronic system errors",
    ],
    image: "serviceDiagnostics",
    imageAlt: "A diagnostic scanner plugged into the port under a car's dashboard.",
    bookingPhrase: "a computer diagnostics check",
  },
  {
    id: "denting-painting",
    name: "Denting and painting",
    outcome: "A factory-quality finish, matched to your car's paint.",
    includes: [
      "Dent removal",
      "Scratch repair",
      "Panel painting",
      "Paint polishing",
      "Accident damage repair",
      "Insurance claim help",
    ],
    image: "serviceDentingPainting",
    imageAlt: "A freshly polished car door panel reflecting the sky.",
    bookingPhrase: "denting and painting",
  },
  {
    id: "wash",
    name: "Car wash and dry-cleaning",
    outcome: "Washed, polished and cleaned inside, without leaving home.",
    includes: ["Exterior car wash", "Interior dry-cleaning", "Body rubbing and polish"],
    image: "serviceWash",
    imageAlt: "Foam being rinsed off a dark car parked at a gate.",
    bookingPhrase: "a car wash and interior dry-cleaning",
  },
  {
    id: "quickfix",
    name: "Battery, tyres, AC and breakdown help",
    outcome: "Quick fixes wherever your car is parked.",
    includes: [
      "Battery testing and replacement",
      "Jump-starts",
      "Tyre replacement",
      "Car AC service",
      "Roadside and breakdown help",
    ],
    image: "serviceQuickfix",
    imageAlt: "A technician replacing a car battery at the kerb.",
    bookingPhrase: "battery, tyre, AC or breakdown help",
  },
];

export const servicesSection = {
  title: "What we fix",
  intro: "For every major brand, from hatchbacks to luxury sedans, at your home, your office or our Dalanwala workshop.",
  bookThis: "Book this service",
  moreTitle: "We also handle",
  more: [
    "Brake repair",
    "Oil and filter change",
    "Coolant and fluid top-ups",
    "Clutch replacement",
    "Gearbox repair",
    "Steering and vibration checks",
    "Car accessories",
    "Pickup and drop for workshop jobs",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export const processSection = {
  title: "How doorstep service works",
  steps: [
    {
      title: "Book on WhatsApp or call",
      body: "Tell us your car, your area and a time that suits you.",
    },
    {
      title: "A technician comes to you",
      body: "At your home or office, anywhere in Dehradun.",
    },
    {
      title: "Serviced in front of you",
      body: "Genuine parts and premium oils, with the work done where you can see it.",
    },
    {
      title: "Pay and drive on",
      body: "Transparent pricing, then you are on your way.",
    },
  ],
  routeStart: "Dalanwala workshop",
  routeEnd: "Your gate",
  workshopNote:
    "Jobs that need a lift or a paint booth go to our Dalanwala workshop, with pickup and drop.",
} as const;

/* ------------------------------------------------------------------ */
/* Founder                                                             */
/* ------------------------------------------------------------------ */

export const founder = {
  title: "Uttarakhand's first female-owned automobile startup.",
  body: [
    "Fixcar.in started in Dehradun in 2022 with a simple idea: car care should come to you.",
    "Expert mechanics bring the garage to your home or office, so you never have to wait at a workshop.",
  ],
  /** Null until the client confirms how the founder wants to be named. */
  name: null as string | null,
  caption: "Founder, Fixcar.in",
  photoAlt: "The founder of Fixcar.in, smiling and holding a framed certificate.",
  quote: {
    text: "Car care should come to you, done honestly and in front of you.",
    approved: false,
    draftNote: "Draft quote, awaiting the founder's approval.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Checklist                                                           */
/* ------------------------------------------------------------------ */

export const checklist = {
  title: "Why Dehradun trusts Fixcar.in",
  cardTitle: "Inspection checklist",
  items: [
    {
      title: "Certified and experienced technicians",
      note: "Certified mechanics who diagnose and repair everything from engine faults to suspension issues.",
    },
    {
      title: "Genuine spare parts and premium engine oils",
      note: "Genuine parts, high-quality lubricants and modern diagnostic equipment.",
    },
    {
      title: "Transparent, affordable pricing",
      note: "Honest pricing, at a lower cost than company service centres.",
    },
    {
      title: "Doorstep car service across Dehradun",
      note: "At your home, office or preferred location, anywhere in the city.",
    },
    {
      title: "Multi-brand car service specialists",
      note: "From Maruti Suzuki and Hyundai to Mercedes-Benz, BMW and Audi.",
    },
    {
      title: "Advanced computer diagnostics",
      note: "Scanners that find engine, ABS, battery and sensor faults quickly.",
    },
    {
      title: "Quick turnaround",
      note: "Many services are finished the same day, at your doorstep.",
    },
    {
      title: "Trusted by hundreds of local car owners",
      note: "Many of them book us again and again.",
    },
  ],
  image: "toolkit" satisfies ImageKey,
  imageAlt: "A flat lay of spanners, sockets, an oil can and fresh filters on a lime-washed surface.",
  caption: "Genuine parts and premium oils, brought to your gate.",
} as const;

/* ------------------------------------------------------------------ */
/* Numbers                                                             */
/* ------------------------------------------------------------------ */

export const numbers = {
  title: "Fixcar.in at a glance",
  readings: [
    { value: business.foundingYear, caption: "the year Fixcar.in started in Dehradun" },
    { value: areas.length, caption: "localities we cover across the city" },
    { value: brands.length, caption: "car brands we service" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

export interface Review {
  /** A sentence quoted verbatim from the review, shown large. */
  pull: string;
  /** The full review, verbatim from fixcar.in. */
  text: string;
  author: string;
}

/** Real testimonials from the fixcar.in home page. Never invent or edit their words. */
export const reviews: Review[] = [
  {
    pull: "I’ve used Fixcar.in five times, and their service has always been excellent.",
    text: "I’ve used Fixcar.in five times, and their service has always been excellent. From regular servicing to car wash and interior dry cleaning, the quality has been consistently impressive. The team is professional, affordable, and the convenience of doorstep service makes the experience even better. Highly recommended.",
    author: "Adv. Kushal Aditya",
  },
  {
    pull: "Booking is simple, the technicians arrive on time, and they take great care of your vehicle.",
    text: "Fixcar.in offers one of the best doorstep car servicing experiences in Dehradun. Booking is simple, the technicians arrive on time, and they take great care of your vehicle. Their service is reliable, affordable, and saves a lot of time. I confidently recommend them to anyone looking for professional car care.",
    author: "Vyom Rastogi",
  },
  {
    pull: "Their response time is even faster than many delivery services.",
    text: "Fixcar.in provides outstanding car service in Dehradun. I’ve used their doorstep service three times, and every experience has been quick, professional, and hassle-free. Their response time is even faster than many delivery services. I highly recommend Fixcar.in to anyone looking for a reliable car garage in Dehradun.",
    author: "Siddharth Kapoor Design Studio",
  },
];

export const reviewsSection = {
  title: "What our customers say",
  rating: `${business.google.rating} on Google, from ${business.google.reviewCount} reviews`,
  ratingNote: `As of ${business.google.asOfLabel}`,
  moreReviews: "More reviews on Google",
  slideLabel: (index: number, total: number) => `Review ${index} of ${total}`,
} as const;

/* ------------------------------------------------------------------ */
/* Coverage                                                            */
/* ------------------------------------------------------------------ */

export const coverage = {
  title: "Do we come to you?",
  intro: `We service cars at homes and offices in ${areas.length} localities across Dehradun.`,
  inputLabel: "Your area",
  inputHelp: "For example, Rajpur Road or Clement Town",
  match: (area: string) => `Yes, we come to ${area}.`,
  workshopMatch: (area: string) => `Yes, we come to ${area}. Our workshop is here too.`,
  partial: (count: number) => `${count} areas match. Pick yours below.`,
  noMatch: (query: string) => `We haven't listed ${query} yet, but we cover most of Dehradun.`,
  bookFor: (area: string) => `Book for ${area}`,
  askOnWhatsApp: "Ask on WhatsApp",
  listLabel: "Localities we cover",
  image: "doonValley" satisfies ImageKey,
  imageAlt: "The Doon valley seen from the hills, with morning haze over the forest.",
  caption: "From Rajpur Road to Clement Town, we cover the Doon valley.",
} as const;

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faqSection = {
  title: "Before you book",
  stillUnsure: "Still unsure? Ask us anything on WhatsApp.",
  items: [
    {
      q: "Do you provide doorstep car service in Dehradun?",
      a: "Yes. Our technicians come to your home or office for periodic servicing, car wash and interior dry-cleaning, battery replacement, jump-starts, minor repairs and inspections. Jobs that need a lift or a paint booth go to our workshop in Dalanwala.",
    },
    {
      q: "Which car brands do you service?",
      a: "All major brands, including Maruti Suzuki, Hyundai, Tata, Mahindra, Honda, Toyota, Kia, MG, Renault, Nissan, Volkswagen, Skoda, Jeep and Ford, and luxury cars from Mercedes-Benz, BMW and Audi.",
    },
    {
      q: "Which areas do you cover?",
      a: "All of Dehradun, including Rajpur Road, Sahastradhara Road, Clement Town, Balliwala, ISBT, Race Course, Patel Nagar and Dalanwala. Check your area in the list above.",
    },
    {
      q: "What makes Fixcar.in different from other garages in Dehradun?",
      a: "We offer affordable, hassle-free doorstep service with expert mechanics and genuine spare parts, so you never have to wait at a workshop.",
    },
    {
      q: "How long does an oil change take?",
      a: "About 30 to 60 minutes.",
    },
    {
      q: "How often should I change my engine oil?",
      a: "Roughly every 5,000 to 10,000 km, or every six months. City driving in Dehradun calls for more frequent changes.",
    },
    {
      q: "How often should I service my car?",
      a: "Every 10,000 km or six months for normal driving. In heavy city traffic, every 7,000 to 8,000 km, and on Uttarakhand's hill roads about every 7,000 km. Your manufacturer's schedule comes first.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Journal                                                             */
/* ------------------------------------------------------------------ */

export interface Post {
  title: string;
  originalTitle: string;
  url: string;
  publishedIso: string;
  readMinutes: number;
  excerpt: string;
}

/** The three latest posts on fixcar.in, linked to the live URLs. */
export const posts: Post[] = [
  {
    title: "7 warning signs your car needs servicing",
    originalTitle: "7 Warning Signs Your Car Needs Servicing | Best Car Service in Dehradun | Fixcar.in",
    url: "https://www.fixcar.in/post/car-service-dehradun",
    publishedIso: "2026-07-31",
    readMinutes: 5,
    excerpt:
      "Your car works hard every day, whether you are commuting through Dehradun's busy roads or heading into the hills of Mussoorie. Here are the seven signs it needs a service, before a small issue becomes a costly repair.",
  },
  {
    title: "Best car garage in Dehradun: repairs, oil change and maintenance",
    originalTitle: "Best Car Garage in Dehradun: Affordable Repairs, Oil Change & Maintenance Guide",
    url: "https://www.fixcar.in/post/best-car-garage-dehradun",
    publishedIso: "2026-04-17",
    readMinutes: 2,
    excerpt: "From oil changes to full repairs: how to choose a good garage in Dehradun, and how often to change your oil.",
  },
  {
    title: "Best car service in Dehradun: a guide to finding good mechanics",
    originalTitle: "Best Car Service in Dehradun: Complete Guide to Finding the Best Car Mechanics & Garages",
    url: "https://www.fixcar.in/post/best-car-service-dehradun",
    publishedIso: "2026-04-17",
    readMinutes: 2,
    excerpt: "What to look for in a car service: transparent pricing, certified mechanics, genuine parts and timely delivery.",
  },
];

export const journalSection = {
  title: "From the Fixcar.in blog",
  allPosts: "All posts on fixcar.in",
  readTime: (minutes: number) => `${minutes} min read`,
} as const;

/* ------------------------------------------------------------------ */
/* Final call to action and footer                                     */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Book your doorstep service",
  body: "Our workshop is in Dalanwala. Our technicians come to you anywhere in Dehradun.",
  image: "ctaHillRoad" satisfies ImageKey,
  imageAlt: "",
} as const;

export const footer = {
  tagline: "Doorstep car service across Dehradun.",
  columns: {
    contact: "Contact",
    explore: "Explore",
    services: "Services",
    follow: "Follow",
    workshop: "Our workshop",
  },
  mapTitle: "Map of the Fixcar.in workshop in Dalanwala, Dehradun",
  mapLoading: "Loading the map",
  blogLink: "Blog",
  copyright: "© 2026 Fixcar.in",
  liveSiteNote: "This is a design demo. The live site is fixcar.in.",
} as const;

/* ------------------------------------------------------------------ */
/* Booking composer and WhatsApp copy                                  */
/* ------------------------------------------------------------------ */

export type When = "today" | "tomorrow" | "date";

export const booking = {
  sheetTitle: "Book a doorstep service",
  close: "Close booking",
  fields: {
    service: "Service",
    servicePlaceholder: "Choose a service",
    serviceOther: "Something else",
    brand: "Car brand",
    brandPlaceholder: "Choose your car",
    brandOther: "Another brand",
    area: "Area",
    areaPlaceholder: "Your area",
    when: "When",
    whenAnyTime: "Any time",
    whenOptions: [
      { value: "today", label: "Today" },
      { value: "tomorrow", label: "Tomorrow" },
      { value: "date", label: "Pick a date" },
    ] satisfies readonly { value: When; label: string }[],
    date: "Date",
    datePlaceholder: "Choose a date",
    calendarLabel: "Choose a date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    name: "Your name (optional)",
    nameShort: "Your name",
    nameOptional: "Optional",
  },
  previewLabel: "Your WhatsApp message",
  submit: "Book on WhatsApp",
  skip: "Skip and just open WhatsApp",
  help: "WhatsApp opens with this message. Nothing is sent until you press send.",
} as const;

export const whatsappCopy = {
  greeting: "Hi Fixcar.in,",
  generic: "Hi Fixcar.in, I'd like to book a car service.",
  fab: "Hi Fixcar.in, I'd like to book a car service.",
  bookService: (phrase: string) => `Hi Fixcar.in, I'd like to book ${phrase}.`,
  bookArea: (area: string) => `Hi Fixcar.in, I'd like to book a car service at ${area}.`,
  askArea: (query: string) => `Hi Fixcar.in, do you come to ${query}?`,
  question: "Hi Fixcar.in, I have a question about my car.",
} as const;

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

export const seo = {
  title: "Doorstep Car Service & Repair in Dehradun | Fixcar.in",
  description:
    "Doorstep car service anywhere in Dehradun: periodic service, repairs, diagnostics, denting, painting and car wash for 17 brands. Book on WhatsApp.",
  ogTitle: "Fixcar.in: car service at your gate, anywhere in Dehradun",
  ogDescription:
    "Periodic service, repairs, diagnostics, denting and car wash for every major brand, done at your home or office.",
  ogImageAlt: "Fixcar.in: car service at your gate, anywhere in Dehradun.",
  ogCardLine: `Doorstep car service for ${brands.length} brands. Book on WhatsApp: ${business.phone.display}`,
  /** Search intents the live site targets today, kept for the new site. */
  intents: [
    "car service in Dehradun",
    "doorstep car service Dehradun",
    "car repair in Dehradun",
    "best garage in Dehradun",
    "best mechanic in Dehradun",
    "doorstep car wash Dehradun",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Client TODOs (also listed in docs/PITCH_NOTES.md)                   */
/* ------------------------------------------------------------------ */

export const clientTodos = [
  "Founder: how should the founder be named on the site? Approve or rewrite the draft quote.",
  "Opening hours: Google suggests 9:30 am to 7 pm with Monday and Wednesday closed. Confirm.",
  "Pickup and drop: the blog says it is available. Confirm before launch.",
  "Facebook: is there a Facebook page? The demo links to a Facebook search.",
  "Instagram: confirm whether @fixcar.in or @fixcar.in_dehradun is the primary account.",
  "Google rating: OK to show 4.8 from 61 reviews (as of October 2026)?",
  "Testimonials: keep the Siddharth Kapoor Design Studio review, or replace it with Google reviews?",
  "Prices and warranty: publish package prices and a service warranty (a competitor already does).",
  "Photography: uniform colours and a half-day shoot to replace the AI images.",
  "Logo colour: racing green (demo) or the current blue (preview with ?accent=blue).",
] as const;
