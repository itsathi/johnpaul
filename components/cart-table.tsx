"use client";

import Link from "next/link";
import { useCart } from "@/lib/providers/commerce-provider";
import PlaceholderArt from "./ui/placeholder-art";

/** The full cart as a table — the drawer's larger sibling on `/cart`. */
export default function CartTable() {
  const { lines, count, remove, setQuantity, clear, isPriced, subtotal } = useCart();

  if (!lines.length) {
    return (
      <div className="border border-line p-10 text-center">
        <p className="font-display text-3xl leading-tight text-bone">The cart is empty.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
          Nothing held yet. Every catalogue item is an unpriced placeholder, so
          the cart records what you are interested in rather than an order.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-brass/60 px-7 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div>
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
            Item
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
            Quantity
          </span>
        </div>
        <ul>
          {lines.map((line) => (
            <li
              key={`${line.handle}-${line.variantTitle}`}
              className="flex flex-wrap items-center gap-5 border-b border-line py-6"
            >
              <div className="h-24 w-20 shrink-0 overflow-hidden border border-line bg-smoke">
                <PlaceholderArt seed={line.seed} label={line.title} />
              </div>
              <div className="min-w-[12rem] flex-1">
                <p className="font-display text-2xl leading-none tracking-tight text-paper">
                  {line.title}
                </p>
                <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mute">
                  {line.unitPrice ?? "To be confirmed"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.handle, line.variantTitle, line.quantity - 1)}
                    aria-label={`Reduce quantity of ${line.title}`}
                    className="h-8 w-8 text-bone transition-colors hover:text-brass-bright"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-[0.7rem] text-paper">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.handle, line.variantTitle, line.quantity + 1)}
                    aria-label={`Increase quantity of ${line.title}`}
                    className="h-8 w-8 text-bone transition-colors hover:text-brass-bright"
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
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clear}
          data-cursor="link"
          className="mt-6 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-mute transition-colors hover:text-brass-bright"
        >
          Clear the cart
        </button>
      </div>

      <aside className="border border-line p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl leading-none tracking-tight text-paper">
          Summary
        </h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          <div className="flex items-baseline justify-between py-4">
            <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
              Items
            </dt>
            <dd className="font-mono text-sm text-paper">{count}</dd>
          </div>
          <div className="flex items-baseline justify-between py-4">
            <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
              Subtotal
            </dt>
            <dd className="font-display text-2xl text-paper">
              {isPriced && subtotal ? (
                subtotal
              ) : (
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mute">
                  To be confirmed
                </span>
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between py-4">
            <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
              Shipping
            </dt>
            <dd className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mute">
              To be confirmed
            </dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-7 block border border-brass/60 px-7 py-3.5 text-center font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
        >
          Continue to checkout
        </Link>
        <p className="mt-5 font-mono text-[0.56rem] uppercase leading-[1.9] tracking-[0.2em] text-mute">
          Nothing is charged at checkout. The studio confirms every enquiry
          directly.
        </p>
      </aside>
    </div>
  );
}
