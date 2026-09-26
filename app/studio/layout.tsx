import type { Metadata } from "next";
import Link from "next/link";
import StudioShell from "@/components/studio-shell";
import { demoBanner } from "@/content/studio";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s · Studio" },
  description:
    "Internal demonstration admin — dashboard, academy, sessions, catalogue and content management. All records are placeholder data.",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/studio", label: "Dashboard", no: "01" },
  { href: "/studio/academy", label: "Academy", no: "02" },
  { href: "/studio/sessions", label: "Sessions", no: "03" },
  { href: "/studio/shop", label: "Catalogue", no: "04" },
  { href: "/studio/cms", label: "Content", no: "05" },
  { href: "/studio/releases", label: "Releases", no: "06" },
];

/** The admin gets its own frame, but it lives inside the same design language
 *  and behind the same providers as the public site. */
export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return (
    <div className="min-h-screen bg-coal">
      <div className="border-b border-line bg-ink">
        <div className="mx-auto w-full max-w-[92rem] px-6 py-5 md:px-10 lg:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-baseline gap-4">
              <span className="font-display text-xl tracking-tight text-paper">Studio</span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-mute">
                Internal · demonstration
              </span>
            </p>
            <Link
              href="/"
              className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-brass-bright"
            >
              ← Public site
            </Link>
          </div>
        </div>
      </div>

      <StudioShell links={LINKS}>{children}</StudioShell>

      <div className="border-t border-line bg-ink">
        <div className="mx-auto w-full max-w-[92rem] px-6 py-6 md:px-10 lg:px-14">
          <p className="font-mono text-[0.56rem] uppercase leading-[1.9] tracking-[0.2em] text-mute">
            {demoBanner}
          </p>
        </div>
      </div>
    </div>
  );
}
