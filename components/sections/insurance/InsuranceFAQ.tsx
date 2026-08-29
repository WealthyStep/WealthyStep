import React from 'react';
import { FAQSection, FAQItem } from '@/components/sections/FAQSection';

const insuranceFaqs: FAQItem[] = [
  {
    question: "What is group health insurance?",
    answer: "Group health insurance is designed to provide medical coverage options for a specific group of people, typically employees of a company or members of an organization, helping them manage healthcare costs."
  },
  {
    question: "What is group term life insurance?",
    answer: "Group term life insurance provides life coverage to a group of individuals under a single contract, often offered by employers as an employee benefit."
  },
  {
    question: "Can businesses provide insurance benefits to employees?",
    answer: "Yes, businesses and organizations can explore various corporate insurance solutions to offer health, life, and other support benefits to their workforce."
  },
  {
    question: "Who can explore corporate and group insurance solutions?",
    answer: "Any registered business, organization, or formal employee group can connect with our team to understand and explore group insurance options tailored to their size and needs."
  },
  {
    question: "How can my organization get in touch with Wealthy Step?",
    answer: "You can reach out to us via our contact form, chatbot, or phone. Our team will assist you in exploring suitable insurance coverage options for your organization."
  }
];

export function InsuranceFAQ() {
  return (
    <FAQSection
      title="Frequently Asked Questions"
      description="Find answers to common questions about our corporate and group insurance solutions."
      faqs={insuranceFaqs}
    />
  );
}
