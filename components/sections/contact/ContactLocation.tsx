
import React from "react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { MapPin, ArrowRight } from "lucide-react";

export function ContactLocation() {
  return (
    <section className="bg-white pb-16 md:pb-20 relative z-10">
      <div className="container mx-auto max-w-[1100px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-[24px] overflow-hidden shadow-sm border border-gray-200">
            
            {/* The Map Background */}
            <div className="absolute inset-0 bg-[#E8F0F2]">
               <Image 
                src="/images/map-light.jpg" 
                alt="Office Location Map"
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-80 mix-blend-multiply"
              />
              {/* Location Pin */}
              <div className="absolute top-1/2 left-[60%] md:left-2/3 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-10 h-10 bg-lime rounded-full rounded-br-none -rotate-45 shadow-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="absolute top-[48px] left-1/2 -translate-x-1/2 text-xs font-bold text-navy whitespace-nowrap bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                    Pranava Group
                  </div>
                </div>
              </div>
            </div>
            
            {/* Left Location Card (Floating) */}
            <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-10 w-[280px] md:w-[320px] bg-white rounded-[20px] p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-lime text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-navy font-heading">Our Location</h3>
              </div>
              <p className="text-sm text-text-body leading-relaxed mb-6">
                Visit our office for a goal-focused discussion with our team.
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-lime text-lime hover:bg-lime hover:text-navy font-bold rounded-full px-5 py-2 transition-colors text-sm w-max"
              >
                Get Directions
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
