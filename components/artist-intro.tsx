"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import SectionTag from "./ui/section-tag";
import Media from "./ui/media";
import { useScrollTo } from "./smooth-scroll";
import { collaborations, liveShots, media } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The artist, told as a story rather than a biography: three lines of large
 * type, then the six sides of the career as a set of doors. Looking at a door
 * brings its photograph forward — the same discipline grid the demo already
 * used, widened to cover touring and teaching, with a layered image behind it.
 */
const disciplines = [
  {
    word: "Artist",
    caption: "His own records — Kalpana",
    href: "/music#kalpana",
    src: media.hero,
    alt: "John Paul performing on stage",
    line: "Independent releases and the album Kalpana, written, arranged and produced by John.",
  },
  {
    word: "Session",
    caption: "Records, films, jingles",
    href: "/sessions",
    src: media.guitarClose,
    alt: "Guitar in close detail during a studio session",
    line: "Studio guitars and strings for songs, films and jingles — the first call for a record that needs a voice.",
  },
  {
    word: "Live",
    caption: "Tours, arenas, festivals",
    href: "/music#live",
    src: liveShots[0].id,
    alt: "John Paul performing during Arijit Singh Live, Kolkata",
    line: "Ten years across India's biggest stages, where every solo has to speak in front of ten thousand people.",
  },
  {
    word: "Touring",
    caption: "His own band, his own stage",
    href: "/artist/journey",
    src: liveShots[5].id,
    alt: "John Paul performing on tour around the country",
    line: "John Paul Live — a sold-out headline night in Kolkata with his own band.",
  },
  {
    word: "Production",
    caption: "Arranging, programming",
    href: "#studio",
    src: media.studioDesk,
    alt: "Studio desk during a recording session",
    line: "Songs built from the ground up — programming, arranging and producing, including signature acoustic-drum programming.",
  },
  {
    word: "Teaching",
    caption: "Passing the craft on",
    href: "/academy",
    src: media.daddario,
    alt: "Strings and folk instruments from the Making Tones workshop series",
    line: "The Making Tones workshop series, private lessons and classes — the craft handed on rather than kept.",
  },
  {
    word: "Collaborating",
    caption: "With artists across India",
    href: "/music#collab",
    src: collaborations[0].media,
    alt: `John Paul performing with ${collaborations[0].name}`,
    line: "Arijit Singh Live, The Raghu Dixit Project, Nikhita Gandhi Live and a call list of records and stages.",
  },
];

export default function ArtistIntro() {
  const { scrollTo } = useScrollTo();
  const router = useRouter();

  /**
   * A door is either an anchor on this page (the studio section) or a route the
   * discipline moved to. Both the navigation and the ecosystem now live on their
   * own pages, so a hash that no longer exists here would be a dead click.
   */
  const open = (href: string) => {
    if (href.startsWith("#")) {
      scrollTo(href);
      return;
    }
    router.push(href);
  };
  const [active, setActive] = useState<number | null>(null);
  const focus = active === null ? null : disciplines[active];

  return (
    <section id="work" className="relative overflow-hidden bg-ink py-28 md:py-44">
      {/* the room behind the type, brought forward by whatever is being read */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <AnimatePresence mode="sync">
          {focus ? (
            <motion.div
              key={focus.word}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Media
                src={focus.src}
                alt=""
                wixWidth={1600}
                sizes="100vw"
                className="h-full w-full object-cover object-center opacity-[0.16] grayscale"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,9,8,0.86)_0%,rgba(10,9,8,0.7)_45%,rgba(10,9,8,0.95)_100%)]" />
      </div>

      {/* existing hover spotlight, retuned for seven doors */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active === null ? 0 : 1,
          background: `radial-gradient(620px 460px at ${
            18 + (active ?? 0) * 11
          }% 68%, rgba(188,138,76,0.13), transparent 70%)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10 lg:px-14">
        <SectionTag index="02" label="The artist" />

        <div className="mt-14 max-w-5xl">
          <p
            className="font-display leading-[1.0] tracking-[-0.02em] text-paper"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5.8rem)" }}
          >
            <MaskedLine delay={0.05}>From the stage</MaskedLine>
            <MaskedLine delay={0.16} muted>
              to the studio.
            </MaskedLine>
            <MaskedLine delay={0.27} accent>
              To the next player.
            </MaskedLine>
          </p>
        </div>

        <div
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-9 md:mt-20 md:grid-cols-3 lg:grid-cols-4"
          onMouseLeave={() => setActive(null)}
        >
          {disciplines.map((d, i) => (
            <motion.button
              key={d.word}
              type="button"
              data-cursor="link"
              onClick={() => open(d.href)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group relative border-t border-line pt-5 text-left"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, delay: 0.06 * i, ease: EASE }}
            >
              <span className="absolute -top-px left-0 h-px w-10 bg-brass transition-all duration-500 group-hover:w-full" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
                0{i + 1}
              </span>
              <span
                className="mt-3 block font-display leading-none tracking-tight text-bone transition-colors duration-300 group-hover:text-brass-bright"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.9rem)" }}
              >
                {d.word}
              </span>
              <span className="mt-3 block font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.22em] text-mute transition-colors duration-300">
                {d.caption}
              </span>
            </motion.button>
          ))}
        </div>

        {/* whatever door is open, said properly */}
        <div className="mt-10 min-h-[4.5rem] max-w-2xl border-l border-line pl-6 lg:mt-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={focus?.word ?? "rest"}
              className="text-sm leading-relaxed text-bone md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {focus ? (
                focus.line
              ) : (
                <>
                  More than a decade of professional music — seen from three
                  different seats: the stage, the session room, and the desk
                  where a record is assembled. Now, from the same seats, his own
                  songs.
                </>
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-14 flex max-w-3xl flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="max-w-xl text-base leading-relaxed text-bone md:text-lg">
            One musician, several careers, one place to see all of them. Music
            to hear, sessions to book, an academy to learn in, a gallery to
            look through, and a door that is always open.
          </p>
          <div className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
            <span className="h-px w-10 bg-line" />
            Scroll to explore
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MaskedLine({
  children,
  delay = 0,
  muted = false,
  accent = false,
}: {
  children: string;
  delay?: number;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block will-change-transform ${
          accent ? "italic text-brass-bright" : muted ? "italic text-bone/70" : ""
        }`}
        initial={{ y: "112%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}
