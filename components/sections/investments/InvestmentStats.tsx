"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { ArrowRight, Calendar, Users, IndianRupee, Shield } from "lucide-react";

export function InvestmentStats() {
  return (
    <section className="bg-[#FAFAFA] py-6 border-t border-b border-border-sage/20">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x-0 lg:divide-x divide-gray-200">
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <Users className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-3xl font-bold text-navy font-heading">10+</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Years of Experience</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Helping clients achieve their goals</div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <Users className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-3xl font-bold text-navy font-heading">5000+</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Happy Clients</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Trusted by thousands of investors</div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <IndianRupee className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-3xl font-bold text-navy font-heading">₹1000Cr+</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Assets Managed</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Strong track record of wealth creation</div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:px-8">
              <div className="flex items-center gap-4 mb-2">
                <Shield className="w-8 h-8 text-lime shrink-0" strokeWidth={1.5} />
                <div className="text-3xl font-bold text-navy font-heading">100%</div>
              </div>
              <div className="text-sm font-bold text-navy mb-1 ml-0 lg:ml-12">Client Satisfaction</div>
              <div className="text-xs text-text-body ml-0 lg:ml-12">Our commitment to transparency & trust</div>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
