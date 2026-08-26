import { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { WhatWePlan } from "@/components/sections/about/WhatWePlan";
import { OurApproach } from "@/components/sections/about/OurApproach";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { Philosophy } from "@/components/sections/about/Philosophy";

export const metadata: Metadata = {
  title: "About Wealthy Step | Mutual Fund Distribution Support",
  description: "Learn about Wealthy Step, our core values, and our commitment to goal-based mutual fund distribution and investor education.",
  alternates: {
    canonical: '/about'
  },
  openGraph: {
    title: "About Wealthy Step | Mutual Fund Distribution Support",
    description: "Learn about Wealthy Step, our core values, and our commitment to goal-based mutual fund distribution and investor education.",
    url: '/about',
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <AboutHero />
      <AboutStory />
      <WhatWePlan />
      <OurApproach />
      <MissionVision />
      <CoreValues />
      <Philosophy />
    </div>
  );
}
