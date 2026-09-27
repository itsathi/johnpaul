"use client";

/**
 * Product card. Renders `featuredImage` when the catalogue carries one and
 * falls back to the generated plate when it does not, so a real store can
 * replace the mock data without a change here.
 */

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/providers/commerce-provider";
import PlaceholderArt from "./ui/placeholder-art";
import type { Product } from "@/lib/commerce";

export default function ProductCard({ product }: { product: Product }) {
  const { add, isPriced } = useCart();

  return (
    <article className="group flex h-full flex-col border border-line transition-colors duration-500 hover:border-brass/40">
      <Link
        href={`/shop/${product.handle}`}
        className="relative block aspect-[4/5] overflow-hidden bg-coal"
        data-cursor="link"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 44vw, 92vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
            <PlaceholderArt seed={product.seed} label={product.title} />
          </div>
        )}

        {/* keeps the badge legible over a photograph without darkening the whole plate */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

        {product.badge ? (
          <span className="absolute left-4 top-4 border border-line bg-ink/70 px-2.5 py-1 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-mute backdrop-blur-sm transition-colors duration-500 group-hover:border-brass/40 group-hover:text-brass-bright">
            {product.badge}
          </span>
        ) : null}

        <span
          className="absolute bottom-4 right-4 translate-y-2 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-bone opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden
        >
          View
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-none tracking-tight text-bone transition-colors duration-500 group-hover:text-brass-bright">
          <Link href={`/shop/${product.handle}`} data-cursor="link">
            {product.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-bone/80">{product.blurb}</p>
        <p className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 transition-colors duration-500 group-hover:border-brass/25">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute">
            {isPriced ? product.price?.amount : "To be confirmed"}
          </span>
          <button
            type="button"
            onClick={() => add(product)}
            data-cursor="link"
            aria-label={`Add ${product.title} to the cart — no charge, demonstration only`}
            className="border border-line px-4 py-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-bone transition-colors duration-500 hover:border-brass/60 hover:text-brass-bright"
          >
            Add to cart
          </button>
        </p>
      </div>
    </article>
  );
}
