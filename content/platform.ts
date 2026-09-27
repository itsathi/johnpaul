/**
 * Platform content — the commercial, community and archive layers that sit
 * alongside the artist's story in `content/site.ts`.
 *
 * ── THE DEMO CONVENTION ────────────────────────────────────────────────────
 * `content/site.ts` holds copy drawn from John's public online properties and
 * the documented brief, and states plainly: *nothing is invented*. This file
 * keeps that rule while adding structure the client asked for but has not yet
 * populated. Every entry is therefore tagged:
 *
 *   source: "documented"  — stated in the brief or traceable to John's public
 *                           properties. Safe to present as fact.
 *   source: "demo"        — STRUCTURE ONLY. The shape of a lesson, class,
 *                           membership or product, with no invented pricing,
 *                           no invented name for a real product, and no claim
 *                           that anything is on sale. Rendered with explicit
 *                           "to be confirmed" states on purpose.
 *
 * Anything with `source: "demo"` should be replaced with client-supplied
 * detail, not edited around. Prices are `null` and render as "Enquire" — a
 * number here would be a fabrication.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type Source = "documented" | "demo";

/* ================================================================== */
/* Navigation — the ecosystem, grouped so the header stays premium      */
/* ================================================================== */

export type NavChild = { label: string; href: string };
export type NavGroup = {
  label: string;
  children: NavChild[];
  /** One line of context shown beside the group's links. */
  note: string;
  /** The single action worth surfacing for this group. */
  cta: NavChild;
};

/**
 * Four top-level groups cover every destination in the multi-page IA
 * (Artist, Music, Academy, Work) without turning the header into a
 * mega-corporate menu.
 *
 * Each group carries its own note and action, so the panel's right-hand column
 * adds context rather than repeating links the group already lists.
 *
 * `href` values are real routes. A leading `#` is still supported and is
 * handled by the smooth-scroll layer, so in-page anchors keep working
 * alongside route navigation.
 */
export const navGroups: NavGroup[] = [
  {
    label: "Artist",
    note: "A guitarist, songwriter and producer shaped by the music of Kolkata.",
    cta: { label: "Hear the music", href: "/music" },
    children: [
      { label: "Who he is", href: "/artist" },
      { label: "The journey", href: "/artist/journey" },
      { label: "Instruments", href: "/artist#instruments" },
      { label: "Kolkata roots", href: "/artist#roots" },
      { label: "The studio", href: "/artist#studio" },
    ],
  },
  {
    label: "Music",
    note: "Originals, the Kalpana project, live sets and everything in between.",
    cta: { label: "Start listening", href: "/music#listen" },
    children: [
      { label: "Now playing", href: "/music#listen" },
      { label: "Releases", href: "/music#releases" },
      { label: "Kalpana", href: "/music/kalpana" },
      { label: "Yosemite's Hathi", href: "/music/yosemites-hathi" },
      { label: "Live & touring", href: "/music#live" },
      { label: "Collaborations", href: "/music#collab" },
    ],
  },
  {
    label: "Academy",
    note: "One-to-one work, small classes and ongoing access — craft handed over properly.",
    cta: { label: "Start learning", href: "/academy" },
    children: [
      { label: "Academy", href: "/academy" },
      { label: "Private lessons", href: "/academy/lessons" },
      { label: "Classes", href: "/academy/classes" },
      { label: "Making Tones", href: "/academy/classes/making-tones" },
      { label: "Membership", href: "/academy/membership" },
    ],
  },
  {
    label: "Work",
    note: "Bookings, sessions, production and the practical side of the practice.",
    cta: { label: "Book a session", href: "/sessions/book" },
    children: [
      { label: "Sessions", href: "/sessions" },
      { label: "Request a session", href: "/sessions/book" },
      { label: "Gallery", href: "/gallery" },
      { label: "Shop", href: "/shop" },
      { label: "Cart", href: "/cart" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/* ================================================================== */
/* 1 · The platform — six sides of one professional life                */
/* ================================================================== */

export type Pillar = {
  no: string;
  key: string;
  title: string;
  line: string;
  href: string;
  source: Source;
  children: NavChild[];
};

/* ================================================================== */
export const ecosystem = {
  kicker: "The platform",
  headline: ["One artist.", "Six sides.", "One place."] as string[],
  intro:
    "John Paul's work does not live in one category. It runs from his own records to the rooms other artists record in, from arena stages to his own stage in Kolkata, and into the workshops where he passes the craft on. This site holds all of it together — so one place is enough.",
  seal: {
    overline: "The whole",
    title: "John Paul",
    underline: "in one place",
    note: "Artist · Session player · Live performer · Touring artist · Educator · Collaborator",
  },
  pillars: [
    {
      no: "01",
      key: "music",
      title: "Music",
      line: "Independent releases, the album Kalpana, and everything recorded with other artists.",
      href: "/music",
      source: "documented",
      children: [
        { label: "Now playing", href: "/music#listen" },
        { label: "Releases", href: "/music#releases" },
        { label: "Kalpana", href: "/music/kalpana" },
        { label: "Collaborations", href: "/music#collab" },
      ],
    },
    {
      no: "02",
      key: "artist",
      title: "Artist",
      line: "Who he is, the years that made him, and the instruments he answers to.",
      href: "/artist",
      source: "documented",
      children: [
        { label: "The artist", href: "/artist" },
        { label: "The journey", href: "/artist/journey" },
        { label: "Instruments", href: "/artist#instruments" },
        { label: "Roots", href: "/artist#roots" },
      ],
    },
    {
      no: "03",
      key: "sessions",
      title: "Sessions",
      line: "Book him to record — guitars, strings, arrangement and production.",
      href: "/sessions",
      source: "documented",
      children: [
        { label: "Request a session", href: "/sessions/book" },
        { label: "What he plays", href: "/artist#instruments" },
        { label: "Studio & production", href: "/sessions" },
      ],
    },
    {
      no: "04",
      key: "academy",
      title: "Academy",
      line: "Private lessons, premium classes and ongoing access for players who want to go further.",
      href: "/academy",
      source: "demo",
      children: [
        { label: "Private lessons", href: "/academy/lessons" },
        { label: "Classes", href: "/academy/classes" },
        { label: "Membership", href: "/academy/membership" },
      ],
    },
    {
      no: "05",
      key: "gallery",
      title: "Gallery",
      line: "The archive — live rooms, touring, the studio and everything behind it.",
      href: "/gallery",
      source: "documented",
      children: [
        { label: "Live", href: "/gallery?f=live" },
        { label: "Studio", href: "/gallery?f=studio" },
        { label: "Collaborations", href: "/gallery?f=collabs" },
      ],
    },
    {
      no: "06",
      key: "shop",
      title: "Shop",
      line: "Artist merchandise, physical releases and limited editions.",
      href: "/shop",
      source: "demo",
      children: [
        { label: "Apparel", href: "/shop#apparel" },
        { label: "Music", href: "/shop#music" },
        { label: "Limited editions", href: "/shop#limited" },
      ],
    },
  ] satisfies Pillar[],
  note:
    "Music, Artist, Sessions and Gallery draw on documented work. Academy and Shop are demonstrated as structure — enrolment and catalogue detail to be supplied.",
};

/* ================================================================== */
/* 2 · Sessions — booking the session-player side of the career         */
/* ================================================================== */

export const sessions = {
  kicker: "Sessions",
  headline: ["Book John Paul", "for a session."] as string[],
  intro:
    "A decade of studio work across India's music makes John a first call for records that need a guitar with a point of view. Send the brief — the song, the reference, the deadline — and the session gets scoped around it.",
  /* What he can be booked for, assembled from documented disciplines. */
  scopeNote:
    "Across electric, acoustic, bass, nylon, mandola, mandolin, banjo and ukulele.",
  /* The intended booking journey. Process design, not a claim about terms. */
  flow: [
    {
      no: "01",
      title: "Send the brief",
      body: "The song, the reference track, the deadline and where it needs to sit — a single email is enough to start.",
    },
    {
      no: "02",
      title: "Scope the session",
      body: "Instruments, arrangement, parts and a realistic timeline get agreed before anyone plays a note.",
    },
    {
      no: "03",
      title: "Record",
      body: "Session in Kolkata or remote, with takes reviewed and delivered against the brief.",
    },
  ],
  flowNote:
    "The booking journey shown here is the intended experience. No scheduling engine, payment or CRM is connected in this demonstration build.",
  cta: {
    label: "Book a Session",
    subject: "Session enquiry",
    body: "Email John with the brief and a subject line that says what you need.",
  },
  secondary: {
    label: "See the disciplines",
    href: "#studio",
  },
  source: "demo" as Source,
};

/* ================================================================== */
/* 3 · Academy — teaching, classes and ongoing access                   */
/* ================================================================== */

export type AcademyTrack = {
  key: string;
  no: string;
  title: string;
  intro: string;
  anchorId: string;
  items: AcademyItem[];
};

export type AcademyItem = {
  no: string;
  title: string;
  body: string;
  /** Short attribute pairs rendered under the title. */
  specs: { label: string; value: string | null }[];
  cta: string;
  source: Source;
};

export const academy = {
  kicker: "Academy",
  headline: ["Learn", "with John."] as string[],
  intro:
    "Craft that took a decade to assemble, broken down and handed over properly. One-to-one work for players who want direct correction, small classes for players who want company, and ongoing access for players who want to keep going.",
  /* The one documented teaching credit — everything else is structure. */
  anchor: {
    label: "Already running",
    title: "Making Tones",
    body: "A live workshop series breaking down professional guitar tones — from theory to multi-effects workflows used in real live and studio environments.",
    source: "documented" as Source,
  },
  tracks: [
    {
      key: "lessons",
      no: "01",
      anchorId: "academy-lessons",
      title: "Private Lessons",
      intro:
        "One-to-one sessions with John, built around where you actually are as a player.",
      items: [
        {
          no: "01",
          title: "Private Lesson",
          body: "A single focused session on whatever you are working on — tone, technique, arrangement or a specific part you are stuck on.",
          specs: [
            { label: "Format", value: "One-to-one" },
            { label: "Where", value: "In studio or online" },
            { label: "Duration", value: null },
            { label: "Level", value: "Any" },
            { label: "Fee", value: "To be confirmed, or contact John" },
          ],
          cta: "Book a Private Lesson",
          source: "demo",
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
          source: "demo",
        },
      ],
    },
    {
      key: "classes",
      no: "02",
      anchorId: "academy-classes",
      title: "Premium Classes",
      intro:
        "Small-group classes built around the same disciplines John works in professionally.",
      items: [
        {
          no: "01",
          title: "Guitar Tone Lab",
          body: "The Making Tones material taken further — how a tone is actually found, dialled and kept under pressure.",
          specs: [
            { label: "Format", value: "Small group" },
            { label: "Focus", value: "Tone & signal chain" },
            { label: "Schedule", value: null },
            { label: "Seats", value: null },
            { label: "Fee", value: null },
          ],
          cta: "Enquire about this class",
          source: "demo",
        },
        {
          no: "02",
          title: "Rhythm & Groove",
          body: "Playing in time with feel rather than against a click — the thing that decides whether a band sounds like a band.",
          specs: [
            { label: "Format", value: "Small group" },
            { label: "Focus", value: "Timing & pocket" },
            { label: "Schedule", value: null },
            { label: "Seats", value: null },
            { label: "Fee", value: null },
          ],
          cta: "Enquire about this class",
          source: "demo",
        },
        {
          no: "03",
          title: "Session Craft",
          body: "How to arrive at a session prepared, and how to get a good take — for players who book studio time of their own.",
          specs: [
            { label: "Format", value: "Small group" },
            { label: "Focus", value: "Studio & recording" },
            { label: "Schedule", value: null },
            { label: "Seats", value: null },
            { label: "Fee", value: null },
          ],
          cta: "Enquire about this class",
          source: "demo",
        },
        {
          no: "04",
          title: "Songwriting & Arrangement",
          body: "Finding the shape of a song — where it lives, how it breathes, and what each instrument is actually doing.",
          specs: [
            { label: "Format", value: "Small group" },
            { label: "Focus", value: "Writing & arrangement" },
            { label: "Schedule", value: null },
            { label: "Seats", value: null },
            { label: "Fee", value: null },
          ],
          cta: "Enquire about this class",
          source: "demo",
        },
      ],
    },
    {
      key: "subscriptions",
      no: "03",
      anchorId: "academy-subscriptions",
      title: "Subscriptions",
      intro:
        "Ongoing membership rather than one-off sessions — a standing place in the academy.",
      items: [
        {
          no: "01",
          title: "Monthly Access",
          body: "A standing slot each month, plus the workshop series. Suited to a player already working steadily.",
          specs: [
            { label: "Billing", value: "Monthly" },
            { label: "Includes", value: "Monthly slot + workshops" },
            { label: "Commitment", value: null },
            { label: "Fee", value: null },
          ],
          cta: "View Memberships",
          source: "demo",
        },
        {
          no: "02",
          title: "Termly Access",
          body: "A full term of structured work, with the goal agreed up front and reviewed as it goes.",
          specs: [
            { label: "Billing", value: "Per term" },
            { label: "Includes", value: "Structured term of work" },
            { label: "Commitment", value: null },
            { label: "Fee", value: null },
          ],
          cta: "View Memberships",
          source: "demo",
        },
        {
          no: "03",
          title: "Cohort Series",
          body: "A fixed group that moves through the material together across a run of weeks.",
          specs: [
            { label: "Billing", value: "Per cohort" },
            { label: "Includes", value: "Group series + review" },
            { label: "Cohort size", value: null },
            { label: "Fee", value: null },
          ],
          cta: "View Memberships",
          source: "demo",
        },
      ],
    },
  ] satisfies AcademyTrack[],
  /* The intended platform path, shown as experience rather than as backend. */
  flow: [
    { no: "01", title: "Student", body: "Creates a profile" },
    { no: "02", title: "Class", body: "Chooses a course" },
    { no: "03", title: "Instructor", body: "Assigned or selected" },
    { no: "04", title: "Schedule", body: "Picks a slot" },
    { no: "05", title: "Booking", body: "Confirms and pays" },
    { no: "06", title: "Confirm", body: "Session on the calendar" },
  ],
  flowNote:
    "Shown to communicate the intended experience only. Scheduling, enrolment and payment are not implemented in this build — no class can be booked or paid for yet.",
  ctas: [
    { label: "Book a Private Lesson", href: "#academy-lessons", primary: true },
    { label: "Explore Classes", href: "#academy-classes", primary: false },
    { label: "View Memberships", href: "#academy-subscriptions", primary: false },
  ],
  note:
    "Demonstration structure. Making Tones is the documented teaching credit; lesson formats, class subjects, schedules and pricing are placeholders awaiting client detail.",
  source: "demo" as Source,
};

/* ================================================================== */
/* 4 · Gallery — the visual archive                                     */
/* ================================================================== */

export type GalleryCategory = {
  key: string;
  label: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  meta: string;
  alt: string;
  /** A wix media id, resolved to size by `wix()`. */
  src: string;
  /** Aspect class — the CDN crops to fit, so ratio is a design choice. */
  ratio: string;
  category: string;
  /** Top margin class, used to give the masonry columns an uneven rhythm. */
  offset: string;
};

export const galleryCategories: GalleryCategory[] = [
  { key: "all", label: "Everything" },
  { key: "live", label: "Live" },
  { key: "touring", label: "Touring" },
  { key: "studio", label: "Studio" },
  { key: "sessions", label: "Sessions" },
  { key: "collabs", label: "Collaborations" },
  { key: "behind", label: "Behind the scenes" },
];

export const gallery = {
  kicker: "Gallery",
  headline: ["The rooms", "he plays in."] as string[],
  intro:
    "Arijit Singh Live, his own band's sold-out night in Kolkata, Nikhita Gandhi Live, the studio, and the rooms in between — the visual archive of a working musician.",
  items: [] as GalleryItem[],
  note:
    "Built from existing photography of John. Captions describe the frame only; the archive is ready to be driven by a CMS collection later.",
};

/* ================================================================== */
/* 5 · Shop — merchandise, structured for a real store later            */
/* ================================================================== */

export const shop = {
  kicker: "Shop",
  headline: ["Worn,", "played,", "kept."] as string[],
  intro:
    "Apparel, physical releases and limited editions. The catalogue below is a demonstration of the storefront experience — the layout is built to be driven by a real commerce backend without redesigning the frontend.",
  categories: [
    { key: "all", label: "Everything" },
    {
      key: "music",
      no: "01",
      label: "Music",
      note: "Physical editions of Kalpana — a record released in chapters wants a physical object that gathers them.",
    },
    {
      key: "apparel",
      no: "02",
      label: "Apparel",
      note: "Cut for the stage and the studio. Sizing, fabric and graphics are all still to be decided with the artist.",
    },
    {
      key: "physical",
      no: "03",
      label: "Physical",
      note: "The disc slot alongside the vinyl, held for the same reason.",
    },
    {
      key: "limited",
      no: "04",
      label: "Limited editions",
      note: "Numbered prints, posters and the studio notebook. Edition sizes are undecided, so nothing is for sale yet.",
    },
  ],
  cta: {
    label: "Enquire about the catalogue",
    subject: "Merchandise enquiry",
    body: "Until a store is connected, enquiries go straight to John.",
  },
  note:
    "Demonstration catalogue. No product, price, edition size or stock level shown here is real, and nothing is for sale — the mock data lives behind lib/commerce.ts so a Shopify Storefront API can replace it without touching these components.",
  source: "demo" as Source,
};
