import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { HeartPulse, ShieldCheck, Users, ActivitySquare, ArrowRight, CheckCircle2, ShieldAlert, Info, AlertCircle } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/insurance/retail-insurance/",
  title: "Retail Insurance for Individuals & Families | Wealthy Step",
  description:
    "Explore individual and family floater health insurance, pure term life insurance, and Specialised Health Cover for pre-existing medical conditions with Wealthy Step.",
  keywords: [
    "Retail Health Insurance",
    "Family Floater Health Insurance",
    "Term Life Insurance",
    "Specialised Health Cover",
    "Pre-existing Conditions Insurance",
    "Chronic Disease Health Insurance",
    "Wealthy Step Retail Insurance",
  ],
});

const faqs = [
  {
    question: "What is the difference between Individual and Family Floater Health Insurance?",
    answer: "An Individual Health policy provides a dedicated sum insured for one person. A Family Floater policy shares a single sum insured among all covered family members (self, spouse, children), which is often more cost-effective for young families."
  },
  {
    question: "What is Specialised Health Cover?",
    answer: "Specialised Health Cover refers to health insurance solutions specifically designed or underwritten for individuals who have pre-existing medical conditions (such as diabetes, hypertension, asthma, thyroid disorders, or cardiac conditions)."
  },
  {
    question: "Is acceptance guaranteed under Specialised Health Cover?",
    answer: "No. Acceptance, waiting periods, exclusions, premium loading, and sub-limits depend strictly on the individual insurance company's underwriting assessment and medical declarations. Wealthy Step does not promise unconditional or guaranteed coverage."
  },
  {
    question: "Why is pure Term Life Insurance recommended?",
    answer: "Term Life Insurance offers the highest sum assured for the lowest premium cost. It provides pure financial protection for your dependents in your absence, ensuring debts, living costs, and children's education are secure."
  },
  {
    question: "How are claims processed?",
    answer: "Health insurance claims can be settled on a cashless basis at network hospitals through Third Party Administrators (TPAs) or via reimbursement at non-network hospitals upon submission of discharge bills."
  }
];

export default function RetailInsurancePage() {
  return (
    <>
      <ServiceHero
        badge="Retail Insurance Solutions"
        badgeIcon={HeartPulse}
        visualBadge="Individual &amp; Family Protection"
        title="Insurance Options for"
        highlightedTitle="Individuals &amp; Families"
        description="Explore comprehensive insurance products designed to protect your health, your family's financial stability, and long-term peace of mind."
        themeColor="teal"
        breadcrumbs={[
          { label: "Insurance", href: "/services/insurance/retail-insurance/" },
          { label: "Retail Insurance", href: "/services/insurance/retail-insurance/" },
        ]}
        primaryCtaText="Explore Retail Policies"
        heroImage="/images/service-1.png"
        heroImageAlt="Retail Insurance Solutions for Individuals and Families"
      />

      {/* ── Section 1: Individual & Family Health ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-2">
                Personal Well-Being
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Safeguard Your Family Against Rising Healthcare Costs
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Medical emergencies can place tremendous financial strain on families. Comprehensive health insurance ensures that quality medical treatment, hospitalization, surgeries, and critical care are accessible without compromising your savings.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                From individual indemnity policies to flexible family floater covers and high-value super top-ups, we help you evaluate suitable policies underwritten by trusted IRDAI-registered insurers.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50/80 border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Cashless Hospitalization</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50/80 border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Annual Health Checkups</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-teal-100 shadow-xl bg-teal-50">
                <Image
                  src="/images/insurance-hero.jpg"
                  alt="Family health and financial protection under umbrella"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Core Retail Products ── */}
      <section className="py-8 md:py-10 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Essential Retail Policies
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Discover foundational protection products for individuals and households.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 border border-teal-100">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Individual Health Cover
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Dedicated sum insured for single adults or senior citizens, covering in-patient hospitalization, pre and post-hospitalization, and daycare procedures.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• No sharing of sum insured</li>
                <li>• No-claim bonus accumulation</li>
                <li>• Lifelong renewability</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Family Floater Health
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Cost-effective umbrella health policy that covers self, spouse, and dependent children under a shared pool of sum insured.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Single annual premium</li>
                <li>• Automatic restoration of sum insured</li>
                <li>• Maternity cover add-ons</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Term Life Insurance
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Pure term protection securing your family&apos;s financial future in the event of unforeseen demise during the policy tenure.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Affordable high-value sum assured</li>
                <li>• Critical illness &amp; disability riders</li>
                <li>• Level or increasing cover terms</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 3: SPECIALISED HEALTH COVER (Distinctive Prominent Section) ── */}
      <section className="pt-6 sm:pt-8 pb-5 sm:pb-6 bg-gradient-to-br from-[#ECFDF5] via-white to-[#F0FDF4] border-t border-b border-emerald-200">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              {/* Chronic & Pre-Existing Underwriting Framework Card */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-emerald-950 via-[#064E3B] to-emerald-900 p-6 sm:p-7 text-white border-2 border-emerald-400/40 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">Specialised Underwriting</h4>
                      <p className="text-[11px] text-emerald-200/70">Chronic &amp; PED Evaluation</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    Transparent
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Covered Medical Profiles</p>
                      <p className="text-[10px] text-emerald-200/70">Diabetes, BP, Cardiac, Thyroid &amp; Asthma</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">Declared PED</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Reduced Waiting Horizons</p>
                      <p className="text-[10px] text-emerald-200/70">Custom rider structures with participating insurers</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">From Day 1/90</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Tele-Underwriting Review</p>
                      <p className="text-[10px] text-emerald-200/70">Digital medical reports &amp; transparent terms</p>
                    </div>
                    <span className="text-xs font-black text-emerald-300">Fast-Track</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Pan-India Cashless Networks
                  </span>
                  <span className="text-emerald-300 font-bold">IRDAI Underwritten</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Distinctive Client Service</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Specialised Health Cover for Pre-Existing &amp; Chronic Conditions (Unconditional Cover)
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Securing health insurance when dealing with pre-existing medical conditions (such as diabetes, hypertension, asthma, thyroid disorders, or cardiac conditions) can often be challenging. We facilitate access to specialized insurance policies providing unconditional cover options underwritten by recognized insurers who evaluate pre-existing conditions transparently.
              </p>
              
              <div className="p-4 rounded-xl bg-white border border-emerald-200 mb-6 space-y-2">
                <strong className="text-xs font-bold text-navy block">
                  Important Underwriting Disclosures:
                </strong>
                <ul className="text-xs text-text-body space-y-1">
                  <li>• Acceptance is subject to insurer medical underwriting, tele-mer, and declarations.</li>
                  <li>• Applicable waiting periods for pre-existing conditions range per policy wordings.</li>
                  <li>• Wealthy Step does not guarantee unconditional acceptance or zero waiting periods.</li>
                </ul>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy text-white text-xs sm:text-sm font-bold hover:bg-[#240C7A] transition-all shadow-md"
              >
                <span>Enquire About Specialised Health Cover</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Ready to Protect Your Family?"
        description="Connect with Wealthy Step to review suitable health and life insurance policies from top IRDAI insurers."
        primaryText="Speak With Our Team"
      />
    </>
  );
}

