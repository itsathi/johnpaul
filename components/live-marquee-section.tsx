import Image from "next/image";
import Marquee from "./ui/marquee";
import SectionTag from "./ui/section-tag";
import SectionLink from "./ui/section-link";
import { liveShots, liveStatement } from "@/content/site";
import { wix } from "@/lib/media";

/**
 * A live strip for the homepage.
 *
 * The full Live archive stays on `/music`, where `LiveSection` scrubs through
 * the shots with GSAP. This is the short version: two counter-running rows of
 * photographs with their captions, so the homepage shows the stage without
 * duplicating that section or importing its scroll choreography. The link at
 * the end is the hand-off to the real thing.
 *
 * Both rows share `liveShots`, the same register `LiveSection` reads, and the
 * captions are never decorative — they name who was on stage.
 */
export default function LiveMarqueeSection() {
  return (
    <section id="live-strip" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="06" label={liveStatement.kicker} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
          <h2
            className="font-display leading-[0.96] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6.6vw, 6rem)" }}
          >
            {[
              liveStatement.line,
              liveStatement.lineTwo,
              liveStatement.lineThree,
            ].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className={`block will-change-transform ${
                    i === 2 ? "italic text-bone/70" : ""
                  }`}
                >
                  {line}
                  {i === 2 ? "." : ""}
                </span>
              </span>
            ))}
          </h2>

          <div>
            <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
              {liveStatement.note}
            </p>
            <a
              href={liveStatement.tickets.href}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="link"
              className="mt-7 inline-flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-brass-bright transition-colors hover:text-paper"
            >
              {liveStatement.tickets.label}
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* ---- the strip ---- */}
      <div className="mt-16 flex flex-col gap-4 md:mt-24 md:gap-6">
        <Marquee duration={92} pauseOnHover className="py-1">
          {liveShots.map((shot) => (
            <Shot key={shot.id} shot={shot} width={420} />
          ))}
        </Marquee>

        <Marquee duration={104} reverse pauseOnHover className="py-1">
          {[...liveShots].reverse().map((shot) => (
            <Shot key={shot.id} shot={shot} width={420} />
          ))}
        </Marquee>
      </div>

      <div className="mx-auto mt-14 w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <p className="border-t border-line pt-6 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
          The full archive is on{" "}
          {/* A route with its anchor, because this strip is mounted on the
              homepage where `#live` does not exist — `/music` owns it. */}
          <SectionLink
            href="/music#live"
            className="text-brass-bright underline-offset-4 hover:underline"
            data-cursor="link"
          >
            Live
          </SectionLink>
        </p>
      </div>
    </section>
  );
}

function Shot({
  shot,
  width,
}: {
  shot: { id: string; caption: string };
  width: number;
}) {
  return (
    <figure className="relative mr-4 w-64 shrink-0 md:mr-6 md:w-80">
      <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
        <Image
          src={wix(shot.id, width, Math.round(width * 1.25))}
          alt={shot.caption}
          width={width}
          height={Math.round(width * 1.25)}
          sizes="(max-width: 768px) 256px, 320px"
          className="object-cover"
        />
        {/* a stage-light wash, so the strip reads as lit rather than pasted */}
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <figcaption className="mt-3 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-mute">
        {shot.caption}
      </figcaption>
    </figure>
  );
}
