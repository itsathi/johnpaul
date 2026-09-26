import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import ProductCard from "@/components/product-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SourceNote } from "@/components/ui/atoms";
import { getCatalog, getCatalogByCategory } from "@/lib/commerce";
import { shop } from "@/content/platform";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Apparel, physical editions of Kalpana and limited-run prints. Every item is currently an unpriced catalogue slot — the studio confirms availability and pricing directly.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const catalog = await getCatalog();
  const byCategory = await getCatalogByCategory();
  const categories = shop.categories.filter((c) => c.key !== "all");

  return (
    <>
      <PageHero
        index="05"
        eyebrow="Shop"
        headline={["Objects", "from", "the record."]}
        intro="Apparel, physical editions of Kalpana and a small number of limited prints. Nothing is priced yet and nothing is sold through this site — the catalogue below is the shape of the store to come."
        meta={[
          { label: "Items", value: `${catalog.products.length} catalogue slots` },
          { label: "Priced", value: null },
          { label: "Source", value: catalog.source === "mock" ? "Demonstration catalogue" : "Live storefront" },
        ]}
        actions={[{ label: "Enquire about an item", href: "/contact" }]}
      >
        <p className="max-w-2xl border-l border-brass/40 pl-4 font-mono text-[0.62rem] uppercase leading-[1.9] tracking-[0.18em] text-mute">
          {shop.note}
        </p>
      </PageHero>

      <section className="bg-ink pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          {categories.map((cat) => {
            const items = byCategory[cat.key] ?? [];
            if (!items.length) return null;
            return (
              <div key={cat.key} id={cat.key} className="scroll-mt-28 border-t border-line py-14 first:border-t-0 first:pt-0">
                <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">
                  <div>
                    <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
                      <span className="text-brass">{cat.no}</span>
                      <span className="h-px w-8 bg-line" />
                      <span>{cat.label}</span>
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-bone/80">{cat.note}</p>
                    <p className="mt-5">
                      <SourceNote source="demo" label={`${items.length} placeholder slots`} />
                    </p>
                  </div>
                  <RevealGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((product) => (
                      <RevealItem key={product.handle}>
                        <ProductCard product={product} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
