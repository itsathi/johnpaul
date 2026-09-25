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
import { usePrefersReducedMotion } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

type ScrollContextValue = {
  scrollTo: (target: string | number, offset?: number) => void;
};

const ScrollContext = createContext<ScrollContextValue>({
  scrollTo: () => {},
});

export const useScrollTo = () => useContext(ScrollContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

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
  }, [reduced]);

  const scrollTo = useCallback(
    (target: string | number, offset = 0) => {
      if (reduced) {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "auto" });
        } else {
          document.querySelector(target)?.scrollIntoView();
        }
        return;
      }
      lenisRef.current?.scrollTo(target, { offset, duration: 1.4 });
    },
    [reduced],
  );

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}