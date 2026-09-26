"use client";

/**
 * Commerce provider — cart state for `/shop`, `/cart` and `/checkout`.
 *
 * ── DEMO ────────────────────────────────────────────────────────────────────
 * Every product in the catalogue is unpriced and `DRAFT`, so the cart stores
 * *intentions*, not orders. The checkout flow ends in a confirmation screen
 * that says plainly that nothing was charged and no order exists.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * The provider is the single seam a real backend would plug into: swapping the
 * mock for Shopify means replacing the line helpers below and the catalogue,
 * and no consumer component changes, because they only ever touch this context.
 * The shape deliberately mirrors a Shopify Cart API node (`lines`, `cost`,
 * `checkoutUrl`) so the integration is a data swap rather than a rewrite.
 *
 * Only the lines are persisted — reopening the site should not pop the drawer
 * open on a stale page or re-announce a product added ten minutes ago.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePersistedState } from "@/lib/persisted-store";
import type { Product } from "@/lib/commerce";

export type CartLine = {
  handle: string;
  title: string;
  variantTitle: string;
  /** `null` because no product is priced — rendered "To be confirmed". */
  unitPrice: string | null;
  currencyCode: string;
  quantity: number;
  seed: number;
  category: string;
};

export type CartState = {
  lines: CartLine[];
  /** Mirrors a Shopify cart's `checkoutUrl` once a real store is attached. */
  checkoutUrl: string | null;
  opened: boolean;
  /** `null` until a line is added, so the drawer can announce the change. */
  lastAdded: string | null;
};

type PersistedCart = Pick<CartState, "lines" | "checkoutUrl">;

const STORAGE_KEY = "jpshop.cart.v1";
const EMPTY: PersistedCart = { lines: [], checkoutUrl: null };

/** A demo catalogue has one unpriced variant per product. */
function lineFromProduct(product: Product): CartLine {
  const variant = product.variants[0];
  return {
    handle: product.handle,
    title: product.title,
    variantTitle: variant.title,
    unitPrice: variant.price?.amount ?? null,
    currencyCode: variant.price?.currencyCode ?? "INR",
    quantity: 1,
    seed: product.seed,
    category: product.category,
  };
}

function addLine(lines: CartLine[], product: Product, quantity: number): CartLine[] {
  const next = { ...lineFromProduct(product), quantity };
  const existing = lines.find(
    (l) => l.handle === next.handle && l.variantTitle === next.variantTitle,
  );
  if (!existing) return [...lines, next];
  return lines.map((l) =>
    l.handle === next.handle && l.variantTitle === next.variantTitle
      ? { ...l, quantity: l.quantity + quantity }
      : l,
  );
}

function removeLine(lines: CartLine[], handle: string, variantTitle: string): CartLine[] {
  return lines.filter((l) => !(l.handle === handle && l.variantTitle === variantTitle));
}

function setLineQuantity(
  lines: CartLine[],
  handle: string,
  variantTitle: string,
  quantity: number,
): CartLine[] {
  const next = Math.max(0, quantity);
  return lines.flatMap((l) => {
    if (l.handle !== handle || l.variantTitle !== variantTitle) return [l];
    return next === 0 ? [] : [{ ...l, quantity: next }];
  });
}

type CommerceContextValue = {
  lines: CartLine[];
  count: number;
  opened: boolean;
  lastAdded: string | null;
  /** `null` throughout the demo — a real store would return a total. */
  subtotal: string | null;
  currencyCode: string;
  isPriced: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (handle: string, variantTitle: string) => void;
  setQuantity: (handle: string, variantTitle: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistedState<PersistedCart>(STORAGE_KEY, EMPTY);
  const [opened, setOpened] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const lines = Array.isArray(cart.lines) ? cart.lines : EMPTY.lines;

  /** One write path, so a malformed document can never half-apply. */
  const updateLines = useCallback(
    (change: (current: CartLine[]) => CartLine[]) => {
      setCart((previous) => ({
        checkoutUrl: previous.checkoutUrl ?? null,
        lines: change(Array.isArray(previous.lines) ? previous.lines : EMPTY.lines),
      }));
    },
    [setCart],
  );

  const add = useCallback(
    (product: Product, quantity = 1) => {
      updateLines((current) => addLine(current, product, quantity));
      setOpened(true);
      setLastAdded(product.handle);
    },
    [updateLines],
  );

  const remove = useCallback(
    (handle: string, variantTitle: string) => {
      updateLines((current) => removeLine(current, handle, variantTitle));
    },
    [updateLines],
  );

  const setQuantity = useCallback(
    (handle: string, variantTitle: string, quantity: number) => {
      updateLines((current) => setLineQuantity(current, handle, variantTitle, quantity));
    },
    [updateLines],
  );

  const clear = useCallback(() => {
    setCart(() => EMPTY);
    setLastAdded(null);
  }, [setCart]);

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened((was) => !was), []);

  const value = useMemo<CommerceContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const priced = lines.length > 0 && lines.every((l) => l.unitPrice !== null);
    return {
      lines,
      count,
      opened,
      lastAdded,
      subtotal: null,
      currencyCode: lines[0]?.currencyCode ?? "INR",
      isPriced: priced,
      add,
      remove,
      setQuantity,
      clear,
      open,
      close,
      toggle,
    };
  }, [lines, opened, lastAdded, add, remove, setQuantity, clear, open, close, toggle]);

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCart(): CommerceContextValue {
  const ctx = useContext(CommerceContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CommerceProvider>");
  }
  return ctx;
}
