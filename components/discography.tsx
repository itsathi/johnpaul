"use client";

import { motion } from "framer-motion";
import Media from "./ui/media";
import SectionTag from "./ui/section-tag";
import { wix } from "@/lib/media";
import { discography } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Discography() {
  return (
    <section id="releases" className="relative bg-coal pt-24 pb-28 md:pt-36 md:pb-40">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="04" label={discography.kicker} />

        <div className="mt-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2
            className="font-display leading-[0.92] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)" }}
          >
            {discography.headline}
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-bone md:text-right">
            {discography.note}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-10">
          {discography.releases.map((release, i) => (
            <motion.a
              key={release.title}
              href={release.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-line bg-ink"
              data-cursor="link"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Media
                  src={
                    release.artwork.startsWith("http")
                      ? release.artwork
                      : wix(release.artwork, 1600, 1000)
                  }
                  alt={`${release.title} — ${release.type}`}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  placeholderLabel="Release artwork"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full border border-paper/20 bg-ink/50 px-4 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-paper backdrop-blur-sm">
                  {release.type}
                </span>
                {release.meta && (
                  <span className="absolute right-5 top-5 rounded-full bg-brass px-4 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-ink">
                    {release.meta}
                  </span>
                )}
              </div>

              <div className="relative p-7 md:p-9">
                <h3 className="font-display text-4xl tracking-tight text-paper md:text-5xl">
                  {release.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-bone">
                  {release.body}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-mute">
                  {release.of.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-line px-3.5 py-1.5"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <span className="mt-7 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-brass-bright transition-colors group-hover:text-brass">
                  Stream it
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <p className="mt-10 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-mute">
          {discography.coming}
        </p>

        <motion.a
          href={discography.press.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-16 flex flex-col gap-4 border-t border-line pt-10 md:flex-row md:items-center md:justify-between"
          data-cursor="link"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-mute">
              {discography.press.label}
            </span>
            <p className="mt-2 font-display text-2xl italic text-bone transition-colors group-hover:text-paper md:text-3xl">
              {discography.press.title}
            </p>
          </div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-brass-bright">
            Read the interview →
          </span>
        </motion.a>
      </div>
    </section>
  );
}