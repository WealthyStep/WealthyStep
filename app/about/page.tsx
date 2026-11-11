import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, Award, Target, ArrowRight, CheckCircle2, Building2, Users2, Eye } from "lucide-react";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata: Metadata = constructMetadata(ROUTES_SEO.about);

const corePrinciples = [
  {
    icon: ShieldCheck,
    title: "Regulatory Compliance",
    desc: "Strictly adhering to SEBI and AMFI distributor codes of conduct with valid registration under ARN-322891.",
  },
  {
    icon: Target,
    title: "Investor-Centric",
    desc: "Matching mutual fund schemes and insurance options to your stated financial horizons and risk appetite.",
  },
  {
    icon: Eye,
    title: "Total Transparency",
    desc: "Clear upfront disclosure of AMC distribution commissions with zero hidden charges or consultation fees.",
  },
  {
    icon: Award,
    title: "Long-Term Discipline",
    desc: "Promoting consistent systematic investing (SIP) and rupee cost averaging over speculative market timing.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── 1. Hero Section ── */}
      <section className="relative bg-[#180D45] text-white pt-8 pb-10 sm:pt-10 sm:pb-12 px-4 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-[1100px] relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-lime text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-lime shrink-0" />
            <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR | ARN - 322891</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight mb-3">
            Building Wealth With <span className="text-lime">Purpose.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-6">
            Wealthy Step is a professional mutual fund distribution and insurance facilitation firm based in Hyderabad. We assist individuals, families, and businesses with transparent, disciplined financial solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-white/90">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-lime shrink-0" /> ARN-322891
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-lime shrink-0" /> Mutual Funds • SIF • Insurance
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-lime shrink-0" /> Hyderabad, India
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Who We Are & Our Story ── */}
      <section className="py-6 sm:py-7 bg-white">
        <div className="container mx-auto max-w-[1100px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Story Content */}
            <div className="lg:col-span-7 space-y-3.5 text-text-body text-sm sm:text-base leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wider text-lime block font-heading">
                About Our Firm
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading leading-tight">
                Empowering Investors With Clarity and Integrity
              </h2>
              <p>
                Wealthy Step was founded on a simple conviction: financial success should not be complicated or opaque. We operate as an AMFI-registered Mutual Fund Distributor, bridging the gap between investors and capital markets with factual, transparent product distribution.
              </p>
              <p>
                From systematic investment routes (SIP) in equity, debt, and hybrid mutual funds to Specialized Investment Funds (SIF) and life, health, and commercial insurance policies, we provide access to products issued by leading SEBI and IRDAI-registered institutions.
              </p>
              <p>
                We do not charge consultation fees or offer speculative promises. Instead, our remuneration comes directly through standard AMC distribution commissions, ensuring full alignment with regulatory transparency.
              </p>

              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy hover:bg-[#240C7A] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <span>Connect With Our Team</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Highlight Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-[#FAFDF8]">
                <div className="relative h-44 sm:h-52 w-full">
                  <Image
                    src="/images/contact-people.jpg"
                    alt="Wealthy Step Financial Consultation in Hyderabad"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white text-xs font-bold">
                    Pranava Business Park, Hyderabad
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Distribution Model:</span>
                    <strong className="text-navy">AMFI Registered MFD</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Registration Number:</span>
                    <strong className="text-navy">ARN - 322891</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Onboarding:</span>
                    <strong className="text-emerald-700">100% Digital &amp; Paperless</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Products:</span>
                    <strong className="text-navy">Mutual Funds, SIF, Insurance</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Core Principles (Simple 4-Card Grid) ── */}
      <section className="py-5 sm:py-6 bg-gray-50 border-t border-b border-gray-200/70">
        <div className="container mx-auto max-w-[1100px] px-4">
          <div className="text-center max-w-xl mx-auto mb-4 sm:mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-lime block font-heading mb-0.5">
              Our Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading">
              Values That Define Our Work
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {corePrinciples.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="w-9 h-9 rounded-lg bg-lime/15 text-lime flex items-center justify-center mb-2.5">
                    <Icon className="w-4.5 h-4.5 text-lime" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-navy font-heading mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Compact Contact & Consultation CTA ── */}
      <section className="py-5 sm:py-6 bg-white">
        <div className="container mx-auto max-w-[900px] px-4 text-center">
          <div className="rounded-2xl bg-navy text-white p-5 sm:p-7 md:p-8 relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-xl mx-auto space-y-2.5">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-heading">
                Ready to Start Your Investment Journey?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Connect with our team in Hyderabad to understand mutual fund solutions and insurance options suited to your timeline.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-lime hover:bg-cta-green text-navy text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  Contact Us
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
