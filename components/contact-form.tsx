"use client";

/**
 * The homepage contact form — name, email, subject, message.
 *
 * `/contact` keeps the reason-driven board, where picking a reason changes the
 * fields asked for. The homepage gets the general case: one form, four fields,
 * because the visitor arriving at the end of a landing page has usually
 * already decided what they want and should not have to classify it first.
 *
 * The visual language is shared with `contact-board` — same border treatment,
 * same mono labels, same brass validation state — so the two do not look like
 * different products.
 *
 * Nothing is sent. The confirmation says so, the same way every other
 * demonstration form on this site does.
 */

import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { contact } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type Field = "name" | "email" | "subject" | "message";

const REQUIRED: Field[] = ["name", "email", "subject", "message"];

const FIELDS: { name: Field; label: string; type?: string; long?: boolean }[] = [
  { name: "name", label: "Your name" },
  { name: "email", label: "Email", type: "email" },
  { name: "subject", label: "Subject" },
  { name: "message", label: "Message", long: true },
];

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const reduced = useReducedMotion();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: Partial<Record<Field, string>> = {};
    for (const field of REQUIRED) {
      if (!values[field].trim()) next[field] = "This field is required.";
    }
    // The browser's own type check covers `type="email"`; this catches the
    // common paste of a name into the address box.
    if (!next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = "That address does not look right.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 650));
    setSending(false);
    setSent(true);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-brass">
              ✓ Message composed
            </p>
            <h3 className="mt-5 font-display text-2xl leading-tight text-paper md:text-3xl">
              Nothing was sent.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bone">
              This is a demonstration form — no message left the browser and no
              one will reply. Write to{" "}
              <a
                href={`mailto:${contact.email}`}
                data-cursor="link"
                className="text-brass-bright underline underline-offset-4"
              >
                {contact.email}
              </a>{" "}
                and it will arrive.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              data-cursor="link"
              className="mt-8 border border-line px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60 hover:text-paper"
            >
              Write another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex flex-col gap-6">
              {FIELDS.map((field) => {
                const id = `${uid}-${field.name}`;
                const error = errors[field.name];
                const shared = `mt-3 w-full border bg-coal px-4 py-3 text-sm text-paper outline-none transition-colors ${
                  error
                    ? "border-brass"
                    : "border-line focus:border-brass/60"
                }`;

                return (
                  <div key={field.name}>
                    <label
                      htmlFor={id}
                      className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-mute"
                    >
                      {field.label}
                      {error ? (
                        <span
                          id={`${id}-err`}
                          className="ml-2 normal-case tracking-normal text-brass-bright"
                        >
                          {error}
                        </span>
                      ) : null}
                    </label>

                    {field.long ? (
                      <textarea
                        id={id}
                        name={field.name}
                        rows={5}
                        value={values[field.name]}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [field.name]: e.target.value }))
                        }
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-err` : undefined}
                        className={`${shared} resize-y`}
                      />
                    ) : (
                      <input
                        id={id}
                        name={field.name}
                        type={field.type ?? "text"}
                        autoComplete={
                          field.name === "email"
                            ? "email"
                            : field.name === "name"
                              ? "name"
                              : undefined
                        }
                        value={values[field.name]}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [field.name]: e.target.value }))
                        }
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-err` : undefined}
                        className={shared}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={sending}
              data-cursor="link"
              className="mt-8 border border-brass/60 bg-brass/10 px-8 py-4 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink disabled:opacity-50"
            >
              {sending ? "Composing…" : "Send the message"}
            </button>

            <p className="mt-6 font-mono text-[0.52rem] uppercase leading-relaxed tracking-[0.24em] text-mute/80">
              Demonstration form — nothing is sent or stored.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
