import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import LatestEquipment from "@/components/home/LatestEquipment";
import ManufacturerLogos from "@/components/home/ManufacturerLogos";
import WantedSection from "@/components/home/WantedSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ManufacturerLogos />
      <AboutSection />
      <ExpertiseSection />
      <LatestEquipment />
      <WantedSection />
      <NewsletterSignup />
    </>
  );
}
