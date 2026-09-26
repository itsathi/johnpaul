import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import {
  lessonDurations,
  lessonFocus,
  lessonFormats,
  lessonFormats_offered,
} from "@/content/academy-program";

export const metadata: Metadata = {
  title: "Private Lessons",
  description:
    "One-to-one lessons with John Paul, in studio in Kolkata or online — tone, technique, arrangement, performance and production.",
  alternates: { canonical: "/academy/lessons" },
};

export default function LessonsPage() {
  return (
    <>
      <PageHero
        index="04 · 1"
        eyebrow="Private Lessons"
        headline={["Direct correction,", "one player", "at a time."]}
        intro="A single focused session built around where you actually are — not a syllabus, not a song list. Bring the thing you are stuck on."
        media={{ src: "84283f_fde731762ad043ecaf275c9bfb88d81f~mv2.jpg", alt: "Guitar detail in the studio" }}
        meta={[
          { label: "Format", value: "One-to-one" },
          { label: "Where", value: "In studio (Kolkata) or online" },
          { label: "Durations", value: lessonDurations.map((d) => d.label).join(" · ") },
          { label: "Fee", value: null },
        ]}
        actions={[{ label: "Request a lesson", href: "/sessions/book" }]}
      />

      {/* ---- the two formats ---- */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">01</span>
            <span className="h-px w-8 bg-line" />
            <span>Two ways to book</span>
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {lessonFormats_offered.map((f) => (
              <Reveal key={f.title} delay={0.05}>
                <article className="flex h-full flex-col border border-line p-7">
                  <p className="font-mono text-[0.58rem] tracking-[0.28em] text-brass">{f.no}</p>
                  <h2 className="mt-3 font-display text-3xl leading-none tracking-tight text-paper">
                    {f.title}
                  </h2>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-bone/85">{f.body}</p>
                  <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {f.specs.map((s) => (
                      <div key={s.label} className="border-t border-line pt-3">
                        <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                          {s.label}
                        </dt>
                        <dd className="mt-1.5 text-sm text-paper">
                          {s.value ?? (
                            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                              To be confirmed
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-7">
                    <GhostLink href="/sessions/book">{f.cta}</GhostLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- where to aim the lesson ---- */}
      <section className="bg-coal py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">02</span>
                <span className="h-px w-8 bg-line" />
                <span>What to aim at</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={["Pick the", "actual problem."]} />
              </div>
              <div className="mt-7">
                <Standfirst>
                  The focus is set at booking, not decided in advance. These
                  are the axes a lesson usually runs along.
                </Standfirst>
              </div>
            </div>
            <RevealGroup>
              <ul className="grid gap-3 sm:grid-cols-2">
                {lessonFocus.map((f) => (
                  <RevealItem key={f.key} className="border border-line p-6">
                    <p className="font-display text-2xl leading-none tracking-tight text-paper">
                      {f.label}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-bone/80">{f.note}</p>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---- practicalities ---- */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">03</span>
                <span className="h-px w-8 bg-line" />
                <span>Where</span>
              </p>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {lessonFormats.map((f) => (
                  <li key={f.key} className="py-5">
                    <p className="font-display text-2xl leading-none tracking-tight text-paper">
                      {f.label}
                    </p>
                    <p className="mt-2 text-sm text-bone/80">{f.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">04</span>
                <span className="h-px w-8 bg-line" />
                <span>Length</span>
              </p>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {lessonDurations.map((d) => (
                  <li key={d.key} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
                    <span>
                      <span className="block font-display text-2xl leading-none tracking-tight text-paper">
                        {d.label}
                      </span>
                      <span className="mt-2 block text-sm text-bone/80">{d.note}</span>
                    </span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mute">
                      Fee to be confirmed
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <GhostLink href="/sessions/book">Request a lesson</GhostLink>
                <GhostLink href="/academy/membership">
                  Or keep going with membership
                </GhostLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
