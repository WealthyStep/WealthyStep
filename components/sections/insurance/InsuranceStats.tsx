"use client";

import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Users, FileCheck2, Award, HeadsetIcon } from "lucide-react";

const stats = [
  {
    value: "5000+",
    label: "Families Protected",
    icon: Users
  },
  {
    value: "98%",
    label: "Claim Assistance Success",
    icon: FileCheck2
  },
  {
    value: "10+",
    label: "Trusted Insurance Partners",
    icon: Award
  },
  {
    value: "24/7",
    label: "Claim Support Assistance",
    icon: HeadsetIcon
  }
];

export function InsuranceStats() {
  return (
    <section className="bg-[#FAFAFA] pt-2 pb-4">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header (added to match the flow) */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-heading leading-tight">
              Insurance That Makes a Difference
            </h2>
          </FadeIn>
        </div>

        <FadeIn direction="up" delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-x-0 lg:divide-x divide-gray-200">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 px-4 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full border border-lime flex items-center justify-center shrink-0 bg-white">
                  <stat.icon className="w-5 h-5 text-lime" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-navy font-heading mb-0.5">{stat.value}</div>
                  <div className="text-[11px] font-bold text-text-body">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
