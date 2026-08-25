"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

export function InsuranceCTA() {
  return (
    <section className="bg-[#FAFAFA] pb-2 md:pb-4 pt-0">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="bg-[#0F172A] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl max-w-[900px] mx-auto overflow-hidden relative">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-lime/10 to-transparent pointer-events-none rounded-r-[20px]" />

            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <div className="hidden sm:flex w-16 h-16 rounded-xl border-2 border-white/10 items-center justify-center shrink-0 bg-white/5">
                <ClipboardList className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-left flex-1">
                <div className="text-white/80 text-sm mb-1 font-medium">Still Confused?</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-heading leading-tight mb-1">
                  Let Our Experts Help You
                </h2>
                <p className="text-white/60 text-[12px] max-w-sm leading-relaxed">
                  Talk to our advisors and find the perfect insurance plan that fits your needs and budget.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 w-full md:w-auto">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-6 py-3 text-sm font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto whitespace-nowrap"
              >
                Talk to an Expert
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/20 hover:border-white text-white px-6 py-2.5 text-sm font-bold transition-all w-full sm:w-auto whitespace-nowrap group"
              >
                Compare Plans
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
