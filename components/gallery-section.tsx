"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import SectionTag from "./ui/section-tag";
import Media from "./ui/media";
import { wix } from "@/lib/media";
import { gallery, galleryCategories } from "@/content/platform";
import { galleryItems } from "@/content/gallery";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The visual archive. Masonry columns, filterable by category, opening into a
 * full-screen lightbox with keyboard and touch navigation.
 *
 * Photography is drawn from the same real assets the rest of the site uses —
 * nothing here is stock filler, and items that arrive without an image fall
 * back to `Media`'s on-brand placeholder.
 */
export default function GallerySection() {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? galleryItems : galleryItems.filter((i) => i.category === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: galleryItems.length };
    for (const item of galleryItems) {
      map[item.category] = (map[item.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const openIndex = openId ? visible.findIndex((i) => i.id === openId) : -1;
  const current = openIndex >= 0 ? visible[openIndex] : null;

  const step = useCallback(
    (delta: number) => {
      setOpenId((prev) => {
        if (prev === null) return prev;
        const at = visible.findIndex((i) => i.id === prev);
        if (at < 0) return prev;
        return visible[(at + delta + visible.length) % visible.length].id;
      });
    },
    [visible],
  );

  const close = useCallback(() => setOpenId(null), []);

  return (
    <section id="gallery" className="relative overflow-hidden bg-coal py-28 md:py-40">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="15" label={gallery.kicker} />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-20">
          <h2
            className="font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6.4vw, 6rem)" }}
          >
            {gallery.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block will-change-transform ${
                    i === 1 ? "italic text-bone/70" : ""
                  }`}
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
            {gallery.intro}
          </p>
        </div>

        {/* ---- filters ---- */}
        <div className="mt-14 flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-line py-5 md:mt-20">
          {galleryCategories.map((cat) => {
            const isOn = filter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setFilter(cat.key)}
                aria-pressed={isOn}
                data-cursor="link"
                className={`rounded-full border px-5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.22em] transition-all duration-300 ${
                  isOn
                    ? "border-brass bg-brass/10 text-brass-bright"
                    : "border-line text-mute hover:border-brass/50 hover:text-bone"
                }`}
              >
                {cat.label}
                <span className="ml-2 text-mute/60">{counts[cat.key] ?? 0}</span>
              </button>
            );
          })}

          <span className="ml-auto hidden font-mono text-[0.56rem] uppercase tracking-[0.26em] text-mute md:block">
            {visible.length} frame{visible.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* ---- masonry ---- */}
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {visible.map((item, i) => (
            <motion.figure
              key={item.id}
              className="group mb-5 break-inside-avoid"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.7, delay: (i % 9) * 0.05, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setOpenId(item.id)}
                data-cursor="view"
                data-cursor-label="Open"
                aria-label={`Open ${item.title} full screen`}
                className={`relative block w-full overflow-hidden bg-coal ${item.ratio} ${item.offset}`}
              >
                <Media
                  src={item.src}
                  alt={item.alt}
                  wixWidth={900}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  placeholderLabel={item.title}
                />
                <div className="vignette absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
                <span className="absolute right-4 bottom-4 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full border border-paper/25 bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
                    <path
                      d="M5.5 1.5H1.5v4M8.5 1.5h4v4M12.5 8.5v4h-4M1.5 8.5v4h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
              </button>

              <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone">
                  {item.title}
                </span>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                  {item.meta}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 flex max-w-3xl items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
          <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
          {gallery.note}
        </p>
      </div>

      {current ? (
        <Lightbox
          item={current}
          index={openIndex}
          total={visible.length}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Full-screen viewer — portalled to <body> so no ancestor clip can      */
/* catch it, and so the film-grain overlay stays underneath.            */
/* ------------------------------------------------------------------ */

function Lightbox({
  item,
  index,
  total,
  onClose,
  onStep,
}: {
  item: (typeof galleryItems)[number];
  index: number;
  total: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  /* No mounted guard is needed: this component only renders once the visitor
     has opened a frame, which can only happen in the browser. */
  useEffect(() => {
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -450) onStep(1);
    else if (info.offset.x > 70 || info.velocity.x > 450) onStep(-1);
  };

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  const view = (
    <motion.div
      key="gallery-lightbox"
      className="fixed inset-0 z-[95] flex flex-col bg-ink/96 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-5 pb-4 md:px-8 md:pt-7">
        <div className="flex min-w-0 items-center gap-4">
          <span className="font-mono text-[0.58rem] tracking-[0.3em] text-brass">
            {counter}
          </span>
          <span className="truncate font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone">
            {item.title}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close viewer"
          data-cursor="link"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-brass hover:text-brass-bright"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
            <path d="M1.5 1.5l11 11M12.5 1.5l-11 11" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      {/* stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-16 md:pb-6">
        <NavButton side="left" onClick={() => onStep(-1)} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            className="flex h-full w-full items-center justify-center"
            drag="x"
            dragElastic={0.18}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wix(item.src, 2000, 1334)}
              alt={item.alt}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain"
            />
          </motion.div>
        </AnimatePresence>

        <NavButton side="right" onClick={() => onStep(1)} />
      </div>

      {/* meta */}
      <div className="flex shrink-0 flex-col items-start gap-2 border-t border-line px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-[0.56rem] uppercase tracking-[0.26em] text-mute">
          {item.meta} · {gallery.kicker}
        </p>
        <p className="font-mono text-[0.56rem] uppercase tracking-[0.26em] text-mute">
          Swipe or use ← → to move
        </p>
      </div>
    </motion.div>
  );

  return createPortal(<AnimatePresence>{view}</AnimatePresence>, document.body);}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous frame" : "Next frame"}
      data-cursor="link"
      className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line text-paper transition-all duration-300 hover:border-brass hover:text-brass-bright md:flex ${
        side === "left" ? "left-2 lg:left-6" : "right-2 lg:right-6"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path
          d={side === "left" ? "M10 1 L3 8 L10 15" : "M6 1 L13 8 L6 15"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </button>
  );
}
