
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, Users, ShieldCheck, UserCheck } from "lucide-react";

export function InsuranceHero() {
  return (
    <section className="relative bg-[#180D45] pt-8 md:pt-10 pb-12 md:pb-16 overflow-hidden z-20">
      {/* ── Background Decorative Elements ── */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute w-full h-full opacity-50 mix-blend-screen" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M-100,800 C400,300 800,100 1500,0 L1500,800 Z" fill="url(#heroGlowGrad)" />
          <defs>
            <linearGradient id="heroGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C1844" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#1E1B4B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#84BD3C" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div className="text-white max-w-xl">
            <FadeIn direction="up">
              <div className="flex items-center text-lime text-xs font-bold tracking-[0.2em] mb-4 uppercase">
                <span className="w-8 h-[2px] bg-lime mr-4"></span>
                INSURANCE SOLUTIONS
                <span className="w-8 h-[2px] bg-lime ml-4"></span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold font-heading leading-[1.1] tracking-tight mb-4">
                Secure Today.<br />
                <span className="text-lime">Protect</span> Forever.
              </h1>
              
              <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
                Comprehensive insurance plans designed to safeguard you, your family and your future from life&apos;s uncertainties.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-8 py-3.5 text-sm font-bold transition-all shadow-md hover:shadow-lg group mb-10"
              >
                Get a Free Consultation
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>

            {/* Badges/Features */}
            <FadeIn direction="up" delay={0.2} className="flex flex-wrap items-center gap-6 sm:gap-10 mt-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-lime" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm font-medium text-white/90 leading-tight">Goal-Based<br/>Protection</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-lime" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm font-medium text-white/90 leading-tight">Claim Support<br/>Made Easy</span>
              </div>
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-lime" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm font-medium text-white/90 leading-tight">Reliable<br/>Support</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Image/Illustration */}
          <div className="relative h-[300px] lg:h-[450px] flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <FadeIn direction="left" delay={0.3} className="relative w-full h-full max-w-[750px] lg:scale-125 lg:translate-x-12">
               <Image 
                src="/images/insurance-hero.jpg"
                alt="Insurance Protection Illustration"
                fill
                className="object-contain lg:object-right mix-blend-screen pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 70%)'
                }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
