import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, PhoneCall, ShieldCheck } from "lucide-react";

interface ServiceCtaProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  disclaimer?: string;
}

export function ServiceCta({
  title = "Ready to Explore Your Options?",
  description = "Get in touch with our team in Hyderabad to understand available options and distribution services.",
  primaryText = "Contact Us",
  primaryHref = "/contact",
  secondaryText = "Book a Consultation Call",
  secondaryHref = "https://calendly.com/wealthystep-info/30min",
  disclaimer = "Wealthy Step is an AMFI Registered Mutual Fund Distributor (ARN-322891). We facilitate product distribution and do not charge fees for consultation.",
}: ServiceCtaProps) {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-navy text-white relative overflow-hidden">
      {/* Decorative subtle rings */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-white/5 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-lime/10 pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto max-w-[960px] px-4 text-center relative z-10">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-lime text-xs font-bold mb-3 backdrop-blur-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent &amp; Registered Distributor</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading leading-tight mb-3 text-white">
          {title}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-lime hover:bg-cta-green text-navy text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{primaryText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={secondaryHref}
            target={secondaryHref.startsWith("http") ? "_blank" : undefined}
            rel={secondaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-4 h-4 text-lime" />
            <span>{secondaryText}</span>
          </Link>
        </div>

        {disclaimer && (
          <p className="text-[10px] text-gray-400 max-w-2xl mx-auto leading-relaxed pt-4 border-t border-white/10">
            {disclaimer}
          </p>
        )}

      </div>
    </section>
  );
}

