import {
  collaborations,
  kolkataShots,
  liveShots,
  media,
} from "./site";
import type { GalleryItem } from "./platform";

/**
 * The gallery is assembled from the same Wix media ids the rest of the site
 * already uses, so every frame is real photography of John — no stock, no
 * filler. Titles come from captions that already exist in the site copy;
 * `meta` is the category only. Nothing here asserts an event that isn't
 * already documented.
 *
 * `ratio` and `offset` are presentation only — the CDN crops to fit, so these
 * are layout decisions rather than claims about the original photograph.
 */

type Seed = Omit<GalleryItem, "id"> & { key: string };

const R = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[2/3]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[3/2]",
} as const;

const O = {
  none: "",
  sm: "mt-5",
  md: "mt-10",
  lg: "mt-16",
  xl: "mt-24",
} as const;

const seeds: Seed[] = [
  /* ---- Live ------------------------------------------------------ */
  {
    key: "live-01",
    src: liveShots[0].id,
    title: liveShots[0].caption,
    alt: "John Paul performing on stage during Arijit Singh Live, Kolkata",
    meta: "Live",
    category: "live",
    ratio: R.portrait,
    offset: O.none,
  },
  {
    key: "live-02",
    src: liveShots[1].id,
    title: liveShots[1].caption,
    alt: "John Paul on stage during Arijit Singh Live, Kolkata",
    meta: "Live",
    category: "live",
    ratio: R.wide,
    offset: O.sm,
  },
  {
    key: "live-03",
    src: liveShots[4].id,
    title: liveShots[4].caption,
    alt: "John Paul on stage under stage lighting",
    meta: "Live",
    category: "live",
    ratio: R.tall,
    offset: O.none,
  },
  {
    key: "live-04",
    src: liveShots[8].id,
    title: liveShots[8].caption,
    alt: "Stage lighting over a live performance",
    meta: "Live",
    category: "live",
    ratio: R.square,
    offset: O.lg,
  },
  {
    key: "live-05",
    src: liveShots[3].id,
    title: liveShots[3].caption,
    alt: "John Paul performing during Nikhita Gandhi Live",
    meta: "Live",
    category: "live",
    ratio: R.portrait,
    offset: O.md,
  },
  {
    key: "live-06",
    src: liveShots[6].id,
    title: liveShots[6].caption,
    alt: "Close-up of John Paul playing live",
    meta: "Live",
    category: "live",
    ratio: R.square,
    offset: O.none,
  },

  /* ---- Touring ---------------------------------------------------- */
  {
    key: "tour-01",
    src: liveShots[2].id,
    title: liveShots[2].caption,
    alt: "John Paul performing with his own band at 5 Mad Men, Kolkata",
    meta: "Touring",
    category: "touring",
    ratio: R.wide,
    offset: O.none,
  },
  {
    key: "tour-02",
    src: liveShots[5].id,
    title: liveShots[5].caption,
    alt: "John Paul performing on tour around the country",
    meta: "Touring",
    category: "touring",
    ratio: R.portrait,
    offset: O.sm,
  },
  {
    key: "tour-03",
    src: liveShots[7].id,
    title: liveShots[7].caption,
    alt: "John Paul performing live in Kolkata",
    meta: "Touring",
    category: "touring",
    ratio: R.tall,
    offset: O.none,
  },

  /* ---- Studio ----------------------------------------------------- */
  {
    key: "studio-01",
    src: media.guitarStudio,
    title: "The instruments",
    alt: "John Paul with his guitar in a studio setting",
    meta: "Studio",
    category: "studio",
    ratio: R.portrait,
    offset: O.none,
  },
  {
    key: "studio-02",
    src: media.studioDesk,
    title: "The room",
    alt: "Studio desk during a recording session",
    meta: "Studio",
    category: "studio",
    ratio: R.landscape,
    offset: O.md,
  },
  {
    key: "studio-03",
    src: media.gear,
    title: "The rig",
    alt: "Guitar and studio gear",
    meta: "Studio",
    category: "studio",
    ratio: R.square,
    offset: O.none,
  },
  {
    key: "studio-04",
    src: media.studioRoom,
    title: "The space",
    alt: "Interior of a recording room",
    meta: "Studio",
    category: "studio",
    ratio: R.wide,
    offset: O.lg,
  },
  {
    key: "studio-05",
    src: media.strings,
    title: "Strings",
    alt: "Guitar strings in close detail",
    meta: "Studio",
    category: "studio",
    ratio: R.tall,
    offset: O.none,
  },

  /* ---- Sessions --------------------------------------------------- */
  {
    key: "sess-01",
    src: media.guitarClose,
    title: "Close to the mic",
    alt: "Guitar in close detail during a session",
    meta: "Sessions",
    category: "sessions",
    ratio: R.portrait,
    offset: O.sm,
  },
  {
    key: "sess-02",
    src: media.daddario,
    title: "Strings & folk",
    alt: "Folk strings and accessories",
    meta: "Sessions",
    category: "sessions",
    ratio: R.landscape,
    offset: O.none,
  },
  {
    key: "sess-03",
    src: media.portrait,
    title: "In the room",
    alt: "Portrait of John Paul in a studio",
    meta: "Sessions",
    category: "sessions",
    ratio: R.tall,
    offset: O.md,
  },
  {
    key: "sess-04",
    src: media.portraitOne,
    title: "Between takes",
    alt: "John Paul between takes during a session",
    meta: "Sessions",
    category: "sessions",
    ratio: R.square,
    offset: O.none,
  },

  /* ---- Collaborations --------------------------------------------- */
  {
    key: "collab-01",
    src: collaborations[0].media,
    title: collaborations[0].name,
    alt: `John Paul performing with ${collaborations[0].name}`,
    meta: collaborations[0].role,
    category: "collabs",
    ratio: R.wide,
    offset: O.none,
  },
  {
    key: "collab-02",
    src: collaborations[2].media,
    title: collaborations[2].name,
    alt: `John Paul performing with ${collaborations[2].name}`,
    meta: collaborations[2].role,
    category: "collabs",
    ratio: R.portrait,
    offset: O.lg,
  },
  {
    key: "collab-03",
    src: collaborations[5].media,
    title: collaborations[5].name,
    alt: `${collaborations[5].name} — live and studio work`,
    meta: collaborations[5].role,
    category: "collabs",
    ratio: R.landscape,
    offset: O.none,
  },
  {
    key: "collab-04",
    src: collaborations[6].media,
    title: collaborations[6].name,
    alt: `${collaborations[6].name} — films and albums`,
    meta: collaborations[6].role,
    category: "collabs",
    ratio: R.square,
    offset: O.md,
  },
  {
    key: "collab-05",
    src: collaborations[7].media,
    title: collaborations[7].name,
    alt: `${collaborations[7].name} — live and studio`,
    meta: collaborations[7].role,
    category: "collabs",
    ratio: R.tall,
    offset: O.none,
  },

  /* ---- Behind the scenes ------------------------------------------ */
  ...kolkataShots.map<Seed>((shot, i) => ({
    key: `behind-0${i + 1}`,
    src: shot.id,
    title: "Kolkata",
    alt: `Kolkata — John Paul's home city, captured on film`,
    meta: "Behind the scenes",
    category: "behind",
    ratio: [R.wide, R.tall, R.square, R.portrait, R.landscape][i],
    offset: [O.none, O.sm, O.md, O.none, O.lg][i],
  })),
];

export const galleryItems: GalleryItem[] = seeds.map(({ key, ...item }) => ({
  ...item,
  id: key,
}));
