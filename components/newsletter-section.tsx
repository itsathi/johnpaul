"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import { contact, instagramHandle } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The newsletter, standing on its own between the shop and the door.
 *
 * This was the right-hand column of the closing contact section, where it read
 * as one of two things competing for the same attention. Split out, it becomes
 * what it actually is — a way to follow the record as it lands — and the
 * contact section below it is left to ask for one thing: a message.
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <section id="newsletter" className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="17" label="Newsletter" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <h2
              className="font-display leading-[0.98] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.6rem)" }}
            >
              Follow the{" "}
              <em className="italic text-brass-bright">rollout</em>.
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-relaxed text-bone md:text-base">
              Whether it&apos;s a tour, a record, a single session or a
              conversation about where your music should go next — new music,
              live dates and the studio, documented in the open.
            </p>

            <p className="mt-8 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.26em] text-mute">
              Or follow{" "}
              <a
                href={contact.socials[0].href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="link"
                className="text-brass-bright underline-offset-4 hover:underline"
              >
                {instagramHandle}
              </a>{" "}
              directly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <SubscribeForm
              email={email}
              setEmail={setEmail}
              subscribed={subscribed}
              onSubmit={onSubscribe}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Demonstration only — no request leaves the browser and nothing is   */
/* stored. The state exists so the client can see the intended UX.      */
/* ------------------------------------------------------------------ */

function SubscribeForm({
  email,
  setEmail,
  subscribed,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  subscribed: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <label
        htmlFor="subscribe-email"
        className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-mute"
      >
        Email address
      </label>

      {subscribed ? (
        <motion.p
          className="mt-4 flex items-center gap-3 border-b border-brass/50 pb-4 font-display text-lg italic text-brass-bright"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
          You&apos;re on the list — demonstration only, nothing was sent.
        </motion.p>
      ) : (
        <div className="mt-4 flex items-center gap-3 border-b border-line pb-4 transition-colors duration-300 focus-within:border-brass">
          <input
            id="subscribe-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="min-w-0 flex-1 bg-transparent font-mono text-[0.7rem] tracking-[0.16em] text-paper placeholder:text-mute/60 focus:outline-none"
          />
          <button
            type="submit"
            data-cursor="link"
            aria-label="Subscribe"
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-brass hover:text-brass-bright"
          >
            <Arrow />
          </button>
        </div>
      )}

      <p className="mt-4 font-mono text-[0.52rem] uppercase leading-relaxed tracking-[0.24em] text-mute/80">
        Demonstration form — no mailing list is connected and nothing is
        stored.
      </p>
    </form>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden className="shrink-0">
      <path d="M1 8 H15 M8 1 L15 8 L8 15" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
