"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "top" | "bottom" | "left" | "right";

/** Which edge the pointer came in through, as one of four named edges. */
function resolveDirection(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  box: HTMLElement
): Direction {
  const { width: w, height: h, left, top } = box.getBoundingClientRect();
  const x = event.clientX - left - (w / 2) * (w > h ? h / w : 1);
  const y = event.clientY - top - (h / 2) * (h > w ? w / h : 1);
  const quadrant = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
  return (["top", "right", "bottom", "left"] as const)[quadrant] ?? "left";
}

/**
 * A card that reveals its label from the edge the pointer arrived through.
 *
 * Two changes from the registry version, both needed before it can ship here:
 * it reveals on keyboard focus as well as hover — the label was previously
 * pointer-only, so a keyboard user never saw the content at all — and it
 * drives the reveal from state via `animate` rather than `whileHover`, so the
 * scrim and the label are the same animation instead of a CSS `group-hover`
 * that could not react to focus.
 */
export const DirectionAwareHover = ({
  imageUrl,
  imageAlt,
  children,
  childrenClassName,
  imageClassName,
  className,
  label,
}: {
  imageUrl: string;
  /** Required: the hover image is content, not decoration. */
  imageAlt: string;
  children: React.ReactNode;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
  /** Accessible name for the focusable card. */
  label?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction>("left");
  const [active, setActive] = useState(false);

  const handleEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (ref.current) setDirection(resolveDirection(event, ref.current));
      setActive(true);
    },
    [],
  );

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={label}
      className={cn(
        "relative h-60 w-60 overflow-hidden rounded-lg bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:h-96 md:w-96",
        className,
      )}
    >
      <motion.div
        className="relative h-full w-full"
        animate={active ? direction : "initial"}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 z-10 h-full w-full bg-ink/60"
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <motion.div
          variants={imageVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative h-full w-full bg-coal"
        >
          <Image
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 24rem, 15rem"
            className={cn("scale-[1.15] object-cover", imageClassName)}
            src={imageUrl}
          />
        </motion.div>

        <motion.div
          variants={textVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "absolute bottom-4 left-4 z-40 text-paper",
            childrenClassName,
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const imageVariants = {
  initial: { x: 0, y: 0 },
  exit: { x: 0, y: 0 },
  top: { y: 20 },
  bottom: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
};

const textVariants = {
  initial: { y: 0, x: 0, opacity: 0 },
  exit: { y: 0, x: 0, opacity: 0 },
  top: { y: -20, opacity: 1 },
  bottom: { y: 2, opacity: 1 },
  left: { x: -2, opacity: 1 },
  right: { x: 20, opacity: 1 },
};
