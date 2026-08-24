import { InnerHero } from "@/components/sections/InnerHero";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ShieldCheck, HeartPulse, ShieldAlert, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Solutions | Wealthy Step",
  description: "Comprehensive life and health insurance solutions tailored to protect what matters most.",
};

const insuranceServices = [
  {
    title: "Life Insurance",
    description: "Secure your family's future with term plans, whole life policies, and comprehensive coverage options tailored to your life stage.",
    icon: ShieldCheck,
    href: "/contact",
  },
  {
    title: "Health Insurance",
    description: "Protect yourself against rising medical costs with plans covering hospitalization, critical illness, and family floaters.",
    icon: HeartPulse,
    href: "/contact",
  },
  {
    title: "Critical Illness Cover",
    description: "Lump sum payout upon diagnosis of major illnesses to cover expensive treatments without liquidating your investments.",
    icon: ShieldAlert,
    href: "/contact",
  },
  {
    title: "Group Insurance",
    description: "Comprehensive medical and life coverage solutions for corporate teams and organizations.",
    icon: Users,
    href: "/contact",
  },
];

export default function InsurancePage() {
  return (
    <>
      <InnerHero
        title="Insurance Solutions"
        subtitle="Protect Your Wealth"
        description="Safeguard your family's future and your peace of mind with our comprehensive, expertly chosen insurance plans."
        icon={ShieldCheck}
        bgImage="/4.jpg"
      />

      <section className="section-white py-16 md:py-24">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark">Our Protection Plans</h2>
            <p className="text-text-body mt-4 max-w-2xl mx-auto">
              We don't just sell policies; we analyze your risks and recommend adequate cover so you never have to worry about the unexpected.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {insuranceServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
