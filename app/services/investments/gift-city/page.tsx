import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Building2, Globe, ShieldCheck, ArrowRight, Landmark, Layers, CheckCircle2, FileText, Scale } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/investments/gift-city/",
  title: "GIFT City IFSC Investment Opportunities | Wealthy Step",
  description:
    "Explore GIFT City International Financial Services Centre (GIFT IFSC), its international financial ecosystem, USD products, and regulatory frameworks.",
  keywords: [
    "GIFT City IFSC",
    "GIFT City Investments",
    "IFSCA Regulations",
    "International Financial Services Centre",
    "GIFT City Gandhinagar",
    "Wealthy Step GIFT City",
  ],
});

const faqs = [
  {
    question: "What is GIFT City?",
    answer: "Gujarat International Finance Tec-City (GIFT City) is a smart business district in Gandhinagar, Gujarat, housing India's first operational International Financial Services Centre (IFSC)."
  },
  {
    question: "What is GIFT IFSC?",
    answer: "GIFT IFSC is a specially demarcated financial zone that treats financial entities as offshore for regulatory and tax purposes, allowing cross-border financial transactions and foreign currency services under the unified oversight of the IFSCA."
  },
  {
    question: "What products are available through GIFT IFSC?",
    answer: "Verified products include international mutual funds, global alternative investment funds (AIFs), foreign currency accounts, overseas equities via international exchanges, and structured offshore debt instruments."
  },
  {
    question: "What are the eligibility requirements for investing through GIFT IFSC?",
    answer: "Indian resident individuals can invest through GIFT IFSC under the RBI's Liberalised Remittance Scheme (LRS) within annual limits. Non-Resident Indians (NRIs) and foreign investors can invest using freely convertible foreign currencies without standard Indian domestic tax implications."
  },
  {
    question: "Is Wealthy Step an IFSC entity?",
    answer: "No. Wealthy Step is an AMFI-registered Mutual Fund Distributor based in Hyderabad, India. Wealthy Step provides factual information and distribution coordination through sanctioned channels and does not directly operate an IFSC entity."
  }
];

export default function GiftCityPage() {
  return (
    <>
      <ServiceHero
        badge="GIFT IFSC · Gandhinagar"
        badgeIcon={Building2}
        visualBadge="Unified International Hub"
        title="Discover Investment Opportunities"
        highlightedTitle="Through GIFT City"
        description="Explore GIFT City International Financial Services Centre (GIFT IFSC) and learn about its financial ecosystem, foreign currency products, and regulatory frameworks."
        themeColor="blue"
        breadcrumbs={[
          { label: "Investments", href: "/services/investments/indian-investments/" },
          { label: "Global Investments", href: "/services/investments/global-investments/" },
          { label: "GIFT City", href: "/services/investments/gift-city/" },
        ]}
        primaryCtaText="Inquire About GIFT City"
        heroImage="/images/services/gift-city-skyline.jpg"
        heroImageAlt="GIFT City International Financial Services Centre (GIFT IFSC) Skyline"
      />

      {/* ── Section 1: What is GIFT City & GIFT IFSC? ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2">
                Offshore Financial Ecosystem in India
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                India&apos;s Flagship International Financial Services Centre
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                GIFT City is conceptualized as a benchmark global financial and IT services hub. Within GIFT City, the International Financial Services Centre (GIFT IFSC) provides a regulatory, financial, and tax architecture equivalent to leading international hubs like Singapore, London, and Dubai.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Regulated by the International Financial Services Centres Authority (IFSCA), it acts as a single-window unified regulator replacing the multi-regulator regime for IFSC operations.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <Landmark className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>IFSCA Unified Regulation</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>USD / Multi-Currency Denomination</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* GIFT IFSC Architecture Matrix */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#111F3C] to-[#0D182E] p-6 sm:p-7 text-white border border-sky-800/60 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">GIFT IFSC Hub</h4>
                      <p className="text-[11px] text-sky-200/70">Gandhinagar, Gujarat</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    IFSCA Unified
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Foreign Currency Regimes</p>
                      <p className="text-[10px] text-gray-400">USD, EUR, GBP, SGD settlements</p>
                    </div>
                    <span className="text-xs font-black text-sky-300">Zero Inr Risk</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Global Exchange Access</p>
                      <p className="text-[10px] text-gray-400">India INX &amp; NSE IX trading portals</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">22hr Trading</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Tax Competitive Architecture</p>
                      <p className="text-[10px] text-gray-400">Competitive rates for foreign investors</p>
                    </div>
                    <span className="text-xs font-black text-purple-300">Exemptions</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    Statutory LRS Compliance
                  </span>
                  <span className="text-sky-300 font-bold">100% Regulated</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Financial Ecosystem & Available Products ── */}
      <section className="pt-4 sm:pt-5 pb-3 sm:pb-3.5 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1.5">
              Financial Ecosystem &amp; Products
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Overview of verified investment avenues available through GIFT IFSC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3.5 border border-sky-100">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                Global Mutual Funds &amp; AIFs
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Inbound and outbound fund structures domiciled in GIFT IFSC, providing access to international asset classes denominated in USD.
              </p>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                Foreign Currency Funds
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 border border-emerald-100">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                International Exchanges
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Platforms such as India INX and NSE IX located within GIFT City, offering trading in global indices, equities, and commodities.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                International Trading Venues
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 border border-purple-100">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                Banking &amp; Depository Receipts
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Foreign currency bank accounts, multi-currency deposit facilities, and unsponsored depository receipts for US and international listed stocks.
              </p>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Offshore Banking Units (IBUs)
              </span>
            </div>

          </div>

          {/* ── Eligibility & Regulatory Parameters ── */}
          <div className="mt-4 sm:mt-5 bg-[#FAFDF9] rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-2xs">
            <h3 className="text-base sm:text-lg font-black text-navy font-heading mb-2">
              Eligibility &amp; Regulatory Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-text-body leading-relaxed">
              <div>
                <strong className="text-navy block mb-1">For Resident Indian Investors:</strong>
                Investments through GIFT IFSC are routed through the Reserve Bank of India&apos;s Liberalised Remittance Scheme (LRS), with current limits of USD 250,000 per individual per financial year.
              </div>
              <div>
                <strong className="text-navy block mb-1">For Non-Resident Indians (NRIs):</strong>
                NRIs can invest directly in foreign currency instruments within GIFT IFSC with tax-efficient treatment on capital gains under applicable double tax avoidance agreements (DTAA).
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Ready to Learn More About GIFT City?"
        description="Contact Wealthy Step to understand verified distribution arrangements and explore GIFT City IFSC opportunities."
        primaryText="Contact Us Today"
      />
    </>
  );
}

