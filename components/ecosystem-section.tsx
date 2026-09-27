"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import { LampContainer } from "./ui/lamp";
import { StickyScroll, type StickyScrollCard } from "./ui/sticky-scroll-reveal";
import { useScrollTo } from "./smooth-scroll";
import { useMediaQuery } from "@/lib/media-hooks";
import { ecosystem, type Pillar } from "@/content/platform";

const EASE = [0.22, 1, 0.36, 1] as const;
const PILLARS = ecosystem.pillars;
const COUNT = PILLARS.length;

/** The six rooms as a scrolled sequence, one card per pillar. */
const STICKY_CARDS: StickyScrollCard[] = PILLARS.map((pillar) => ({
  title: pillar.title,
  description: pillar.line,
  content: <PillarDoors pillar={pillar} />,
}));

/* Deck geometry. The fan is the whole effect: every card behind the front one
   is lifted by `PEEK` and scaled down a little, so only its header row shows and
   the group reads as a single deck.

   The number is not decorative. A card scaled to 0.86 is 12px shorter, so the
   edge that clears the card in front of it is `PEEK - 12`, not `PEEK` — and that
   edge has to be at least 20px or the name printed on it gets sliced in half.
   34px is the smallest value that shows the row whole at six cards deep. */
const SCALE_STEP = 0.028;
const PEEK = 34;



const SPRING = { type: "spring" as const, stiffness: 240, damping: 30, mass: 0.9 };

/* The cards arrive from below and settle into a deck. It hangs off the stage
   rather than each card: the cards are absolutely positioned inside a fixed
   box, and an observer watching them individually can miss the ones that are
   only ever a few pixels into view — which leaves the deck permanently
   invisible. */
const deal = {
  dealt: { opacity: 0, y: 70, scale: 0.96 },
  held: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, delay: index * 0.07, ease: EASE },
  }),
};

/**
 * The platform, drawn as a deck of cards.
 *
 * John's professional life is six reachable rooms, and a stack says something a
 * grid cannot: they are the same hand of cards, dealt from one place, and you
 * choose which one is face up. The front card carries the content and the links;
 * the slivers behind it carry their number and name, so the deck is legible as a
 * whole before you touch it.
 */
export default function EcosystemSection() {
  const { scrollTo } = useScrollTo();
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");

  const [front, setFront] = useState(0);
  const lastHover = useRef<{ x: number; y: number } | null>(null);
  const focus = PILLARS[front];

  /** Rotating the array is what makes the fan read as depth: the card in front
   *  is always index `front`, and everything else is measured from there. */
  const positionOf = (index: number) => (index - front + COUNT) % COUNT;

  /**
   * Hovering promotes a card, and this is the part that decides whether the deck
   * feels alive or broken.
   *
   * Promoting re-anchors the fan, so the sliver that was under the cursor is
   * replaced by the one behind it — still under the cursor. A deck that
   * promotes on every hover therefore walks itself forward, one card at a time,
   * for as long as the pointer rests. The distance guard is what stops it: a
   * pointer that has not actually moved is not making a new choice, however many
   * slivers slide beneath it. Leaving the deck re-arms it, so the next sweep in
   * always counts.
   */
  const promote = (index: number, at: { clientX: number; clientY: number }) => {
    const previous = lastHover.current;
    if (previous && Math.hypot(at.clientX - previous.x, at.clientY - previous.y) < 16) return;
    lastHover.current = { x: at.clientX, y: at.clientY };
    setFront(index);
  };

  const step = (delta: number) => setFront((f) => (f + delta + COUNT) % COUNT);

  return (
    <section id="ecosystem" className="relative overflow-hidden bg-ink">
      {/* ---- the lamp header: the sign over the platform ---- */}
      <LampContainer className="min-h-[32rem] md:min-h-[38rem]">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <SectionTag index="01" label={ecosystem.kicker} />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
            <h2
              className="font-display leading-[0.96] tracking-[-0.02em] text-paper"
              style={{ fontSize: "clamp(2.4rem, 6.6vw, 6rem)" }}
            >
              {ecosystem.headline.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className={`block will-change-transform ${
                      i === 2 ? "italic text-bone/70" : ""
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

            <motion.p
              className="max-w-md text-sm leading-relaxed text-bone md:text-base"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              {ecosystem.intro}
            </motion.p>
          </div>
        </div>
      </LampContainer>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 py-20 md:px-10 md:py-28 lg:px-14">
        {/* ---- the six rooms, walked one at a time ----
            The panel holds the doors for whichever room is active, so this
            answers "what is actually in there" before the deck asks you to
            pick one. */}
        <div className="relative mx-auto max-w-4xl">
          <StickyScroll
            content={STICKY_CARDS}
            className="h-[30rem] rounded-none p-0 md:h-[34rem] md:p-6"
            contentClassName="h-64 w-full rounded-none border border-line p-6 md:h-72"
          />
        </div>

        {/* the mark the deck is dealt from */}
        <motion.div
          className="relative mt-20 flex flex-col items-center text-center md:mt-24"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <OrbitField />
          <span className="relative font-mono text-[0.55rem] uppercase tracking-[0.42em] text-brass">
            {ecosystem.seal.overline}
          </span>
          <span
            className="relative mt-3 font-display leading-none tracking-tight text-paper"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
          >
            {ecosystem.seal.title}
          </span>
          <span className="relative mt-3 font-display text-lg italic text-bone/70">
            {ecosystem.seal.underline}
          </span>
        </motion.div>

        {/* ---- the deck ---- */}
        <div className="relative mt-14 md:mt-16">
          <motion.div
            className="relative mx-auto w-full max-w-3xl"
            style={{ height: wide ? "38.5rem" : "35rem" }}
            onMouseLeave={() => {
              lastHover.current = null;
            }}
            initial="dealt"
            whileInView="held"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="absolute inset-x-0 bottom-0">
              {PILLARS.map((pillar, index) => {
                const pos = positionOf(index);
                return (
                  <motion.div
                    key={pillar.key}
                    className="absolute inset-x-0 bottom-0"
                    style={{ zIndex: COUNT - pos }}
                    variants={deal}
                    custom={index}
                  >
                    {/* The lift lives on its own element, not on the card. The
                        card has to be `inert` so nothing behind the front one is
                        focusable or clickable — and `inert` also swallows the
                        pointer, so the hover target is this sibling, which
                        carries the same transform and therefore sits exactly on
                        the sliver the reader can see. */}
                    <motion.div
                      className="absolute inset-x-0 bottom-0 origin-bottom"
                      animate={
                        reduced
                          ? { y: 0, scale: 1, rotate: 0 }
                          : {
                              y: -pos * PEEK,
                              scale: 1 - pos * SCALE_STEP,
                              rotate: pos * -0.22,
                            }
                      }
                      transition={reduced ? { duration: 0 } : SPRING}
                    >
                      {pos === 0 ? null : (
                        <div
                          aria-hidden="true"
                          onMouseEnter={(event) => !reduced && promote(index, event)}
                          className="absolute inset-x-0 top-0 h-6"
                        />
                      )}

                      <motion.article
                        className="relative flex w-full flex-col overflow-hidden border border-line bg-coal/80 backdrop-blur-[2px]"
                        style={{ height: wide ? "30rem" : "27rem" }}
                        animate={
                          reduced
                            ? { opacity: pos === 0 ? 1 : 0 }
                            : {
                                opacity:
                                  pos === 0 ? 1 : Math.max(0.3, 1 - pos * 0.17),
                                filter:
                                  pos === 0
                                    ? "brightness(1)"
                                    : `brightness(${Math.max(0.42, 1 - pos * 0.13)})`,
                              }
                        }
                        transition={reduced ? { duration: 0 } : SPRING}
                        aria-hidden={pos !== 0}
                        inert={pos !== 0}
                      >
                        {pos === 0 ? (
                          <FrontCard
                            pillar={pillar}
                            onNavigate={(href) => {
                              if (href.startsWith("#")) scrollTo(href);
                            }}
                          />
                        ) : (
                          <BackCard pillar={pillar} />
                        )}
                      </motion.article>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* the deck's own controls: count, ticks, arrows */}
          <div className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-brass">
                {String(front + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
                / {String(COUNT).padStart(2, "0")}
              </span>
              <span className="ml-2 font-display text-lg tracking-tight text-bone">
                {focus.title}
              </span>
            </p>

            <div className="flex items-center gap-6">
              <ul className="flex items-center gap-2">
                {PILLARS.map((pillar, index) => {
                  const on = index === front;
                  return (
                    <li key={pillar.key}>
                      <button
                        type="button"
                        onClick={() => setFront(index)}
                        aria-label={`${pillar.title} — ${pillar.line}`}
                        aria-current={on}
                        data-cursor="link"
                        className={`block h-6 w-5 py-2.5 ${on ? "w-9" : ""}`}
                      >
                        <span
                          className={`block h-px w-full transition-colors duration-500 ${
                            on ? "bg-brass" : "bg-line hover:bg-bone/50"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-2">
                <DeckButton label="Previous" onClick={() => step(-1)} flip />
                <DeckButton label="Next" onClick={() => step(1)} />
              </div>
            </div>
          </div>

          {/* the plate answers to whichever card is face up */}
          <div className="mx-auto mt-8 min-h-[3.5rem] w-full max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={focus.key}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="text-sm leading-relaxed text-bone/85 md:text-base"
              >
                {focus.line}
              </motion.p>
            </AnimatePresence>
            <p className="sr-only" aria-live="polite">
              {focus.title}. {focus.line}
            </p>
          </div>
        </div>

        <motion.p
          className="mt-14 flex max-w-3xl items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute md:mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
          {ecosystem.note}
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** The sticky panel's payload: one room's number, name and doors. */
function PillarDoors({ pillar }: { pillar: Pillar }) {
  return (
    <div className="flex h-full flex-col">
      <span className="font-mono text-[0.55rem] tracking-[0.3em] text-brass-bright">
        {pillar.no}
      </span>
      <h4 className="mt-3 font-display text-2xl leading-none tracking-tight text-paper">
        {pillar.title}
      </h4>
      <ul className="mt-5 flex flex-col gap-2.5">
        {pillar.children.map((child) => (
          <li key={`${pillar.key}-${child.href}-${child.label}`}>
            <Link
              href={child.href}
              data-cursor="link"
              className="group/door flex items-baseline gap-3 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-bone/85 transition-colors duration-300 hover:text-brass-bright"
            >
              <span className="h-px w-3 shrink-0 bg-line transition-all duration-300 group-hover/door:w-6 group-hover/door:bg-brass" />
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
      <span className="mt-auto pt-5 font-mono text-[0.48rem] uppercase tracking-[0.24em] text-mute">
        {pillar.children.length} doors
      </span>
    </div>
  );
}

function FrontCard({
  pillar,
  onNavigate,
}: {
  pillar: Pillar;
  onNavigate: (href: string) => void;
}) {
  return (
    <div className="flex h-full flex-col p-6 md:p-9">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.58rem] tracking-[0.3em] text-brass">
          {pillar.no}
        </span>
        <span className="h-px flex-1 bg-line" />
        {pillar.source === "demo" ? (
          <span className="font-mono text-[0.48rem] uppercase tracking-[0.22em] text-mute">
            Structure
          </span>
        ) : null}
      </div>

      <h3
        className="mt-6 font-display leading-[0.94] tracking-[-0.02em] text-paper md:mt-8"
        style={{ fontSize: "clamp(2.1rem, 5.2vw, 3.6rem)" }}
      >
        {pillar.title}
      </h3>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/85">{pillar.line}</p>

      <ul className="mt-auto flex flex-col gap-1 pt-8">
        {pillar.children.map((child) => {
          const cls =
            "group/link flex items-baseline gap-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute transition-colors duration-300 hover:text-brass-bright";
          const glyph = (
            <>
              <span className="h-px w-3 shrink-0 bg-line transition-all duration-300 group-hover/link:w-6 group-hover/link:bg-brass" />
              {child.label}
            </>
          );
          return (
            <li key={`${pillar.key}-${child.href}-${child.label}`}>
              {child.href.startsWith("#") ? (
                <button type="button" onClick={() => onNavigate(child.href)} className={cls} data-cursor="link">
                  {glyph}
                </button>
              ) : (
                <Link href={child.href} className={cls} data-cursor="link">
                  {glyph}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex items-end justify-between gap-6 border-t border-line pt-5">
        <span className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-mute">
          {pillar.children.length} doors
        </span>
        <Link
          href={pillar.href}
          data-cursor="link"
          className="group flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone transition-colors hover:text-brass-bright"
        >
          Enter
          <span className="relative block h-6 w-6 overflow-hidden border border-line transition-colors group-hover:border-brass/60">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full">
              →
            </span>
            <span className="absolute inset-0 flex -translate-x-full items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0">
              →
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

/* Only the header sliver of a card behind the front one is ever visible, so
   that sliver carries the name — it is what makes the deck readable at a glance
   before anyone clicks it. */
function BackCard({ pillar }: { pillar: Pillar }) {
  return (
    <div className="flex h-5 items-center gap-3 px-6 md:px-9">
      <span className="font-mono text-[0.5rem] tracking-[0.3em] text-brass/70">
        {pillar.no}
      </span>
      <span className="h-px w-4 bg-line" />
      <span className="truncate font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
        {pillar.title}
      </span>
      <span className="ml-auto hidden font-mono text-[0.48rem] uppercase tracking-[0.24em] text-mute/70 md:block">
        {pillar.source === "demo" ? "Structure" : "Documented"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DeckButton({
  label,
  onClick,
  flip = false,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor="link"
      className="group flex h-10 w-10 items-center justify-center border border-line text-bone transition-colors hover:border-brass/60 hover:text-brass-bright"
    >
      <span
        aria-hidden
        className={`text-sm leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 ${
          flip ? "rotate-180" : ""
        }`}
      >
        →
      </span>
    </button>
  );
}

/** One dashed ring behind the masthead, drifting slowly. Decorative only. */
function OrbitField() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[24rem] max-w-[150%] -translate-x-1/2 -translate-y-1/2 lg:w-[34rem]"
      aria-hidden
    >
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(188,138,76,0.16)"
          strokeWidth="0.7"
          strokeDasharray="2 7"
          className="motion-safe:animate-[drift_120s_linear_infinite] origin-center"
        />
        <circle
          cx="200"
          cy="200"
          r="196"
          fill="none"
          stroke="rgba(236,230,218,0.08)"
          strokeWidth="0.7"
          strokeDasharray="1 11"
          className="motion-safe:animate-[drift_200s_linear_infinite_reverse] origin-center"
        />
      </svg>
    </div>
  );
}
