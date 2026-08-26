import { Metadata } from "next";
import { NriHero } from "@/components/sections/nri-services/NriHero";
import { NriServicesGrid } from "@/components/sections/nri-services/NriServicesGrid";
import { NriProcess } from "@/components/sections/nri-services/NriProcess";
import { NriCTA } from "@/components/sections/nri-services/NriCTA";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "NRI Mutual Fund Investment Support | Wealthy Step",
  description: "Dedicated mutual fund distribution and coordination support for Non-Resident Indians navigating Indian investments.",
  alternates: {
    canonical: '/nri-services'
  },
  openGraph: {
    title: "NRI Mutual Fund Investment Support | Wealthy Step",
    description: "Dedicated mutual fund distribution and coordination support for Non-Resident Indians navigating Indian investments.",
    url: '/nri-services',
    type: "website",
  },
};

export default function NriServicesPage() {
  return (
    <>
      <NriHero />
      <NriServicesGrid />
      <NriProcess />
      
      <FAQSection 
        title="NRI Investment FAQs" 
        description="Common questions about mutual fund investments for Non-Resident Indians."
        faqs={[
          {
            question: "Can NRIs invest in Indian Mutual Funds?",
            answer: "Yes, Non-Resident Indians (NRIs) can invest in Indian mutual funds on a repatriable or non-repatriable basis. However, investors based in the USA or Canada may face specific restrictions depending on the Asset Management Company (AMC) due to FATCA regulations."
          },
          {
            question: "Do I need an NRE or NRO account?",
            answer: "To invest in Indian mutual funds, you require an NRE (Non-Resident External) or NRO (Non-Resident Ordinary) bank account. An NRE account allows for full repatriation of the investment corpus and gains, whereas an NRO account has specific repatriation limits as per RBI guidelines."
          },
          {
            question: "Is KYC mandatory for NRI mutual fund investments?",
            answer: "Yes, completing your Know Your Customer (KYC) process is mandatory. This typically requires copies of your passport, overseas address proof, PAN card, and a recent photograph. We assist our clients in coordinating the necessary documentation."
          }
        ]}
      />
      <NriCTA />
    </>
  );
}
