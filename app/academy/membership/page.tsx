import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, SourceNote, SplitHeadline, Standfirst } from "@/components/ui/atoms";
import { membershipPromise, memberships } from "@/content/academy-program";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Ongoing access to the academy — monthly, termly or cohort. Lessons, classes and workshops on a rhythm that suits how you practise.",
  alternates: { canonical: "/academy/membership" },
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        index="04 · 3"
        eyebrow="Membership"
        headline={membershipPromise.headline}
        intro={membershipPromise.intro}
        meta={[
          { label: "Tiers", value: `${memberships.length} — structure, awaiting published fees` },
          { label: "Includes", value: "Workshops and classes as they run" },
          { label: "Commitment", value: null },
        ]}
        actions={[{ label: "Enquire", href: "/contact" }]}
      />

      {/* ---- tiers ---- */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <RevealGroup className="grid gap-4 lg:grid-cols-3">
            {memberships.map((tier) => (
              <RevealItem key={tier.key}>
                <article
                  className={`flex h-full flex-col border p-7 ${
                    tier.featured ? "border-brass/60 bg-coal" : "border-line"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.58rem] tracking-[0.28em] text-brass">
                      {tier.billing ?? "To be confirmed"}
                    </span>
                    <SourceNote source="demo" label="Placeholder" />
                  </div>
                  <h2 className="mt-5 font-display text-3xl leading-none tracking-tight text-paper">
                    {tier.name}
                  </h2>
                  <p className="mt-3 font-display text-lg italic leading-snug text-bone/70">
                    {tier.line}
                  </p>
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-bone/85">{tier.body}</p>
                  <dl className="mt-7 divide-y divide-line border-y border-line">
                    {tier.includes.map((inc) => (
                      <div key={inc.label} className="py-3.5">
                        <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                          {inc.label}
                        </dt>
                        <dd className="mt-1.5 text-sm text-paper">
                          {inc.value ?? (
                            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                              To be confirmed
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 flex items-baseline justify-between">
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
                      Fee
                    </span>
                    <span className="font-display text-2xl text-paper">
                      {tier.fee ?? (
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mute">
                          To be confirmed
                        </span>
                      )}
                    </span>
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-10 border-l border-brass/40 pl-4 font-mono text-[0.64rem] uppercase leading-[1.9] tracking-[0.16em] text-mute">
            Every tier is a structural placeholder. Membership terms, renewal
            and fees are to be confirmed with the artist before any of this is
            published.
          </p>
        </div>
      </section>

      {/* ---- what membership includes ---- */}
      <section className="bg-coal py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                <span className="text-brass">Included</span>
                <span className="h-px w-8 bg-line" />
                <span>What membership means</span>
              </p>
              <div className="mt-6">
                <SplitHeadline lines={["A standing place", "in the room."]} />
              </div>
              <div className="mt-7">
                <Standfirst>{membershipPromise.note}</Standfirst>
              </div>
            </div>
            <RevealGroup className="grid gap-3 sm:grid-cols-2">
              {membershipPromise.pillars.map((p) => (
                <RevealItem key={p.title} className="border border-line p-6">
                  <p className="font-display text-2xl leading-none tracking-tight text-paper">
                    {p.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-bone/80">{p.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SplitHeadline lines={["Ask about membership."]} />
              <div className="mt-7">
                <Standfirst>{membershipPromise.flowNote}</Standfirst>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4">
              <GhostLink href="/contact">Enquire</GhostLink>
              <GhostLink href="/academy">Back to the academy</GhostLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
