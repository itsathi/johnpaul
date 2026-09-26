/**
 * Releases — the document layer behind `/music` and `/music/[release]`.
 *
 * ── THE DEMO CONVENTION (inherited from content/platform.ts) ────────────────
 *   source: "documented"  — stated in the brief or traceable to John's public
 *                           properties. Safe to present as fact.
 *   source: "demo"        — STRUCTURE ONLY.
 *
 * This file is deliberately conservative. Of *Kalpana*'s eight chapters exactly
 * one is public, so `tracks` carries one real entry and seven `null` slots
 * rendered as "To be announced". Inventing seven track titles to fill a
 * tracklist would be the single most damaging thing this page could do.
 *
 * Nothing here asserts a release date, a track name, a chart position or a
 * credit that is not already in `content/site.ts`.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { discography, kalpana, nowPlaying } from "./site";
import type { Source } from "./platform";

export type Track = {
  no: string;
  /** `null` until the chapter is public. */
  title: string | null;
  note: string | null;
  youtube: string | null;
  thumbnail: string | null;
  source: Source;
};

export type Credit = {
  role: string;
  name: string;
  source: Source;
};

export type Release = {
  slug: string;
  title: string;
  kind: "Album" | "Single";
  /** Position line, e.g. "Track 01" or "8 chapters". */
  position: string;
  /** Honest status — never a claim that isn't documented. */
  status: string;
  blurb: string;
  /** Editorial standfirst for the detail page. */
  story: string;
  /** A wix media id (resolved by `wix()`) or an absolute URL. */
  artwork: string;
  artworkAlt: string;
  artworkWix: boolean;
  facts: { label: string; value: string | null }[];
  credits: Credit[];
  tracks: Track[];
  streams: { label: string; href: string; note?: string }[];
  video: { label: string; href: string } | null;
  premiere: { label: string; href: string } | null;
  /** Slugs of sibling releases. */
  related: string[];
  source: Source;
};

/* ------------------------------------------------------------------ */
/* Kalpana — the album                                                 */
/* ------------------------------------------------------------------ */

const KALPANA_ART = "84283f_b5260c78c8e444f982976578fc87a522~mv2.jpg";

/**
 * Eight chapters, one public. The seven empty slots are the honest shape of
 * a record released "in chapters" — they are shown as reserved positions
 * rather than hidden, because the waiting is part of the story.
 */
const kalpanaTracks: Track[] = [
  {
    no: "01",
    title: "Yosemite's Hathi",
    note: "First single — live premiere at AAM Mumbai with Nikhita Gandhi & Muheet Bharti.",
    youtube: "https://youtu.be/RKWNBADSIsI",
    thumbnail: "https://i.ytimg.com/vi/RKWNBADSIsI/maxresdefault.jpg",
    source: "documented",
  },
  ...["02", "03", "04", "05", "06", "07", "08"].map((no): Track => ({
    no,
    title: null,
    note: null,
    youtube: null,
    thumbnail: null,
    source: "demo",
  })),
];

export const releases: Release[] = [
  {
    slug: "kalpana",
    title: "Kalpana",
    kind: "Album",
    position: "8 chapters",
    status: "4 of 8 chapters out now",
    blurb:
      "An independent record released in chapters — named after his late mother, and built the way a session musician hears a song.",
    story: kalpana.philosophy,
    artwork: KALPANA_ART,
    artworkAlt: "Album artwork for Kalpana by John Paul",
    artworkWix: true,
    facts: [
      { label: "Type", value: "Independent album" },
      { label: "Chapters", value: "8" },
      { label: "Released", value: "In chapters — 4 of 8 out now" },
      { label: "Written, arranged & produced by", value: "John Paul" },
      { label: "Featuring", value: "Arijit Singh · Shankar Mahadevan · musicians from around the world" },
      { label: "Dedicated to", value: "His late mother" },
      { label: "Title means", value: "Imagination — the Bengali word for everything this record holds" },
      { label: "Label", value: "To be confirmed" },
      { label: "Release date", value: "Released chapter by chapter" },
    ],
    credits: [
      { role: "Written, arranged & produced by", name: "John Paul", source: "documented" },
      { role: "Featuring", name: "Arijit Singh", source: "documented" },
      { role: "Featuring", name: "Shankar Mahadevan", source: "documented" },
      { role: "Chapter 01 — live premiere with", name: "Nikhita Gandhi", source: "documented" },
      { role: "Chapter 01 — live premiere with", name: "Muheet Bharti", source: "documented" },
      { role: "Additional musicians", name: "From around the world — full credits to be confirmed", source: "demo" },
    ],
    tracks: kalpanaTracks,
    streams: [
      { label: "Apple Music", href: "https://music.apple.com/in/artist/john-paul/1852268968", note: "Artist page" },
      { label: "YouTube", href: "https://youtu.be/RKWNBADSIsI" },
      { label: "Linktree", href: "https://linktr.ee/John.paul" },
      { label: "Press — The Telegraph", href: discography.press.href, note: discography.press.title },
    ],
    video: { label: "Chapter 01 — Yosemite's Hathi", href: "https://youtu.be/RKWNBADSIsI" },
    premiere: {
      label: "Live at AAM Mumbai — with Nikhita Gandhi & Muheet Bharti",
      href: "https://youtu.be/NpPHOTZGEN8",
    },
    related: ["yosemites-hathi"],
    source: "documented",
  },
  {
    slug: "yosemites-hathi",
    title: "Yosemite's Hathi",
    kind: "Single",
    position: "Track 01",
    status: "Out now",
    blurb:
      "The opening chapter of Kalpana — written, arranged and produced by John Paul, premiered live at AAM Mumbai.",
    story:
      "The first song out of Kalpana, and the one the record was opened with. It was written, arranged and produced by John Paul, and premiered live at AAM Mumbai with Nikhita Gandhi and Muheet Bharti before it reached a streaming platform.",
    artwork: "https://i.ytimg.com/vi/RKWNBADSIsI/maxresdefault.jpg",
    artworkAlt: "Artwork for Yosemite's Hathi by John Paul",
    artworkWix: false,
    facts: [
      { label: "Type", value: "Single — first from Kalpana" },
      { label: "Released", value: "Out now" },
      { label: "Written, arranged & produced by", value: "John Paul" },
      { label: "From the album", value: "Kalpana" },
      { label: "Live premiere", value: "AAM Mumbai, with Nikhita Gandhi & Muheet Bharti" },
      { label: "Release date", value: "To be confirmed" },
    ],
    credits: [
      { role: "Written, arranged & produced by", name: "John Paul", source: "documented" },
      { role: "Live premiere with", name: "Nikhita Gandhi", source: "documented" },
      { role: "Live premiere with", name: "Muheet Bharti", source: "documented" },
    ],
    tracks: [],
    streams: [
      { label: "YouTube", href: "https://youtu.be/RKWNBADSIsI" },
      { label: "Apple Music", href: "https://music.apple.com/in/artist/john-paul/1852268968", note: "Artist page" },
      { label: "Linktree", href: "https://linktr.ee/John.paul" },
    ],
    video: { label: "Watch the music video", href: "https://youtu.be/RKWNBADSIsI" },
    premiere: {
      label: "Live at AAM Mumbai — with Nikhita Gandhi & Muheet Bharti",
      href: "https://youtu.be/NpPHOTZGEN8",
    },
    related: ["kalpana"],
    source: "documented",
  },
];

export function getRelease(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}

/** The release the homepage and `/music` lead with. */
export const featuredRelease = releases[0];

/** Chapter 01, promoted separately because it is the one people can play. */
export const leadSingle = releases[1];

/**
 * The album's public shape: how many chapters exist, and how many are out.
 * Derived from the track list so the two can never disagree.
 */
export const kalpanaProgress = {
  total: kalpanaTracks.length,
  released: kalpanaTracks.filter((t) => t.title !== null).length,
  note: discography.coming,
};

/** Kalpana's own presentation facts, kept in one place for the album page. */
export const kalpanaStory = {
  meaning: kalpana.meaning,
  philosophy: kalpana.philosophy,
  dedication: kalpana.dedication,
  credits: kalpana.credits,
  premiere: kalpana.premiere,
  tribute: kalpana.tribute,
  press: discography.press,
};

export { nowPlaying };
