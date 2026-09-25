"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Media from "./ui/media";
import StringVisual from "./hero/string-visual";
import MagneticButton from "./ui/magnetic-button";
import { artist, media, nowPlaying } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/media";
import { usePreloaderDone } from "@/lib/preload";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;

type Stage = "wait" | "show";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const loaded = usePreloaderDone();
  const stage: Stage = loaded ? "show" : "wait";

  useEffect(() => {
    if (reduced) return;
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
  }, [reduced]);

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
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink"
    >
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Media
          src={media.hero}
          alt="John Paul performing on stage with his guitar"
          wixWidth={1920}
          wixHeight={1208}
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
          placeholderLabel="Hero photograph — John Paul, live on stage"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-ink/30" />
      <div className="vignette absolute inset-0" />

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
        className="relative z-10 mx-auto flex h-full w-full max-w-[92rem] flex-col justify-end px-6 pb-20 md:px-10 md:pb-24 lg:px-14"
      >
        <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.32em] text-bone/80">
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

        <div className="mt-10">
          <motion.p
            variants={reveal(0.1)}
            initial="wait"
            animate={stage}
            className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-brass-bright md:mb-6 md:text-[0.72rem]"
          >
            {artist.descriptor}
          </motion.p>

          <h1
            className="font-display leading-[0.86] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(4.2rem, 15.5vw, 15.5rem)" }}
          >
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
            className="mt-8 flex max-w-xl flex-col gap-2 md:mt-10 md:flex-row md:items-center md:gap-8"
          >
            <p className="text-sm leading-relaxed text-bone md:text-base">
              {artist.subDescriptor}
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
              Session · Live · Records
            </p>
          </motion.div>

          <motion.div
            variants={reveal(0.68)}
            initial="wait"
            animate={stage}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="a"
              href={nowPlaying.video.href}
              target="_blank"
              rel="noopener noreferrer"
              strength={0.35}
              className="group inline-flex items-center gap-3 rounded-full bg-brass px-9 py-4 font-mono text-[0.66rem] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-brass-bright"
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
              className="inline-flex items-center gap-3 rounded-full border border-paper/30 px-9 py-4 font-mono text-[0.66rem] uppercase tracking-[0.28em] text-paper backdrop-blur-sm transition-colors hover:border-brass hover:text-brass-bright"
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