"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Search, Clock, BarChart2, LineChart, Target } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Understand",
    desc: "We understand your goals, risk appetite and financial situation.",
  },
  {
    icon: Clock,
    title: "Plan",
    desc: "We explore mutual fund solutions suited to your goals.",
  },
  {
    icon: BarChart2,
    title: "Invest",
    desc: "We facilitate investments through available mutual fund solutions.",
  },
  {
    icon: LineChart,
    title: "Monitor",
    desc: "Periodic support and review discussions to help you stay connected with your stated investment goals.",
  },
  {
    icon: Target,
    title: "Achieve",
    desc: "We assist you in exploring mutual fund options for long-term goals.",
  },
];

export function InvestmentApproach() {
  return (
    <section className="bg-white pt-6 pb-4 md:pt-8 md:pb-6 border-b border-border-sage/20 relative z-30 -mt-8 md:-mt-12 rounded-t-[40px] md:rounded-t-[60px]">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <FadeIn direction="up">
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading mb-4 block">
              OUR INVESTMENT APPROACH
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy font-heading leading-tight mb-6">
              Simple. Disciplined. <span className="text-lime">Goal-Oriented.</span>
            </h2>
            <p className="text-text-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              We follow a structured investment approach to help you stay on track and achieve your financial goals.
            </p>
          </FadeIn>
        </div>

        {/* 5 Steps Flow */}
        <div className="relative pt-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] border-t-2 border-dotted border-gray-300 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={0.1 * i} direction="up" className="flex flex-col items-center text-center">
                <div className="relative group transition-transform duration-300 hover:-translate-y-1 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center relative z-10 bg-white">
                    <step.icon className="w-8 h-8 text-navy group-hover:text-lime transition-colors group-hover:animate-bounce" strokeWidth={1.5} />
                  </div>
                  {/* Decorative green accent circle behind the icon */}
                  <div className="absolute top-1 -right-1 w-5 h-5 rounded-full bg-lime/20 group-hover:scale-150 transition-transform duration-300 z-0" />
                </div>
                
                <h3 className="text-[17px] font-bold text-navy font-heading mb-2">
                  {step.title}
                </h3>
                
                <p className="text-[13px] text-text-body leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
