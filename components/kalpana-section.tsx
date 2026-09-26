"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "./ui/section-tag";
import { kalpana, artist } from "@/content/site";
import { useIsPrecisionPointer, usePrefersReducedMotion } from "@/lib/media-hooks";

gsap.registerPlugin(ScrollTrigger);
const EASE = [0.22, 1, 0.36, 1] as const;

export default function KalpanaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lettersRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useIsPrecisionPointer();

  useEffect(() => {
    if (reduced || !finePointer) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lettersRef.current,
        { xPercent: 0 },
        {
          xPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [finePointer, reduced]);

  const letters = kalpana.title.split("");

  return (
    <section
      id="kalpana"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-28 md:py-40"
    >
      {/* giant scrolling letters */}
      <div className="pointer-events-none absolute top-0 left-0 select-none whitespace-nowrap">
        <div
          ref={lettersRef}
          className="flex will-change-transform"
          style={{ fontFamily: "var(--font-display)", lineHeight: 0.9 }}
        >
          {[...letters, ...letters].map((l, i) => (
            <span
              key={i}
              className={`text-outline mr-[0.14em] font-display italic ${
                i % 3 === 0 ? "text-outline-brass" : ""
              }`}
              style={{ fontSize: "clamp(7rem, 22vw, 24rem)" }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="05" label="Kalpana — the album" />

        <div className="mt-24 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Artwork */}
          <div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            data-cursor="view"
            data-cursor-label="Music"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-full bg-brass/10 blur-3xl" />
            <KalpanaArtwork />
            <p className="mt-5 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
              <span className="h-px w-6 bg-line" />
              Album artwork — concept
            </p>
          </div>

          {/* Copy */}
          <div>
            <motion.h2
              className="font-display leading-[0.88] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(4rem, 11vw, 10.5rem)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              {kalpana.title}
            </motion.h2>

            <p className="mt-6 max-w-md font-display text-xl italic leading-snug text-brass-bright md:text-2xl">
              {kalpana.meaning}
            </p>

            <p
              className="mt-8 max-w-xl text-base leading-relaxed text-bone md:text-lg"
              style={{ maxWidth: "34rem" }}
            >
              {kalpana.philosophy}
            </p>

            <div className="mt-8 flex flex-col gap-3 border-l border-brass/40 pl-6">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-mute">
                Dedication
              </p>
              <p className="font-display text-xl italic text-paper">
                {kalpana.dedication}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              {kalpana.credits.split("·").map((c, i) => (
                <span
                  key={i}
                  className="rounded-full border border-line px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone"
                >
                  {c.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Track */}
        <motion.div
          className="mt-24 grid gap-10 border-t border-line pt-14 md:mt-32 md:grid-cols-[1fr_1fr] md:gap-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-mute">
              First song from Kalpana
            </p>
            {kalpana.tracks.map((track) => (
              <a
                key={track.title}
                href={track.youtube}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="play"
                data-cursor-label="Play"
                className="group mt-6 block"
              >
                <span className="flex items-baseline gap-6 font-display text-paper transition-colors group-hover:text-brass-bright">
                  <span className="text-outline-brass text-3xl">{track.no}</span>
                  <span
                    className="leading-none tracking-[-0.01em]"
                    style={{ fontSize: "clamp(2rem, 5vw, 4.6rem)" }}
                  >
                    {track.title}
                  </span>
                </span>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-bone">
                  {track.note}. Watch the music video on YouTube.
                </p>
              </a>
            ))}
          </div>

          <div>
            <a
              href={kalpana.tracks[0].youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden bg-coal"
              data-cursor="play"
              data-cursor-label="Watch"
            >
              <img
                src={kalpana.tracks[0].thumbnail}
                alt="Yosemite's Hathi — music video on YouTube"
                loading="lazy"
                className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-ink/35 transition-colors group-hover:bg-ink/15" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/50 bg-ink/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 14 14" className="translate-x-px">
                    <path d="M2 1.5 L12 7 L2 12.5 Z" fill="currentColor" className="text-paper" />
                  </svg>
                </span>
              </div>
              <span className="absolute bottom-3 left-4 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-paper/90">
                Official music video · YouTube
              </span>
            </a>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-mute">
            <span className="h-2 w-2 rounded-full bg-brass" />
            {kalpana.premiere}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-bone">
            {kalpana.tribute}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Designed album sleeve concept — concentric rings, warm gradient, restraint. */
function KalpanaArtwork() {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#3a2c1c] via-[#1c150e] to-[#0a0908]">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {[14, 22, 30, 40, 52, 66, 82, 100].map((r, i) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r * 0.98}
            fill="none"
            stroke={
              i % 2 === 0
                ? "rgba(217,170,110,0.55)"
                : "rgba(236,230,218,0.14)"
            }
            strokeWidth={i % 2 === 0 ? 0.7 : 0.4}
          />
        ))}
        <circle cx="100" cy="100" r="2.2" fill="#dcac73" />
      </svg>

      <div className="absolute inset-x-0 bottom-6 flex items-end justify-between px-5">
        <span className="font-display text-2xl leading-none tracking-tight text-paper">
          {artist.name}
        </span>
        <span className="font-display text-xl italic text-brass-bright">
          {kalpana.title}
        </span>
      </div>

      <span className="absolute top-5 right-5 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-bone/60">
        LP — 01
      </span>
      <span className="absolute top-5 left-5 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-bone/60">
        EST. Kolkata
      </span>
    </div>
  );
}