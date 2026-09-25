"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import Media from "./ui/media";
import { instrumentExperience } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function InstrumentExperience() {
  const items = instrumentExperience.items;
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const current = items[index];

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <section
      id="instruments"
      ref={sectionRef}
      tabIndex={-1}
      className="relative overflow-hidden bg-coal py-28 outline-none md:py-40"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag index="09" label="The multi-instrumentalist" />
            <p
              className="mt-10 max-w-2xl font-display leading-[1.04] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2rem, 4.6vw, 4.4rem)" }}
            >
              One player, any room.
              <br />
              <em className="italic text-brass-bright">Pick an instrument.</em>
            </p>
          </div>
          <p className="max-w-xs font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.26em] text-mute">
            Use ← → to change the instrument
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:mt-28 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* instrument list */}
          <div className="flex flex-col border-t border-line">
            {items.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.name}
                  type="button"
                  data-cursor="link"
                  onClick={() => setIndex(i)}
                  className={`group flex items-center gap-5 border-b border-line py-5 text-left transition-all duration-500 md:py-6 ${
                    active ? "pl-4 md:pl-6" : ""
                  }`}
                  aria-pressed={active}
                >
                  <span
                    className={`font-mono text-[0.6rem] transition-colors ${
                      active ? "text-brass" : "text-mute"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`font-display leading-none tracking-tight transition-all duration-500 ${
                      active
                        ? "text-brass-bright"
                        : "text-bone group-hover:text-paper"
                    }`}
                    style={{
                      fontSize: "clamp(1.6rem, 3.6vw, 3.6rem)",
                      paddingLeft: active ? 8 : 0,
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`ml-auto h-px flex-1 transition-all duration-500 ${
                      active ? "bg-brass/70" : "bg-line"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* live content */}
          <div className="relative min-h-[440px] overflow-hidden bg-ink lg:min-h-[560px]">
            <AnimatePresence mode="sync">
              <motion.div
                key={current.name}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <Media
                  src={current.media}
                  alt={`${current.name} — ${instrumentExperience.kicker.toLowerCase()}`}
                  wixWidth={1100}
                  wixHeight={1300}
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/10" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`copy-${current.name}`}
                className="absolute inset-x-0 bottom-0 p-6 md:p-10"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div className="mb-5 flex items-center gap-2">
                  {items.map((_, i) => (
                    <span
                      key={i}
                      className={`h-[3px] w-8 transition-colors duration-300 ${
                        i === index ? "bg-brass-bright" : "bg-line"
                      }`}
                    />
                  ))}
                </div>
                <p className="max-w-lg text-sm leading-relaxed text-bone md:text-[0.95rem]">
                  {current.note}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}