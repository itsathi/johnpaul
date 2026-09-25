"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "./ui/section-tag";
import MediaReveal from "./ui/media-reveal";
import { journey } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

export default function CareerTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 68%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        },
      );

      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
            },
          },
        );

        gsap.fromTo(
          item,
          { x: i % 2 ? 60 : -60 },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 96%",
              end: "top 40%",
              scrub: 0.5,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative overflow-hidden bg-coal py-28 md:py-44"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <img
          src="https://static.wixstatic.com/media/84283f_58487d52628e4bddb21d31bbcfd0693e~mv2.jpg/v1/fill/w_1400,h_1200,al_c,q_85,enc_avif,quality_auto/84283f_58487d52628e4bddb21d31bbcfd0693e~mv2.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.75fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionTag index="10" label="The journey" />
            <p
              className="mt-10 font-display leading-[1.02] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.6rem)" }}
            >
              A decade,
              <br />
              in <em className="italic text-brass-bright">scenes</em>.
            </p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-bone md:text-base">
              From a mother&apos;s harmonium in Kolkata to the country&apos;s
              biggest stages and the rooms where its records are made — the
              road to Kalpana.
            </p>

            <div className="mt-12 hidden items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute lg:flex">
              <span className="relative h-8 w-px overflow-hidden bg-line">
                <span
                  ref={lineRef}
                  className="absolute inset-0 bg-brass will-change-transform"
                />
              </span>
              Scroll the scenes
            </div>
          </div>

          <div ref={listRef} className="relative ml-2 border-l border-line pl-6 md:ml-0 md:pl-12">
            {journey.map((item, i) => {
              const flip = i % 2 === 0;
              return (
                <article
                  key={`${item.era}-${i}`}
                  className="timeline-item relative pb-16 opacity-100 will-change-transform md:pb-24"
                >
                  <span className="absolute -left-[27px] top-1.5 h-[9px] w-[9px] rounded-full border border-brass bg-ink md:-left-[49px]" />

                  <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brass">
                      {item.era}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
                      Scene 0{i + 1}
                    </span>
                  </header>

                  <div
                    className={`mt-5 flex flex-col gap-8 ${
                      flip ? "md:flex-row-reverse" : "md:flex-row"
                    } md:items-start`}
                  >
                    <div className="flex-1">
                      <h3
                        className="font-display leading-[1.04] tracking-[-0.01em] text-paper"
                        style={{ fontSize: "clamp(1.7rem, 3.4vw, 3.4rem)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone md:text-[0.95rem]">
                        {item.body}
                      </p>
                    </div>

                    <div
                      className={`w-40 shrink-0 md:w-52 ${
                        flip ? "" : ""
                      }`}
                    >
                      <MediaReveal
                        src={item.media}
                        alt={`${item.title} — John Paul`}
                        wixWidth={640}
                        wixHeight={800}
                        ratio="aspect-[4/5]"
                        sizes="(max-width: 768px) 160px, 208px"
                      />
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="ml-1 border-t border-line pt-6 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
              …and the next scene is{" "}
              <a
                href="#kalpana"
                className="text-brass-bright underline-offset-4 hover:underline"
                data-cursor="link"
              >
                Kalpana
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}