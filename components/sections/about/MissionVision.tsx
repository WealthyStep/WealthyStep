"use client";

import React from "react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";

export function MissionVision() {
  return (
    <section className="bg-[#F8FAF5] pt-8 pb-8 md:pt-10 md:pb-10">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Mission */}
          <FadeIn direction="up">
            <div className="relative rounded-3xl overflow-hidden group h-full">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src="/images/goal-2.jpg" 
                  alt="Our Mission" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-navy/90 group-hover:bg-navy/85 transition-colors z-10"></div>
              
              <div className="relative z-20 p-10 md:p-14 flex flex-col h-full justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-lime" />
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                    Our Mission
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight font-heading">
                  Bridging the Gap Between People and Financial Success
                </h3>
                
                <div className="space-y-4 text-cream/80 text-sm md:text-base leading-relaxed">
                  <p>
                    Our mission is to help individuals and families across India explore mutual fund solutions for their long-term goals.
                  </p>
                  <p>
                    We aim to provide thoughtful support, reliable mutual fund solutions, and goal-oriented guidance that help people make informed decisions at every stage of life.
                  </p>
                  <p>
                    We believe investing in mutual funds should not feel complicated or inaccessible. Our goal is simple: to make quality mutual fund investment support more understandable, accessible, and meaningful for every individual.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Vision */}
          <FadeIn direction="up" delay={0.2}>
            <div className="relative rounded-3xl overflow-hidden group h-full">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src="/images/nri-hero.jpg" 
                  alt="Our Vision" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-lime/90 group-hover:bg-lime/85 transition-colors z-10"></div>
              
              <div className="relative z-20 p-10 md:p-14 flex flex-col h-full justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-navy" />
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-navy font-heading">
                    Our Vision
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-navy mb-6 leading-tight font-heading">
                  Towards a Financially Secure and Financially Aware India
                </h3>
                
                <div className="space-y-4 text-navy/80 text-sm md:text-base leading-relaxed font-medium">
                  <p>
                    We envision an India where more individuals and families have the knowledge, confidence, and support needed to make better financial decisions.
                  </p>
                  <p>
                    Our vision is to create a future where financial dreams are supported by thoughtful goal-setting rather than uncertainty.
                  </p>
                  <p>
                    Through education, investor support, and disciplined investing, we aim to help people build stronger financial foundations.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
