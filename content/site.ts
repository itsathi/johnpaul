/**
 * Central content configuration for the John Paul concept site.
 *
 * All copy and imagery lives here — swap an id or a string in one place and
 * the whole site updates. Facts below are drawn from John's public online
 * properties (johnpaulindia.com, his Instagram, Linktree, YouTube) and from
 * the documented context provided for this private demo. Nothing is invented.
 */

export const artist = {
  name: "John Paul",
  firstName: "John",
  lastName: "Paul",
  descriptor: "Guitarist · Multi-Instrumentalist · Producer",
  subDescriptor: "Session player · Live guitarist · Independent artist",
  location: "Kolkata, India — touring worldwide",
  decades: "10+ years",
  origin: "Kolkata",
};

export const seo = {
  title: "John Paul — Guitarist · Multi-Instrumentalist · Producer",
  description:
    "John Paul is a guitarist, multi-instrumentalist, session player and producer from Kolkata — from India's biggest stages and studios to his own independent album, Kalpana.",
  canonicalPlaceholder: "https://www.johnpaulindia.com/",
  ogImage:
    "https://static.wixstatic.com/media/84283f_b5260c78c8e444f982976578fc87a522~mv2.jpg/v1/fill/w_1200,h_630,al_c,q_85,enc_avif,quality_auto/AOS03894_edited.jpg",
};

/* ------------------------------------------------------------------ */
/* Media — raw Wix media ids (stable CDN). Reconstruct at size via     */
/* lib/media.wix(). Replace ids, or a whole entry, to swap photography. */
/* ------------------------------------------------------------------ */

export const media = {
  hero: "84283f_b5260c78c8e444f982976578fc87a522~mv2.jpg",
  portrait: "84283f_db14e229b8d94e34b9897116ef5fe843~mv2.jpg",
  guitarStudio: "84283f_7b99efa3c88c47818f1e161be3004497~mv2.jpg",
  guitarClose: "84283f_fde731762ad043ecaf275c9bfb88d81f~mv2.jpg",
  daddario: "84283f_ef3d739726184d7bb9fd48a29b05f32e~mv2.jpg",
  portraitOne: "84283f_36a05501d42b489ead1892561af0c3ed~mv2.jpg",
  gear: "84283f_ced1a2b1042848e1a1f9708749132cf8~mv2.jpg",
  studioDesk: "84283f_1e6cab8c426f4f47914100814e739541~mv2.jpg",
  studioRoom: "84283f_001a8168b5e849299a949999174d7452~mv2.jpg",
  strings: "84283f_15e357ae58e84fccb891870666ce240e~mv2.jpg",
};

export const liveShots = [
  { id: "84283f_68635cf913ea4fd4aa1fbb5263b761c7~mv2.jpg", caption: "Arijit Singh Live — Kolkata" },
  { id: "84283f_6a27af5410c04d538f22f911491506c3~mv2.jpg", caption: "Arijit Singh Live — Kolkata" },
  { id: "84283f_f847d6dfdcec42fe81385afdc6bb9758~mv2.jpg", caption: "John Paul Live — 5 Mad Men, Kolkata" },
  { id: "84283f_59ae8ad4e0024fbc83984c1884c099e4~mv2.jpg", caption: "Nikitha Gandhi Live" },
  { id: "84283f_497abdf8d9b14c429e66b0ce7476fc13~mv2.jpg", caption: "On stage" },
  { id: "84283f_830a7399b02e4f5f984da59dab9f8928~mv2.jpg", caption: "Live — around the country" },
  { id: "84283f_9fea0fc5f5964cb6ae9efb8b7f19661c~mv2.jpg", caption: "Close-up — live" },
  { id: "84283f_3525b79023e141f2af3f308031f693d6~mv2.jpg", caption: "Kolkata, live" },
  { id: "84283f_79483fe164cd4eeda1ac4b8920e992a8~mv2.jpg", caption: "Stage light" },
];

/* Kolkata / roots */
export const kolkataShots = [
  { id: "84283f_89f5ac9a243a4d48bc64cd6381e024b7~mv2.jpg", caption: "Kolkata" },
  { id: "84283f_bee4ce0ff9e94219b7fbcd9b4e24fdf0~mv2.jpg", caption: "Kolkata" },
  { id: "84283f_493a7cf197b348c6ba8493e8589b4c47~mv2.jpg", caption: "Kolkata" },
  { id: "84283f_58487d52628e4bddb21d31bbcfd0693e~mv2.jpg", caption: "Kolkata" },
  { id: "84283f_ec3be0da275347aa83b210980d442f7c~mv2.jpg", caption: "Kolkata" },
];

export const liveStatement = {
  kicker: "Live",
  line: "Different rooms.",
  lineTwo: "Different artists.",
  lineThree: "Different sounds.",
  note: "Ten years across India's biggest stages — from arena tours and festival stages to a sold-out headline night in Kolkata with his own band.",
  tickets: {
    label: "Tickets & dates",
    href: "https://www.instagram.com/districtupdates/",
  },
};

export const studioStatement = {
  kicker: "Studio",
  title: "From the stage to the studio, and back again.",
  instruments: [
    "Electric Guitar",
    "Acoustic Guitar",
    "Bass Guitar",
    "Nylon String",
    "Mandola",
    "Mandolin",
    "Banjo",
    "Ukulele",
  ],
  disciplines: [
    { name: "Recording", note: "Session guitars & strings — the first call for a record in need of a voice." },
    { name: "Arrangement", note: "Finding the shape of a song — where it lives, how it breathes." },
    { name: "Production", note: "Programming, producing and building records from the ground up." },
    { name: "Acoustic Drums", note: "Signature service — programming acoustic drums with the feel of a live player." },
  ],
};

/* Multi-instrumentalist interactive experience */
export const instrumentExperience = {
  kicker: "Multi-instrumentalist",
  items: [
    {
      name: "Guitar",
      note: "The first language. Electric, acoustic and nylon — tones that translate from the studio floor to a 40,000-seat room.",
      media: "84283f_7b99efa3c88c47818f1e161be3004497~mv2.jpg",
    },
    {
      name: "Bass",
      note: "The low end of an arrangement — played for the pocket, not the spotlight.",
      media: "84283f_fde731762ad043ecaf275c9bfb88d81f~mv2.jpg",
    },
    {
      name: "Strings & Folk",
      note: "Mandola, mandolin, banjo, ukulele — texture and colour when the song asks for another instrument.",
      media: "84283f_ef3d739726184d7bb9fd48a29b05f32e~mv2.jpg",
    },
    {
      name: "Percussion",
      note: "Drums and percussion — from a school band in Kolkata to prog-metal drum covers posted for the practice of it.",
      media: "84283f_36a05501d42b489ead1892561af0c3ed~mv2.jpg",
    },
    {
      name: "Production",
      note: "Programming acoustic drums, arranging and producing — the room where records get built.",
      media: "84283f_1e6cab8c426f4f47914100814e739541~mv2.jpg",
    },
  ],
};

/* Collaboration marquee — only publicly documented associations. */
export const collaborations = [
  { name: "Arijit Singh", role: "Arijit Singh Live", media: "84283f_7583ccbd4ef44131b0f92ac73d5882dd~mv2.jpg" },
  { name: "Shankar Mahadevan", role: "Kalpana", media: "" },
  { name: "Raghu Dixit", role: "The Raghu Dixit Project", media: "84283f_7b56de429ebe4ce1b12cadd3f1e402c2~mv2.jpg" },
  { name: "Nikhita Gandhi", role: "Nikhita Gandhi Live", media: "" },
  { name: "Karan Aujla", role: "India Tour", media: "" },
  { name: "Amit Trivedi", role: "Films & live", media: "84283f_f7daa89872bf44a98403df8d8a71ae15~mv2.jpg" },
  { name: "Ram Sampath", role: "Films & albums", media: "84283f_fe759a59a3a844638e66b935da432713~mv2.jpg" },
  { name: "Sonu Nigam", role: "Live & studio", media: "84283f_22567796507a444db1ddb4ee5104977a~mv2.jpg" },
  { name: "Pt. Bickram Ghosh", role: "Live & studio", media: "" },
  { name: "Vijay Prakash", role: "Aham Sat", media: "" },
  { name: "Rupam Islam", role: "Fosho Kalbela", media: "" },
  { name: "Anupam Roy", role: "Films & albums", media: "" },
  { name: "Lakkhichhara", role: "Bengali rock, live" , media: ""},
  { name: "Underground Authority", role: "Live", media: "" },
  { name: "Madhubanti Bagchi", role: "Live & studio", media: "" },
  { name: "Darshan Doshi", role: "Records & live", media: "" },
  { name: "Gino Banks", role: "Records & live", media: "" },
];

/* Career timeline — editorial documentary, not a CV. */
export const journey = [
  {
    era: "Kolkata · age 13",
    title: "The first instrument",
    body: "It begins with his mother's harmonium, drums in the school band and keyboards in middle school — a city and a household teaching rhythm before theory.",
    media: "84283f_89f5ac9a243a4d48bc64cd6381e024b7~mv2.jpg",
  },
  {
    era: "Calcutta School of Music",
    title: "Guitar, for good",
    body: "Three years of non-classical guitar with classical grades alongside, plus piano lessons — the foundations of a session player's vocabulary.",
    media: "84283f_7b99efa3c88c47818f1e161be3004497~mv2.jpg",
  },
  {
    era: "The bands",
    title: "Kolkata's circuits",
    body: "Atlas, Paraspathar, RIGMOB, Popcult, Prachir — metal, Bengali rock, funk and disco. The years of learning to play the room.",
    media: "84283f_493a7cf197b348c6ba8493e8589b4c47~mv2.jpg",
  },
  {
    era: "Into the studio",
    title: "Sessions & records",
    body: "Live tours alongside recording sessions for eminent artists — arranging, recording and playing across instruments as a first-call guitarist.",
    media: "84283f_15e357ae58e84fccb891870666ce240e~mv2.jpg",
  },
  {
    era: "Arijit Singh Live",
    title: "A decade's biggest room",
    body: "Season after season of one of India's biggest live productions — where every solo has to speak before ten thousand people.",
    media: "84283f_68635cf913ea4fd4aa1fbb5263b761c7~mv2.jpg",
  },
  {
    era: "More rooms, more voices",
    title: "The call list",
    body: "The Raghu Dixit Project, Nikitha Gandhi Live, Lakkhichhara, Jishu & the Retrodictions — and film-music sessions arranged by some of India's finest composers.",
    media: "84283f_59ae8ad4e0024fbc83984c1884c099e4~mv2.jpg",
  },
  {
    era: "Making Tones",
    title: "Passing the craft on",
    body: "A live workshop series breaking down professional guitar tones — from theory to multi-effects workflows used in real live and studio environments.",
    media: "84283f_ef3d739726184d7bb9fd48a29b05f32e~mv2.jpg",
  },
  {
    era: "John Paul Live",
    title: "His own stage",
    body: "A sold-out headline night in Kolkata with his own band — Sambit, Rahul, Bihu, C_Roo and Subhadeep — honouring the music they grew up on.",
    media: "84283f_f847d6dfdcec42fe81385afdc6bb9758~mv2.jpg",
  },
  {
    era: "Kalpana",
    title: "An independent record",
    body: "An album born from imagination, memory and years of exploration — dedicated to his late mother, featuring Arijit Singh, Shankar Mahadevan and artists around the world.",
    media: "84283f_497abdf8d9b14c429e66b0ce7476fc13~mv2.jpg",
  },
];

/* Kalpana — the centrepiece. Only documented facts. */
export const kalpana = {
  kicker: "Independent album",
  title: "Kalpana",
  meaning: "Imagination. The Bengali word for everything this record holds.",
  philosophy:
    "An album born from imagination, memory and years of musical exploration — written, arranged and produced the way a session musician hears it.",
  dedication: "Dedicated to his late mother.",
  credits: "Featuring Arijit Singh · Shankar Mahadevan · and musicians from around the world",
  tracks: [
    {
      no: "01",
      title: "Yosemite's Hathi",
      note: "First single — live premiere at AAM Mumbai with Nikhita Gandhi & Muheet Bharti.",
      youtube: "https://youtu.be/RKWNBADSIsI",
      thumbnail: "https://i.ytimg.com/vi/RKWNBADSIsI/maxresdefault.jpg",
    },
  ],
  premiere: "Premiered live — 5 Mad Men, Kolkata · 7 June",
  tribute: "The night also paid tribute to Zakir Hussain and the music of Shakti.",
};

/* Work with John */
export const services = [
  {
    no: "01",
    name: "Live Performance",
    body: "Electric, acoustic and bass guitar for tours, festivals, artist shows and one-off events — anywhere in the world.",
  },
  {
    no: "02",
    name: "Session Recording",
    body: "Studio guitars and strings for songs, BGM and jingles — fluent across electric, acoustic, bass, nylon, mandola, mandolin, banjo and ukulele.",
  },
  {
    no: "03",
    name: "Production & Arrangement",
    body: "Songs built from the ground up — programming, arranging and producing, including signature acoustic-drum programming.",
  },
  {
    no: "04",
    name: "Artist Projects",
    body: "Band productions, workshops and the Making Tones series — craft shared openly with the next generation of players.",
  },
];

export const contact = {
  headline: ["LET'S", "MAKE", "SOMETHING."],
  channels: ["Booking", "Studio", "Sessions", "Production", "Collaborations"],
  email: "johnpaulstudio1@gmail.com",
  phone: "+91 98307 90023",
  location: "Kolkata, India — touring worldwide",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/johnpaul.india/" },
    { label: "YouTube", href: "https://youtube.com/@johnpaulindia" },
    { label: "Facebook", href: "https://www.facebook.com/johnpaulsolo2" },
    { label: "Apple Music", href: "https://music.apple.com/in/artist/john-paul/1852268968" },
  ],
};

/* Now playing — the single a listener should hear first. Only verified links. */
export const nowPlaying = {
  kicker: "Now Playing",
  eyebrow: "Out now — the first single from Kalpana",
  title: "Yosemite's Hathi",
  tagline:
    "The opening chapter of the debut album he spent nine years writing.",
  facts: [
    "Written, arranged & produced by John Paul",
    "Imagination, in Bengali — the meaning behind Kalpana",
  ],
  artwork: "https://i.ytimg.com/vi/RKWNBADSIsI/maxresdefault.jpg",
  video: {
    label: "Watch the music video",
    href: "https://youtu.be/RKWNBADSIsI",
  },
  premiere: {
    label: "Live at AAM Mumbai — with Nikhita Gandhi & Muheet Bharti",
    href: "https://youtu.be/NpPHOTZGEN8",
  },
  streams: [
    { label: "Apple Music", href: "https://music.apple.com/in/artist/john-paul/1852268968" },
    { label: "YouTube", href: "https://youtu.be/RKWNBADSIsI" },
    { label: "Linktree", href: "https://linktr.ee/John.paul" },
  ],
};

/* Discography — every entry below is documented publicly. */
export const discography = {
  kicker: "Discography",
  headline: "Kalpana, so far.",
  note: "A debut album released in chapters — four of eight songs are out now, with the rest on the way.",
  releases: [
    {
      type: "Single · Track 01",
      title: "Yosemite's Hathi",
      meta: "Out now",
      body: "The opening chapter — written, arranged and produced by John Paul, premiered live at AAM Mumbai.",
      artwork: "https://i.ytimg.com/vi/RKWNBADSIsI/maxresdefault.jpg",
      of: ["Apple Music", "YouTube", "Linktree"],
      href: "https://linktr.ee/John.paul",
    },
    {
      type: "Album · 8 chapters",
      title: "Kalpana",
      meta: "4 of 8 out now",
      body: "Named after his late mother — imagination. Featuring Arijit Singh, Shankar Mahadevan and artists from around the world.",
      artwork: "84283f_b5260c78c8e444f982976578fc87a522~mv2.jpg",
      of: ["Apple Music", "Linktree"],
      href: "https://music.apple.com/in/artist/john-paul/1852268968",
    },
  ],
  coming: "Four more songs are being released — each chapter lands as it's ready.",
  press: {
    label: "Press",
    title: "The story behind Kalpana — as told to the Telegraph",
    href: "https://www.telegraphindia.com/my-kolkata/people/indian-guitarist-john-paul-on-debut-album-kalpana-kolkata-roots-and-working-with-arijit-singh/cid/2164908",
  },
};

/* Support — stream, vinyl enquiries and the rollout. Honest placeholders. */
export const support = {
  kicker: "Support",
  headline: "Keep it playing.",
  intro:
    "Kalpana is an independent record. Every stream, share and follow moves the next chapter closer.",
  actions: [
    {
      title: "Stream",
      body: "Hear Yosemite's Hathi and John's artist page — all in one place.",
      href: "https://linktr.ee/John.paul",
      cta: "Listen everywhere",
    },
    {
      title: "Physical & merch",
      body: "Vinyl, CD and artist merchandise live in the shop — one place for the catalogue, with enquiries going straight to John.",
      href: "#shop",
      cta: "See the shop",
    },
    {
      title: "Follow the rollout",
      body: "Four more chapters are coming. Don't miss a single drop.",
      href: "https://www.instagram.com/johnpaul.india/",
      cta: "Follow @johnpaul.india",
    },
  ],
  note: "Demonstration build — swap these for live store pages and merch SKUs when they exist.",
};

/**
 * The six roles the whole platform is organised around. Used by the hero to
 * state up front that John's career has more than one shape.
 */
export const roles = [
  "Artist",
  "Session player",
  "Live performer",
  "Touring artist",
  "Educator",
  "Collaborator",
];

/**
 * Superseded by `navGroups` / `navRail` in content/platform.ts, which group the
 * same destinations around John's ecosystem. Kept for the flat ordering used by
 * anything that needs a linear list of sections.
 */
export const navigation = [
  { label: "Listen", href: "#listen", id: "listen" },
  { label: "Releases", href: "#releases", id: "releases" },
  { label: "Kalpana", href: "#kalpana", id: "kalpana" },
  { label: "Live", href: "#live", id: "live" },
  { label: "Support", href: "#support", id: "support" },
  { label: "Contact", href: "#contact", id: "contact" },
];