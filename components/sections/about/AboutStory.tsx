"use client";

import React from "react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { Heart } from "lucide-react";

export function AboutStory() {
  return (
    <section className="bg-white pt-8 pb-4 md:pt-14 md:pb-4 relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F8FAF5] rounded-l-[100px] -z-10 hidden lg:block"></div>
      
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Text Content */}
          <FadeIn direction="right">
            <div className="space-y-6 pr-0 lg:pr-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-lime" />
                  <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                    Our Story
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy leading-[1.2] font-heading">
                  Financial success is not only about generating returns.
                </h2>
              </div>
              
              <div className="space-y-5 text-text-body leading-relaxed text-[15px] md:text-base">
                <p>
                  It is about creating clarity, protecting what matters most, achieving meaningful goals, and building a secure legacy for the future.
                </p>
                <p>
                  Founded by a financial professional certified as a <strong>QPFP (Qualified Personal Finance Professional)</strong> and an <strong>AMFI Registered Mutual Fund Distributor</strong>, Wealthy Step provides a thoughtful and holistic approach to mutual fund investing.
                </p>
                <p>
                  We specialize in mutual fund distribution support, helping individuals and families navigate every stage of their financial journey with greater clarity, confidence, and purpose.
                </p>
                <p>
                  From protecting your family and exploring growth potential to saving for retirement, we help bring every important financial decision together under one clear approach.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-lg font-bold text-navy italic">
                  Invest with purpose. Protect with confidence. Prosper with clarity.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Right: Image */}
          <FadeIn direction="left" delay={0.2}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-[500px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl z-10">
                <Image 
                  src="/images/contact-people.jpg" 
                  alt="Wealthy Step Team Member" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Offset decorative border */}
              <div className="absolute -inset-4 border-2 border-lime/30 rounded-3xl -z-10 translate-x-4 translate-y-4"></div>
              
              {/* Floating stat card */}
              <div className="absolute bottom-10 -left-8 md:-left-12 bg-white p-6 rounded-2xl shadow-xl z-20 w-48 border border-gray-100 hidden sm:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-3 h-3 rounded-full bg-lime" />
                  <Heart className="w-8 h-8 text-navy" />
                </div>
                <div className="text-sm text-text-body font-medium">Client-Centric<br/>Approach</div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
