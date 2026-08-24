"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Award, Users, Globe2, Star } from "lucide-react";

const stats = [
  { icon: Award, value: "15+", label: "Years of\nExperience" },
  { icon: Users, value: "1000+", label: "Happy\nClients" },
  { icon: Globe2, value: "25+", label: "Cities\nServed" },
  { icon: Star, value: "4.9/5", label: "Client\nRating" },
];

export function ImpactSection() {
  return (
    <section className="relative bg-white pt-4 pb-10 overflow-hidden z-20 border-b border-border-sage/20">
      {/* ── Background SVG Waves & Dots ── */}

      {/* Left subtle purple wave */}
      <svg
        className="absolute top-0 left-0 w-[400px] lg:w-[600px] h-full pointer-events-none opacity-20 -z-10"
        viewBox="0 0 600 800"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C200,100 400,300 200,600 C100,750 0,800 0,800 Z"
          fill="url(#impactPurpleGrad)"
        />
        <defs>
          <linearGradient id="impactPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#240C7A" />
            <stop offset="100%" stopColor="#1B0F4D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Right subtle green wave */}
      <svg
        className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-full pointer-events-none opacity-20 -z-10"
        viewBox="0 0 800 800"
        preserveAspectRatio="none"
      >
        <path
          d="M800,0 C600,200 400,400 600,700 C700,850 800,800 800,800 Z"
          fill="url(#impactGreenGrad)"
        />
        <defs>
          <linearGradient id="impactGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#84BD3C" stopOpacity="0" />
            <stop offset="100%" stopColor="#84BD3C" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Decorative Dots Top-Right */}
      <svg
        className="absolute top-16 right-16 opacity-30 pointer-events-none hidden lg:block"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <circle
            key={i}
            cx={10 + (i % 5) * 20}
            cy={10 + Math.floor(i / 5) * 20}
            r="2"
            fill="#84BD3C"
          />
        ))}
      </svg>

      {/* Decorative Dots Bottom-Left */}
      <svg
        className="absolute bottom-24 left-12 opacity-20 pointer-events-none hidden lg:block"
        width="80"
        height="80"
        viewBox="0 0 80 80"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <circle
            key={i}
            cx={10 + (i % 4) * 20}
            cy={10 + Math.floor(i / 4) * 20}
            r="2"
            fill="#180D45"
          />
        ))}
      </svg>


      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">

        {/* ── Header Section ── */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <FadeIn direction="up">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                OUR IMPACT
              </span>
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.15] text-text-dark font-heading tracking-tight mb-3">
              Growing With You,<br className="hidden sm:block" />
              <span className="text-accent-purple">Every Step</span> of the Way.
            </h2>

            {/* Subtitle */}
            <p className="text-text-body text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              A commitment to personalized guidance, trusted relationships, and long-term financial confidence.
            </p>
          </FadeIn>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <FadeIn
              key={i}
              delay={i * 0.15}
              direction="up"
              className="bg-white rounded-[1.5rem] p-5 pb-6 border border-border-sage/30 shadow-[0_4px_15px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
              {/* Green bottom border accent */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-lime transition-colors duration-300 group-hover:bg-accent-purple" />

              {/* Icon Container with dashed circle */}
              <div className="relative mb-5 w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-lime/40 group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
                <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-lime/20">
                  <stat.icon className="h-5 w-5 text-lime transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                </div>
              </div>

              {/* Number Value */}
              <div className="text-2xl lg:text-3xl font-bold text-navy mb-1.5 font-heading tracking-tight">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-xs font-medium text-text-body leading-snug whitespace-pre-line">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
