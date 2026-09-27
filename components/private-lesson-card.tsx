"use client";

import { motion } from "framer-motion";
import { DirectionAwareHover } from "./ui/direction-aware-hover";
import MagneticButton from "./ui/magnetic-button";
import { academy, type AcademyItem } from "@/content/platform";
import { pexels } from "@/lib/media";

const EASE = [0.22, 1, 0.36, 1] as const;
const EMAIL = "johnpaulstudio1@gmail.com";

/** A pinned Pexels still: a teacher walking a student through a part. */
const LESSON_IMAGE = pexels("7520984", 1200, 1);
const LESSON_IMAGE_ALT =
  "A teacher guiding a student through a piece of music in a studio";

function enquiry(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/**
 * The Private Lesson, as a direction-aware hover card.
 *
 * The hover plate carries the title and the description — the two things worth
 * reading before you commit attention — and the specification sits underneath
 * it in the resting state, because five rows of label/value will not fit in a
 * 24rem overlay without turning into a wall of text.
 *
 * Content is read from `academy.tracks[0].items[0]` rather than restated here,
 * so the lessons route and this card cannot drift apart.
 */
export default function PrivateLessonCard({
  item,
  index,
}: {
  item: AcademyItem;
  index: number;
}) {
  return (
    <motion.figure
      className="group relative flex flex-col border border-line bg-coal/60 p-6 transition-colors duration-500 hover:border-brass/45 hover:bg-coal md:p-8"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: EASE }}
    >
      <span className="absolute -top-px left-0 h-px w-12 bg-brass/70 transition-all duration-500 group-hover:w-full" />

      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6rem] tracking-[0.3em] text-mute">
          {item.no}
        </span>
        {item.source === "demo" ? (
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.22em] text-mute">
            To be confirmed
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex justify-center md:justify-start">
        <DirectionAwareHover
          imageUrl={LESSON_IMAGE}
          imageAlt={LESSON_IMAGE_ALT}
          label={`${item.title} — ${item.body}`}
          className="h-64 w-full max-w-72 md:h-80 md:w-full"
        >
          <span className="block font-display text-2xl leading-none tracking-tight text-paper">
            {item.title}
          </span>
          <span className="mt-2.5 block max-w-[22rem] text-[0.78rem] leading-relaxed text-bone">
            {item.body}
          </span>
        </DirectionAwareHover>
      </div>

      {/* the same two lines, in the resting state — the hover plate is a
          pointer affordance, so it cannot be the only place they exist */}
      <figcaption className="mt-6">
        <h4 className="font-display leading-none tracking-tight text-paper">
          {item.title}
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-bone">{item.body}</p>
      </figcaption>

      <dl className="mt-6 flex flex-col border-t border-line">
        {item.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3"
          >
            <dt className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">
              {spec.label}
            </dt>
            <dd
              className={`text-right font-mono text-[0.6rem] uppercase tracking-[0.18em] ${
                spec.value ? "text-bone" : "italic text-mute/70"
              }`}
            >
              {spec.value ?? "To be confirmed"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <MagneticButton
          as="a"
          href={enquiry(`Academy — ${item.title}`)}
          strength={0.28}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brass px-7 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-ink transition-colors hover:bg-brass-bright"
          ariaLabel={`${item.cta} — opens your email client`}
        >
          {item.cta}
        </MagneticButton>
        <a
          href="/contact"
          className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-mute transition-colors hover:text-brass-bright"
          data-cursor="link"
        >
          Or contact John
        </a>
      </div>
    </motion.figure>
  );
}

/** The Private Lesson item, resolved from the academy content layer. */
export const privateLessonItem = academy.tracks[0].items[0];
