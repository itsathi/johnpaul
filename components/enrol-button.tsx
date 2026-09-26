"use client";

/**
 * Enrolment interest — records a local intent via `AcademyProvider`.
 *
 * No enrolment is created and no payment is taken. The button says exactly
 * that once pressed, because a control that looks like a purchase and isn't
 * is the fastest way to lose someone's trust.
 */

import { useState } from "react";
import { useAcademy } from "@/lib/providers/academy-provider";

export default function EnrolButton({
  slug,
  title,
  track,
  label = "Enrol",
  primary = false,
}: {
  slug: string;
  title: string;
  track: string;
  label?: string;
  primary?: boolean;
}) {
  const { enrol, isEnrolled } = useAcademy();
  const [justEnrolled, setJustEnrolled] = useState(false);
  const enrolled = isEnrolled(slug) || justEnrolled;

  if (enrolled) {
    return (
      <p
        role="status"
        className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone"
      >
        <span aria-hidden className="text-brass">
          ✓
        </span>
        Interest recorded
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        enrol(slug, title, track);
        setJustEnrolled(true);
      }}
      aria-label={`${label} — demonstration only, nothing is booked or charged`}
      className={
        primary
          ? "inline-flex items-center gap-2 border border-brass/60 bg-brass/10 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
          : "inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-brass/50 hover:text-brass-bright"
      }
    >
      {label}
    </button>
  );
}
