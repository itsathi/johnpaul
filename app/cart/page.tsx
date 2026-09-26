import type { Metadata } from "next";
import PageHero from "@/components/ui/page-hero";
import CartTable from "@/components/cart-table";
import { GhostLink } from "@/components/ui/atoms";
import { shop } from "@/content/platform";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your cart. Demonstration only — nothing is charged and no order is placed.",
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        index="05"
        eyebrow="Cart"
        headline={["What you", "are holding."]}
        compact
        meta={[{ label: "Status", value: "Demonstration — nothing is charged" }]}
      />
      <section className="bg-ink pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
          <CartTable />
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <GhostLink href="/shop">Keep browsing the shop</GhostLink>
            <GhostLink href="/checkout">Go to checkout</GhostLink>
          </div>
          <p className="mt-10 border-l border-brass/40 pl-4 font-mono text-[0.62rem] uppercase leading-[1.9] tracking-[0.18em] text-mute">
            {shop.note}
          </p>
        </div>
      </section>
    </>
  );
}
