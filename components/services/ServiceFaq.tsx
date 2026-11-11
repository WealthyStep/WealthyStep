"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceFaqProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
}

export function ServiceFaq({
  title = "Frequently Asked Questions",
  subtitle = "Clear, straightforward information to help you understand this service.",
  faqs,
}: ServiceFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="pt-4 sm:pt-5 pb-5 sm:pb-6 bg-[#FAFAFA] border-b border-gray-100">
      <div className="container mx-auto max-w-[960px] px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-gray-200 text-navy text-xs font-bold mb-1 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-lime" />
            <span>Questions &amp; Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy font-heading mb-1">
            {title}
          </h2>
          <p className="text-text-body text-xs sm:text-sm">
            {subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-navy hover:text-navy/80 cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-navy" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-text-body leading-relaxed border-t border-gray-100">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

