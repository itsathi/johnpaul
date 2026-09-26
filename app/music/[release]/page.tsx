import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, Pending, Section, SourceNote, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import { releases, getRelease } from "@/content/releases";
import { wix, youtubeEmbed } from "@/lib/media";
import Image from "next/image";

/** Both releases are known at build time, so both are static. */
export function generateStaticParams() {
  return releases.map((r) => ({ release: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/music/[release]">): Promise<Metadata> {
  const { release: slug } = await params;
  const release = getRelease(slug);
  if (!release) return { title: "Release not found" };
  return {
    title: release.title,
    description: release.blurb,
    alternates: { canonical: `/music/${release.slug}` },
    openGraph: {
      title: `${release.title} · John Paul`,
      description: release.blurb,
      ...(release.artworkWix
        ? {}
        : { images: [{ url: release.artwork, alt: release.artworkAlt }] }),
    },
  };
}

export default async function ReleasePage({ params }: PageProps<"/music/[release]">) {
  const { release: slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();

  const artwork = release.artworkWix ? wix(release.artwork, 1400) : release.artwork;
  const documented = release.credits.filter((c) => c.source === "documented");

  return (
    <>
      <PageHero
        index="Release"
        eyebrow={`${release.kind} · ${release.position}`}
        headline={[release.title, release.status]}
        intro={release.story}
        media={{
          src: release.artwork,
          alt: release.artworkAlt,
          wixWidth: release.artworkWix ? 1900 : undefined,
        }}
        actions={release.streams
          .filter((s) => !s.note || s.note === "Artist page")
          .slice(0, 3)
          .map((s) => ({ label: s.label, href: s.href, external: true }))}
      >
        {/* The cover, given room to be looked at rather than a thumbnail. */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,22rem)_1fr] md:items-start">
          <div className="relative aspect-square w-full max-w-[22rem] overflow-hidden border border-line bg-coal">
            <Image
              src={artwork}
              alt={release.artworkAlt}
              width={1400}
              height={1400}
              sizes="(max-width: 768px) 100vw, 22rem"
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {release.facts.map((fact) => (
              <div key={fact.label} className="border-t border-line pt-4">
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-mute">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-paper">
                  <Pending value={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </PageHero>

      {/* ---- listen ---- */}
      {release.video ? (
        <Section tone="coal" id="listen">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <SourceNote source="documented" label="Official video" />
              <div className="mt-6">
                <SplitHeadline lines={["Hear it.", "Then the live take."]} />
              </div>
              <div className="mt-7">
                <Standfirst>
                  {release.premiere
                    ? "The chapter was premiered live before it reached a platform — the room version is worth as much as the record."
                    : "The music video for the first chapter of Kalpana."}
                </Standfirst>
              </div>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={release.video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                >
                  {release.video.label}
                  <span aria-hidden>↗</span>
                </a>
                {release.premiere ? (
                  <a
                    href={release.premiere.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60 hover:text-brass-bright"
                  >
                    {release.premiere.label}
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden border border-line bg-ink">
              <iframe
                className="h-full w-full"
                src={youtubeEmbed(release.video.href)}
                title={release.video.label}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </Section>
      ) : null}

      {/* ---- tracklist: eight positions, one released ---- */}
      {release.tracks.length ? (
        <Section tone="ink" id="chapters">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionPill index="01" label="Chapters" />
              <div className="mt-6">
                <SplitHeadline lines={["Eight positions.", "One released."]} />
              </div>
              <div className="mt-7">
                <Standfirst>
                  {release.title} was released in chapters rather than all at
                  once. The remaining seven are reserved positions on the
                  running order — shown here rather than hidden, because the
                  waiting is part of the record.
                </Standfirst>
              </div>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              {release.tracks.map((track) => (
                <li
                  key={track.no}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-5"
                >
                  <span className="flex items-baseline gap-5">
                    <span
                      className={`font-mono text-[0.6rem] tracking-[0.3em] ${
                        track.title ? "text-brass" : "text-mute/50"
                      }`}
                    >
                      {track.no}
                    </span>
                    <span
                      className={`font-display text-xl leading-tight md:text-2xl ${
                        track.title ? "text-paper" : "text-mute/45"
                      }`}
                    >
                      {track.title ?? "To be announced"}
                    </span>
                  </span>
                  {track.youtube ? (
                    <a
                      href={track.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mute transition-colors hover:text-brass-bright"
                    >
                      Listen ↗
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </Section>
      ) : null}

      {/* ---- credits ---- */}
      <Section tone="smoke" id="credits">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionPill index="02" label="Credits" />
            <div className="mt-6">
              <SplitHeadline lines={["Who is", "on it."]} />
            </div>
            <p className="mt-7">
              <SourceNote
                source="documented"
                label="Documented credits only — nothing is added from assumption"
              />
            </p>
          </div>
          <RevealGroup>
            <ul className="divide-y divide-line border-y border-line">
              {documented.map((credit) => (
                <RevealItem
                  key={`${credit.role}-${credit.name}`}
                  className="flex flex-wrap items-baseline justify-between gap-4 py-5"
                >
                  <span className="text-sm text-bone">{credit.role}</span>
                  <span className="font-display text-xl text-paper md:text-2xl">
                    {credit.name}
                  </span>
                </RevealItem>
              ))}
            </ul>
          </RevealGroup>
        </div>
      </Section>

      {/* ---- listen everywhere ---- */}
      <Section tone="ink" id="streams">
        <SectionPill index="03" label="Listen" />
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {release.streams.map((stream) => (
            <RevealItem key={stream.label}>
              <a
                href={stream.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between gap-6 border border-line p-6 transition-colors hover:border-brass/50"
              >
                <span className="font-display text-2xl leading-none tracking-tight text-bone transition-colors group-hover:text-brass-bright">
                  {stream.label}
                </span>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                  {stream.note ?? "↗"}
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-12">
          <GhostLink href="/music">Back to all music</GhostLink>
        </div>
      </Section>
    </>
  );
}

function SectionPill({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
      <span className="text-brass">{index}</span>
      <span className="h-px w-8 bg-line" />
      <span>{label}</span>
    </div>
  );
}
