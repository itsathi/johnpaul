"use client";

import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import { contact, artist } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

function HeadingWord({
  children,
  delay = 0,
}: {
  children: string;
  delay?: number;
}) {
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
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-coal pt-28 pb-16 md:pt-44"
    >
      {/* giant closing watermark */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-0.18em] select-none text-center font-display leading-none text-outline opacity-40"
        style={{ fontSize: "clamp(4rem, 14vw, 15rem)" }}
        aria-hidden
      >
        {artist.name}
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="14" label="Contact" />

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

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
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
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
              Whether it&apos;s a tour, a record, a single session or a
              conversation about where your music should go next — write, call,
              or find him wherever the music is shared.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
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

            <p className="font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.26em] text-mute">
              Follow @johnpaul.india — new music, live dates and the studio,
              documented in the open.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M3 11 L11 3 M4 3 H11 V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}