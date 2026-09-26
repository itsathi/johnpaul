"use client";

import { motion } from "framer-motion";
import Media from "./ui/media";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import Marquee from "./ui/marquee";
import { nowPlaying } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NowPlaying() {
  return (
    <section id="listen" className="relative bg-ink pt-20 md:pt-28">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="03" label={nowPlaying.kicker} />

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

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {nowPlaying.streams.map((stream, i) => (
                <MagneticButton
                  key={stream.label}
                  as="a"
                  href={stream.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  strength={0.3}
                  className={
                    i === 0
                      ? "group inline-flex items-center gap-3 rounded-full bg-brass px-8 py-4 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-brass-bright"
                      : "group inline-flex items-center gap-3 rounded-full border border-line px-8 py-4 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-bone transition-colors hover:border-brass hover:text-paper"
                  }
                  ariaLabel={`Stream ${nowPlaying.title} on ${stream.label}`}
                >
                  <PlayGlyph />
                  {stream.label}
                </MagneticButton>
              ))}
            </div>

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

          <motion.a
            href={nowPlaying.video.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-xl border border-line"
            data-cursor="link"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: EASE }}
            aria-label={nowPlaying.video.label}
          >
            <Media
              src={nowPlaying.artwork}
              alt="Cover artwork for Yosemite's Hathi"
              width={1280}
              height={720}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              placeholderLabel="Single artwork — Yosemite's Hathi"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-paper/30 bg-ink/40 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                <PlayGlyph />
              </span>
            </div>
            <span className="absolute bottom-4 left-5 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-paper">
              {nowPlaying.video.label}
            </span>
          </motion.a>
        </div>
      </div>

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

function PlayGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path d="M2.5 1.5v9L10 6z" fill="currentColor" />
    </svg>
  );
}