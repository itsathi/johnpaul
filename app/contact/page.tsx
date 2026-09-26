import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import ContactBoard from "@/components/contact-board";
import { Reveal } from "@/components/ui/reveal";
import { SourceNote, SplitHeadline } from "@/components/ui/atoms";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Booking, studio, sessions, production or collaborations — reach John Paul and the studio directly.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="07"
        eyebrow="Contact"
        headline={contact.headline}
        intro="Booking, studio, sessions, production, collaborations. Say which, and the studio will route it to the right place."
        meta={[
          { label: "Email", value: contact.email },
          { label: "Phone", value: contact.phone },
          { label: "Based in", value: contact.location },
        ]}
        actions={[
          { label: "Email the studio", href: `mailto:${contact.email}` },
          { label: "Request a session", href: "/sessions/book", variant: "ghost" },
        ]}
      />

      <ContactBoard />

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">Direct</span>
                <span className="h-px w-8 bg-line" />
                <span>Reach the studio</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={["The shortest", "route."]} />
              </div>
            </div>
            <Reveal>
              <div className="space-y-7">
                <a
                  href={`mailto:${contact.email}`}
                  className="group block border-b border-line pb-6"
                >
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.26em] text-mute">
                    Email
                  </p>
                  <p className="mt-2 font-display text-2xl text-bone transition-colors group-hover:text-brass-bright md:text-3xl">
                    {contact.email}
                  </p>
                </a>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="group block border-b border-line pb-6">
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.26em] text-mute">
                    Phone
                  </p>
                  <p className="mt-2 font-display text-2xl text-bone transition-colors group-hover:text-brass-bright md:text-3xl">
                    {contact.phone}
                  </p>
                </a>
                <div>
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.26em] text-mute">
                    Elsewhere
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {contact.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-line px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-brass/50 hover:text-brass-bright"
                      >
                        {s.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
                <p>
                  <SourceNote source="documented" label="Published contact details" />
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
