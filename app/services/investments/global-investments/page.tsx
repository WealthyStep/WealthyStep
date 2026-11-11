import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Globe, Building2, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2, Landmark, Compass, DollarSign } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/investments/global-investments/",
  title: "Explore Global Investment Opportunities | Wealthy Step",
  description:
    "Discover international investment avenues and financial market opportunities through applicable investment channels and GIFT City IFSC with Wealthy Step.",
  keywords: [
    "Global Investments",
    "International Financial Markets",
    "GIFT City IFSC",
    "Overseas Investment Channels",
    "USD Investments India",
    "Wealthy Step Global",
  ],
});

const faqs = [
  {
    question: "What are global investments?",
    answer: "Global investments refer to allocating capital into financial markets, securities, or funds situated outside of India, or within India's International Financial Services Centre (GIFT IFSC), allowing portfolio diversification across currencies and geographies."
  },
  {
    question: "Can resident Indian individuals invest in international markets?",
    answer: "Yes, resident Indian individuals can invest in permitted overseas avenues subject to the Reserve Bank of India's Liberalised Remittance Scheme (LRS) regulations and annual limits (currently up to USD 250,000 per financial year)."
  },
  {
    question: "How does GIFT City facilitate global investments?",
    answer: "GIFT IFSC in Gujarat operates as a unified international jurisdiction within India, regulated by the IFSCA. It provides access to international financial products, global funds, and foreign currency accounts without requiring overseas entity setup."
  },
  {
    question: "Does Wealthy Step operate an IFSC entity?",
    answer: "No. Wealthy Step operates as an AMFI-registered distributor and facilitates exploration of available sanctioned distribution channels. Wealthy Step does not operate as an IFSC entity directly."
  }
];

export default function GlobalInvestmentsPage() {
  return (
    <>
      <ServiceHero
        badge="Global Investments"
        badgeIcon={Globe}
        visualBadge="International Markets"
        title="Explore Global"
        highlightedTitle="Investment Opportunities"
        description="Discover international investment avenues and financial market opportunities through applicable investment channels and GIFT City IFSC."
        themeColor="blue"
        breadcrumbs={[
          { label: "Investments", href: "/services/investments/indian-investments/" },
          { label: "Global Investments", href: "/services/investments/global-investments/" },
        ]}
        primaryCtaText="Enquire About Global Avenues"
      />

      {/* ── Section 1: Introduction to Global Investments ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2">
                Geographic Diversification
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Broaden Your Horizons Beyond Domestic Boundaries
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Global investing enables investors to participate in world-leading enterprises, multinational economies, and major reserve currencies. By expanding beyond a single market, investors can access themes and sectors that may not be extensively represented locally.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                All international investment routes are governed by transparent statutory guidelines, including the Foreign Exchange Management Act (FEMA), RBI Liberalised Remittance Scheme (LRS), and applicable IFSCA frameworks.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Currency Exposure</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Cross-Border Products</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* Global Financial Gateways Matrix (Eliminating duplicate image) */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-[#0F172A] via-navy to-[#0A0E27] p-6 sm:p-7 text-white border border-sky-900/60 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">Cross-Border Gateway</h4>
                      <p className="text-[11px] text-sky-200/70">Regulated International Access</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Compliant
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">RBI LRS Facility</p>
                      <p className="text-[10px] text-gray-400">Up to USD 250,000 per financial year</p>
                    </div>
                    <span className="text-xs font-black text-sky-300">FEMA Regulated</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">GIFT IFSC Ecosystem</p>
                      <p className="text-[10px] text-gray-400">Dollar-denominated funds &amp; offshore equities</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">IFSCA Single Window</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Domestic Global Feeder Funds</p>
                      <p className="text-[10px] text-gray-400">INR investment into global indexes</p>
                    </div>
                    <span className="text-xs font-black text-purple-300">SEBI Regulated</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    Transparent Distribution Process
                  </span>
                  <span className="text-sky-300 font-bold">100% Regulated</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: International Financial Markets & Available Channels ── */}
      <section className="py-5 sm:py-6 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1.5">
              Available Investment Channels
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Multiple compliant avenues exist for Indian investors exploring international avenues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3.5 border border-sky-100">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                Domestic Feeder Funds
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                SEBI-registered Indian mutual funds that invest in overseas mutual funds, global ETFs, or multinational indexes denominated in INR.
              </p>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                INR Denominated · SEBI Regulated
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 border border-emerald-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                RBI LRS Route
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Direct remittance of funds in foreign currencies (USD) for permitted investments abroad under the annual USD 250,000 threshold.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Foreign Currency · FEMA Compliant
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 border border-purple-100">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-1.5">
                GIFT IFSC Gateway
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-3.5">
                Access to global investment funds and instruments structured within India&apos;s offshore financial jurisdiction under IFSCA regulations.
              </p>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Offshore Jurisdiction · IFSCA Regulated
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 3: Spotlight on GIFT City ── */}
      <section className="py-5 sm:py-6 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#180D45] via-[#1E1156] to-[#0369A1] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="relative z-10 lg:col-span-7">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block mb-2">
                Dedicated Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading leading-tight mb-4">
                GIFT City International Financial Services Centre
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6">
                Learn how GIFT IFSC in Gandhinagar, Gujarat provides a world-class financial ecosystem connecting domestic Indian investors and global markets under a unified international regulatory umbrella.
              </p>
              <Link
                href="/services/investments/gift-city/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-navy text-xs sm:text-sm font-bold transition-all shadow-md hover:bg-gray-100"
              >
                <span>Explore Dedicated GIFT City Page</span>
                <ArrowRight className="w-4 h-4 text-navy" />
              </Link>
            </div>
            <div className="relative z-10 lg:col-span-5">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image
                  src="/images/services/gift-city-skyline.jpg"
                  alt="GIFT City IFSC Skyline in Gandhinagar"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Interested in Global Investments?"
        description="Connect with Wealthy Step to understand available international channels and regulatory guidelines."
        primaryText="Enquire Now"
      />
    </>
  );
}

