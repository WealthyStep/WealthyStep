
import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { UserCheck, SlidersHorizontal, CheckSquare, Percent, Headset, Shield } from "lucide-react";
import Image from "next/image";

const reasons = [
  {
    icon: UserCheck,
    title: "Goal-Focused Guidance",
    desc: "Dedicated team for mutual fund distribution",
  },
  {
    icon: SlidersHorizontal,
    title: "Goal-Based Investment Support",
    desc: "Mutual fund solutions explored based on your stated goals, preferences and investment horizon.",
  },
  {
    icon: CheckSquare,
    title: "Transparent Process",
    desc: "Clear communication and full transparency",
  },
  {
    icon: Percent,
    title: "Transparent",
    desc: "Transparent solutions with cost efficiency",
  },
  {
    icon: Headset,
    title: "Continuous Support",
    desc: "We are with you at every step",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    desc: "Client-first approach to mutual fund distribution",
  }
];

export function WhyInvestWithUs() {
  return (
    <section className="bg-white pt-8 md:pt-10 pb-6 md:pb-8 border-b border-border-sage/20">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-heading leading-tight mb-2">
              Why <span className="text-lime">Invest</span> With Us
            </h2>
            <p className="text-text-body text-sm sm:text-base max-w-lg mx-auto">
              We are committed to supporting your long-term goals.
            </p>
          </FadeIn>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mb-4 max-w-[900px] mx-auto">
          {reasons.map((reason, i) => (
            <FadeIn key={reason.title} delay={0.05 * i} direction="up" className="h-full">
              <div className="bg-white rounded-[16px] p-4 lg:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center group gap-3 sm:gap-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-lime flex items-center justify-center shrink-0 sm:mb-3 group-hover:bg-lime/10 transition-colors group-hover:animate-bounce">
                  <reason.icon className="w-5 h-5 sm:w-6 sm:h-6 text-lime" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy font-heading mb-1">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed max-w-none sm:max-w-[200px] mx-auto">
                    {reason.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Compliance Banner */}
        <FadeIn direction="up" delay={0.4}>
          <div className="bg-white border border-gray-200 rounded-[16px] p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-[900px] mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-lime" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-navy font-heading mb-1">Regulated & Compliant</h3>
                <p className="text-xs md:text-sm text-text-body max-w-xl leading-relaxed">
                  Wealthy Step is an AMFI Registered Mutual Fund Distributor. All investments are subject to market risks. Please read all scheme related documents carefully before investing.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-4 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0 w-full md:w-auto">
              <div className="font-bold text-navy flex items-center text-xl md:text-2xl font-heading tracking-tighter uppercase">
                AMFI
              </div>
              <div className="text-left">
                <div className="text-[11px] md:text-xs font-bold text-navy">REGISTERED MUTUAL FUND DISTRIBUTOR</div>
                <div className="text-[11px] md:text-xs text-text-body">ARN - 322891</div>
                <div className="text-[10px] md:text-xs text-text-body">MUTUAL FUND | INSURANCE</div>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
