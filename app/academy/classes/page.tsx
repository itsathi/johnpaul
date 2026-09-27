import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/page-hero";
import EnrolButton from "@/components/enrol-button";
import ExpandableClassCards from "@/components/expandable-class-cards";
import { GhostLink } from "@/components/ui/atoms";
import { wix } from "@/lib/media";
import { classes } from "@/content/academy-program";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Making Tones, Guitar Tone Lab, Rhythm & Groove, Session Craft and Songwriting & Arrangement — small-group classes with John Paul.",
  alternates: { canonical: "/academy/classes" },
};

export default function ClassesPage() {
  const documented = classes.find((c) => c.source === "documented");

  return (
    <>
      <PageHero
        index="04 · 2"
        eyebrow="Classes"
        headline={["Small rooms,", "real feedback."]}
        intro="One-to-one work is one thing. A room full of players working on the same problem is another — slower, louder, and usually more useful."
        meta={[
          { label: "Classes", value: `${classes.length} — one documented, four planned` },
          { label: "Taught by", value: "John Paul" },
          { label: "Fees", value: "Announced per class" },
        ]}
        actions={[
          { label: "Making Tones", href: "/academy/classes/making-tones" },
          { label: "Prefer one-to-one?", href: "/academy/lessons", variant: "ghost" },
        ]}
      />

      {/* The documented class gets the full treatment at the top — it is the
          one thing here that is not a placeholder. */}
      {documented ? (
        <section className="bg-coal py-20 md:py-28">
          <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-smoke">
                <Image
                  src={wix(documented.media, 1200, 900)}
                  alt={documented.mediaAlt}
                  width={1200}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div>
                <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                  <span className="text-brass">Running now</span>
                  <span className="h-px w-8 bg-line" />
                  <span>{documented.no}</span>
                </p>
                <h2
                  className="mt-6 font-display leading-[0.96] tracking-[-0.02em] text-paper"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
                >
                  {documented.title}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-bone md:text-base">
                  {documented.overview}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <GhostLink href={`/academy/classes/${documented.slug}`}>
                    Curriculum &amp; FAQ
                  </GhostLink>
                  <EnrolButton
                    slug={documented.slug}
                    title={documented.title}
                    track="Classes"
                    label="Register interest"
                    primary
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">The rest</span>
            <span className="h-px w-8 bg-line" />
            <span>Reserved slots, detail pending</span>
          </p>
          <div className="mt-10">
            <ExpandableClassCards classes={classes.filter((c) => c.source === "demo")} />
          </div>
        </div>
      </section>
    </>
  );
}
