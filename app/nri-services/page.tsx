import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Globe2, ShieldCheck, ArrowRight, Landmark, FileText, CheckCircle2, RefreshCw, Calendar, HelpCircle } from "lucide-react";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata: Metadata = constructMetadata(ROUTES_SEO.nriServices);

const nriSolutions = [
  {
    icon: Landmark,
    title: "NRE & NRO Account Facilitation",
    desc: "Assistance with banking mandates to ensure seamless deployment of funds on repatriable (NRE) or non-repatriable (NRO) bases under RBI frameworks.",
  },
  {
    icon: FileText,
    title: "Digital Overseas KYC",
    desc: "Paperless, streamlined KYC documentation coordination for NRIs using passport, overseas address proof, and PAN card.",
  },
  {
    icon: Globe2,
    title: "Mutual Funds & SIF Portfolio",
    desc: "Access to top Indian Asset Management Companies across Equity, Debt, and Hybrid mutual fund schemes, as well as Specialized Investment Funds.",
  },
  {
    icon: RefreshCw,
    title: "Repatriation Assistance",
    desc: "Coordination with certified tax professionals regarding Form 15CA/CB documentation for smooth repatriation of investment proceeds.",
  },
];

const steps = [
  {
    num: "01",
    title: "KYC & Verification",
    desc: "Digital submission of passport, PAN, and overseas address proof.",
  },
  {
    num: "02",
    title: "Account Setup",
    desc: "Linking your NRE/NRO account for automated investment execution.",
  },
  {
    num: "03",
    title: "Portfolio Tracking",
    desc: "Regular investment statements and ongoing review discussions.",
  },
];

const faqs = [
  {
    q: "Can Non-Resident Indians (NRIs) invest in Indian Mutual Funds?",
    a: "Yes. NRIs can invest in Indian mutual funds on a repatriable (via NRE account) or non-repatriable (via NRO account) basis. Investors based in the US or Canada are subject to specific AMC restrictions due to FATCA regulations.",
  },
  {
    q: "Do I need an NRE or NRO bank account?",
    a: "Yes. Mutual fund investments in India must be routed through an NRE or NRO bank account maintained with a designated Indian bank. An NRE account allows full repatriation of capital and capital gains, while an NRO account is subject to annual RBI limits.",
  },
  {
    q: "Is in-person presence required to complete NRI KYC?",
    a: "No. KYC for NRIs can typically be completed digitally via video verification and notarized/attested documents submitted through sanctioned registrar portals.",
  },
];

export default function NriServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── 1. Hero Section ── */}
      <section className="relative bg-[#180D45] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-[1100px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-lime text-xs font-bold uppercase tracking-wider">
                <Globe2 className="w-4 h-4 text-lime shrink-0" />
                <span>NRI INVESTMENT DESK · HYDERABAD</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight">
                Invest in India&apos;s Capital Markets <span className="text-lime">From Abroad.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Compliant mutual fund distribution and investment facilitation for Non-Resident Indians (NRIs) and Overseas Citizens under RBI and FEMA regulations.
              </p>

              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-lime hover:bg-cta-green text-navy text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  Inquire Now
                </Link>
                <Link
                  href="https://calendly.com/wealthystep-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all"
                >
                  Book a 30-Min Call
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime" /> FEMA Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime" /> NRE / NRO Support
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime" /> Paperless KYC
                </span>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl group">
                <Image
                  src="/images/nri-hero.jpg"
                  alt="NRI Global Investment Support & Indian Capital Markets"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-bold text-white">
                  <span>Cross-Border Facilitation</span>
                  <span className="px-2 py-0.5 rounded bg-lime/20 text-lime text-[10px]">
                    Global Desks
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Core NRI Solutions (4 Cards) ── */}
      <section className="py-5 sm:py-6 bg-white">
        <div className="container mx-auto max-w-[1100px] px-4">
          <div className="text-center max-w-xl mx-auto mb-4 sm:mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-lime block font-heading mb-0.5">
              Solutions for Global Indians
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading">
              Structured Solutions for NRI Investors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {nriSolutions.map((sol, i) => {
              const Icon = sol.icon;
              return (
                <div
                  key={i}
                  className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-lime/15 text-lime flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-lime" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-navy font-heading mb-1">
                      {sol.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-body leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Simple 3-Step Process ── */}
      <section className="py-5 sm:py-6 bg-gray-50 border-t border-b border-gray-200/70">
        <div className="container mx-auto max-w-[1100px] px-4">
          <div className="text-center max-w-lg mx-auto mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1">
              Simple 3-Step Onboarding
            </h2>
            <p className="text-xs sm:text-sm text-text-body">
              How we assist overseas investors in establishing compliant portfolios in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-2xs relative text-left"
              >
                <span className="text-2xl font-black text-lime font-heading block mb-1">
                  {st.num}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-navy font-heading mb-1">
                  {st.title}
                </h3>
                <p className="text-xs text-text-body leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Essential FAQs ── */}
      <section className="py-5 sm:py-6 bg-white">
        <div className="container mx-auto max-w-[850px] px-4">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-text-body">
              Key considerations for Non-Resident Indians investing in Indian capital markets.
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200/90 text-left space-y-1.5"
              >
                <h4 className="text-xs sm:text-sm font-bold text-navy flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-text-body leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Compact Consultation CTA ── */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto max-w-[900px] px-4 text-center">
          <div className="rounded-2xl bg-navy text-white p-5 sm:p-7 md:p-8 relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-heading">
                Ready to Invest in India&apos;s Growth?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Connect with our dedicated NRI desk in Hyderabad. We accommodate cross-border time zones for your convenience.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-lime hover:bg-cta-green text-navy text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  Contact NRI Desk
                </Link>
                <Link
                  href="https://calendly.com/wealthystep-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all"
                >
                  Book a Video Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
