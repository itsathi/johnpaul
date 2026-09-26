import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import EnrolButton from "@/components/enrol-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, SourceNote, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import { classes, getClass } from "@/content/academy-program";
import { wix } from "@/lib/media";

export function generateStaticParams() {
  return classes.map((c) => ({ class: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/academy/classes/[class]">): Promise<Metadata> {
  const { class: slug } = await params;
  const item = getClass(slug);
  if (!item) return { title: "Class not found" };
  return {
    title: item.title,
    description: item.blurb,
    alternates: { canonical: `/academy/classes/${item.slug}` },
  };
}

export default async function ClassPage({
  params,
}: PageProps<"/academy/classes/[class]">) {
  const { class: slug } = await params;
  const item = getClass(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        index={`Class ${item.no}`}
        eyebrow={item.status === "Documented" ? "Running now" : "Placeholder class"}
        headline={[item.title, item.status === "Documented" ? "Already running." : "To be announced."]}
        intro={item.overview}
        media={{ src: item.media, alt: item.mediaAlt, wixWidth: 1400 }}
        meta={[
          { label: "Instructor", value: item.instructor },
          { label: "Format", value: item.format },
          { label: "Level", value: item.level },
          { label: "Duration", value: item.duration },
          { label: "Schedule", value: item.schedule },
          { label: "Fee", value: item.fee },
        ]}
        actions={[
          { label: "Prefer one-to-one?", href: "/academy/lessons", variant: "ghost" },
        ]}
      />

      {/* ---- what you'll learn ---- */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">01</span>
                <span className="h-px w-8 bg-line" />
                <span>What you will learn</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={["The working,", "not the theory", "of working."]} />
              </div>
            </div>
            <RevealGroup>
              <ul className="divide-y divide-line border-y border-line">
                {item.learn.map((l, i) => (
                  <RevealItem key={l.title} className="flex gap-6 py-6">
                    <span className="font-mono text-[0.58rem] tracking-[0.28em] text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-xl leading-tight text-paper md:text-2xl">
                        {l.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-bone/80">
                        {l.detail ?? (
                          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                            To be confirmed
                          </span>
                        )}
                      </p>
                      <p className="mt-3">
                        <SourceNote source={l.source} />
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---- curriculum ---- */}
      <section className="bg-coal py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">02</span>
            <span className="h-px w-8 bg-line" />
            <span>Curriculum</span>
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {item.modules.map((m) => (
              <li key={m.no} className="border border-line p-6">
                <span className="font-mono text-[0.58rem] tracking-[0.28em] text-brass">
                  {m.no}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-none tracking-tight text-paper">
                  {m.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/80">
                  {m.detail ?? (
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                      To be confirmed
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ol>
          {item.source === "demo" ? (
            <Reveal className="mt-10">
              <p className="border-l border-brass/40 pl-4 font-mono text-[0.64rem] uppercase leading-[1.9] tracking-[0.16em] text-mute">
                This is a placeholder class. The module titles show the shape a
                curriculum will take; none of the content has been written by
                the artist yet.
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---- instructor, format, FAQ ---- */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">03</span>
                <span className="h-px w-8 bg-line" />
                <span>Instructor &amp; format</span>
              </p>
              <div className="mt-8 flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line bg-smoke">
                  <Image
                    src={wix("84283f_db14e229b8d94e34b9897116ef5fe843~mv2.jpg", 300, 300)}
                    alt="John Paul"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-3xl leading-none tracking-tight text-paper">
                    {item.instructor}
                  </p>
                  <p className="mt-2 text-sm text-bone/80">
                    Guitarist, songwriter, producer, session player
                  </p>
                </div>
              </div>
              <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {[
                  { label: "Format", value: item.format },
                  { label: "Level", value: item.level },
                  { label: "Duration", value: item.duration },
                  { label: "Schedule", value: item.schedule },
                  { label: "Places", value: item.seats },
                  { label: "Fee", value: item.fee },
                ].map((s) => (
                  <div key={s.label} className="border-t border-line pt-4">
                    <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                      {s.label}
                    </dt>
                    <dd className="mt-2 text-sm text-paper">
                      {s.value ?? (
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                          To be confirmed
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">04</span>
                <span className="h-px w-8 bg-line" />
                <span>Questions</span>
              </p>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {item.faq.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="font-display text-lg leading-snug text-paper">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-bone/80">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ---- enrol ---- */}
      <section className="bg-smoke py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SplitHeadline lines={["Join the next run."]} />
              <div className="mt-7">
                <Standfirst>
                  Register interest and the studio will confirm dates, places
                  and the fee directly. No payment is taken through this site.
                </Standfirst>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4">
              <EnrolButton
                slug={item.slug}
                title={item.title}
                track="Classes"
                label={`Register interest in ${item.title}`}
                primary
              />
              <GhostLink href="/academy/classes">All classes</GhostLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
