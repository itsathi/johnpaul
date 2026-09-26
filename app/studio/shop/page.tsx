import type { Metadata } from "next";
import Link from "next/link";
import { Cell, DataTable, Panel, Pending, Row, StatTile, StatusPill, StudioHeading } from "@/components/studio-kit";
import { inventory } from "@/content/studio";
import { getCatalog } from "@/lib/commerce";

export const metadata: Metadata = { title: "Catalogue" };

export default async function StudioShop() {
  const catalog = await getCatalog();
  const priced = catalog.products.filter((p) => p.price).length;

  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Catalogue"
        title="Inventory, pricing and publication state."
        intro="Every product is a DRAFT slot with no price and no stock level. This is the shape a Storefront API response would map onto."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Products" value={String(catalog.products.length)} note="All draft" />
        <StatTile label="Priced" value={`${priced} of ${catalog.products.length}`} note="No price is published" />
        <StatTile label="Stock tracked" value="None" note="Inventory is out of scope for the demo" />
        <StatTile label="Source layer" value={catalog.source} note="Swap point for a real store" />
      </div>

      <Panel title="Inventory">
        <DataTable columns={["Handle", "Title", "Category", "Price", "Stock", "Status"]}>
          {inventory.map((row) => (
            <Row key={row.handle}>
              <Cell mono>{row.handle}</Cell>
              <Cell>
                <Link
                  href={`/shop/${row.handle}`}
                  className="text-paper transition-colors hover:text-brass-bright"
                >
                  {row.title}
                </Link>
              </Cell>
              <Cell>{row.category}</Cell>
              <Cell>
                <Pending value={row.price} />
              </Cell>
              <Cell>
                <Pending value={row.stock} />
              </Cell>
              <Cell>
                <StatusPill value={row.status} />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}
