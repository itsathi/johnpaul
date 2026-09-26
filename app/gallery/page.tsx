import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import GalleryArchive from "@/components/gallery-archive";
import { Reveal } from "@/components/ui/reveal";
import { SourceNote, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import { galleryItems } from "@/content/gallery";
import { galleryCategories } from "@/content/platform";
import { liveStatement } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The visual archive — live stages, studio rooms and Kolkata, photographed across the years John Paul has been playing.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage({
  searchParams,
}: PageProps<"/gallery">) {
  const { f } = await searchParams;
  const filter = typeof f === "string" ? f : "all";
  const valid = galleryCategories.some((c) => c.key === filter) ? filter : "all";

  return (
    <>
      <PageHero
        index="06"
        eyebrow="Gallery"
        headline={["The archive,", "in pictures."]}
        intro="Stages, studio rooms and the city that made the music. Every frame here is from John's own archive."
        meta={[
          { label: "Photographs", value: String(galleryItems.length) },
          { label: "Categories", value: galleryCategories.map((c) => c.label).join(" · ") },
          { label: "Source", value: "John's own archive" },
        ]}
      />

      <GalleryArchive items={galleryItems} initialFilter={valid} />

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">Context</span>
                <span className="h-px w-8 bg-line" />
                <span>What the photographs are of</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={[liveStatement.line, liveStatement.lineTwo, liveStatement.lineThree]} />
              </div>
            </div>
            <Reveal>
              <div className="space-y-6">
                <Standfirst>{liveStatement.note}</Standfirst>
                <p>
                  <SourceNote source="documented" label="Photographed from John's archive" />
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
