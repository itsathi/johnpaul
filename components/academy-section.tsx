"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MediaReveal from "./ui/media-reveal";
import MagneticButton from "./ui/magnetic-button";
import { useScrollTo, NAVIGATE_EVENT } from "./smooth-scroll";
import { academy, type AcademyItem, type AcademyTrack } from "@/content/platform";
import { media } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const EMAIL = "johnpaulstudio1@gmail.com";

/** Clears the fixed header when an anchor is targeted. */
const HEADER_OFFSET = -72;

function enquiry(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/**
 * The Academy — teaching treated as a real business rather than a line in a
 * services list.
 *
 * `Making Tones` is the documented teaching credit and is presented as the
 * anchor. Everything around it is deliberately structure: lesson formats,
 * class subjects and membership shapes are demonstrated, while duration,
 * schedule, seats and fee render as "To be confirmed" because the client has
 * not supplied them. Enquiry links go to a real mailbox rather than a booking
 * form, so nothing here pretends to a system that does not exist.
 */
export default function AcademySection() {
  const { scrollTo } = useScrollTo();
  const [active, setActive] = useState(academy.tracks[0].key);

  const track: AcademyTrack =
    academy.tracks.find((t) => t.key === active) ?? academy.tracks[0];

  const goToTrack = useCallback(
    (key: string) => {
      const found = academy.tracks.find((t) => t.key === key);
      if (!found) return;
      setActive(key);
      scrollTo(`#${found.anchorId}`, HEADER_OFFSET);
    },
    [scrollTo],
  );

  /* Deep links such as #academy-classes should open the right track, whether the
     hash arrived from the URL bar, a history replace, or another section's
     in-page link. */
  useEffect(() => {
    const open = (anchorId: string) => {
      const hit = academy.tracks.find((t) => t.anchorId === anchorId);
      if (hit) setActive(hit.key);
    };

    const sync = () => open(window.location.hash.replace("#", ""));
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.startsWith("#")) {
        open(detail.slice(1));
      }
    };

    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener(NAVIGATE_EVENT, onNavigate);
    };
  }, []);

  /* Arrow keys walk the rail, as the tablist pattern expects, and focus follows
     the selection so a single Tab stop enters the group. */
  const onRailKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();

      const i = academy.tracks.findIndex((t) => t.key === active);
      const last = academy.tracks.length - 1;
      const next =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? last
            : (i + (e.key === "ArrowRight" ? 1 : -1) + academy.tracks.length) %
              academy.tracks.length;

      const target = academy.tracks[next];
      setActive(target.key);
      document.getElementById(`tab-${target.anchorId}`)?.focus();
    },
    [active],
  );

  return (
    <section id="academy" className="relative bg-ink py-28 md:py-40">
      {/* giant watermark, clipped here so the sticky tab rail keeps working */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-x-0 top-[0.1em] select-none text-center font-display leading-none text-outline opacity-[0.07]"
          style={{ fontSize: "clamp(5rem, 20vw, 22rem)" }}
        >
          Academy
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="14" label={academy.kicker} />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
          <h2
            className="font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.6rem, 7vw, 6.4rem)" }}
          >
            {academy.headline.map((line, i) => (
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

          <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
            {academy.intro}
          </p>
        </div>

        {/* ---- the documented anchor ---- */}
        <div className="mt-16 grid gap-8 border-y border-line py-12 md:mt-24 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:py-16">
          <MediaReveal
            src={media.daddario}
            alt="Strings and folk instruments from the Making Tones workshop series"
            wixWidth={1000}
            wixHeight={1250}
            ratio="aspect-[4/5]"
            sizes="(max-width: 768px) 92vw, 40vw"
            caption="Making Tones — workshop series"
          />

          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-brass">
                {academy.anchor.label}
              </span>
              <span className="h-px w-8 bg-line" />
            </div>

            <h3
              className="mt-5 font-display leading-none tracking-tight text-paper"
              style={{ fontSize: "clamp(2.2rem, 4.6vw, 4.2rem)" }}
            >
              {academy.anchor.title}
            </h3>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-bone md:text-base">
              {academy.anchor.body}
            </p>

            <p className="mt-8 flex items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
              <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
              The rest of the academy — one-to-one lessons, small classes and
              ongoing access — is shown below as structure, ready for the
              detail only John can set.
            </p>
          </div>
        </div>

        {/*
          Anchor targets live here rather than on the tab buttons: the rail
          below is sticky, and a stuck element's bounding box stops being a
          reliable scroll target. Zero-height spans in normal flow always are.
        */}
        {academy.tracks.map((t) => (
          <span key={t.anchorId} id={t.anchorId} className="block h-0" aria-hidden />
        ))}

        {/* ---- track rail (sticky so a long track stays navigable) ---- */}
        <div
          className="sticky top-16 z-30 -mx-6 border-b border-line bg-ink/92 px-6 backdrop-blur-md md:top-[4.5rem] md:-mx-10 md:px-10 lg:-mx-14 lg:px-14"
        >
          <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div
              role="tablist"
              aria-label="Academy tracks"
              className="-mx-2 flex snap-x snap-mandatory gap-1 overflow-x-auto px-2 md:mx-0 md:px-0 md:overflow-visible"
              onKeyDown={onRailKeyDown}
            >
              {academy.tracks.map((t) => {
                const isOn = t.key === active;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    id={`tab-${t.anchorId}`}
                    aria-selected={isOn}
                    aria-controls={`panel-${t.anchorId}`}
                    tabIndex={isOn ? 0 : -1}
                    onClick={() => setActive(t.key)}
                    data-cursor="link"
                    className={`relative shrink-0 snap-start px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] transition-colors duration-300 ${
                      isOn ? "text-brass-bright" : "text-mute hover:text-bone"
                    }`}
                  >
                    <span className="mr-2 text-brass/60">{t.no}</span>
                    {t.title}
                    {isOn ? (
                      <motion.span
                        layoutId="academy-underline"
                        className="absolute inset-x-3 -bottom-px h-px bg-brass"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <p className="hidden max-w-sm shrink-0 font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.22em] text-mute lg:block">
              {track.intro}
            </p>
          </div>
        </div>

        {/* ---- the active track ---- */}
        <motion.div
          key={track.key}
          id={`panel-${track.anchorId}`}
          role="tabpanel"
          aria-labelledby={`tab-${track.anchorId}`}
          tabIndex={0}
          className="mt-12 grid gap-5 focus-visible:outline-none md:mt-16 lg:grid-cols-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {track.items.map((item, i) => (
            <AcademyCard
              key={`${track.key}-${item.no}`}
              item={item}
              index={i}
              onEnquire={() => scrollTo("#contact")}
            />
          ))}
        </motion.div>

        {/* ---- CTAs ---- */}
        <div className="mt-14 flex flex-wrap items-center gap-4 md:mt-20">
          {academy.ctas.map((c) =>
            c.primary ? (
              <MagneticButton
                key={c.label}
                strength={0.4}
                onClick={() => goToTrack("lessons")}
                ariaLabel={`${c.label} — jump to private lessons`}
                className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-ink"
              >
                <span
                  className="px-8 py-4"
                  style={{ background: "linear-gradient(120deg, #dcac73, #c08b4c)" }}
                >
                  {c.label}
                </span>
              </MagneticButton>
            ) : (
              <button
                key={c.label}
                type="button"
                onClick={() => goToTrack(c.href.replace("#academy-", ""))}
                data-cursor="link"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-paper/30 px-7 py-4 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper transition-colors hover:border-brass hover:text-brass-bright"
              >
                {c.label}
                <Arrow />
              </button>
            ),
          )}
        </div>

        {/* ---- intended platform path ---- */}
        <div className="mt-24 border-t border-line pt-14 md:mt-32 md:pt-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h3
              className="font-display leading-none tracking-tight text-paper"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)" }}
            >
              How a place in the academy works
            </h3>
            <p className="max-w-sm font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.22em] text-mute">
              The intended journey, from first visit to a session on the
              calendar.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line md:mt-14 md:grid-cols-3 lg:grid-cols-6">
            {academy.flow.map((step) => (
              <li
                key={step.no}
                className="group relative bg-ink p-5 transition-colors duration-500 hover:bg-smoke md:p-6"
              >
                <span className="font-mono text-[0.55rem] tracking-[0.3em] text-brass">
                  {step.no}
                </span>
                <p className="mt-3 font-display text-lg leading-tight tracking-tight text-paper">
                  {step.title}
                </p>
                <p className="mt-1.5 font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.18em] text-mute">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-6 flex max-w-3xl items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
            <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
            {academy.flowNote}
          </p>
        </div>

        <p className="mt-14 max-w-3xl border-t border-line pt-8 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
          {academy.note}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function AcademyCard({
  item,
  index,
  onEnquire,
}: {
  item: AcademyItem;
  index: number;
  onEnquire: () => void;
}) {
  return (
    <motion.article
      className="group relative flex flex-col border border-line bg-coal/60 p-7 transition-colors duration-500 hover:border-brass/45 hover:bg-coal md:p-9"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: EASE }}
    >
      <span className="absolute -top-px left-0 h-px w-12 bg-brass/70 transition-all duration-500 group-hover:w-full" />

      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
          {item.no}
        </span>
        {item.source === "demo" ? (
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.22em] text-mute">
            To be confirmed
          </span>
        ) : null}
      </div>

      <h4
        className="mt-4 font-display leading-none tracking-tight text-paper"
        style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)" }}
      >
        {item.title}
      </h4>

      <p className="mt-4 text-sm leading-relaxed text-bone">{item.body}</p>

      <dl className="mt-7 flex flex-col border-t border-line">
        {item.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3"
          >
            <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
              {spec.label}
            </dt>
            <dd
              className={`text-right font-mono text-[0.6rem] uppercase tracking-[0.18em] ${
                spec.value ? "text-bone" : "italic text-mute/70"
              }`}
            >
              {spec.value ?? "To be confirmed"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-4 pt-1">
        <MagneticButton
          as="a"
          href={enquiry(`Academy — ${item.title}`)}
          strength={0.28}
          className="group/btn inline-flex min-h-12 items-center gap-3 rounded-full border border-paper/30 px-6 py-3 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-paper transition-colors hover:border-brass hover:text-brass-bright"
          ariaLabel={`${item.cta} — opens your email client`}
        >
          {item.cta}
          <Arrow />
        </MagneticButton>

        <button
          type="button"
          onClick={onEnquire}
          data-cursor="link"
          className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-mute underline decoration-line underline-offset-4 transition-colors hover:text-bone"
        >
          Or contact John
        </button>
      </div>
    </motion.article>
  );
}

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      aria-hidden
      className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
    >
      <path
        d="M3 11 L11 3 M4 3 H11 V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
