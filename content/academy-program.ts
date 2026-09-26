/**
 * Academy programme — the document layer behind `/academy` and its children.
 *
 * ── THE DEMO CONVENTION (inherited from content/platform.ts) ────────────────
 *   source: "documented"  — stated in the brief or traceable to John's public
 *                           properties. Safe to present as fact.
 *   source: "demo"        — STRUCTURE ONLY.
 *
 * *Making Tones* is the one documented teaching credit, so it is the spine of
 * the programme and the only class whose description is stated as fact. Every
 * other class, lesson format and membership tier is a slot awaiting client
 * detail: its shape is real, its content is not.
 *
 * Fees are `null` everywhere and render as "To be confirmed". A number here
 * would be a fabrication about a real person's livelihood.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { services } from "./site";
import { academy } from "./platform";
import type { Source } from "./platform";

/* ------------------------------------------------------------------ */
/* Classes                                                            */
/* ------------------------------------------------------------------ */

export type AcademyModule = {
  no: string;
  title: string;
  /** `null` renders as "To be confirmed" — never invented. */
  detail: string | null;
  source: Source;
};

export type AcademyClass = {
  slug: string;
  no: string;
  title: string;
  /** One line for cards. */
  blurb: string;
  /** The longer overview for the detail page. */
  overview: string;
  instructor: string;
  level: string | null;
  format: string | null;
  duration: string | null;
  schedule: string | null;
  seats: string | null;
  fee: string | null;
  /** Where the class image comes from. */
  media: string;
  mediaAlt: string;
  learn: { title: string; detail: string | null; source: Source }[];
  modules: AcademyModule[];
  faq: { q: string; a: string }[];
  status: "Documented" | "Placeholder";
  source: Source;
};

const TONES_MEDIA = "84283f_ef3d739726184d7bb9fd48a29b05f32e~mv2.jpg";
const GUITAR_MEDIA = "84283f_7b99efa3c88c47818f1e161be3004497~mv2.jpg";
const ROOM_MEDIA = "84283f_001a8168b5e849299a949999174d7452~mv2.jpg";
const DESK_MEDIA = "84283f_1e6cab8c426f4f47914100814e739541~mv2.jpg";
const STRINGS_MEDIA = "84283f_15e357ae58e84fccb891870666ce240e~mv2.jpg";

export const classes: AcademyClass[] = [
  {
    slug: "making-tones",
    no: "01",
    title: "Making Tones",
    blurb:
      "A live workshop series breaking down professional guitar tones — from theory to multi-effects workflows used in real live and studio environments.",
    overview:
      "Making Tones is the documented teaching series: a live workshop that takes professional guitar tone apart in front of an audience, from the theory underneath it to the multi-effects workflows John actually uses in live and studio environments. Everything else in the academy is built around the same principle — show the working, not the theory of working.",
    instructor: "John Paul",
    level: null,
    format: "Live workshop series",
    duration: null,
    schedule: null,
    seats: null,
    fee: null,
    media: TONES_MEDIA,
    mediaAlt: "Guitar and effects equipment used for the Making Tones workshop",
    learn: [
      {
        title: "Professional tone, from the theory up",
        detail:
          "Why a tone is what it is — the theory underneath it, rather than a list of settings to memorise.",
        source: "documented",
      },
      {
        title: "Multi-effects workflows in real environments",
        detail:
          "The signal-chain workflows used in actual live and studio environments, shown as they are actually used.",
        source: "documented",
      },
    ],
    modules: [
      {
        no: "01",
        title: "Tone theory",
        detail: "The documented subject of the series — detail to be confirmed for the next run.",
        source: "documented",
      },
      {
        no: "02",
        title: "Multi-effects workflows",
        detail: "The documented second half of the series — detail to be confirmed for the next run.",
        source: "documented",
      },
      {
        no: "03",
        title: "Live & studio application",
        detail: null,
        source: "demo",
      },
    ],
    faq: [
      {
        q: "Is Making Tones in person or online?",
        a: "To be confirmed. The series has run as a live workshop; the format, dates and venue for the next run will be announced.",
      },
      {
        q: "How much does it cost?",
        a: "To be confirmed. No fee is published for this series yet.",
      },
      {
        q: "Is it suitable for beginners?",
        a: "To be confirmed — the published material covers professional tone and multi-effects workflows, so the entry point for each run will be stated when dates are announced.",
      },
      {
        q: "Can I book a private lesson instead?",
        a: "Yes — private lessons are a separate part of the academy, built around one player rather than a group.",
      },
    ],
    status: "Documented",
    source: "documented",
  },
  {
    slug: "guitar-tone-lab",
    no: "02",
    title: "Guitar Tone Lab",
    blurb:
      "The Making Tones material taken further — how a tone is actually found, dialled and kept under pressure.",
    overview:
      "A small-group class for players who have already met the tone question and want to work on it properly: finding a tone, holding it across a set, and keeping it when the room changes. Placeholder class — subject matter, schedule and fee await client detail.",
    instructor: "John Paul",
    level: null,
    format: "Small group",
    duration: null,
    schedule: null,
    seats: null,
    fee: null,
    media: GUITAR_MEDIA,
    mediaAlt: "Electric guitar in the studio",
    learn: [
      { title: "Finding a tone deliberately", detail: null, source: "demo" },
      { title: "Holding it across a set", detail: null, source: "demo" },
      { title: "Keeping it when the room changes", detail: null, source: "demo" },
    ],
    modules: [
      { no: "01", title: "Module one", detail: null, source: "demo" },
      { no: "02", title: "Module two", detail: null, source: "demo" },
      { no: "03", title: "Module three", detail: null, source: "demo" },
    ],
    faq: [
      { q: "How much does it cost?", a: "To be confirmed — this class is a placeholder awaiting published detail." },
      { q: "When does it run?", a: "To be confirmed. No schedule has been published for this class." },
      { q: "How many places are there?", a: "To be confirmed." },
    ],
    status: "Placeholder",
    source: "demo",
  },
  {
    slug: "rhythm-and-groove",
    no: "03",
    title: "Rhythm & Groove",
    blurb:
      "Playing in time with feel rather than against a click — the thing that decides whether a band sounds like a band.",
    overview:
      "A small-group class on playing in time with feel rather than against a click. Placeholder class — the subject is drawn from the rhythm work behind John's band and session work, and the curriculum awaits client detail.",
    instructor: "John Paul",
    level: null,
    format: "Small group",
    duration: null,
    schedule: null,
    seats: null,
    fee: null,
    media: STRINGS_MEDIA,
    mediaAlt: "Strings and fretted instruments in the studio",
    learn: [
      { title: "Playing with feel, not against a click", detail: null, source: "demo" },
      { title: "Locking with a band", detail: null, source: "demo" },
      { title: "Where the pocket actually sits", detail: null, source: "demo" },
    ],
    modules: [
      { no: "01", title: "Module one", detail: null, source: "demo" },
      { no: "02", title: "Module two", detail: null, source: "demo" },
      { no: "03", title: "Module three", detail: null, source: "demo" },
    ],
    faq: [
      { q: "How much does it cost?", a: "To be confirmed — this class is a placeholder awaiting published detail." },
      { q: "Is it for guitarists only?", a: "To be confirmed. The instrument mix for this class has not been published." },
    ],
    status: "Placeholder",
    source: "demo",
  },
  {
    slug: "session-craft",
    no: "04",
    title: "Session Craft",
    blurb:
      "How to arrive at a session prepared, and how to get a good take — for players who book studio time of their own.",
    overview:
      "A small-group class for players who book their own studio time: how to arrive prepared, how to get a good take, and how a session actually runs. Placeholder class — curriculum, schedule and fee await client detail.",
    instructor: "John Paul",
    level: null,
    format: "Small group",
    duration: null,
    schedule: null,
    seats: null,
    fee: null,
    media: ROOM_MEDIA,
    mediaAlt: "A working studio room",
    learn: [
      { title: "Arriving prepared", detail: null, source: "demo" },
      { title: "Getting a good take", detail: null, source: "demo" },
      { title: "How a session is actually run", detail: null, source: "demo" },
    ],
    modules: [
      { no: "01", title: "Module one", detail: null, source: "demo" },
      { no: "02", title: "Module two", detail: null, source: "demo" },
      { no: "03", title: "Module three", detail: null, source: "demo" },
    ],
    faq: [
      { q: "How much does it cost?", a: "To be confirmed — this class is a placeholder awaiting published detail." },
      { q: "Do sessions run in Kolkata?", a: "To be confirmed for this class. Session work is documented in Kolkata and remotely; the venue for the class has not been published." },
    ],
    status: "Placeholder",
    source: "demo",
  },
  {
    slug: "songwriting-and-arrangement",
    no: "05",
    title: "Songwriting & Arrangement",
    blurb:
      "Finding the shape of a song — where it lives, how it breathes, and what each instrument is actually doing.",
    overview:
      "A small-group class on the shape of a song: where it lives, how it breathes, and what each instrument is genuinely doing in it. The subject comes from the documented arrangement and production work. Placeholder class — curriculum, schedule and fee await client detail.",
    instructor: "John Paul",
    level: null,
    format: "Small group",
    duration: null,
    schedule: null,
    seats: null,
    fee: null,
    media: DESK_MEDIA,
    mediaAlt: "A production desk in the studio",
    learn: [
      { title: "Finding the shape of a song", detail: null, source: "demo" },
      { title: "How a song breathes", detail: null, source: "demo" },
      { title: "What each instrument is doing", detail: null, source: "demo" },
    ],
    modules: [
      { no: "01", title: "Module one", detail: null, source: "demo" },
      { no: "02", title: "Module two", detail: null, source: "demo" },
      { no: "03", title: "Module three", detail: null, source: "demo" },
    ],
    faq: [
      { q: "How much does it cost?", a: "To be confirmed — this class is a placeholder awaiting published detail." },
      { q: "Is this the same as production work with John?", a: "No. Production and arrangement as a paid service is documented under Sessions; this is the teaching version of the same subject." },
    ],
    status: "Placeholder",
    source: "demo",
  },
];

export function getClass(slug: string): AcademyClass | undefined {
  return classes.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Private lessons                                                    */
/* ------------------------------------------------------------------ */

/** Lesson focus — the axes a one-to-one session can be steered along. */
export const lessonFocus = [
  { key: "tone", label: "Tone", note: "Finding and holding a sound that is yours." },
  { key: "technique", label: "Technique", note: "The mechanics underneath the playing." },
  { key: "arrangement", label: "Arrangement", note: "What a song is doing, instrument by instrument." },
  { key: "performance", label: "Performance", note: "Playing the room, not just the notes." },
  { key: "production", label: "Production", note: "Programming, arranging and building a record." },
  { key: "other", label: "Something else", note: "Bring the question you actually have." },
] as const;

export const lessonFormats = [
  { key: "online", label: "Online", note: "Remote, with a call." },
  { key: "studio", label: "In studio", note: "Kolkata, in the room." },
] as const;

/** Durations are structural choices; the fee attached to each is unconfirmed. */
export const lessonDurations = [
  { key: "45", label: "45 minutes", note: "One focused thing, worked properly." },
  { key: "60", label: "60 minutes", note: "Room to get through a subject properly." },
  { key: "90", label: "90 minutes", note: "For arrangement or production work." },
] as const;

export const lessonFormats_offered = [
  {
    no: "01",
    title: "Private Lesson",
    body: "A single focused session on whatever you are working on — tone, technique, arrangement, or a specific part you are stuck on.",
    specs: [
      { label: "Format", value: "One-to-one" },
      { label: "Where", value: "In studio or online" },
      { label: "Duration", value: "45 / 60 / 90 minutes" },
      { label: "Level", value: "Any" },
      { label: "Fee", value: null },
    ],
    cta: "Book a Private Lesson",
    source: "demo" as Source,
  },
  {
    no: "02",
    title: "Lesson Series",
    body: "A run of consecutive lessons that follows one goal to the end — the path a self-taught player most often needs.",
    specs: [
      { label: "Format", value: "One-to-one, repeated" },
      { label: "Where", value: "In studio or online" },
      { label: "Length", value: null },
      { label: "Goal", value: "Set at booking" },
      { label: "Fee", value: null },
    ],
    cta: "Enquire about a series",
    source: "demo" as Source,
  },
];

/* ------------------------------------------------------------------ */
/* Membership                                                         */
/* ------------------------------------------------------------------ */

export type MembershipTier = {
  key: string;
  name: string;
  line: string;
  body: string;
  includes: { label: string; value: string | null }[];
  billing: string | null;
  fee: string | null;
  featured: boolean;
  source: Source;
};

export const memberships: MembershipTier[] = [
  {
    key: "monthly",
    name: "Monthly Access",
    line: "A standing place, month by month.",
    body: "A slot each month plus the workshop series. Suited to a player already working steadily and happy to keep the goal flexible.",
    includes: [
      { label: "Monthly slot", value: "One standing session each month" },
      { label: "Workshops", value: "Included — Making Tones series" },
      { label: "Goal", value: "Reviewed each month" },
      { label: "Commitment", value: null },
    ],
    billing: "Monthly",
    fee: null,
    featured: false,
    source: "demo",
  },
  {
    key: "termly",
    name: "Termly Access",
    line: "A full term of structured work.",
    body: "A complete term with the goal agreed up front and reviewed as it goes. For a player who wants one subject taken all the way down rather than sampled.",
    includes: [
      { label: "Structure", value: "A term of scheduled work" },
      { label: "Goal", value: "Agreed at the start of the term" },
      { label: "Review", value: "Reviewed as the term runs" },
      { label: "Commitment", value: null },
    ],
    billing: "Per term",
    fee: null,
    featured: true,
    source: "demo",
  },
  {
    key: "cohort",
    name: "Cohort Series",
    line: "A group that moves through it together.",
    body: "A fixed group working through the same material across a run of weeks, so the conversation happens between the players as well as with John.",
    includes: [
      { label: "Group", value: "A fixed cohort across a run of weeks" },
      { label: "Review", value: "Group review included" },
      { label: "Cohort size", value: null },
      { label: "Commitment", value: null },
    ],
    billing: "Per cohort",
    fee: null,
    featured: false,
    source: "demo",
  },
];

export const membershipPromise = {
  headline: ["Learn", "continuously."] as string[],
  intro:
    "Membership is ongoing access rather than a one-off session — a standing place in the academy, with the workshops included.",
  pillars: [
    { title: "Access", body: "A standing slot, on a rhythm that suits how you actually practise." },
    { title: "Classes", body: "The workshop series, including Making Tones, as it runs." },
    { title: "Workshops", body: "The live sessions where the craft is taken apart in public." },
    { title: "Resources", body: "To be confirmed — tone references, exercises and session notes." },
    { title: "Community", body: "Other players working on the same problems, in the same room." },
  ],
  note: academy.note,
  flow: academy.flow,
  flowNote: academy.flowNote,
};

export { services };
