/**
 * The Music Vault — three rooms, one record.
 *
 * ── WHAT THIS FILE IS ──────────────────────────────────────────────────────
 * The document layer behind the `/music` vault and the persistent player.
 * Three rooms, matching how John's work actually divides:
 *
 *   SOLO             his own records — Kalpana and the chapters it arrives in
 *   JOHN PAUL LIVE   his own stage, his own band, the live rooms
 *   COLLABORATIONS   the documented call list
 *
 * ── THE HONEST PART, READ THIS BEFORE EDITING ───────────────────────────────
 * `src` is the seam. It is `null` everywhere, because no audio file for any of
 * this work has been supplied. The player does not pretend otherwise: a track
 * with a `null` `src` runs a transport whose clock is simulated, and the UI
 * labels it as such wherever the transport is visible. Supplying a real file is
 * one field — no component, provider or engine change:
 *
 *   src: "https://cdn.example.com/kalpana/01-yosemites-hathi.mp3"
 *
 * `demoSeconds` exists only to give the simulated transport a timeline. It is a
 * demo value, never a claim about how long anything actually runs — so it is
 * named to make that unmissable, and it is never rendered as a track length
 * without the "demo transport" marker next to it.
 *
 * `source` is inherited from `content/platform.ts`: "documented" means the
 * entry is traceable to John's public properties, "demo" means it is structure
 * only. No track title, credit, date, runtime, setlist or audience figure has
 * been invented. Where a real one is missing the field is `null` and renders as
 * "To be confirmed".
 * ───────────────────────────────────────────────────────────────────────────
 */

import { collaborations, kalpana, liveShots, nowPlaying } from "./site";
import { releases } from "./releases";
import type { Source } from "./platform";

/** A playable item. One shape for all three rooms. */
export type VaultTrack = {
  /** Stable id — also the player's queue key. */
  id: string;
  no: string;
  title: string;
  /** The line under the title: role, project or chapter position. */
  meta: string;
  /** A sentence of context. Never a claim beyond the documented record. */
  note: string;
  artwork: string;
  artworkWix: boolean;
  artworkAlt: string;
  /**
   * The audio seam. `null` = no file supplied, and the player runs its
   * simulated transport with an on-screen marker. A string = a real file, and
   * the player uses the real media element, seek and duration.
   */
  src: string | null;
  /**
   * Timeline for the SIMULATED transport only. Ignored when `src` is set.
   * A demo value, not a track length — see the header note.
   */
  demoSeconds: number;
  /** Where to actually hear it, when that is documented. */
  streams: { label: string; href: string; note?: string }[];
  /** Deep link into the platform — a release page, an archive filter. */
  href: string | null;
  source: Source;
};

export type VaultRoom = {
  key: "solo" | "live" | "collab";
  no: string;
  label: string;
  /** One line on what this room holds. */
  note: string;
  tracks: VaultTrack[];
};

/* ------------------------------------------------------------------ */
/* Room one — solo                                                    */
/* ------------------------------------------------------------------ */

const kalpanaRelease = releases.find((r) => r.slug === "kalpana")!;
const hathiRelease = releases.find((r) => r.slug === "yosemites-hathi")!;

const solo: VaultTrack[] = [
  {
    id: "kalpana",
    no: "01",
    title: "Kalpana",
    meta: "Independent album · 8 chapters",
    note: kalpana.philosophy,
    artwork: kalpanaRelease.artwork,
    artworkWix: true,
    artworkAlt: "Album artwork for Kalpana by John Paul",
    src: null,
    demoSeconds: 268,
    streams: kalpanaRelease.streams,
    href: "/music/kalpana",
    source: "documented",
  },
  {
    id: "yosemites-hathi",
    no: "02",
    title: "Yosemite's Hathi",
    meta: "Chapter 01 · Out now",
    note: hathiRelease.story,
    artwork: hathiRelease.artwork,
    artworkWix: false,
    artworkAlt: "Artwork for Yosemite's Hathi by John Paul",
    src: null,
    demoSeconds: 254,
    streams: hathiRelease.streams,
    href: "/music/yosemites-hathi",
    source: "documented",
  },
];

/* ------------------------------------------------------------------ */
/* Room two — John Paul Live                                          */
/* ------------------------------------------------------------------ */

const BAND = "Sambit, Rahul, Bihu, C_Roo and Subhadeep";

const live: VaultTrack[] = [
  {
    id: "live-5-mad-men",
    no: "01",
    title: "5 Mad Men, Kolkata",
    meta: "John Paul Live · Headline night",
    note: `A sold-out headline night in Kolkata with his own band — ${BAND} — honouring the music they grew up on.`,
    artwork: liveShots[2].id,
    artworkWix: true,
    artworkAlt: "John Paul performing with his own band at 5 Mad Men, Kolkata",
    src: null,
    demoSeconds: 241,
    streams: [
      { label: "Instagram", href: "https://www.instagram.com/johnpaul.india/", note: "Live updates" },
    ],
    href: "/gallery?f=touring",
    source: "documented",
  },
  {
    id: "live-kalpana-premiere",
    no: "02",
    title: "Kalpana, live",
    meta: "Chapter 01 premiere · 7 June",
    note: `${kalpana.premiere}. ${kalpana.tribute}`,
    artwork: liveShots[4].id,
    artworkWix: true,
    artworkAlt: "John Paul performing live, close up under stage light",
    src: null,
    demoSeconds: 232,
    streams: [
      { label: "YouTube", href: nowPlaying.premiere.href, note: "Live at AAM Mumbai" },
      { label: "Apple Music", href: "https://music.apple.com/in/artist/john-paul/1852268968" },
    ],
    href: "/music/kalpana",
    source: "documented",
  },
  {
    id: "live-archive",
    no: "03",
    title: "The live archive",
    meta: "Around the country · Repertoire to be confirmed",
    note:
      "A decade of touring rooms photographed and filed. The set itself is not published — the archive is the record of it.",
    artwork: liveShots[5].id,
    artworkWix: true,
    artworkAlt: "John Paul performing on tour around the country",
    src: null,
    demoSeconds: 226,
    streams: [
      { label: "Instagram", href: "https://www.instagram.com/johnpaul.india/", note: "Tour updates" },
      { label: "Tickets & dates", href: "https://www.instagram.com/districtupdates/" },
    ],
    href: "/gallery?f=live",
    source: "documented",
  },
];

/* ------------------------------------------------------------------ */
/* Room three — collaborations                                         */
/* ------------------------------------------------------------------ */

/**
 * The documented call list, taken straight from `collaborations` in
 * `content/site.ts` so the vault can never disagree with the rest of the site.
 * The images come from that same list, so every frame is John's own
 * photography — no stock stand-ins for a real person.
 */
function collabTrack(index: number): VaultTrack {
  const c = collaborations[index];
  return {
    id: `collab-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    no: String(index + 1).padStart(2, "0"),
    title: c.name,
    meta: c.role,
    note: `Documented ${c.role.toLowerCase()} work with ${c.name}. Sessions, stages and records — the part of the career that belongs to other people's records as much as his own.`,
    artwork: c.media || "84283f_15e357ae58e84fccb891870666ce240e~mv2.jpg",
    artworkWix: true,
    artworkAlt: c.media
      ? `John Paul performing with ${c.name}`
      : `Documentation of ${c.name} work — strings and studio detail`,
    src: null,
    demoSeconds: 214 + ((index * 17) % 46),
    streams: [
      { label: "Instagram", href: "https://www.instagram.com/johnpaul.india/", note: `Work with ${c.name}` },
    ],
    href: "/music#collab",
    source: "documented",
  };
}

const collab: VaultTrack[] = collaborations.map((_, i) => collabTrack(i));

/* ------------------------------------------------------------------ */
/* The vault                                                          */
/* ------------------------------------------------------------------ */

export const vaultRooms: VaultRoom[] = [
  {
    key: "solo",
    no: "01",
    label: "Solo",
    note: "His own records. Kalpana arrives a chapter at a time — one of eight is out now, and the rest are coming.",
    tracks: solo,
  },
  {
    key: "live",
    no: "02",
    label: "John Paul Live",
    note: "His own stage, his own band. A sold-out headline night in Kolkata, and the rooms that came before it.",
    tracks: live,
  },
  {
    key: "collab",
    no: "03",
    label: "Collaborations",
    note: "The call list. Stages, studio floors and records that belong to other people as much as to him.",
    tracks: collab,
  },
];

/** Every track, in room order — the player's default queue. */
export const vaultTracks: VaultTrack[] = vaultRooms.flatMap((r) => r.tracks);

export function getVaultTrack(id: string): VaultTrack | undefined {
  return vaultTracks.find((t) => t.id === id);
}

/** The one track a visitor is most likely to press first. */
export const leadTrack = vaultTracks.find((t) => t.id === "yosemites-hathi")!;

/* ------------------------------------------------------------------ */
/* Player copy — the honesty layer                                     */
/* ------------------------------------------------------------------ */

/**
 * Everything the player needs to say about itself when it is not playing real
 * audio. Wording lives here so the player, the track rows and the vault all
 * use the same sentence.
 */
export const transportNote = {
  /** Shown in the player whenever the active track has no audio file. */
  player: "Demo transport — no audio file is connected",
  /** Shown on a track row that will start the simulated transport. */
  row: "Demo",
  /** The tooltip / aria description of a play button on such a track. */
  hint: "Starts the demo transport. No audio file is connected for this track — use the streaming links to hear the real recording.",
  /** What a visitor gets instead: the documented links. */
  fallback: "Hear the real recording",
} as const;

export const vaultCopy = {
  kicker: "The vault",
  headline: ["Everything", "worth", "pressing play on."] as string[],
  intro:
    "Three rooms. His own records, his own stage, and the call list he has spent a decade answering. Press play and the player follows you for the rest of the site.",
  note:
    "The player is wired to real audio files. None have been supplied yet, so pressing play starts a clearly-marked demo transport — the streaming links on every track are the real way in.",
} as const;
