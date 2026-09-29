"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"none" | "cover" | "reveal">("none");

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage("cover");
    }
  }, [children, displayChildren]);

  useEffect(() => {
    if (transitionStage === "cover") {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("reveal");
      }, 700);
      return () => clearTimeout(timer);
    }
    if (transitionStage === "reveal") {
      const timer = setTimeout(() => {
        setTransitionStage("none");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, children]);

  return (
    <>
      <AnimatePresence>
        {transitionStage !== "none" && (
          <motion.div
            className="fixed inset-0 z-[80] pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: transitionStage === "cover" ? 0 : "-100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-[#0a0908]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d9aa6e] to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d9aa6e]/50 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={{
          opacity: transitionStage === "cover" ? 0 : 1,
          y: transitionStage === "cover" ? 20 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {displayChildren}
      </motion.div>
    </>
  );
}