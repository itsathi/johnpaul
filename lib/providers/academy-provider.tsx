"use client";

/**
 * Academy provider — enrolments, lesson progress and the student view.
 *
 * ── DEMO ────────────────────────────────────────────────────────────────────
 * `completedLessons` starts empty and `enrol()` records an intent locally. No
 * enrolment exists and no payment is taken. The student surface says so.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Mirrors the shape an LMS webhook would eventually feed: a list of enrolments
 * keyed by class slug, and per-lesson completion. The whole document lives in
 * `localStorage` through `usePersistedState`, so there is no load-on-mount
 * effect that would disagree with the server render.
 */

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistedState } from "@/lib/persisted-store";

export type Enrolment = {
  slug: string;
  title: string;
  track: string;
  status: "Active" | "Waitlist" | "Paused";
  enrolledAt: string;
};

type AcademyContextValue = {
  enrolments: Enrolment[];
  /** Lesson ids the visitor has ticked off locally. */
  completedLessons: string[];
  toggleLesson: (id: string) => void;
  enrol: (slug: string, title: string, track: string) => void;
  isEnrolled: (slug: string) => boolean;
  reset: () => void;
  /** `true` once anything has been recorded in this browser. */
  hasActivity: boolean;
};

type AcademyDocument = {
  enrolments: Enrolment[];
  completedLessons: string[];
};

const AcademyContext = createContext<AcademyContextValue | null>(null);
const STORAGE_KEY = "jpacademy.v1";
const EMPTY: AcademyDocument = { enrolments: [], completedLessons: [] };

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [document, setDocument] = usePersistedState<AcademyDocument>(STORAGE_KEY, EMPTY);

  const enrolments = Array.isArray(document.enrolments) ? document.enrolments : EMPTY.enrolments;
  const completedLessons = Array.isArray(document.completedLessons)
    ? document.completedLessons
    : EMPTY.completedLessons;

  const enrol = useCallback(
    (slug: string, title: string, track: string) => {
      setDocument((previous) => {
        const current = Array.isArray(previous.enrolments) ? previous.enrolments : [];
        if (current.some((e) => e.slug === slug)) return previous;
        return {
          ...previous,
          enrolments: [
            ...current,
            {
              slug,
              title,
              track,
              status: "Waitlist",
              enrolledAt: new Date().toISOString(),
            },
          ],
        };
      });
    },
    [setDocument],
  );

  const toggleLesson = useCallback(
    (id: string) => {
      setDocument((previous) => {
        const current = Array.isArray(previous.completedLessons) ? previous.completedLessons : [];
        return {
          ...previous,
          completedLessons: current.includes(id)
            ? current.filter((l) => l !== id)
            : [...current, id],
        };
      });
    },
    [setDocument],
  );

  const reset = useCallback(() => setDocument(() => EMPTY), [setDocument]);

  const value = useMemo<AcademyContextValue>(
    () => ({
      enrolments,
      completedLessons,
      toggleLesson,
      enrol,
      isEnrolled: (slug: string) => enrolments.some((e) => e.slug === slug),
      reset,
      hasActivity: enrolments.length > 0 || completedLessons.length > 0,
    }),
    [enrolments, completedLessons, enrol, toggleLesson, reset],
  );

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy(): AcademyContextValue {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error("useAcademy must be used inside <AcademyProvider>");
  return ctx;
}
