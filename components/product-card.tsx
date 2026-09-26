"use client";

/**
 * Product card — the plate is generated, not photographed, because no real
 * product photography exists yet. The card says so rather than letting a
 * drawing pass for a photograph.
 */

import Link from "next/link";
import { useCart } from "@/lib/providers/commerce-provider";
import PlaceholderArt from "./ui/placeholder-art";
import type { Product } from "@/lib/commerce";

export default function ProductCard({ product }: { product: Product }) {
  const { add, isPriced } = useCart();

  return (
    <article className="group flex h-full flex-col border border-line transition-colors hover:border-brass/40">
      <Link
        href={`/shop/${product.handle}`}
        className="relative block aspect-[4/5] overflow-hidden bg-coal"
        data-cursor="link"
      >
        <PlaceholderArt seed={product.seed} label={product.title} />
        {product.badge ? (
          <span className="absolute left-4 top-4 border border-line bg-ink/70 px-2.5 py-1 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-mute backdrop-blur-sm">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-none tracking-tight text-bone transition-colors group-hover:text-brass-bright">
          <Link href={`/shop/${product.handle}`} data-cursor="link">
            {product.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-bone/80">{product.blurb}</p>
        <p className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
            {isPriced ? product.price?.amount : "To be confirmed"}
          </span>
          <button
            type="button"
            onClick={() => add(product)}
            data-cursor="link"
            aria-label={`Add ${product.title} to the cart — no charge, demonstration only`}
            className="border border-line px-4 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-brass/60 hover:text-brass-bright"
          >
            Add to cart
          </button>
        </p>
      </div>
    </article>
  );
}
