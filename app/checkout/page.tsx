import type { Metadata } from "next";
import CheckoutFlow from "@/components/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Demonstration checkout. No payment is processed and no order is created.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
