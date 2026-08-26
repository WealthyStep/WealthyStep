
import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { UserPlus, ArrowRight } from "lucide-react";

export function ContactBottomCTA() {
  return (
    <section className="bg-white pb-16 md:pb-20 relative z-10">
      <div className="container mx-auto max-w-[1100px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="bg-[#180D45] rounded-[24px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Background glowing effects */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            {/* Left side */}
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-lime flex items-center justify-center shrink-0">
                <UserPlus className="w-8 h-8 text-lime" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-1">
                  Ready to Take the Next Step?
                </h2>
                <p className="text-sm text-white/70">
                  Schedule a consultation with our experts and start building a stronger financial future.
                </p>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <button className="inline-flex items-center justify-center bg-lime hover:bg-cta-green text-navy font-bold rounded-lg px-6 py-3 transition-colors text-sm">
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="inline-flex items-center justify-center border border-white/20 hover:bg-white/10 text-white font-bold rounded-lg px-6 py-3 transition-colors text-sm">
                Explore Our Services
              </button>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
