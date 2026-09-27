"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/media-hooks";

export interface TimelineItem {
  /** Small line above the sticky title — an era, a year range. */
  eyebrow?: ReactNode;
  /** The sticky left-column heading. */
  title: string;
  /** Whatever the scene is: prose, media, both. */
  content: ReactNode;
}

/**
 * A vertical sequence whose rail fills as the list scrolls past.
 *
 * The rail and the per-scene dots are positioned from one CSS variable
 * (`--tl-rail`), so the dots cannot drift off the line at any breakpoint — the
 * registry version hardcoded two pairs of offsets that had to be kept in sync
 * by hand.
 *
 * Height is tracked with a `ResizeObserver` rather than read once on mount.
 * The registry version measured in a `useEffect` keyed on the ref, so the fill
 * stopped short of the last scene on resize and whenever a scene's image
 * finished loading, which is exactly when this content changes height.
 */
export function Timeline({
  items,
  className,
  stickyClassName,
  contentClassName,
}: {
  items: TimelineItem[];
  className?: string;
  stickyClassName?: string;
  contentClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track the list from the moment its first scene reaches the upper third to
  // the moment its last scene clears the lower half — so the line is already
  // filling while you read, and finishes with the final scene.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 62%", "end 70%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.35,
  });

  const fillHeight = useTransform(
    progress,
    (p) => `${Math.max(0, Math.min(1, p)) * height}px`,
  );
  const fillOpacity = useTransform(progress, [0, 0.05], [0, 1]);

  return (
    <div
      ref={containerRef}
      className={cn("relative [--tl-rail:0.5rem] md:[--tl-rail:15.5rem]", className)}
    >
      {/* the empty rail */}
      <span
        className="absolute inset-y-0 left-(--tl-rail) w-px bg-line"
        aria-hidden
      />
      {/* the fill, revealed by scroll position */}
      <motion.span
        style={
          reduced ? { height: "100%", opacity: 1 } : { height: fillHeight, opacity: fillOpacity }
        }
        className="absolute left-(--tl-rail) top-0 w-px bg-brass"
        aria-hidden
      />

      <ol className="flex flex-col">
        {items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="relative grid gap-5 pb-14 pl-9 last:pb-0 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-12 md:pb-28 md:pl-0"
          >
            <span
              className="absolute left-(--tl-rail) top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-brass bg-ink"
              aria-hidden
            />

            <div className={cn("md:sticky md:top-32 md:self-start", stickyClassName)}>
              {item.eyebrow ? (
                <span className="block font-mono text-[0.6rem] uppercase tracking-[0.3em] text-brass">
                  {item.eyebrow}
                </span>
              ) : null}
              <h3
                className="font-display leading-[1.02] tracking-[-0.02em] text-paper"
                style={{ fontSize: "clamp(1.6rem, 2.9vw, 2.9rem)" }}
              >
                {item.title}
              </h3>
            </div>

            <div className={cn("min-w-0", contentClassName)}>{item.content}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
