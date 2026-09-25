"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsPrecisionPointer, usePrefersReducedMotion } from "@/lib/media";

type CursorVariant = "default" | "link" | "view" | "play" | "hide";

/**
 * Minimal custom cursor. A hard dot follows the pointer; a soft ring lags
 * behind it and morphs for links, viewable imagery and play targets.
 * Disabled entirely on touch devices and when the user prefers reduced motion.
 */
export default function CustomCursor() {
  const fine = useIsPrecisionPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 320, damping: 30, mass: 0.7 });
  const ry = useSpring(my, { stiffness: 320, damping: 30, mass: 0.7 });

  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor");

    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };

    const over = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]",
      );
      if (!target) {
        setVariant("default");
        return;
      }
      const mode = target.getAttribute("data-cursor");
      if (mode) {
        setVariant(
          ["link", "view", "play", "hide"].includes(mode)
            ? (mode as CursorVariant)
            : "link",
        );
        setLabel(target.getAttribute("data-cursor-label") ?? "");
      } else {
        setVariant(target.closest("a, button") ? "link" : "default");
      }
    };

    const out = (e: Event) => {
      const from = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (from && from.closest("a, button, [data-cursor]")) return;
      setVariant("default");
    };

    const leaveDoc = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, true);
    window.addEventListener("pointerout", out, true);
    document.documentElement.addEventListener("pointerleave", leaveDoc);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over, true);
      window.removeEventListener("pointerout", out, true);
      document.documentElement.removeEventListener("pointerleave", leaveDoc);
    };
  }, [enabled, mx, my]);

  if (!enabled) return null;

  const ringSize =
    variant === "link" ? 56 : variant === "view" ? 92 : variant === "play" ? 72 : 34;
  const mixBlend = variant === "default" ? "screen" : "screen";

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <motion.div
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-brass-bright"
        style={{
          x: mx,
          y: my,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border"
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: mixBlend,
          borderColor:
            variant === "default"
              ? "rgba(217,170,110,0.35)"
              : "rgba(217,170,110,0.9)",
          backgroundColor:
            variant === "default" ? "transparent" : "rgba(217,170,110,0.08)",
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
        }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {variant === "view" ? (
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-brass-bright">
            {label || "View"}
          </span>
        ) : null}
        {variant === "play" ? (
          <svg width="14" height="14" viewBox="0 0 14 14" className="translate-x-px">
            <path d="M2 1.5 L12 7 L2 12.5 Z" fill="currentColor" className="text-brass-bright" />
          </svg>
        ) : null}
      </motion.div>
    </div>
  );
}