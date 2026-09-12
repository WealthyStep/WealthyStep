import { Metadata } from "next";
import { InsuranceHero } from "@/components/sections/insurance/InsuranceHero";
import { InsurancePlans } from "@/components/sections/insurance/InsurancePlans";
import { CorporateGroupInsurance } from "@/components/sections/insurance/CorporateGroupInsurance";
import { ProfessionalShieldPolicy } from "@/components/sections/insurance/ProfessionalShieldPolicy";
import { CorporateInsuranceCTA } from "@/components/sections/insurance/CorporateInsuranceCTA";
import { InsuranceStats } from "@/components/sections/insurance/InsuranceStats";
import { WhyChooseWealthyStep } from "@/components/sections/insurance/WhyChooseWealthyStep";
import { InsuranceFAQ } from "@/components/sections/insurance/InsuranceFAQ";
import { InsuranceCTA } from "@/components/sections/insurance/InsuranceCTA";

export const metadata: Metadata = {
  title: "Insurance Solutions for Individuals, Groups & Businesses | Wealthy Step",
  description: "Explore insurance solutions for individuals, employee groups, businesses, and organizations, including group health and group life insurance options.",
  alternates: {
    canonical: '/insurance'
  },
  openGraph: {
    title: "Insurance Solutions for Individuals, Groups & Businesses | Wealthy Step",
    description: "Explore insurance solutions for individuals, employee groups, businesses, and organizations, including group health and group life insurance options.",
    url: '/insurance',
    type: "website",
  },
};

export default function InsurancePage() {
  return (
    <>
      <InsuranceHero />
      <InsurancePlans />
      <CorporateGroupInsurance />
      <ProfessionalShieldPolicy />
      <CorporateInsuranceCTA />
      <InsuranceStats />
      <WhyChooseWealthyStep />
      <InsuranceFAQ />
      <InsuranceCTA />
    </>
  );
}
