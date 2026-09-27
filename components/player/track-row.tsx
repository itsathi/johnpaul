"use client";

/**
 * A vault track row.
 *
 * Shaped like a track listing rather than a card, because that is what it is:
 * number, play control, artwork, title, context, then the real streaming links.
 * Deliberately not a link-wrapped row — a row that is both a link and a button
 * is a keyboard trap waiting to happen. The title is the only link.
 *
 * The demo-transport marker sits on the row whenever the track has no audio
 * file, and the streaming links are on the row rather than hidden behind the
 * player, so nobody is ever one press away from wondering why it is silent.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import Media from "@/components/ui/media";
import PlayButton from "./play-button";
import Waveform from "./waveform";
import { useAudio } from "@/lib/providers/audio-provider";
import { transportNote, type VaultTrack } from "@/content/music-vault";
import { wix } from "@/lib/media";

type TrackRowProps = {
  track: VaultTrack;
};

export default function TrackRow({ track }: TrackRowProps) {
  const { isActive, snapshot } = useAudio();
  const active = isActive(track.id);
  const playing = active && snapshot.status === "playing";
  const duration = active ? snapshot.duration : 0;
  const progress = active && duration ? snapshot.currentTime / duration : 0;

  const artwork = track.artworkWix ? wix(track.artwork, 320, 320) : track.artwork;

  return (
    <motion.li
      layout="position"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative border-t border-line transition-colors duration-500 ${
        active ? "bg-brass/[0.045]" : "hover:bg-paper/[0.02]"
      }`}
    >
      {/* The brass rail marks the loaded track. */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-px bg-brass transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="flex items-center gap-4 py-4 pl-4 pr-4 sm:gap-5 sm:py-5 sm:pl-6 md:gap-7">
        <span
          aria-hidden
          className={`hidden w-6 shrink-0 font-mono text-[0.6rem] tracking-[0.2em] sm:block ${
            active ? "text-brass" : "text-mute/50"
          }`}
        >
          {track.no}
        </span>

        <PlayButton track={track} variant="row" labelHidden />

        {/* Decorative next to the title right beside it, so it is hidden rather
            than given a description that repeats itself. */}
        <div className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-sm sm:block">
          <Media
            src={artwork}
            alt=""
            width={112}
            height={112}
            className={`h-full w-full object-cover transition-all duration-700 ${
              active ? "opacity-100" : "opacity-55 group-hover:opacity-90"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {track.href ? (
              <Link
                href={track.href}
                data-cursor="link"
                className={`truncate font-display text-lg leading-tight tracking-[-0.01em] transition-colors duration-300 md:text-xl ${
                  active ? "text-brass-bright" : "text-paper group-hover:text-brass-bright"
                }`}
              >
                {track.title}
              </Link>
            ) : (
              <span className="truncate font-display text-lg leading-tight tracking-[-0.01em] text-paper md:text-xl">
                {track.title}
              </span>
            )}
            {!track.src ? (
              <span className="shrink-0 border border-line px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.2em] text-mute">
                {transportNote.row}
              </span>
            ) : null}
          </div>
          <p className="mt-1 truncate font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mute">
            {track.meta}
          </p>
        </div>

        {/* Only the loaded track gets a waveform. An inactive row showing one
            would imply a length nobody has published. */}
        <div className="hidden h-8 w-24 shrink-0 xl:block">
          {active ? (
            <Waveform
              trackId={track.id}
              progress={progress}
              playing={playing}
              compact
              className="h-full w-full"
            />
          ) : null}
        </div>

        {/* The real way in, on the row itself rather than behind the player. */}
        <ul className="hidden shrink-0 items-center gap-4 md:flex">
          {track.streams.slice(0, 2).map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.note ? `${s.label} — ${s.note}` : s.label}
                className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-mute underline-offset-4 transition-colors hover:text-brass-bright hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* The row is too narrow for a scrub bar, so the loaded track gets a
          full-width playhead under it instead. */}
      {active ? (
        <div className="relative h-px w-full bg-line xl:hidden">
          <span
            className="absolute inset-y-0 left-0 bg-brass transition-[width] duration-150"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      ) : null}

      {/* Context for assistive tech, and for anyone who can't see the note in
          the expand panel above the list. */}
      <span className="sr-only">
        {track.note}
        {!track.src ? ` ${transportNote.hint}` : ""}
      </span>
    </motion.li>
  );
}
