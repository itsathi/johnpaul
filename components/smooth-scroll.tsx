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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useIsPrecisionPointer,
  usePrefersReducedMotion,
} from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

type ScrollContextValue = {
  scrollTo: (target: string | number, offset?: number) => void;
};

/**
 * Broadcast on every in-page navigation so sections can respond to a target
 * they own — the Academy listens to switch to the tab its anchor names, which
 * also makes each tab deep-linkable.
 */
export const NAVIGATE_EVENT = "jp:navigate";

const ScrollContext = createContext<ScrollContextValue>({
  scrollTo: () => {},
});

export const useScrollTo = () => useContext(ScrollContext);

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

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}