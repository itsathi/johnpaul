"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import MagneticButton from "./ui/magnetic-button";
import PlaceholderArt from "./ui/placeholder-art";
import { shop } from "@/content/platform";
import { enquiryHref, type Product } from "@/lib/commerce";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The storefront. Merchandise treated as a section of the platform rather than a
 * footnote — but presented honestly: the catalogue arrives from `lib/commerce`
 * on the server, and until a real store is connected it is flagged as a
 * demonstration on every card, priced "Enquire" rather than with an invented
 * number, and never presented as for sale.
 *
 * The card layout takes a `Product` shaped like a Shopify Storefront API node,
 * so pointing the fetch at a real store changes no JSX here.
 */
export default function ShopSection({
  products,
  source,
  index = "16",
  label = shop.kicker,
}: {
  products: Product[];
  source: "mock" | "storefront";
  index?: string;
  label?: string;
}) {
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () =>
      filter === "all" ? products : products.filter((p) => p.category === filter),
    [filter, products],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const p of products) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [products]);

  return (
    <section id="shop" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index={index} label={label} />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
          <h2
            className="font-display leading-[0.9] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.6rem, 7.4vw, 6.6rem)" }}
          >
            {shop.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block will-change-transform ${
                    i === shop.headline.length - 1
                      ? "italic text-brass-bright"
                      : ""
                  }`}
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{ duration: 1.1, delay: i * 0.09, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <div className="flex flex-col gap-6">
            <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
              {shop.intro}
            </p>
            {source === "mock" ? (
              <p className="inline-flex w-fit items-center gap-3 rounded-full border border-brass/40 bg-brass/8 px-4 py-2 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-brass-bright">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                Demonstration catalogue
              </p>
            ) : null}
          </div>
        </div>

        {/* ---- filters ---- */}
        <div className="mt-14 flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-line py-5 md:mt-20">
          {shop.categories.map((cat) => {
            const isOn = filter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setFilter(cat.key)}
                aria-pressed={isOn}
                data-cursor="link"
                className={`rounded-full border px-5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.22em] transition-all duration-300 ${
                  isOn
                    ? "border-brass bg-brass/10 text-brass-bright"
                    : "border-line text-mute hover:border-brass/50 hover:text-bone"
                }`}
              >
                {cat.label}
                <span className="ml-2 text-mute/60">{counts[cat.key] ?? 0}</span>
              </button>
            );
          })}
        </div>

        {/* ---- grid ---- */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product, i) => (
            <motion.article
              key={product.id}
              className="group flex flex-col border border-line bg-coal/50 transition-colors duration-500 hover:border-brass/45 hover:bg-coal"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: EASE }}
            >
              <div className="relative overflow-hidden">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText}
                    width={1200}
                    height={1200}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                    className="aspect-square w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]">
                    <PlaceholderArt seed={product.seed} className="aspect-square w-full" />
                  </div>
                )}

                {/* keeps the badge legible over a photograph without flattening the plate */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="absolute top-4 left-4 rounded-full border border-line bg-ink/70 px-3 py-1 font-mono text-[0.48rem] uppercase tracking-[0.24em] text-mute backdrop-blur-sm transition-colors duration-500 group-hover:border-brass/45 group-hover:text-brass-bright">
                  {product.badge ?? "Demo"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl leading-tight tracking-tight text-paper">
                  {product.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.8rem] leading-relaxed text-bone/85">
                  {product.blurb}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-4">
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-brass-bright">
                    {product.price
                      ? `${product.price.amount} ${product.price.currencyCode}`
                      : "Enquire"}
                  </span>
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-mute">
                    {product.variants[0]?.availableForSale
                      ? "In stock"
                      : "Not on sale"}
                  </span>
                </div>

                <MagneticButton
                  as="a"
                  href={enquiryHref(`${shop.cta.subject} — ${product.title}`)}
                  strength={0.2}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-line font-mono text-[0.56rem] uppercase tracking-[0.22em] text-bone transition-colors hover:border-brass hover:text-brass-bright"
                  ariaLabel={`${shop.cta.label} about ${product.title} — opens your email client`}
                >
                  {shop.cta.label}
                </MagneticButton>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 flex max-w-3xl items-start gap-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.24em] text-mute">
          <span className="mt-1.5 h-px w-8 shrink-0 bg-brass" />
          {shop.note}
        </p>
      </div>
    </section>
  );
}
