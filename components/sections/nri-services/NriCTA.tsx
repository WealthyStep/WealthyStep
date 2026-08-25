"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, PlaneTakeoff } from "lucide-react";

export function NriCTA() {
  return (
    <section className="pt-2 pb-8 md:pt-4 md:pb-12 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-[1100px] px-4 xl:px-0 relative z-10">
        <FadeIn direction="up">
          <div className="bg-navy rounded-[24px] p-8 md:p-10 lg:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lime/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
            
            {/* Left side text */}
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                <PlaneTakeoff className="w-3 h-3 text-lime" />
                <span>Connect Across Borders</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-white mb-4 leading-tight">
                Ready to secure your <br className="hidden lg:block" />
                <span className="text-lime">Indian Wealth?</span>
              </h2>
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl mx-auto md:mx-0">
                Schedule a one-on-one video consultation with our specialized NRI desk. We operate across global time zones to serve you better.
              </p>
            </div>

            {/* Right side CTA button */}
            <div className="relative z-10 shrink-0">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-10 py-5 text-lg font-bold transition-all shadow-[0_0_40px_rgba(132,189,60,0.3)] hover:shadow-[0_0_60px_rgba(132,189,60,0.5)] hover:-translate-y-1 group whitespace-nowrap"
              >
                Talk to an NRI Expert
                <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
