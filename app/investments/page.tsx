import { Metadata } from "next";
import { InvestmentsHero } from "@/components/sections/investments/InvestmentsHero";
import { InvestmentApproach } from "@/components/sections/investments/InvestmentApproach";
import { InvestmentOptions } from "@/components/sections/investments/InvestmentOptions";
import { InvestmentStats } from "@/components/sections/investments/InvestmentStats";
import { WhyInvestWithUs } from "@/components/sections/investments/WhyInvestWithUs";
import { InvestmentsCTA } from "@/components/sections/investments/InvestmentsCTA";

export const metadata: Metadata = {
  title: "Investment Solutions | Wealthy Step",
  description: "Smart investment strategies and portfolio management for your financial growth.",
};

export default function InvestmentsPage() {
  return (
    <>
      <InvestmentsHero />
      <InvestmentApproach />
      <InvestmentOptions />
      <InvestmentStats />
      <WhyInvestWithUs />
      <InvestmentsCTA />
    </>
  );
}

