import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import ArtistIntro from "@/components/artist-intro";
import InstrumentExperience from "@/components/instrument-experience";
import StudioSection from "@/components/studio-section";
import KolkataRoots from "@/components/kolkata-roots";
import { GhostLink, SourceNote } from "@/components/ui/atoms";
import { artist, instrumentExperience, collaborations } from "@/content/site";

export const metadata: Metadata = {
  title: "The Artist",
  description:
    "John Paul — guitarist, songwriter, producer and session player from Kolkata, fluent across electric, acoustic, bass, nylon, mandola, mandolin, banjo and ukulele.",
  alternates: { canonical: "/artist" },
};

export default function ArtistPage() {
  const firstNames = collaborations
    .slice(0, 8)
    .map((c) => c.name);

  return (
    <>
      <PageHero
        index="02"
        eyebrow="The Artist"
        headline={["A guitarist", "shaped by", "Kolkata."]}
        intro="Ten years of studio work, one independent album, and a room full of instruments. This is who he is before any of it is catalogued."
        media={{ src: "84283f_db14e229b8d94e34b9897116ef5fe843~mv2.jpg", alt: "Portrait of John Paul" }}
        meta={[
          { label: "Based in", value: artist.location },
          { label: "Instruments", value: `${instrumentExperience.items.length} played in the studio` },
          { label: "On stage with", value: `${collaborations.length} documented collaborations` },
        ]}
        actions={[
          { label: "The journey", href: "/artist/journey" },
          { label: "Hear the music", href: "/music" },
        ]}
      />

      <ArtistIntro />
      <InstrumentExperience />
      <StudioSection />
      <KolkataRoots />

      {/* A compact collaborator index — the full list with images lives on
          /music#collab, but a name is enough here to establish scale. */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">03</span>
            <span className="h-px w-8 bg-line" />
            <span>Played with</span>
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-3">
            {firstNames.map((name) => (
              <li
                key={name}
                className="border border-line px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone"
              >
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <SourceNote source="documented" label="Documented collaborators" />
          </p>
          <div className="mt-8">
            <GhostLink href="/music#collab">See the full collaboration archive</GhostLink>
          </div>
        </div>
      </section>
    </>
  );
}
