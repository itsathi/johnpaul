/**
 * Shared route suspense fallback.
 *
 * Every `loading.tsx` renders this, so a route transition keeps the page
 * rhythm — a title band and the shape of what is coming — instead of dropping
 * to a blank screen. It is a server component: the only motion is a Tailwind
 * pulse that `motion-reduce` turns off.
 */
export default function RouteLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="bg-ink pt-32 md:pt-40" role="status" aria-live="polite">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <p className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.32em] text-mute">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass motion-reduce:animate-none" />
          <span>{label}</span>
        </p>

        <div className="mt-10 max-w-4xl">
          <div className="h-3 w-40 animate-pulse bg-line motion-reduce:animate-none" />
          <div
            className="mt-7 h-12 w-full animate-pulse bg-line/70 motion-reduce:animate-none md:h-16"
            style={{ animationDelay: "80ms" }}
          />
          <div
            className="mt-3 h-12 w-2/3 animate-pulse bg-line/50 motion-reduce:animate-none md:h-16"
            style={{ animationDelay: "160ms" }}
          />
          <div
            className="mt-8 h-3 w-full max-w-xl animate-pulse bg-line/60 motion-reduce:animate-none"
            style={{ animationDelay: "240ms" }}
          />
          <div
            className="mt-3 h-3 w-2/3 max-w-md animate-pulse bg-line/40 motion-reduce:animate-none"
            style={{ animationDelay: "320ms" }}
          />
        </div>

        <div className="mt-20 grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse bg-coal motion-reduce:animate-none"
              style={{ animationDelay: `${120 + i * 120}ms` }}
            />
          ))}
        </div>
      </div>

      <span className="sr-only">{label}…</span>
    </div>
  );
}
