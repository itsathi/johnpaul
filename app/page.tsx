import Hero from "@/components/hero";
import EcosystemSection from "@/components/ecosystem-section";
import NowPlaying from "@/components/now-playing";
import KalpanaSection from "@/components/kalpana-section";
import LiveMarqueeSection from "@/components/live-marquee-section";
import CareerTimeline from "@/components/career-timeline";
import AcademySection from "@/components/academy-section";
import GallerySection from "@/components/gallery-section";
import ShopSection from "@/components/shop-section";
import NewsletterSection from "@/components/newsletter-section";
import ContactSection from "@/components/contact-section";
import { getCatalog } from "@/lib/commerce";

/**
 * The homepage is the cinematic *entry point*, not the whole platform.
 *
 * It keeps the strongest moments — the halftone hero, the ecosystem
 * constellation, what is playing, Kalpana, the journey, the academy, the
 * archive, the shop and the door — and drops the sections that were doing
 * detailed work. Those did not disappear: the discography, live archive,
 * collaborations, studio, instruments, Kolkata roots, services, support and
 * the sound lab now live on their own routes, and the ecosystem constellation
 * above points straight at them.
 *
 * Section numbering is global to the platform rather than sequential per page,
 * so the tags stay in ascending order even with a section skipped: 01, 03, 05,
 * 06, 11, 14, 15, 16, 18.
 *
 * The catalogue is still resolved on the server so the storefront renders
 * already shaped the way a real commerce integration would feed it.
 */
export default async function Home() {
  const catalog = await getCatalog();

  return (
    <>
      <Hero />
      <EcosystemSection />
      <NowPlaying />
      <KalpanaSection />
      <LiveMarqueeSection />
      <CareerTimeline />
      <AcademySection />
      <GallerySection />
      <ShopSection products={catalog.products} source={catalog.source} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
}
