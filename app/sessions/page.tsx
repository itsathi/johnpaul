import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import ServicesSection from "@/components/services-section";
import StudioSection from "@/components/studio-section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, SourceNote, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import { services, contact } from "@/content/site";
import { locationOptions } from "@/content/booking";

export const metadata: Metadata = {
  title: "Sessions",
  description:
    "Live performance, session recording, production and arrangement, and artist projects — booked directly with the studio in Kolkata or remotely.",
  alternates: { canonical: "/sessions" },
};

export default function SessionsPage() {
  return (
    <>
      <PageHero
        index="03"
        eyebrow="Sessions"
        headline={["Book John", "to play,", "record or", "produce."]}
        intro="Four ways to work together. Send the brief, get dates and a fee back from the studio — nothing is charged online and nothing is auto-confirmed."
        media={{ src: "84283f_ced1a2b1042848e1a1f9708749132cf8~mv2.jpg", alt: "Guitar and equipment in the studio" }}
        meta={[
          { label: "Services", value: `${services.length} documented` },
          { label: "Based in", value: contact.location },
          { label: "Fees", value: "Confirmed per enquiry" },
        ]}
        actions={[
          { label: "Request a session", href: "/sessions/book" },
          { label: "Email the studio", href: `mailto:${contact.email}` },
        ]}
      />

      <ServicesSection />

      {/* Where the work actually happens — the three documented modes. */}
      <section className="bg-smoke py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">01</span>
                <span className="h-px w-8 bg-line" />
                <span>Where</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={["The room,", "the call,", "or the tour."]} />
              </div>
            </div>
            <RevealGroup>
              <ul className="divide-y divide-line border-y border-line">
                {locationOptions.map((option) => (
                  <RevealItem
                    key={option.key}
                    className="flex flex-wrap items-baseline justify-between gap-4 py-6"
                  >
                    <span>
                      <span className="block font-display text-2xl leading-none tracking-tight text-paper md:text-3xl">
                        {option.label}
                      </span>
                      <span className="mt-2 block text-sm text-bone/80">{option.note}</span>
                    </span>
                    <SourceNote source={option.source} />
                  </RevealItem>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </div>
      </section>

      <StudioSection />

      {/* The ask, made explicit before the form rather than after it. */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal>
              <SplitHeadline lines={["Send the brief."]} />
              <div className="mt-7">
                <Standfirst>
                  Six steps, about two minutes: what you need, what you are
                  bringing, when, and how to reach you. The studio replies with
                  dates and a fee — a real conversation, not a checkout.
                </Standfirst>
              </div>
            </Reveal>
            <GhostLink href="/sessions/book" className="text-base">
              Start the request
            </GhostLink>
          </div>
        </div>
      </section>
    </>
  );
}
