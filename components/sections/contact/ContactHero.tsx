"use client";

import React from "react";
import Image from "next/image";
import { User, Shield, Target, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function ContactHero() {
  return (
    <section className="relative bg-[#0F172A] pt-4 md:pt-8 pb-20 md:pb-28 overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            <FadeIn direction="up">
              <h3 className="text-lime font-bold tracking-widest text-sm uppercase mb-4">GET IN TOUCH</h3>
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold font-heading leading-tight mb-6">
                Let's Start Your <br />
                <span className="text-lime">Financial Journey</span> <br />
                Together
              </h1>
              
              <p className="text-white/80 text-lg mb-10 max-w-lg leading-relaxed">
                Have questions about investments, insurance, financial planning, or NRI services? Our team is here to guide you.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-lime flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-lime" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Expert Guidance</h4>
                  <p className="text-xs text-white/60 leading-tight">From experienced<br/>professionals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-lime flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-lime" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Personalized Support</h4>
                  <p className="text-xs text-white/60 leading-tight">Solutions tailored to<br/>your goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-lime flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-lime" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Secure & Confidential</h4>
                  <p className="text-xs text-white/60 leading-tight">Your privacy is our<br/>priority</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <button 
                onClick={() => {
                  const form = document.getElementById('contact-form-section');
                  if(form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-lime hover:bg-cta-green text-navy font-bold rounded-full px-8 py-4 transition-colors"
              >
                Send Us a Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </FadeIn>
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full flex items-center justify-end">
            <FadeIn direction="left" delay={0.3} className="w-full h-full relative">
              <div className="absolute right-0 top-0 w-full max-w-[500px] h-full">
                <div className="w-full h-full relative p-2">
                  <div className="absolute inset-0 border-2 border-lime rounded-br-[150px] rounded-tl-[150px] rounded-tr-[40px] rounded-bl-[40px] translate-x-4 translate-y-4" />
                  <div className="w-full h-full relative overflow-hidden rounded-br-[150px] rounded-tl-[150px] rounded-tr-[40px] rounded-bl-[40px] bg-white z-10">
                    <Image 
                      src="/images/contact-people.jpg"
                      alt="Financial Advisors"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
