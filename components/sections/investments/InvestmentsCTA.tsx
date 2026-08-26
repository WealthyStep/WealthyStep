"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function InvestmentsCTA() {
  return (
    <section className="bg-gray-50/50 pb-12 pt-4">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="bg-[#1C1844] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl max-w-[900px] mx-auto">
            
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading leading-tight mb-2">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="text-white/80 text-sm">
                Let us help you explore investment solutions and support your financial goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-6 py-3 text-sm font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto whitespace-nowrap"
              >
                Get Started Today
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/20 hover:border-white text-white px-6 py-2.5 text-sm font-bold transition-all w-full sm:w-auto whitespace-nowrap group"
              >
                Schedule a Call
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
