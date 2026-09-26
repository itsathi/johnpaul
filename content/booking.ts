/**
 * Booking — the document layer behind `/sessions/book` (and the lesson booking
 * entry point on `/academy/lessons`).
 *
 * ── THE DEMO CONVENTION (inherited from content/platform.ts) ────────────────
 *   source: "documented"  — stated in the brief or traceable to John's public
 *                           properties. Safe to present as fact.
 *   source: "demo"        — STRUCTURE ONLY.
 *
 * Service types, the instrument list, the Kolkata/remote split and the six-step
 * flow are all real. Availability is generated client-side from the current date
 * rather than hard-coded, and every fee is `null` → "To be confirmed".
 * ───────────────────────────────────────────────────────────────────────────
 */

import { services, contact, instrumentExperience } from "./site";

export { services };

/** The six-step shape of the flow. Rendered as a live progress rail. */
export const bookingSteps = [
  { no: "01", key: "service", title: "Service", note: "What you need." },
  { no: "02", key: "details", title: "Details", note: "What you're bringing." },
  { no: "03", key: "schedule", title: "Schedule", note: "When, and where." },
  { no: "04", key: "budget", title: "Investment", note: "Roughly, in your own words." },
  { no: "05", key: "contact", title: "You", note: "How the studio reaches you." },
  { no: "06", key: "review", title: "Review", note: "Check it before sending." },
] as const;

export type BookingStepKey = (typeof bookingSteps)[number]["key"];

/**
 * The service types on step one. `service` mirrors the four documented services
 * from `content/site.ts`; the two teaching routes borrow the same flow so a
 * lesson enquiry and a session enquiry feel like one system.
 */
export const serviceTypes = [
  {
    key: "live",
    no: "01",
    title: "Live Performance",
    summary: "Touring, festival and show guitar — electric, acoustic or bass.",
    detail:
      "Electric, acoustic and bass guitar for tours, festivals, artist shows and one-off events — anywhere in the world.",
    typical: ["Touring", "Festivals", "Artist shows", "One-off events"],
    source: "documented" as const,
  },
  {
    key: "session",
    no: "02",
    title: "Session Recording",
    summary: "Studio guitars and strings for songs, BGM and jingles.",
    detail:
      "Studio guitars and strings for songs, BGM and jingles — fluent across electric, acoustic, bass, nylon, mandola, mandolin, banjo and ukulele.",
    typical: ["Songs", "BGM", "Jingles", "Studio sessions"],
    source: "documented" as const,
  },
  {
    key: "production",
    no: "03",
    title: "Production & Arrangement",
    summary: "Songs built from the ground up — programming, arranging, producing.",
    detail:
      "Songs built from the ground up — programming, arranging and producing, including signature acoustic-drum programming.",
    typical: ["Programming", "Arrangement", "Production"],
    source: "documented" as const,
  },
  {
    key: "artist",
    no: "04",
    title: "Artist Project",
    summary: "Band production, workshops and the Making Tones series.",
    detail:
      "Band productions, workshops and the Making Tones series — craft shared openly with the next generation of players.",
    typical: ["Band production", "Workshops", "Making Tones"],
    source: "documented" as const,
  },
  {
    key: "lesson",
    no: "05",
    title: "Private Lesson",
    summary: "One-to-one work on whatever you are stuck on.",
    detail:
      "A single focused session built around where you actually are as a player — tone, technique, arrangement or a specific part.",
    typical: ["Tone", "Technique", "Arrangement", "Performance"],
    source: "demo" as const,
  },
];

/** Instruments John plays, straight from the documented list. */
export const instruments = instrumentExperience.items.map((i: { name: string }) => i.name);

/** How the session will happen. */
export const locationOptions = [
  { key: "kolkata", label: "In studio", note: "Kolkata — in the room.", source: "documented" as const },
  { key: "remote", label: "Remote", note: "Production and lessons can run remotely.", source: "documented" as const },
  { key: "touring", label: "On tour", note: "Live work travels — dates move around the tour.", source: "documented" as const },
];

/**
 * Step four asks about investment in *shape* rather than in rupees.
 * A number band here would be a fabricated fee for a real person's work, so the
 * step collects intent and leaves the amount optional and free-text.
 */
export const investmentShapes = [
  { key: "single", label: "One session", note: "A single, focused piece of work." },
  { key: "run", label: "A run of sessions", note: "Something that needs more than one sitting." },
  { key: "project", label: "A whole project", note: "Arrangement, production or a band production." },
  { key: "unsure", label: "Not sure yet", note: "Describe it and the studio will shape it." },
];

/** Optional free-text budget field — the only place an amount may be typed. */
export const budgetField = {
  label: "Indicative budget",
  note: "Optional. Fees are confirmed by the studio for every enquiry — nothing is charged through this site.",
  placeholder: "e.g. a range, or 'flexible'",
};

export const durationOptions = [
  { key: "half-day", label: "Half day", note: "Up to 4 hours." },
  { key: "full-day", label: "Full day", note: "A working day." },
  { key: "multi-day", label: "Multi-day", note: "Touring or a longer studio block." },
  { key: "flexible", label: "Flexible", note: "Still working it out." },
];

/**
 * Availability is generated, not stored: the next N working days from the
 * current date, so the calendar is never stale or fictional-pinned to a
 * recorded session. Nothing here is a real booking.
 */
export function upcomingDates(count = 12): { iso: string; day: number; weekday: string; month: string }[] {
  const out: { iso: string; day: number; weekday: string; month: string }[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (out.length < count) {
    const weekday = cursor.getDay();
    if (weekday !== 0) {
      out.push({
        iso: cursor.toISOString().slice(0, 10),
        day: cursor.getDate(),
        weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(cursor),
        month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(cursor),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export const timeOptions = ["Morning", "Afternoon", "Evening", "Flexible"];

export const bookingCopy = {
  headline: ["Request", "a session."] as string[],
  intro:
    "Six steps, about two minutes. Nothing is confirmed automatically — the studio reads every request and replies with dates and a fee.",
  reassurance: [
    "No payment is taken through this site.",
    "Every request is read by the studio, not auto-confirmed.",
    "Availability shown is indicative; tour dates move.",
  ],
  successTitle: "Request received.",
  successBody:
    "This is a demonstration form — nothing was sent and no one will reply. In production this lands in the studio inbox and the session is confirmed by email.",
  contactHref: `mailto:${contact.email}`,
  channels: contact.channels,
};
