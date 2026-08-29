import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, HeartHandshake, Building2, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const solutions = [
  {
    title: "Group Health\nInsurance",
    desc: "Health insurance solutions designed to provide medical coverage options for eligible employees and members of an organization.",
    icon: Users,
  },
  {
    title: "Group Term\nLife Insurance",
    desc: "Life insurance coverage options designed for employee groups and organizations.",
    icon: ShieldCheck,
  },
  {
    title: "Employee\nBenefits Support",
    desc: "Explore insurance-related benefits that can support employee well-being and workplace benefit programs.",
    icon: HeartHandshake,
  },
  {
    title: "Corporate\nInsurance Support",
    desc: "Support for businesses and organizations in understanding and exploring relevant insurance coverage options.",
    icon: Building2,
  }
];

export function CorporateGroupInsurance() {
  return (
    <section id="corporate-group-insurance" className="pt-2 pb-8 md:pt-4 md:pb-12 bg-[#F8FAF5] relative scroll-mt-24">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                CORPORATE EMPLOYER & EMPLOYEE BENEFITS SOLUTIONS
              </span>
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-text-dark font-heading tracking-tight mb-6">
              Protect Your Team. <br className="hidden sm:block" />
              Support Your Business.
            </h2>
            <p className="text-text-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore insurance solutions designed to help businesses, organizations, and employee groups provide meaningful protection and support.
            </p>
          </FadeIn>
        </div>

        <div className="w-full">
          {/* 4 Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            {solutions.map((item, idx) => (
              <FadeIn key={idx} delay={0.1 * idx} direction="up" className="h-full">
                <div className="bg-white rounded-[20px] p-5 lg:p-6 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border border-border-sage/20 h-full flex flex-col items-start group">
                  <div 
                    className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-lime/20 animate-float"
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <item.icon className="w-6 h-6 text-lime transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-navy font-heading leading-tight whitespace-pre-line mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-body leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA Block */}
          <FadeIn direction="up" delay={0.4}>
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

      </div>
    </section>
  );
}
