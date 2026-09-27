"use client";

/**
 * Gallery archive — filterable grid with a real lightbox.
 *
 * The category is held in the URL (`/gallery?f=live`) so a filtered view can
 * be linked and survives a reload, and so the ecosystem links that point at a
 * specific category actually land on it.
 *
 * Keyboard: arrows move, Escape closes, focus returns to the tile that opened
 * the lightbox.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { wix } from "@/lib/media";
import { useDialog } from "@/lib/use-dialog";
import { galleryCategories } from "@/content/platform";
import type { GalleryItem } from "@/content/platform";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GalleryArchive({
  items,
  initialFilter,
}: {
  items: GalleryItem[];
  initialFilter: string;
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isReduced = useReducedMotion();
  const gridRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );
  const active = openIndex !== null ? visible[openIndex] : null;

  /**
   * The filter lives in the URL, so `/gallery?f=studio` is linkable and
   * survives a reload — and so the ecosystem links that point at one category
   * land on it. `replaceState` keeps it out of the history stack, and a
   * `popstate` listener means back/forward still works if someone lands on
   * a filtered view from elsewhere. Choosing a category also closes the
   * lightbox, which would otherwise point at an item no longer in the grid.
   */
  const chooseFilter = useCallback((key: string) => {
    setFilter(key);
    setOpenIndex(null);
    const url =
      key === "all" ? window.location.pathname : `${window.location.pathname}?f=${key}`;
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    const onPop = () => {
      const next = new URLSearchParams(window.location.search).get("f") ?? "all";
      const valid = galleryCategories.some((c) => c.key === next) ? next : "all";
      setFilter(valid);
      setOpenIndex(null);
    };
    onPop();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) => {
        if (i === null) return i;
        return (i + delta + visible.length) % visible.length;
      });
    },
    [visible.length],
  );

  /* Escape, focus trap, focus restore and scroll lock: the shared modal
     contract. The arrow keys stay local to the gallery. */
  useDialog(openIndex !== null, close, lightboxRef);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, step]);

  return (
    <section className="bg-ink pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        {/* filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-line pb-6">
          {galleryCategories.map((cat) => {
            const on = filter === cat.key;
            const count =
              cat.key === "all" ? items.length : items.filter((i) => i.category === cat.key).length;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => chooseFilter(cat.key)}
                aria-pressed={on}
                className={`border px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] transition-colors ${
                  on
                    ? "border-brass/60 bg-brass/10 text-brass-bright"
                    : "border-line text-bone hover:border-brass/40"
                }`}
              >
                {cat.label}
                <span className="ml-2 text-mute">{count}</span>
              </button>
            );
          })}
        </div>

        {/* grid */}
        <ul
          ref={gridRef}
          className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
        >
          {visible.map((item, i) => (
            <li key={`${item.id}-${i}`}>
              <motion.button
                type="button"
                onClick={() => {
                  triggerRef.current = document.activeElement as HTMLButtonElement;
                  setOpenIndex(i);
                }}
                data-cursor="link"
                aria-label={`Open ${item.title}`}
                className="group relative block w-full overflow-hidden border border-line bg-coal text-left"
                initial={isReduced ? false : { opacity: 0, y: 22 }}
                whileInView={isReduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.8, delay: (i % 4) * 0.05, ease: EASE }}
              >
                <span className="block aspect-[4/5] w-full">
                  <Image
                    src={wix(item.id, 900, 1125)}
                    alt={item.alt}
                    width={900}
                    height={1125}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-8">
                  <span className="block font-mono text-[0.54rem] uppercase leading-[1.6] tracking-[0.18em] text-bone/90">
                    {item.title}
                  </span>
                </span>
              </motion.button>
            </li>
          ))}
        </ul>

        {visible.length === 0 ? (
          <p className="mt-12 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-mute">
            No photographs in this category yet.
          </p>
        ) : null}
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 md:p-10">
            <motion.button
              type="button"
              aria-label="Close image"
              onClick={close}
              className="absolute inset-0 h-full w-full cursor-default bg-ink/95"
              initial={isReduced ? false : { opacity: 0 }}
              animate={isReduced ? undefined : { opacity: 1 }}
              exit={isReduced ? undefined : { opacity: 0 }}
            />
            <motion.figure
              ref={lightboxRef}
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              tabIndex={-1}
              className="relative z-10 flex max-h-full w-full max-w-4xl flex-col"
              initial={isReduced ? false : { opacity: 0, scale: 0.97 }}
              animate={isReduced ? undefined : { opacity: 1, scale: 1 }}
              exit={isReduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="relative max-h-[74vh] w-full overflow-hidden border border-line bg-coal">
                <Image
                  src={wix(active.id, 1800, 2250)}
                  alt={active.title}
                  width={1800}
                  height={2250}
                  sizes="100vw"
                  className="h-full max-h-[74vh] w-full object-contain"
                />
              </div>
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
                <span className="font-display text-xl text-paper">{active.title}</span>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
                  {(openIndex ?? 0) + 1} / {visible.length}
                </span>
              </figcaption>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="border border-line px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-brass/60"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="border border-line px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-brass/60"
                >
                  Next →
                </button>
                <button
                  type="button"
                  onClick={close}
                  data-cursor="link"
                  className="ml-auto font-mono text-[0.6rem] uppercase tracking-[0.22em] text-mute transition-colors hover:text-brass-bright"
                >
                  Close (Esc)
                </button>
              </div>
            </motion.figure>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
