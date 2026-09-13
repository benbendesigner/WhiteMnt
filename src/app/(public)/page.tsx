import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import ManufacturerLogos from "@/components/home/ManufacturerLogos";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ManufacturerLogos />
      <AboutSection />
      <FeaturedEquipment />
      <CTABanner />
    </>
  );
}
