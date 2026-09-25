"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  as?: "a" | "button" | "div";
  href?: string;
  onClick?: () => void;
  strength?: number;
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

/**
 * A button that leans toward the cursor. Used sparingly for primary CTAs.
 */
export default function MagneticButton({
  children,
  className = "",
  as: Tag = "button",
  href,
  onClick,
  strength = 0.35,
  ariaLabel,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 260, damping: 22, mass: 0.6 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const motionProps = {
    style: { x, y },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
    "aria-label": ariaLabel,
  } as const;

  const cls = `inline-flex select-none items-center justify-center ${className}`;

  if (Tag === "a" && href) {
    return (
      <motion.a
        ref={ref as never}
        href={href}
        target={target}
        rel={rel}
        className={cls}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as never}
      type="button"
      className={cls}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}