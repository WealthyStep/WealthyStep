"use client";

import React from "react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { 
  UserCheck, 
  Medal, 
  TrendingUp, 
  ShieldCheck, 
  BarChart, 
  HeartHandshake,
  Quote,
  Users,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Client-First Approach",
    desc: "We understand your goals and help you explore suitable mutual fund investment solutions.",
  },
  {
    icon: Medal,
    title: "Experience You Can Trust",
    desc: "Backed by years of experience and in-depth market knowledge.",
  },
  {
    icon: TrendingUp,
    title: "Goal-Based Investing",
    desc: "Every investment approach is aligned with your short-term needs and long-term dreams.",
  },
  {
    icon: ShieldCheck,
    title: "Investment & Protection",
    desc: "We offer mutual fund and insurance solutions designed to support your financial goals.",
  },
  {
    icon: BarChart,
    title: "Smart & Transparent",
    desc: "Data-driven insights, clear communication, and complete transparency.",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Partnership",
    desc: "We stay with you, offering support throughout your financial journey.",
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="relative bg-[#FAFAFA] pt-6 pb-6 sm:pt-8 sm:pb-8 overflow-hidden z-20 border-b border-border-sage/20">
      
      {/* ── Background Decorative Elements ── */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-25 -z-10" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path d="M-200,400 C150,200 450,800 1600,0 L1600,800 L-200,800 Z" fill="url(#whyBgGrad)" />
        <defs>
          <linearGradient id="whyBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4F7F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5F3FB" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Dot Matrices */}
      <div className="absolute top-12 right-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 20} cy={10 + Math.floor(i / 5) * 20} r="2" fill="#84BD3C" />
          ))}
        </svg>
      </div>

      <div className="container mx-auto max-w-[1200px] px-3.5 sm:px-6 xl:px-0 relative z-10">
        
        {/* ── Header (Compact & Crisp) ── */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-2.5">
              <div className="w-8 sm:w-10 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-lime font-heading">
                WHY WEALTHY STEP ?
              </span>
              <div className="w-8 sm:w-10 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-text-dark font-heading tracking-tight">
              Your Financial Journey,{" "}
              <span className="text-accent-purple">Our Commitment.</span>
            </h2>
          </FadeIn>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center mb-6 sm:mb-8">
          
          {/* Left Column (Text + Compact Image) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <FadeIn direction="right" delay={0.08}>
              <p className="text-text-body text-xs sm:text-sm mb-4 leading-relaxed max-w-lg">
                At Wealthy Step, we combine expertise, technology, and a client-first approach to deliver mutual fund and insurance solutions that truly make a difference.
              </p>
              
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] mx-auto lg:mx-0">
                {/* Support Meeting Image (Matching 16:9 Aspect Ratio) */}
                <div className="relative w-full aspect-[16/9.5] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                  <Image 
                    src="/advisor-meeting.jpg" 
                    alt="Wealthy Step Financial Advisors Support Meeting"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 420px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
                
                {/* Floating Investor Badge (Compact) */}
                <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white/95 rounded-xl p-2.5 sm:p-3 shadow-md border border-border-sage/30 flex items-center gap-2.5 z-20 backdrop-blur-xs">
                  <div className="bg-lime rounded-full p-1.5 text-white shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-text-body uppercase tracking-wider leading-none mb-0.5">
                      Investor
                    </div>
                    <div className="text-sm font-bold text-navy leading-none font-heading">
                      Focused
                    </div>
                    <div className="text-[9px] text-text-body leading-none mt-0.5">
                      Support
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column (6 Feature Cards in 2x3 Grid on Mobile • 3x2 on Desktop) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {features.map((feature, i) => (
                <FadeIn 
                  key={i} 
                  delay={0.05 * i} 
                  direction="up"
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 pb-3.5 sm:pb-4 text-center border border-border-sage/20 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative group"
                >
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-lime/10 flex items-center justify-center mb-2 sm:mb-2.5 transition-colors group-hover:bg-lime/20">
                      <feature.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-lime transition-transform group-hover:scale-110" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-[13px] lg:text-sm font-bold text-navy mb-1 font-heading leading-tight line-clamp-1">
                      {feature.title}
                    </h3>
                    
                    {/* Desc */}
                    <p className="text-[10px] sm:text-[11px] text-text-body leading-snug line-clamp-3">
                      {feature.desc}
                    </p>
                  </div>
                  
                  {/* Subtle green bottom indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-lime/60 rounded-full transition-all duration-300 group-hover:w-8 group-hover:bg-accent-purple" />
                </FadeIn>
              ))}
            </div>
          </div>
          
        </div>

        {/* ── Bottom Quote Banner (Streamlined & Compact) ── */}
        <FadeIn direction="up" delay={0.2}>
          <div className="bg-[#F6F8F3] border border-lime/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-2xs">
            
            {/* Left Quote */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 text-left">
              <div className="flex text-lime shrink-0">
                <Quote fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-text-dark">
                We help you take informed steps{" "}
                <span className="text-accent-purple font-bold">towards your financial goals.</span>
              </div>
            </div>
            
            {/* Divider (Desktop only) */}
            <div className="hidden md:block w-px h-8 bg-border-sage/40 shrink-0" />
            
            {/* Right Statement */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-start md:justify-center text-left">
              <div className="p-1.5 sm:p-2 bg-white rounded-full shadow-2xs text-lime shrink-0">
                <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-text-dark">
                Your goals. Our support. <span className="text-lime font-bold">Your investment journey.</span>
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}
