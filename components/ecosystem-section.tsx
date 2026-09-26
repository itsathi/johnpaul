"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import { useScrollTo } from "./smooth-scroll";
import { ecosystem, type Pillar } from "@/content/platform";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The platform, drawn as a constellation rather than a flowchart: John's
 * professional life as six reachable rooms around one mark. The centre answers
 * to whichever room is being looked at, so the diagram behaves like an index
 * instead of a diagram.
 */

/* Grid placement per pillar, so the six rooms sit around the seal on desktop
   and fall back to a plain reading order on small screens. */
const PLACEMENT: Record<string, string> = {
  music: "lg:col-start-1 lg:row-start-1",
  artist: "lg:col-start-2 lg:row-start-1",
  sessions: "lg:col-start-3 lg:row-start-1",
  shop: "lg:col-start-1 lg:row-start-2",
  academy: "lg:col-start-3 lg:row-start-2",
  gallery: "lg:col-start-2 lg:row-start-3",
};

export default function EcosystemSection() {
  const { scrollTo } = useScrollTo();
  const [active, setActive] = useState<string | null>(null);
  const focus = ecosystem.pillars.find((p) => p.key === active) ?? null;

  return (
    <section id="ecosystem" className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* the mark everything hangs from */}
      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="01" label={ecosystem.kicker} />

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
          <h2
            className="font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6.6vw, 6rem)" }}
          >
            {ecosystem.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block will-change-transform ${
                    i === 2 ? "italic text-bone/70" : ""
                  }`}
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            className="max-w-md text-sm leading-relaxed text-bone md:text-base"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            {ecosystem.intro}
          </motion.p>
        </div>

        {/* ---- the constellation ---- */}
        <div
          className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-3 lg:gap-y-14"
          onMouseLeave={() => setActive(null)}
        >
          {ecosystem.pillars.map((pillar) => (
            <PillarCard
              key={pillar.key}
              pillar={pillar}
              dimmed={active !== null && active !== pillar.key}
              onEnter={() => setActive(pillar.key)}
              onLeave={() => setActive(null)}
              onNavigate={(href) => scrollTo(href)}
            />
          ))}

          <div className="col-span-full row-start-1 sm:col-span-2 sm:col-start-1 lg:col-span-1 lg:col-start-2 lg:row-start-2">
            <Seal focus={focus} />
          </div>
        </div>

        <motion.p
          className="mt-14 flex max-w-3xl items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute md:mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
          {ecosystem.note}
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PillarCard({
  pillar,
  dimmed,
  onEnter,
  onLeave,
  onNavigate,
}: {
  pillar: Pillar;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onNavigate: (href: string) => void;
}) {
  return (
    <motion.article
      className={`group relative transition-opacity duration-500 ${PLACEMENT[pillar.key]}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ opacity: dimmed ? 0.42 : 1 }}
    >
      {/* hairline that fills on hover — the discipline-card pattern, kept */}
      <span className="absolute -top-px left-0 h-px w-10 bg-brass transition-all duration-500 group-hover:w-full" />

      <div className="pt-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
            {pillar.no}
          </span>
          {pillar.source === "demo" ? (
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.22em] text-mute">
              Structure
            </span>
          ) : null}
        </div>

        <h3
          className="mt-3 font-display leading-none tracking-tight text-bone transition-colors duration-300 group-hover:text-brass-bright"
          style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.4rem)" }}
        >
          {pillar.title}
        </h3>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/80">{pillar.line}</p>

        <ul className="mt-5 flex flex-col gap-1.5">
          {pillar.children.map((child) => (
            <li key={`${pillar.key}-${child.href}-${child.label}`}>
              <button
                type="button"
                onClick={() => onNavigate(child.href)}
                className="group/link flex items-baseline gap-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute transition-colors duration-300 hover:text-brass-bright"
                data-cursor="link"
              >
                <span className="h-px w-3 shrink-0 bg-line transition-all duration-300 group-hover/link:w-6 group-hover/link:bg-brass" />
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */

function Seal({ focus }: { focus: Pillar | null }) {
  const { seal } = ecosystem;

  return (
    <div className="relative flex h-full flex-col items-center justify-center text-center">
      <OrbitField />

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.42em] text-brass">
          {seal.overline}
        </span>

        <span
          className="mt-3 font-display leading-none tracking-tight text-paper"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
        >
          {seal.title}
        </span>

        <span className="mt-3 font-display text-lg italic text-bone/70">
          {seal.underline}
        </span>
      </motion.div>

      {/* the centre answers to whichever room is being looked at */}
      <motion.p
        className="relative mt-7 max-w-[24rem] min-h-[5.5rem] font-mono text-[0.58rem] uppercase leading-[1.9] tracking-[0.2em] text-mute"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      >
        {focus ? (
          <motion.span
            key={focus.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="block normal-case tracking-normal text-bone/85 font-sans text-[0.8rem] leading-relaxed"
          >
            {focus.line}
          </motion.span>
        ) : (
          <span>{seal.note}</span>
        )}
      </motion.p>
    </div>
  );
}

/** Two dashed rings, drifting slowly. Decorative only. */
function OrbitField() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[26rem] max-w-[190%] -translate-x-1/2 -translate-y-1/2 sm:w-[32rem]"
      aria-hidden
    >
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(188,138,76,0.16)"
          strokeWidth="0.7"
          strokeDasharray="2 7"
          className="motion-safe:animate-[drift_120s_linear_infinite] origin-center"
        />
        <circle
          cx="200"
          cy="200"
          r="196"
          fill="none"
          stroke="rgba(236,230,218,0.08)"
          strokeWidth="0.7"
          strokeDasharray="1 11"
          className="motion-safe:animate-[drift_200s_linear_infinite_reverse] origin-center"
        />
      </svg>
    </div>
  );
}
