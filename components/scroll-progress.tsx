"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline progress read-out at the very top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 z-[90] h-[2px] w-full origin-left bg-gradient-to-r from-brass via-brass-bright to-brass"
      style={{ scaleX }}
      aria-hidden
    />
  );
}