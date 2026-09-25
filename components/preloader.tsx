"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markPreloadDone } from "@/lib/preload";
import { usePrefersReducedMotion } from "@/lib/media";

const LINES = [
  { text: "JOHN", italic: false },
  { text: "PAUL", italic: true },
];

/**
 * Cinematic intro: big name breaks in through masks, a counter runs to 100,
 * then the whole page lifts. Fires `markPreloadDone()` so the hero entrance
 * starts exactly as the curtain comes up. Skipped for reduced-motion users.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      markPreloadDone();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const counter = { value: 0 };
    const root = rootRef.current;
    if (!root) return;

    const sel = gsap.utils.selector(root);
    const countEl = sel(".pre-count")[0] as HTMLElement | undefined;
    const barEl = sel(".pre-bar")[0] as HTMLElement | undefined;
    const letters = sel(".pre-letter");
    const flickers = sel(".pre-flicker");
    const metaEl = sel(".pre-meta")[0];
    const subEl = sel(".pre-subline")[0];
    const nameEl = sel(".pre-name")[0];

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      onComplete: () => {
        markPreloadDone();
        setMounted(false);
      },
    });

    tl.fromTo(
      metaEl,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
    )
      .fromTo(
        [...letters],
        { yPercent: 118, rotate: 4 },
        { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.035, ease: "expo.out" },
      )
      .fromTo(
        subEl,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
      );

    gsap.to(counter, {
      value: 100,
      duration: 2.15,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.value);
        if (countEl) countEl.textContent = String(v).padStart(3, "0");
        if (barEl) barEl.style.transform = `scaleX(${counter.value / 100})`;
      },
    });

    gsap.to(flickers, {
      opacity: (index: number) => (index % 2 ? 0.25 : 0.9),
      duration: 0.09,
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.13,
      stagger: 0.07,
    });

    tl.to(nameEl, {
      y: "-42%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      delay: 0.35,
    })
      .to(metaEl, {
        opacity: 0,
        duration: 0.3,
      })
      .add(() => markPreloadDone())
      .to(
        root,
        {
          yPercent: -100,
          duration: 1.15,
          ease: "expo.inOut",
        },
        0.2,
      )
      .to({}, { duration: 0.15 });

    return () => {
      document.documentElement.style.overflow = "";
      tl.kill();
    };
  }, [reduced]);

  if (reduced) return null;

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-6 py-8 md:px-12 md:py-12"
      aria-hidden
    >
      <div className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.32em] text-bone/60">
        <span>John Paul</span>
        <span className="pre-meta flex items-center gap-3">
          <span aria-hidden>
            <Flicker className="pre-flicker text-brass-bright" />
          </span>
          Kalpana — Chapter 01
        </span>
        <span className="hidden md:block">Concept 2026</span>
      </div>

      <div className="pre-name relative flex flex-col">
        {LINES.map((line, li) => (
          <span
            key={line.text}
            className={`block overflow-hidden pb-[0.04em] font-display leading-[0.86] tracking-[-0.02em] text-paper ${
              li > 0 ? "pl-[0.32em]" : ""
            }`}
            style={{ fontSize: "clamp(4.6rem, 17vw, 17rem)" }}
          >
            {line.text.split("").map((char, ci) => (
              <span
                key={`${char}-${ci}`}
                className={`pre-letter inline-block will-change-transform ${
                  line.italic ? "italic text-outline" : ""
                }`}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
        <p className="pre-subline mt-6 font-mono text-[0.6rem] uppercase tracking-[0.34em] text-bone/70">
          Guitarist · Multi-Instrumentalist · Producer
        </p>
      </div>

      <div className="flex items-end justify-between gap-8">
        <p className="font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.3em] text-mute">
          Loading the stage, the studio &amp; nine years of Kalpana…
        </p>
        <span className="pre-count shrink-0 font-display text-6xl tabular-nums text-brass-bright md:text-8xl">
          000
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-coal">
        <span className="pre-bar block h-full origin-left scale-x-0 bg-gradient-to-r from-brass to-brass-bright" />
      </div>
    </div>
  );
}

function Flicker({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className={className} aria-hidden>
      <path
        d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z"
        fill="currentColor"
      />
    </svg>
  );
}