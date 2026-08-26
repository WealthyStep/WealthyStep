"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { ArrowRight, Target, Users, Search, ShieldCheck } from "lucide-react";

export function InvestmentStats() {
  return (
    <section className="bg-[#FAFAFA] py-6 border-t border-b border-border-sage/20">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x-0 lg:divide-x divide-gray-200">
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <Target className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-xl md:text-2xl font-bold text-navy font-heading uppercase">Goal-Based</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Investing Approach</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Exploring options aligned with your objectives</div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <Users className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-xl md:text-2xl font-bold text-navy font-heading uppercase">Investor-First</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Dedicated Support</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Built around your financial journey</div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <Search className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-xl md:text-2xl font-bold text-navy font-heading uppercase">Transparent</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Clear Communication</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Transparent distribution processes</div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <ShieldCheck className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-xl md:text-2xl font-bold text-navy font-heading uppercase">Disciplined</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Long-Term Focus</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Encouraging steady investment habits</div>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
