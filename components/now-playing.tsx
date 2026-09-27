"use client";

/**
 * Now Playing — the invitation to press play.
 *
 * This used to be a row of buttons that all left the site for YouTube. It now
 * does the thing the section was asking for: the primary control starts the
 * in-site transport, and the persistent player follows you from there. The
 * external links are still here, labelled as what they are, because a real
 * release *is* streamed on real services and pretending otherwise would be
 * worse than one button too many.
 *
 * `PlayButton` carries the demo-transport warning, so the honesty about there
 * being no audio file travels with the control that starts it.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import Media from "./ui/media";
import SectionTag from "./ui/section-tag";
import Marquee from "./ui/marquee";
import PlayButton from "./player/play-button";
import { leadTrack } from "@/content/music-vault";
import { nowPlaying } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NowPlaying({
  index = "03",
  label = nowPlaying.kicker,
}: {
  index?: string;
  label?: string;
} = {}) {
  return (
    <section id="listen" className="relative bg-ink pt-20 md:pt-28">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index={index} label={label} />

        <div className="mt-14 grid items-end gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="mb-6 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brass-bright">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass-bright opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brass-bright" />
              </span>
              {nowPlaying.eyebrow}
            </p>

            <h2
              className="font-display leading-[0.92] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(3.2rem, 9vw, 9rem)" }}
            >
              {nowPlaying.title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-bone md:text-lg">
              {nowPlaying.tagline}
            </p>

            <ul className="mt-6 flex flex-col gap-2 font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
              {nowPlaying.facts.map((fact) => (
                <li key={fact}>&mdash;&nbsp;{fact}</li>
              ))}
            </ul>

            {/* The primary action: play it here, and the player follows you
                around the site from that press. */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <PlayButton track={leadTrack} variant="hero" />
              <Link
                href="/music/kalpana"
                data-cursor="link"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-7 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-bone transition-colors hover:border-brass hover:text-brass-bright"
              >
                The Kalpana story
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            {/* The real way in. Labelled as external so nobody is surprised
                when the player is still silent. */}
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {nowPlaying.streams.map((stream) => (
                <li key={stream.label}>
                  <a
                    href={stream.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="group inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-brass-bright"
                  >
                    {stream.label}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={nowPlaying.premiere.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-paper"
              data-cursor="link"
            >
              <span aria-hidden>↳</span>
              {nowPlaying.premiere.label}
            </a>
          </motion.div>

          {/* The artwork doubles as the poster for the video, so it is one
              object with two jobs rather than two nearly-identical images. */}
          <motion.a
            href={nowPlaying.video.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-sm border border-line"
            data-cursor="link"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: EASE }}
            aria-label={`${nowPlaying.video.label} (opens in a new tab)`}
          >
            <Media
              src={nowPlaying.artwork}
              alt="Cover artwork for Yosemite's Hathi"
              width={1280}
              height={720}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60"
            />
            <span
              aria-hidden
              className="absolute bottom-4 left-5 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-paper"
            >
              {nowPlaying.video.label}
            </span>
          </motion.a>
        </div>
      </div>

      {/* The marquee doubles as the section's closing rhythm and as the
          in-page route to the vault directly below it. */}
      <div className="mt-20 border-y border-line py-5 md:mt-28">
        <Marquee>
          {["Yosemite's Hathi", "Kalpana", "Now playing", "Out now"].map((item) => (
            <span
              key={item}
              className="flex items-center gap-6 pr-6 font-display text-4xl italic tracking-tight text-bone/50 md:text-6xl"
            >
              {item}
              <span className="text-brass" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
