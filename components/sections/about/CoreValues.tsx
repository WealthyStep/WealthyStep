"use client";

import React from "react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import { Users, Eye, ShieldAlert, Target, HeartHandshake, BookOpen } from "lucide-react";

const values = [
  {
    title: "Client-Centric Guidance",
    desc: "Every recommendation begins with understanding our client's goals, priorities, and long-term interests.",
    icon: Users
  },
  {
    title: "Transparency",
    desc: "We believe financial relationships should be built on clarity, honest communication, and trust.",
    icon: Eye
  },
  {
    title: "Ethical Conduct",
    desc: "Integrity and responsibility guide the way we work and the relationships we build.",
    icon: ShieldAlert
  },
  {
    title: "Goal-Based Planning",
    desc: "We believe investments and financial decisions should have a purpose connected to meaningful life goals.",
    icon: Target
  },
  {
    title: "Long-Term Relationships",
    desc: "We value lasting relationships and remain focused on supporting clients throughout their financial journey.",
    icon: HeartHandshake
  },
  {
    title: "Financial Literacy",
    desc: "We believe informed individuals make stronger financial decisions. Education and awareness are an important part of our approach.",
    icon: BookOpen
  }
];

export function CoreValues() {
  return (
    <section className="bg-white pt-8 pb-8 md:pt-10 md:pb-10 border-t border-gray-100">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-4 font-heading">
              Our Core Values
            </h2>
            <div className="w-20 h-1 bg-lime mx-auto rounded-full"></div>
          </FadeIn>
        </div>

        {/* 6-Card Grid */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((value, i) => (
            <FadeInStaggerItem 
              key={i} 
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-navy group-hover:text-white transition-colors text-navy">
                <value.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-navy mb-2 font-heading">
                {value.title}
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                {value.desc}
              </p>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

      </div>
    </section>
  );
}
