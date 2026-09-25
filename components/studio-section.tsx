"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "./ui/section-tag";
import MediaReveal from "./ui/media-reveal";
import { studioStatement, media } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: () => -((trackRef.current?.scrollWidth ?? 0) - (sectionRef.current?.clientWidth ?? 0)),
        ease: "none",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top 82%",
          end: () => "+=120%",
          scrub: 0.6,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-28 md:py-44"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="08" label="Studio & session" />
        <p
          className="mt-10 max-w-4xl font-display leading-[1.04] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(2.2rem, 5.4vw, 5.4rem)" }}
        >
          {studioStatement.title}
        </p>
      </div>

      {/* horizontal instrument scroll */}
      <div
        className={`mt-16 md:mt-24 ${reduced ? "overflow-x-auto" : "overflow-hidden"}`}
        data-lenis-prevent={reduced ? "" : undefined}
      >
        <div
          ref={trackRef}
          className="flex w-max items-baseline gap-10 px-6 will-change-transform md:gap-14 md:px-10 lg:px-14"
        >
          {[...studioStatement.instruments, ...studioStatement.instruments].map(
            (name, i) => (
              <span key={`${name}-${i}`} className="flex items-baseline gap-10 md:gap-14">
                <span
                  className={`font-display whitespace-nowrap transition-colors ${
                    i % 2 === 0
                      ? "text-paper"
                      : "text-outline"
                  }`}
                  style={{ fontSize: "clamp(2.6rem, 7vw, 7.5rem)" }}
                >
                  {name}
                </span>
                <span className="font-mono text-base text-brass">/</span>
              </span>
            ),
          )}
        </div>
      </div>
      <div className="mx-auto mt-6 flex w-full max-w-[92rem] items-center justify-between px-6 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute md:px-10 lg:px-14">
        <span>Scroll →</span>
        <span>The instruments of a session</span>
      </div>

      <div className="mx-auto mt-24 grid w-full max-w-[92rem] gap-x-6 gap-y-4 px-6 md:grid-cols-3 md:mt-32 lg:px-14">
        {["Recording", "Arrangement", "Production"].map((d, i) => {
          const disc = studioStatement.disciplines.find((x) => x.name === d)!;
          return (
            <div
              key={d}
              className="group border-t border-line py-6"
              data-cursor="link"
            >
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-[0.6rem] text-brass">0{i + 1}</span>
                <span
                  className="font-display tracking-tight text-paper transition-colors group-hover:text-brass-bright"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)" }}
                >
                  {disc.name}
                </span>
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone">
                {disc.note}
              </p>
            </div>
          );
        })}
        <div className="border-t border-line py-6 md:col-span-3">
          <p className="flex items-center gap-4">
            <span className="font-mono text-[0.6rem] text-brass">05</span>
            <span className="max-w-2xl text-sm leading-relaxed text-bone md:text-base">
              {studioStatement.disciplines[2].note} A signature service:{" "}
              <span className="text-paper">programming acoustic drums</span>{" "}
              with the feel of a player — {studioStatement.disciplines[3].note.toLowerCase()}
            </span>
          </p>
        </div>
      </div>

      {/* studio photography */}
      <div className="mx-auto mt-24 grid w-full max-w-[92rem] grid-cols-2 gap-6 px-6 md:mt-32 lg:px-14">
        <MediaReveal
          src={media.guitarStudio}
          alt="John Paul with his guitar in a studio setting"
          wixWidth={900}
          wixHeight={1100}
          ratio="aspect-[3/4]"
          sizes="(max-width: 768px) 48vw, 34vw"
          caption="The instruments"
        />
        <div className="flex flex-col gap-6">
          <MediaReveal
            src={media.studioDesk}
            alt="Studio desk — recording session"
            wixWidth={1000}
            wixHeight={700}
            ratio="aspect-[16/11]"
            sizes="(max-width: 768px) 48vw, 34vw"
            caption="The room"
          />
          <MediaReveal
            src={media.gear}
            alt="Guitar and gear in the studio"
            wixWidth={1000}
            wixHeight={700}
            ratio="aspect-[16/11]"
            sizes="(max-width: 768px) 48vw, 34vw"
            caption="The rig"
          />
        </div>
      </div>
    </section>
  );
}