import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export function CorporateInsuranceCTA() {
  return (
    <section className="pb-8 md:pb-12 bg-white relative">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="bg-navy rounded-[24px] p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white font-heading mb-4">
                Looking for Insurance Support for Your Organization?
              </h3>
              <p className="text-white/80 mb-8 leading-relaxed text-sm md:text-base">
                Connect with our team to discuss your organization's insurance requirements and explore suitable coverage options.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-8 py-3.5 text-[15px] font-bold transition-all shadow-md group"
                >
                  Talk to Our Team
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact?service=Corporate+%26+Group+Insurance"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 text-[15px] font-bold transition-all border border-white/20"
                >
                  Send an Enquiry
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
