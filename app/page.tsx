import { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { GoalsSection } from "@/components/sections/GoalsSection";
import { CTASection } from "@/components/sections/CTASection";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata = constructMetadata(ROUTES_SEO.home);

export default function HomePage() {
  return (
    <>
      {/* 1. HERO */}
      <HeroSection />

      {/* 2. OUR IMPACT (Trust Stats) */}
      <ImpactSection />

      {/* 3. WHY WEALTHY STEP */}
      <WhyChooseUsSection />

      {/* 4. ACHIEVE YOUR LIFE GOALS */}
      <GoalsSection />

      {/* 5. BOTTOM CTA */}
      <CTASection />
    </>
  );
}
