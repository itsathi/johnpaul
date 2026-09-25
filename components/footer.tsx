import { artist } from "@/content/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-10 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
        <div>
          <p className="font-display text-2xl tracking-tight text-paper">
            {artist.name}
          </p>
          <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-mute">
            {artist.descriptor}
          </p>
        </div>

        <p className="max-w-sm text-xs leading-relaxed text-mute">
          Private concept &amp; demonstration created to show what a website for
          John Paul could become. All photography © its respective owners and
          shown here for presentation only. Nothing is claimed or for sale.
        </p>

        <div className="flex items-center gap-8 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-mute">
          <span>Kolkata → the world</span>
          <a
            href="#top"
            data-cursor="link"
            className="flex items-center gap-2 transition-colors hover:text-brass-bright"
          >
            Back to top
            <span aria-hidden>↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}