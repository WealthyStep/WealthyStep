import { InnerHero } from "@/components/sections/InnerHero";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { TrendingUp, PieChart, Briefcase, LineChart, Target, Building } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Solutions | Wealthy Step",
  description: "Smart investment strategies and portfolio management for your financial growth.",
};

const investmentServices = [
  {
    title: "Mutual Funds",
    description: "Expertly curated equity, debt, and hybrid mutual fund portfolios aligned with your risk appetite and goals.",
    icon: PieChart,
    href: "/contact",
  },
  {
    title: "Portfolio Management (PMS)",
    description: "Bespoke investment strategies for HNIs aiming for aggressive growth through direct equity exposure.",
    icon: Briefcase,
    href: "/contact",
  },
  {
    title: "Direct Equity",
    description: "Research-backed stock recommendations for building a robust long-term equity portfolio.",
    icon: TrendingUp,
    href: "/contact",
  },
  {
    title: "Goal-Based Investing",
    description: "Structured investment plans specifically mapped to your child's education, retirement, or home buying.",
    icon: Target,
    href: "/goal-calculators",
  },
  {
    title: "Fixed Income",
    description: "Stable, predictable returns through Corporate FDs, Bonds, and NCDs for capital preservation.",
    icon: LineChart,
    href: "/contact",
  },
  {
    title: "Real Estate Funds",
    description: "Fractional real estate and REIT investments for passive income and portfolio diversification.",
    icon: Building,
    href: "/contact",
  },
];

export default function InvestmentsPage() {
  return (
    <>
      <InnerHero
        title="Investment Solutions"
        subtitle="Grow Your Wealth"
        description="Data-driven investment strategies designed to outpace inflation and achieve your financial milestones."
        icon={TrendingUp}
        bgImage="/1.jpg"
      />

      <section className="section-white py-16 md:py-24">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark">Explore Our Investment Avenues</h2>
            <p className="text-text-body mt-4 max-w-2xl mx-auto">
              From conservative wealth preservation to aggressive growth, we have the right vehicle for your capital.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
