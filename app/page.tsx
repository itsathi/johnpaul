import CinematicPreloader from "@/components/cinematic-preloader";
import Hero from "@/components/hero";
import NowPlaying from "@/components/now-playing";
import KalpanaSection from "@/components/kalpana-section";
import ShopSection from "@/components/shop-section";
import AcademySection from "@/components/academy-section";
import ServicesSection from "@/components/services-section";
import LiveCollabSection from "@/components/live-collab-section";
import CareerTimeline from "@/components/career-timeline";
import GallerySection from "@/components/gallery-section";
import FinalCtaSection from "@/components/final-cta-section";
import { getCatalog } from "@/lib/commerce";

/**
 * Strategic 10-Step Narrative Funnel:
 * 01. HERO — Immediate identity + primary actions
 * 02. NOW PLAYING / LATEST RELEASE — Give me a reason to listen
 * 03. MUSIC / LATEST WORK — Turn visitor into a fan
 * 04. SHOP / MERCH — Monetize the fan
 * 05. ACADEMY — Monetize the learner
 * 06. WORK WITH JOHN — Monetize the professional opportunity
 * 07. LIVE / COLLABORATIONS — Build credibility + social proof
 * 08. THE ARTIST / STORY — Emotional connection
 * 09. GALLERY / ARCHIVE — Deeper exploration
 * 10. FINAL CTA — Listen / Learn / Shop / Work With John
 */
export default async function Home() {
  const catalog = await getCatalog();

  return (
    <>
      <CinematicPreloader />
      <main>
        {/* 01. HERO — Immediate identity + primary actions */}
        <Hero />

      {/* 02. NOW PLAYING / LATEST RELEASE — Give me a reason to listen */}
      <NowPlaying index="02" label="Now playing — latest release" />

      {/* 03. MUSIC / LATEST WORK — Turn visitor into a fan */}
      <KalpanaSection index="03" label="Music — latest work" />

      {/* 04. SHOP / MERCH — Monetize the fan */}
      <ShopSection
        products={catalog.products}
        source={catalog.source}
        index="04"
        label="Shop — merchandise"
      />

      {/* 05. ACADEMY — Monetize the learner */}
      <AcademySection index="05" label="Academy — learn from John" />

      {/* 06. WORK WITH JOHN — Monetize the professional opportunity */}
      <ServicesSection
        index="06"
        label="Work with John — professional services"
        headlineLines={["Work with John.", "Live, studio,", "record or project."]}
      />

      {/* 07. LIVE / COLLABORATIONS — Build credibility + social proof */}
      <LiveCollabSection index="07" label="Live & Collaborations — social proof" />

      {/* 08. THE ARTIST / STORY — Emotional connection */}
      <CareerTimeline index="08" label="The Artist — story & journey" />

      {/* 09. GALLERY / ARCHIVE — Deeper exploration */}
      <GallerySection index="09" label="Gallery — visual archive" />

      {/* 10. FINAL CTA — Listen / Learn / Shop / Work With John */}
        <FinalCtaSection index="10" label="Final CTA — Four Doors" />
      </main>
    </>
  );
}
