"use client";

/**
 * The persistent player.
 *
 * ── THE ONE BEHAVIOUR THIS HAS TO GET RIGHT ────────────────────────────────
 * It must survive route navigation, because a music platform that stops playing
 * when you click a link is not a music platform. It does, for the same reason
 * the engine does: the transport lives outside React, and this component only
 * reads from it. `app/layout.tsx` mounts it once, above `<main>`, so navigating
 * never remounts it.
 *
 * ── THE TWO RENDERS ───────────────────────────────────────────────────────
 *   full     — artwork, title, transport, scrubber, waveform, volume, links.
 *              Desktop, and the expanded state on touch.
 *
 *   compact  — artwork, title, play, and a hairline progress line. Everything
 *              else is one tap away. This is the mobile resting state, and it is
 *              the answer to a player that would otherwise eat a third of a
 *              phone screen while the visitor is trying to read.
 *
 * Neither renderer autoplays. The player does not exist until a track is
 * loaded, so the site is silent on arrival and stays silent on every route.
 *
 * ── WHAT IS ALWAYS VISIBLE ─────────────────────────────────────────────────
 * When the transport is simulated, the demo marker is on the player itself —
 * not only on the row that started it — because this is the component that will
 * be on screen when someone wonders why the bar is moving but there is no
 * sound. That is the one piece of honesty that must not be conditional.
 */

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Media from "@/components/ui/media";
import Waveform from "./waveform";
import { useAudio } from "@/lib/providers/audio-provider";
import { transportNote } from "@/content/music-vault";
import { wix } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/media-hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PersistentPlayer() {
  const { snapshot, track, toggle, next, previous, seek, setVolume, muted, toggleMute, volume, close } =
    useAudio();
  const reduced = usePrefersReducedMotion();

  const [expanded, setExpanded] = useState(false);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

  const open = Boolean(track) && snapshot.status !== "idle";
  const playing = snapshot.status === "playing";
  const duration = snapshot.duration;
  const progress = duration > 0 ? snapshot.currentTime / duration : 0;

  const progressPct = `${Math.min(100, Math.max(0, progress * 100))}%`;

  /* Closing is per-track, not global. Dismissing "Yosemite's Hathi" and then
     pressing play on it again should bring the player straight back — the
     gesture that opened it is the same gesture that closed it. */
  const dismissed = dismissedFor === snapshot.trackId;
  const visible = open && !dismissed;

  /* A new track resets the player's own state: collapsed, and undismissed so
     it comes straight back. Both used to be effects, which meant the incoming
     track painted for a frame wearing the outgoing track's collapsed/dismissed
     state, and a setState in an effect is a cascading render. Tracking the id
     we last saw and adjusting during render is the version without either
     problem — React discards the render output and re-runs with the new state
     before anything reaches the DOM. */
  const [seenTrack, setSeenTrack] = useState(snapshot.trackId);
  if (seenTrack !== snapshot.trackId) {
    setSeenTrack(snapshot.trackId);
    setExpanded(false);
    setDismissedFor(null);
  }

  /* Space is the universal transport key. It must not fire while someone is
     typing a session brief or a lesson enquiry, which is exactly where people
     will be when this is running. */
  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== " " && event.code !== "Space") return;
      const el = document.activeElement;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (el instanceof HTMLElement && el.isContentEditable) return;
      if (el instanceof HTMLElement && el.closest("[data-space-guard]")) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, visible]);

  /* Media keys, if the browser routes them to the document. */
  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && event.metaKey) {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft" && event.metaKey) {
        event.preventDefault();
        previous();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous, visible]);

  const artwork = track
    ? track.artworkWix
      ? wix(track.artwork, 240, 240)
      : track.artwork
    : null;

  return (
    <AnimatePresence>
      {visible && track ? (
        <motion.div
          /* `layout` on a fixed element is not needed; the entrance is
             deliberate — it rises from the bottom edge like a drawer, so its
             arrival is a movement the visitor can see coming. */
          initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "110%", opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.62, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-[65]"
          role="region"
          aria-label="Audio player"
        >
          {/* The progress line sits on the very top edge, full width, and is
              the only thing visible in the compact state. It is duplicated as a
              real range input below for keyboard and touch. */}
          <div className="relative h-[2px] w-full bg-line">
            <span
              className="absolute inset-y-0 left-0 bg-brass transition-[width] duration-150 ease-linear"
              style={{ width: progressPct }}
            />
          </div>

          <div className="border-t border-line bg-ink/85 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-[92rem] px-4 md:px-10 lg:px-14">
              <div className="flex items-center gap-3 py-3 md:gap-5 md:py-4">
                {/* ---- Artwork ------------------------------------------- */}
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-label={expanded ? `Collapse the player` : `Expand the player for ${track.title}`}
                  className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-sm md:h-14 md:w-14"
                  data-cursor="link"
                >
                  {artwork ? (
                    <Media
                      src={artwork}
                      alt=""
                      width={112}
                      height={112}
                      priority
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </button>

                {/* ---- Title --------------------------------------------- */}
                <div className="min-w-0 flex-1 md:max-w-[16rem]">
                  <p
                    className={`truncate font-display text-sm leading-tight tracking-[-0.01em] md:text-base ${
                      playing ? "text-brass-bright" : "text-paper"
                    }`}
                  >
                    {track.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 truncate font-mono text-[0.55rem] uppercase tracking-[0.2em] text-mute">
                    {track.meta}
                  </p>
                </div>

                {/* ---- Transport ----------------------------------------- */}
                <div className="flex shrink-0 items-center gap-1 md:gap-2">
                  <PlayerButton
                    onClick={previous}
                    label="Previous track"
                    className="hidden sm:inline-flex"
                  >
                    <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden>
                      <path d="M9.5 1.5v9L3 6z" fill="currentColor" />
                      <rect x="1.4" y="1.5" width="1.2" height="9" rx="0.3" fill="currentColor" />
                    </svg>
                  </PlayerButton>

                  <PlayerButton
                    onClick={toggle}
                    label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
                    primary
                  >
                    {snapshot.status === "loading" ? (
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 animate-pulse rounded-full bg-ink"
                      />
                    ) : playing ? (
                      <svg width="15" height="15" viewBox="0 0 12 12" aria-hidden>
                        <rect x="2.4" y="1.4" width="2.6" height="9.2" rx="0.5" fill="currentColor" />
                        <rect x="7" y="1.4" width="2.6" height="9.2" rx="0.5" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 12 12"
                        aria-hidden
                        style={{ transform: "translateX(1px)" }}
                      >
                        <path d="M2.4 1.4v9.2L9.6 6z" fill="currentColor" />
                      </svg>
                    )}
                  </PlayerButton>

                  <PlayerButton
                    onClick={next}
                    label="Next track"
                    className="hidden sm:inline-flex"
                  >
                    <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden>
                      <path d="M2.5 1.5v9L9 6z" fill="currentColor" />
                      <rect x="9.4" y="1.5" width="1.2" height="9" rx="0.3" fill="currentColor" />
                    </svg>
                  </PlayerButton>
                </div>

                {/* ---- Scrubber + waveform (desktop) --------------------- */}
                <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
                  <span className="w-9 shrink-0 text-right font-mono text-[0.58rem] tabular-nums tracking-[0.1em] text-mute">
                    {formatTime(snapshot.currentTime)}
                  </span>
                  <div className="relative min-w-0 flex-1">
                    <Waveform
                      trackId={track.id}
                      progress={progress}
                      playing={playing}
                      className="h-9 w-full"
                    />
                    <Scrubber
                      value={progress}
                      onSeek={seek}
                      label={`Seek within ${track.title}`}
                      className="absolute inset-0 h-full w-full opacity-0"
                    />
                  </div>
                  <span className="w-9 shrink-0 font-mono text-[0.58rem] tabular-nums tracking-[0.1em] text-mute">
                    {duration > 0 ? formatTime(duration) : "—:—"}
                  </span>
                </div>

                {/* ---- Time (mobile) ----------------------------------- */}
                <span className="shrink-0 font-mono text-[0.55rem] tabular-nums tracking-[0.1em] text-mute lg:hidden">
                  {duration > 0 ? `${formatTime(snapshot.currentTime)} / ${formatTime(duration)}` : "—:—"}
                </span>

                {/* ---- Volume (desktop) --------------------------------- */}
                <div className="hidden w-28 shrink-0 items-center gap-2 xl:flex">
                  <PlayerButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
                    {muted || volume === 0 ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                        <path d="M2 5h2.5L8 2v10L4.5 9H2z" fill="currentColor" />
                        <path d="M10 4.5l3 3M13 4.5l-3 3" stroke="currentColor" strokeWidth="1.1" fill="none" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                        <path d="M2 5h2.5L8 2v10L4.5 9H2z" fill="currentColor" />
                        <path d="M10 5.2a2.6 2.6 0 010 3.6" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                  </PlayerButton>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((muted ? 0 : volume) * 100)}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    aria-label="Volume"
                    aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} percent`}
                    style={
                      {
                        "--fill": `${Math.round((muted ? 0 : volume) * 100)}%`,
                      } as CSSProperties
                    }
                    className="jp-range jp-range-filled h-1 w-full cursor-pointer appearance-none rounded-full"
                  />
                </div>

                {/* ---- Right-hand controls ------------------------------ */}
                <div className="flex shrink-0 items-center gap-1">
                  <AnimatePresence>
                    {expanded ? (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="hidden items-center gap-1 overflow-hidden md:flex"
                      >
                        {track.streams.map((s) => (
                          <a
                            key={s.href}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap px-2.5 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-mute transition-colors hover:text-brass-bright"
                          >
                            {s.label}
                          </a>
                        ))}
                        {track.href ? (
                          <Link
                            href={track.href}
                            className="whitespace-nowrap px-2.5 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-bone transition-colors hover:text-brass-bright"
                          >
                            Release
                          </Link>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <PlayerButton
                    onClick={() => setExpanded((v) => !v)}
                    label={expanded ? "Collapse player" : "Expand player"}
                    ariaExpanded={expanded}
                    className="hidden sm:inline-flex"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                      <path
                        d={expanded ? "M2 5.5L7 10.5L12 5.5" : "M2 8.5L7 3.5L12 8.5"}
                        stroke="currentColor"
                        strokeWidth="1.3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </PlayerButton>

                  <PlayerButton
                    onClick={() => {
                      close();
                      setDismissedFor(track.id);
                    }}
                    label="Close the player"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                      <path
                        d="M2 2l8 8M10 2l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </PlayerButton>
                </div>
              </div>
            </div>

            {/* ---- Mobile: tap the row to expand ----------------------- */}
            <AnimatePresence>
              {expanded ? (
                <motion.div
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden border-t border-line/70 md:hidden"
                >
                  <div className="space-y-4 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
                    <div>
                      <div className="h-10 w-full">
                        <Waveform
                          trackId={track.id}
                          progress={progress}
                          playing={playing}
                          className="h-full w-full"
                        />
                      </div>
                      <Scrubber
                        value={progress}
                        onSeek={seek}
                        label={`Seek within ${track.title}`}
                        className="jp-range mt-2 h-6 w-full appearance-none bg-transparent"
                      />
                    </div>

                    <p className="font-mono text-[0.58rem] leading-[1.9] tracking-[0.14em] text-bone/70">
                      {track.note}
                    </p>

                    <div className="flex items-center gap-3">
                      <PlayerButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
                        {muted || volume === 0 ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                            <path d="M2 5h2.5L8 2v10L4.5 9H2z" fill="currentColor" />
                            <path d="M10 4.5l3 3M13 4.5l-3 3" stroke="currentColor" strokeWidth="1.1" fill="none" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                            <path d="M2 5h2.5L8 2v10L4.5 9H2z" fill="currentColor" />
                            <path d="M10 5.2a2.6 2.6 0 010 3.6" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                          </svg>
                        )}
                      </PlayerButton>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round((muted ? 0 : volume) * 100)}
                        onChange={(e) => setVolume(Number(e.target.value) / 100)}
                        aria-label="Volume"
                        aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} percent`}
                        style={
                          {
                            "--fill": `${Math.round((muted ? 0 : volume) * 100)}%`,
                          } as CSSProperties
                        }
                        className="jp-range jp-range-filled h-1 flex-1 cursor-pointer appearance-none rounded-full"
                      />
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {track.streams.map((s) => (
                        <li key={s.href}>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center border border-line px-3.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone transition-colors hover:border-brass hover:text-brass-bright"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                      {track.href ? (
                        <li>
                          <Link
                            href={track.href}
                            className="inline-flex min-h-11 items-center border border-line px-3.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone transition-colors hover:border-brass hover:text-brass-bright"
                          >
                            Release
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* ---- The honesty line --------------------------------------
              Never conditional on viewport, never inside the expanded panel.
              This is the one thing that must be on screen whenever the
              transport is moving without a sound behind it. */}
          {snapshot.simulated ? (
            <p className="border-t border-line/60 bg-ink px-4 py-1.5 text-center font-mono text-[0.5rem] uppercase tracking-[0.22em] text-mute md:px-10">
              {transportNote.player}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                             */
/* ------------------------------------------------------------------ */

function PlayerButton({
  onClick,
  label,
  primary = false,
  className = "",
  children,
  ariaExpanded,
}: {
  onClick: () => void;
  label: string;
  primary?: boolean;
  className?: string;
  children: ReactNode;
  ariaExpanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={ariaExpanded}
      title={label}
      data-cursor="play"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 md:h-10 md:w-10 ${
        primary
          ? "border-brass bg-brass text-ink hover:bg-brass-bright"
          : "border-transparent text-bone/70 hover:border-line hover:text-paper"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * The scrubber. A real `<input type="range">` so touch, keyboard and assistive
 * tech all work without a custom pointer implementation — the visual is the
 * waveform behind it, and the thumb only appears on interaction.
 */
function Scrubber({
  value,
  onSeek,
  label,
  className = "",
}: {
  value: number;
  onSeek: (fraction: number) => void;
  label: string;
  className?: string;
}) {
  return (
    <input
      type="range"
      min={0}
      max={1000}
      step={1}
      value={Math.round(value * 1000)}
      onChange={(e) => onSeek(Number(e.target.value) / 1000)}
      aria-label={label}
      aria-valuetext={`${Math.round(value * 100)} percent`}
      className={`jp-range cursor-pointer appearance-none bg-transparent ${className}`}
    />
  );
}
