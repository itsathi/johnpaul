import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import CareerTimeline from "@/components/career-timeline";
import { GhostLink } from "@/components/ui/atoms";
import { journey, kalpana } from "@/content/site";

export const metadata: Metadata = {
  title: "The Journey",
  description:
    "Nine scenes: from the first guitar to Kalpana, an independent album released in chapters.",
  alternates: { canonical: "/artist/journey" },
};

export default function JourneyPage() {
  return (
    <>
      <PageHero
        index="02 · 1"
        eyebrow="The Journey"
        headline={["Nine scenes,", "one line", "of work."]}
        intro="A self-taught start, a decade of sessions, and an independent record that took nine years to arrive. The full sequence, in order, with nothing added."
        media={{ src: "84283f_36a05501d42b489ead1892561af0c3ed~mv2.jpg", alt: "John Paul in the studio" }}
        meta={[
          { label: "Scenes", value: String(journey.length) },
          { label: "Written, arranged & produced by", value: "John Paul" },
          { label: "Kalpana means", value: "Imagination, in Bengali" },
        ]}
        actions={[{ label: "Read Kalpana", href: "/music/kalpana" }]}
      />
      <CareerTimeline />
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <p className="max-w-3xl font-display text-2xl leading-snug text-bone md:text-3xl">
            {kalpana.philosophy}
          </p>
          <div className="mt-9">
            <GhostLink href="/artist">Back to the artist</GhostLink>
          </div>
        </div>
      </section>
    </>
  );
}
