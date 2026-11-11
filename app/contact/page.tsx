import { Metadata } from "next";
import { ContactSimpleView } from "@/components/sections/contact/ContactSimpleView";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata: Metadata = constructMetadata(ROUTES_SEO.contact);

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* ── Contact Hero Banner ── */}
      <section className="bg-[#180D45] text-white pt-10 pb-8 sm:pt-14 sm:pb-10 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto max-w-[800px] relative z-10">
          <span className="text-xs font-bold text-lime uppercase tracking-widest block mb-2 font-heading">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight mb-3">
            Contact <span className="text-lime">Wealthy Step</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Have questions about mutual fund distribution, insurance options, or NRI investment facilitation? Our team in Hyderabad is here to assist you.
          </p>
        </div>
      </section>

      {/* ── Simple 2-Column Contact View ── */}
      <ContactSimpleView />
    </div>
  );
}
