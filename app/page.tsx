import Hero from "@/components/hero";
import EcosystemSection from "@/components/ecosystem-section";
import ArtistIntro from "@/components/artist-intro";
import NowPlaying from "@/components/now-playing";
import Discography from "@/components/discography";
import KalpanaSection from "@/components/kalpana-section";
import LiveSection from "@/components/live-section";
import MusicLab from "@/components/music-lab";
import CollabSection from "@/components/collab-section";
import StudioSection from "@/components/studio-section";
import InstrumentExperience from "@/components/instrument-experience";
import CareerTimeline from "@/components/career-timeline";
import KolkataRoots from "@/components/kolkata-roots";
import ServicesSection from "@/components/services-section";
import AcademySection from "@/components/academy-section";
import GallerySection from "@/components/gallery-section";
import ShopSection from "@/components/shop-section";
import SupportSection from "@/components/support-section";
import ContactSection from "@/components/contact-section";
import { getCatalog } from "@/lib/commerce";

/**
 * The journey, in the order the ecosystem makes sense: who he is, the music,
 * the work, the academy, the archive, the shop, and the door.
 *
 * The catalogue is resolved on the server so the storefront UI is already
 * shaped the way a real commerce integration would feed it.
 */
export default async function Home() {
  const catalog = await getCatalog();

  return (
    <>
      <Hero />
      <EcosystemSection />
      <ArtistIntro />
      <NowPlaying />
      <Discography />
      <KalpanaSection />
      <LiveSection />
      <MusicLab />
      <CollabSection />
      <StudioSection />
      <InstrumentExperience />
      <CareerTimeline />
      <KolkataRoots />
      <ServicesSection />
      <AcademySection />
      <GallerySection />
      <ShopSection products={catalog.products} source={catalog.source} />
      <SupportSection />
      <ContactSection />
    </>
  );
}
