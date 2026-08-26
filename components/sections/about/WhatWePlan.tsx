"use client";

import React from "react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import { Target, TrendingUp, ShieldCheck, Map, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    title: "Goal-Based Investment Support",
    desc: "Explore mutual fund solutions based on your income, responsibilities, aspirations, and long-term goals.",
    icon: Target,
    link: "/goal-calculators"
  },
  {
    title: "Mutual Fund Distribution",
    desc: "Explore mutual fund solutions aligned with your financial goals, investment horizon, and risk profile.",
    icon: TrendingUp,
    link: "/investments"
  },
  {
    title: "Insurance Solutions",
    desc: "Explore the right protection across important areas, including Health, Life, Motor, Travel, NRI, and Business Insurance.",
    icon: ShieldCheck,
    link: "/insurance"
  },
  {
    title: "Goal-Based Roadmaps",
    desc: "Explore mutual fund solutions for important life goals such as Child's Education, Retirement, and Major Milestones.",
    icon: Map,
    link: "/goal-calculators"
  },
  {
    title: "Investment Portfolio Tracking",
    desc: "Stay informed about your financial progress through structured tracking and periodic portfolio updates.",
    icon: BarChart3,
    link: "/contact"
  }
];

export function WhatWePlan() {
  return (
    <section className="bg-gray-50 pt-6 pb-8 md:pt-8 md:pb-10">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 md:mb-6">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-2 font-heading">
              What We Help You Achieve
            </h2>
            <p className="text-base text-text-body leading-relaxed">
              Your financial life is made up of many important decisions. Our approach brings them together into a structured, goal-focused financial journey.
            </p>
          </FadeIn>
        </div>

        {/* 5-Card Grid (Asymmetrical) */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <FadeInStaggerItem 
              key={i} 
              className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col ${
                i === 3 ? "lg:col-span-2 lg:flex-row lg:items-center lg:gap-5" : ""
              } ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-[#F4F7F1] flex items-center justify-center shrink-0 mb-3 group-hover:bg-lime group-hover:text-white transition-colors text-lime ${
                i === 3 ? "lg:mb-0 lg:w-12 lg:h-12" : ""
              }`}>
                <plan.icon className={i === 3 ? "w-5 h-5 lg:w-6 lg:h-6" : "w-4 h-4"} strokeWidth={1.5} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-navy mb-1.5 font-heading group-hover:text-lime transition-colors">
                  {plan.title}
                </h3>
                <p className="text-text-body text-xs leading-relaxed mb-3">
                  {plan.desc}
                </p>
                <div className="mt-auto">
                  <Link href={plan.link} className="inline-flex items-center text-xs font-bold text-navy hover:text-lime transition-colors">
                    Learn More <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

      </div>
    </section>
  );
}
