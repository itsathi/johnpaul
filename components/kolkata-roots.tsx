"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MediaReveal from "./ui/media-reveal";
import { kolkataShots } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Organic topographic contour lines around a city-ish heart. */
function ContourField() {
  const rings = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const r = 34 + i * 21;
      const ox = Math.sin(i * 2.4) * 8;
      const oy = Math.cos(i * 1.7) * 7;
      const wobble = 9 + (i % 3) * 5;
      let d = "";
      const steps = 26;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        const rad = r + Math.sin(a * 3.2 + i) * wobble + Math.cos(a * 5.1 + i * 2) * 3;
        const x = 220 + ox + Math.cos(a) * rad;
        const y = 220 + oy + Math.sin(a) * rad;
        d += `${s === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      return d + "Z";
    });
  }, []);

  return (
    <svg
      viewBox="0 0 440 440"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {rings.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i % 2 === 0 ? "rgba(217,170,110,0.4)" : "rgba(207,199,182,0.16)"}
          strokeWidth={i % 2 === 0 ? 1.1 : 0.6}
        />
      ))}
      <circle cx="220" cy="220" r="3.2" fill="#d9aa6e" />
      <circle cx="220" cy="220" r="11" fill="none" stroke="#d9aa6e" strokeWidth="0.8" />
    </svg>
  );
}

export default function KolkataRoots() {
  return (
    <section id="roots" className="relative overflow-hidden bg-coal py-28 md:py-44">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="11" label="Roots — Kolkata" />

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2
              className="font-display leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: "clamp(4rem, 10vw, 9.5rem)" }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 46 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 1, ease: EASE }}
              >
                KOL<span className="italic text-brass-bright">KATA</span>
              </motion.span>
            </h2>

            <motion.p
              className="mt-8 font-display text-2xl italic leading-snug text-bone md:text-3xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              The city that first taught him the rhythm.
            </motion.p>

            <motion.p
              className="mt-6 max-w-lg text-sm leading-relaxed text-bone md:text-base"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            >
              &ldquo;Growing up amongst the vibrant and diverse music scene in
              Kolkata was an environment full of inspiration and stimulation.&rdquo;
              <span className="mt-3 block font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
                — From his own words
              </span>
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              {["Harmonium", "School band", "Calcutta School of Music", "The Kolkata stages"].map((k, i) => (
                <span
                  key={k}
                  className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-bone/80"
                >
                  <span className="h-1 w-1 rounded-full bg-brass" />
                  {k}
                  {i < 3 ? <span className="text-mute">/</span> : null}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto hidden aspect-square w-full max-w-[440px] lg:block"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <ContourField />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.5em] text-mute">
                22.57° N · 88.36° E
              </span>
            </div>
          </motion.div>
        </div>

        {/* Kolkata imagery strip */}
        <div className="mt-20 grid grid-cols-2 gap-5 md:mt-28 md:grid-cols-3 md:gap-8">
          {kolkataShots.map((shot, i) => (
            <MediaReveal
              key={shot.id}
              src={shot.id}
              alt={`${shot.caption} — Kolkata with John Paul`}
              wixWidth={720}
              wixHeight={900}
              ratio={i === 1 ? "aspect-[3/4]" : "aspect-[4/5]"}
              sizes="(max-width: 768px) 48vw, 28vw"
              className={i === 1 ? "md:mt-14" : "md:mt-0"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}