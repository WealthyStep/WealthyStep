import React from 'react';
import { Stethoscope, PenTool, Monitor, Calculator, Scale, CheckCircle2, ShieldAlert, ShieldCheck, PlusCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const professions = [
  { name: "Medical Practitioner", icon: Stethoscope },
  { name: "Interior Designer", icon: PenTool },
  { name: "IT Consultant", icon: Monitor },
  { name: "Accountant", icon: Calculator },
  { name: "Lawyer", icon: Scale },
];

export function ProfessionalShieldPolicy() {
  return (
    <section id="professional-shield-policy" className="pt-0 pb-4 md:pt-0 md:pb-6 bg-white relative scroll-mt-24 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F8FAF5] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
          <FadeIn direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading">
                PROFESSIONAL SHIELD POLICY
              </span>
              <div className="w-12 h-px bg-lime relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-navy font-heading tracking-tight mb-4">
              Why Professional Shield?
            </h2>
            <p className="text-text-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Professional Shield provides financial protection and helps avoid financial distress. It covers legal costs, defense expenses, and any awarded damages due to professional negligence.
            </p>
          </FadeIn>
        </div>

        {/* Who All Are Covered - Prominent Full Width Grid */}
        <div className="mb-6 lg:mb-8">
          <FadeIn direction="up" delay={0.1}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-navy font-heading">
                Who All Are Covered?
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 justify-center">
              {professions.map((prof, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-[16px] p-3 shadow-[0_4px_15px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)] border border-gray-100 hover:border-lime/30 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center group ${idx === 3 || idx === 4 ? 'col-span-1 md:col-span-1' : ''} ${idx === 4 ? 'col-start-1 col-end-3 md:col-auto w-1/2 md:w-full mx-auto md:mx-0' : ''}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full bg-white border-2 border-lime/30 group-hover:border-lime group-hover:bg-lime/10 flex items-center justify-center mb-2 transition-all duration-300 animate-float shadow-[0_2px_10px_rgb(0,0,0,0.05)] group-hover:shadow-[0_4px_15px_rgb(0,0,0,0.1)]"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    <prof.icon className="w-4 h-4 text-lime transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" strokeWidth={2} />
                  </div>
                  <span className="font-bold text-navy text-[11px] md:text-xs leading-tight">
                    {prof.name}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Policy Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Why Choose? */}
          <FadeIn direction="up" delay={0.2} className="h-full">
            <div className="bg-[#F8FAF5] rounded-[20px] p-6 lg:p-8 border border-border-sage/30 h-full hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center animate-float">
                  <CheckCircle2 className="w-5 h-5 text-lime" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy font-heading">
                  Why Choose?
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">India ranks among top emerging markets for PI insurance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Growing awareness on importance of Professional Indemnity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Last fiscal year, India witnessed 18% growth in premium collection.</span>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Professional Negligence */}
          <FadeIn direction="up" delay={0.3} className="h-full">
            <div className="bg-[#F8FAF5] rounded-[20px] p-6 lg:p-8 border border-border-sage/30 h-full hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center animate-float"
                  style={{ animationDelay: '0.2s' }}
                >
                  <ShieldAlert className="w-5 h-5 text-lime" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy font-heading">
                  What is Professional Negligence?
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bg-white p-2.5 rounded-[10px] shadow-sm border border-gray-50">
                  <div className="w-5 h-5 rounded-full bg-lime/10 text-lime font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <span className="text-navy font-semibold text-[14px] sm:text-[15px] leading-relaxed">Breach of Contract</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-2.5 rounded-[10px] shadow-sm border border-gray-50">
                  <div className="w-5 h-5 rounded-full bg-lime/10 text-lime font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <span className="text-navy font-semibold text-[14px] sm:text-[15px] leading-relaxed">Misrepresentation</span>
                </li>
                <li className="flex items-start gap-3 bg-white p-2.5 rounded-[10px] shadow-sm border border-gray-50">
                  <div className="w-5 h-5 rounded-full bg-lime/10 text-lime font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <span className="text-navy font-semibold text-[14px] sm:text-[15px] leading-relaxed">Professional Misconduct</span>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Coverage */}
          <FadeIn direction="up" delay={0.4} className="h-full">
            <div className="bg-[#F8FAF5] rounded-[20px] p-6 lg:p-8 border border-border-sage/30 h-full hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center animate-float"
                  style={{ animationDelay: '0.4s' }}
                >
                  <ShieldCheck className="w-5 h-5 text-lime" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy font-heading">
                  What Does Policy Cover?
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Professional Liability including damages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Defence costs for claims against breach of duty.</span>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Extensions */}
          <FadeIn direction="up" delay={0.5} className="h-full">
            <div className="bg-[#F8FAF5] rounded-[20px] p-6 lg:p-8 border border-border-sage/30 h-full hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center animate-float"
                  style={{ animationDelay: '0.6s' }}
                >
                  <PlusCircle className="w-5 h-5 text-lime" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy font-heading">
                  Extensions of Policy
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Court Attendance with no retention.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Extended Reporting Period of 90 days.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0 mt-2" />
                  <span className="text-text-body text-[14px] sm:text-[15px] leading-relaxed">Cost of replacement of lost documents.</span>
                </li>
              </ul>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
