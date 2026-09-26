"use client";

/**
 * The six-step session request.
 *
 * State lives in `BookingProvider` (mounted in the root layout) so the flow is
 * the single seam a real booking API would replace. Nothing is transmitted:
 * `submit()` resolves locally and the confirmation says so in as many words.
 * Every field is labelled and errors are announced, because a form that
 * quietly does nothing is worse than no form.
 */

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useBooking } from "@/lib/providers/booking-provider";
import {
  budgetField,
  bookingSteps,
  durationOptions,
  investmentShapes,
  locationOptions,
  serviceTypes,
  timeOptions,
  upcomingDates,
} from "@/content/booking";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BookingFlow({
  copy,
}: {
  copy: {
    headline: string[];
    intro: string;
    reassurance: string[];
    successTitle: string;
    successBody: string;
  };
}) {
  const {
    step,
    stepKey,
    draft,
    reference,
    submitting,
    errors,
    isFirst,
    isLast,
    progress,
    next,
    back,
    set,
    toggleInstrument,
    submit,
    reset,
  } = useBooking();
  const isReduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  return (
    <div className="min-h-screen bg-ink pb-24">
      {/* ---- confirmation ---- */}
      {reference ? (
        <div className="mx-auto flex w-full max-w-[92rem] flex-col items-start px-6 pt-40 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">✓</span>
            <span className="h-px w-8 bg-line" />
            <span>Step 06 of 06</span>
          </p>
          <h1
            className="mt-8 font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.6rem)" }}
          >
            {copy.successTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-bone md:text-base">
            {copy.successBody}
          </p>
          <dl className="mt-10 grid w-full max-w-2xl gap-x-10 gap-y-5 sm:grid-cols-2">
            <Row label="Reference" value={reference} />
            <Row
              label="Service"
              value={serviceTypes.find((s) => s.key === draft.service)?.title ?? "—"}
            />
            <Row label="Name" value={draft.name || "—"} />
            <Row label="Email" value={draft.email || "—"} />
          </dl>
          <p className="mt-10 font-mono text-[0.6rem] uppercase leading-[1.9] tracking-[0.2em] text-mute">
            This confirmation is generated locally. No message was sent, no
            booking exists and no payment was taken.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/sessions"
              className="border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
            >
              Back to sessions
            </Link>
            <button
              type="button"
              onClick={reset}
              className="border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
            >
              Start another request
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[92rem] px-6 pt-40 md:px-10 lg:px-14">
          {/* ---- header ---- */}
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">03</span>
            <span className="h-px w-8 bg-line" />
            <span>Request a session</span>
          </p>
          <h1
            className="mt-8 max-w-3xl font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.6rem)" }}
          >
            {copy.headline[0]}
            <span className="block italic text-bone/75">{copy.headline[1]}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-bone md:text-base">
            {copy.intro}
          </p>

          {/* ---- progress rail ---- */}
          <nav aria-label="Booking progress" className="mt-14">
            <ol className="flex flex-wrap gap-x-2 gap-y-3">
              {bookingSteps.map((s, i) => {
                const state = i < step ? "done" : i === step ? "now" : "todo";
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => i < step && (i === step ? null : undefined)}
                      disabled={i > step}
                      aria-current={state === "now" ? "step" : undefined}
                      className={`group flex items-center gap-3 border px-3.5 py-2.5 transition-colors ${
                        state === "now"
                          ? "border-brass/60 text-paper"
                          : state === "done"
                            ? "border-line text-bone/70 hover:border-brass/40"
                            : "border-line/50 text-mute/60"
                      }`}
                    >
                      <span
                        className={`font-mono text-[0.55rem] tracking-[0.24em] ${
                          state === "now" ? "text-brass" : ""
                        }`}
                      >
                        {state === "done" ? "✓" : s.no}
                      </span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em]">
                        {s.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 h-px w-full bg-line">
              <div
                className="h-px bg-brass transition-[width] duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </nav>

          {/* ---- step body ---- */}
          <div className="mt-14 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepKey}
                initial={isReduced ? false : { opacity: 0, y: 18 }}
                animate={isReduced ? undefined : { opacity: 1, y: 0 }}
                exit={isReduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-3xl leading-tight tracking-tight text-paper md:text-4xl"
                >
                  {bookingSteps[step].title}
                </h2>
                <p className="mt-2 text-sm text-mute">{bookingSteps[step].note}</p>

                <div className="mt-8">
                  {stepKey === "service" ? (
                    <Choices
                      items={serviceTypes}
                      value={draft.service}
                      onPick={(v) => set("service", v)}
                      error={errors.service}
                      describe
                    />
                  ) : null}

                  {stepKey === "details" ? (
                    <div className="space-y-8">
                      <Field
                        label="What are you working on?"
                        error={errors.brief}
                        hint="A line or two is plenty."
                      >
                        <textarea
                          value={draft.brief}
                          onChange={(e) => set("brief", e.target.value)}
                          rows={4}
                          aria-invalid={Boolean(errors.brief)}
                          placeholder="e.g. an acoustic arrangement for a live set, two weeks out"
                          className="w-full resize-y border border-line bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-mute/60 focus:border-brass/60"
                        />
                      </Field>
                      <fieldset>
                        <legend className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
                          Instruments involved — optional
                        </legend>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {[
                            "Electric guitar",
                            "Acoustic guitar",
                            "Bass",
                            "Nylon",
                            "Mandola",
                            "Mandolin",
                            "Banjo",
                            "Ukulele",
                            "Vocals / other",
                          ].map((i) => (
                            <Chip
                              key={i}
                              active={draft.instruments.includes(i)}
                              onClick={() => toggleInstrument(i)}
                            >
                              {i}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ) : null}

                  {stepKey === "schedule" ? (
                    <div className="space-y-8">
                      <Choices
                        items={locationOptions}
                        value={draft.location}
                        onPick={(v) => set("location", v)}
                        error={errors.location}
                      />
                      <Field label="Preferred date — indicative only">
                        <div className="flex flex-wrap gap-2">
                          {upcomingDates(10).map((d) => (
                            <Chip
                              key={d.iso}
                              active={draft.date === d.iso}
                              onClick={() => set("date", d.iso)}
                            >
                              <span className="text-mute">{d.weekday}</span> {d.day}{" "}
                              <span className="text-mute">{d.month}</span>
                            </Chip>
                          ))}
                        </div>
                      </Field>
                      <Field label="Length">
                        <Choices
                          items={durationOptions}
                          value={draft.duration}
                          onPick={(v) => set("duration", v)}
                        />
                      </Field>
                      <Field label="Time of day">
                        <div className="flex flex-wrap gap-2">
                          {timeOptions.map((t) => (
                            <Chip
                              key={t}
                              active={draft.time === t}
                              onClick={() => set("time", t)}
                            >
                              {t}
                            </Chip>
                          ))}
                        </div>
                      </Field>
                    </div>
                  ) : null}

                  {stepKey === "budget" ? (
                    <div className="space-y-8">
                      <Field
                        label="What shape is this?"
                        hint="Fees are confirmed by the studio for every enquiry."
                      >
                        <Choices
                          items={investmentShapes}
                          value={draft.investment}
                          onPick={(v) => set("investment", v)}
                        />
                      </Field>
                      <Field label={budgetField.label} hint={budgetField.note}>
                        <input
                          type="text"
                          value={draft.budget}
                          onChange={(e) => set("budget", e.target.value)}
                          placeholder={budgetField.placeholder}
                          className="w-full border border-line bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-mute/60 focus:border-brass/60"
                        />
                      </Field>
                    </div>
                  ) : null}

                  {stepKey === "contact" ? (
                    <div className="space-y-6">
                      <Field label="Name" error={errors.name}>
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(e) => set("name", e.target.value)}
                          aria-invalid={Boolean(errors.name)}
                          autoComplete="name"
                          className={inputCls(Boolean(errors.name))}
                        />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input
                          type="email"
                          value={draft.email}
                          onChange={(e) => set("email", e.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          autoComplete="email"
                          className={inputCls(Boolean(errors.email))}
                        />
                      </Field>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Phone — optional">
                          <input
                            type="tel"
                            value={draft.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            autoComplete="tel"
                            className={inputCls(false)}
                          />
                        </Field>
                        <Field label="City — optional">
                          <input
                            type="text"
                            value={draft.city}
                            onChange={(e) => set("city", e.target.value)}
                            autoComplete="address-level2"
                            className={inputCls(false)}
                          />
                        </Field>
                      </div>
                      <Field label="Anything else — optional">
                        <textarea
                          value={draft.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          rows={3}
                          className="w-full resize-y border border-line bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-brass/60"
                        />
                      </Field>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={draft.consent}
                          onChange={(e) => set("consent", e.target.checked)}
                          aria-invalid={Boolean(errors.consent)}
                          className="mt-1 h-4 w-4 shrink-0 accent-[#bc8a4c]"
                        />
                        <span className="text-sm text-bone">
                          Happy for the studio to contact me about this enquiry.
                        </span>
                      </label>
                      {errors.consent ? (
                        <p role="alert" className="text-sm text-brass-bright">
                          {errors.consent}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {stepKey === "review" ? (
                    <dl className="divide-y divide-line border-y border-line">
                      <Row
                        label="Service"
                        value={
                          serviceTypes.find((s) => s.key === draft.service)?.title ?? "—"
                        }
                      />
                      <Row label="Brief" value={draft.brief || "—"} />
                      <Row
                        label="Instruments"
                        value={draft.instruments.join(", ") || "Not specified"}
                      />
                      <Row
                        label="Where"
                        value={
                          locationOptions.find((l) => l.key === draft.location)?.label ?? "—"
                        }
                      />
                      <Row
                        label="Date"
                        value={
                          draft.date
                            ? new Date(`${draft.date}T00:00:00`).toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })
                            : "Flexible"
                        }
                      />
                      <Row
                        label="Length"
                        value={
                          durationOptions.find((d) => d.key === draft.duration)?.label ?? "—"
                        }
                      />
                      <Row label="Time" value={draft.time ?? "Flexible"} />
                      <Row
                        label="Investment"
                        value={
                          investmentShapes.find((i) => i.key === draft.investment)?.label ??
                          "Not specified"
                        }
                      />
                      <Row label="Budget" value={draft.budget || "To be confirmed"} />
                      <Row label="Name" value={draft.name || "—"} />
                      <Row label="Email" value={draft.email || "—"} />
                    </dl>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ---- controls ---- */}
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-8">
            {!isFirst ? (
              <button
                type="button"
                onClick={back}
                className="border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
              >
                Back
              </button>
            ) : null}
            {isLast ? (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="border border-brass/60 bg-brass/10 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send the request"}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
              >
                Continue
              </button>
            )}
            <p className="font-mono text-[0.56rem] uppercase leading-[1.9] tracking-[0.2em] text-mute">
              {copy.reassurance[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */

function inputCls(invalid: boolean) {
  return `w-full border bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-mute/60 ${
    invalid ? "border-brass" : "border-line focus:border-brass/60"
  }`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 py-4">
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mute">{label}</dt>
      <dd className="max-w-md text-right text-sm text-paper">{value}</dd>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
        {label}
        {error ? <span className="ml-2 text-brass-bright">{error}</span> : null}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-mute/80">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] transition-colors ${
        active
          ? "border-brass/70 bg-brass/10 text-brass-bright"
          : "border-line text-bone hover:border-brass/40"
      }`}
    >
      {children}
    </button>
  );
}

function Choices({
  items,
  value,
  onPick,
  error,
  describe,
}: {
  items: { key: string; title?: string; label?: string; no?: string; summary?: string; detail?: string; note?: string }[];
  value: string | null;
  onPick: (key: string) => void;
  error?: string;
  describe?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose one"
      className="grid gap-3 sm:grid-cols-2"
    >
      {items.map((item) => {
        const active = value === item.key;
        const title = item.title ?? item.label ?? "";
        return (
          <button
            key={item.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onPick(item.key)}
            className={`flex h-full flex-col items-start gap-2 border p-5 text-left transition-colors ${
              active
                ? "border-brass/70 bg-brass/10"
                : "border-line hover:border-brass/40"
            }`}
          >
            <span className="flex w-full items-baseline justify-between gap-3">
              <span className="font-display text-xl leading-none tracking-tight text-paper">
                {title}
              </span>
              {item.no ? (
                <span
                  className={`font-mono text-[0.55rem] tracking-[0.24em] ${
                    active ? "text-brass" : "text-mute/60"
                  }`}
                >
                  {item.no}
                </span>
              ) : null}
            </span>
            <span className="text-sm leading-relaxed text-bone/80">
              {item.summary ?? item.note}
            </span>
            {describe && item.detail ? (
              <span className="text-xs leading-relaxed text-mute">{item.detail}</span>
            ) : null}
          </button>
        );
      })}
      {error ? (
        <p role="alert" className="text-sm text-brass-bright sm:col-span-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}
