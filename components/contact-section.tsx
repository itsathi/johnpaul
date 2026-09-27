"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import ContactForm from "./contact-form";
import MagneticButton from "./ui/magnetic-button";
import { useScrollTo } from "./smooth-scroll";
import { contact, artist } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The closing conversion section.
 *
 * The brief's warning against equal-weight CTAs is the organising principle:
 * booking a session and joining the academy are the commercial actions and get
 * the filled brass treatment, listening gets an outline, and everything else
 * steps down to text. Contact details and socials sit below, not beside, so
 * the page ends by asking for something rather than by listing ways to reach him.
 */
const LADDER = [
  { label: "Request a Session", href: "/sessions/book", tier: "primary" },
  { label: "Join the Academy", href: "/academy", tier: "primary" },
  { label: "Hear the music", href: "/music", tier: "outline" },
  { label: "Book John to play", href: "/sessions", tier: "outline" },
] as const;

function HeadingWord({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ContactSection() {
  const { scrollTo } = useScrollTo();
  const router = useRouter();

  /* Hashes scroll in place; routes are pushed. The contact ladder is the one
     place the homepage points outward, so it has to know the difference. */
  const go = (href: string) => {
    if (href.startsWith("#")) scrollTo(href);
    else router.push(href);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-coal pt-28 pb-16 md:pt-44">
      {/* giant closing watermark */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-0.18em] select-none text-center font-display leading-none text-outline opacity-40"
        style={{ fontSize: "clamp(4rem, 14vw, 15rem)" }}
        aria-hidden
      >
        {artist.name}
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="18" label="Contact" />

        <h2
          className="mt-14 font-display leading-[0.92] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(3rem, 10vw, 9.6rem)" }}
        >
          {contact.headline.map((word, i) => (
            <HeadingWord key={word} delay={0.05 + i * 0.12}>
              {word}
            </HeadingWord>
          ))}
        </h2>

        {/* ---- the ladder: what to do, in order of weight ---- */}
        <div className="mt-14 flex flex-col gap-4 md:mt-20 md:flex-row md:flex-wrap md:items-center">
          {LADDER.filter((l) => l.tier === "primary").map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            >
              <MagneticButton
                strength={0.4}
                onClick={() => go(item.href)}
                ariaLabel={item.label}
                className={`font-mono uppercase tracking-[0.28em] text-ink ${
                  i === 0 ? "text-[0.68rem]" : "text-[0.62rem] opacity-90"
                }`}
              >
                <span
                  className={`flex items-center gap-3 ${
                    i === 0 ? "px-8 py-5" : "px-7 py-4"
                  }`}
                  style={{ background: "linear-gradient(120deg, #dcac73, #c08b4c)" }}
                >
                  {item.label}
                  <Arrow />
                </span>
              </MagneticButton>
            </motion.div>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:ml-4">
            {LADDER.filter((l) => l.tier === "outline").map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                data-cursor="link"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-paper/30 px-6 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.22em] text-paper transition-colors hover:border-brass hover:text-brass-bright"
              >
                {item.label}
                <Arrow />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          {/* ---- who and where ---- */}
          <motion.div
            className="flex flex-wrap content-start gap-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {contact.channels.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line px-6 py-3 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-bone transition-colors duration-300 hover:border-brass hover:text-paper"
              >
                {c}
              </span>
            ))}

            <div className="mt-8 flex w-full flex-col gap-6 border-t border-line pt-10">
              <a
                href={`mailto:${contact.email}`}
                className="font-display text-xl italic text-bone transition-colors hover:text-brass-bright md:text-3xl"
                data-cursor="link"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="font-display text-xl italic text-bone transition-colors hover:text-brass-bright md:text-3xl"
                data-cursor="link"
              >
                {contact.phone}
              </a>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-mute">
                {contact.location}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-10">
              {contact.socials.map((s) => (
                <MagneticButton
                  key={s.label}
                  as="a"
                  href={s.href}
                  strength={0.22}
                  className="group items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-bone transition-colors hover:text-paper"
                  ariaLabel={`${s.label} — opens in a new tab`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper transition-colors group-hover:border-brass group-hover:text-brass-bright">
                    <ArrowUpRight />
                  </span>
                  {s.label}
                </MagneticButton>
              ))}
            </div>
          </motion.div>

          {/* ---- write to the studio ---- */}
          <motion.div
            className="flex flex-col justify-between gap-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <div>
              <h3
                className="font-display leading-none tracking-tight text-paper"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
              >
                Write to the studio
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone">
                Booking, sessions, production or a conversation about where your
                music should go next. The more you can say about the work, the
                more useful the first reply will be.
              </p>
            </div>

            <ContactForm />

            <p className="font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.26em] text-mute">
              Looking for the detailed version?{" "}
              <a
                href="/contact"
                data-cursor="link"
                className="text-brass-bright underline-offset-4 hover:underline"
              >
                The contact board
              </a>{" "}
              asks what your message is about and shows only the fields that
              apply.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden className="shrink-0">
      <path d="M1 8 H15 M8 1 L15 8 L8 15" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path d="M3 11 L11 3 M4 3 H11 V10" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
