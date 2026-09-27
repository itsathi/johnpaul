"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Lamp backdrop: two conic beams meeting over a bar of light, with the copy
 * lifted into the gap between them.
 *
 * The registry version hard-codes `bg-slate-950`, `from-cyan-500` and
 * `min-h-screen`, none of which belong on this site — so the ground, the glow
 * and the height are all props here, defaulting to the house ink/brass
 * palette and a header that is tall rather than a second full viewport.
 */
export const LampContainer = ({
  children,
  className,
  glow = "var(--color-brass)",
}: {
  children: React.ReactNode;
  className?: string;
  /** Any CSS colour — a theme token like `var(--color-brass)` or a hex. */
  glow?: string;
}) => (
  <div
    style={{ "--lamp-glow": glow } as React.CSSProperties}
    className={cn(
      "relative isolate z-0 flex min-h-[30rem] w-full flex-col items-center justify-center overflow-hidden bg-ink",
      className,
    )}
  >
    <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "30rem" }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        style={{
          backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
        }}
        className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible bg-gradient-conic from-[var(--lamp-glow)] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
      >
        <div className="absolute bottom-0 left-0 z-20 h-40 w-[100%] bg-ink [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute bottom-0 left-0 z-20 h-[100%] w-40 bg-ink [mask-image:linear-gradient(to_right,white,transparent)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "30rem" }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        style={{
          backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
        }}
        className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[var(--lamp-glow)] text-white [--conic-position:from_290deg_at_center_top]"
      >
        <div className="absolute bottom-0 right-0 z-20 h-40 w-[100%] bg-ink [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute bottom-0 right-0 z-20 h-[100%] w-40 bg-ink [mask-image:linear-gradient(to_left,white,transparent)]" />
      </motion.div>

      <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-ink blur-2xl" />
      <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
      <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[var(--lamp-glow)] opacity-40 blur-3xl" />

      <motion.div
        initial={{ width: "8rem" }}
        whileInView={{ width: "16rem" }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[var(--lamp-glow)] opacity-70 blur-2xl"
      />
      <motion.div
        initial={{ width: "15rem" }}
        whileInView={{ width: "30rem" }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-auto z-50 h-px w-[30rem] -translate-y-[7rem] bg-[var(--lamp-glow)]"
      />

      <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-ink" />
    </div>

    <div className="relative z-50 flex -translate-y-16 flex-col items-center px-5">
      {children}
    </div>
  </div>
);
