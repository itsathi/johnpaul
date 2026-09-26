"use client";

/**
 * PageHero — the shared cinematic opening for every route.
 *
 * One gesture, twenty routes: full-bleed media, a warm light, a dot-plate that
 * echoes the homepage halftone (CSS, not WebGL — the shader stays exclusive to
 * the hero so it keeps its weight), a mono eyebrow, a display headline whose
 * final line drops to italic, then the standfirst and a meta row.
 *
 * Variation between pages comes from `media`, `meta` and `align` rather than
 * from restructuring, which is what keeps 20 routes reading as one universe
 * without any of them looking like the same template.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Media from "./media";
import { EASE } from "./reveal";

export type HeroAction = {
  label: string;
  href: string;
  variant?: "brass" | "ghost" | "quiet";
  external?: boolean;
};

type Meta = { label: string; value: string | null };

export default function PageHero({
  index,
  eyebrow,
  headline,
  intro,
  media,
  meta,
  actions = [],
  align = "left",
  children,
  compact = false,
}: {
  index?: string;
  eyebrow: string;
  headline: string[];
  intro?: string;
  media?: { src: string; alt: string; wixWidth?: number };
  meta?: Meta[];
  actions?: HeroAction[];
  align?: "left" | "center";
  children?: React.ReactNode;
  compact?: boolean;
}) {
  const isReduced = useReducedMotion();
  const centred = align === "center";

  return (
    <header
      className={`relative isolate overflow-hidden bg-ink ${
        compact ? "pt-36 pb-16 md:pt-44 md:pb-20" : "pt-40 pb-20 md:pt-56 md:pb-28"
      }`}
    >
      {media ? (
        <div className="absolute inset-0 -z-10">
          <Media
            src={media.src}
            alt={media.alt}
            wixWidth={1900}
            className="h-full w-full object-cover opacity-[0.5]"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,9,8,0.96) 0%, rgba(10,9,8,0.82) 46%, rgba(10,9,8,0.55) 100%)",
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 100% at 78% 8%, #241d15 0%, #0f0d0b 52%, #070605 100%)",
          }}
        />
      )}

      {/* dot-plate — the halftone language, rendered in CSS */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(236,230,218,0.9) 0.7px, transparent 0.8px)",
          backgroundSize: "5px 5px",
          maskImage: "radial-gradient(90% 80% at 70% 25%, #000 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(90% 80% at 70% 25%, #000 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full opacity-45 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(188,138,76,0.5) 0%, transparent 68%)" }}
      />

      <div
        className={`mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14 ${
          centred ? "text-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute ${
            centred ? "justify-center" : ""
          }`}
        >
          {index ? <span className="text-brass">{index}</span> : null}
          <span className="h-px w-8 bg-line" />
          <span>{eyebrow}</span>
        </div>

        <h1
          className={`mt-8 font-display leading-[0.94] tracking-[-0.025em] text-paper ${
            centred ? "mx-auto max-w-5xl" : "max-w-4xl"
          }`}
          style={{ fontSize: "clamp(2.7rem, 7.4vw, 6.6rem)" }}
        >
          {headline.map((line, i) => {
            const isLast = i === headline.length - 1;
            return (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block will-change-transform ${
                    isLast ? "italic text-bone/75" : ""
                  }`}
                  initial={isReduced ? false : { y: "110%" }}
                  animate={isReduced ? undefined : { y: "0%" }}
                  transition={{
                    duration: 1.15,
                    delay: 0.1 + i * 0.1,
                    ease: EASE,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            );
          })}
        </h1>

        {intro ? (
          <motion.p
            className={`mt-8 max-w-2xl text-sm leading-relaxed text-bone md:text-base ${
              centred ? "mx-auto" : ""
            }`}
            initial={isReduced ? false : { opacity: 0, y: 20 }}
            animate={isReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          >
            {intro}
          </motion.p>
        ) : null}

        {meta?.length ? (
          <motion.dl
            className={`mt-12 flex flex-wrap gap-x-10 gap-y-6 ${
              centred ? "justify-center" : ""
            }`}
            initial={isReduced ? false : { opacity: 0, y: 18 }}
            animate={isReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          >
            {meta.map((m) => (
              <div key={m.label} className="max-w-[16rem]">
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-mute">
                  {m.label}
                </dt>
                <dd className="mt-2 text-sm text-paper">
                  {m.value ?? (
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                      To be confirmed
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        ) : null}

        {actions.length ? (
          <motion.div
            className={`mt-12 flex flex-wrap items-center gap-4 ${
              centred ? "justify-center" : ""
            }`}
            initial={isReduced ? false : { opacity: 0, y: 18 }}
            animate={isReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          >
            {actions.map((a) =>
              a.external ? (
                <a
                  key={a.label}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                >
                  {a.label}
                  <span aria-hidden>↗</span>
                </a>
              ) : (
                <Link
                  key={a.label}
                  href={a.href}
                  className={
                    a.variant === "ghost"
                      ? "inline-flex items-center gap-2 border border-line px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60 hover:text-brass-bright"
                      : a.variant === "quiet"
                        ? "inline-flex items-center gap-2 px-1 py-2 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:text-brass-bright"
                        : "inline-flex items-center gap-2 border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                  }
                >
                  {a.label}
                  {a.variant === "quiet" ? <span aria-hidden>→</span> : null}
                </Link>
              ),
            )}
          </motion.div>
        ) : null}

        {children ? <div className="mt-16">{children}</div> : null}
      </div>
    </header>
  );
}
