"use client";

import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import SectionLink from "./ui/section-link";
import { collaborations, services, studioStatement } from "@/content/site";
import { sessions } from "@/content/platform";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Associations whose documented role is studio, record or film work. */
const studioCredits = collaborations.filter((c) =>
  /studio|album|film|record|kalpana|project/i.test(c.role),
);

const EMAIL = "johnpaulstudio1@gmail.com";
const bookingHref = `mailto:${EMAIL}?subject=${encodeURIComponent(sessions.cta.subject)}`;

/**
 * The session-player side of the career, with the door open.
 *
 * Evolved from the original services table — the same four documented rows and
 * the same editorial rhythm are kept — and extended into a booking experience:
 * the intended enquiry-to-session journey, the instruments available, and
 * selected studio credits. Enquiry is a real email rather than a form, because
 * no booking system exists in this build and the demo shouldn't imply one.
 */
export default function SessionsSection({
  index = "13",
  label = sessions.kicker,
  headlineLines = sessions.headline,
}: {
  index?: string;
  label?: string;
  headlineLines?: string[];
} = {}) {

  return (
    <section id="sessions" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index={index} label={label} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-20">
          <h2
            className="font-display leading-[0.94] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6.4vw, 6rem)" }}
          >
            {headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block will-change-transform ${
                    i === 1 ? "italic text-brass-bright" : ""
                  }`}
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <div className="flex flex-col gap-6">
            <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
              {sessions.intro}
            </p>
            <div className="flex flex-wrap gap-2">
              <SectionLink
                href="/contact"
                data-cursor="link"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-paper/30 px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper transition-colors hover:border-brass hover:text-brass-bright"
              >
                {sessions.secondary.label}
                <Arrow />
              </SectionLink>
            </div>
          </div>
        </div>

        {/* ---- the documented services table, kept ---- */}
        <div className="mt-20 border-t border-line md:mt-28">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              className="group grid gap-4 border-b border-line py-10 md:grid-cols-[70px_1.2fr_1fr_80px] md:items-center md:py-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, delay: i * 0.08, ease: EASE }}
            >
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
                {s.no}
              </span>
              <h3
                className="font-display leading-none tracking-tight text-paper transition-colors duration-300 group-hover:text-brass-bright"
                style={{ fontSize: "clamp(1.8rem, 4vw, 4rem)" }}
              >
                {s.name}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-bone">{s.body}</p>
              <SectionLink
                href="/contact"
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brass group-hover:bg-brass/10 md:flex"
                aria-label={`Enquire about ${s.name}`}
                data-cursor="link"
              >
                <Arrow />
              </SectionLink>
            </motion.div>
          ))}
        </div>

        {/* ---- what he can be booked for ---- */}
        <div className="mt-20 grid gap-10 border-t border-line pt-14 md:mt-28 md:grid-cols-[1fr_1.3fr] md:gap-20 md:pt-20">
          <div>
            <h3
              className="font-display leading-none tracking-tight text-paper"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
            >
              What he can be booked for
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone">
              {sessions.scopeNote}
            </p>
          </div>

          <ul className="flex flex-wrap content-start gap-2">
            {studioStatement.instruments.map((instrument, i) => (
              <motion.li
                key={instrument}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: EASE }}
              >
                <span className="inline-block rounded-full border border-line px-5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-bone transition-colors duration-300 hover:border-brass hover:text-brass-bright">
                  {instrument}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ---- how a session runs ---- */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h3
              className="font-display leading-none tracking-tight text-paper"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
            >
              How a session runs
            </h3>
            <p className="max-w-sm font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.22em] text-mute">
              The intended journey, from first email to delivered takes.
            </p>
          </div>

          <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:mt-14 md:grid-cols-3">
            {sessions.flow.map((step, i) => (
              <motion.li
                key={step.no}
                className="group relative bg-ink p-7 transition-colors duration-500 hover:bg-smoke md:p-9"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.3em] text-brass">
                  {step.no}
                </span>
                <p className="mt-4 font-display text-xl leading-tight tracking-tight text-paper md:text-2xl">
                  {step.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-bone">{step.body}</p>
              </motion.li>
            ))}
          </ol>

          <p className="mt-6 flex max-w-3xl items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
            <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
            {sessions.flowNote}
          </p>
        </div>

        {/* ---- selected studio credits ---- */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <h3
              className="font-display leading-none tracking-tight text-paper"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
            >
              Selected studio credits
            </h3>
            <SectionLink
              href="/music#collab"
              data-cursor="link"
              className="group inline-flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-brass-bright"
            >
              Full call list
              <Arrow />
            </SectionLink>
          </div>

          <ul className="mt-2">
            {studioCredits.map((credit, i) => (
              <motion.li
                key={credit.name}
                className="group flex items-baseline justify-between gap-6 border-b border-line py-5"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: EASE }}
              >
                <span className="font-display text-xl leading-tight tracking-tight text-bone transition-colors duration-300 group-hover:text-brass-bright md:text-2xl">
                  {credit.name}
                </span>
                <span className="shrink-0 font-mono text-[0.56rem] uppercase tracking-[0.22em] text-mute">
                  {credit.role}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ---- the ask ---- */}
        <div className="mt-24 flex flex-col items-start gap-8 border-t border-line pt-14 md:mt-32 md:flex-row md:items-center md:justify-between md:pt-20">
          <div>
            <p className="max-w-md font-display text-2xl italic leading-snug text-bone md:text-3xl">
              For songs, stages, records and workshops — the door is open.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bone">
              {sessions.cta.body}
            </p>
          </div>
          <MagneticButton
            as="a"
            href={bookingHref}
            strength={0.4}
            className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-ink"
            ariaLabel={`${sessions.cta.label} — opens your email client`}
          >
            <span
              className="flex items-center gap-3 px-10 py-5"
              style={{ background: "linear-gradient(120deg, #dcac73, #c08b4c)" }}
            >
              {sessions.cta.label}
              <Arrow />
            </span>
          </MagneticButton>
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
