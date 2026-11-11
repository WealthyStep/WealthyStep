import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Car, Plane, ShieldCheck, CheckCircle2, ArrowRight, ShieldAlert, Luggage, Navigation, Wrench } from "lucide-react";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceCta } from "@/components/services/ServiceCta";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  path: "/services/insurance/general-insurance/",
  title: "Motor & Travel General Insurance | Wealthy Step",
  description:
    "Explore Car Insurance, Two-Wheeler Insurance, and Domestic & International Travel Insurance with Wealthy Step, Hyderabad.",
  keywords: [
    "Motor Insurance Hyderabad",
    "Car Insurance Policies",
    "Two-Wheeler Insurance",
    "International Travel Insurance",
    "Domestic Travel Insurance",
    "Wealthy Step General Insurance",
  ],
});

const faqs = [
  {
    question: "What is Third-Party vs Comprehensive Motor Insurance?",
    answer: "Third-Party motor insurance is mandatory by law in India; it covers legal liability for bodily injury or property damage to third parties. Comprehensive insurance covers both third-party liability and Own Damage (OD) to your vehicle caused by accidents, fire, theft, or natural disasters."
  },
  {
    question: "What add-on covers are available for Car Insurance?",
    answer: "Popular add-ons include Zero Depreciation (Bumper to Bumper), Engine Protection, Roadside Assistance (RSA), Return to Invoice (RTI), and Consumables cover, subject to insurer terms."
  },
  {
    question: "Why do I need Travel Insurance for overseas travel?",
    answer: "International travel insurance covers high overseas medical expenses, emergency hospitalization, baggage loss or delay, flight cancellations, personal liability, and emergency medical evacuation."
  },
  {
    question: "Is travel insurance required for visa processing?",
    answer: "Yes, many international jurisdictions (including Schengen countries) mandate compliant travel insurance with minimum medical coverage (e.g., EUR 30,000) for visa issuance."
  }
];

export default function GeneralInsurancePage() {
  return (
    <>
      <ServiceHero
        badge="General Insurance Solutions"
        badgeIcon={Car}
        visualBadge="Motor &amp; Travel"
        title="Motor &amp; Travel"
        highlightedTitle="Insurance Options"
        description="Explore comprehensive insurance products designed to protect your vehicles and provide peace of mind across domestic and international travels."
        themeColor="amber"
        breadcrumbs={[
          { label: "Insurance", href: "/services/insurance/general-insurance/" },
          { label: "General Insurance", href: "/services/insurance/general-insurance/" },
        ]}
        primaryCtaText="Explore General Policies"
        heroImage="/images/services/motor-travel-insurance.jpg"
        heroImageAlt="Motor and International Travel Insurance Protection"
      />

      {/* ── Section 1: Overview ── */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">
                Everyday Mobility &amp; Journeys
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy font-heading leading-tight mb-4">
                Reliable Protection on the Road and in the Air
              </h2>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-4">
                Whether commuting daily across the city or boarding an international flight for leisure or corporate assignments, unexpected events like vehicular accidents, breakdown expenses, medical emergencies, or lost luggage can disrupt your itinerary.
              </p>
              <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
                Wealthy Step coordinates with leading general insurers to help you select high-claim-ratio motor and travel insurance policies offering instant digital issuance and responsive roadside and travel assistance.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-navy">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cashless Network Garages</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>24/7 Global Travel Assistance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              {/* Comprehensive Mobility & Journey Shield Card */}
              <div className="relative w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-slate-900 via-navy to-slate-950 p-6 sm:p-7 text-white border border-slate-700 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">Mobility Protection</h4>
                      <p className="text-[11px] text-gray-400">Road &amp; Global Travel Shield</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    24/7 Support
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Motor Insurance</p>
                        <p className="text-[10px] text-gray-400">Cashless Garages &amp; Zero Dep</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-300">Instant Issuance</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Plane className="w-4 h-4 text-sky-400" />
                      <div>
                        <p className="text-xs font-bold text-white">International Travel</p>
                        <p className="text-[10px] text-gray-400">Schengen &amp; US Visa Compliant</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-sky-300">Up to $500k</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Luggage className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Luggage &amp; Flight Delay</p>
                        <p className="text-[10px] text-gray-400">Automatic Delay Compensation</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-300">Covered</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Recognized General Insurers
                  </span>
                  <span className="text-amber-300 font-bold">Fast-Track Claims</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: MOTOR INSURANCE ── */}
      <section className="py-8 md:py-10 bg-[#FFFDF9] border-t border-b border-amber-100">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Pillar 01
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Motor Insurance Solutions
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Keep your four-wheelers and two-wheelers legally compliant and financially protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Car Insurance */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-navy font-heading mb-2">
                Car Insurance
              </h3>
              <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-4">
                Comprehensive and third-party protection for personal and corporate automobiles, covering accidental damage, third-party bodily liability, theft, and natural catastrophes.
              </p>
              <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-gray-100 mb-6">
                <li>• Cashless repairs at thousands of authorized garages</li>
                <li>• Zero Depreciation &amp; Engine Protect Add-ons</li>
                <li>• Quick digital renewal &amp; claims assistance</li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-navy transition-colors"
              >
                <span>Inquire About Car Insurance &rarr;</span>
              </Link>
            </div>

            {/* Two-Wheeler Insurance */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-navy font-heading mb-2">
                Two-Wheeler Insurance
              </h3>
              <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-4">
                Budget-friendly protection for motorcycles and scooters against road hazards, theft, and third-party liabilities, ensuring peace of mind on every city ride.
              </p>
              <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-gray-100 mb-6">
                <li>• Multi-year long-term policy options</li>
                <li>• Mandatory Personal Accident cover for owner-driver</li>
                <li>• Hassle-free instant policy issuance</li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-navy transition-colors"
              >
                <span>Inquire About Two-Wheeler Cover &rarr;</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 3: TRAVEL INSURANCE ── */}
      <section className="pt-6 sm:pt-8 pb-5 sm:pb-6 bg-white">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
              Pillar 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-2">
              Travel Insurance Protection
            </h2>
            <p className="text-text-body text-xs sm:text-sm">
              Comprehensive emergency medical and trip delay coverage for local and global itineraries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Domestic Travel */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                <Luggage className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-navy font-heading mb-2">
                Domestic Travel Insurance
              </h3>
              <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-4">
                Covers unexpected trip cancellations, domestic flight delays, checked-in baggage loss, and emergency medical treatment while traveling within India.
              </p>
              <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-gray-200 mb-6">
                <li>• Trip cancellation &amp; missed connection coverage</li>
                <li>• Accidental medical hospitalization in India</li>
                <li>• 24/7 dedicated domestic helpline</li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-navy transition-colors"
              >
                <span>Explore Domestic Travel Policies &rarr;</span>
              </Link>
            </div>

            {/* International Travel */}
            <div className="bg-[#F0F7FF] rounded-2xl p-6 sm:p-8 border border-sky-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 border border-sky-200">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-navy font-heading mb-2">
                International Travel Insurance
              </h3>
              <p className="text-xs sm:text-sm text-text-body leading-relaxed mb-4">
                Mandatory for Schengen, US, UK, and major destinations. Covers overseas cashless hospitalization, loss of passport, baggage delay, and medical repatriation.
              </p>
              <ul className="text-xs text-text-body space-y-1.5 pt-3 border-t border-sky-200 mb-6">
                <li>• Compliant with international embassy visa requirements</li>
                <li>• Emergency overseas medical expenses up to USD 500,000</li>
                <li>• Single-trip, multi-trip, and student travel options</li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-navy transition-colors"
              >
                <span>Explore International Travel Cover &rarr;</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* FAQs */}
      <ServiceFaq faqs={faqs} />

      {/* CTA */}
      <ServiceCta
        title="Need Motor or Travel Insurance?"
        description="Get in touch with Wealthy Step for instant comparative quotes and policy renewal assistance."
        primaryText="Request Policy Details"
      />
    </>
  );
}

