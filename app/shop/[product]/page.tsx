import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/page-hero";
import AddToCart from "@/components/add-to-cart";
import PlaceholderArt from "@/components/ui/placeholder-art";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { GhostLink, Pending, SourceNote } from "@/components/ui/atoms";
import { getProduct, getProductHandles, getCatalog } from "@/lib/commerce";
import { shop } from "@/content/platform";

export async function generateStaticParams() {
  return (await getProductHandles()).map((handle) => ({ product: handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[product]">): Promise<Metadata> {
  const { product: handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.blurb,
    alternates: { canonical: `/shop/${product.handle}` },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/[product]">) {
  const { product: handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const { products } = await getCatalog();
  const related = products.filter((p) => p.handle !== product.handle).slice(0, 3);
  const category = shop.categories.find((c) => c.key === product.category);

  return (
    <>
      <PageHero
        index="Shop"
        eyebrow={category?.label ?? "Catalogue"}
        headline={[product.title, product.badge ?? "To be confirmed."]}
        intro={product.detail.story}
        meta={[
          { label: "Category", value: category?.label ?? null },
          { label: "Price", value: product.price?.amount ?? null },
          { label: "Availability", value: product.variants[0]?.availableForSale ? "In stock" : "Not yet published" },
        ]}
      />

      <section className="bg-ink pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-coal">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText}
                  width={1200}
                  height={1500}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <PlaceholderArt seed={product.seed} label={product.title} />
              )}
            </div>

            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-mute">
                {product.blurb}
              </p>
              <div className="mt-8">
                <AddToCart product={product} />
              </div>

              <div className="mt-10">
                <h2 className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
                  Specification
                </h2>
                <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {product.detail.specs.map((s) => (
                    <div key={s.label} className="border-t border-line pt-4">
                      <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                        {s.label}
                      </dt>
                      <dd className="mt-2 text-sm text-paper">
                        <Pending value={s.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {product.detail.notes.length ? (
                <div className="mt-10">
                  <h2 className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
                    Notes
                  </h2>
                  <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">
                    {product.detail.notes.map((s) => (
                      <div key={s.label} className="border-t border-line pt-4">
                        <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
                          {s.label}
                        </dt>
                        <dd className="mt-2 text-sm text-paper">
                          <Pending value={s.value} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              <p className="mt-10 border-l border-brass/40 pl-4 font-mono text-[0.62rem] uppercase leading-[1.9] tracking-[0.18em] text-mute">
                {product.detail.fulfilment}
              </p>
              <p className="mt-6">
                <SourceNote source="demo" label="Catalogue slot — not a live product" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="bg-coal py-20 md:py-28">
          <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
            <p className="flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute">
              <span className="text-brass">Also in the catalogue</span>
            </p>
            <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RevealItem key={p.handle}>
                  <a
                    href={`/shop/${p.handle}`}
                    className="group flex h-full flex-col border border-line p-6 transition-colors hover:border-brass/40"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border border-line bg-smoke">
                      {p.featuredImage ? (
                        <Image
                          src={p.featuredImage.url}
                          alt={p.featuredImage.altText}
                          width={1200}
                          height={900}
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                        />
                      ) : (
                        <PlaceholderArt seed={p.seed} label={p.title} />
                      )}
                    </div>
                    <p className="mt-5 font-display text-2xl leading-none tracking-tight text-bone transition-colors group-hover:text-brass-bright">
                      {p.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-bone/80">{p.blurb}</p>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
            <div className="mt-12">
              <GhostLink href="/shop">Back to the shop</GhostLink>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
