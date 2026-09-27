"use client";

import Image from "next/image";
import SectionTag from "./ui/section-tag";
import SectionLink from "./ui/section-link";
import MediaReveal from "./ui/media-reveal";
import { Timeline, type TimelineItem } from "./ui/timeline";
import { journey } from "@/content/site";

/**
 * The Journey — a decade told as scenes.
 *
 * The sequence runs on the Aceternity timeline: one rail, filling with brass as
 * the list scrolls, with each scene's title sticking beside its body. The
 * register reads the nine scenes from `content/site`, so this file holds no
 * dates or copy of its own.
 *
 * This section is mounted on the homepage as well as on `/artist/journey`.
 */
export default function CareerTimeline({
  index = "11",
  label = "The journey",
}: {
  index?: string;
  label?: string;
} = {}) {
  const items: TimelineItem[] = journey.map((item, i) => ({
    eyebrow: (
      <span className="flex flex-wrap items-baseline gap-x-5">
        <span>{item.era}</span>
        <span className="text-mute">Scene {String(i + 1).padStart(2, "0")}</span>
      </span>
    ),
    title: item.title,
    content: (
      <div className="flex flex-col gap-7 md:flex-row-reverse md:items-start md:gap-10">
        <div className="min-w-0 flex-1">
          <p className="max-w-lg text-sm leading-relaxed text-bone md:text-[0.95rem]">
            {item.body}
          </p>
        </div>

        <div className="w-40 shrink-0 sm:w-48 md:w-52">
          <MediaReveal
            src={item.media}
            alt={`${item.title} — John Paul`}
            wixWidth={640}
            wixHeight={800}
            ratio="aspect-[4/5]"
            sizes="(max-width: 768px) 192px, 208px"
          />
        </div>
      </div>
    ),
  }));

  return (
    <section id="journey" className="relative overflow-hidden bg-coal py-28 md:py-44">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden>
        <Image
          src="https://static.wixstatic.com/media/84283f_58487d52628e4bddb21d31bbcfd0693e~mv2.jpg/v1/fill/w_1400,h_1200,al_c,q_85,enc_avif,quality_auto/84283f_58487d52628e4bddb21d31bbcfd0693e~mv2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.75fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionTag index={index} label={label} />
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
              <span className="relative h-8 w-px bg-brass" />
              Scroll the scenes
            </div>
          </div>

          <div>
            <Timeline items={items} />

            <div className="mt-4 border-t border-line pt-6 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute md:mt-0 md:pl-9 lg:pl-[15.5rem]">
              …and the next scene is{" "}
              {/* A route, not a bare `#kalpana`. The journey is now mounted on
                  the homepage too, where `#kalpana` does exist, but this
                  section also renders on /artist/journey where it does not —
                  SectionLink resolves the anchor in either case. */}
              <SectionLink
                href="/music#kalpana"
                className="text-brass-bright underline-offset-4 hover:underline"
                data-cursor="link"
              >
                Kalpana
              </SectionLink>
              .
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
