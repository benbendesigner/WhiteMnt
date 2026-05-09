import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import LatestEquipment from "@/components/home/LatestEquipment";
import ManufacturerLogos from "@/components/home/ManufacturerLogos";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ManufacturerLogos />
      <AboutSection />
      <ExpertiseSection />
      <LatestEquipment />
      <CTABanner />
    </>
  );
}
