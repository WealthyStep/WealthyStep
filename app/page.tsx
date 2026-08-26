import { Metadata } from "next";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { FadeIn } from "@/components/ui/fade-in";
import { HeroSection } from "@/components/hero/HeroSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GoalsSection } from "@/components/sections/GoalsSection";
import { CTASection } from "@/components/sections/CTASection";
import { 
  TrendingUp, Award, Users, Globe2, Star,
  ShieldCheck, Landmark, Calculator, BookOpen, PiggyBank,
  Home, Wallet, Palmtree, GraduationCap, Heart, ShieldAlert,
  ArrowRight, PhoneCall
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AMFI Registered Mutual Fund Distributor & Insurance | Wealthy Step",
  description: "Wealthy Step is an AMFI Registered Mutual Fund Distributor (ARN-322891) providing goal-focused mutual fund distribution, insurance solutions, and NRI investment support.",
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: "AMFI Registered Mutual Fund Distributor & Insurance | Wealthy Step",
    description: "Wealthy Step is an AMFI Registered Mutual Fund Distributor (ARN-322891) providing goal-focused mutual fund distribution, insurance solutions, and NRI investment support.",
    url: '/',
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. HERO */}
      <HeroSection />

      {/* 2. OUR IMPACT (Trust Stats) */}
      <ImpactSection />

      {/* 3. WHY WEALTHY STEP */}
      <WhyChooseUsSection />

      {/* 4. OUR SERVICES */}
      <ServicesSection />

      {/* 5. ACHIEVE YOUR LIFE GOALS */}
      <GoalsSection />

      {/* 6. BOTTOM CTA */}
      <CTASection />
    </>
  );
}
