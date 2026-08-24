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
    desc: "We prioritize your goals and create strategies tailored to your needs.",
  },
  {
    icon: Medal,
    title: "Expertise You Can Trust",
    desc: "Backed by years of experience and in-depth market knowledge.",
  },
  {
    icon: TrendingUp,
    title: "Goal-Based Planning",
    desc: "Every plan we create is aligned with your short-term needs and long-term dreams.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Solutions",
    desc: "From investments to insurance, we offer holistic financial solutions.",
  },
  {
    icon: BarChart,
    title: "Smart & Transparent",
    desc: "Data-driven insights, clear communication, and complete transparency.",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Partnership",
    desc: "We grow with you, offering guidance at every step of your financial journey.",
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="relative bg-[#FAFAFA] pt-6 pb-16 overflow-hidden z-20">
      
      {/* ── Background Decorative Elements ── */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 -z-10" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path d="M-200,400 C150,200 450,800 1600,0 L1600,800 L-200,800 Z" fill="url(#whyBgGrad)" />
        <defs>
          <linearGradient id="whyBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4F7F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5F3FB" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Dot Matrices */}
      <div className="absolute top-20 right-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 25} cy={10 + Math.floor(i / 5) * 25} r="2" fill="#84BD3C" />
          ))}
        </svg>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                WHY WEALTHY STEP ?
              </span>
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-text-dark font-heading tracking-tight">
              Your Financial Growth,<br className="hidden sm:block" />
              Our <span className="text-accent-purple">Commitment.</span>
            </h2>
          </FadeIn>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Left Column (Text + Image) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <FadeIn direction="right" delay={0.1}>
              <p className="text-text-body text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
                At Wealthy Step, we combine expertise, technology, and a client-first approach to deliver financial solutions that truly make a difference.
              </p>
              
              <div className="relative mt-4 w-full max-w-[450px]">
                {/* Advisor Image */}
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="/advisor-meeting.jpg" 
                    alt="Wealthy Step Advisor Meeting"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Floating Trusted Card */}
                <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white rounded-2xl p-5 shadow-xl border border-border-sage/20 flex items-center gap-4 z-20 animate-float-slow">
                  <div className="bg-lime rounded-full p-2 text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-body uppercase tracking-wider mb-1">
                      Trusted by
                    </div>
                    <div className="text-2xl font-bold text-navy leading-none mb-1 font-heading">
                      1000+
                    </div>
                    <div className="text-xs text-text-body">
                      Happy Clients
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column (6 Feature Cards) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => (
                <FadeIn 
                  key={i} 
                  delay={0.2 + (i * 0.1)} 
                  direction="up"
                  className="bg-white rounded-2xl p-6 pb-8 text-center border border-border-sage/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group"
                >
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-lime/20 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                      <feature.icon className="w-6 h-6 text-lime transition-transform group-hover:scale-110" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-navy mb-2 font-heading leading-tight">
                      {feature.title}
                    </h3>
                    
                    {/* Desc */}
                    <p className="text-[13px] text-text-body leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  
                  {/* Small green bottom dash */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-lime rounded-full transition-all duration-300 group-hover:w-12 group-hover:bg-accent-purple" />
                </FadeIn>
              ))}
            </div>
          </div>
          
        </div>

        {/* ── Bottom Banner ── */}
        <FadeIn direction="up" delay={0.6}>
          <div className="bg-[#F6F8F3] border border-lime/20 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            
            {/* Left Quote */}
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden sm:flex text-lime">
                <Quote fill="currentColor" className="w-10 h-10" />
              </div>
              <div className="text-base sm:text-lg font-medium text-text-dark">
                We don't just manage money, <br className="hidden sm:block" />
                <span className="text-accent-purple font-bold">we help you build a better future.</span>
              </div>
            </div>
            
            {/* Divider (Desktop only) */}
            <div className="hidden md:block w-px h-12 bg-border-sage/40" />
            
            {/* Right Statement */}
            <div className="flex items-center gap-4 flex-1 justify-start md:justify-center">
              <div className="p-3 bg-white rounded-full shadow-sm text-lime hidden sm:block">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-base font-medium text-text-dark">
                Your goals. Our strategy. <span className="text-lime font-bold">A wealthier future.</span>
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}
