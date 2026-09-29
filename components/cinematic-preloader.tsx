"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { markPreloadDone } from "@/lib/preload";

const items = [
  {
    id: "live",
    label: "LIVE",
    chapter: "01",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80",
    accent: "#d9aa6e",
  },
  {
    id: "shop",
    label: "SHOP",
    chapter: "02",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    accent: "#5eead4",
  },
  {
    id: "sessions",
    label: "SESSIONS",
    chapter: "03",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80",
    accent: "#93c5fd",
  },
  {
    id: "classes",
    label: "CLASSES",
    chapter: "04",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    accent: "#c4b5fd",
  },
];

export default function CinematicPreloader() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "menu" | "done">("loading");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("menu");
      markPreloadDone();
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "menu") return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setPhase("done");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  const handleEnter = (id: string) => {
    const routes: Record<string, string> = {
      live: "/music",
      shop: "/shop",
      sessions: "/sessions",
      classes: "/academy",
    };
    setPhase("done");
    setTimeout(() => {
      router.push(routes[id] || "/");
    }, 600);
  };

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0a0908] flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="text-center px-6">
            <motion.div
              className="text-[0.6rem] uppercase tracking-[0.5em] text-[#d9aa6e]/60 font-mono mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              The Digital Studio of
            </motion.div>
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-[#ece6da] tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              JOHN PAUL
            </motion.h1>
            <motion.div
              className="mt-6 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="h-px w-12 bg-[#d9aa6e]/40" />
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#908876] font-mono">
                Guitarist · Producer · Artist
              </p>
              <div className="h-px w-12 bg-[#d9aa6e]/40" />
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d9aa6e] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.2, ease: "linear" }}
          />
        </motion.div>
      )}

      {phase === "menu" && (
        <motion.div
          className="fixed inset-0 z-[90] bg-[#0a0908]"
          exit={{
            y: "-100%",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex items-center justify-between z-10">
            <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[#908876] font-mono">
              Table of Contents
            </span>
            <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[#d9aa6e]/60 font-mono">
              Est. Kolkata
            </span>
          </div>

          <div className="hidden md:flex h-full pt-20 pb-16 px-10 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex-1 relative overflow-hidden cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleEnter(item.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                  animate={{
                    scale: hoveredIndex === i ? 1.08 : 1,
                    opacity: hoveredIndex === i ? 0.7 : 0.3,
                  }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, ${item.accent}15 0%, transparent 40%, rgba(0,0,0,0.85) 100%)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                <div className="absolute top-6 left-6">
                  <span
                    className="text-[0.55rem] uppercase tracking-[0.3em] font-mono"
                    style={{ color: `${item.accent}99` }}
                  >
                    Chapter {item.chapter}
                  </span>
                </div>

                <motion.div
                  className="absolute top-1/2 left-8 right-8 h-px"
                  style={{ backgroundColor: `${item.accent}33` }}
                  animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />

                <div className="absolute inset-0 flex items-end p-8">
                  <div>
                    <motion.h3
                      className="text-4xl lg:text-5xl font-display font-bold text-[#ece6da] tracking-tight"
                      animate={{ x: hoveredIndex === i ? 16 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {item.label}
                    </motion.h3>
                    <motion.div
                      className="mt-3 h-[2px]"
                      style={{ backgroundColor: item.accent }}
                      animate={{ width: hoveredIndex === i ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />
              </motion.div>
            ))}
          </div>

          <div className="md:hidden h-full flex flex-col justify-center px-6 pt-16 pb-8 gap-4 overflow-y-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#d9aa6e]/60 font-mono mb-2">
                Table of Contents
              </p>
              <h2 className="text-3xl font-display font-bold text-[#ece6da]">
                John Paul Digital Studio
              </h2>
            </motion.div>

            {items.map((item, i) => (
              <motion.div
                key={item.id}
                className="relative overflow-hidden rounded-sm cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleEnter(item.id)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                  animate={{
                    scale: hoveredIndex === i ? 1.05 : 1,
                    opacity: hoveredIndex === i ? 0.8 : 0.4,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="h-24 relative">
                  <div className="absolute inset-0 flex items-center justify-between px-5">
                    <div>
                      <span
                        className="text-[0.5rem] uppercase tracking-[0.3em] font-mono block mb-1"
                        style={{ color: `${item.accent}99` }}
                      >
                        Chapter {item.chapter}
                      </span>
                      <span className="text-2xl font-display font-bold text-[#ece6da] tracking-tight">
                        {item.label}
                      </span>
                    </div>
                    <motion.div
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      style={{ borderColor: `${item.accent}55` }}
                      animate={{ rotate: hoveredIndex === i ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span style={{ color: item.accent }} className="text-sm">→</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#908876] font-mono">
                Scroll to explore John Paul Digital Studio
              </p>
              <motion.div
                className="mt-4 mx-auto w-px h-10 bg-gradient-to-b from-[#d9aa6e]/50 to-transparent"
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d9aa6e]/30 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}