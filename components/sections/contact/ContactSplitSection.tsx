"use client";

import React, { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { MapPin, Phone, Mail, Clock, Lock } from "lucide-react";

export function ContactSplitSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="bg-white pt-8 pb-16 md:pt-12 md:pb-20 relative z-10" id="contact-form-section">
      <div className="container mx-auto max-w-[1100px] px-4 xl:px-0">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="bg-[#0F172A] rounded-[24px] p-8 md:p-10 shadow-xl">
            <h2 className="text-white text-2xl font-bold font-heading mb-2">Send Us A Message</h2>
            <p className="text-white/70 text-sm mb-8">
              Tell us how we can help, and our team will get back to you shortly.
            </p>

            {isSuccess ? (
              <div className="bg-lime/10 text-lime p-6 rounded-xl border border-lime/20 text-center">
                <p className="font-bold mb-2">Message Sent Successfully!</p>
                <p className="text-sm">We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm"
                  />
                </div>

                <div>
                  <select 
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-white/40 focus:outline-none focus:border-lime transition-colors text-sm appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>What can we help you with?</option>
                    <option value="investment">Investments</option>
                    <option value="insurance">Insurance</option>
                    <option value="nri">NRI Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    required
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Lock className="w-3 h-3 text-lime" />
                  Your information is secure and confidential.
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-lime hover:bg-cta-green text-navy font-bold rounded-lg px-4 py-4 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Information */}
          <div className="lg:pl-8 py-4">
            <h2 className="text-navy text-2xl font-bold font-heading mb-2">Contact Information</h2>
            <p className="text-text-body text-sm mb-10">
              Reach out to us through any of the following channels.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0 border border-lime/20">
                  <MapPin className="w-6 h-6 text-lime" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">Office Address</h4>
                  <p className="text-xs text-text-body leading-relaxed">
                    Wealthy Step<br />
                    Pranava Business Part, 7th Floor, Kondapur,<br />
                    Hyderabad, Telangana 500081<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0 border border-lime/20">
                  <Phone className="w-6 h-6 text-lime" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">Phone</h4>
                  <p className="text-xs text-text-body leading-relaxed">
                    +91 9000929666
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0 border border-lime/20">
                  <Mail className="w-6 h-6 text-lime" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">Email</h4>
                  <p className="text-xs text-text-body leading-relaxed">
                    info@wealthystep.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0 border border-lime/20">
                  <Clock className="w-6 h-6 text-lime" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">Working Hours</h4>
                  <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-xs text-text-body">
                    <span>Monday - Friday</span><span>9:30 AM - 6:30 PM</span>
                    <span>Saturday</span><span>10:00 AM - 2:00 PM</span>
                    <span>Sunday</span><span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
