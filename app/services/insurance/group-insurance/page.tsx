import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Users, ShieldCheck, HeartPulse, ActivitySquare, Building2, CheckCircle2, ArrowRight, Award } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/insurance/group-insurance/",
  title: "Group Insurance Solutions for Organisations | Wealthy Step",
  description:
    "Explore Group Health Insurance, Group Term Life, and Group Personal Accident policies for corporate employees and organisations with Wealthy Step.",
  keywords: [
    "Group Health Insurance",
    "Group Term Life Insurance",
    "Corporate Employee Insurance",
    "Group Personal Accident",
    "Employee Benefits Hyderabad",
    "Wealthy Step Group Insurance",
  ],
});

const faqs = [
  {
    question: "What is Group Insurance?",
    answer: "Group insurance provides insurance coverage to a defined group of people, such as corporate employees, members of a professional society, or organization staff, typically under a single master policy held by the employer."
  },
  {
    question: "What are the primary group insurance policies offered?",
    answer: "The three primary group policies are Group Health Insurance (GHI), Group Term Life Insurance (GTL), and Group Personal Accident Insurance (GPA)."
  },
  {
    question: "What are the advantages of Group Health Insurance for employers?",
    answer: "Group health insurance offers competitive premiums due to risk pooling, provides cashless hospitalization for employees and their dependents, and enhances talent retention and employee well-being."
  },
  {
    question: "Can pre-existing conditions be covered under Group Health?",
    answer: "Yes, group health policies often include waivers for pre-existing diseases and zero waiting periods from day one, subject to the policy terms agreed upon with the underwriting insurer."
  },
  {
    question: "Who underwrites group insurance policies?",
    answer: "All insurance policies are underwritten by IRDAI-registered general and life insurance companies. Wealthy Step facilitates policy evaluation and corporate distribution coordination."
  }
];

export default function GroupInsurancePage() {
  return (
    <>
      <ServiceHero
        badge="Corporate &amp; Enterprise Solutions"
        badgeIcon={Users}
        visualBadge="Employee Protection"
        title="Group Insurance Solutions"
        highlightedTitle="for Organisations"
        description="Explore comprehensive insurance options designed for employee groups, corporate teams, and organisations to support workplace well-being."
        themeColor="purple"
        breadcrumbs={[
          { label: "Insurance", href: "/services/insurance/group-insurance/" },
          { label: "Group Insurance", href: "/services/insurance/group-insurance/" },
        ]}
        primaryCtaText="Request Corporate Proposal"
        heroImage="/images/services/group-corporate-insurance.jpg"
        heroImageAlt="Corporate Employee Wellness and Group Insurance Solutions"
      />

      {/* ── Section 1: Corporate Group Solutions Overview ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-2">
                Team Well-Being &amp; Retention
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Tailored Protection for Your Valued Workforce
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Modern enterprises understand that employee well-being is vital to productivity and retention. Group insurance policies provide an essential safety net for employees and their families during unforeseen medical events or life uncertainties.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Wealthy Step coordinates with top IRDAI-registered insurers to structure customized group policies tailored to your organization&apos;s headcount, industry risk profile, and budget.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Custom Benefit Structures</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Pan-India Cashless Hospitals</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[440px] aspect-[16/11] rounded-3xl overflow-hidden border-2 border-purple-100 shadow-xl bg-purple-50 group">
                <Image
                  src="/images/service-4.jpg"
                  alt="Corporate workforce team collaboration and employee benefits"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 440px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180D45]/70 via-[#180D45]/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                  <span className="text-xs font-bold tracking-wide">Enterprise Workforce Care</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs">
                    7+ Employees to 10,000+
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Three Core Pillars of Group Cover ── */}
      <section className="pt-5 sm:pt-6 pb-3 sm:pb-3.5 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Three Essential Group Covers
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Comprehensive protection spanning health, life, and accidental contingencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Group Health */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Group Health Insurance (GHI)
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Hospitalization coverage for employees, spouses, children, and dependent parents. Includes cashless treatment across network hospitals nationwide.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Pre-existing disease waivers</li>
                <li>• Maternity &amp; newborn baby cover</li>
                <li>• Day care procedure coverage</li>
              </ul>
            </div>

            {/* Group Term Life */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Group Term Life (GTL)
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Pure term life protection providing financial compensation to the employee&apos;s designated beneficiaries in the unfortunate event of demise.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Graded coverage by employee grade</li>
                <li>• High non-medical limits (NML)</li>
                <li>• 24/7 worldwide coverage terms</li>
              </ul>
            </div>

            {/* Group Personal Accident */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                <ActivitySquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy font-heading mb-2">
                Group Personal Accident (GPA)
              </h3>
              <p className="text-xs text-text-body leading-relaxed mb-4">
                Protects workforce members against accidental death, permanent total disability (PTD), permanent partial disability (PPD), and temporary total disability.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <li>• Accidental death &amp; dismemberment</li>
                <li>• Weekly income replacement benefit</li>
                <li>• Emergency medical reimbursement</li>
              </ul>
            </div>

          </div>

          {/* ── Employee Coverage Information ── */}
          <div className="mt-4 sm:mt-5 bg-purple-50/50 rounded-2xl p-4 sm:p-5 border border-purple-200 shadow-2xs">
            <h3 className="text-base sm:text-lg font-black text-navy font-heading mb-2">
              Employee Coverage &amp; Enrolment Information
            </h3>
            <p className="text-xs text-text-body leading-relaxed mb-3">
              Group policies are customized to suit companies from early-stage startups (7+ employees) up to large enterprises. Policy issuance, claims servicing, and TPA network administration are handled in partnership with recognized corporate insurance providers.
            </p>
            <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs text-navy/80 leading-relaxed">
              <strong>Corporate Underwriting Note:</strong> Premium rates and acceptance terms are determined based on group demographics, claims history, industry category, and desired sum insured limits.
            </div>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Looking for Group Insurance for Your Team?"
        description="Share your company requirements with Wealthy Step to receive customized insurer comparisons."
        primaryText="Request a Group Quote"
      />
    </>
  );
}

