import { shop } from "@/content/platform";

/**
 * Commerce layer.
 *
 * The storefront UI (`components/shop-section.tsx`) knows nothing about where
 * products come from — it renders whatever `getCatalog()` resolves. That
 * function currently returns local demo data, but it is deliberately shaped
 * after a Shopify Storefront API product node so a real integration is a
 * change to this file only:
 *
 *   export async function getCatalog(): Promise<Catalog> {
 *     const res = await fetch(process.env.SHOPIFY_STOREFRONT_URL!, {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_TOKEN!,
 *       },
 *       body: JSON.stringify({ query: CATALOG_QUERY }),
 *     });
 *     ...
 *   }
 *
 * Nothing in the components needs to change. Cart, checkout and inventory are
 * out of scope for the demo — this is presentation, not a store.
 */

export type Money = {
  amount: string;
  currencyCode: string;
} | null;

export type ProductImage = {
  url: string;
  altText: string;
} | null;

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  /** Maps to a key in `shop.categories`; "all" is the unfiltered view. */
  category: string;
  blurb: string;
  /** Small card marker, e.g. an edition size or "Signed". */
  badge: string | null;
  price: Money;
  status: "ACTIVE" | "DRAFT";
  /** Null until real product photography exists — the UI draws a plate instead. */
  featuredImage: ProductImage;
  /** Seed for the on-brand generative placeholder art. */
  seed: number;
  variants: ProductVariant[];
};

export type Catalog = {
  products: Product[];
  /** Which layer answered — surfaced in the UI so the demo never lies. */
  source: "mock" | "storefront";
};

const unpriced = (handle: string): ProductVariant => ({
  id: `gid://shopify/ProductVariant/${handle}-default`,
  title: "Default",
  availableForSale: false,
  price: null,
});

/**
 * Demonstration catalogue.
 *
 * These are placeholder slots in the shape of a real catalogue, not products.
 * Every price is `null` and renders as "Enquire", every item is flagged
 * `availableForSale: false`, and the card carries a DEMO marker. No product
 * name, price, edition size or stock level here is real.
 */
const demoProducts: Product[] = [
  {
    id: "gid://shopify/Product/apparel-tee-tour",
    handle: "apparel-tee-tour",
    title: "Tour Tee",
    category: "apparel",
    blurb:
      "Heavyweight cotton, cut for the stage. The first apparel slot in the catalogue.",
    badge: "Placeholder",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 11,
    variants: [unpriced("apparel-tee-tour")],
  },
  {
    id: "gid://shopify/Product/apparel-tee-studio",
    handle: "apparel-tee-studio",
    title: "Studio Tee",
    category: "apparel",
    blurb:
      "A second apparel slot, reserved for the studio and session side of the work.",
    badge: "Placeholder",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 23,
    variants: [unpriced("apparel-tee-studio")],
  },
  {
    id: "gid://shopify/Product/apparel-cap",
    handle: "apparel-cap",
    title: "Cap",
    category: "apparel",
    blurb: "Unstructured cap. Third apparel slot, sizing to follow.",
    badge: "Placeholder",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 37,
    variants: [unpriced("apparel-cap")],
  },
  {
    id: "gid://shopify/Product/music-vinyl-kalpana",
    handle: "music-vinyl-kalpana",
    title: "Vinyl — Kalpana",
    category: "music",
    blurb:
      "Physical release slot. Vinyl for Kalpana has been asked about publicly; the edition, pressing and price are still to be confirmed.",
    badge: "Awaiting details",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 5,
    variants: [unpriced("music-vinyl-kalpana")],
  },
  {
    id: "gid://shopify/Product/physical-cd-kalpana",
    handle: "physical-cd-kalpana",
    title: "CD — Kalpana",
    category: "physical",
    blurb:
      "CD slot alongside the vinyl. Physical editions are the first thing early listeners are told about.",
    badge: "Awaiting details",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 19,
    variants: [unpriced("physical-cd-kalpana")],
  },
  {
    id: "gid://shopify/Product/limited-print-kalpana",
    handle: "limited-print-kalpana",
    title: "Signed Print",
    category: "limited",
    blurb:
      "A numbered print for a limited run. Edition size and signing are to be decided with the artist.",
    badge: "Awaiting details",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 29,
    variants: [unpriced("limited-print-kalpana")],
  },
  {
    id: "gid://shopify/Product/limited-poster-kalpana",
    handle: "limited-poster-kalpana",
    title: "Poster",
    category: "limited",
    blurb:
      "Poster slot from the live archive — a second limited-edition placeholder.",
    badge: "Placeholder",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 41,
    variants: [unpriced("limited-poster-kalpana")],
  },
  {
    id: "gid://shopify/Product/limited-notebook",
    handle: "limited-notebook",
    title: "Notebook",
    category: "limited",
    blurb: "Studio notebook. The last catalogue slot in this demonstration set.",
    badge: "Placeholder",
    price: null,
    status: "DRAFT",
    featuredImage: null,
    seed: 53,
    variants: [unpriced("limited-notebook")],
  },
];

/**
 * Resolves the storefront catalogue. Mock today; a Storefront API call later.
 * `await` is deliberate so the swap needs no signature change.
 */
export async function getCatalog(): Promise<Catalog> {
  return { products: demoProducts, source: "mock" };
}

/** Enquiry link for items without a live checkout. */
export function enquiryHref(subject: string): string {
  return `mailto:johnpaulstudio1@gmail.com?subject=${encodeURIComponent(subject)}`;
}

/** Re-exported so the shop UI reads its labels from the content layer. */
export { shop };
