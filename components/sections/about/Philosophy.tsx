"use client";

import React from "react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Philosophy() {
  return (
    <section className="relative bg-navy pt-8 pb-10 md:pt-12 md:pb-12 overflow-hidden border-t border-white/10">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image 
          src="/images/contact-people.jpg" 
          alt="Wealthy Step Philosophy" 
          fill
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover mix-blend-luminosity grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80"></div>
      </div>

      <div className="container mx-auto max-w-[1000px] px-4 xl:px-0 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-12 lg:col-span-10 lg:col-start-2 text-center">
            <FadeIn direction="up">
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading mb-6 block">
                The Wealthy Step Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-[1.2] font-heading">
                Because Wealth Is More Than a Number
              </h2>
            </FadeIn>
            
            <FadeInStagger className="space-y-6 text-cream/90 text-lg md:text-xl leading-relaxed mb-16 mx-auto max-w-3xl">
              <FadeInStaggerItem>
                <p>
                  Wealth can mean different things to different people. For some, it is the freedom to pursue their dreams. For others, it is the security of knowing their family is protected.
                </p>
              </FadeInStaggerItem>
              <FadeInStaggerItem>
                <p>
                  It may be funding a child's education, enjoying a comfortable retirement, growing a business, purchasing a home, or simply having the confidence to face the future.
                </p>
              </FadeInStaggerItem>
              <FadeInStaggerItem>
                <p className="font-semibold text-white">
                  At Wealthy Step, we believe financial well-being begins with clarity, discipline and informed investment decisions.
                </p>
              </FadeInStaggerItem>
              <FadeInStaggerItem>
                <p>
                  That is why we focus on helping you build an investment approach with purpose, protection, and long-term direction.
                </p>
              </FadeInStaggerItem>
            </FadeInStagger>

            {/* CTA Section */}
            <FadeIn direction="up" delay={0.4}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-heading">
                  Let's Build Your Financial Tomorrow, Today
                </h3>
                <p className="text-cream/80 text-[15px] md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
                  Your financial journey deserves more than random decisions and disconnected products. It deserves a clear approach, thoughtful support, and a long-term perspective. Take your next step — the Wealthy way.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-8 py-4 text-[15px] font-bold transition-all shadow-xl hover:shadow-2xl hover:shadow-lime/20 group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
