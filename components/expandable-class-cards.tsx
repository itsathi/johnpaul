"use client";

/**
 * The class list as expandable cards.
 *
 * Each card shows a class the short way — number, thumbnail, title, one-line
 * blurb — and opens into the whole thing: overview, the practical
 * specification, what the run covers, the module shape and the questions.
 * That is the Aceternity "expandable card" mechanic (a shared-layout element
 * that grows into a fullscreen panel), rebuilt around real content.
 *
 * Four things the registry version got wrong, all of which mattered here:
 *
 *  1. It set `document.body.style.overflow = "auto"` on every render where the
 *     card was *closed*. That stomps the inline style any other open layer had
 *     set — a menu, a lightbox, the site header's own lock — and it also runs
 *     on mount before anything is open. The lock here records the previous
 *     value and puts it back, and only while the panel is actually open.
 *  2. Its cleanup removed the keydown listener but never released the scroll
 *     lock, so unmounting mid-open left the page permanently unscrollable.
 *  3. The close control was `lg:hidden` — on desktop the only ways out were
 *     Escape and a click on the backdrop, and neither is discoverable. It is
 *     now always visible, and focus returns to the card that opened it.
 *  4. The clickable row was a `div` with an `onClick` wrapping a real `button`.
 *     The card is now the button, so it is reachable by keyboard and announced
 *     as a button rather than as unlabelled group content.
 *
 * The panel is a `role="dialog"` with `aria-modal`, and Tab is kept inside it
 * while it is open.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import EnrolButton from "@/components/enrol-button";
import { GhostLink, SourceNote } from "@/components/ui/atoms";
import { wix } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/media-hooks";
import type { AcademyClass } from "@/content/academy-program";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** `null` renders as "To be confirmed" — the same rule the rest of the site uses. */
function Confirmed({ value }: { value: string | null }) {
  if (value) return <>{value}</>;
  return (
    <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mute">
      To be confirmed
    </span>
  );
}

export default function ExpandableClassCards({
  classes,
}: {
  classes: AcademyClass[];
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const open = classes.find((c) => c.slug === openSlug) ?? null;

  const close = useCallback(() => {
    setOpenSlug(null);
    // Hand focus back to whatever opened the panel.
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {classes.map((item) => (
          <li key={item.slug}>
            <ClassCard
              item={item}
              onOpen={(trigger) => {
                triggerRef.current = trigger;
                setOpenSlug(item.slug);
              }}
            />
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open ? (
          <ClassPanel
            key={open.slug}
            item={open}
            onClose={close}
            reduced={!!reduced}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ClassCard({
  item,
  onOpen,
}: {
  item: AcademyClass;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.div layoutId={`class-card-${item.slug}`} className="group">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => onOpen(buttonRef.current!)}
        aria-haspopup="dialog"
        className="flex w-full flex-col items-start gap-5 rounded-lg border border-line p-4 text-left transition-colors duration-500 hover:border-brass/45 hover:bg-coal/60 md:flex-row md:items-center md:justify-between md:p-5"
      >
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:gap-5">
          <motion.div layoutId={`class-image-${item.slug}`} className="shrink-0">
            <Image
              src={wix(item.media, 400, 400)}
              alt=""
              aria-hidden
              width={200}
              height={200}
              className="h-28 w-28 rounded-md object-cover object-top md:h-16 md:w-16"
            />
          </motion.div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-[0.56rem] tracking-[0.28em] text-brass">
                {item.no}
              </span>
              <SourceNote source={item.source} label={item.status} />
            </div>
            <h3 className="mt-1.5 font-display text-xl leading-none tracking-tight text-paper md:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-bone/80">{item.blurb}</p>
          </div>
        </div>

        <span
          className="shrink-0 self-start rounded-full bg-smoke px-4 py-2 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper transition-colors duration-300 group-hover:bg-brass group-hover:text-ink md:self-center"
          aria-hidden
        >
          Open
        </span>
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function ClassPanel({
  item,
  onClose,
  reduced,
}: {
  item: AcademyClass;
  onClose: () => void;
  reduced: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  /* ---- scroll lock: remember what was there, put it back ---- */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* ---- Escape closes, Tab stays inside ---- */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const stops = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (stops.length === 0) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* ---- move focus into the panel ---- */
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-ink/80 backdrop-blur-sm"
        aria-hidden
      />

      <motion.div
        layoutId={`class-card-${item.slug}`}
        transition={spring}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-coal shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={panelRef}
      >
        <motion.div layoutId={`class-image-${item.slug}`} className="relative shrink-0">
          <Image
            src={wix(item.media, 900, 500)}
            alt={item.mediaAlt}
            width={900}
            height={500}
            className="h-40 w-full object-cover object-top sm:h-52"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-paper transition-colors hover:bg-brass hover:text-ink"
            aria-label={`Close ${item.title}`}
          >
            <CloseIcon />
          </button>
        </motion.div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7 [scrollbar-width:thin] md:px-9">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-mono text-[0.56rem] tracking-[0.28em] text-brass">
              {item.no}
            </span>
            <SourceNote source={item.source} label={item.status} />
          </div>

          <h2
            id={titleId}
            className="mt-2 font-display text-3xl leading-none tracking-tight text-paper md:text-4xl"
          >
            {item.title}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-bone">{item.overview}</p>

          <dl className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[
              { label: "Format", value: item.format },
              { label: "Level", value: item.level },
              { label: "Duration", value: item.duration },
              { label: "Schedule", value: item.schedule },
              { label: "Places", value: item.seats },
              { label: "Fee", value: item.fee },
            ].map((spec) => (
              <div key={spec.label} className="border-t border-line pt-3">
                <dt className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-mute">
                  {spec.label}
                </dt>
                <dd className="mt-1.5 text-sm text-paper">
                  <Confirmed value={spec.value} />
                </dd>
              </div>
            ))}
          </dl>

          <PanelBlock title="What a run covers">
            <ul className="flex flex-col gap-2">
              {item.learn.map((l) => (
                <li
                  key={l.title}
                  className="flex items-baseline gap-3 text-sm text-bone"
                >
                  <span className="h-px w-3 shrink-0 bg-brass" />
                  {l.title}
                </li>
              ))}
            </ul>
          </PanelBlock>

          <PanelBlock title="The shape of it">
            <ol className="grid gap-2 sm:grid-cols-3">
              {item.modules.map((m) => (
                <li key={m.no} className="border border-line p-4">
                  <span className="font-mono text-[0.52rem] tracking-[0.28em] text-brass">
                    {m.no}
                  </span>
                  <p className="mt-2 text-sm text-paper">{m.title}</p>
                  <p className="mt-2 text-[0.78rem] leading-relaxed text-bone/75">
                    <Confirmed value={m.detail} />
                  </p>
                </li>
              ))}
            </ol>
          </PanelBlock>

          <PanelBlock title="Questions">
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {item.faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-display text-base leading-snug text-paper">
                    {f.q}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-bone/80">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </PanelBlock>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-4 border-t border-line bg-smoke/60 px-6 py-5 md:px-9">
          <EnrolButton
            slug={item.slug}
            title={item.title}
            track="Classes"
            label={`Register interest in ${item.title}`}
            primary
          />
          <GhostLink href={`/academy/classes/${item.slug}`}>
            Full class page
          </GhostLink>
          <span className="ml-auto font-mono text-[0.5rem] uppercase tracking-[0.2em] text-mute">
            No payment is taken here
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function PanelBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-9">
      <h3 className="flex items-center gap-4 font-mono text-[0.56rem] uppercase tracking-[0.3em] text-mute">
        <span className="text-brass" aria-hidden>
          —
        </span>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
