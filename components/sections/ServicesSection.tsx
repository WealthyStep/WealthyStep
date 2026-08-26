"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import {
  TrendingUp,
  ShieldCheck,
  Target,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: TrendingUp,
    title: "Mutual Funds\nInvestments",
    desc: "Mutual fund investment solutions designed to support long-term goals.",
    image: "/images/service-2.png",
    points: [
      "Equity Mutual Funds",
      "Debt Mutual Funds",
      "Hybrid Funds",
      "SIP & Lump Sum Investments"
    ],
    href: "/investments"
  },
  {
    icon: ShieldCheck,
    title: "All Kind\nInsurances",
    desc: "Insurance options to protect what matters most – your family, health, and future.",
    image: "/images/service-1.png",
    points: [
      "Life Insurance",
      "Health Insurance",
      "Vehicle Insurance",
      "General Insurance"
    ],
    href: "/insurance"
  },
  {
    icon: Target,
    title: "Goal-Based\nInvesting",
    desc: "Goal-based mutual fund investment solutions to support your long-term objectives.",
    image: "/images/image.png",
    points: [
      "Goal-Based Approach",
      "Retirement Goal Investing",
      "Long-Term Investing",
      "Tax-saving mutual fund options, subject to applicable tax laws"
    ],
    href: "/goal-calculators"
  }
];

export function ServicesSection() {
  return (
    <section className="relative bg-white pt-8 pb-10 overflow-hidden z-20">

      {/* ── Background Decorative Elements ── */}
      {/* Top Left Dots */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 25} cy={10 + Math.floor(i / 5) * 25} r="2" fill="#84BD3C" />
          ))}
        </svg>
      </div>

      {/* Bottom Right Dots */}
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 25} cy={10 + Math.floor(i / 5) * 25} r="2" fill="#84BD3C" />
          ))}
        </svg>
      </div>

      {/* Subtle sweeping background curve */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path d="M0,0 C300,200 800,-100 1440,300 L1440,800 L0,800 Z" fill="url(#servicesBgGrad)" />
        <defs>
          <linearGradient id="servicesBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F3FB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F4F7F1" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                OUR SERVICES
              </span>
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-text-dark font-heading tracking-tight mb-4">
              Investment & Protection Solutions,<br className="hidden sm:block" />
              Built Around <span className="text-lime">You.</span>
            </h2>

            <p className="text-text-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Mutual fund investment and insurance solutions designed to support your long-term goals and protection needs.
            </p>
          </FadeIn>
        </div>

        {/* ── 3 Column Card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-y-0 relative">

          {services.map((service, i) => (
            <FadeIn key={i} delay={0.1 * i} direction="up" className="relative h-full flex flex-col">
              <div className="bg-white rounded-[24px] border border-border-sage/20 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 relative flex-1 flex flex-col pt-12 p-6 sm:p-8">

                {/* Overlapping Top Icon */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-navy flex items-center justify-center border-[4px] border-white shadow-sm z-10 transition-transform duration-300 hover:scale-105">
                  <service.icon className="w-6 h-6 text-lime" strokeWidth={2.5} />
                </div>

                {/* Title & Desc */}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-navy font-heading leading-tight whitespace-pre-line mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-text-body leading-relaxed max-w-[280px] mx-auto">
                    {service.desc}
                  </p>
                </div>

                {/* Image / Illustration Container */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] lg:aspect-video mb-6 bg-[#F8FAF5] rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={service.image}
                    alt={service.title.replace('\n', ' ')}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Bullet Points */}
                <div className="space-y-3 mb-5 flex-1">
                  {service.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-text-body leading-snug">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Link */}
                <div className="mt-auto">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-bold text-navy hover:text-accent-purple transition-colors group"
                  >
                    Know More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

              </div>
            </FadeIn>
          ))}

        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-10 text-center">
          <FadeIn direction="up" delay={0.4}>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-8 py-3.5 text-[15px] font-bold transition-all shadow-md hover:shadow-lg group"
            >
              Explore All Services
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
