"use client";

/**
 * Root error boundary. Next 16 hands the segment a `retry` callback rather
 * than the old `reset`, which re-fetches the server components and re-renders
 * only the failed segment.
 */

import { useEffect } from "react";
import Link from "next/link";
import { contact } from "@/content/site";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // A real deployment would report this to its error service.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-ink py-32">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <p className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.32em] text-mute">
          <span className="text-brass">Error</span>
          <span className="h-px w-8 bg-line" />
          <span>Something broke on this route</span>
        </p>

        <h1
          className="mt-8 max-w-3xl font-display leading-[0.94] tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5.4rem)" }}
        >
          A string came loose.
        </h1>

        <p className="mt-7 max-w-xl text-sm leading-relaxed text-bone">
          The page you asked for failed to render. Retrying usually clears it —
          this is a demonstration site with no real data behind it, so the most
          likely cause is a placeholder value that has not been filled in yet.
        </p>

        {error.digest ? (
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mute">
            Reference · {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => retry()}
            className="border border-brass/60 bg-brass/10 px-8 py-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:bg-brass hover:text-ink"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-line px-8 py-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-bone transition-colors hover:border-brass/60"
          >
            Back to the start
          </Link>
          <a
            href={`mailto:${contact.email}`}
            className="px-2 py-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-brass-bright"
          >
            Report it
          </a>
        </div>
      </div>
    </section>
  );
}
