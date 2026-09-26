import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import AcademySection from "@/components/academy-section";
import EnrolButton from "@/components/enrol-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, SourceNote, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import { academy } from "@/content/platform";
import { classes, lessonFormats_offered, memberships } from "@/content/academy-program";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Private lessons, small classes and ongoing membership with John Paul — anchored by the Making Tones live workshop series.",
  alternates: { canonical: "/academy" },
};

export default function AcademyPage() {
  return (
    <>
      <PageHero
        index="04"
        eyebrow="Academy"
        headline={academy.headline}
        intro={academy.intro}
        media={{ src: "84283f_1e6cab8c426f4f47914100814e739541~mv2.jpg", alt: "A production desk in the studio" }}
        meta={[
          { label: "Making Tones", value: "Live workshop series — already running" },
          { label: "Formats", value: "One-to-one, small group, ongoing" },
          { label: "Fees", value: "Confirmed per enrolment" },
        ]}
        actions={[
          { label: "Private lessons", href: "/academy/lessons" },
          { label: "Browse classes", href: "/academy/classes" },
          { label: "Membership", href: "/academy/membership", variant: "ghost" },
        ]}
      />

      <AcademySection />

      {/* The class index, so the whole curriculum is visible from the landing
          page without a second click. */}
      <section className="bg-smoke py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">Classes</span>
                <span className="h-px w-8 bg-line" />
                <span>{classes.length} running or planned</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={["Small rooms,", "honest feedback."]} />
              </div>
              <div className="mt-7">
                <Standfirst>
                  One documented class, four reserved slots. The shape of each
                  is here; the detail is still to be announced by the artist.
                </Standfirst>
              </div>
            </div>
            <RevealGroup>
              <ul className="divide-y divide-line border-y border-line">
                {classes.map((c) => (
                  <RevealItem key={c.slug} className="py-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="flex items-center gap-4">
                          <span className="font-mono text-[0.58rem] tracking-[0.28em] text-brass">
                            {c.no}
                          </span>
                          <span className="font-display text-2xl leading-none tracking-tight text-paper md:text-3xl">
                            {c.title}
                          </span>
                        </p>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/80">
                          {c.blurb}
                        </p>
                        <p className="mt-3">
                          <SourceNote
                            source={c.source}
                            label={c.status === "Documented" ? "Documented" : "Placeholder"}
                          />
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <GhostLink href={`/academy/classes/${c.slug}`}>
                          {c.status === "Documented" ? "Open" : "Details"}
                        </GhostLink>
                        <EnrolButton
                          slug={c.slug}
                          title={c.title}
                          track="Classes"
                          label="Enrol"
                        />
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Two formats, three ways to keep going. */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">Formats</span>
            <span className="h-px w-8 bg-line" />
            <span>How to work together</span>
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {lessonFormats_offered.map((f) => (
              <article key={f.title} className="border border-line p-7">
                <p className="font-mono text-[0.58rem] tracking-[0.28em] text-brass">{f.no}</p>
                <h3 className="mt-3 font-display text-3xl leading-none tracking-tight text-paper">
                  {f.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-bone/85">{f.body}</p>
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
                  <GhostLink
                    href={f.title === "Private Lesson" ? "/academy/lessons" : "/sessions/book"}
                  >
                    {f.cta}
                  </GhostLink>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <GhostLink href="/academy/membership">
              {memberships.length} membership tiers — keep going
            </GhostLink>
          </div>
        </div>
      </section>
    </>
  );
}
