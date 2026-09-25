"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type TextRevealProps = {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  mask?: boolean;
};

/**
 * Editorial masked word reveal. Each word rises out of an overflow-hidden
 * mask, staggered, when the block scrolls into view.
 */
export default function TextReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.035,
  duration = 0.9,
  once = true,
  mask = true,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  const words = children.split(" ");

  return (
    <span ref={ref} className={className} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: mask ? "115%" : "0%", opacity: mask ? 0 : 0.2 }}
            animate={
              inView
                ? { y: "0%", opacity: 1 }
                : { y: mask ? "115%" : "0%", opacity: mask ? 0 : 0.2 }
            }
            transition={{
              duration,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}