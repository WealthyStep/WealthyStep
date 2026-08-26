
import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { UserCheck, FileSearch, ShieldCheck, ActivitySquare, IndianRupee, ShieldAlert } from "lucide-react";

const reasons = [
  {
    icon: UserCheck,
    title: "Dedicated Support",
    desc: "Insurance options based on your protection needs."
  },
  {
    icon: FileSearch,
    title: "Available Options",
    desc: "Compare and choose from available insurance solutions."
  },
  {
    icon: ShieldCheck,
    title: "Transparent Process",
    desc: "Clear terms, no hidden charges, complete transparency."
  },
  {
    icon: ActivitySquare,
    title: "Easy Claim Support",
    desc: "Assistance and support with the claim process."
  },
  {
    icon: IndianRupee,
    title: "Affordable Premiums",
    desc: "Explore options for suitable coverage based on your budget."
  },
  {
    icon: ShieldAlert,
    title: "Built on Trust",
    desc: "Your trust and security are our top priorities."
  }
];

export function WhyChooseWealthyStep() {
  return (
    <section className="bg-white py-4 md:py-6 border-b border-border-sage/20">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-heading leading-tight mb-2">
              Why Choose Wealthy Step?
            </h2>
            <p className="text-text-body text-sm sm:text-base max-w-lg mx-auto">
              We make insurance simple, transparent and hassle-free for you.
            </p>
          </FadeIn>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mb-4 max-w-[900px] mx-auto">
          {reasons.map((reason, i) => (
            <FadeIn key={reason.title} delay={0.05 * i} direction="up">
              <div className="bg-white rounded-[16px] p-4 lg:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center group">
                <div className="w-10 h-10 rounded-full border border-lime flex items-center justify-center mb-3 group-hover:bg-lime/10 transition-colors group-hover:animate-bounce">
                  <reason.icon className="w-5 h-5 text-lime" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-bold text-navy font-heading mb-1">
                  {reason.title}
                </h3>
                <p className="text-[11px] text-text-body leading-relaxed max-w-[200px] mx-auto">
                  {reason.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
