
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight } from "lucide-react";

const goals = [
  {
    id: "01",
    title: "Dream Home",
    desc: "Turn your dream home into a clear investment journey.",
    image: "/images/goal-6.jpg",
    href: "/goal-calculators"
  },
  {
    id: "02",
    title: "Long-Term Investing",
    desc: "Work towards your long-term goals through disciplined investing.",
    image: "/images/goal-2.jpg",
    href: "/investments"
  },
  {
    id: "03",
    title: "Retirement",
    desc: "Start today for a comfortable tomorrow and enjoy life your way.",
    image: "/images/goal-3.jpg",
    href: "/goal-calculators"
  },
  {
    id: "04",
    title: "Child Education",
    desc: "Save for their education and build a strong foundation for their future.",
    image: "/images/goal-5.jpg",
    href: "/goal-calculators"
  },
  {
    id: "05",
    title: "Child Marriage",
    desc: "Prepare for life's special moments and celebrate with peace of mind.",
    image: "/images/goal-4.jpg",
    href: "/goal-calculators"
  },
  {
    id: "06",
    title: "Emergency Fund",
    desc: "Be prepared for unexpected situations and protect your financial stability.",
    image: "/images/goal-1.jpg",
    href: "/goal-calculators"
  }
];

export function GoalsSection() {
  return (
    <section className="relative bg-[#FAFAFA] pt-8 pb-10 overflow-hidden z-20 border-t border-border-sage/20">

      {/* ── Background Decorative Elements ── */}
      {/* Top Right Dots */}
      <div className="absolute top-10 right-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 25} cy={10 + Math.floor(i / 5) * 25} r="2" fill="#84BD3C" />
          ))}
        </svg>
      </div>

      {/* Bottom Left Dots */}
      <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 25} cy={10 + Math.floor(i / 5) * 25} r="2" fill="#84BD3C" />
          ))}
        </svg>
      </div>

      {/* Subtle sweeping background curve */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path d="M-200,800 C400,600 900,100 1600,0 L1600,800 Z" fill="url(#goalsBgGrad)" />
        <defs>
          <linearGradient id="goalsBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F3FB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F4F7F1" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                INVEST WITH PURPOSE
              </span>
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-text-dark font-heading tracking-tight mb-4">
              Achieve Every Goal<br className="hidden sm:block" />
              That <span className="text-accent-purple">Matters to You.</span>
            </h2>

            <p className="text-text-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Every financial journey is unique. Explore goal-based options designed to help you explore, invest, and move closer to what matters most.
            </p>
          </FadeIn>
        </div>

        {/* ── 6 Card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

          {goals.map((goal, i) => (
            <FadeIn key={i} delay={0.1 * i} direction="up" className="h-full">
              <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-border-sage/20 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group relative overflow-hidden">

                {/* Top Section: Number and Image */}
                <div className="flex justify-between items-start mb-6 relative z-10">

                  {/* Large Green Number */}
                  <div className="flex flex-col">
                    <span className="text-[28px] font-bold text-lime font-heading leading-none">
                      {goal.id}
                    </span>
                    <div className="w-6 h-[3px] bg-lime mt-1.5 rounded-full" />
                  </div>

                  {/* 3D Image Area */}
                  <div className="relative w-[150px] sm:w-[170px] h-[120px] -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                    {/* Organic CSS Blob Mask */}
                    <div 
                      className="absolute inset-0 bg-[#F2F7EA] overflow-hidden transition-colors duration-500 group-hover:bg-[#EAF3DE]"
                      style={{
                        borderRadius: [
                          "70% 30% 30% 70% / 60% 40% 60% 40%",
                          "40% 60% 70% 30% / 40% 50% 50% 60%",
                          "70% 5% 40% 60% / 70% 5% 40% 60%", // Retirement: sharp top-right to preserve heads
                          "30% 70% 70% 30% / 50% 30% 70% 50%",
                          "60% 40% 30% 70% / 60% 30% 70% 40%",
                          "80% 20% 40% 60% / 50% 50% 50% 50%"
                        ][i % 6]
                      }}
                    >
                      <Image 
                        src={goal.image} 
                        alt={goal.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover mix-blend-multiply scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="mb-8 flex-1 relative z-10">
                  <h3 className="text-[22px] font-bold text-navy font-heading mb-3">
                    {goal.title}
                  </h3>
                  <p className="text-[14px] text-text-body leading-relaxed">
                    {goal.desc}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-auto relative z-10">
                  <Link
                    href={goal.href}
                    className="inline-flex items-center text-[14px] font-bold text-lime group/link"
                  >
                    Explore Goal
                    <div className="ml-3 w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center transition-all duration-300 group-hover/link:bg-lime group-hover/link:shadow-md">
                      <ArrowRight className="w-4 h-4 text-lime group-hover/link:text-white transition-colors" />
                    </div>
                  </Link>
                </div>

              </div>
            </FadeIn>
          ))}

        </div>

        {/* ── Bottom CTA Button ── */}
        <div className="mt-8 text-center">
          <FadeIn direction="up" delay={0.4}>
            <Link
              href="/goal-calculators"
              className="inline-flex items-center justify-center rounded-full bg-cta-green hover:bg-lime text-white px-8 py-3.5 text-base font-bold transition-all shadow-md hover:shadow-lg group"
            >
              Start Your Goals Today
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
