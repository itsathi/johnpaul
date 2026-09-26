import type { Metadata } from "next";
import BookingFlow from "@/components/booking-flow";
import { bookingCopy } from "@/content/booking";

export const metadata: Metadata = {
  title: "Request a Session",
  description:
    "Send the studio a session brief — live performance, session recording, production and arrangement, or an artist project. Six steps, no payment taken online.",
  alternates: { canonical: "/sessions/book" },
};

/** Client: the six-step draft lives in `BookingProvider`, mounted by the root
 *  layout, so this route stays a thin server shell. */
export default function BookPage() {
  return <BookingFlow copy={bookingCopy} />;
}
