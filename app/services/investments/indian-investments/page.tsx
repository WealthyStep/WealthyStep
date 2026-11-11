import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { TrendingUp, Layers, ArrowRight, ShieldCheck, CheckCircle2, Wallet, PieChart, Coins } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/investments/indian-investments/",
  title: "Explore India's Investment Landscape | Wealthy Step",
  description:
    "Discover mutual funds, SIP, and Specialized Investment Funds (SIF) across India's domestic financial markets with Wealthy Step, AMFI Registered Distributor.",
  keywords: [
    "Indian Investments",
    "Mutual Funds India",
    "Specialized Investment Funds SIF",
    "SIP Investment India",
    "AMFI Mutual Fund Distributor",
    "Wealthy Step Indian Markets",
  ],
});

const faqs = [
  {
    question: "What investment categories are available in the Indian financial market?",
    answer: "India's capital markets offer various regulated investment avenues including Mutual Funds (Equity, Debt, Hybrid, ELSS), Systematic Investments (SIP), Specialized Investment Funds (SIF), and government securities."
  },
  {
    question: "How do Mutual Funds and SIF differ?",
    answer: "Traditional mutual funds offer standardized retail portfolio schemes across equity, debt, and hybrid assets. Specialized Investment Funds (SIF) represent a distinct SEBI-regulated category designed for strategy-specific portfolio mandates."
  },
  {
    question: "How can I start investing in Indian mutual funds?",
    answer: "Investing begins with completing a one-time KYC (Know Your Customer) compliance process, selecting suitable schemes based on your horizon and risk profile, and deciding between lump-sum or systematic monthly investment (SIP)."
  },
  {
    question: "What is Wealthy Step's role in Indian investments?",
    answer: "Wealthy Step is an AMFI-registered Mutual Fund Distributor (ARN-322891). We provide factual information on mutual fund schemes and assist investors in executing transactions through sanctioned registrar and transfer agent (RTA) platforms."
  }
];

export default function IndianInvestmentsPage() {
  return (
    <>
      <ServiceHero
        badge="Indian Investments"
        badgeIcon={TrendingUp}
        visualBadge="Domestic Capital Markets"
        title="Explore India's"
        highlightedTitle="Investment Landscape"
        description="Discover investment products and opportunities available across India's growing financial markets through regulated distribution channels."
        themeColor="emerald"
        breadcrumbs={[
          { label: "Investments", href: "/services/investments/indian-investments/" },
          { label: "Indian Investments", href: "/services/investments/indian-investments/" },
        ]}
        primaryCtaText="Explore Products"
        heroImage="/images/services/indian-investments-map.jpg"
        heroImageAlt="Indian Investment Growth and Rupee Capital Markets"
      />

      {/* ── Section 1: Introduction to Indian Markets ── */}
      <section className="py-6 sm:py-7 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">
                India&apos;s Economic Expansion
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Participate in One of the World&apos;s Fastest-Growing Economies
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                The Indian financial markets provide a robust, transparent, and technology-driven investment environment overseen by the Securities and Exchange Board of India (SEBI) and the Association of Mutual Funds in India (AMFI).
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Whether you are seeking long-term capital growth through equity mutual funds, portfolio stability through fixed-income debt schemes, or specialized mandates via SIF, Indian markets offer diverse asset classes for every investment horizon.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SEBI Regulated Framework</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital RTA Execution</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* Domestic Capital Markets Architecture Card */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0F1F38] to-[#0A182E] p-6 sm:p-7 text-white border border-emerald-800/60 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">Domestic Capital Ecosystem</h4>
                      <p className="text-[11px] text-emerald-200/70">SEBI &amp; AMFI Aligned Distribution</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% Digital
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Equity &amp; Debt Mutual Funds</p>
                      <p className="text-[10px] text-gray-400">Systematic investing (SIP) &amp; rupee cost averaging</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">AMFI MFD</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Digital RTA Execution</p>
                      <p className="text-[10px] text-gray-400">Direct integration with CAMS &amp; KFintech</p>
                    </div>
                    <span className="text-xs font-black text-sky-300">Paperless</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Institutional Oversight</p>
                      <p className="text-[10px] text-gray-400">Independent trustee oversight &amp; daily NAV</p>
                    </div>
                    <span className="text-xs font-black text-purple-300">SEBI Aligned</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Transparent Distribution Model
                  </span>
                  <span className="text-emerald-300 font-bold">ARN - 322891</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Two Dedicated Service Cards (Mutual Funds & SIF) ── */}
      <section className="py-6 sm:py-7 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Core Offering
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Choose Your Investment Pathway
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Explore our two dedicated Indian investment categories with independent service portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Card 1: Mutual Funds */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-emerald-100 shadow-xs">
                  <Image
                    src="/images/services/mutual-funds-growth.jpg"
                    alt="Mutual Funds SIP Growth and Compounding"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                    Category 01 · SIP &amp; Lumpsum
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-navy font-heading mb-2">
                  Mutual Funds
                </h3>
                <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-5">
                  Explore mutual fund schemes across Equity, Debt, Hybrid, and Tax-Saving (ELSS) categories. Start disciplined Systematic Investments (SIP) or make lump-sum investments.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["SIP", "Equity Funds", "Debt Funds", "Hybrid Schemes"].map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/services/investments/mutual-funds/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-navy text-white text-xs font-bold hover:bg-[#240C7A] transition-all shadow-xs"
              >
                <span>Explore Mutual Funds Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Specialized Investment Funds (SIF) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-purple-100 shadow-xs">
                  <Image
                    src="/images/services/sif-growth-portfolio.jpg"
                    alt="Specialized Investment Funds (SIF) Growth Framework"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-purple-600/90 text-white text-[10px] font-bold backdrop-blur-xs shadow-xs">
                    Category 02 · SEBI Framework
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-navy font-heading mb-2">
                  Specialized Investment Funds (SIF)
                </h3>
                <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-5">
                  Discover Specialized Investment Funds, a distinct investment category within SEBI&apos;s mutual fund framework designed for specific investment mandates and strategies.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["SEBI Framework", "Strategy-Specific", "Mandate Info"].map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/services/investments/sif/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-navy text-white text-xs font-bold hover:bg-[#240C7A] transition-all shadow-xs"
              >
                <span>Explore SIF Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Statutory Disclaimer */}
      <section className="py-4 sm:py-5 bg-white border-b border-gray-100 text-center">
        <p className="text-xs text-gray-500 max-w-3xl mx-auto px-4">
          <strong className="text-navy">Statutory Warning:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
        </p>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Ready to Start Your Investment Journey?"
        description="Connect with Wealthy Step to explore suitable mutual fund schemes aligned with your financial goals."
        primaryText="Contact an Associate"
      />
    </>
  );
}

