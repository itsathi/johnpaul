"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Media from "./ui/media";
import StringVisual from "./hero/string-visual";
import HalftonePortrait from "./hero/halftone-portrait";
import MagneticButton from "./ui/magnetic-button";
import { artist, media, nowPlaying, roles } from "@/content/site";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/media";
import { usePreloaderDone } from "@/lib/preload";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;

type Stage = "wait" | "show";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop(768);
  const loaded = usePreloaderDone();
  const stage: Stage = loaded ? "show" : "wait";

  useEffect(() => {
    if (reduced || !desktop) return;
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(contentRef.current, {
        yPercent: 34,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "78% top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [desktop, reduced]);

  const reveal = (delay: number) => ({
    wait: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: EASE } },
  });

  const maskReveal = (delay: number) => ({
    wait: { y: "112%" },
    show: {
      y: "0%",
      transition: { duration: 1.15, delay, ease: [0.22, 1, 0.36, 1] as const },
    },
  });

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[34rem] w-full overflow-hidden bg-ink sm:min-h-[620px]"
    >
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Media
          src={media.hero}
          alt="John Paul performing on stage with his guitar"
          wixWidth={1920}
          wixHeight={1208}
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-[60%_50%] md:object-center"
          placeholderLabel="Hero photograph — John Paul, live on stage"
        />
      </div>

      {/* the opening shot: the portrait, printed as a halftone plate */}
      <HalftonePortrait />

      {/* Scrims sit over the plate now, so they are scoped to what they are
          actually for: keeping the type legible, and letting the frame fall
          away at its edges. Anything heavier and the plate goes to mud. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,9,8,0.62)_0%,rgba(10,9,8,0.06)_26%,rgba(10,9,8,0.5)_70%,rgba(10,9,8,0.96)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,9,8,0.88)_0%,rgba(10,9,8,0.46)_32%,rgba(10,9,8,0.06)_60%,transparent_100%)] md:bg-[linear-gradient(to_right,rgba(10,9,8,0.86)_0%,rgba(10,9,8,0.4)_28%,transparent_56%)]" />
      <div className="vignette absolute inset-0 opacity-50 md:opacity-70" />

      <div
        className="absolute inset-y-0 right-0 hidden w-3/5 opacity-80 md:block"
        style={{
          maskImage: "linear-gradient(to left, black 55%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 55%, transparent 92%)",
        }}
      >
        <StringVisual />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full w-full max-w-[92rem] flex-col justify-end px-5 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-[calc(4rem+env(safe-area-inset-bottom))] md:px-10 md:pb-24 lg:px-14"
      >
        <div className="flex items-center justify-center text-center font-mono text-[0.58rem] uppercase tracking-[0.26em] text-bone/80 sm:justify-between sm:text-left md:text-[0.6rem] md:tracking-[0.32em]">
          <motion.span
            variants={reveal(0.05)}
            initial="wait"
            animate={stage}
            className="hidden sm:block"
          >
            {artist.origin}, India
          </motion.span>
          <motion.span
            variants={reveal(0.12)}
            initial="wait"
            animate={stage}
          >
            {artist.decades} of music
          </motion.span>
          <motion.span
            variants={reveal(0.2)}
            initial="wait"
            animate={stage}
            className="hidden md:block"
          >
            Scroll ↓
          </motion.span>
        </div>

        <div className="mt-7 md:mt-10">
          <motion.p
            variants={reveal(0.1)}
            initial="wait"
            animate={stage}
            className="mb-4 max-w-[16rem] font-mono text-[0.6rem] uppercase leading-[1.5] tracking-[0.22em] text-brass-bright md:mb-6 md:max-w-none md:text-[0.72rem] md:leading-normal md:tracking-[0.4em]"
          >
            {artist.descriptor}
          </motion.p>

          <h1 className="font-display text-[clamp(3.6rem,17vw,7.4rem)] leading-[0.86] tracking-[-0.02em] text-paper md:text-[clamp(4.2rem,15.5vw,15.5rem)]">
            <span className="block overflow-hidden">
              <motion.span
                className="block will-change-transform"
                variants={maskReveal(0.16)}
                initial="wait"
                animate={stage}
              >
                JOHN
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block pl-[0.35em] italic will-change-transform"
                style={{ color: "transparent", WebkitTextStroke: "1px rgba(236,230,218,0.75)" }}
                variants={maskReveal(0.3)}
                initial="wait"
                animate={stage}
              >
                PAUL
              </motion.span>
            </span>
          </h1>

          <motion.div
            variants={reveal(0.5)}
            initial="wait"
            animate={stage}
            className="mt-6 flex max-w-xl flex-col gap-4 md:mt-10 md:gap-6"
          >
            <p className="text-[0.82rem] leading-relaxed text-bone md:text-base">
              {artist.subDescriptor}
            </p>

            {/* the six roles, stated up front rather than left to be discovered */}
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-brass-bright md:gap-x-4 md:text-[0.66rem] md:tracking-[0.28em]">
              {roles.map((role, i) => (
                <li key={role} className="flex items-center gap-3 md:gap-4">
                  {i > 0 ? (
                    <span
                      className="h-px w-4 shrink-0 bg-brass/45"
                      aria-hidden
                    />
                  ) : null}
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={reveal(0.68)}
            initial="wait"
            animate={stage}
            className="mt-8 flex w-full max-w-[22rem] flex-col items-stretch gap-3 md:mt-10 md:w-auto md:max-w-none md:flex-row md:flex-wrap md:items-center md:gap-4"
          >
            <MagneticButton
              as="a"
              href={nowPlaying.video.href}
              target="_blank"
              rel="noopener noreferrer"
              strength={0.35}
              className="group inline-flex w-full min-h-12 items-center gap-3 whitespace-nowrap rounded-full bg-brass px-5 py-4 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink touch-manipulation transition-colors hover:bg-brass-bright active:bg-brass-bright md:w-auto md:min-h-0 md:whitespace-normal md:px-9 md:text-[0.66rem] md:tracking-[0.28em]"
              ariaLabel="Play the new single, Yosemite's Hathi, on YouTube"
            >
              <PlayGlyph />
              Play the new single
            </MagneticButton>
            <MagneticButton
              as="a"
              href={nowPlaying.streams[2].href}
              target="_blank"
              rel="noopener noreferrer"
              strength={0.3}
              className="inline-flex w-full min-h-12 items-center gap-3 whitespace-nowrap rounded-full border border-paper/30 px-5 py-4 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-paper backdrop-blur-sm touch-manipulation transition-colors hover:border-brass hover:text-brass-bright active:border-brass active:bg-ink/20 active:text-brass-bright md:w-auto md:min-h-0 md:whitespace-normal md:px-9 md:text-[0.66rem] md:tracking-[0.28em]"
              ariaLabel="Stream Yosemite's Hathi on your favourite service"
            >
              Stream everywhere
            </MagneticButton>
          </motion.div>
        </div>
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