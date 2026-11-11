import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Users, Target, ShieldCheck, TrendingUp } from "lucide-react";

const stats = [
  { icon: Target, value: "Goal-Focused", label: "Aligning investments\nwith meaningful goals" },
  { icon: ShieldCheck, value: "Transparent", label: "Clear communication and\nstraightforward support" },
  { icon: TrendingUp, value: "Long-Term", label: "Disciplined and steady\ninvestment approach" },
  { icon: Users, value: "Investor-Centric", label: "Support designed\naround your objectives" },
];

export function ImpactSection() {
  return (
    <section className="relative bg-white pt-4 pb-6 sm:pb-8 overflow-hidden z-20 border-b border-border-sage/20">
      {/* ── Background SVG Waves & Accents ── */}

      {/* Left subtle purple wave */}
      <svg
        className="absolute top-0 left-0 w-[300px] lg:w-[450px] h-full pointer-events-none opacity-15 -z-10"
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
        className="absolute top-0 right-0 w-[350px] lg:w-[550px] h-full pointer-events-none opacity-15 -z-10"
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

      <div className="container mx-auto max-w-[1200px] px-3.5 sm:px-6 xl:px-0 relative z-10">

        {/* ── Header Section (Compact & Proportionate) ── */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
          <FadeIn direction="up">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-2.5">
              <div className="w-8 sm:w-10 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-lime font-heading">
                OUR IMPACT
              </span>
              <div className="w-8 sm:w-10 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-text-dark font-heading tracking-tight mb-1.5">
              Growing With You,{" "}
              <span className="text-accent-purple">Every Step</span> of the Way.
            </h2>

            {/* Subtitle */}
            <p className="text-text-body text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              A commitment to goal-based support, trusted relationships, and long-term investing.
            </p>
          </FadeIn>
        </div>

        {/* ── Cards Grid (2x2 on Mobile • 4 Columns on Desktop • Compact & Responsive) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
          {stats.map((stat, i) => (
            <FadeIn
              key={i}
              delay={i * 0.08}
              direction="up"
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 pb-3.5 sm:pb-4.5 border border-border-sage/30 shadow-[0_4px_12px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
              {/* Green bottom border accent */}
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-lime transition-colors duration-300 group-hover:bg-accent-purple" />

              {/* Icon Container with subtle dashed border */}
              <div className="relative mb-2.5 sm:mb-3 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-lime/40 group-hover:rotate-90 transition-transform duration-500 ease-in-out" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-lime/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-lime/20">
                  <stat.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-lime transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                </div>
              </div>

              {/* Value proposition */}
              <div className="text-xs sm:text-sm lg:text-base font-bold text-navy mb-1 font-heading tracking-tight leading-tight">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-[10px] sm:text-xs font-medium text-text-body leading-snug whitespace-pre-line">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
