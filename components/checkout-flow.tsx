"use client";

/**
 * Checkout — three steps, and the most important thing on the page is what it
 * refuses to do.
 *
 * No payment provider is wired up, because the catalogue has no prices. The
 * flow collects an enquiry, says plainly that nothing was charged, and hands
 * off to the studio's real inbox address. A checkout that pretends to take
 * money it cannot take is the single worst lie a concept site can tell.
 *
 * The state is local to the flow; the cart itself comes from
 * `CommerceProvider`, so a real store would replace the submit handler and
 * nothing else.
 */

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/providers/commerce-provider";
import PlaceholderArt from "./ui/placeholder-art";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { no: "01", key: "details", label: "Details" },
  { no: "02", key: "delivery", label: "Delivery" },
  { no: "03", key: "confirm", label: "Confirm" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export default function CheckoutFlow() {
  const { lines, count, clear } = useCart();
  const isReduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "India",
    notes: "",
  });

  const key: StepKey = STEPS[step].key;
  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (key === "details") {
      if (!form.name.trim()) next.name = "A name is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    }
    if (key === "delivery") {
      if (!form.address.trim()) next.address = "An address is required for delivery.";
      if (!form.city.trim()) next.city = "A city is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const confirm = async () => {
    if (!validate()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    const ref = `DEMO-ENQ-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    setDone(ref);
    setSending(false);
    clear();
  };

  /* ---- confirmation ---- */
  if (done) {
    return (
      <div className="min-h-screen bg-ink pb-24">
        <div className="mx-auto w-full max-w-[92rem] px-6 pt-40 md:px-10 lg:px-14">
          <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            <span className="text-brass">✓</span>
            <span className="h-px w-8 bg-line" />
            <span>Enquiry recorded</span>
          </p>
          <h1
            className="mt-8 font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.4rem)" }}
          >
            Nothing was
            <span className="block italic text-bone/75">charged.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-bone md:text-base">
            This is a demonstration checkout. No payment was taken, no order
            was created and no card details were requested — because no product
            in this catalogue carries a price. In production this step would hand
            off to a real payment provider.
          </p>
          <dl className="mt-10 grid w-full max-w-2xl gap-x-10 gap-y-5 sm:grid-cols-2">
            <div className="border-t border-line pt-4">
              <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                Reference
              </dt>
              <dd className="mt-2 font-mono text-sm text-paper">{done}</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                Email
              </dt>
              <dd className="mt-2 text-sm text-paper">{form.email}</dd>
            </div>
          </dl>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
            >
              Back to the shop
            </Link>
            <Link
              href="/contact"
              className="border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
            >
              Contact the studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---- empty cart ---- */
  if (!lines.length) {
    return (
      <div className="min-h-screen bg-ink pb-24">
        <div className="mx-auto w-full max-w-[92rem] px-6 pt-40 md:px-10 lg:px-14">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
            Checkout
          </p>
          <h1
            className="mt-8 font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6.4vw, 5rem)" }}
          >
            Nothing to
            <span className="block italic text-bone/75">check out.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-bone md:text-base">
            The cart is empty. Add something from the catalogue first — the cart
            persists across routes, so you can browse, listen and come back.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-block border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
          >
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  /* ---- the flow ---- */
  return (
    <div className="min-h-screen bg-ink pb-24">
      <div className="mx-auto w-full max-w-[92rem] px-6 pt-40 md:px-10 lg:px-14">
        <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
          <span className="text-brass">05</span>
          <span className="h-px w-8 bg-line" />
          <span>Checkout</span>
        </p>
        <h1
          className="mt-8 max-w-3xl font-display leading-[0.96] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(2.4rem, 6.6vw, 5.4rem)" }}
        >
          One last look,
          <span className="block italic text-bone/75">then an enquiry.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-sm leading-relaxed text-bone md:text-base">
          Nothing is charged here. The studio confirms edition sizes, shipping
          and pricing for every item before anything is settled.
        </p>

        {/* steps */}
        <ol className="mt-12 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              aria-current={i === step ? "step" : undefined}
              className={`flex items-center gap-3 border px-4 py-2.5 ${
                i === step ? "border-brass/60 text-paper" : "border-line text-mute"
              }`}
            >
              <span className={`font-mono text-[0.55rem] tracking-[0.24em] ${i === step ? "text-brass" : ""}`}>
                {i < step ? "✓" : s.no}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em]">
                {s.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={key}
                initial={isReduced ? false : { opacity: 0, y: 18 }}
                animate={isReduced ? undefined : { opacity: 1, y: 0 }}
                exit={isReduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {key === "details" ? (
                  <div className="space-y-6">
                    <Field label="Full name" error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        autoComplete="name"
                        className={input(Boolean(errors.name))}
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        autoComplete="email"
                        className={input(Boolean(errors.email))}
                      />
                    </Field>
                    <Field label="Phone — optional">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        autoComplete="tel"
                        className={input(false)}
                      />
                    </Field>
                  </div>
                ) : null}

                {key === "delivery" ? (
                  <div className="space-y-6">
                    <Field label="Address" error={errors.address}>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        aria-invalid={Boolean(errors.address)}
                        autoComplete="street-address"
                        className={input(Boolean(errors.address))}
                      />
                    </Field>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="City" error={errors.city}>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => set("city", e.target.value)}
                          aria-invalid={Boolean(errors.city)}
                          autoComplete="address-level2"
                          className={input(Boolean(errors.city))}
                        />
                      </Field>
                      <Field label="Postcode">
                        <input
                          type="text"
                          value={form.postcode}
                          onChange={(e) => set("postcode", e.target.value)}
                          autoComplete="postal-code"
                          className={input(false)}
                        />
                      </Field>
                    </div>
                    <Field label="Country">
                      <select
                        value={form.country}
                        onChange={(e) => set("country", e.target.value)}
                        className={input(false)}
                      >
                        {["India", "United Kingdom", "United States", "Australia", "Elsewhere"].map(
                          (c) => (
                            <option key={c} value={c} className="bg-coal">
                              {c}
                            </option>
                          ),
                        )}
                      </select>
                    </Field>
                    <Field
                      label="Delivery notes — optional"
                      hint="Signed items and editions may need a signature."
                    >
                      <textarea
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        rows={3}
                        className="w-full resize-y border border-line bg-coal px-4 py-3 text-sm text-paper outline-none focus:border-brass/60"
                      />
                    </Field>
                  </div>
                ) : null}

                {key === "confirm" ? (
                  <dl className="divide-y divide-line border-y border-line">
                    <Row label="Name" value={form.name} />
                    <Row label="Email" value={form.email} />
                    <Row label="Phone" value={form.phone || "Not given"} />
                    <Row label="Address" value={form.address} />
                    <Row label="City" value={form.city} />
                    <Row label="Postcode" value={form.postcode || "—"} />
                    <Row label="Country" value={form.country} />
                    <Row label="Items" value={String(count)} />
                    <Row label="Total" value="To be confirmed" />
                    <Row label="Payment" value="Nothing is charged through this site" />
                  </dl>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
                >
                  Back
                </button>
              ) : null}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={confirm}
                  disabled={sending}
                  className="border border-brass/60 bg-brass/10 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send the enquiry"}
                </button>
              )}
            </div>
          </div>

          {/* order summary */}
          <aside className="border border-line p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl leading-none tracking-tight text-paper">
              Your items
            </h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {lines.map((line) => (
                <li key={`${line.handle}-${line.variantTitle}`} className="flex gap-4 py-4">
                  <div className="h-16 w-14 shrink-0 overflow-hidden border border-line bg-smoke">
                    <PlaceholderArt seed={line.seed} label={line.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-paper">
                      {line.title}
                    </p>
                    <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-mute">
                      {line.quantity} × {line.unitPrice ?? "To be confirmed"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-baseline justify-between">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
                Total
              </span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mute">
                To be confirmed
              </span>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function input(invalid: boolean) {
  return `w-full border bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors placeholder:text-mute/60 ${
    invalid ? "border-brass" : "border-line focus:border-brass/60"
  }`;
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 py-4">
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mute">{label}</dt>
      <dd className="max-w-md text-right text-sm text-paper">{value}</dd>
    </div>
  );
}
