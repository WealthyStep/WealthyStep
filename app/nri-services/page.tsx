import { Metadata } from "next";
import { NriHero } from "@/components/sections/nri-services/NriHero";
import { NriServicesGrid } from "@/components/sections/nri-services/NriServicesGrid";
import { NriProcess } from "@/components/sections/nri-services/NriProcess";
import { NriCTA } from "@/components/sections/nri-services/NriCTA";

export const metadata: Metadata = {
  title: "NRI Services | Wealthy Step",
  description: "Specialized wealth management and taxation services for Non-Resident Indians.",
};

export default function NriServicesPage() {
  return (
    <>
      <NriHero />
      <NriServicesGrid />
      <NriProcess />
      <NriCTA />
    </>
  );
}
