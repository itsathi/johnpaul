"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import SectionTag from "./ui/section-tag";
import Marquee from "./ui/marquee";
import Media from "./ui/media";
import { collaborations } from "@/content/site";
import { useIsPrecisionPointer } from "@/lib/media-hooks";

export default function CollabSection() {
  const fine = useIsPrecisionPointer();
  const [active, setActive] = useState<(typeof collaborations)[number] | null>(null);

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const px = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.8 });
  const py = useSpring(my, { stiffness: 260, damping: 26, mass: 0.8 });

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section id="collab" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag index="08" label="Collaborations" />
            <p
              className="mt-10 max-w-2xl font-display leading-[1.04] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2rem, 4.4vw, 4.2rem)" }}
            >
              A decade of shared stages
              <br />
              and shared <em className="italic text-brass-bright">rooms</em>.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone md:pb-2">
            Some of the artists John Paul has performed and recorded with —
            listed with the respect of a session player who believes the song
            comes first.
          </p>
        </div>
      </div>

      <div
        className="mt-16 md:mt-24"
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
      >
        <Marquee duration={60} pauseOnHover>
          {collaborations.map((c) => (
            <button
              key={c.name}
              type="button"
              data-cursor="view"
              data-cursor-label="View"
              onMouseEnter={() => setActive(c)}
              className="group px-5 py-2 md:px-8"
            >
              <span
                className="font-display italic transition-colors duration-300 group-hover:text-brass-bright"
                style={{ fontSize: "clamp(2.6rem, 7vw, 7.5rem)", lineHeight: 1.05 }}
              >
                {c.name}
              </span>
              <span className="mx-2 align-middle font-mono text-2xl text-brass/60 md:mx-4">
                ·
              </span>
            </button>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-[92rem] flex-wrap items-center gap-x-3 gap-y-2 px-6 md:px-10 lg:px-14">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
          Also with
        </span>
        {[
          "Rupam Islam",
          "Anupam Roy",
          "Madhubanti Bagchi",
          "Daboo Malik",
          "Nakul Abhyankar",
          "Darshan Doshi",
          "Gino Banks",
          "Underground Authority",
        ].map((n, i) => (
          <span key={n} className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone/70">
            {i > 0 ? " · " : ""}
            {n}
          </span>
        ))}
      </div>

      {fine ? (
        <AnimatePresence>
          {active ? (
            <motion.div
              key={active.name}
              className="pointer-events-none fixed top-0 left-0 z-[60] flex flex-col"
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="-translate-x-1/2 -translate-y-1/2"
                style={{ marginLeft: 40, marginTop: -30 }}
              >
                <div className="w-[190px] overflow-hidden bg-coal">
                  <div className="aspect-[4/5] w-full">
                    {active.media ? (
                      <Media
                        src={active.media}
                        alt={active.name}
                        wixWidth={480}
                        wixHeight={600}
                        sizes="190px"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-smoke-2 to-coal">
                        <span className="font-display text-5xl italic text-brass/60">
                          {active.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 -translate-x-1/2 text-center">
                  <p className="font-display text-base italic leading-none text-paper">
                    {active.name}
                  </p>
                  <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                    {active.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </section>
  );
}