"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Sticky scroll reveal: a column of cards scrolls past while the panel beside
 * them holds position and shows the matching card's content.
 *
 * The registry version hard-codes a slate/cyan/emerald palette and a fixed
 * `h-[30rem]`; both are props here so the section that mounts it stays on the
 * house ink/brass palette, and the scroll axis can follow the page instead of
 * an internal container when the layout is not a self-contained scroller.
 */

export type StickyScrollCard = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

const HOUSE_BACKGROUNDS = ["#0f0d0b", "#0a0908", "#16130f", "#1d1914"];
const HOUSE_GRADIENTS = [
  "linear-gradient(to bottom right, rgba(188,138,76,0.26), rgba(10,9,8,0.92))",
  "linear-gradient(to bottom right, rgba(217,170,110,0.20), rgba(15,13,11,0.92))",
  "linear-gradient(to bottom right, rgba(236,230,218,0.10), rgba(22,19,15,0.92))",
  "linear-gradient(to bottom right, rgba(188,138,76,0.14), rgba(10,9,8,0.94))",
];

export const StickyScroll = ({
  content,
  contentClassName,
  className,
  backgrounds = HOUSE_BACKGROUNDS,
  gradients = HOUSE_GRADIENTS,
  scrollContainer = true,
}: {
  content: StickyScrollCard[];
  contentClassName?: string;
  className?: string;
  backgrounds?: string[];
  gradients?: string[];
  /** false scrolls the page rather than the panel's own overflow. */
  scrollContainer?: boolean;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainer ? ref : undefined,
    container: scrollContainer ? ref : undefined,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  /* Derived, not stored: the registry version kept this in state and wrote it
     from an effect, which re-rendered the whole tree on every card change. */
  const background = backgrounds[activeCard % backgrounds.length];
  const backgroundGradient = gradients[activeCard % gradients.length];

  return (
    <motion.div
      animate={{ backgroundColor: background }}
      className={cn(
        "relative flex h-[30rem] justify-center space-x-10 overflow-y-auto p-10",
        className,
      )}
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="font-display text-3xl leading-tight tracking-tight text-paper md:text-4xl"
              >
                {item.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="mt-6 max-w-sm text-[0.9rem] leading-relaxed text-bone md:text-base"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>

      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md lg:block",
          contentClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
};
