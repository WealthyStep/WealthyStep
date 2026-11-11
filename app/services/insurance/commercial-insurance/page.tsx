import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Building2, FileCheck2, ShieldCheck, HardHat, ArrowRight, CheckCircle2, Briefcase, Scale, Layers } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/insurance/commercial-insurance/",
  title: "Commercial Insurance & Guarantee Solutions (EMD, PG, WC) | Wealthy Step",
  description:
    "Explore EMD Guarantees, Performance Guarantees (PG), and Workers' Compensation (WC) insurance solutions for businesses and contractors with Wealthy Step.",
  keywords: [
    "Commercial Insurance Hyderabad",
    "EMD Guarantee India",
    "Performance Guarantee PG Insurance",
    "Workers Compensation WC Policy",
    "Surety Guarantees for Contractors",
    "Wealthy Step Commercial Insurance",
  ],
});

const faqs = [
  {
    question: "What is an Earnest Money Deposit (EMD) Guarantee?",
    answer: "An EMD guarantee is an institutional guarantee provided on behalf of a contractor or bidder to a tender-issuing authority, assuring that the bidder will honor their bid terms and not withdraw prematurely during tender evaluation."
  },
  {
    question: "What is a Performance Guarantee (PG)?",
    answer: "A Performance Guarantee (PG) is an undertaking provided to the project owner ensuring that the contractor will execute the project in accordance with contractual quality standards, specifications, and agreed completion timelines."
  },
  {
    question: "What does Workers' Compensation (WC) Insurance cover?",
    answer: "Workers' Compensation insurance covers an employer's statutory liability under the Employee's Compensation Act, 1923, providing compensation for employee bodily injury, occupational disease, or fatal accidents arising during the course of employment."
  },
  {
    question: "How do Surety Guarantees help commercial contractors?",
    answer: "Insurance surety guarantees allow contractors to free up working capital and bank credit lines that would otherwise remain tied up in traditional bank collateral or cash deposits."
  },
  {
    question: "Who underwrites commercial guarantees and policies?",
    answer: "All guarantee and commercial insurance instruments are issued by recognized, IRDAI-registered general insurance companies following technical and financial underwriting."
  }
];

export default function CommercialInsurancePage() {
  return (
    <>
      <ServiceHero
        badge="Commercial &amp; Contractual Solutions"
        badgeIcon={Building2}
        visualBadge="Tender &amp; Workplace Security"
        title="Commercial Insurance &amp;"
        highlightedTitle="Guarantee Solutions"
        description="Explore insurance and institutional guarantee products designed for businesses, infrastructure contractors, and corporate organizations."
        themeColor="slate"
        breadcrumbs={[
          { label: "Insurance", href: "/services/insurance/commercial-insurance/" },
          { label: "Commercial Insurance", href: "/services/insurance/commercial-insurance/" },
        ]}
        primaryCtaText="Inquire About Commercial Guarantees"
        heroImage="/images/services/commercial-insurance-guarantee.jpg"
        heroImageAlt="Commercial Insurance, Tender EMD and Performance Guarantees"
      />

      {/* ── Section 1: Overview ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Enterprise &amp; Contractor Enablement
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Strengthen Bidding Capacity and Mitigate Contractual Risks
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                In today&apos;s competitive infrastructure, procurement, and commercial bidding landscape, organizations require robust financial security instruments to participate in government, PSU, and large corporate tenders.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Wealthy Step facilitates access to specialized insurance and guarantee solutions underwritten by leading general insurers, enabling enterprises to fulfill tender obligations and protect their workforce.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>Optimized Working Capital</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>IRDAI Compliant Framework</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* Institutional Commercial Guarantee Security Card */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-slate-900 via-navy to-slate-950 p-6 sm:p-7 text-white border border-slate-700 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">Contractual Security</h4>
                      <p className="text-[11px] text-gray-400">Institutional Surety Matrix</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Facility
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileCheck2 className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs font-bold text-white">EMD Guarantees</p>
                        <p className="text-[10px] text-gray-400">Bid Security for Tender Submissions</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-blue-300">Fast-Track</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Performance Guarantees (PG)</p>
                        <p className="text-[10px] text-gray-400">Project Delivery &amp; Defect Liability</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-300">Zero Dep Collateral</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <HardHat className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Workers&apos; Compensation (WC)</p>
                        <p className="text-[10px] text-gray-400">Statutory Employer Liability Shield</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-300">Act 1923</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    IRDAI Registered Underwriters
                  </span>
                  <span className="text-blue-300 font-bold">100% Compliant</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Three Separate Service Cards ── */}
      <section className="pt-6 sm:pt-8 pb-5 sm:pb-6 bg-[#F8FAFC] border-t border-b border-gray-200">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Three Essential Commercial Solutions
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Discover dedicated guarantee and liability instruments structured for commercial operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. EMD Guarantee */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 border border-slate-200">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                  Service 01
                </span>
                <h3 className="text-lg font-black text-navy font-heading mb-2">
                  Earnest Money Deposit (EMD) Guarantee
                </h3>
                <p className="text-xs text-text-body leading-relaxed mb-4">
                  Institutional guarantee solutions associated with tender, procurement, and bidding requirements for central, state, and PSU contracts.
                </p>
                <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-gray-100 mb-6">
                  <li>• Replaces frozen cash or fixed deposit collateral</li>
                  <li>• Enhances contractor tender participation capacity</li>
                  <li>• Underwritten based on contractor financial standing</li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-navy transition-colors pt-2"
              >
                <span>Inquire About EMD Guarantees &rarr;</span>
              </Link>
            </div>

            {/* 2. Performance Guarantee */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block mb-1">
                  Service 02
                </span>
                <h3 className="text-lg font-black text-navy font-heading mb-2">
                  Performance Guarantee (PG)
                </h3>
                <p className="text-xs text-text-body leading-relaxed mb-4">
                  Surety and guarantee instruments assuring contractual project delivery, execution milestones, and defect liability compliance.
                </p>
                <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-gray-100 mb-6">
                  <li>• Protects project owners against non-performance</li>
                  <li>• Essential for EPC, construction, and engineering works</li>
                  <li>• Tailored tenures matching project duration</li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-navy transition-colors pt-2"
              >
                <span>Inquire About Performance Guarantees &rarr;</span>
              </Link>
            </div>

            {/* 3. Workers' Compensation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
                  <HardHat className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
                  Service 03
                </span>
                <h3 className="text-lg font-black text-navy font-heading mb-2">
                  Workers&apos; Compensation (WC)
                </h3>
                <p className="text-xs text-text-body leading-relaxed mb-4">
                  Statutory employer liability insurance covering workplace accidents, bodily injury, and occupational diseases under the Employee&apos;s Compensation Act.
                </p>
                <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-gray-100 mb-6">
                  <li>• Fulfills mandatory statutory legal obligations</li>
                  <li>• Covers medical treatment and disability compensation</li>
                  <li>• Covers on-site workers, factory staff, and project labor</li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-navy transition-colors pt-2"
              >
                <span>Inquire About WC Insurance &rarr;</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Looking for Commercial Guarantees or WC Cover?"
        description="Connect with our commercial underwriting team to review project requirements and guarantee issuance terms."
        primaryText="Speak With Our Commercial Desk"
      />
    </>
  );
}

