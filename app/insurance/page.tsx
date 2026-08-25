import { Metadata } from "next";
import { InsuranceHero } from "@/components/sections/insurance/InsuranceHero";
import { InsurancePlans } from "@/components/sections/insurance/InsurancePlans";
import { InsuranceStats } from "@/components/sections/insurance/InsuranceStats";
import { WhyChooseWealthyStep } from "@/components/sections/insurance/WhyChooseWealthyStep";
import { InsuranceCTA } from "@/components/sections/insurance/InsuranceCTA";

export const metadata: Metadata = {
  title: "Insurance Solutions | Wealthy Step",
  description: "Comprehensive life and health insurance solutions tailored to protect what matters most.",
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
