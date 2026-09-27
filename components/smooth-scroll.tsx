"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsPrecisionPointer, usePrefersReducedMotion } from "@/lib/media-hooks";

gsap.registerPlugin(ScrollTrigger);

type ScrollContextValue = {
  scrollTo: (target: string | number, offset?: number) => void;
  /**
   * Freeze page scrolling while an overlay owns the screen.
   *
   * `document.body.style.overflow = "hidden"` is not enough here, and this is
   * the reason it is not: when Lenis is running, the page is scrolled by
   * transforming `window` on a rAF loop. The body has no scrollable overflow
   * left to hide, so the wheel went straight through — the page scrolled
   * *behind* the cart drawer and behind the gallery lightbox while the overlay
   * sat still on top. Lenis has to be told to stop.
   *
   * Ref-counted because two overlays can legitimately want the lock at once,
   * and the first one to close must not hand back the screen while the second
   * is still open.
   */
  lockScroll: () => void;
  unlockScroll: () => void;
};

/**
 * Broadcast on every in-page navigation so sections can respond to a target
 * they own — the Academy listens to switch to the tab its anchor names, which
 * also makes each tab deep-linkable.
 */
export const NAVIGATE_EVENT = "jp:navigate";

const ScrollContext = createContext<ScrollContextValue>({
  scrollTo: () => {},
  lockScroll: () => {},
  unlockScroll: () => {},
});

export const useScrollTo = () => useContext(ScrollContext);

/**
 * The scroll lock, as a hook.
 *
 * `true` freezes the page for as long as the component is mounted with the
 * lock engaged, and releases it on unmount. Pairs with the `Escape` and
 * focus-trap handling an overlay already needs, so an overlay gets the whole
 * modal contract from one call.
 */
export function useScrollLock(locked: boolean) {
  const { lockScroll, unlockScroll } = useContext(ScrollContext);
  useEffect(() => {
    if (!locked) return;
    lockScroll();
    return unlockScroll;
  }, [locked, lockScroll, unlockScroll]);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const finePointer = useIsPrecisionPointer();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced || !finePointer) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [finePointer, reduced]);

  const scrollTo = useCallback(
    (target: string | number, offset = 0) => {
      /* Announce first, so a section can restyle itself before the camera
         arrives rather than a second and a half later. */
      if (typeof target === "string") {
        window.dispatchEvent(
          new CustomEvent<string>(NAVIGATE_EVENT, { detail: target }),
        );
        if (target.startsWith("#") && window.location.hash !== target) {
          window.history.replaceState(null, "", target);
        }
      }

      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
        return;
      }

      const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior });
        return;
      }

      const element = document.querySelector<HTMLElement>(target);
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior });
    },
    [reduced],
  );

  /**
   * A link like `/music#kalpana` crosses a route boundary, so the browser's
   * native anchor jump happens before the new page exists and Lenis has not
   * started. Re-run the scroll once the pathname has actually changed and the
   * section is in the DOM — otherwise every cross-route deep link in the
   * navigation, the ecosystem and the artist doors lands at the top.
   */
  const pathname = usePathname();
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    let outer = 0;
    let inner = 0;
    outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        if (!document.querySelector(hash)) return;
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(hash, { duration: 1.4 });
          return;
        }
        const top = document.querySelector<HTMLElement>(hash)!.getBoundingClientRect().top;
        window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      });
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [pathname, reduced]);

  /* ---- the overlay lock ---- */

  const locks = useRef(0);

  const lockScroll = useCallback(() => {
    locks.current += 1;
    if (locks.current > 1) return;
    // Lenis owns the wheel when it is running, so it is the thing that has to
    // stop. `stop()` also adds Lenis's own `lenis-stopped` class to <html>,
    // which the stylesheet already turns into `overflow: hidden`.
    lenisRef.current?.stop();
    // When Lenis is not running (reduced motion, or a coarse pointer) the
    // native document scroll is the real one, so hide its overflow too.
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current > 0) return;
    lenisRef.current?.start();
    document.body.style.overflow = "";
  }, []);

  const value = useMemo(
    () => ({ scrollTo, lockScroll, unlockScroll }),
    [scrollTo, lockScroll, unlockScroll],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}