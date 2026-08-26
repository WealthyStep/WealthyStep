import { Metadata } from "next";
import { InsuranceHero } from "@/components/sections/insurance/InsuranceHero";
import { InsurancePlans } from "@/components/sections/insurance/InsurancePlans";
import { InsuranceStats } from "@/components/sections/insurance/InsuranceStats";
import { WhyChooseWealthyStep } from "@/components/sections/insurance/WhyChooseWealthyStep";
import { InsuranceCTA } from "@/components/sections/insurance/InsuranceCTA";

export const metadata: Metadata = {
  title: "Insurance Solutions & Coverage Options | Wealthy Step",
  description: "Explore term life and health insurance plans designed to support your family's future.",
  alternates: {
    canonical: '/insurance'
  },
  openGraph: {
    title: "Insurance Solutions & Coverage Options | Wealthy Step",
    description: "Explore term life and health insurance plans designed to support your family's future.",
    url: '/insurance',
    type: "website",
  },
};

export default function InsurancePage() {
  return (
    <>
      <InsuranceHero />
      <InsurancePlans />
      <InsuranceStats />
      <WhyChooseWealthyStep />
      <InsuranceCTA />
    </>
  );
}
