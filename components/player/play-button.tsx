"use client";

/**
 * The play button — the single control the whole site shares.
 *
 * One component, three densities, one behaviour: press it and the transport
 * starts that track, or toggles if it is already the one playing. Every play
 * affordance in the build is this, so they cannot drift apart.
 *
 * Accessibility notes that are easy to get wrong and are handled here:
 *   - `aria-pressed` is not used. Play/pause is an *action*, and a toggle
 *     button that announces itself as a toggle with no state change reads
 *     wrong. The accessible name states the action instead.
 *   - When the active track is playing, the icon and the label both change, so
 *     the button is never a mystery glyph.
 *   - A track with no audio file gets its real affordance in the title/aria
 *     description, so nobody is surprised by silence.
 */

import { motion } from "framer-motion";
import { useAudio } from "@/lib/providers/audio-provider";
import { transportNote, type VaultTrack } from "@/content/music-vault";
import { usePrefersReducedMotion } from "@/lib/media-hooks";

type PlayButtonProps = {
  track: VaultTrack;
  /** `row` is the full control for a list item; `chip` is for dense headers. */
  variant?: "row" | "chip" | "hero";
  className?: string;
  /** Hide the text label and let the caller place its own next to the button. */
  labelHidden?: boolean;
  label?: string;
};

export default function PlayButton({
  track,
  variant = "row",
  className = "",
  labelHidden = false,
  label,
}: PlayButtonProps) {
  const { isActive, snapshot, play } = useAudio();
  const reduced = usePrefersReducedMotion();

  const active = isActive(track.id);
  const playing = active && snapshot.status === "playing";
  const busy = active && snapshot.status === "loading";

  const text = label ?? (playing ? "Pause" : active ? "Resume" : `Play ${track.title}`);
  const described = track.src ? undefined : transportNote.hint;

  const sizing =
    variant === "hero"
      ? "h-14 w-14 md:h-16 md:w-16"
      : variant === "chip"
        ? "h-9 w-9"
        : "h-11 w-11 md:h-12 md:w-12";

  const iconSize = variant === "hero" ? 18 : variant === "chip" ? 11 : 13;

  return (
    <div className={`inline-flex items-center ${labelHidden ? "" : "gap-4"} ${className}`}>
      <motion.button
        type="button"
        onClick={() => play(track.id)}
        /* Touch-first: the whole control is comfortably past the 44px minimum
           on a phone, which a 36px icon alone would not be. */
        whileTap={reduced ? undefined : { scale: 0.92 }}
        aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
        aria-describedby={described ? `hint-${track.id}` : undefined}
        title={described ?? track.title}
        data-cursor="play"
        className={`relative flex shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
          sizing
        } ${
          playing
            ? "border-brass bg-brass text-ink"
            : "border-line bg-ink/30 text-paper backdrop-blur-sm hover:border-brass hover:text-brass-bright"
        }`}
      >
        {busy ? (
          <span
            aria-hidden
            className="h-[0.4rem] w-[0.4rem] animate-pulse rounded-full bg-current"
          />
        ) : playing ? (
          <PauseGlyph size={iconSize} />
        ) : (
          <PlayGlyph size={iconSize} />
        )}

        {/* A quiet ring while playing, so an active row reads as active even
            when the visitor's eyes are on the headline, not the control. */}
        {playing ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border border-brass"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 1.35 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}
      </motion.button>

      {described ? (
        <span id={`hint-${track.id}`} className="sr-only">
          {described}
        </span>
      ) : null}

      {labelHidden ? null : (
        <span
          className={`font-mono uppercase tracking-[0.24em] ${
            variant === "hero" ? "text-[0.66rem]" : "text-[0.6rem]"
          } ${playing ? "text-brass-bright" : "text-mute"}`}
        >
          {text}
        </span>
      )}
    </div>
  );
}

function PlayGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden
      /* Nudged right so the triangle's optical centre sits on the circle's. */
      style={{ transform: "translateX(1px)" }}
    >
      <path d="M2.5 1.5v9L10 6z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden>
      <rect x="2.5" y="1.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
      <rect x="7" y="1.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
    </svg>
  );
}
