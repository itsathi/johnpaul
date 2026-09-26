import Link from "next/link";
import type { ReactNode } from "react";
import type { Source } from "@/content/platform";

/**
 * Shared atoms for the new routes.
 *
 * Small, server-renderable pieces that every content page needs: the
 * source marker, the spec table that renders `null` as "To be confirmed", the
 * route-aware CTA, and the page section wrapper.
 */

/** The documented / demo marker. Rendered wherever content could be mistaken
 *  for a published fact. `documented` reads as a quiet brass dot, `demo` as a
 *  bordered pill so a placeholder is never mistaken for a confirmation. */
export function SourceNote({
  source,
  label,
  className = "",
}: {
  source: Source;
  label?: string;
  className?: string;
}) {
  if (source === "documented") {
    return (
      <span
        className={`inline-flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.26em] text-mute ${className}`}
      >
        <span aria-hidden className="h-1 w-1 rounded-full bg-brass" />
        {label ?? "Documented"}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 border border-line px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.24em] text-mute ${className}`}
    >
      {label ?? "To be confirmed"}
    </span>
  );
}

/** A value that may not be known yet. Never renders a blank cell. */
export function Pending({ value }: { value: string | null | undefined }) {
  if (value) return <>{value}</>;
  return (
    <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mute">
      To be confirmed
    </span>
  );
}

export function SpecTable({
  specs,
  columns = 2,
}: {
  specs: { label: string; value: string | null }[];
  columns?: 1 | 2 | 3;
}) {
  const cols = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
  }[columns];
  return (
    <dl className={`grid gap-x-8 gap-y-5 ${cols}`}>
      {specs.map((s) => (
        <div
          key={s.label}
          className="border-t border-line pt-4"
        >
          <dt className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-mute">
            {s.label}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-paper">
            <Pending value={s.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Full-width editorial section with the standard rhythm. */
export function Section({
  id,
  tone = "ink",
  children,
  className = "",
}: {
  id?: string;
  tone?: "ink" | "coal" | "smoke" | "paper";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    ink: "bg-ink",
    coal: "bg-coal",
    smoke: "bg-smoke",
    paper: "bg-paper text-ink",
  }[tone];
  return (
    <section id={id} className={`relative py-20 md:py-28 ${tones} ${className}`}>
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">{children}</div>
    </section>
  );
}

/** The standing row of text under a headline. */
export function Standfirst({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-2xl text-sm leading-relaxed text-bone md:text-base ${className}`}>
      {children}
    </p>
  );
}

/** A spec-style pair of headline lines, matching the section rhythm. */
export function SplitHeadline({
  lines,
  className = "",
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-display leading-[0.98] tracking-[-0.02em] text-paper ${className}`}
      style={{ fontSize: "clamp(1.9rem, 4.6vw, 3.6rem)" }}
    >
      {lines.map((line, i) => (
        <span
          key={line}
          className={`block ${i === lines.length - 1 ? "italic text-bone/70" : ""}`}
        >
          {line}
        </span>
      ))}
    </Tag>
  );
}

export function GhostLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:text-brass-bright ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

/** A "to be confirmed" callout used wherever a page is deliberately waiting. */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l border-brass/40 pl-4 font-mono text-[0.64rem] uppercase leading-[1.9] tracking-[0.16em] text-mute">
      {children}
    </p>
  );
}
