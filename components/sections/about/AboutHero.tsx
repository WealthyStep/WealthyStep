
import React from "react";
import Image from "next/image";
import bgImage from "@/public/images/contact-people.jpg";
import { FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import { ShieldCheck, Award, Target } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative bg-navy pt-8 pb-6 md:pt-10 md:pb-8 text-center">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image 
          src={bgImage}
          alt="Building Wealth" 
          fill
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover opacity-20 mix-blend-overlay"
          priority
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40 z-0"></div>
      </div>

      <FadeInStagger className="relative z-10 container mx-auto max-w-[900px] px-4 xl:px-0 flex flex-col items-center">
        <FadeInStaggerItem>
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-lime uppercase mb-4 block">
            About Wealthy Step
          </span>
        </FadeInStaggerItem>
        <FadeInStaggerItem>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-md font-heading">
            Building Wealth With <span className="text-lime">Purpose.</span>
          </h1>
        </FadeInStaggerItem>
        <FadeInStaggerItem>
          <p className="text-base md:text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
            Investing with confidence. We believe that true wealth is built with intention, creating clarity for what matters most.
          </p>
        </FadeInStaggerItem>
      </FadeInStagger>

      {/* Floating Trust Badges */}
      <div className="w-full relative z-20 mt-8 md:absolute md:-bottom-4 md:mt-0 left-0 right-0">
        <div className="container mx-auto px-4 xl:px-0">
          <div className="flex overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center gap-4">
            <div className="snap-center shrink-0 bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-lg md:translate-y-6 hover:-translate-y-1 transition-transform duration-300 w-[240px]">
              <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-lime" />
              </div>
              <div className="text-left">
                
                <div className="text-gray-500 text-[11px] font-medium leading-tight">Qualified Professional</div>
              </div>
            </div>

            <div className="snap-center shrink-0 bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-lg md:translate-y-6 hover:-translate-y-1 transition-transform duration-300 w-[240px]">
              <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-lime" />
              </div>
              <div className="text-left">
                <div className="text-navy font-bold text-sm">AMFI Registered</div>
                <div className="text-gray-500 text-[11px] font-medium leading-tight">Mutual Fund Distributor</div>
              </div>
            </div>

            <div className="snap-center shrink-0 bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-lg md:translate-y-6 hover:-translate-y-1 transition-transform duration-300 w-[240px]">
              <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-lime" />
              </div>
              <div className="text-left">
                <div className="text-navy font-bold text-sm">Goal-Focused</div>
                <div className="text-gray-500 text-[11px] font-medium leading-tight">Goal-Based Investing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
