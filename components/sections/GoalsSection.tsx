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
    href: "/services/investments/mutual-funds/"
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
    <section className="relative bg-[#FAFAFA] pt-5 pb-6 sm:pt-7 sm:pb-8 overflow-hidden z-20 border-t border-border-sage/20">

      {/* ── Background Decorative Elements ── */}
      {/* Top Right Dots */}
      <div className="absolute top-8 right-10 opacity-20 pointer-events-none hidden lg:block">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {Array.from({ length: 25 }).map((_, i) => (
            <circle key={i} cx={10 + (i % 5) * 20} cy={10 + Math.floor(i / 5) * 20} r="2" fill="#84BD3C" />
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

      <div className="container mx-auto max-w-[1200px] px-3.5 sm:px-6 xl:px-0 relative z-10">

        {/* ── Header (Compact & Crisp) ── */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-2.5">
              <div className="w-8 sm:w-10 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-lime font-heading">
                INVEST WITH PURPOSE
              </span>
              <div className="w-8 sm:w-10 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-text-dark font-heading tracking-tight mb-2">
              Achieve Every Goal{" "}
              <span className="text-accent-purple">That Matters to You.</span>
            </h2>

            <p className="text-text-body text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Every financial journey is unique. Explore goal-based options designed to help you explore, invest, and move closer to what matters most.
            </p>
          </FadeIn>
        </div>

        {/* ── 6 Card Grid (2x3 on Mobile • 3x2 on Desktop • Sleek & Compact) ── */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4">

          {goals.map((goal, i) => (
            <FadeIn key={i} delay={0.06 * i} direction="up" className="h-full">
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 pb-3.5 sm:pb-4 border border-border-sage/20 shadow-xs hover:shadow-lg transition-all duration-300 h-full flex flex-col group relative overflow-hidden hover:-translate-y-0.5">

                {/* Top Section: Number and Image */}
                <div className="flex justify-between items-start mb-2.5 sm:mb-3 relative z-10">

                  {/* Green Number */}
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-lime font-heading leading-none">
                      {goal.id}
                    </span>
                    <div className="w-4 h-[2px] bg-lime mt-1 rounded-full" />
                  </div>

                  {/* 3D Image Area with Organic CSS Blob */}
                  <div className="relative w-[75px] sm:w-[95px] lg:w-[110px] h-[60px] sm:h-[72px] lg:h-[80px] -mr-3 -mt-3 sm:-mr-4 sm:-mt-4 transition-transform duration-500 group-hover:scale-105">
                    <div 
                      className="absolute inset-0 bg-[#F2F7EA] overflow-hidden transition-colors duration-500 group-hover:bg-[#EAF3DE]"
                      style={{
                        borderRadius: [
                          "70% 30% 30% 70% / 60% 40% 60% 40%",
                          "40% 60% 70% 30% / 40% 50% 50% 60%",
                          "70% 5% 40% 60% / 70% 5% 40% 60%",
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
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover mix-blend-multiply scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="mb-3 sm:mb-4 flex-1 relative z-10">
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-navy font-heading mb-1 leading-tight line-clamp-1">
                    {goal.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-text-body leading-snug line-clamp-2">
                    {goal.desc}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="mt-auto relative z-10">
                  <Link
                    href={goal.href}
                    className="inline-flex items-center text-[10.5px] sm:text-xs font-bold text-lime group/link cursor-pointer"
                  >
                    <span>Explore Goal</span>
                    <div className="ml-1.5 sm:ml-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-lime/10 flex items-center justify-center transition-all duration-300 group-hover/link:bg-lime group-hover/link:shadow-xs">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-lime group-hover/link:text-white transition-colors" />
                    </div>
                  </Link>
                </div>

              </div>
            </FadeIn>
          ))}

        </div>

        {/* ── Bottom CTA Button ── */}
        <div className="mt-6 sm:mt-7 text-center">
          <FadeIn direction="up" delay={0.25}>
            <Link
              href="/goal-calculators"
              className="inline-flex items-center justify-center rounded-full bg-cta-green hover:bg-lime text-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md group cursor-pointer"
            >
              <span>Start Your Goals Today</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
