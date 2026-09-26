"use client";

/**
 * Booking provider — shared draft state for `/sessions/book` and
 * `/academy/lessons`, so a session enquiry and a lesson enquiry go through
 * one system.
 *
 * ── DEMO ────────────────────────────────────────────────────────────────────
 * `submit()` resolves without sending anything. The confirmation screen says so
 * explicitly. In production this is the single `POST` that replaces the
 * timeout, and `reference` becomes the studio's real enquiry id.
 * ───────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { BookingStepKey } from "@/content/booking";

export type BookingDraft = {
  service: string | null;
  /** Free-text project description. */
  brief: string;
  instruments: string[];
  location: string | null;
  date: string | null;
  duration: string | null;
  time: string | null;
  investment: string | null;
  budget: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
  consent: boolean;
};

const emptyDraft: BookingDraft = {
  service: null,
  brief: "",
  instruments: [],
  location: null,
  date: null,
  duration: null,
  time: null,
  investment: null,
  budget: "",
  name: "",
  email: "",
  phone: "",
  city: "",
  notes: "",
  consent: false,
};

type State = {
  step: number;
  draft: BookingDraft;
  /** `null` until `submit()` resolves. */
  reference: string | null;
  submitting: boolean;
  /** Per-step errors, keyed by field. */
  errors: Partial<Record<keyof BookingDraft | "step", string>>;
};

type Action =
  | { type: "goTo"; step: number }
  | { type: "next" }
  | { type: "back" }
  | { type: "set"; field: keyof BookingDraft; value: string | string[] | boolean | null }
  | { type: "toggleInstrument"; value: string }
  | { type: "submitting" }
  | { type: "submitted"; reference: string }
  | { type: "error"; field: keyof BookingDraft | "step"; message: string }
  | { type: "reset" };

const initialState: State = {
  step: 0,
  draft: emptyDraft,
  reference: null,
  submitting: false,
  errors: {},
};

/** Which fields each step requires, so validation lives in one place. */
const required: Record<BookingStepKey, (keyof BookingDraft)[]> = {
  service: ["service"],
  details: ["brief"],
  schedule: ["location"],
  budget: [],
  contact: ["name", "email", "consent"],
  review: [],
};

const stepKeys: BookingStepKey[] = [
  "service",
  "details",
  "schedule",
  "budget",
  "contact",
  "review",
];

function validate(step: BookingStepKey, draft: BookingDraft): Partial<Record<keyof BookingDraft, string>> {
  const errors: Partial<Record<keyof BookingDraft, string>> = {};
  for (const field of required[step]) {
    const value = draft[field];
    const empty =
      value === null || value === "" || (Array.isArray(value) && value.length === 0) || value === false;
    if (!empty) continue;
    if (field === "email") errors.email = "An email address is required so the studio can reply.";
    else if (field === "consent") errors.consent = "Please confirm you are happy to be contacted.";
    else if (field === "service") errors.service = "Choose a service to continue.";
    else if (field === "brief") errors.brief = "A line or two is enough — what are you working on?";
    else errors[field] = "This field is required.";
  }
  if (step === "contact" && draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
    errors.email = "That email address looks incomplete.";
  }
  return errors;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "goTo":
      return { ...state, step: Math.max(0, Math.min(stepKeys.length - 1, action.step)), errors: {} };
    case "next": {
      const key = stepKeys[state.step];
      const errors = validate(key, state.draft);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return { ...state, step: Math.min(stepKeys.length - 1, state.step + 1), errors: {} };
    }
    case "back":
      return { ...state, step: Math.max(0, state.step - 1), errors: {} };
    case "set":
      return { ...state, draft: { ...state.draft, [action.field]: action.value }, errors: {} };
    case "toggleInstrument": {
      const has = state.draft.instruments.includes(action.value);
      return {
        ...state,
        draft: {
          ...state.draft,
          instruments: has
            ? state.draft.instruments.filter((i) => i !== action.value)
            : [...state.draft.instruments, action.value],
        },
      };
    }
    case "submitting":
      return { ...state, submitting: true };
    case "submitted":
      return { ...state, submitting: false, reference: action.reference };
    case "error":
      return { ...state, errors: { ...state.errors, [action.field]: action.message }, submitting: false };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

type BookingContextValue = {
  step: number;
  stepKey: BookingStepKey;
  steps: typeof stepKeys;
  total: number;
  draft: BookingDraft;
  reference: string | null;
  submitting: boolean;
  errors: State["errors"];
  isFirst: boolean;
  isLast: boolean;
  /** Fraction complete, for the progress rail. */
  progress: number;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  set: (field: keyof BookingDraft, value: string | string[] | boolean | null) => void;
  toggleInstrument: (value: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const submit = useCallback(async () => {
    dispatch({ type: "submitting" });
    // No network call in the demo. A real integration posts the draft here and
    // returns the studio's enquiry id.
    await new Promise((resolve) => setTimeout(resolve, 700));
    const ref = `DEMO-${String(state.draft.name || "GUEST").slice(0, 3).toUpperCase()}-${Date.now()
      .toString(36)
      .slice(-4)
      .toUpperCase()}`;
    dispatch({ type: "submitted", reference: ref });
  }, [state.draft.name]);

  const value = useMemo<BookingContextValue>(() => {
    const key = stepKeys[state.step];
    return {
      step: state.step,
      stepKey: key,
      steps: stepKeys,
      total: stepKeys.length,
      draft: state.draft,
      reference: state.reference,
      submitting: state.submitting,
      errors: state.errors,
      isFirst: state.step === 0,
      isLast: state.step === stepKeys.length - 1,
      progress: (state.step + 1) / stepKeys.length,
      goTo: (step: number) => dispatch({ type: "goTo", step }),
      next: () => dispatch({ type: "next" }),
      back: () => dispatch({ type: "back" }),
      set: (field, value) => dispatch({ type: "set", field, value }),
      toggleInstrument: (value: string) => dispatch({ type: "toggleInstrument", value }),
      submit,
      reset: () => dispatch({ type: "reset" }),
    };
  }, [state, submit]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
