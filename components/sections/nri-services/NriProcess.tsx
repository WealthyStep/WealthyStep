
import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { UserCheck, Building2, TrendingUp, Briefcase } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Onboarding & KYC",
    description: "Digital, paperless KYC process designed for NRIs. We assist with the documentation process.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "Account Setup",
    description: "Assistance and coordination for NRE/NRO and mutual fund investment account setups.",
    icon: Building2,
  },
  {
    step: "03",
    title: "Process Overview",
    description: "Mutual fund solutions explored based on your stated goals.",
    icon: Briefcase,
  },
  {
    step: "04",
    title: "Execution & Ongoing Support",
    description: "Periodic investment review discussions and ongoing support.",
    icon: TrendingUp,
  },
];

export function NriProcess() {
  return (
    <section className="bg-gray-50 py-8 md:py-10 relative overflow-hidden">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-heading mb-4">
              Your Journey to Indian Wealth
            </h2>
            <p className="text-text-body text-base md:text-lg">
              We've streamlined the entire process. From initial onboarding to executing your mutual fund investments, we provide comprehensive support.
            </p>
          </FadeIn>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[2px] bg-gray-200">
            <div className="absolute top-0 left-0 h-full bg-lime w-1/3 animate-pulse" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <FadeIn key={index} direction="up" delay={index * 0.15}>
                  <div className="flex flex-col items-center text-center relative group">
                    {/* Icon Circle */}
                    <div className="w-[120px] h-[120px] rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center relative mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                      <div className="absolute -inset-2 rounded-full border border-lime/30 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300" />
                      <Icon className="w-10 h-10 text-navy group-hover:text-lime transition-colors duration-300" strokeWidth={1.5} />
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-lime text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        {step.step}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-navy mb-3 font-heading">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-body leading-relaxed max-w-[250px]">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}
