"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import { useScrollTo } from "./smooth-scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

const disciplines = [
  { word: "LIVE", target: "#live", caption: "Tours, arenas, festivals" },
  { word: "SESSION", target: "#studio", caption: "Records, films, jingles" },
  { word: "PRODUCTION", target: "#instruments", caption: "Arranging, programming" },
  { word: "ARTIST", target: "#kalpana", caption: "His own music — Kalpana" },
];

export default function ArtistIntro() {
  const { scrollTo } = useScrollTo();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="work" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active === null ? 0 : 1,
          background: `radial-gradient(560px 420px at ${20 + active! * 24
            }% 70%, rgba(188,138,76,0.12), transparent 70%)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="03" label="The artist" />

        <div className="mt-14 max-w-5xl">
          <p
            className="font-display leading-[1.02] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.6rem, 6.4vw, 6.4rem)" }}
          >
            <MaskedLine delay={0.05}>From the stage</MaskedLine>
            <MaskedLine delay={0.18} muted>
              to the studio.
            </MaskedLine>
          </p>
        </div>

        <div
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-4 md:mt-24 lg:grid-cols-4"
          onMouseLeave={() => setActive(null)}
        >
          {disciplines.map((d, i) => (
            <motion.button
              key={d.word}
              type="button"
              data-cursor="link"
              onClick={() => scrollTo(d.target)}
              onMouseEnter={() => setActive(i)}
              className="group relative border-t border-line pt-5 text-left"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
            >
              <span className="absolute -top-px left-0 h-px w-10 bg-brass transition-all duration-500 group-hover:w-full" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
                0{i + 1}
              </span>
              <span
                className="mt-3 block font-display leading-none tracking-tight text-bone transition-colors duration-300 group-hover:text-brass-bright"
                style={{ fontSize: "clamp(1.7rem, 3.4vw, 3.4rem)" }}
              >
                {d.word}
              </span>
              <span className="mt-3 hidden font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute transition-colors duration-300 md:block">
                {d.caption}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="mt-24 flex max-w-3xl flex-col gap-8 md:mt-36 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="max-w-xl text-base leading-relaxed text-bone md:text-lg">
            More than a decade of professional music — seen from three very
            different seats: the stage, the session room, and the desk where a
            record is assembled.Now, from the same seats, his own songs.
          </p>
          <div className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
            <span className="h-px w-10 bg-line" />
            Scroll to explore
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MaskedLine({
  children,
  delay = 0,
  muted = false,
}: {
  children: string;
  delay?: number;
  muted?: boolean;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block will-change-transform ${muted ? "italic text-bone/70" : ""}`}
        initial={{ y: "112%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}