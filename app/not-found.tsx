import Link from "next/link";
import { kalpanaProgress } from "@/content/releases";

/**
 * Rendered for `notFound()` calls and unmatched routes. It sits inside the
 * root layout, so the navigation and footer are already in place.
 */

const DOORS = [
  { href: "/music", label: "Music", note: "Releases, Kalpana and the live work" },
  { href: "/artist", label: "Artist", note: "The story behind the playing" },
  { href: "/sessions", label: "Sessions", note: "Studio work and booking" },
  { href: "/academy", label: "Academy", note: "Lessons, classes and membership" },
  { href: "/gallery", label: "Gallery", note: "28 photographs from the archive" },
  { href: "/shop", label: "Shop", note: "Records, apparel and editions" },
  { href: "/contact", label: "Contact", note: "A reason-driven enquiry form" },
  { href: "/studio", label: "Studio", note: "Internal demonstration admin" },
];

export default function NotFound() {
  return (
    <section className="bg-ink py-32 md:py-44">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <p className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.32em] text-mute">
          <span className="text-brass">404</span>
          <span className="h-px w-8 bg-line" />
          <span>This page does not exist</span>
        </p>

        <h1
          className="mt-8 max-w-4xl font-display leading-[0.92] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(2.6rem, 8vw, 6.4rem)" }}
        >
          An unfinished measure.
        </h1>

        <p className="mt-7 max-w-xl text-sm leading-relaxed text-bone">
          The link points at something that was never written — or at a chapter
          of Kalpana that has not been released yet.{" "}
          {kalpanaProgress.released} of {kalpanaProgress.total} chapters are
          public.
        </p>

        <ul className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {DOORS.map((d, i) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="group flex h-full flex-col bg-ink p-6 transition-colors hover:bg-coal"
              >
                <span className="font-mono text-[0.55rem] tracking-[0.24em] text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-6 font-display text-2xl leading-none tracking-tight text-paper transition-colors group-hover:text-brass-bright">
                  {d.label}
                </span>
                <span className="mt-3 text-xs leading-relaxed text-mute">{d.note}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14">
          <Link
            href="/"
            className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright underline underline-offset-8"
          >
            ← Return to the front page
          </Link>
        </p>
      </div>
    </section>
  );
}
