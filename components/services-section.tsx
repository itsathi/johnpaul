"use client";

import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import { services } from "@/content/site";
import { useScrollTo } from "./smooth-scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ServicesSection() {
  const { scrollTo } = useScrollTo();

  return (
    <section id="services" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag index="13" label="Working together" />
            <p
              className="mt-10 font-display leading-[1.04] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2rem, 4.6vw, 4.4rem)" }}
            >
              Work <em className="italic text-brass-bright">with</em> John.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone">
            A session player, live guitarist and producer who has recorded and
            performed across India&apos;s music for over a decade. Have a song,
            a stage, or an idea — there is a way to make it together.
          </p>
        </div>

        <div className="mt-20 border-t border-line md:mt-28">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              className="group grid gap-4 border-b border-line py-10 md:grid-cols-[70px_1.2fr_1fr_80px] md:items-center md:py-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, delay: i * 0.08, ease: EASE }}
            >
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
                {s.no}
              </span>
              <h3
                className="font-display leading-none tracking-tight text-paper transition-colors duration-300 group-hover:text-brass-bright"
                style={{ fontSize: "clamp(1.8rem, 4vw, 4rem)" }}
              >
                {s.name}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-bone">
                {s.body}
              </p>
              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brass group-hover:bg-brass/10 md:flex"
                aria-label={`Discuss ${s.name}`}
                data-cursor="link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M1 8 H15 M8 1 L15 8 L8 15" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-8 md:mt-28 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md font-display text-2xl italic leading-snug text-bone md:text-3xl">
            For songs, stages, records and workshops — the door is open.
          </p>
          <MagneticButton
            className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-ink"
            strength={0.4}
            onClick={() => scrollTo("#contact")}
            ariaLabel="Start a conversation about working with John"
          >
            <span
              className="px-10 py-5"
              style={{
                background: "linear-gradient(120deg, #dcac73, #c08b4c)",
              }}
            >
              Start a conversation
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}