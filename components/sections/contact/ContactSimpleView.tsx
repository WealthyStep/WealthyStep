"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight, Lock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export function ContactSimpleView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setTurnstileError(true);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setTurnstileError(false);

    try {
      const res = await fetch("/api/chatbot/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website: "",
          source: "Contact Page",
          turnstileToken,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (errorData?.error === "Verification failed") {
          throw new Error("Security verification failed. Please try again.");
        }
        if (errorData?.details && Array.isArray(errorData.details)) {
          throw new Error(errorData.details[0].message);
        }
        throw new Error("Failed to send message. Please try again.");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      setTurnstileToken(null);
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 pb-6 sm:pt-6 sm:pb-8 bg-white">
      <div className="container mx-auto max-w-[1100px] px-4">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (5 Cols): Direct Reach & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/90 shadow-2xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-navy font-heading">
                Direct Contact Details
              </h2>

              {/* Phone */}
              <a
                href="tel:+919000929666"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-gray-200 hover:border-lime transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-lime/15 text-lime flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4 text-lime" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block">Phone (Direct)</span>
                  <strong className="text-xs sm:text-sm text-navy group-hover:text-lime transition-colors">
                    +91 90009 29666
                  </strong>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@wealthystep.com"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-gray-200 hover:border-lime transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-lime/15 text-lime flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4 text-lime" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block">Email Address</span>
                  <strong className="text-xs sm:text-sm text-navy group-hover:text-lime transition-colors">
                    info@wealthystep.com
                  </strong>
                </div>
              </a>

              {/* Office Location */}
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-lime/15 text-lime flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-lime" />
                </div>
                <div className="text-xs">
                  <span className="text-[11px] font-semibold text-gray-500 block">Office Location</span>
                  <strong className="text-navy block leading-snug">Wealthy Step</strong>
                  <span className="text-text-body block text-[11px] leading-relaxed">
                    Pranava Business Park, 7th Floor, Kothaguda, Kondapur, Hyderabad, Telangana 500081
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-gray-200 text-xs">
                <div className="w-10 h-10 rounded-lg bg-lime/15 text-lime flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-lime" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block">Working Hours</span>
                  <span className="text-navy font-bold">Mon – Sun: 9:00 AM – 9:00 PM</span>
                </div>
              </div>

              {/* Book a Call Button */}
              <Link
                href="https://calendly.com/wealthystep-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-navy hover:bg-[#240C7A] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
              >
                <Calendar className="w-4 h-4 text-lime" />
                <span>Book a 30-Minute Video Consultation</span>
              </Link>
            </div>

            {/* Real Interactive Map View UI */}
            <div className="rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs bg-white">
              <div className="relative w-full h-56 sm:h-64 bg-gray-100">
                <iframe
                  title="Wealthy Step Office Location - Pranava Business Park, Hyderabad"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=78.3600%2C17.4580%2C78.3760%2C17.4700&layer=mapnik&marker=17.4646%2C78.3695"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between p-3.5 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-lime shrink-0" />
                  <span className="text-xs font-bold text-navy truncate">
                    Pranava Business Park, Hyderabad
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=Pranava+Business+Park,+Kothaguda,+Kondapur,+Hyderabad,+Telangana+500081"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-lime hover:text-navy hover:underline shrink-0 flex items-center gap-1 transition-colors"
                >
                  <span>Google Maps</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Streamlined Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-navy rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-navy/50">
              
              <div className="mb-6">
                <span className="text-xs font-bold text-lime uppercase tracking-wider block mb-1">
                  Send An Inquiry
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Get in Touch With Our Team
                </h2>
                <p className="text-xs sm:text-sm text-white/70 mt-1">
                  Fill in your details below and we will get back to you within 24 hours.
                </p>
              </div>

              {isSuccess ? (
                <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Message Received!</h3>
                  <p className="text-xs text-white/80">
                    Thank you for reaching out. Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-white/70 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white text-navy rounded-lg px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-white/70 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white text-navy rounded-lg px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-white/70 block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white text-navy rounded-lg px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-white/70 block mb-1">
                        Service of Interest *
                      </label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-white text-navy rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-lime"
                      >
                        <option value="" disabled>Select a service</option>
                        <option value="Mutual Funds">Mutual Funds &amp; SIP</option>
                        <option value="SIF">Specialized Investment Funds (SIF)</option>
                        <option value="Insurance">Insurance Policies</option>
                        <option value="NRI Services">NRI Services</option>
                        <option value="Other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-white/70 block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      placeholder="Briefly describe what you are looking for..."
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white text-navy rounded-lg px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime resize-none"
                    />
                  </div>

                  {/* Cloudflare Turnstile Verification */}
                  <div className="pt-1">
                    <Turnstile
                      siteKey={siteKey}
                      onSuccess={(token) => {
                        setTurnstileToken(token);
                        setTurnstileError(false);
                      }}
                      onError={() => setTurnstileError(true)}
                      onExpire={() => setTurnstileToken(null)}
                      options={{ theme: "dark" }}
                    />
                    {turnstileError && (
                      <p className="text-xs text-red-300 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Please complete the verification check.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-white/60 pt-1">
                    <Lock className="w-3.5 h-3.5 text-lime" />
                    <span>Your contact details remain confidential and secure.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !turnstileToken}
                    className="w-full py-3 rounded-xl bg-lime hover:bg-cta-green text-navy font-bold text-xs sm:text-sm transition-all disabled:opacity-60 shadow-md"
                  >
                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              )}

            </div>

            {/* Verification & Trust Badges — balances column heights */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200/90 text-navy shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold block">24-Hour Response</span>
                  <span className="text-gray-500">Fast dedicated service</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200/90 text-navy shadow-2xs">
                <Lock className="w-4 h-4 text-lime shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold block">100% Confidential</span>
                  <span className="text-gray-500">Strict data privacy</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200/90 text-navy shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold block">ARN - 322891</span>
                  <span className="text-gray-500">AMFI registered</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

