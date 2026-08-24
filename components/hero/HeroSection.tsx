"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  TrendingUp,
  Target,
  ShieldCheck,
  Users,
  Star,
  BarChart3,
} from "lucide-react";

/* ──────────────────────────────────────────────────
   Hero Section — Bright, Premium, White Background
   Matches Wealthystep Design System exactly.
   ────────────────────────────────────────────────── */

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (i: number) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0.2 : 0.55,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  const fadeRight = (i: number) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: shouldReduceMotion ? 0.2 : 0.6,
      delay: 0.3 + i * 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section className="relative bg-cream overflow-x-clip">
      {/* ── Subtle background shapes & lines ── */}
      {/* Top-right decorative dots */}
      <svg
        className="absolute top-12 right-12 opacity-20 pointer-events-none hidden lg:block"
        width="140"
        height="140"
        viewBox="0 0 140 140"
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <circle
            key={i}
            cx={10 + (i % 6) * 24}
            cy={10 + Math.floor(i / 6) * 24}
            r="2.5"
            fill="#9CA3C4"
          />
        ))}
      </svg>
      
      {/* Bottom-left decorative dots */}
      <svg
        className="absolute bottom-12 left-12 opacity-20 pointer-events-none hidden lg:block"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <circle
            key={i}
            cx={10 + (i % 4) * 24}
            cy={10 + Math.floor(i / 4) * 24}
            r="2.5"
            fill="#9CA3C4"
          />
        ))}
      </svg>

      {/* Curved connecting line (top to right) */}
      <svg
        className="absolute top-0 right-0 w-[50%] h-full opacity-30 pointer-events-none hidden lg:block -z-0"
        viewBox="0 0 600 800"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C300,100 500,400 600,800"
          fill="none"
          stroke="#84BD3C"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle cx="500" cy="400" r="4" fill="#84BD3C" />
      </svg>
      
      {/* Curved connecting line (bottom left) */}
      <svg
        className="absolute bottom-0 left-0 w-[30%] h-[40%] opacity-30 pointer-events-none hidden lg:block -z-0"
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,400 C100,300 300,300 400,0"
          fill="none"
          stroke="#9CA3C4"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle cx="300" cy="300" r="4" fill="#9CA3C4" />
      </svg>

      {/* Premium subtle bottom-left ambient glow */}
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#240C7A]/20 blur-[120px] pointer-events-none hidden lg:block z-0"
      />

      {/* ── Main Content ── */}
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
          {/* ── LEFT COLUMN: Text ── */}
          <div className="space-y-7 max-w-2xl pr-4">
            {/* Eyebrow */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-lime font-heading">
                Building Financial Confidence
              </span>
              <div className="w-10 h-px bg-lime" />
            </motion.div>

            {/* Headline */}
            <motion.div {...fadeUp(1)}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.1] text-text-dark font-heading tracking-tight">
                Your Goals.
                <br />
                Our Strategy.
                <br />
                <span className="bg-gradient-to-r from-accent-purple to-lime bg-clip-text text-transparent">
                  A Wealthier Future.
                </span>
              </h1>
            </motion.div>

            {/* Subhead */}
            <motion.p
              {...fadeUp(2)}
              className="text-base sm:text-lg text-text-body leading-relaxed max-w-[480px]"
            >
              Personalized financial planning, smart investments, and
              comprehensive protection designed around your goals, lifestyle, and
              long-term aspirations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(3)} className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cta-green hover:bg-lime text-white px-8 py-4 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cta-green/25"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/investments"
                className="group inline-flex items-center gap-2 rounded-full border border-navy text-navy hover:bg-navy hover:text-white px-8 py-4 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              {...fadeUp(4)}
              className="flex flex-wrap gap-10 pt-8 text-sm text-text-body"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center">
                  <Users className="h-5 w-5 text-lime" />
                </div>
                <span className="font-medium text-text-dark text-[13px] leading-snug">
                  Personalized
                  <br />
                  Guidance
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center">
                  <Target className="h-5 w-5 text-lime" />
                </div>
                <span className="font-medium text-text-dark text-[13px] leading-snug">
                  Goal-Based
                  <br />
                  Planning
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-lime" />
                </div>
                <span className="font-medium text-text-dark text-[13px] leading-snug">
                  Expert
                  <br />
                  Support
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Advisor Visual ── */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
          >
            {/* Wrapper for Image and Background */}
            <div className="relative w-full max-w-[420px] md:max-w-[500px] lg:max-w-none lg:w-full mx-auto lg:mx-0">
              {/* Green organic background */}
              <div
                className="absolute -inset-6 sm:-inset-10 lg:-inset-16 -z-10 rounded-[45%_55%_50%_40%/55%_45%_55%_45%] bg-gradient-to-br from-[#DCEEC2] via-[#CFE5A8] to-[#84BD3C]/40"
              />

              {/* Advisor Photo */}
              <div 
                className="relative z-10 w-full aspect-[4/5] sm:aspect-square lg:aspect-[1.05/1] overflow-hidden shadow-2xl rounded-[24px] rounded-tr-[80px] lg:rounded-[32px] lg:rounded-tr-[120px]"
              >
                <Image
                  src="/advisor-hero.jpg"
                  alt="Professional Wealth Advisor"
                  fill
                  className="object-cover object-top lg:object-[60%_top]"
                  priority
                />
              </div>
            </div>

            {/* ── Floating Cards ── */}

            {/* Portfolio Growth Card — top-left */}
            <motion.div
              {...fadeRight(0)}
              className="absolute top-0 left-0 lg:top-8 lg:-left-12 z-20 bg-white rounded-xl shadow-lg border border-border-sage/20 px-4 py-3 flex items-center gap-3 scale-[0.65] sm:scale-90 lg:scale-100 origin-top-left"
            >
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-lime" />
              </div>
              <div>
                <div className="text-xs text-text-body">Portfolio Growth</div>
                <div className="text-lg font-bold text-positive font-heading">
                  +24.6%
                </div>
                <div className="text-[10px] text-text-body/60">This Year</div>
              </div>
              {/* Mini chart accent */}
              <svg
                width="60"
                height="30"
                viewBox="0 0 60 30"
                className="ml-1"
              >
                <path
                  d="M0,25 C10,22 15,18 20,15 C25,12 30,8 40,10 C50,12 55,5 60,2"
                  fill="none"
                  stroke="#84BD3C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Financial Goals Badge — top-right */}
            <motion.div
              {...fadeRight(1)}
              className="absolute top-12 right-0 lg:top-24 lg:-right-12 z-20 bg-white rounded-xl shadow-lg border border-border-sage/20 px-4 py-3 scale-[0.65] sm:scale-90 lg:scale-100 origin-right"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-lime/10 flex items-center justify-center">
                  <Target className="h-3.5 w-3.5 text-lime" />
                </div>
                <span className="text-sm font-bold text-text-dark font-heading">
                  Financial Goals
                </span>
              </div>
              <div className="text-[11px] text-text-body">
                Plan today for a
              </div>
              <div className="text-[11px] text-text-body">better tomorrow</div>
            </motion.div>

            {/* Wealth Protection Badge — middle-right */}
            <motion.div
              {...fadeRight(2)}
              className="absolute bottom-16 right-0 lg:bottom-24 lg:-right-8 z-20 bg-white rounded-xl shadow-lg border border-border-sage/20 px-4 py-3 scale-[0.65] sm:scale-90 lg:scale-100 origin-right"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-accent-purple/10 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-purple" />
                </div>
                <span className="text-sm font-bold text-text-dark font-heading">
                  Financial Protection
                </span>
              </div>
              <div className="text-[11px] text-text-body">
                Securing what
              </div>
              <div className="text-[11px] text-text-body">matters most</div>
            </motion.div>

            {/* 10+ Years Stat Card — bottom-left */}
            <motion.div
              {...fadeRight(3)}
              className="absolute -bottom-4 left-0 lg:-bottom-6 lg:left-[-2rem] z-30 bg-white rounded-xl shadow-xl border border-border-sage/20 px-6 py-4 flex items-center gap-4 scale-[0.65] sm:scale-90 lg:scale-100 origin-bottom-left"
            >
              <div className="w-11 h-11 rounded-xl bg-lime/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-lime" />
              </div>
              <div>
                <div className="text-3xl font-bold text-navy font-heading">
                  10+
                </div>
                <div className="text-xs text-text-body">Years of</div>
                <div className="text-xs font-semibold text-text-dark">
                  Financial Guidance
                </div>
                <div className="w-8 h-0.5 bg-navy mt-2 rounded-full" />
              </div>
            </motion.div>

            {/* Small decorative sparkle dots */}
            <div className="absolute top-4 left-1/2 w-1.5 h-1.5 bg-lime rounded-full opacity-60" />
            <div className="absolute bottom-32 -right-2 w-2 h-2 bg-accent-purple rounded-full opacity-40" />
            <div className="absolute top-1/2 -left-6 w-1.5 h-1.5 bg-lime rounded-full opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
