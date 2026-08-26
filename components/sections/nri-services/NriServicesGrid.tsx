"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Globe2, FileText, Landmark, HandCoins, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "NRE / NRO Account Support",
    description: "Information and coordination support regarding applicable NRI investment requirements.",
    icon: Landmark,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Repatriation Support",
    description: "Coordination support with appropriately qualified professionals for repatriating funds back to your country of residence, where applicable.",
    icon: HandCoins,
    color: "bg-lime/10 text-lime",
  },
  {
    title: "Indian Taxation Support",
    description: "Assistance in connecting with appropriately qualified professionals to help navigate Indian taxation, where applicable.",
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "NRI Mutual Fund Investment Support",
    description: "Coordination support with appropriately qualified professionals, where applicable.",
    icon: Globe2,
    color: "bg-orange-50 text-orange-600",
  },
];

export function NriServicesGrid() {
  return (
    <section className="section-white pt-8 pb-4 md:pt-10 md:pb-6 relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-navy font-heading leading-tight mb-6">
              Invest in India's Growth Story, <br className="hidden sm:block" />
              <span className="text-lime">Stress-Free.</span>
            </h2>
            <p className="text-base md:text-lg text-text-body leading-relaxed">
              As a Non-Resident Indian, investing back home comes with its unique set of regulatory and tax challenges. Wealthy Step provides a unified solution for NRIs—from long-term investing to coordinating with appropriately qualified professionals where applicable.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeIn key={index} direction="up" delay={index * 0.1}>
                <div className="group h-full bg-white rounded-[20px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                  
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="relative z-10 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 shadow-sm`}>
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2 font-heading group-hover:text-lime transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-text-body leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 mt-auto pt-4 border-t border-gray-100">
                    <Link href="/contact" className="inline-flex items-center text-sm font-bold text-navy hover:text-lime transition-colors group/link">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
