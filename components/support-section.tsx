"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import { support } from "@/content/site";
import { useScrollTo } from "./smooth-scroll";
import {
  useIsPrecisionPointer,
  usePrefersReducedMotion,
} from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SupportSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useIsPrecisionPointer();
  const { scrollTo } = useScrollTo();

  useEffect(() => {
    if (reduced || !finePointer) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordRef.current,
        { xPercent: -12, opacity: 0.14 },
        {
          xPercent: 10,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [finePointer, reduced]);

  return (
    <section
      id="support"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink pt-24 pb-24 md:pt-36 md:pb-36"
    >
      <div
        ref={wordRef}
        className="pointer-events-none absolute inset-y-0 left-[-4%] flex select-none items-center font-display italic leading-none text-outline opacity-30 will-change-transform"
        style={{ fontSize: "clamp(12rem, 30vw, 34rem)" }}
        aria-hidden
      >
        Kalpana
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="17" label={support.kicker} />

        <div className="mt-12 max-w-3xl">
          <h2
            className="font-display leading-[0.92] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}
          >
            {support.headline}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-bone md:text-lg">
            {support.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3 lg:gap-8">
          {support.actions.map((action, i) => {
            const isAnchor = action.href.startsWith("#");
            return (
              <motion.div
                key={action.title}
                className="flex flex-col justify-between gap-10 rounded-2xl border border-line bg-coal p-8 md:p-10"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
              >
                <div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-brass-bright">
                    {`0${i + 1}`}
                  </span>
                  <h3 className="mt-4 font-display text-3xl tracking-tight text-paper">
                    {action.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-bone">
                    {action.body}
                  </p>
                </div>

                <MagneticButton
                  as="a"
                  href={action.href}
                  {...(isAnchor
                    ? { onClick: () => scrollTo(action.href) }
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  strength={0.3}
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-line px-7 py-4 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-paper transition-colors hover:border-brass hover:text-brass-bright"
                  ariaLabel={action.cta}
                >
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                  {action.cta}
                </MagneticButton>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-12 font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
          {support.note}
        </p>
      </div>
    </section>
  );
}