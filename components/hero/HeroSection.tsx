"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users2,
  Lock,
  ChevronRight,
  Compass,
  Info,
  X,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   SERVICE CARDS DATA (01 to 05)
   Exact match to the approved Wealthy Step Homepage Hero UI
   ──────────────────────────────────────────────────────────── */
interface ServiceCardData {
  id: string;
  order: string;
  title: string;
  supporting: string;
  image: string;
  imageAlt: string;
  href: string;
  colorScheme: {
    orderColor: string;
    cardBg: string;
    cardBorder: string;
    cardHoverBorder: string;
    shadow: string;
  };
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    id: "global-investments",
    order: "01",
    title: "Global Investments",
    supporting: "GIFT City",
    image: "/images/hero/card-global-investments.png",
    imageAlt: "3D Globe with golden currency orbit - Global Investments",
    href: "/services/investments/global-investments/",
    colorScheme: {
      orderColor: "text-sky-500",
      cardBg: "bg-gradient-to-br from-white via-[#F5F9FD] to-[#EAF2FB]",
      cardBorder: "border-sky-100/90",
      cardHoverBorder: "hover:border-sky-300",
      shadow: "shadow-[0_6px_20px_-4px_rgba(14,165,233,0.10)]",
    },
  },
  {
    id: "indian-investments",
    order: "02",
    title: "Indian Investments",
    supporting: "Mutual Funds · SIF",
    image: "/images/hero/card-indian-investments.png",
    imageAlt: "3D Green growth chart with rupee coin - Indian Investments",
    href: "/services/investments/indian-investments/",
    colorScheme: {
      orderColor: "text-emerald-500",
      cardBg: "bg-gradient-to-br from-white via-[#F6FBF7] to-[#EDF7EF]",
      cardBorder: "border-emerald-100/90",
      cardHoverBorder: "hover:border-emerald-300",
      shadow: "shadow-[0_6px_20px_-4px_rgba(16,185,129,0.10)]",
    },
  },
  {
    id: "group-retail-insurance",
    order: "03",
    title: "Group & Retail Insurance",
    supporting: "Health · Life · Group Cover",
    image: "/images/hero/card-group-insurance.png",
    imageAlt: "3D Shield with family figures - Group and Retail Insurance",
    href: "/services/insurance/group-insurance/",
    colorScheme: {
      orderColor: "text-purple-600",
      cardBg: "bg-gradient-to-br from-white via-[#FAF7FD] to-[#F3EDFB]",
      cardBorder: "border-purple-100/90",
      cardHoverBorder: "hover:border-purple-300",
      shadow: "shadow-[0_6px_20px_-4px_rgba(147,51,234,0.10)]",
    },
  },
  {
    id: "motor-travel-insurance",
    order: "04",
    title: "Motor & Travel Insurance",
    supporting: "Car · Two-Wheeler · Travel",
    image: "/images/hero/card-motor-travel.png",
    imageAlt: "3D Airplane and sedan vehicle - Motor and Travel Insurance",
    href: "/services/insurance/general-insurance/",
    colorScheme: {
      orderColor: "text-amber-500",
      cardBg: "bg-gradient-to-br from-white via-[#FDF9F5] to-[#FBF2EA]",
      cardBorder: "border-amber-100/90",
      cardHoverBorder: "hover:border-amber-300",
      shadow: "shadow-[0_6px_20px_-4px_rgba(245,158,11,0.10)]",
    },
  },
];

const COMMERCIAL_CARD: ServiceCardData = {
  id: "commercial-insurance",
  order: "05",
  title: "Commercial Insurance",
  supporting: "EMD · Performance Guarantee (PG) · Workers' Compensation (WC)",
  image: "/images/hero/card-commercial-insurance.png",
  imageAlt: "3D Modern glass headquarters - Commercial Insurance",
  href: "/services/insurance/commercial-insurance/",
  colorScheme: {
    orderColor: "text-teal-600",
    cardBg: "bg-gradient-to-r from-white via-[#F5FAFA] to-[#EDF6F6]",
    cardBorder: "border-teal-100/90",
    cardHoverBorder: "hover:border-teal-300",
    shadow: "shadow-[0_6px_20px_-4px_rgba(20,184,166,0.10)]",
  },
};

const TRUST_METRICS = [
  {
    icon: CheckCircle2,
    label: "Trusted & Transparent Services",
  },
  {
    icon: FileText,
    label: "Wide Range of Investment & Insurance Solutions",
  },
  {
    icon: Users2,
    label: "For Individuals, Families & Businesses",
  },
  {
    icon: Lock,
    label: "Your Security Our Priority",
  },
];

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  return (
    <section className="relative bg-[#F5F9FD] text-[#180D45] overflow-hidden border-b border-gray-200/70 pt-2 pb-0 sm:pt-4 sm:pb-0 lg:pt-5">
      
      {/* ── 1. MASTER FINTECH DAYLIGHT BACKGROUND ARTWORK ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <Image
          src="/images/hero/hero-bg.webp"
          alt="Wealthy Step Global Financial Horizon"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-bottom opacity-40 sm:opacity-50 pointer-events-none"
        />

        {/* Soft daylight gradient overlay for 100% WCAG AAA readability across all devices */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9FD]/95 via-white/80 to-[#F8FBFE]/92 sm:from-[#F5F9FD]/88 sm:via-white/75 sm:to-white/88" />

        {/* Dynamic Curved Wealthy Step Green & Navy Wave Accent (Bottom Right Corner) */}
        <svg
          className="absolute bottom-0 right-0 w-[260px] sm:w-[380px] lg:w-[480px] h-[110px] sm:h-[145px] pointer-events-none opacity-80"
          viewBox="0 0 620 180"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 620 30 C 480 60, 360 120, 260 180 L 620 180 Z"
            fill="url(#heroNavyGradPerfect)"
            opacity="0.95"
          />
          <path
            d="M 620 10 C 460 30, 310 90, 200 180 L 260 180 C 360 120, 480 60, 620 30 Z"
            fill="url(#heroLimeGradPerfect)"
            opacity="0.90"
          />
          <defs>
            <linearGradient id="heroNavyGradPerfect" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#240C7A" />
              <stop offset="100%" stopColor="#180D45" />
            </linearGradient>
            <linearGradient id="heroLimeGradPerfect" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84BD3C" />
              <stop offset="100%" stopColor="#446A1B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto max-w-[1360px] px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── 2. MAIN HERO TWO-COLUMN COMPOSITION (Responsive: Mobile Stack • Desktop 12-Col) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-12 items-center pt-2 sm:pt-4 pb-6 sm:pb-8 lg:pb-10">
          
          {/* ══════════════════════════════════════════════════════════
              LEFT SIDE: BRAND HEADLINE, PITCH & SIDE-BY-SIDE PILL CTAS
              ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            
            {/* Trust & Authority Pill */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-emerald-400/80 shadow-2xs backdrop-blur-md w-fit mb-3 sm:mb-3.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-[13px] font-bold text-[#180D45] tracking-tight">
                Trusted Financial Services
              </span>
              <span className="text-emerald-500 font-bold">•</span>
              <span className="text-xs sm:text-[13px] font-bold text-emerald-700 font-mono">
                ARN-322891
              </span>
            </motion.div>

            {/* Primary Headline */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-[42px] xl:text-[50px] font-black tracking-tight leading-[1.1] text-[#180D45] mb-2 sm:mb-3"
            >
              <span>Your Financial World.</span>
              <br />
              <span className="text-[#84BD3C]">Multiple Possibilities.</span>
            </motion.h1>

            {/* Supporting Heading */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg font-bold text-[#180D45] leading-snug mb-2 sm:mb-3"
            >
              Investment &amp; Insurance Services for Individuals, Families &amp; Businesses.
            </motion.h2>

            {/* Short Description */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="text-xs sm:text-sm md:text-[14px] text-gray-600 font-normal leading-relaxed max-w-lg mb-5 sm:mb-6"
            >
              Explore investment opportunities across Indian and global markets, along with
              insurance solutions for individuals, families, employees and businesses.
            </motion.p>

            {/* Two Clear Calls to Action (Side-by-Side Symmetrical Pills) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="flex flex-row flex-wrap items-center gap-3 sm:gap-3.5"
            >
              {/* Primary CTA */}
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#180D45] hover:bg-[#240C7A] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
              >
                <Compass className="w-4 h-4 text-[#84BD3C] shrink-0" />
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              {/* Secondary CTA (Side-by-Side Matching Pill) */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-gray-50 border-2 border-[#180D45] text-[#180D45] text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 text-[#180D45] shrink-0" />
              </Link>
            </motion.div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT SIDE: THE 5 MAIN SERVICE CARDS + HEALTH COVER
              Spacious, High-Contrast & Beautifully Proportionate
              ══════════════════════════════════════════════════════════ */}
          <div id="services" className="lg:col-span-7 flex flex-col gap-3 sm:gap-3.5">
            
            {/* Top 2x2 Grid: Cards 01 to 04 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {SERVICE_CARDS.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * idx }}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="group relative"
                >
                  <Link
                    href={card.href}
                    className={`block rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 xl:p-4 ${card.colorScheme.cardBg} border ${card.colorScheme.cardBorder} ${card.colorScheme.cardHoverBorder} ${card.colorScheme.shadow} hover:shadow-xl transition-all duration-200 relative overflow-hidden h-full backdrop-blur-xs`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5">
                      {/* Left: 3D Visual Artwork */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 xl:w-18 xl:h-18 shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                        <Image
                          src={card.image}
                          alt={card.imageAlt}
                          width={72}
                          height={72}
                          className="w-full h-full object-contain drop-shadow-md"
                          priority={idx < 2}
                        />
                      </div>

                      {/* Right: Order Number, Title & Supporting Label */}
                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-xs sm:text-[13px] font-extrabold font-mono block ${card.colorScheme.orderColor} leading-none mb-1`}
                        >
                          {card.order}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-[#180D45] group-hover:text-black transition-colors leading-tight mb-0.5 sm:mb-1">
                          {card.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight line-clamp-2">
                          {card.supporting}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Card 05: Full-Width Foundation (Commercial Insurance) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              className="group relative"
            >
              <Link
                href={COMMERCIAL_CARD.href}
                className={`block rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 xl:p-4 ${COMMERCIAL_CARD.colorScheme.cardBg} border ${COMMERCIAL_CARD.colorScheme.cardBorder} ${COMMERCIAL_CARD.colorScheme.cardHoverBorder} ${COMMERCIAL_CARD.colorScheme.shadow} hover:shadow-xl transition-all duration-200 relative overflow-hidden backdrop-blur-xs`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Left: 3D Glass Tower Visual */}
                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 xl:w-24 xl:h-18 shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                    <Image
                      src={COMMERCIAL_CARD.image}
                      alt={COMMERCIAL_CARD.imageAlt}
                      width={96}
                      height={72}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>

                  {/* Right: Order, Title & Supporting Risk Labels */}
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs sm:text-[13px] font-extrabold font-mono block ${COMMERCIAL_CARD.colorScheme.orderColor} leading-none mb-1`}
                    >
                      {COMMERCIAL_CARD.order}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-[#180D45] group-hover:text-black transition-colors leading-tight mb-0.5 sm:mb-1">
                      {COMMERCIAL_CARD.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
                      {COMMERCIAL_CARD.supporting}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Specialised Health Cover Highlight Pill (Pre-existing & Chronic Conditions) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.22 }}
              className="relative"
            >
              <div className="flex items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ECFDF5] via-white to-[#F0FDF4] border border-emerald-300/80 shadow-xs hover:shadow-md transition-all backdrop-blur-xs">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* 3D Medical Cross Shield Icon */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
                    <Image
                      src="/images/hero/card-health-shield.png"
                      alt="3D Medical shield with stethoscope - Specialised health cover"
                      width={36}
                      height={36}
                      className="w-full h-full object-contain drop-shadow-xs"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-[#180D45] leading-tight">
                        Specialised Health Cover
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsHealthModalOpen(true)}
                        aria-label="View underwriting details"
                        className="text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 font-medium leading-none mt-0.5 truncate">
                      Pre-existing &amp; Chronic Conditions
                    </p>
                  </div>
                </div>

                {/* Right Arrow Link to Insurance */}
                <Link
                  href="/services/insurance/retail-insurance/#specialised-health"
                  aria-label="Explore specialised health insurance options"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 hover:bg-emerald-500 text-emerald-800 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </Link>
              </div>
            </motion.div>

          </div>

        </div>

      </div>

      {/* ── 3. BOTTOM TRUST & TRANSPARENCY BAR (Balanced Clean Footer Strip) ── */}
      <div className="border-t border-gray-200/80 bg-white/95 backdrop-blur-md relative z-10 py-2.5 sm:py-3">
        <div className="container mx-auto max-w-[1360px] px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 items-center">
            {TRUST_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-2.5 px-1 sm:px-2"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-50 text-[#180D45] flex items-center justify-center shrink-0 border border-sky-100">
                  <metric.icon className="w-4 h-4 text-[#180D45]" strokeWidth={2} />
                </div>
                <span className="text-[10.5px] sm:text-xs font-bold text-[#180D45] leading-tight">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Regulatory Compliance Footnote */}
          <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-center">
            <p className="text-[8.5px] sm:text-[9.5px] text-gray-500 leading-normal max-w-4xl mx-auto">
              <strong className="text-gray-700">Regulatory Disclosure:</strong> Wealthy Step is an
              AMFI-registered Mutual Fund Distributor (ARN-322891) and does not provide investment
              advisory services, financial planning, or guaranteed returns. Mutual Fund investments
              are subject to market risks, read all scheme-related documents carefully. Insurance
              products are solicited as a corporate/retail distribution channel underwritten by
              respective IRDAI-registered insurance companies.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. SPECIALISED HEALTH UNDERWRITING COMPLIANCE MODAL ── */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-100 relative text-left">
            <button
              onClick={() => setIsHealthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#180D45]">
                  Specialised Health Cover
                </h4>
                <p className="text-xs text-gray-500 font-semibold">
                  Pre-existing &amp; Chronic Medical Conditions
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              <p>
                We facilitate access to insurance solutions designed for individuals with
                pre-existing medical conditions (such as diabetes, hypertension, asthma, and
                cardiovascular conditions).
              </p>
              <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900 space-y-1">
                <p className="font-bold">Underwriting &amp; Regulatory Compliance Note:</p>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-800">
                  <li>Coverage is not guaranteed and requires insurer underwriting evaluation.</li>
                  <li>Policy approval, exclusions, and waiting periods apply as per insurer terms.</li>
                  <li>Medical records and declarations are required during application.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsHealthModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/services/insurance/retail-insurance/#specialised-health"
                onClick={() => setIsHealthModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-[#180D45] hover:bg-[#240C7A] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                View Insurance Options
              </Link>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
