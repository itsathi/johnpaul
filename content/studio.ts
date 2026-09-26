/**
 * Studio — the document layer behind `/studio` (admin) and the student view.
 *
 * ── THE DEMO CONVENTION (inherited from content/platform.ts) ────────────────
 *   source: "documented"  — stated in the brief or traceable to John's public
 *                           properties. Safe to present as fact.
 *   source: "demo"        — STRUCTURE ONLY.
 *
 * EVERYTHING in this file is demo data with `source: "demo"`. These are not
 * students, not bookings, not orders and not revenue. A dashboard that quietly
 * implied real people were enrolled in a real academe would be the worst
 * possible failure for this build, so each surface carries a standing
 * `demoBanner` string and the numbers are visibly illustrative.
 *
 * The shapes are the point: they are the columns a real backend would fill.
 * ───────────────────────────────────────────────────────────────────────────
 */

import type { Source } from "./platform";
import { classes, memberships } from "./academy-program";
import { releases } from "./releases";

/** Shown on every internal surface so the demo never reads as a live system. */
export const demoBanner =
  "Demonstration interface. Every record below is illustrative placeholder data — no real students, bookings, orders or revenue.";

/* ------------------------------------------------------------------ */
/* Dashboard                                                          */
/* ------------------------------------------------------------------ */

export type Metric = {
  key: string;
  label: string;
  value: string;
  delta: string | null;
  note: string;
  source: Source;
};

export const metrics: Metric[] = [
  { key: "requests", label: "Open session requests", value: "12", delta: null, note: "Awaiting a reply from the studio", source: "demo" },
  { key: "students", label: "Active students", value: "48", delta: null, note: "Across lessons, classes and memberships", source: "demo" },
  { key: "orders", label: "Store enquiries", value: "9", delta: null, note: "Unpriced — awaiting published editions", source: "demo" },
  { key: "chapters", label: "Chapters released", value: "4 / 8", delta: null, note: "Kalpana, released in chapters", source: "documented" },
];

export type Activity = {
  id: string;
  at: string;
  kind: "request" | "enrolment" | "enquiry" | "content";
  title: string;
  detail: string;
  source: Source;
};

export const activity: Activity[] = [
  { id: "a1", at: "2h ago", kind: "request", title: "Session request — Live Performance", detail: "Festival date, location to be confirmed", source: "demo" },
  { id: "a2", at: "5h ago", kind: "content", title: "Chapter 04 published", detail: "Kalpana — release notes to follow", source: "demo" },
  { id: "a3", at: "Yesterday", kind: "enrolment", title: "Enrolment — Making Tones", detail: "Awaiting cohort placement", source: "demo" },
  { id: "a4", at: "Yesterday", kind: "enquiry", title: "Vinyl enquiry — Kalpana", detail: "Edition size requested", source: "demo" },
  { id: "a5", at: "2d ago", kind: "request", title: "Session request — Production & Arrangement", detail: "Band production, remote", source: "demo" },
  { id: "a6", at: "3d ago", kind: "content", title: "Biography updated", detail: "Review against public properties", source: "demo" },
];

export const pipeline = [
  { key: "chapters", label: "Chapters", value: 8, done: 4, source: "documented" as Source },
  { key: "classes", label: "Classes", value: classes.length, done: 1, source: "demo" as Source },
  { key: "tiers", label: "Membership tiers", value: memberships.length, done: 0, source: "demo" as Source },
  { key: "releases", label: "Releases", value: releases.length, done: 2, source: "documented" as Source },
];

/* ------------------------------------------------------------------ */
/* Session requests                                                   */
/* ------------------------------------------------------------------ */

export type RequestRow = {
  id: string;
  who: string;
  service: string;
  when: string;
  where: string;
  status: "New" | "Replied" | "Confirmed" | "Closed";
  source: Source;
};

export const sessionRequests: RequestRow[] = [
  { id: "SR-014", who: "A. Chatterjee", service: "Live Performance", when: "Date to be confirmed", where: "Touring", status: "New", source: "demo" },
  { id: "SR-013", who: "R. Menon", service: "Production & Arrangement", when: "Flexible", where: "Remote", status: "New", source: "demo" },
  { id: "SR-012", who: "S. Bose", service: "Session Recording", when: "Full day", where: "Kolkata", status: "Replied", source: "demo" },
  { id: "SR-011", who: "M. Iyer", service: "Private Lesson", when: "Next week", where: "Online", status: "Confirmed", source: "demo" },
  { id: "SR-010", who: "K. Dutta", service: "Live Performance", when: "To be confirmed", where: "Kolkata", status: "Closed", source: "demo" },
];

/* ------------------------------------------------------------------ */
/* Academy admin                                                      */
/* ------------------------------------------------------------------ */

export type RosterRow = {
  id: string;
  name: string;
  track: string;
  progress: number;
  next: string;
  status: "Active" | "Paused" | "Waitlist";
  source: Source;
};

export const roster: RosterRow[] = [
  { id: "ST-01", name: "A. Sharma", track: "Private Lessons", progress: 72, next: "Tone — Fri", status: "Active", source: "demo" },
  { id: "ST-02", name: "D. Roy", track: "Making Tones", progress: 40, next: "Cohort 02", status: "Active", source: "demo" },
  { id: "ST-03", name: "P. Nair", track: "Private Lessons", progress: 18, next: "To be scheduled", status: "Paused", source: "demo" },
  { id: "ST-04", name: "T. Das", track: "Songwriting & Arrangement", progress: 0, next: "Waitlist", status: "Waitlist", source: "demo" },
  { id: "ST-05", name: "N. Ghosh", track: "Membership", progress: 55, next: "Term review", status: "Active", source: "demo" },
];

/** Curriculum state per class, so the CMS has something honest to render. */
export const curriculumStatus = classes.map((c) => ({
  slug: c.slug,
  title: c.title,
  modules: c.modules.length,
  detailed: c.modules.filter((m) => m.detail !== null).length,
  schedule: c.schedule,
  fee: c.fee,
  source: c.source,
}));

/* ------------------------------------------------------------------ */
/* Store admin                                                        */
/* ------------------------------------------------------------------ */

export type InventoryRow = {
  handle: string;
  title: string;
  category: string;
  price: string | null;
  stock: string | null;
  status: "DRAFT" | "ACTIVE";
  source: Source;
};

export const inventory: InventoryRow[] = [
  { handle: "music-vinyl-kalpana", title: "Vinyl — Kalpana", category: "Music", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "physical-cd-kalpana", title: "CD — Kalpana", category: "Physical", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "limited-print-kalpana", title: "Signed Print", category: "Limited", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "apparel-tee-tour", title: "Tour Tee", category: "Apparel", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "apparel-tee-studio", title: "Studio Tee", category: "Apparel", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "limited-poster-kalpana", title: "Poster", category: "Limited", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "apparel-cap", title: "Cap", category: "Apparel", price: null, stock: null, status: "DRAFT", source: "demo" },
  { handle: "limited-notebook", title: "Notebook", category: "Limited", price: null, stock: null, status: "DRAFT", source: "demo" },
];

/* ------------------------------------------------------------------ */
/* CMS                                                                */
/* ------------------------------------------------------------------ */

export type Collection = {
  key: string;
  label: string;
  entries: number;
  updated: string;
  owner: string;
  href: string;
  state: "Published" | "In review" | "Draft";
  source: Source;
};

export const collections: Collection[] = [
  { key: "releases", label: "Releases & chapters", entries: releases.length, updated: "3d ago", owner: "Studio", href: "/studio/releases", state: "Published", source: "documented" },
  { key: "classes", label: "Academy classes", entries: classes.length, updated: "5h ago", owner: "Academy", href: "/studio/academy", state: "In review", source: "demo" },
  { key: "sessions", label: "Session services", entries: 5, updated: "1w ago", owner: "Studio", href: "/studio/sessions", state: "Published", source: "documented" },
  { key: "shop", label: "Catalogue", entries: 8, updated: "2d ago", owner: "Studio", href: "/studio/shop", state: "Draft", source: "demo" },
  { key: "bio", label: "Biography & journey", entries: 9, updated: "3d ago", owner: "Studio", href: "/artist/journey", state: "Published", source: "documented" },
  { key: "gallery", label: "Gallery archive", entries: 28, updated: "1w ago", owner: "Studio", href: "/gallery", state: "Published", source: "documented" },
];

export const healthChecks = [
  { label: "Chapters released", value: "4 of 8", ok: false, note: "Four chapters still to be published" },
  { label: "Class curricula", value: "1 of 5 detailed", ok: false, note: "Placeholder modules are unmarked in the CMS" },
  { label: "Catalogue priced", value: "0 of 8", ok: false, note: "No product carries a price" },
  { label: "Biography reviewed", value: "Current", ok: true, note: "Checked against public properties" },
  { label: "Contact channels", value: "4 live", ok: true, note: "Email, phone and three social profiles" },
];

/* ------------------------------------------------------------------ */
/* Student view (`/studio/academy` as a student)                     */
/* ------------------------------------------------------------------ */

export const student = {
  name: "Demo Student",
  track: "Private Lessons",
  since: "Demo account",
  isDemo: true,
  notice:
    "Sample student account. Progress, notes and feedback below are placeholder content.",
  focus: "Tone",
  streak: 6,
  nextSession: {
    title: "Private Lesson",
    when: "This Friday, 18:00 IST",
    format: "Online",
    duration: "60 minutes",
    focus: "Tone",
    source: "demo" as Source,
  },
  progress: [
    { label: "Tone", value: 72 },
    { label: "Technique", value: 45 },
    { label: "Arrangement", value: 28 },
    { label: "Performance", value: 12 },
  ],
  lessons: [
    { no: 6, title: "Tone — signal chain", when: "3 Mar", done: true, note: "Worked through the amp and pedal order for a stage signal path." },
    { no: 5, title: "Tone — reference tracks", when: "24 Feb", done: true, note: "Broke down three references and what each was actually doing." },
    { no: 4, title: "Technique — right hand", when: "17 Feb", done: true, note: "Picking consistency at tempo." },
    { no: 3, title: "Arrangement — intro", when: "10 Feb", done: true, note: "Rebuilt the intro around a single idea." },
    { no: 2, title: "Tone — first pass", when: "3 Feb", done: true, note: "Where the tone actually starts." },
    { no: 1, title: "First lesson", when: "27 Jan", done: true, note: "Set the goal for the run." },
  ],
  feedback: [
    { when: "3 Mar", text: "Placeholder feedback — the real system would carry the artist's notes from the lesson here.", source: "demo" as Source },
  ],
  resources: [
    { label: "Tone reference sheet", note: "To be confirmed" },
    { label: "Warm-up routine", note: "To be confirmed" },
    { label: "Session notes archive", note: "To be confirmed" },
  ],
};
