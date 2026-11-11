import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Layers, ShieldAlert, Award, FileText, ArrowRight, ShieldCheck, CheckCircle2, Sliders, Briefcase, Info } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/investments/sif/",
  title: "Specialized Investment Funds (SIF) SEBI Framework | Wealthy Step",
  description:
    "Discover Specialized Investment Funds (SIF), an investment category within SEBI's mutual fund framework for strategy-specific investment mandates.",
  keywords: [
    "Specialized Investment Funds",
    "SIF Mutual Funds",
    "SEBI SIF Framework",
    "Specialized Investment Strategies",
    "Wealthy Step SIF",
    "AMFI SIF Distributor",
  ],
});

const faqs = [
  {
    question: "What is a Specialized Investment Fund (SIF)?",
    answer: "A Specialized Investment Fund (SIF) is an investment product category established under the Securities and Exchange Board of India (SEBI) mutual fund regulatory framework to cater to strategy-specific asset allocation mandates."
  },
  {
    question: "How does an SIF differ from standard mutual funds?",
    answer: "Standard mutual funds operate under broad retail categorization (Large Cap, Mid Cap, Liquid, etc.). SIFs are structured to implement differentiated investment strategies under distinct regulatory operating parameters."
  },
  {
    question: "Is SIF suitable for every investor?",
    answer: "No. SIFs are not suitable for every investor. Due to strategy-specific mandates and varying risk-return profiles, suitability depends on an investor's individual risk tolerance, experience, and horizon as outlined in the Scheme Information Document (SID)."
  },
  {
    question: "Does an SIF provide guaranteed returns?",
    answer: "No. SIFs do not provide guaranteed returns, assured returns, or capital guarantees. SIF units are subject to market risks, and unit values will fluctuate based on the performance of underlying securities."
  },
  {
    question: "What is Wealthy Step's role with SIFs?",
    answer: "Wealthy Step is an AMFI-registered distributor (ARN-322891). We provide factual product information on SEBI-approved SIF schemes and coordinate execution through authorized mutual fund channels."
  }
];

export default function SifPage() {
  return (
    <>
      <ServiceHero
        badge="SEBI Mutual Fund Framework"
        badgeIcon={Layers}
        visualBadge="Specialized Strategies"
        title="Discover Specialized"
        highlightedTitle="Investment Funds (SIF)"
        description="Learn about Specialized Investment Funds, a distinct investment product category within SEBI's mutual fund framework designed for specific investment mandates."
        themeColor="purple"
        breadcrumbs={[
          { label: "Investments", href: "/services/investments/indian-investments/" },
          { label: "Indian Investments", href: "/services/investments/indian-investments/" },
          { label: "Specialized Investment Funds", href: "/services/investments/sif/" },
        ]}
        primaryCtaText="Inquire About SIF Mandates"
        heroImage="/images/services/sif-growth-portfolio.jpg"
        heroImageAlt="Specialized Investment Funds (SIF) Portfolio Strategies"
      />

      {/* ── Section 1: What Are Specialized Investment Funds? ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-2">
                Differentiated Investment Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Structured Under SEBI&apos;s Defined Framework
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Specialized Investment Funds (SIF) represent a specialized category within the Indian mutual fund landscape. These funds allow asset management companies to create targeted portfolios adhering to specialized investment strategies that complement traditional equity and debt schemes.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Each SIF operates under statutory guidelines issued by SEBI, with governance oversight by fund trustees and custody managed by registered custodians.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Defined SEBI Framework</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Mandate-Specific Objectives</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* Specialized Investment Funds (SIF) Architecture Card */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-[#120B2E] via-[#1E1145] to-[#0D0722] p-6 sm:p-7 text-white border border-purple-800/60 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">SIF Regulatory Framework</h4>
                      <p className="text-[11px] text-purple-200/70">SEBI Mutual Fund Category</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Mandate Specific
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Targeted Strategy Mandates</p>
                      <p className="text-[10px] text-gray-400">Thematic &amp; specialized asset allocation rules</p>
                    </div>
                    <span className="text-xs font-black text-purple-300">Regulated</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Institutional Custody &amp; NAV</p>
                      <p className="text-[10px] text-gray-400">Independent trustee oversight &amp; daily valuation</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">Transparent</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Statutory SID Filing</p>
                      <p className="text-[10px] text-gray-400">Documented parameters, exit terms &amp; disclosures</p>
                    </div>
                    <span className="text-xs font-black text-sky-300">Audited</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    AMFI Aligned Distribution
                  </span>
                  <span className="text-purple-300 font-bold">ARN - 322891</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Structure & Strategies ── */}
      <section className="pt-4 sm:pt-5 pb-3 sm:pb-3.5 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1.5">
              SIF Structure &amp; Strategies
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Key characteristics that define the Specialized Investment Fund category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 border border-purple-100">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                Differentiated Mandates
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Structured to pursue targeted thematic or strategy-led mandates that differ from benchmark-indexed retail equity or debt funds.
              </p>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Strategy-Specific
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 border border-emerald-100">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                Governance &amp; Custody
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Operates within SEBI mutual fund trustee oversight, with daily NAV calculations, periodic portfolio disclosures, and independent auditing.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Institutional Oversight
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3.5 border border-sky-100">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                Product Information (SID)
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                All investment parameters, asset limits, exit loads, and risk profiles are transparently documented in the Scheme Information Document (SID).
              </p>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                Transparent Documentation
              </span>
            </div>

          </div>

          {/* ── Investor Suitability & Disclosures ── */}
          <div className="mt-4 sm:mt-5 bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs">
            <h3 className="text-base sm:text-lg font-black text-navy font-heading mb-2">
              Important Investor Information &amp; Suitability
            </h3>
            <p className="text-xs text-text-body leading-relaxed mb-3">
              SIFs are not suitable for every investor. Prospective investors must evaluate scheme-specific characteristics, minimum ticket sizes, lock-in terms (if applicable), and risk factors prior to investment.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong className="block mb-0.5 font-bold">Standard Risk Disclosure:</strong>
              Mutual Fund investments, including Specialized Investment Funds, are subject to market risks. Read all scheme related documents carefully before investing. SIFs do not provide assured returns or capital guarantees.
            </div>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Have Questions About SIF Schemes?"
        description="Connect with Wealthy Step to review official SEBI-approved SIF scheme materials."
        primaryText="Enquire About SIF"
      />
    </>
  );
}

