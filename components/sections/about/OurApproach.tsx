"use client";

import React from "react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import { Search, ThumbsUp, RefreshCw } from "lucide-react";

export function OurApproach() {
  return (
    <section className="pt-8 pb-8 md:pt-10 md:pb-10 bg-white relative overflow-hidden">
      {/* Decorative SVG */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 -z-10">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C400,300 1000,-100 1440,300 L1440,800 L0,800 Z" fill="url(#approachGrad)" />
          <defs>
            <linearGradient id="approachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAF5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-lime" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                Our Approach
              </span>
              <div className="w-8 h-px bg-lime" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-4 font-heading">
              Financial Planning, Designed Around Your Life
            </h2>
            <p className="text-lg text-text-body leading-relaxed mb-6">
              There is no single financial strategy that works for everyone. Your goals, responsibilities, lifestyle, aspirations, and vision for the future are unique. That is why our approach begins with understanding you.
            </p>
            <p className="text-lg text-text-body leading-relaxed">
              We focus on creating personalized financial strategies that connect your present decisions with your future ambitions. Our philosophy is built around three simple principles:
            </p>
          </FadeIn>
        </div>

        {/* 3 C's */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            {
              title: "Clarity",
              desc: "We simplify complex financial decisions and help you understand where you stand and where you are heading.",
              icon: Search
            },
            {
              title: "Confidence",
              desc: "We help you make informed financial decisions with a structured and thoughtful approach.",
              icon: ThumbsUp
            },
            {
              title: "Continuity",
              desc: "Financial planning is not a one-time exercise. As life changes, your financial strategy should evolve with it.",
              icon: RefreshCw
            }
          ].map((item, i) => (
            <FadeInStaggerItem key={i} className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-lime/20 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:bg-lime group-hover:border-lime transition-all duration-300">
                <item.icon className="w-7 h-7 text-lime group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 font-heading">{item.title}</h3>
              <p className="text-text-body text-sm leading-relaxed max-w-sm mx-auto">
                {item.desc}
              </p>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

      </div>
    </section>
  );
}
