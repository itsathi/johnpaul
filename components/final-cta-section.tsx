"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import ContactForm from "./contact-form";
import { artist, contact, instagramHandle } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const DOORS = [
  {
    no: "01",
    tag: "Listen",
    audience: "The Fan",
    title: "Hear the Music",
    description: "Stream Kalpana, Yosemite's Hathi, and live sets across Spotify, Apple Music & YouTube.",
    href: "/music",
    cta: "Listen Now",
    badge: "New Release Out",
    accent: "border-brass/40 hover:border-brass",
  },
  {
    no: "02",
    tag: "Learn",
    audience: "The Learner",
    title: "Join the Academy",
    description: "Private one-on-one guitar mentorship, group masterclasses, and the Making Tones series.",
    href: "/academy",
    cta: "Explore Academy",
    badge: "Mentorship Open",
    accent: "border-paper/20 hover:border-brass/70",
  },
  {
    no: "03",
    tag: "Shop",
    audience: "The Supporter",
    title: "Store & Merch",
    description: "Limited vinyl pressings, signature apparel, studio accessories, and collector editions.",
    href: "/shop",
    cta: "Visit Store",
    badge: "Catalogue",
    accent: "border-paper/20 hover:border-brass/70",
  },
  {
    no: "04",
    tag: "Work With John",
    audience: "The Professional",
    title: "Book a Session",
    description: "Hire John for live arena tours, multi-instrument studio tracking, arrangement, and film scores.",
    href: "/sessions/book",
    cta: "Request a Session",
    badge: "Now Booking",
    accent: "border-brass/70 hover:border-brass-bright",
    featured: true,
  },
];

export default function FinalCtaSection({
  index = "10",
  label = "Final CTA — Four Doors",
}: {
  index?: string;
  label?: string;
} = {}) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterSubscribed(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-ink pt-28 pb-16 md:pt-40">
      {/* Giant watermark */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-0.15em] select-none text-center font-display leading-none text-outline opacity-35"
        style={{ fontSize: "clamp(4.5rem, 16vw, 16rem)" }}
        aria-hidden
      >
        {artist.name}
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index={index} label={label} />

        <div className="mt-12 max-w-4xl">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-brass-bright">
            Immediate Next Steps
          </p>
          <h2
            className="mt-4 font-display leading-[0.92] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.8rem, 7.8vw, 7.2rem)" }}
          >
            Where would you{" "}
            <em className="italic text-brass-bright">like to begin?</em>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone md:text-lg">
            Four doors into the world of John Paul. Whether you are here to
            listen as a fan, master your craft, acquire exclusive physical
            pieces, or collaborate on a world-class production.
          </p>
        </div>

        {/* ---- The Four Doors Grid ---- */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {DOORS.map((door, i) => (
            <motion.article
              key={door.no}
              className={`group relative flex flex-col justify-between rounded-sm border bg-coal/70 p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-coal ${
                door.accent
              } ${door.featured ? "ring-1 ring-brass/40 bg-coal/90" : ""}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                  <span className="font-mono text-[0.58rem] tracking-[0.3em] text-brass">
                    {door.no}
                  </span>
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.24em] text-mute">
                    {door.audience}
                  </span>
                </div>

                <div className="mt-6">
                  <span className="inline-block rounded-full border border-line/80 px-2.5 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.2em] text-brass-bright">
                    {door.badge}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-paper transition-colors group-hover:text-brass-bright md:text-3xl">
                    {door.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/85">
                    {door.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={door.href}
                  data-cursor="link"
                  className={`group/btn inline-flex min-h-12 w-full items-center justify-between rounded-full border px-5 py-3 font-mono text-[0.58rem] uppercase tracking-[0.24em] transition-all duration-300 ${
                    door.featured
                      ? "border-brass bg-brass text-ink hover:bg-brass-bright"
                      : "border-paper/30 text-paper hover:border-brass hover:text-brass-bright"
                  }`}
                >
                  <span>{door.cta}</span>
                  <span
                    aria-hidden
                    className="text-base transition-transform duration-300 group-hover/btn:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ---- Contact & Communication Hub ---- */}
        <div className="mt-24 grid gap-14 border-t border-line pt-16 md:mt-32 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          {/* Left Column: Direct Studio Info + Newsletter */}
          <div className="flex flex-col justify-between gap-12">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brass">
                Studio Direct
              </p>
              <h3
                className="mt-3 font-display leading-tight tracking-tight text-paper"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.8rem)" }}
              >
                Direct line to <br />
                <span className="italic text-bone/80">Kolkata &amp; the road.</span>
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone md:text-base">
                For urgent tour queries, masterclass bookings, film arrangements
                or session rates, reach out directly to the studio.
              </p>

              <div className="mt-8 flex flex-col gap-4 border-l border-brass/50 pl-6">
                <a
                  href={`mailto:${contact.email}`}
                  className="font-display text-xl italic text-bone transition-colors hover:text-brass-bright md:text-2xl"
                  data-cursor="link"
                >
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="font-display text-xl italic text-bone transition-colors hover:text-brass-bright md:text-2xl"
                  data-cursor="link"
                >
                  {contact.phone}
                </a>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-mute">
                  {contact.location} · Available for domestic &amp; global projects
                </p>
              </div>

              {/* Social Channels */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {contact.socials.map((s) => (
                  <MagneticButton
                    key={s.label}
                    as="a"
                    href={s.href}
                    strength={0.25}
                    className="rounded-full border border-line bg-coal/60 px-5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass hover:text-brass-bright"
                    ariaLabel={`${s.label} — opens in a new tab`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label} ↗
                  </MagneticButton>
                ))}
              </div>
            </div>

            {/* Integrated Newsletter rollout form */}
            <div className="rounded-sm border border-line/70 bg-coal/40 p-6 md:p-8">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-brass-bright">
                Follow the Rollout
              </span>
              <p className="mt-2 font-display text-xl text-paper">
                Never miss a chapter release or tour date.
              </p>
              <p className="mt-1 text-xs text-bone/70">
                Join the private listener dispatch. No noise, just music and dates.
              </p>

              {newsletterSubscribed ? (
                <motion.p
                  className="mt-5 flex items-center gap-2 font-display text-sm italic text-brass-bright"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                  You&apos;re on the list — demonstration only.
                </motion.p>
              ) : (
                <form onSubmit={onSubscribe} className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-0 flex-1 border border-line bg-ink px-4 py-3 font-mono text-[0.68rem] tracking-[0.16em] text-paper placeholder:text-mute focus:border-brass focus:outline-none"
                  />
                  <button
                    type="submit"
                    data-cursor="link"
                    className="border border-brass bg-brass/20 px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Write to the Studio Form */}
          <div className="rounded-sm border border-line bg-coal/70 p-7 md:p-10">
            <h3 className="font-display text-2xl tracking-tight text-paper md:text-3xl">
              Write to the studio
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-bone">
              Have a brief, tour enquiry, or custom collaboration in mind?
              Leave your details below.
            </p>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
