"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Sidebar navigation for the admin. Client only so it can mark the current
 *  section; the layout that hosts it stays a server component. */
export default function StudioShell({
  links,
  children,
}: {
  links: { href: string; label: string; no: string }[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
      <div className="grid gap-8 py-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
        <nav aria-label="Studio sections">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href} className="shrink-0">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 border px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${
                      active
                        ? "border-brass/60 bg-brass/10 text-brass-bright"
                        : "border-line text-bone hover:border-brass/40"
                    }`}
                  >
                    <span className={active ? "text-brass" : "text-mute/60"}>{l.no}</span>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
