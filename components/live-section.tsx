"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import Media from "./ui/media";
import MagneticButton from "./ui/magnetic-button";
import { liveShots, liveStatement } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LiveSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const mm = gsap.matchMedia();

    // Desktop: pinned horizontal gallery where the stage scrolls sideways.
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;
        const sel = gsap.utils.selector(section);
        const track = sel(".live-track")[0];
        const giant = sel(".live-giant")[0];
        const panel = sel(".live-panel")[0];

        const distance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const el = sel(".live-index")[0];
              if (el) {
                const idx = Math.min(
                  liveShots.length,
                  Math.max(1, 1 + Math.round(self.progress * (liveShots.length - 1))),
                );
                el.textContent = `${String(idx).padStart(2, "0")} / ${String(
                  liveShots.length,
                ).padStart(2, "0")}`;
              }
            },
          },
        });

        // Giant outline "LIVE" drifts slower than the cards for depth.
        gsap.fromTo(
          giant,
          { xPercent: 7 },
          {
            xPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        // Intro panel slides off before the gallery.
        gsap.to(panel, {
          opacity: 0,
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=12%",
            scrub: 1,
          },
        });

        // Each card: inner-image parallax + a little approach rotation.
        sel(".live-card").forEach((card, i) => {
          const img = card.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -13, scale: 1.18 },
              {
                yPercent: 13,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "left 95%",
                  end: "left -5%",
                  scrub: true,
                },
              },
            );
          }
          gsap.fromTo(
            card,
            { rotate: i % 2 ? 1.8 : -1.8 },
            {
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "left 78%",
                end: "left 15%",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            card,
            { opacity: 0.45, scale: 0.94 },
            {
              opacity: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "right 92%",
                end: "left 72%",
                scrub: true,
              },
            },
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section
      id="live"
      ref={sectionRef}
      className="relative overflow-hidden bg-coal lg:h-[100svh]"
    >
      {/* Giant drifting outline word (desktop) */}
      <div
        className="live-giant pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display leading-none text-outline opacity-70 lg:block"
        style={{ fontSize: "clamp(16rem, 30vw, 34rem)" }}
        aria-hidden
      >
        LIVE
      </div>

      {/* Desktop: pinned horizontal parallax stage */}
      {!reduced && (
        <div className="relative z-10 hidden h-[100svh] items-center lg:flex">
          <div className="live-track flex h-full items-center gap-[6vw] pl-[7vw] pr-[18vw] will-change-transform">
            {/* Intro panel */}
            <div className="live-panel flex w-[42vw] shrink-0 flex-col justify-between self-stretch py-[14vh]">
              <div>
                <SectionTag index="05" label="Live" />
                <h2
                  className="mt-10 flex items-baseline gap-6 font-display tracking-[-0.02em] text-paper"
                  style={{ fontSize: "clamp(4rem, 7vw, 10rem)" }}
                >
                  LIVE
                  <span className="live-index font-mono text-sm tracking-[0.3em] text-brass">
                    01 / 09
                  </span>
                </h2>
              </div>

              <div>
                <p
                  className="font-display text-2xl italic leading-snug text-bone md:text-3xl"
                  style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)" }}
                >
                  {liveStatement.line} {liveStatement.lineTwo}
                  <br />
                  {liveStatement.lineThree}
                </p>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone md:text-base">
                  {liveStatement.note}
                </p>
                <div className="mt-8">
                  <MagneticButton
                    as="a"
                    href={liveStatement.tickets.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    strength={0.3}
                    className="group inline-flex items-center gap-3 rounded-full border border-line px-8 py-4 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-bone transition-colors hover:border-brass hover:text-paper"
                    ariaLabel="Tickets and upcoming dates"
                  >
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                    {liveStatement.tickets.label}
                  </MagneticButton>
                </div>
              </div>
            </div>

            {/* Photo cards */}
            {liveShots.map((shot, i) => (
              <figure
                key={`${shot.id}-${i}`}
                className="live-card relative h-[56vh] w-[52vw] shrink-0 overflow-hidden rounded-xl border border-line will-change-transform lg:w-[38vw]"
              >
                <Media
                  src={shot.id}
                  alt={`${shot.caption} — John Paul, live`}
                  wixWidth={1400}
                  wixHeight={900}
                  sizes="(max-width: 1280px) 50vw, 38vw"
                  className="h-full w-full object-cover will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/15" />
                <figcaption className="absolute bottom-5 left-5 flex items-center gap-3 pr-24 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-paper">
                  <span className="h-px w-6 bg-brass" />
                  {shot.caption}
                  <span className="ml-auto text-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* Mobile / tablet: stacked vertical gallery */}
      <div className="py-28 md:py-36 lg:hidden">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10">
          <SectionTag index="05" label="Live" />
          <h2
            className="mt-10 font-display leading-[0.85] tracking-[-0.02em] text-outline"
            style={{ fontSize: "clamp(5rem, 26vw, 12rem)" }}
          >
            LIVE
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
            <p
              className="font-display text-2xl italic leading-snug text-bone md:text-3xl"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)" }}
            >
              {liveStatement.line} {liveStatement.lineTwo}
              <br />
              {liveStatement.lineThree}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-bone md:text-base">
              {liveStatement.note}
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-10">
            {liveShots.map((shot, i) => (
              <motion.figure
                key={`m-${shot.id}-${i}`}
                className="relative w-full"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <div className="relative h-[58vh] overflow-hidden md:h-[72vh]">
                  <Media
                    src={shot.id}
                    alt={`${shot.caption} — John Paul, live`}
                    wixWidth={1400}
                    wixHeight={1100}
                    sizes="100vw"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
                  <figcaption className="absolute bottom-4 left-4 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-paper/90">
                    <span className="h-px w-6 bg-brass" />
                    {shot.caption}
                    <span className="text-mute">0{i + 1}</span>
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 flex flex-wrap items-center justify-between gap-8 px-6 md:px-10">
          <MagneticButton
            as="a"
            href={liveStatement.tickets.href}
            target="_blank"
            rel="noopener noreferrer"
            strength={0.3}
            className="group inline-flex items-center gap-3 rounded-full border border-line px-8 py-4 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-bone transition-colors hover:border-brass hover:text-paper"
            ariaLabel="Tickets and upcoming dates"
          >
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
            {liveStatement.tickets.label}
          </MagneticButton>
          <p className="max-w-xs font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
            Arijit Singh Live · Karan Aujla — India Tour · Nikhita Gandhi Live ·
            The Raghu Dixit Project
          </p>
        </div>
      </div>
    </section>
  );
}