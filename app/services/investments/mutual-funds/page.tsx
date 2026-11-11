import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Wallet, TrendingUp, Landmark, Layers, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Clock, BarChart3, AlertTriangle } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/investments/mutual-funds/",
  title: "Explore Mutual Fund Investments & SIP | Wealthy Step",
  description:
    "Explore equity, debt, hybrid mutual fund schemes and Systematic Investment (SIP) with Wealthy Step, AMFI Registered Mutual Fund Distributor.",
  keywords: [
    "Mutual Funds India",
    "SIP Systematic Investment",
    "Equity Mutual Funds",
    "Debt Mutual Funds",
    "Hybrid Funds",
    "ELSS Tax Saving",
    "AMFI Mutual Fund Distributor ARN-322891",
  ],
});

const faqs = [
  {
    question: "What is a Mutual Fund?",
    answer: "A mutual fund is a professionally managed investment scheme that pools money from numerous investors to purchase securities like stocks, bonds, or money market instruments, following a specific mandate."
  },
  {
    question: "What is the difference between SIP and Lump Sum investing?",
    answer: "A Systematic Investment route (SIP) allows you to invest a fixed amount at regular intervals (e.g., monthly), benefiting from rupee cost averaging. Lump sum investing involves deploying a single, larger amount into a scheme at one time."
  },
  {
    question: "How do Equity and Debt funds differ?",
    answer: "Equity funds invest predominantly in equities (shares) of companies and are suitable for long-term growth horizons, carrying market equity risk. Debt funds invest in fixed-income securities like government bonds and corporate debt, offering lower volatility than equities."
  },
  {
    question: "What is an ELSS fund?",
    answer: "Equity Linked Savings Scheme (ELSS) is a category of equity mutual fund that offers tax deduction benefits under Section 80C of the Income Tax Act, subject to applicable tax laws, with a statutory lock-in period of 3 years."
  },
  {
    question: "Are returns from mutual funds guaranteed?",
    answer: "No. Mutual funds do not provide guaranteed returns. NAVs (Net Asset Values) fluctuate based on market movements. Investors should evaluate their risk profile and read all scheme information documents carefully before investing."
  }
];

export default function MutualFundsPage() {
  return (
    <>
      <ServiceHero
        badge="AMFI Registered MFD"
        badgeIcon={Wallet}
        visualBadge="ARN-322891"
        title="Explore Mutual Fund"
        highlightedTitle="Investments"
        description="Discover mutual fund schemes across different asset categories and investment approaches to support your long-term wealth creation journey."
        themeColor="emerald"
        breadcrumbs={[
          { label: "Investments", href: "/services/investments/indian-investments/" },
          { label: "Indian Investments", href: "/services/investments/indian-investments/" },
          { label: "Mutual Funds", href: "/services/investments/mutual-funds/" },
        ]}
        primaryCtaText="Start a SIP Enquiry"
        heroImage="/images/service-2.png"
        heroImageAlt="Mutual Fund Investment Solutions and Portfolio Growth"
      />

      {/* ── Section 1: Introduction to Mutual Funds ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">
                Disciplined Wealth Accumulation
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Professionally Managed Investment Portfolios
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Mutual funds offer retail and institutional investors access to diversified, professionally managed baskets of securities. Under SEBI regulations, each mutual fund is managed by an Asset Management Company (AMC) overseen by a Board of Trustees.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Through Wealthy Step, an AMFI-registered distributor (ARN-322891), you can explore schemes tailored to your specific investment horizon, risk appetite, and stated financial objectives.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Diversification Across Sectors</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High Liquidity (Open-Ended)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[480px] rounded-3xl overflow-hidden border-2 border-emerald-100 shadow-2xl group bg-white">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/images/services/mutual-funds-growth.jpg"
                    alt="Mutual Funds SIP Growth and Wealth Compounding"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180D45]/80 via-[#180D45]/15 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <span className="text-xs font-black tracking-wide block">Disciplined Compounding</span>
                      <span className="text-[10px] text-emerald-200">Systematic Rupee Cost Averaging</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                      SIP &amp; Lump Sum
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Core Asset Categories ── */}
      <section className="py-8 md:py-10 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Primary Scheme Categories
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              SEBI categorizes mutual fund schemes into distinct asset classes with specific mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Equity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Equity Funds
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Invest at least 65% of assets in listed company equities. Suitable for long-term horizons seeking capital appreciation, subject to equity market volatility.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Large Cap, Mid Cap, Small Cap</li>
                <li>• Flexi Cap &amp; Multi Cap</li>
                <li>• Sectoral &amp; Thematic Funds</li>
              </ul>
            </div>

            {/* Debt */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Debt Funds
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Invest in fixed-income securities like government bonds, corporate debentures, and money market instruments with lower volatility than equity.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Liquid &amp; Overnight Funds</li>
                <li>• Short Duration Funds</li>
                <li>• Corporate Bond Schemes</li>
              </ul>
            </div>

            {/* Hybrid */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Hybrid Funds
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Combine equity and debt allocations within a single scheme to balance capital growth potential with fixed-income stability.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Aggressive Hybrid Schemes</li>
                <li>• Balanced Advantage / Dynamic Asset Allocation</li>
                <li>• Multi-Asset Allocation Funds</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 3: Investment Modes (SIP vs Lump Sum) ── */}
      <section className="py-6 md:py-8 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1.5">
              Flexible Investment Modes
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Choose the approach that aligns best with your cash flow and financial preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            
            <div className="bg-[#FAFDF9] rounded-2xl p-5 sm:p-6 border border-emerald-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-navy font-heading mb-1.5">
                Systematic Investment (SIP)
              </h3>
              <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-3">
                Invest a predetermined amount at fixed intervals (monthly or quarterly) via automated bank mandates. Encourages regular financial discipline and benefits from rupee cost averaging across market cycles.
              </p>
              <span className="text-[11px] font-bold text-emerald-700">
                Ideal for regular salaried and monthly income earners.
              </span>
            </div>

            <div className="bg-[#F0FDF4] rounded-2xl p-5 sm:p-6 border border-emerald-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-navy font-heading mb-1.5">
                Lump Sum Investment
              </h3>
              <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-3">
                Deploy an available capital sum at one go into a chosen scheme. Suitable when you have idle surplus funds or receive periodic bonuses, windfall receipts, or maturity proceeds.
              </p>
              <span className="text-[11px] font-bold text-emerald-700">
                Suitable for deploying existing surplus capital.
              </span>
            </div>

          </div>

          {/* Mutual Funds Portfolio Diversification Spotlight */}
          <div className="mt-6 sm:mt-7 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-sky-50/40 p-5 sm:p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex justify-center">
                <div className="relative aspect-[16/10] w-full max-w-[340px] rounded-2xl overflow-hidden border border-emerald-200/80 shadow-md">
                  <Image
                    src="/images/services/mutual-funds-portfolio.jpg"
                    alt="Mutual Funds Asset Allocation and Risk Mitigation Umbrella"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-7">
                <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
                  Balanced Architecture
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-navy font-heading mb-2">
                  Portfolio Diversification &amp; Protection
                </h3>
                <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-4">
                  Mutual funds pool collective resources to invest across diversified baskets of securities. This spreads your exposure across companies, sectors, and asset classes, mitigating the impact of any single asset&apos;s underperformance.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-navy">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200">Asset Allocation</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200">SEBI Regulated Custody</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200">Disciplined Review</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mandatory Statutory Disclaimer */}
      <section className="py-3.5 sm:py-4 bg-amber-50 border-t border-b border-amber-200/80 text-center">
        <div className="container mx-auto max-w-[960px] px-4">
          <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
            &ldquo;Mutual Fund investments are subject to market risks, read all scheme related documents carefully.&rdquo;
          </p>
        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Ready to Explore Mutual Fund Schemes?"
        description="Connect with our AMFI-registered distributor team in Hyderabad to review available scheme portfolios."
        primaryText="Contact Us Today"
      />
    </>
  );
}

