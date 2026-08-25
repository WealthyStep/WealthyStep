"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { ShieldCheck } from "lucide-react";

export function RegulatedTrusted() {
  return (
    <section className="bg-white py-2 md:py-4 border-b border-border-sage/20">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        <FadeIn direction="up">
          <div className="bg-white border border-gray-200 rounded-[16px] p-4 lg:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-[900px] mx-auto">
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-lime" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy font-heading mb-1">Regulated & Trusted</h3>
                <p className="text-[12px] text-text-body max-w-sm leading-relaxed">
                  Wealthy Step is a trusted insurance advisor. We are partnered with IRDAI licensed insurers to bring you the best plans.
                </p>
              </div>
            </div>
            
            <div className="shrink-0 flex items-center gap-6 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              
              {/* Fake HDFC Life Logo */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                  <div className="font-bold text-navy flex items-center text-xl font-heading tracking-tight leading-none">
                    HDFC <br /> Life
                  </div>
                </div>
                <div className="text-[8px] italic text-red-600 mt-1">Sar utha ke jiyo!</div>
              </div>

              {/* Fake SBI Life Logo */}
              <div className="flex flex-col items-center">
                <div className="font-bold text-navy flex items-center text-xl font-heading tracking-tighter leading-none">
                  <span className="text-blue-600 mr-1 text-2xl">O</span>S<span className="text-blue-500">B</span>ILife
                </div>
                <div className="text-[8px] italic text-blue-600 mt-1">Apne liye, Apno ke liye.</div>
              </div>

              {/* Fake MAX Life Logo */}
              <div className="flex flex-col items-center">
                <div className="font-bold text-navy flex items-center text-xl font-heading tracking-tight leading-none">
                  <span className="text-orange-500 mr-1">MAX</span><br/>LIFE
                </div>
                <div className="text-[8px] text-navy mt-0.5">INSURANCE</div>
              </div>

              <div className="text-center px-4 py-2 border border-gray-200 rounded-lg whitespace-nowrap">
                <div className="text-[10px] text-text-body font-bold">and more</div>
                <div className="text-[10px] text-text-body">trusted partners</div>
              </div>

            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
