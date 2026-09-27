"use client";

import { useRouter, usePathname } from "next/navigation";
import { useScrollTo } from "./smooth-scroll";

/**
 * "Back to top" that works on every route.
 *
 * The footer lives in the root layout, so it renders on all 24 routes — but the
 * hero's `id="top"` only exists on the homepage. The old `href="#top"` was
 * therefore a dead link on 23 of 24 pages: it changed the hash and moved
 * nothing.
 *
 * So: scroll when there is a top to scroll to, route home when there is not.
 * `router.push` rather than `replace`, so the homepage is added to the history
 * and pressing Back returns to where you were. And `push` rather than a raw
 * `location.assign` — the latter would throw away the SPA and reload every
 * script on the page.
 */
export default function BackToTop() {
  const { scrollTo } = useScrollTo();
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  return (
    <button
      type="button"
      onClick={() => {
        if (isHome) {
          scrollTo("#top");
          return;
        }
        // Next navigates; the smooth-scroll layer's pathname effect then finds
        // the freshly-rendered `#top` and scrolls to it.
        router.push("/#top");
      }}
      data-cursor="link"
      className="group inline-flex items-center gap-2 transition-colors hover:text-brass-bright"
    >
      {isHome ? "Back to top" : "Back to the top"}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        ↑
      </span>
    </button>
  );
}
