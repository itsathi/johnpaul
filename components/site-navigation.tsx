"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { artist, contact } from "@/content/site";
import { navGroups } from "@/content/platform";
import { useCart } from "@/lib/providers/commerce-provider";
import { useScrollTo } from "./smooth-scroll";
import { useDialog } from "@/lib/use-dialog";

const EASE = [0.16, 1, 0.3, 1] as const;
const WIPE = [0.83, 0, 0.17, 1] as const;

/**
 * Navigation organised around John's actual ecosystem rather than page order:
 * three groups (Artist · Music · Work) cover the seven destinations without
 * crowding the bar, and a single commercial CTA — booking a session — sits on
 * the right.
 *
 * The desktop groups are a disclosure, not a menu widget: buttons with
 * `aria-expanded` controlling a labelled region, so Tab order stays honest.
 */
export default function SiteNavigation() {
  const { scrollTo } = useScrollTo();
  const pathname = usePathname();
  const { count, open: openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const { scrollY } = useScroll();
  const lastScroll = useRef(0);
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 72);
    /* Only a downward page movement dismisses an open group. A scroll that is
       merely settling (Lenis finishing a fling the pointer was already
       chasing) would otherwise snap the panel shut under the cursor. */
    if (v > 24 && v > lastScroll.current) setOpenGroup(null);
    lastScroll.current = v;
  });

  /* Hashes stay inside the page and keep the Lenis easing; everything else is
     a real route handled by next/link. One rule, so the header never has to
     know which kind of destination it is pointing at. */
  const go = (href: string) => {
    setOpen(false);
    setOpenGroup(null);
    if (href.startsWith("#")) {
      window.setTimeout(() => scrollTo(href, 0), 0);
    }
  };

  /** True when `href` resolves to the route currently being viewed. */
  const isCurrent = (href: string) => {
    if (!href.startsWith("/")) return false;
    const [path] = href.split("#");
    return path === pathname;
  };

  /* Escape closes an open group and returns focus to its trigger. Skipped
     while the mobile menu is up: Escape there belongs to the menu, which is
     the outermost thing open, and closing both at once is disorienting. */
  useEffect(() => {
    if (!openGroup || open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = headerRef.current?.querySelector<HTMLButtonElement>(
        `[data-nav-trigger="${openGroup}"]`,
      );
      setOpenGroup(null);
      trigger?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openGroup]);

  /* The mobile menu is a dialog, so it gets the full contract — Escape, the
     focus trap, focus restore and the scroll lock. It had none of them: the
     Escape handler above was gated on the *desktop* disclosure state, so on a
     phone there was no way out but hitting the X. */
  useDialog(open, closeMenu, menuRef);

  const socials = contact.socials;
  const active = navGroups.find((g) => g.label === openGroup) ?? null;

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
        onMouseLeave={() => setOpenGroup(null)}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-[92rem] items-center justify-between px-6 md:h-[4.5rem] md:px-10 lg:px-14">
          <Link
            href="/"
            data-cursor="link"
            className="group flex items-baseline gap-3"
            aria-label={`${artist.name} — home`}
          >
            <span className="font-display text-xl tracking-tight text-paper">
              {artist.name}
            </span>
            <span className="hidden font-mono text-[0.55rem] uppercase tracking-[0.3em] text-mute transition-colors group-hover:text-brass-bright md:inline">
              Kolkata
            </span>
          </Link>

          {/* ---- desktop groups ---- */}
          <div className="hidden items-center gap-7 lg:flex">
            {navGroups.map((group) => {
              const isOn = openGroup === group.label;
              return (
                <button
                  key={group.label}
                  type="button"
                  data-nav-trigger={group.label}
                  data-cursor="link"
                  aria-expanded={isOn}
                  aria-controls={`nav-panel-${group.label}`}
                  onMouseEnter={() => setOpenGroup(group.label)}
                  onClick={() => setOpenGroup(isOn ? null : group.label)}
                  className={`relative font-mono text-[0.62rem] uppercase tracking-[0.3em] transition-colors ${
                    isOn || group.children.some((c) => isCurrent(c.href))
                      ? "text-paper"
                      : "text-bone hover:text-paper"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {group.label}
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      aria-hidden
                      className={`transition-transform duration-300 ${
                        isOn ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M0 0.5 L4 4.5 L8 0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </span>
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-brass transition-all duration-300 ${
                      isOn ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              );
            })}

            <Link
              href="/sessions/book"
              data-cursor="link"
              className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-ink"
              style={{ background: "linear-gradient(120deg, #dcac73, #c08b4c)" }}
            >
              <span className="block px-4 py-2 transition-transform duration-300 hover:scale-[1.04]">
                Book a session
              </span>
            </Link>

            {/* Cart entry — only appears once there is something in it. */}
            {count > 0 ? (
              <button
                type="button"
                onClick={openCart}
                data-cursor="link"
                aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
                className="relative flex h-9 w-9 items-center justify-center border border-line text-bone transition-colors hover:border-brass/60 hover:text-brass-bright"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                  <path
                    d="M1.5 1.5h1.6l1.7 8.2h6.4l1.7-5.9H4.2"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <circle cx="6" cy="12.4" r="1.1" fill="currentColor" />
                  <circle cx="11.4" cy="12.4" r="1.1" fill="currentColor" />
                </svg>
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-brass px-1 font-mono text-[0.5rem] text-ink">
                  {count}
                </span>
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
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

        {/* ---- desktop disclosure panel ---- */}
        <AnimatePresence>
          {active ? (
            <motion.div
              key={active.label}
              id={`nav-panel-${active.label}`}
              className="hidden border-t border-line bg-coal/97 backdrop-blur-xl lg:block"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="mx-auto grid w-full max-w-[92rem] grid-cols-[1fr_auto] items-start gap-10 px-14 py-9">
                <ul className="grid grid-cols-2 gap-x-12 gap-y-1 xl:grid-cols-3">
                  {active.children.map((child, i) => {
                    const inner = (
                      <>
                        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-brass">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-xl leading-none tracking-tight text-bone transition-colors duration-300 group-hover:text-brass-bright">
                          {child.label}
                        </span>
                      </>
                    );
                    const cls =
                      "group flex w-full items-baseline gap-4 border-b border-line py-3.5 text-left transition-colors";
                    return (
                      <li key={child.href}>
                        {child.href.startsWith("#") ? (
                          <button
                            type="button"
                            onClick={() => go(child.href)}
                            data-cursor="link"
                            className={cls}
                          >
                            {inner}
                          </button>
                        ) : (
                          <Link
                            href={child.href}
                            onClick={() => setOpenGroup(null)}
                            data-cursor="link"
                            className={cls}
                            aria-current={isCurrent(child.href) ? "page" : undefined}
                          >
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="flex w-64 flex-col gap-5 border-l border-line pl-10">
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-mute">
                    {active.label}
                  </span>
                  <p className="font-display text-lg leading-snug text-bone/80">
                    {active.note}
                  </p>
                  <Link
                    href={active.cta.href}
                    onClick={() => setOpenGroup(null)}
                    data-cursor="link"
                    className="self-start font-mono text-[0.55rem] uppercase tracking-[0.28em] text-ink"
                  >
                    <span
                      className="block px-4 py-2.5"
                      style={{ background: "linear-gradient(120deg, #dcac73, #c08b4c)" }}
                    >
                      {active.cta.label}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      {/* ---- mobile overlay ---- */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            className="fixed inset-0 z-[75] flex flex-col bg-coal/97 px-6 pt-24 pb-8 backdrop-blur-xl lg:hidden outline-none"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: WIPE }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {navGroups.map((group, gi) => (
                <motion.div
                  key={group.label}
                  initial={{ y: 34, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 18, opacity: 0 }}
                  transition={{
                    delay: 0.12 + gi * 0.06,
                    duration: 0.55,
                    ease: EASE,
                  }}
                >
                  <div className="flex items-baseline gap-4 pt-6 pb-1">
                    <span className="font-mono text-[0.55rem] tracking-[0.3em] text-brass">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-mute">
                      {group.label}
                    </span>
                  </div>

                  {group.children.map((child) =>
                    child.href.startsWith("#") ? (
                      <button
                        key={`${group.label}-${child.href}`}
                        type="button"
                        onClick={() => go(child.href)}
                        className="flex w-full items-baseline gap-4 border-b border-line py-3.5 text-left"
                      >
                        <span className="font-display text-2xl leading-none tracking-tight text-bone">
                          {child.label}
                        </span>
                      </button>
                    ) : (
                      <Link
                        key={`${group.label}-${child.href}`}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        aria-current={isCurrent(child.href) ? "page" : undefined}
                        className="flex w-full items-baseline gap-4 border-b border-line py-3.5 text-left"
                      >
                        <span className="font-display text-2xl leading-none tracking-tight text-bone">
                          {child.label}
                        </span>
                      </Link>
                    ),
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="shrink-0 border-t border-line pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.42 }}
            >
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone"
                >
                  Cart{count > 0 ? ` (${count})` : ""}
                </Link>
                <Link
                  href="/studio"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone"
                >
                  Studio
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-bone"
                >
                  Contact
                </Link>
              </div>
              <p className="mt-4 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                {artist.location}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
