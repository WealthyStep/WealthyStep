import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { WhatWePlan } from "@/components/sections/about/WhatWePlan";
import { OurApproach } from "@/components/sections/about/OurApproach";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { Philosophy } from "@/components/sections/about/Philosophy";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata = constructMetadata(ROUTES_SEO.about);

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
