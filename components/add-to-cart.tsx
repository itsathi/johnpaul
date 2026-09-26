"use client";

import { useState } from "react";
import { useCart } from "@/lib/providers/commerce-provider";
import type { Product } from "@/lib/commerce";

/** Add-to-cart with an inline confirmation. Opens the drawer on success. */
export default function AddToCart({ product }: { product: Product }) {
  const { add, isPriced } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div>
      <p className="flex items-baseline gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">Price</span>
        <span className="font-display text-3xl text-paper">
          {isPriced && product.price?.amount ? (
            product.price.amount
          ) : (
            <span className="font-mono text-[0.8rem] uppercase tracking-[0.16em] text-mute">
              To be confirmed
            </span>
          )}
        </span>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => {
            add(product);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 2400);
          }}
          className="inline-flex items-center gap-2 border border-brass/60 px-8 py-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
        >
          Add to cart
        </button>
        {added ? (
          <span role="status" className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone">
            ✓ Added — nothing is charged
          </span>
        ) : null}
      </div>
      <p className="mt-5 font-mono text-[0.56rem] uppercase leading-[1.9] tracking-[0.2em] text-mute">
        Demonstration catalogue. The cart records your interest; the studio
        confirms availability, edition sizes and pricing by email.
      </p>
    </div>
  );
}
