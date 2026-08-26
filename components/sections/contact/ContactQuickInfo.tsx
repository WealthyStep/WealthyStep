
import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function ContactQuickInfo() {
  return (
    <section className="relative z-30 -mt-16 sm:-mt-12">
      <div className="container mx-auto max-w-[1100px] px-4 xl:px-0">
        <FadeIn direction="up">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 md:gap-4 border border-gray-100">

            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-lime" />
              </div>
              <div>
                <h4 className="text-navy font-bold text-sm mb-1">Call Us</h4>
                <p className="text-xs text-text-body">+91 9000929666</p>
                <p className="text-[10px] text-text-body/70 mt-0.5">Mon - Fri: 9:30 AM - 6:30 PM</p>
              </div>
            </div>

            <div className="hidden md:block w-[1px] bg-gray-200" />

            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-lime" />
              </div>
              <div>
                <h4 className="text-navy font-bold text-sm mb-1">Email Us</h4>
                <p className="text-xs text-text-body">info@wealthystep.com</p>
                <p className="text-[10px] text-text-body/70 mt-0.5">We'll reply within 24 hours</p>
              </div>
            </div>

            <div className="hidden md:block w-[1px] bg-gray-200" />

            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-lime" />
              </div>
              <div>
                <h4 className="text-navy font-bold text-sm mb-1">Visit Us</h4>
                <p className="text-xs text-text-body">Pranava Business Park,</p>
                <p className="text-[10px] text-text-body/70 mt-0.5">Kondapur, Hyderabad</p>
              </div>
            </div>

            <div className="hidden md:block w-[1px] bg-gray-200" />

            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-lime" />
              </div>
              <div>
                <h4 className="text-navy font-bold text-sm mb-1">Working Hours</h4>
                <p className="text-xs text-text-body">Mon - Fri: 9:30 AM - 6:30 PM</p>
                <p className="text-[10px] text-text-body/70 mt-0.5">Sat: 10:00 AM - 2:00 PM</p>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
