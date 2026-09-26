"use client";

/**
 * Reason-driven contact board.
 *
 * Picking a reason changes which fields are asked for, so a booking enquiry
 * and a shop enquiry do not share one generic textarea. Nothing is sent — the
 * submit resolves locally and the confirmation says so.
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { contact } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type Reason = {
  key: string;
  label: string;
  blurb: string;
  fields: { name: string; label: string; type?: string; required: boolean }[];
  route?: { label: string; href: string; note: string };
};

const REASONS: Reason[] = [
  {
    key: "booking",
    label: "Booking",
    blurb: "Dates, stages and the practical side of a show.",
    fields: [
      { name: "event", label: "Event or show", required: true },
      { name: "date", label: "Dates", type: "text", required: true },
      { name: "city", label: "City", required: true },
      { name: "scale", label: "Room size / capacity", required: false },
    ],
    route: { label: "Use the full session request", href: "/sessions/book", note: "Six steps, includes availability" },
  },
  {
    key: "session",
    label: "Sessions",
    blurb: "Studio guitars and strings for songs, BGM and jingles.",
    fields: [
      { name: "project", label: "What are you recording?", required: true },
      { name: "instruments", label: "Instruments needed", required: false },
      { name: "deadline", label: "Deadline", type: "text", required: false },
    ],
    route: { label: "Use the full session request", href: "/sessions/book", note: "Six steps, includes fees" },
  },
  {
    key: "production",
    label: "Production",
    blurb: "Arrangement, programming and full productions.",
    fields: [
      { name: "project", label: "The project", required: true },
      { name: "stage", label: "Where are you at?", required: false },
    ],
    route: { label: "Use the full session request", href: "/sessions/book", note: "Six steps, includes fees" },
  },
  {
    key: "studio",
    label: "Studio",
    blurb: "Academy, workshops and the studio itself.",
    fields: [
      { name: "subject", label: "What is this about?", required: true },
      { name: "detail", label: "Detail", required: false },
    ],
    route: { label: "Visit the academy", href: "/academy", note: "Lessons, classes and membership" },
  },
  {
    key: "collab",
    label: "Collaborations",
    blurb: "Working with another artist, live or on a record.",
    fields: [
      { name: "who", label: "Who are you?", required: true },
      { name: "idea", label: "The idea", required: true },
    ],
  },
  {
    key: "other",
    label: "Something else",
    blurb: "Anything that does not fit the list.",
    fields: [
      { name: "subject", label: "Subject", required: true },
      { name: "message", label: "Message", required: true },
    ],
  },
];

export default function ContactBoard() {
  const [reason, setReason] = useState(REASONS[0].key);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isReduced = useReducedMotion();

  const active = REASONS.find((r) => r.key === reason) ?? REASONS[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    for (const f of active.fields) {
      if (f.required && !values[f.name]?.trim()) next[f.name] = "This field is required.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 650));
    setSending(false);
    setSent(true);
  };

  return (
    <section className="bg-ink pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          {/* reasons */}
          <div>
            <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
              <span className="text-brass">01</span>
              <span className="h-px w-8 bg-line" />
              <span>What is it about?</span>
            </p>
            <div role="radiogroup" aria-label="Reason for contact" className="mt-8 flex flex-col">
              {REASONS.map((r) => {
                const on = r.key === reason;
                return (
                  <button
                    key={r.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      setReason(r.key);
                      setErrors({});
                      setSent(false);
                    }}
                    className={`group border-b border-line py-4 text-left transition-colors ${
                      on ? "text-paper" : "text-bone/70 hover:text-bone"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className={`h-px transition-all duration-300 ${
                          on ? "w-8 bg-brass" : "w-3 bg-line group-hover:w-6 group-hover:bg-brass/60"
                        }`}
                      />
                      <span className="font-display text-2xl leading-none tracking-tight md:text-3xl">
                        {r.label}
                      </span>
                    </span>
                    <span className="mt-1.5 block pl-12 text-sm text-mute">{r.blurb}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* form */}
          <div>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={isReduced ? false : { opacity: 0, y: 18 }}
                  animate={isReduced ? undefined : { opacity: 1, y: 0 }}
                  exit={isReduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-brass">
                    ✓ Message composed
                  </p>
                  <h2 className="mt-5 font-display text-3xl leading-tight text-paper md:text-4xl">
                    Nothing was sent.
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-bone">
                    This is a demonstration form — no message left the browser
                    and no one will reply. In production this posts to the
                    studio inbox, routed by the reason you picked.
                  </p>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <a
                      href={`mailto:${contact.email}`}
                      className="border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                    >
                      Email instead
                    </a>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
                    >
                      Write another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key={active.key}
                  onSubmit={submit}
                  initial={isReduced ? false : { opacity: 0, y: 18 }}
                  animate={isReduced ? undefined : { opacity: 1, y: 0 }}
                  exit={isReduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-mute">
                    {active.label}
                  </p>
                  <div className="mt-8 space-y-6">
                    {active.fields.map((f) => (
                      <div key={f.name}>
                        <label
                          htmlFor={`c-${f.name}`}
                          className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute"
                        >
                          {f.label}
                          {errors[f.name] ? (
                            <span className="ml-2 normal-case tracking-normal text-brass-bright">
                              {errors[f.name]}
                            </span>
                          ) : null}
                        </label>
                        <input
                          id={`c-${f.name}`}
                          name={f.name}
                          type={f.type ?? "text"}
                          value={values[f.name] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [f.name]: e.target.value }))
                          }
                          aria-invalid={Boolean(errors[f.name])}
                          aria-describedby={errors[f.name] ? `c-${f.name}-err` : undefined}
                          className={`mt-3 w-full border bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors ${
                            errors[f.name] ? "border-brass" : "border-line focus:border-brass/60"
                          }`}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        htmlFor="c-email"
                        className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute"
                      >
                        Email
                      </label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        value={values.email ?? ""}
                        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                        className="mt-3 w-full border border-line bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-brass/60"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-9 border border-brass/60 bg-brass/10 px-8 py-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink disabled:opacity-50"
                  >
                    {sending ? "Composing…" : `Send a ${active.label.toLowerCase()} message`}
                  </button>

                  {active.route ? (
                    <p className="mt-8 border-l border-brass/40 pl-4 text-sm leading-relaxed text-mute">
                      {active.route.note}.{" "}
                      <Link
                        href={active.route.href}
                        className="text-brass-bright underline underline-offset-4"
                      >
                        {active.route.label}
                      </Link>
                      .
                    </p>
                  ) : null}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
