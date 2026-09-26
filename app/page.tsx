import Hero from "@/components/hero";
import EcosystemSection from "@/components/ecosystem-section";
import NowPlaying from "@/components/now-playing";
import KalpanaSection from "@/components/kalpana-section";
import AcademySection from "@/components/academy-section";
import GallerySection from "@/components/gallery-section";
import ShopSection from "@/components/shop-section";
import ContactSection from "@/components/contact-section";
import { getCatalog } from "@/lib/commerce";

/**
 * The homepage is the cinematic *entry point*, not the whole platform.
 *
 * It keeps the six strongest moments — the halftone hero, the ecosystem
 * constellation, what is playing, Kalpana, the academy, the archive, the shop
 * and the door — and drops the eleven sections that were doing detailed work.
 * Those did not disappear: the discography, live archive, collaborations,
 * studio, instruments, journey, Kolkata roots, services, support and the sound
 * lab now live on their own routes, and the ecosystem constellation above
 * points straight at them.
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
      <AcademySection />
      <GallerySection />
      <ShopSection products={catalog.products} source={catalog.source} />
      <ContactSection />
    </>
  );
}
