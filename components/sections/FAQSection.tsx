'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  description: string;
  faqs: FAQItem[];
}

export function FAQSection({ title, description, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schemaList = faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": schemaList
  };

  return (
    <section className="pt-16 md:pt-24 pb-0 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-accent-purple/5 rounded-full blur-[120px]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto max-w-4xl px-4 xl:px-0 relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-lime font-heading mb-4 block">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading leading-tight mb-4 text-navy">
              {title}
            </h2>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={index} delay={index * 0.1}>
                <div 
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-lime/50 shadow-lg shadow-lime/5' 
                      : 'border-gray-200 hover:border-lime/30 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 md:py-6 flex items-start md:items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <div className={`mt-0.5 md:mt-0 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isOpen ? 'bg-lime/20 text-navy' : 'bg-gray-100 text-gray-400 group-hover:bg-lime/10 group-hover:text-lime'
                      }`}>
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className={`font-bold text-base md:text-lg transition-colors duration-300 font-heading leading-snug ${
                        isOpen ? 'text-navy' : 'text-navy/80 group-hover:text-navy'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-navy text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-lime/10 group-hover:text-lime'
                    }`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0 md:pl-[4.5rem] text-text-body text-[15px] md:text-base leading-relaxed">
                      {faq.answer}
                    </div>
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
