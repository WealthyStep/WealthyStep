import { Metadata } from "next";
import { InvestmentsHero } from "@/components/sections/investments/InvestmentsHero";
import { InvestmentApproach } from "@/components/sections/investments/InvestmentApproach";
import { InvestmentOptions } from "@/components/sections/investments/InvestmentOptions";
import { InvestmentStats } from "@/components/sections/investments/InvestmentStats";
import { WhyInvestWithUs } from "@/components/sections/investments/WhyInvestWithUs";
import { InvestmentsCTA } from "@/components/sections/investments/InvestmentsCTA";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Mutual Fund Solutions | Wealthy Step",
  description: "Discover a diverse range of mutual fund solutions tailored for your risk tolerance and investment horizon.",
  alternates: {
    canonical: '/investments'
  },
  openGraph: {
    title: "Mutual Fund Solutions | Wealthy Step",
    description: "Discover a diverse range of mutual fund solutions tailored for your risk tolerance and investment horizon.",
    url: '/investments',
    type: "website",
  },
};

export default function InvestmentsPage() {
  return (
    <>
      <InvestmentsHero />
      <InvestmentApproach />
      <InvestmentOptions />
      <InvestmentStats />
      <WhyInvestWithUs />
      
      <FAQSection 
        title="Frequently Asked Questions" 
        description="Learn more about mutual fund investments and our distribution services."
        faqs={[
          {
            question: "What is a Systematic Investment Plan (SIP)?",
            answer: "A Systematic Investment Plan (SIP) is a method of investing a fixed amount regularly in a mutual fund scheme. It allows you to invest systematically and benefit from rupee cost averaging over time."
          },
          {
            question: "What is the difference between Equity and Debt mutual funds?",
            answer: "Equity mutual funds predominantly invest in stocks of companies and are suited for long-term growth. Debt mutual funds invest in fixed income instruments like government securities and corporate bonds, generally offering more stability but potentially lower long-term returns compared to equity."
          },
          {
            question: "Can I withdraw my money anytime?",
            answer: "In open-ended mutual funds, you can generally redeem your investments on any business day. However, certain funds like ELSS (Equity Linked Savings Scheme) have a mandatory lock-in period of 3 years. Exit loads may apply depending on the holding period and the specific scheme."
          }
        ]}
      />
      <InvestmentsCTA />
    </>
  );
}

