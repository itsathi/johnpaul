"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { navigation, artist, contact } from "@/content/site";
import { useScrollTo } from "./smooth-scroll";

const overlayLinks = [
  ...navigation,
  { label: "Instruments", href: "#instruments", id: "instruments" },
  { label: "Roots", href: "#roots", id: "roots" },
  { label: "Lab", href: "#lab", id: "lab" },
];

export default function SiteNavigation() {
  const { scrollTo } = useScrollTo();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 72));

  const go = (href: string) => {
    setOpen(false);
    // allow the menu to close before the scroll begins
    window.setTimeout(() => scrollTo(href, 0), open ? 420 : 0);
  };

  const socials = contact.socials;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-[92rem] items-center justify-between px-6 md:h-[4.5rem] md:px-10 lg:px-14">
          <button
            type="button"
            onClick={() => go("#top")}
            className="group flex items-baseline gap-3"
            aria-label="Back to top"
          >
            <span className="font-display text-xl tracking-tight text-paper">{artist.name}</span>
            <span className="hidden font-mono text-[0.55rem] uppercase tracking-[0.3em] text-mute transition-colors group-hover:text-brass-bright md:inline">
              Kolkata
            </span>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.href)}
                className="group relative font-mono text-[0.62rem] uppercase tracking-[0.3em] text-bone transition-colors hover:text-paper"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => go("#contact")}
              className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-ink"
              style={{
                background: "linear-gradient(120deg, #dcac73, #c08b4c)",
              }}
              data-cursor="link"
            >
              <span className="block px-4 py-2 transition-transform duration-300 hover:scale-[1.04]">
                Let&apos;s talk
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`h-px w-7 bg-paper transition-transform duration-300 ${
                open ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-7 bg-paper transition-transform duration-300 ${
                open ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[75] flex flex-col justify-between bg-coal/95 px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
          >
            <div className="flex flex-col gap-1">
              {overlayLinks.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    className="group flex w-full items-baseline gap-4 border-b border-line py-4 text-left"
                  >
                    <span className="font-mono text-[0.6rem] text-brass">
                      0{i + 1}
                    </span>
                    <span className="font-display text-4xl text-paper transition-colors group-hover:text-brass-bright">
                      {item.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-bone"
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}