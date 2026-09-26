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

export type ProductDetail = {
  /** Longer editorial paragraph for `/shop/[product]`. */
  story: string;
  /** Spec sheet. A `null` value renders "To be confirmed" — never invented. */
  specs: { label: string; value: string | null }[];
  /** Sizing / care / edition notes, all pending real client detail. */
  notes: { label: string; value: string | null }[];
  /** What happens after you enquire, stated honestly. */
  fulfilment: string;
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
  /** Long-form content for the product route. */
  detail: ProductDetail;
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
const pending = (rows: [string, string | null][]): ProductDetail["specs"] =>
  rows.map(([label, value]) => ({ label, value }));

const enquiryFlow: ProductDetail["fulfilment"] =
  "This item is a catalogue slot, not a live product. Enquiries are collected and confirmed by the studio — nothing is charged here, and no order is placed.";

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
    detail: {
      story:
        "A tour tee for the stage rather than the queue — heavyweight, boxy, built to survive a load-in. The design and print are to be decided with the artist.",
      specs: pending([
        ["Material", null],
        ["Fit", null],
        ["Print", null],
        ["Edition", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Sizing", null],
        ["Care", null],
        ["Availability", null],
      ]),
      fulfilment: enquiryFlow,
    },
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
    detail: {
      story:
        "The studio-side counterpart to the Tour Tee — reserved for the room rather than the road. Graphics and fabric are to be confirmed.",
      specs: pending([
        ["Material", null],
        ["Fit", null],
        ["Print", null],
        ["Edition", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Sizing", null],
        ["Care", null],
        ["Availability", null],
      ]),
      fulfilment: enquiryFlow,
    },
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
    detail: {
      story:
        "An unstructured cap — the third apparel slot, kept deliberately minimal so the design can be the loud part. Sizing and embroidery to follow.",
      specs: pending([
        ["Material", null],
        ["Structure", null],
        ["Branding", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Sizing", null],
        ["Care", null],
        ["Availability", null],
      ]),
      fulfilment: enquiryFlow,
    },
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
    detail: {
      story:
        "Kalpana was built and released in chapters. A physical edition is the natural shape for a record that arrived that way — the pressing, the edition size and the sleeve are all to be decided with the artist before anything is announced.",
      specs: pending([
        ["Format", null],
        ["Track count", null],
        ["Pressing", null],
        ["Edition size", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Sleeve", null],
        ["Includes", null],
        ["Availability", null],
      ]),
      fulfilment:
        "Enquiries about a physical edition are collected by the studio. Nothing is reserved or charged at this point.",
    },
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
    detail: {
      story:
        "The CD slot alongside the vinyl, held for the same reason: a record released in chapters deserves a physical object that gathers them. Details to be confirmed.",
      specs: pending([
        ["Format", "CD"],
        ["Track count", null],
        ["Packaging", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Booklet", null],
        ["Availability", null],
      ]),
      fulfilment:
        "Enquiries about a physical edition are collected by the studio. Nothing is reserved or charged at this point.",
    },
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
    detail: {
      story:
        "A numbered print from a limited run, and the item most often asked about after a show. Edition size, paper and which image it carries are all to be agreed with the artist.",
      specs: pending([
        ["Image", null],
        ["Paper", null],
        ["Size", null],
        ["Edition size", null],
        ["Signed", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Framing", null],
        ["Shipping", null],
        ["Availability", null],
      ]),
      fulfilment:
        "Signed items are confirmed individually by the studio. Enquiries list the edition and the image; nothing is charged online.",
    },
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
    detail: {
      story:
        "A poster from the live archive. Which show it documents, and the size it prints at, are to be confirmed.",
      specs: pending([
        ["Show", null],
        ["Size", null],
        ["Paper", null],
        ["Edition size", null],
        ["Price", null],
      ]),
      notes: pending([
        ["Framing", null],
        ["Shipping", null],
        ["Availability", null],
      ]),
      fulfilment: enquiryFlow,
    },
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
    detail: {
      story:
        "A studio notebook — the sort that ends up full of arrangement arrows and half-sentences. The last slot in this demonstration catalogue.",
      specs: pending([
        ["Format", null],
        ["Pages", null],
        ["Paper", null],
        ["Price", null],
      ]),
      notes: pending([["Availability", null]]),
      fulfilment: enquiryFlow,
    },
  },
];

/**
 * Resolves the storefront catalogue. Mock today; a Storefront API call later.
 * `await` is deliberate so the swap needs no signature change.
 */
export async function getCatalog(): Promise<Catalog> {
  return { products: demoProducts, source: "mock" };
}

/** Resolves one product for `/shop/[product]`, or `undefined` to trigger 404. */
export async function getProduct(handle: string): Promise<Product | undefined> {
  return demoProducts.find((p) => p.handle === handle);
}

/** Slugs for `generateStaticParams()` on `/shop/[product]`. */
export async function getProductHandles(): Promise<string[]> {
  return demoProducts.map((p) => p.handle);
}

/** Same products, grouped by the category keys `shop.categories` defines. */
export async function getCatalogByCategory(): Promise<Record<string, Product[]>> {
  return demoProducts.reduce<Record<string, Product[]>>((acc, product) => {
    (acc[product.category] ??= []).push(product);
    return acc;
  }, {});
}

/** Enquiry link for items without a live checkout. */
export function enquiryHref(subject: string): string {
  return `mailto:johnpaulstudio1@gmail.com?subject=${encodeURIComponent(subject)}`;
}

/** Re-exported so the shop UI reads its labels from the content layer. */
export { shop };
