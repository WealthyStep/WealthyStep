"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, ShieldCheck, HeartPulse, ActivitySquare, Car, Plane, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    icon: HeartPulse,
    title: "Health Insurance",
    desc: "Protect yourself and your family from medical emergencies.",
    features: ["Cashless Treatment", "Wide Hospital Network", "Pre & Post Hospitalization"],
    href: "/contact"
  },
  {
    icon: ShieldCheck,
    title: "Life Insurance",
    desc: "Pure life cover to secure your family's future.",
    features: ["High Life Cover", "Affordable Premiums", "Tax Benefits"],
    href: "/contact"
  },
  {
    icon: ActivitySquare,
    title: "Accidental Insurance",
    desc: "Financial protection against accidents and disabilities.",
    features: ["Accident Cover", "Disability Benefit", "Weekly Compensation"],
    href: "/contact"
  },
  {
    icon: Car,
    title: "Motor Insurance",
    desc: "Comprehensive coverage for your vehicles.",
    features: ["Own Damage Cover", "Third Party Liability", "Cashless Garages"],
    href: "/contact"
  },
  {
    icon: Plane,
    title: "Travel Insurance",
    desc: "Worry-free domestic and international trips.",
    features: ["Medical Emergencies", "Trip Cancellation", "Loss of Baggage"],
    href: "/contact"
  },
  {
    icon: Building2,
    title: "Business Insurance",
    desc: "Safeguard your enterprise from unforeseen risks.",
    features: ["Property Coverage", "Liability Protection", "Business Interruption"],
    href: "/contact"
  }
];

export function InsurancePlans() {
  return (
    <section className="bg-white pt-6 pb-2 md:pt-8 md:pb-4 rounded-t-[40px] md:rounded-t-[60px] relative z-30 -mt-8 md:-mt-12">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy font-heading leading-tight mb-2">
              Our <span className="text-lime">Insurance</span> Plans
            </h2>
            <p className="text-text-body text-sm sm:text-base max-w-2xl mx-auto">
              Choose the right plan to protect what matters most
            </p>
          </FadeIn>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] max-w-[1000px] mx-auto">
          {plans.map((plan, i) => (
            <FadeIn key={plan.title} delay={0.05 * i} direction="up">
              <div className="bg-white rounded-[16px] p-4 border border-border-sage/20 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative group text-center">
                
                {/* Icon */}
                <div className="mb-3 group-hover:scale-105 transition-transform duration-300 transform mx-auto">
                  <div className="relative inline-flex group-hover:animate-bounce">
                    <plan.icon className="w-6 h-6 text-lime relative z-10" strokeWidth={1.5} />
                    <div className="absolute top-0 -right-1 w-3 h-3 rounded-full bg-lime/20 z-0" />
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-bold text-navy font-heading mb-1 px-2">
                  {plan.title}
                </h3>
                
                <p className="text-text-body text-xs leading-relaxed mb-3 line-clamp-2 px-1">
                  {plan.desc}
                </p>

                <div className="mb-3 flex-1">
                  <ul className="space-y-1 inline-block text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-text-body">
                        <CheckCircle2 className="w-3 h-3 text-lime shrink-0 mr-1.5 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    href={plan.href}
                    className="inline-flex items-center text-sm font-bold text-navy group/link hover:text-lime transition-colors py-1"
                  >
                    Know More
                    <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
