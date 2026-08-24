import { InnerHero } from "@/components/sections/InnerHero";
import { InfoCard } from "@/components/cards/InfoCard";
import { Globe2, FileText, Landmark, HandCoins } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NRI Services | Wealthy Step",
  description: "Specialized wealth management and taxation services for Non-Resident Indians.",
};

const nriFeatures = [
  {
    title: "NRE / NRO Account Support",
    description: "End-to-end assistance in opening and managing your NRE/NRO accounts for seamless inward and outward remittances.",
    icon: Landmark,
  },
  {
    title: "Repatriation of Funds",
    description: "Expert guidance on 15CA/15CB documentation and RBI compliance for repatriating funds back to your country of residence.",
    icon: HandCoins,
  },
  {
    title: "Indian Taxation (DTAA)",
    description: "Leverage Double Taxation Avoidance Agreements (DTAA) to optimize your tax liabilities across jurisdictions.",
    icon: FileText,
  },
  {
    title: "Dedicated NRI Portfolio",
    description: "Customized investment strategies in Indian Equities and Mutual Funds specifically designed around NRI regulations.",
    icon: Globe2,
  },
];

export default function NriServicesPage() {
  return (
    <>
      <InnerHero
        title="NRI Financial Services"
        subtitle="Global Indians"
        description="Navigating Indian investments, taxation, and compliance from miles away made effortless."
        icon={Globe2}
        bgImage="/3.jpg"
      />

      <section className="section-white py-16 md:py-24">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-text-dark">
                Invest in India's Growth Story, Stress-Free.
              </h2>
              <p className="text-text-body leading-relaxed">
                As a Non-Resident Indian, investing back home comes with its unique set of regulatory and tax challenges. Wealthy Step provides a unified solution for NRIs—from wealth creation to tax filing.
              </p>
              <p className="text-text-body leading-relaxed">
                Whether you need help managing inherited property, understanding FEMA regulations, or building a high-growth mutual fund portfolio, our dedicated NRI desk handles the complexities so you don't have to.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {nriFeatures.map((feature, index) => (
                <InfoCard key={index} {...feature} />
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
