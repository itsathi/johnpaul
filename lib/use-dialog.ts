"use client";

/**
 * The modal contract, once.
 *
 * Three overlays in this build need the same four behaviours — Escape closes,
 * Tab stays inside, focus moves in on open and comes back on close, and the
 * page behind stops scrolling — and each of them had a different, partly
 * broken version of it:
 *
 *   cart drawer    Escape + trap + focus restore, but locked scroll the wrong
 *                  way (Lenis drove the wheel straight past it)
 *   gallery        locked scroll the wrong way, and announced
 *                  `aria-modal="true"` while trapping nothing — so Tab walked
 *                  out of the dialog and into the page behind it
 *   mobile nav     no Escape at all (the handler was gated on the desktop
 *                  disclosure state), no `aria-modal`, no trap, no restore
 *
 * So the contract lives here. Each overlay supplies its panel ref and its close
 * function and gets the rest.
 *
 * On focus: the panel is focused rather than its first control. Announcing the
 * dialog's own `aria-label` is what a screen-reader user needs first; dropping
 * them straight onto a close button is worse, and it hides the dialog name.
 */

import { useEffect, useRef, type RefObject } from "react";
import { useScrollLock } from "@/components/smooth-scroll";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * @param open    whether the dialog is showing
 * @param onClose called on Escape — the overlay owns whether that is possible
 * @param panelRef ref to the dialog element
 */
export function useDialog<T extends HTMLElement = HTMLElement>(
  open: boolean,
  onClose: () => void,
  panelRef: RefObject<T | null>,
) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const restoreTo = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    // Focus the dialog itself first, so its label is announced before any
    // control inside it. `tabIndex={-1}` is the overlay's job, not this hook's.
    panel?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
      // A dialog with nothing focusable in it should not swallow Tab — there is
      // nothing to move to and trapping would strand the user entirely.
      if (!focusables?.length) {
        event.preventDefault();
        panel?.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!panel?.contains(active)) {
        // Focus escaped the dialog somehow (a click on the backdrop, or a
        // route change). Pull it back rather than leaving it in the page.
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      // Only restore if the thing that had focus is still in the document —
      // otherwise focus would be sent to a detached node.
      if (restoreTo && document.contains(restoreTo)) {
        restoreTo.focus({ preventScroll: true });
      }
    };
  }, [onClose, open, panelRef]);
}

/** Convenience: a ref that a `useDialog` call can be pointed at. */
export function useDialogRef<T extends HTMLElement = HTMLElement>() {
  return useRef<T | null>(null);
}
