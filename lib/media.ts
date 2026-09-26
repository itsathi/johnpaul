import { useSyncExternalStore } from "react";

/**
 * Builds a sized/sharpenable URL for a stable `static.wixstatic.com` media id,
 * e.g. "84283f_abc…~mv2.jpg". Width-scaled, queue-sharpened, avif-encoded.
 */
export function wix(id: string, width: number, height?: number): string {
  const h = height ?? Math.round(width * 0.76);
  const file = id.startsWith("http") ? id.split("/").pop() : id;
  return `https://static.wixstatic.com/media/${file}/v1/fit/w_${width},h_${h},al_c,q_85,enc_avif,quality_auto/${file}`;
}

/** SSR-safe, reactive media-query hook (avoids hydration mismatch). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** SSR-safe, media-query based reduced-motion check. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only for fine pointers (mouse/trackpad) — gating cursor & parallax. */
export function useIsPrecisionPointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Whether the desktop layout is active (min-width gauge). */
export function useIsDesktop(breakpoint = 1024): boolean {
  return useMediaQuery(`(min-width: ${breakpoint}px)`);
}

let cachedSize = { width: 0, height: 0 };

/* A stable server snapshot. Returning a fresh object from getServerSnapshot
   makes useSyncExternalStore believe the store changed on every read, which
   React reports as an infinite-loop risk. */
const SERVER_SIZE: { width: number; height: number } = { width: 0, height: 0 };

/** Reactive viewport size that stays referentially stable between changes. */
export function useViewportSize(): { width: number; height: number } {
  const subscribe = (onChange: () => void) => {
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  };
  const getSnapshot = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width !== cachedSize.width || height !== cachedSize.height) {
      cachedSize = { width, height };
    }
    return cachedSize;
  };
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SIZE);
}

/** Clamp a number between bounds. */
export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));