import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, PhoneCall, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative bg-[#180D45] pt-8 pb-12 md:pt-12 md:pb-20 overflow-hidden border-t border-white/10 z-10">
      
      {/* ── Background Glow ── */}
      <div className="absolute top-0 right-0 w-full md:w-3/4 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-purple/40 via-[#0A0520]/0 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-purple/20 to-transparent pointer-events-none" />

      {/* Right Image as background */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[55%] pointer-events-none z-0">
        <Image 
          src="/images/cta-illustration.jpg" 
          alt="CTA Background" 
          fill
          priority
          className="object-cover object-left md:object-center [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%),linear-gradient(to_right,transparent_0%,black_20%,black_100%)] [mask-composite:intersect]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Content Area */}
          <div className="w-full lg:w-1/2 pt-10">
            <FadeIn direction="up">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-lime/60" />
                <span className="text-lime text-xs font-bold tracking-[0.2em] uppercase">
                  Take the Next Step
                </span>
                <div className="w-8 h-px bg-lime/60" />
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-[1.1] mb-6">
                Build a Stronger<br />
                <span className="text-lime">Financial Future</span> with Us.
              </h2>

              {/* Subtitle */}
              <p className="text-cream/80 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
                Get support for your stated goals and start your journey towards long-term investing.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-lime hover:bg-cta-green text-navy px-8 py-4 text-base font-bold transition-all shadow-lg shadow-lime/20 hover:shadow-lime/40 group"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/30 text-white hover:bg-white hover:text-navy px-8 py-4 text-base font-bold transition-all"
                >
                  <PhoneCall className="mr-2 h-5 w-5 opacity-80" /> Call Us Now
                </Link>
              </div>

              {/* Trust Markers */}
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-cream/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime" />
                  Zero Spam
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime" />
                  Dedicated Support
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime" />
                  Goal-Focused Support
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Image Area (Empty spacing for the absolute image) */}
          <div className="hidden lg:block lg:w-[45%]" />

        </div>
      </div>
    </section>
  );
}
