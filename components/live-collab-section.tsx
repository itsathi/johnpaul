"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import SectionTag from "./ui/section-tag";
import Marquee from "./ui/marquee";
import Media from "./ui/media";
import MagneticButton from "./ui/magnetic-button";
import { collaborations, liveShots, liveStatement } from "@/content/site";
import { wix } from "@/lib/media";
import { useIsPrecisionPointer } from "@/lib/media-hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { label: "On the road", value: "10+ Yrs", note: "Arena tours & headline stages" },
  { label: "Live audiences", value: "50k+", note: "Stadiums & premier venues nationwide" },
  { label: "Collaborations", value: "20+", note: "With India's highest-tier artists" },
  { label: "Instruments", value: "08", note: "Played live on stage & in studio" },
];

export default function LiveCollabSection({
  index = "07",
  label = "Live & Collaborations — Social Proof",
}: {
  index?: string;
  label?: string;
} = {}) {
  const fine = useIsPrecisionPointer();
  const [activeCollab, setActiveCollab] = useState<(typeof collaborations)[number] | null>(null);

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const px = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.8 });
  const py = useSpring(my, { stiffness: 260, damping: 26, mass: 0.8 });

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section id="live" className="relative overflow-hidden bg-coal py-28 md:py-40">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[30rem] w-[30rem] rounded-full bg-brass/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-brass/5 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index={index} label={label} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-20">
          <div>
            <h2
              className="font-display leading-[0.92] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2.6rem, 7vw, 6.4rem)" }}
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="block will-change-transform"
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  Ten years on the road.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block italic text-brass-bright will-change-transform"
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
                >
                  Arena stages &amp; shared rooms.
                </motion.span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
              {liveStatement.note} Proof of craft earned in front of tens of
              thousands of listeners across the subcontinent.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton
                as="a"
                href={liveStatement.tickets.href}
                target="_blank"
                rel="noreferrer noopener"
                strength={0.3}
                className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink"
                ariaLabel="Check tour dates & tickets"
              >
                <span
                  className="inline-flex items-center gap-2 px-6 py-3"
                  style={{ background: "linear-gradient(120deg, #dcac73, #c08b4c)" }}
                >
                  {liveStatement.tickets.label}
                  <span aria-hidden>↗</span>
                </span>
              </MagneticButton>
              <Link
                href="/music#collab"
                data-cursor="link"
                className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone transition-colors hover:text-brass-bright"
              >
                All Collaborators
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ---- Social proof metrics strip ---- */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-y border-line py-8 sm:grid-cols-4 md:mt-20">
          {STATS.map((s, idx) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1 ${
                idx > 0 ? "border-l border-line/60 pl-6 sm:pl-8" : ""
              }`}
            >
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.28em] text-mute">
                {s.label}
              </span>
              <span className="font-display text-3xl tracking-tight text-paper sm:text-4xl">
                {s.value}
              </span>
              <span className="text-[0.75rem] text-bone/70">{s.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Dual-row stage photograph marquee ---- */}
      <div className="mt-16 flex flex-col gap-4 md:mt-24 md:gap-6">
        <Marquee duration={84} pauseOnHover className="py-1">
          {liveShots.map((shot) => (
            <LiveFigure key={shot.id} shot={shot} width={380} />
          ))}
        </Marquee>

        <Marquee duration={96} reverse pauseOnHover className="py-1">
          {[...liveShots].reverse().map((shot) => (
            <LiveFigure key={`rev-${shot.id}`} shot={shot} width={380} />
          ))}
        </Marquee>
      </div>

      {/* ---- High-profile collaborators showcase ---- */}
      <div
        className="mt-20 md:mt-28"
        onMouseMove={onMove}
        onMouseLeave={() => setActiveCollab(null)}
      >
        <div className="mx-auto mb-6 w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brass-bright">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            Documented Collaborations · Shared Stages &amp; Records
          </p>
        </div>

        <Marquee duration={64} pauseOnHover>
          {collaborations.map((c) => (
            <button
              key={c.name}
              type="button"
              data-cursor="view"
              data-cursor-label="View"
              onMouseEnter={() => setActiveCollab(c)}
              className="group px-5 py-2 transition-transform duration-300 md:px-8 hover:scale-105"
            >
              <span
                className="font-display italic transition-colors duration-300 group-hover:text-brass-bright text-paper/85"
                style={{ fontSize: "clamp(2.4rem, 6.4vw, 6.8rem)", lineHeight: 1.05 }}
              >
                {c.name}
              </span>
              <span className="mx-3 align-middle font-mono text-2xl text-brass/60 md:mx-5">
                ·
              </span>
            </button>
          ))}
        </Marquee>
      </div>

      {/* Extended collaborator tags */}
      <div className="mx-auto mt-12 flex w-full max-w-[92rem] flex-wrap items-center gap-x-3 gap-y-2 px-6 md:px-10 lg:px-14">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
          Touring &amp; Studio Call List:
        </span>
        {[
          "Arijit Singh Live",
          "Karan Aujla Tour",
          "Shankar Mahadevan",
          "Nikhita Gandhi",
          "The Raghu Dixit Project",
          "Rupam Islam",
          "Anupam Roy",
          "Madhubanti Bagchi",
          "Gino Banks",
          "Darshan Doshi",
        ].map((name, i) => (
          <span
            key={name}
            className="rounded-full border border-line bg-ink/40 px-3.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone/80"
          >
            {name}
          </span>
        ))}
      </div>

      {/* Interactive cursor-tracking hover preview for desktop */}
      {fine ? (
        <AnimatePresence>
          {activeCollab ? (
            <motion.div
              key={activeCollab.name}
              className="pointer-events-none fixed top-0 left-0 z-[60] flex flex-col"
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="-translate-x-1/2 -translate-y-1/2"
                style={{ marginLeft: 36, marginTop: -24 }}
              >
                <div className="w-[200px] overflow-hidden rounded-sm border border-brass/50 bg-ink shadow-2xl">
                  <div className="aspect-[4/5] w-full">
                    {activeCollab.media ? (
                      <Media
                        src={activeCollab.media}
                        alt={activeCollab.name}
                        wixWidth={480}
                        wixHeight={600}
                        sizes="200px"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-smoke-2 to-coal">
                        <span className="font-display text-5xl italic text-brass/60">
                          {activeCollab.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-line bg-ink/90 p-3 text-center">
                    <p className="font-display text-base italic leading-none text-paper">
                      {activeCollab.name}
                    </p>
                    <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-brass-bright">
                      {activeCollab.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </section>
  );
}

function LiveFigure({
  shot,
  width,
}: {
  shot: { id: string; caption: string };
  width: number;
}) {
  return (
    <figure className="relative mr-4 w-60 shrink-0 md:mr-6 md:w-80">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line/80 bg-smoke transition-transform duration-500 hover:scale-[1.02]">
        <Image
          src={wix(shot.id, width, Math.round(width * 1.25))}
          alt={shot.caption}
          width={width}
          height={Math.round(width * 1.25)}
          sizes="(max-width: 768px) 240px, 320px"
          className="h-full w-full object-cover"
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
          aria-hidden
        />
        <figcaption className="absolute bottom-3 left-3 right-3 flex items-center gap-2 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-paper">
          <span className="h-px w-3 bg-brass" />
          <span className="truncate">{shot.caption}</span>
        </figcaption>
      </div>
    </figure>
  );
}
