import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import NowPlaying from "@/components/now-playing";
import Discography from "@/components/discography";
import KalpanaSection from "@/components/kalpana-section";
import LiveSection from "@/components/live-section";
import CollabSection from "@/components/collab-section";
import MusicLab from "@/components/music-lab";
import { releases, featuredRelease, kalpanaProgress } from "@/content/releases";
import { nowPlaying } from "@/content/site";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Kalpana, released in chapters. Yosemite's Hathi, the live archive, and the collaborators John Paul has played with.",
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Music"
        headline={["The record,", "the stage,", "the room."]}
        intro="Kalpana is an independent album released in chapters — eight of them, four out now. Alongside it: the live archive, the collaborations, and the sound of the instruments themselves."
        media={{ src: "84283f_b5260c78c8e444f982976578fc87a522~mv2.jpg", alt: "John Paul on stage" }}
        meta={[
          { label: "Chapters released", value: `${kalpanaProgress.released} of ${kalpanaProgress.total}` },
          { label: "Now playing", value: nowPlaying.title },
          { label: "Written, arranged & produced by", value: "John Paul" },
        ]}
        actions={[
          { label: "Hear Chapter 01", href: featuredRelease.streams[0].href, external: true },
          { label: "All releases", href: "#releases" },
        ]}
      />

      <NowPlaying />
      <Discography />
      <KalpanaSection />
      <LiveSection />
      <CollabSection />
      <MusicLab />

      {/* A closing index so every release is one click from anywhere in the
          music world, including the ones still to come. */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-mute">
            Every release
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {releases.map((release) => (
              <li key={release.slug}>
                <a
                  href={`/music/${release.slug}`}
                  className="group flex flex-wrap items-baseline justify-between gap-4 py-6 transition-colors"
                >
                  <span className="font-display text-2xl leading-none tracking-tight text-bone transition-colors group-hover:text-brass-bright md:text-3xl">
                    {release.title}
                  </span>
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
                    {release.kind} · {release.position} · {release.status}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
