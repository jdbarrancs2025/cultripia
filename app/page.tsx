import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedExperiences } from "@/components/landing/FeaturedExperiences";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedExperiences />
    </main>
  );
}
