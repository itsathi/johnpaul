"use client";

/**
 * A link that knows whether its target is on this page or another one.
 *
 * ── THE PROBLEM THIS SOLVES ────────────────────────────────────────────────
 * The site has two kinds of internal link and they were being written by hand
 * as `scrollTo("#contact")` — which silently breaks the moment a section is
 * not on the current route. Four such calls existed; on three of the four
 * routes they were not just dead but actively wrong, because `scrollTo`
 * rewrites the URL to `/sessions#contact` *before* discovering there is no
 * `#contact` to scroll to. So a broken button also left a broken address bar
 * behind it.
 *
 * `SectionLink` resolves the target at click time:
 *
 *   target exists on this page  → in-page scroll, no navigation, no URL churn
 *   target does not             → a normal Next navigation to the route that
 *                                 owns it, carrying the hash so the smooth
 *                                 scroll layer can finish the job
 *   unknown route entirely      → falls back to the pathname, which is always
 *                                 better than a dead button
 *
 * So a link can be pointed at an anchor that only exists on some of the
 * routes that render it, and it will work on all of them.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { useScrollTo } from "@/components/smooth-scroll";

type SectionLinkProps = {
  /** `#anchor` for this page, or a route — with or without a hash. */
  href: string;
  children: ReactNode;
  className?: string;
  /** Passed through so callers can keep their own analytics/labels. */
  "aria-label"?: string;
  title?: string;
  "data-cursor"?: string;
  target?: string;
  rel?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className">;

export default function SectionLink({
  href,
  children,
  className = "",
  ...rest
}: SectionLinkProps) {
  const { scrollTo } = useScrollTo();
  const pathname = usePathname();

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Let the browser handle anything that isn't a plain left click.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      if (rest.target && rest.target !== "_self") return;

      // Pure in-page anchor: only intercept when the target is really here.
      if (href.startsWith("#")) {
        if (!document.querySelector(href)) return; // let Next/router try
        event.preventDefault();
        scrollTo(href);
        return;
      }

      // Cross-route with a hash, and we are already on that route. Let the
      // smooth-scroll layer do the arrival, same as an in-page scroll.
      const [route, hash] = href.split("#");
      if (hash && route === pathname) {
        event.preventDefault();
        scrollTo(`#${hash}`);
      }
      // Anything else: a real navigation. No preventDefault, so Next routes it.
    },
    [href, pathname, rest.target, scrollTo],
  );

  return (
    <Link href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
