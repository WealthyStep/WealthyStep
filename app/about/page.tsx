import Image from "next/image";
import { InnerHero } from "@/components/sections/InnerHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Wealthy Step",
  description: "Learn about Wealthy Step's mission to build legacy through mindful steps.",
};

export default function AboutPage() {
  return (
    <>
      <InnerHero
        title="Our Story"
        subtitle="About Wealthy Step"
        description="We believe that building lasting wealth requires patience, strategy, and above all, mindful steps."
        bgImage="/5.jpg"
      />

      <section className="section-white py-16 md:py-24">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Premium Image instead of Collage Placeholder */}
            <div className="relative h-[500px] w-full rounded-2xl bg-cream border border-border-sage/30 flex items-center justify-center overflow-hidden shadow-sm">
              <Image 
                src="/9.jpg" 
                alt="Wealthy Step Team" 
                fill 
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark leading-tight">
                Building a <span className="text-lime">Legacy</span>, One Step at a Time.
              </h2>
              <div className="space-y-4 text-text-body leading-relaxed">
                <p>
                  Wealthy Step was founded on a simple principle: financial freedom isn't about getting rich quick; it's about making consistent, informed decisions over time.
                </p>
                <p>
                  Our team of AMFI-registered mutual fund distributors and certified financial planners bring decades of combined experience to the table. We cut through the noise of financial markets to deliver clear, actionable strategies tailored to your life stage.
                </p>
                <p>
                  Whether you are just starting your career, planning for your child's overseas education, or structuring your retirement corpus, we act as your fiduciary partner—always putting your interests first.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border-sage/30">
                <div>
                  <div className="text-3xl font-bold text-navy mb-1">1000+</div>
                  <div className="text-sm font-semibold text-lime uppercase tracking-wider">Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-navy mb-1">₹500Cr+</div>
                  <div className="text-sm font-semibold text-lime uppercase tracking-wider">AUM</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-navy mb-1">15+</div>
                  <div className="text-sm font-semibold text-lime uppercase tracking-wider">Years Exp</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
