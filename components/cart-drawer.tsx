"use client";

/**
 * Cart drawer — the persistent commerce surface, reachable from any route.
 *
 * Deliberately honest: no product is priced, so there is no total. The drawer
 * says so, offers the enquiry route, and never pretends a payment happened.
 * Focus is trapped while open and returned to the trigger on close.
 */

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/lib/providers/commerce-provider";
import PlaceholderArt from "./ui/placeholder-art";
import { useDialog } from "@/lib/use-dialog";

export default function CartDrawer() {
  const { lines, count, opened, close, remove, setQuantity, subtotal, isPriced } = useCart();
  const isReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* Escape, the focus trap, focus restore and the scroll lock all come from
     the shared modal contract — see lib/use-dialog.ts for why the hand-rolled
     version of this was only ever half right. */
  useDialog(opened, close, panelRef);


  return (
    <AnimatePresence>
      {opened ? (
        <div className="fixed inset-0 z-[120]">
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/80 backdrop-blur-sm"
            initial={isReduced ? false : { opacity: 0 }}
            animate={isReduced ? undefined : { opacity: 1 }}
            exit={isReduced ? undefined : { opacity: 0 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[27rem] flex-col border-l border-line bg-coal"
            initial={isReduced ? false : { x: "100%" }}
            animate={isReduced ? undefined : { x: 0 }}
            exit={isReduced ? undefined : { x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-mono text-[0.64rem] uppercase tracking-[0.3em] text-paper">
                Cart {count > 0 ? <span className="text-brass">({count})</span> : null}
              </h2>
              <button
                type="button"
                onClick={close}
                data-cursor="link"
                className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-brass-bright"
              >
                Close
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="font-display text-2xl leading-tight text-bone">
                  Nothing held yet.
                </p>
                <p className="text-sm leading-relaxed text-mute">
                  Every catalogue item is an unpriced placeholder, so the cart
                  records what you are interested in rather than an order.
                </p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="border border-brass/60 px-6 py-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                >
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
                  {lines.map((line) => (
                    <li key={`${line.handle}-${line.variantTitle}`} className="flex gap-4 px-6 py-5">
                      <div className="h-20 w-16 shrink-0 overflow-hidden border border-line bg-smoke">
                        <PlaceholderArt seed={line.seed} label={line.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-tight text-paper">
                          {line.title}
                        </p>
                        <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mute">
                          {line.quantity} ×{" "}
                          <span className="text-bone/80">
                            {line.unitPrice ?? "To be confirmed"}
                          </span>
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.handle, line.variantTitle, line.quantity - 1)
                              }
                              aria-label={`Reduce quantity of ${line.title}`}
                              className="h-7 w-7 text-bone transition-colors hover:text-brass-bright"
                            >
                              −
                            </button>
                            <span className="w-7 text-center font-mono text-[0.7rem] text-paper">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.handle, line.variantTitle, line.quantity + 1)
                              }
                              aria-label={`Increase quantity of ${line.title}`}
                              className="h-7 w-7 text-bone transition-colors hover:text-brass-bright"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line.handle, line.variantTitle)}
                            data-cursor="link"
                            className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-mute transition-colors hover:text-brass-bright"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
                      Subtotal
                    </span>
                    <span className="font-display text-2xl text-paper">
                      {isPriced && subtotal ? subtotal : (
                        <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mute">
                          To be confirmed
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-[0.56rem] uppercase leading-[1.9] tracking-[0.18em] text-mute">
                    Demonstration only. Nothing is charged and no order is
                    placed — the studio confirms every enquiry directly.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href="/checkout"
                      onClick={close}
                      className="w-full border border-brass/60 px-6 py-3.5 text-center font-mono text-[0.62rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
                    >
                      Continue to checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={close}
                      className="w-full border border-line px-6 py-3.5 text-center font-mono text-[0.62rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
                    >
                      View cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
