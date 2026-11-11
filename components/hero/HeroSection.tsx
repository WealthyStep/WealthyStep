"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Handshake,
  Users2,
  Lock,
  ChevronRight,
  Info,
  X,
  PhoneCall,
  Globe,
  TrendingUp,
  Building2,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   5 CORE REGULATED SERVICES (3 IN 1ST ROW, 2 IN 2ND ROW)
   Row 1: 3 Cards (Global Investments, India Investments, Group & Retail Insurance)
   Row 2: 2 Cards (General Insurance, Commercial Line)
   Each card redirects to its respective service page on click.
   ──────────────────────────────────────────────────────────── */
interface ServiceCardItem {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  href: string;
  icon: React.ElementType;
}

const ROW_1_CARDS: ServiceCardItem[] = [
  {
    id: "global-investments",
    order: "01",
    title: "Global Investments",
    subtitle: "GIFT City · Inbound & Outbound",
    image: "/images/hero-tabs/tab-global-investments.jpg",
    alt: "Global Investments (GIFT City, Inbound & Outbound) - Wealthy Step",
    href: "/services/investments/global-investments/",
    icon: Globe,
  },
  {
    id: "india-investments",
    order: "02",
    title: "India Investments",
    subtitle: "Mutual Funds (SIP) & SIF",
    image: "/images/hero-tabs/tab-india-investments.jpg",
    alt: "India Investments (Mutual Funds & SIF) - Wealthy Step",
    href: "/services/investments/indian-investments/",
    icon: TrendingUp,
  },
  {
    id: "group-retail-insurance",
    order: "03",
    title: "Group & Retail Insurance",
    subtitle: "Health, Life & Accidental Cover",
    image: "/images/hero-tabs/tab-group-retail-insurance.jpg",
    alt: "Group & Retail Insurance (Health, Life, Accidental) - Wealthy Step",
    href: "/services/insurance/group-insurance/",
    icon: Users2,
  },
];

const ROW_2_CARDS: ServiceCardItem[] = [
  {
    id: "general-insurance",
    order: "04",
    title: "General Insurance",
    subtitle: "Motor, Travel & Home Protection",
    image: "/images/hero-tabs/tab-general-insurance.jpg",
    alt: "General Insurance (Motor, Travel, Property) - Wealthy Step",
    href: "/services/insurance/general-insurance/",
    icon: ShieldCheck,
  },
  {
    id: "commercial-line",
    order: "05",
    title: "Commercial Line",
    subtitle: "EMD, WC & Performance Guarantees",
    image: "/images/hero-tabs/tab-commercial-line.jpg",
    alt: "Commercial Line (EMD, Worker Compensation, Performance Guarantee) - Wealthy Step",
    href: "/services/insurance/commercial-insurance/",
    icon: Building2,
  },
];

const TRUST_METRICS = [
  {
    icon: CheckCircle2,
    label: "Trusted & Transparent Services",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: Handshake,
    label: "Wide Range of Investment & Insurance Solutions",
    iconBg: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    icon: Users2,
    label: "For Individuals, Families & Businesses",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: Lock,
    label: "Your Security Our Priority",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  return (
    <section className="relative bg-[#F5F9FD] text-[#180D45] overflow-hidden border-b border-gray-200/70 pt-3 sm:pt-4 lg:pt-5 pb-0">
      
      {/* ── 1. MASTER FINTECH DAYLIGHT BACKGROUND ARTWORK ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <Image
          src="/images/hero/hero-bg.webp"
          alt="Wealthy Step Global Financial Horizon"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-bottom opacity-35 sm:opacity-45 pointer-events-none"
        />

        {/* Soft daylight gradient overlay for 100% WCAG AAA readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9FD]/95 via-white/85 to-[#F8FBFE]/95" />

        {/* Dynamic Curved Wave Accent */}
        <svg
          className="absolute bottom-0 right-0 w-[240px] sm:w-[360px] lg:w-[480px] h-[100px] sm:h-[135px] pointer-events-none opacity-80"
          viewBox="0 0 620 180"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 620 30 C 480 60, 360 120, 260 180 L 620 180 Z"
            fill="url(#heroNavyGradStructured)"
            opacity="0.95"
          />
          <path
            d="M 620 10 C 460 30, 310 90, 200 180 L 260 180 C 360 120, 480 60, 620 30 Z"
            fill="url(#heroAccentGradStructured)"
            opacity="0.75"
          />
          <defs>
            <linearGradient id="heroNavyGradStructured" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#240C7A" />
              <stop offset="100%" stopColor="#180D45" />
            </linearGradient>
            <linearGradient id="heroAccentGradStructured" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto max-w-[1280px] px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── 2. TOP ACTION & AUTHORITY BAR (Clean, Streamlined & Professional) ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-5 pt-1">
          
          {/* Left: Authority Badge */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 border border-emerald-300/80 shadow-2xs backdrop-blur-md"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-[#180D45] tracking-tight">
              AMFI Registered Mutual Fund Distributor
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-[10.5px] sm:text-[11px] font-semibold text-emerald-800 font-mono">
              ARN-322891
            </span>
          </motion.div>

          {/* Right: Cohesive On-Brand Action Buttons (Fixed Contact Us Color) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <Link
              href="https://calendly.com/wealthystep-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full bg-[#180D45] hover:bg-[#240C7A] text-white text-xs sm:text-[13px] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#84BD3C] shrink-0" />
              <span>Book a 30-Min Call</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full bg-white hover:bg-gray-50 border-2 border-[#180D45] text-[#180D45] text-xs sm:text-[13px] font-bold transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#180D45] shrink-0" />
            </Link>
          </motion.div>

        </div>

        {/* ── 3. THE 5 SERVICE CARDS (3 ON FIRST ROW, 2 ON SECOND ROW) ── */}
        <div className="space-y-4 sm:space-y-5 mb-5 sm:mb-6">
          
          {/* ── First Row: 3 Images (Global Investments, India Investments, Group & Retail Insurance) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
            {ROW_1_CARDS.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * idx }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="group relative"
                >
                  <Link
                    href={card.href}
                    className="block rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_8px_30px_-6px_rgba(24,13,69,0.07)] hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden relative cursor-pointer"
                  >
                    {/* Visual Card Image */}
                    <div className="relative aspect-[1024/700] w-full bg-white flex items-center justify-center overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
                        className="object-contain p-1 group-hover:scale-[1.015] transition-transform duration-500"
                        priority={idx < 2}
                      />
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#180D45] text-white flex items-center justify-center shrink-0">
                          <IconComponent className="w-3.5 h-3.5 text-[#84BD3C]" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-black text-[#180D45] group-hover:text-emerald-700 transition-colors block leading-tight truncate">
                            {card.title}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium truncate block">
                            {card.subtitle}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#180D45] group-hover:bg-[#240C7A] text-white text-[11px] font-bold shrink-0 transition-colors shadow-2xs">
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform text-[#84BD3C]" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Second Row: 2 Images (General Insurance, Commercial Line) - Centered & Symmetrical ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 max-w-[850px] mx-auto">
            {ROW_2_CARDS.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 + 0.04 * idx }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="group relative"
                >
                  <Link
                    href={card.href}
                    className="block rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_8px_30px_-6px_rgba(24,13,69,0.07)] hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden relative cursor-pointer"
                  >
                    {/* Visual Card Image */}
                    <div className="relative aspect-[1024/700] w-full bg-white flex items-center justify-center overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                        className="object-contain p-1 group-hover:scale-[1.015] transition-transform duration-500"
                      />
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#180D45] text-white flex items-center justify-center shrink-0">
                          <IconComponent className="w-3.5 h-3.5 text-[#84BD3C]" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs sm:text-[13px] font-black text-[#180D45] group-hover:text-emerald-700 transition-colors block leading-tight truncate">
                            {card.title}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium truncate block">
                            {card.subtitle}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#180D45] group-hover:bg-[#240C7A] text-white text-[11px] font-bold shrink-0 transition-colors shadow-2xs">
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform text-[#84BD3C]" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ── 4. SPECIALISED HEALTH COVER HIGHLIGHT PILL ── */}
        <div className="max-w-2xl mx-auto mb-4 sm:mb-5">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-white/98 via-[#F9FAFB]/95 to-[#F3F4F6]/85 border border-gray-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all backdrop-blur-xs"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/hero/card-health-shield.png"
                  alt="3D Medical shield with stethoscope - Specialised health cover"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-[13px] font-black text-[#180D45] leading-tight">
                    Specialised Health Cover
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsHealthModalOpen(true)}
                    aria-label="View underwriting details"
                    className="text-slate-500 hover:text-[#180D45] transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[9.5px] sm:text-[10.5px] text-gray-600 font-medium leading-none mt-0.5 truncate">
                  Pre-existing &amp; Chronic Conditions · Unconditional Cover
                </p>
              </div>
            </div>

            <Link
              href="/services/insurance/retail-insurance/#specialised-health"
              aria-label="Explore specialised health insurance options"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 hover:bg-[#180D45] text-slate-700 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </motion.div>
        </div>

      </div>

      {/* ── 5. BOTTOM TRUST & TRANSPARENCY BAR ── */}
      <div className="border-t border-gray-200/80 bg-white/95 backdrop-blur-md relative z-10 py-2.5 sm:py-3">
        <div className="container mx-auto max-w-[1280px] px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 items-stretch">
            {TRUST_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-white/95 border border-gray-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:border-sky-300/80 hover:shadow-xs transition-all duration-200"
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${metric.iconBg} flex items-center justify-center shrink-0 border`}
                >
                  <metric.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.2} />
                </div>
                <span className="text-[10.5px] sm:text-[11px] font-bold text-[#180D45] leading-snug">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Regulatory Compliance Footnote */}
          <div className="mt-2 pt-1.5 border-t border-gray-100 text-center">
            <p className="text-[8.5px] sm:text-[9px] text-gray-500 leading-normal max-w-4xl mx-auto">
              <strong className="text-gray-700">Regulatory Disclosure:</strong> Wealthy Step is an
              AMFI-registered Mutual Fund Distributor (ARN-322891) and does not provide portfolio management
              services, individual wealth management contracts, or guaranteed returns. Mutual Fund investments
              are subject to market risks, read all scheme-related documents carefully. Insurance
              products are solicited as a corporate/retail distribution channel underwritten by
              respective IRDAI-registered insurance companies.
            </p>
          </div>
        </div>
      </div>

      {/* ── 6. SPECIALISED HEALTH UNDERWRITING COMPLIANCE MODAL ── */}
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
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#180D45]">
                  Specialised Health Cover
                </h4>
                <p className="text-xs text-gray-500 font-semibold">
                  Pre-existing &amp; Chronic Medical Conditions · Unconditional Cover
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              <p>
                We facilitate access to insurance solutions designed for individuals with
                pre-existing medical conditions (such as diabetes, hypertension, asthma, and
                cardiovascular conditions).
              </p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/90 text-[11px] text-slate-800 space-y-1">
                <p className="font-bold text-[#180D45]">Underwriting &amp; Regulatory Compliance Note:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
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
