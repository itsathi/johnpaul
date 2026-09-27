"use client";

/**
 * The Music Vault — three rooms, one transport.
 *
 * The brief asked for SOLO / JOHN PAUL LIVE / COLLABORATIONS as tabs, and that
 * is the right shape, but three equal tabs of identical track rows would be a
 * list with a header. So the tabs are built as rooms:
 *
 *   - Each room states what it holds and what its honest limit is.
 *   - Each room has a *featured* track — the one worth seeing first — rendered
 *     large, with artwork, the note, and the real links.
 *   - The rest are a scanning list below it.
 *   - The active room drives a background plate, so switching rooms changes
 *     the whole surface rather than just swapping text in place.
 *
 * Keyboard support is the full tablist contract: arrow keys move, Home/End
 * jump, and only the active tab is in the tab order. The panel is a real
 * `tabpanel` wired by `aria-controls`/`aria-labelledby`, so a screen reader
 * announces the change rather than silently swapping content.
 *
 * Deep links work: `?room=live` is read on mount and written on change, so a
 * vault link can point at a specific room and survive a reload.
 */

import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Media from "@/components/ui/media";
import PlayButton from "@/components/player/play-button";
import TrackRow from "@/components/player/track-row";
import { useAudio } from "@/lib/providers/audio-provider";
import { vaultCopy, vaultRooms, type VaultRoom } from "@/content/music-vault";
import { wix } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/media-hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Artwork per room, used as the surface plate behind the active tab. */
const ROOM_PLATE: Record<VaultRoom["key"], string> = {
  solo: "84283f_b5260c78c8e444f982976578fc87a522~mv2.jpg",
  live: "84283f_f847d6dfdcec42fe81385afdc6bb9758~mv2.jpg",
  collab: "84283f_7583ccbd4ef44131b0f92ac73d5882dd~mv2.jpg",
};

export default function MusicVault() {
  /* `useId` rather than a random string in a ref: the id only has to be
     unique among the elements on the page, and React already knows how to
     hand out an id that is stable across renders and unique per instance. */
  const tabsId = useId();
  const [room, setRoom] = useState<VaultRoom["key"]>("solo");
  const reduced = usePrefersReducedMotion();

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /* Deep link in, without an effect.
     `?room=live` is an input, and the room is state that has to follow it —
     so this is the "adjust state when an input changes" case, done during
     render rather than in an effect. The old version mirrored the param into
     state after paint, which meant a deep-linked room rendered one frame of
     SOLO first and jumped. It also could not distinguish "the URL changed
     underneath me" from "the visitor clicked a tab", so it clobbered the
     visitor's own choice. Tracking the last param we saw is what separates
     the two cases. */
  const requested = params.get("room");
  const deepLinked =
    requested && vaultRooms.some((r) => r.key === requested)
      ? (requested as VaultRoom["key"])
      : null;
  const [seenRequest, setSeenRequest] = useState(deepLinked);
  if (deepLinked !== seenRequest) {
    setSeenRequest(deepLinked);
    if (deepLinked) setRoom(deepLinked);
  }

  const changeRoom = useCallback(
    (key: VaultRoom["key"]) => {
      setRoom(key);
      const url = key === "solo" ? pathname : `${pathname}?room=${key}`;
      router.replace(url, { scroll: false });
    },
    [pathname, router],
  );

  const tablistRef = useRef<HTMLDivElement | null>(null);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = vaultRooms.findIndex((r) => r.key === room);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % vaultRooms.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + vaultRooms.length) % vaultRooms.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = vaultRooms.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const key = vaultRooms[nextIndex].key;
    changeRoom(key);
    /* Found by role from the tablist rather than kept in a ref array. A ref
       array has to be written during render and indexed afterwards, which is
       both a render-phase side effect and easy to get out of sync with the
       DOM; the tablist is right here. */
    tablistRef.current
      ?.querySelectorAll<HTMLElement>('[role="tab"]')
      ?.[nextIndex]?.focus();
  };

  const active = vaultRooms.find((r) => r.key === room)!;
  const [featured, ...rest] = active.tracks;
  const plate = ROOM_PLATE[room];

  return (
    <section id="vault" className="relative overflow-hidden bg-ink py-20 md:py-28">
      {/* The room plate. Cross-fades on switch, so changing rooms changes the
          light in the room rather than just the text in it. */}
      <AnimatePresence mode="sync">
        <motion.div
          key={room}
          aria-hidden
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: reduced ? 0.14 : 0.3, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="pointer-events-none absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 80% 62% at 78% 22%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 62% at 78% 22%, black, transparent 78%)",
          }}
        >
          <Media
            src={wix(plate, 1400, 900)}
            alt=""
            width={1400}
            height={900}
            sizes="60vw"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.94),rgba(11,11,12,0.72)_40%,rgba(11,11,12,0.97))]"
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        {/* ---- Headline ------------------------------------------- */}
        <div className="max-w-3xl">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.34em] text-brass">
            {vaultCopy.kicker}
          </p>
          <h2
            className="mt-6 font-display leading-[0.94] tracking-[-0.025em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6.4vw, 6rem)" }}
          >
            {vaultCopy.headline[0]}{" "}
            <span className="italic text-bone/70">{vaultCopy.headline[1]}</span>{" "}
            {vaultCopy.headline[2]}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-bone md:text-base">
            {vaultCopy.intro}
          </p>
        </div>

        {/* ---- Tabs ------------------------------------------------ */}
        <div
          role="tablist"
          ref={tablistRef}
          aria-label="The music vault"
          onKeyDown={onKeyDown}
          className="mt-14 flex flex-wrap gap-2 border-b border-line md:mt-20 md:gap-3"
        >
          {vaultRooms.map((r) => {
            const selected = r.key === room;
            return (
              <button
                key={r.key}
                role="tab"
                id={`${tabsId}-tab-${r.key}`}
                aria-selected={selected}
                aria-controls={`${tabsId}-panel`}
                /* Roving tabindex: only the active tab is reachable by Tab, and
                   arrows move between them. */
                tabIndex={selected ? 0 : -1}
                onClick={() => changeRoom(r.key)}
                data-cursor="link"
                className={`group relative -mb-px flex min-h-12 items-baseline gap-3 border-b-2 px-4 py-4 text-left transition-colors duration-300 md:px-6 ${
                  selected
                    ? "border-brass text-paper"
                    : "border-transparent text-mute hover:text-bone"
                }`}
              >
                <span
                  className={`font-mono text-[0.55rem] tracking-[0.2em] transition-colors ${
                    selected ? "text-brass" : "text-mute/50"
                  }`}
                >
                  {r.no}
                </span>
                <span className="font-display text-lg tracking-[-0.01em] md:text-xl">
                  {r.label}
                </span>
                <span className="ml-1 hidden font-mono text-[0.55rem] uppercase tracking-[0.18em] text-mute/70 md:inline">
                  {r.tracks.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---- Panel ----------------------------------------------- */}
        <div
          role="tabpanel"
          id={`${tabsId}-panel`}
          aria-labelledby={`${tabsId}-tab-${room}`}
          tabIndex={0}
          className="pt-10 focus-visible:outline-none md:pt-14"
        >
          <p className="max-w-2xl text-sm leading-relaxed text-bone md:text-base">
            {active.note}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={room}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* ---- Featured track ---------------------------------- */}
              {featured ? <FeaturedTrack track={featured} /> : null}

              {/* ---- The rest --------------------------------------- */}
              {rest.length > 0 ? (
                <ul className="mt-14 border-b border-line md:mt-20">
                  {rest.map((track) => (
                    <TrackRow key={track.id} track={track} />
                  ))}
                </ul>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <p className="mt-10 max-w-2xl border-l border-brass/40 pl-4 font-mono text-[0.6rem] uppercase leading-[1.9] tracking-[0.14em] text-mute">
            {vaultCopy.note}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The featured track — the reason the room exists                     */
/* ------------------------------------------------------------------ */

function FeaturedTrack({ track }: { track: (typeof vaultRooms)[number]["tracks"][number] }) {
  const { isActive, snapshot } = useAudio();
  const active = isActive(track.id);
  const playing = active && snapshot.status === "playing";
  const artwork = track.artworkWix ? wix(track.artwork, 1200, 1200) : track.artwork;

  return (
    <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-16">
      {/* Artwork, with a play control overlaid. The button sits *on* the art
          rather than beside it, which is the gesture a music platform asks
          for, and it keeps the whole composition to two blocks. */}
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-sm border border-line">
          <Media
            src={artwork}
            alt={track.artworkAlt}
            width={1200}
            height={1200}
            sizes="(max-width: 1024px) 92vw, 42vw"
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton track={track} variant="hero" labelHidden />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-brass">
          {track.meta}
        </p>
        <h3
          className={`mt-4 font-display leading-[0.94] tracking-[-0.03em] transition-colors duration-500 ${
            playing ? "text-brass-bright" : "text-paper"
          }`}
          style={{ fontSize: "clamp(2.1rem, 4.6vw, 4.2rem)" }}
        >
          {track.title}
        </h3>
        <p className="mt-6 max-w-xl text-sm leading-[1.85] text-bone md:text-base">
          {track.note}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <PlayButton track={track} variant="hero" />
        </div>

        <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {track.streams.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-bone transition-colors hover:text-brass-bright"
                data-cursor="link"
              >
                {s.label}
                {s.note ? (
                  <span className="text-[0.9em] normal-case tracking-[0.14em] text-mute">
                    {s.note}
                  </span>
                ) : null}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
