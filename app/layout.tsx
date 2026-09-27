import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import SiteNavigation from "@/components/site-navigation";
import CustomCursor from "@/components/custom-cursor";
import ScrollProgress from "@/components/scroll-progress";
import Preloader from "@/components/preloader";
import Footer from "@/components/footer";
import { artist, seo } from "@/content/site";
import { CommerceProvider } from "@/lib/providers/commerce-provider";
import { AcademyProvider } from "@/lib/providers/academy-provider";
import { BookingProvider } from "@/lib/providers/booking-provider";
import { AudioProvider } from "@/lib/providers/audio-provider";
import CartDrawer from "@/components/cart-drawer";
import PersistentPlayer from "@/components/player/persistent-player";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.canonicalPlaceholder),
  title: {
    default: seo.title,
    template: `%s · ${artist.name}`,
  },
  description: seo.description,
  applicationName: `${artist.name} — concept`,
  authors: [{ name: artist.name }],
  keywords: [
    "John Paul",
    "guitarist",
    "multi-instrumentalist",
    "session player",
    "music producer",
    "Kolkata",
    "Kalpana",
    "Arijit Singh Live",
    "Raghu Dixit",
    "Nikhita Gandhi",
    "Indian fusion",
  ],
  openGraph: {
    type: "website",
    url: seo.canonicalPlaceholder,
    title: seo.title,
    description: seo.description,
    siteName: artist.name,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: "John Paul on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <ArtistStructuredData />
      </head>
      <body>
        {/* Mock providers sit above the shell so the cart drawer, the nav
            badge and every route share one set of seams. Each is a client
            boundary wrapping server-rendered children, so the pages stay
            server components. */}
        <CommerceProvider>
          <AcademyProvider>
            <BookingProvider>
              {/* Audio sits outermost of the three so the transport outlives
                  every route change, and the player is mounted here — above
                  <main>, not inside a page — for the same reason. */}
              <AudioProvider>
                <Preloader />
                <SmoothScroll>
                  <CustomCursor />
                  <ScrollProgress />
                  <SiteNavigation />
                  <div className="film-grain" aria-hidden />
                  <main>{children}</main>
                  <Footer />
                  <CartDrawer />
                  <PersistentPlayer />
                </SmoothScroll>
              </AudioProvider>
            </BookingProvider>
          </AcademyProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}

/** Structured data — the artist, plainly and accurately described. */
function ArtistStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    alternateName: "John Paul Live",
    description: seo.description,
    genre: ["Indian fusion", "jazz", "rock", "pop", "electronic"],
    foundingLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "Kolkata", addressRegion: "West Bengal", addressCountry: "IN" },
    },
    members: [{ "@type": "Person", name: "John Paul" }],
    sameAs: [
      "https://www.instagram.com/johnpaul.india/",
      "https://youtube.com/@johnpaulindia",
      "https://www.facebook.com/johnpaulsolo2",
      "https://linktr.ee/John.paul",
      "https://music.apple.com/in/artist/john-paul/1852268968",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}