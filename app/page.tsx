import Hero from "@/components/hero";
import NowPlaying from "@/components/now-playing";
import Discography from "@/components/discography";
import ArtistIntro from "@/components/artist-intro";
import KalpanaSection from "@/components/kalpana-section";
import LiveSection from "@/components/live-section";
import MusicLab from "@/components/music-lab";
import CollabSection from "@/components/collab-section";
import StudioSection from "@/components/studio-section";
import InstrumentExperience from "@/components/instrument-experience";
import CareerTimeline from "@/components/career-timeline";
import KolkataRoots from "@/components/kolkata-roots";
import SupportSection from "@/components/support-section";
import ServicesSection from "@/components/services-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <NowPlaying />
      <Discography />
      <ArtistIntro />
      <KalpanaSection />
      <LiveSection />
      <MusicLab />
      <CollabSection />
      <StudioSection />
      <InstrumentExperience />
      <CareerTimeline />
      <KolkataRoots />
      <SupportSection />
      <ServicesSection />
      <ContactSection />
    </>
  );
}