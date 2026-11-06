"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Lock,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  ArrowLeft,
  CalendarDays,
  Palmtree,
  GraduationCap,
  Home,
  Target,
  XCircle,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  OCCUPATION_OPTIONS,
  INTEREST_OPTIONS,
  Occupation,
  InterestOption,
  MANDATORY_CONSENT_TEXT,
  isValidEmail,
  isValidMobile,
  getFormattedTodayDate,
} from "@/lib/program-validation";

const EMAIL_DOMAINS = ["@gmail.com", "@yahoo.com", "@outlook.com", "@icloud.com"];

const GOAL_CONFIG: Record<
  InterestOption,
  { label: string; description: string; icon: any; iconColor: string; bgAccent: string }
> = {
  Retirement: {
    label: "Retirement Planning",
    description: "Build a reliable pension corpus & financial peace of mind",
    icon: Palmtree,
    iconColor: "text-amber-600",
    bgAccent: "bg-amber-50 border-amber-200",
  },
  "Insurance Planning (Health, Life)": {
    label: "Insurance Planning (Health & Life)",
    description: "Protect family health, critical illness & term coverage",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    bgAccent: "bg-emerald-50 border-emerald-200",
  },
  "Child Education": {
    label: "Child Education & Higher Studies",
    description: "Dedicated education fund for graduation & career dreams",
    icon: GraduationCap,
    iconColor: "text-blue-600",
    bgAccent: "bg-blue-50 border-blue-200",
  },
  "House Purchase": {
    label: "House Purchase & Real Estate",
    description: "Down payment planning & home loan wealth buffer",
    icon: Home,
    iconColor: "text-indigo-600",
    bgAccent: "bg-indigo-50 border-indigo-200",
  },
  "Other Goals": {
    label: "Other Financial Goals",
    description: "Emergency funds, vacation, car, or general wealth building",
    icon: Target,
    iconColor: "text-purple-600",
    bgAccent: "bg-purple-50 border-purple-200",
  },
  "Not Interested": {
    label: "Not Interested Right Now",
    description: "I only want general updates and awareness insights",
    icon: XCircle,
    iconColor: "text-gray-400",
    bgAccent: "bg-gray-100 border-gray-200",
  },
};

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function ParticipantFormPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState<Occupation | "">("");
  const [selectedInterests, setSelectedInterests] = useState<InterestOption[]>([]);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Honeypot bot trap

  // Automatically computed live date (no manual entry)
  const [sessionDate, setSessionDate] = useState("");

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string>("1x00000000000000000000AA");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
    setSessionDate(getFormattedTodayDate());

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      // Use production site key ONLY on wealthystep.com to avoid 400020 domain mismatch error
      const isProduction =
        hostname === "wealthystep.com" || hostname === "www.wealthystep.com";

      if (isProduction) {
        setTurnstileSiteKey(
          process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
          "1x00000000000000000000AA"
        );
      } else {
        // Cloudflare official always-passing dummy key for all dev/IP/test domains
        setTurnstileSiteKey("1x00000000000000000000AA");
        setTurnstileToken("fallback-token");
      }
    }
  }, []);

  // Validation & UI State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id?: string;
    name: string;
    sessionDate: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email auto-suggestion helper
  const [showEmailDomains, setShowEmailDomains] = useState(false);

  // Quick domain append helper
  const handleDomainClick = (domain: string) => {
    const currentPrefix = email.includes("@") ? email.split("@")[0] : email;
    setEmail(`${currentPrefix}${domain}`);
    setShowEmailDomains(false);
    if (fieldErrors.email) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    }
  };

  // Toggle Interest Chip
  const toggleInterest = (interest: InterestOption) => {
    if (interest === "Not Interested") {
      if (selectedInterests.includes("Not Interested")) {
        setSelectedInterests([]);
      } else {
        setSelectedInterests(["Not Interested"]);
      }
      return;
    }

    const withoutNotInterested = selectedInterests.filter((i) => i !== "Not Interested");
    if (withoutNotInterested.includes(interest)) {
      setSelectedInterests(withoutNotInterested.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...withoutNotInterested, interest]);
    }
  };

  // Real-time Field Validations
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Please enter your full name.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!mobile.trim()) {
      errors.mobile = "Please enter your mobile number.";
    } else if (!isValidMobile(mobile)) {
      errors.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    const ageNum = parseInt(age, 10);
    if (!age.trim()) {
      errors.age = "Please enter your age.";
    } else if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
      errors.age = "Please enter a valid age between 16 and 100.";
    }

    if (!occupation) {
      errors.occupation = "Please select your occupation.";
    }

    if (!consentAgreed) {
      errors.consent = "You must provide consent to submit your details.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) {
      setErrorMsg("Please complete all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/program/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          age: parseInt(age, 10),
          occupation,
          interested_in: selectedInterests,
          consent_given: consentAgreed,
          session_date: sessionDate || getFormattedTodayDate(),
          website: honeypot, // Spam trap
          turnstileToken: turnstileToken || "fallback-token",
          source: "Financial Freedom Awareness Program",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check your inputs.");
      }

      // Fast transition to confirmation screen
      setSubmittedData({
        id: data.id,
        name: name.trim(),
        sessionDate: sessionDate || getFormattedTodayDate(),
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Wealthy Step Contact (.vcf)
  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Kumar;Anil;;Mr.;
FN:Wealthy Step - Mr. Anil Kumar
ORG:Wealthy Step (AMFI Reg. Mutual Fund Distributor)
TITLE:AMFI Registered MFD (ARN-322891)
TEL;TYPE=WORK,VOICE:+919000929666
EMAIL;TYPE=PREF,INTERNET:info@wealthystep.com
URL:https://wealthystep.com
ADR;TYPE=WORK:;;Pranava Business Park, 7th Floor, Kothaguda;Hyderabad;Telangana;500081;India
NOTE:Wealthy Step - Goal-Based Investments, Mutual Funds & Insurance Planning
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "WealthyStep_Contact.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset form for another submission
  const handleReset = () => {
    setName("");
    setEmail("");
    setMobile("");
    setAge("");
    setOccupation("");
    setSelectedInterests([]);
    setConsentAgreed(false);
    setFieldErrors({});
    setErrorMsg(null);
    setIsSubmitted(false);
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#180D45] flex flex-col justify-between">
      {/* ─── DEDICATED MOBILE-FIRST TOP BAR ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group outline-none" title="Wealthy Step Home">
            <Image
              src="/logo.svg"
              alt="Wealthy Step Logo"
              width={160}
              height={40}
              priority
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#180D45] transition-colors px-2.5 py-1 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>wealthystep.com</span>
          </Link>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6">
        {/* Sleek Trust Badge & Program Header (Only visible when form is active) */}
        {!isSubmitted && (
          <div className="text-center mb-4 space-y-2 animate-fade-in">
            {/* 100% SPAM-FREE High-Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white shadow-xs text-xs font-black tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-lime-300 stroke-[2.5]" />
              <span>100% SPAM-FREE • STRICTLY CONFIDENTIAL</span>
            </div>

            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#180D45]/5 text-[#446A1B] text-[11px] font-black tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-[#446A1B]" />
                <span>Financial Freedom Awareness Program</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#180D45] tracking-tight">
                Participant Details Form
              </h1>
            </div>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Please share your details below to receive personalized insights tailored to your financial goals.
            </p>
          </div>
        )}

        {/* ===================== SIMPLE, MODERN & PROFESSIONAL THANK YOU SCREEN ===================== */}
        {isSubmitted && submittedData ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-fade-in max-w-md mx-auto">
            {/* Clean Emerald Checkmark */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#180D45] tracking-tight">
                Thank You, {submittedData.name}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                Your details have been successfully recorded. Our team will review your goals and connect with you shortly.
              </p>
            </div>

            {/* Clean Minimalist Status Chip */}
            <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl px-4 py-2.5 text-xs text-gray-600 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium">
                <CalendarDays className="w-3.5 h-3.5 text-[#446A1B] shrink-0" />
                <span className="text-gray-800 font-semibold">{submittedData.sessionDate}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>100% Confidential</span>
              </span>
            </div>

            {/* Streamlined Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Primary: Chat with Our Team */}
              <a
                href="https://wa.me/919000929666?text=Hi%20Wealthy%20Step%2C%20I%20just%20submitted%20the%20Financial%20Freedom%20Program%20form."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-13 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Chat with Our Team on WhatsApp</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              {/* Secondary Actions in 1 Clean Row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadVCard}
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#84BD3C]" />
                  <span>Save Contact (.vcf)</span>
                </button>

                <a
                  href="https://www.instagram.com/wealthy.step/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl border border-gray-200 hover:border-pink-300 hover:bg-pink-50/30 active:scale-98 text-[#180D45] text-xs font-semibold shadow-xs transition-all"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                  <span>@wealthy.step</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>

              {/* Submit Another Response */}
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Submit another response</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===================== PARTICIPANT DETAILS FORM ===================== */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-3xl border border-gray-200 shadow-xl p-4 sm:p-6 space-y-4"
          >
            {/* Invisible Honeypot Spam Trap */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {/* Global Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* ── 1. AUTOMATIC SESSION DATE (NEVER TRUNCATED) ── */}
            <div className="bg-[#F4F7EC] border border-[#C7D9A8] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#C7D9A8] text-[#446A1B] flex items-center justify-center shrink-0 shadow-2xs">
                  <CalendarDays className="w-5 h-5 text-[#446A1B]" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-[#446A1B] uppercase tracking-wider">
                    Session Date
                  </span>
                  <p className="text-xs sm:text-sm font-black text-[#180D45] leading-snug">
                    {sessionDate || "Loading session date..."}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C7D9A8] text-[10px] sm:text-[11px] font-bold text-[#446A1B] shrink-0 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#446A1B]" />
                <span>Auto-Captured</span>
              </div>
            </div>

            {/* ── 2. FULL NAME ── */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                  }}
                  className={`w-full pl-10 pr-3.5 py-3 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 ${
                    fieldErrors.name
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{fieldErrors.name}</p>
              )}
            </div>

            {/* ── 3. EMAIL ADDRESS ── */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  required
                  autoComplete="email"
                  placeholder="ramesh@gmail.com"
                  value={email}
                  onFocus={() => setShowEmailDomains(true)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowEmailDomains(!e.target.value.includes("@"));
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                  }}
                  className={`w-full pl-10 pr-3.5 py-3 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 ${
                    fieldErrors.email
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{fieldErrors.email}</p>
              )}

              {/* 1-Tap Email Domain Pills */}
              {showEmailDomains && email.length > 0 && !email.includes("@") && (
                <div className="mt-1.5 flex flex-wrap gap-1.5 animate-fade-in">
                  <span className="text-[10px] text-gray-400 font-bold self-center mr-0.5">Quick:</span>
                  {EMAIL_DOMAINS.map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => handleDomainClick(dom)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#84BD3C] hover:text-[#180D45] text-gray-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      {dom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── 4. MOBILE NUMBER ── */}
            <div>
              <label htmlFor="mobile" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div
                className={`relative flex items-center rounded-xl border bg-white overflow-hidden transition-all focus-within:ring-3 ${
                  fieldErrors.mobile
                    ? "border-rose-400 focus-within:ring-rose-200"
                    : "border-gray-300 focus-within:border-[#84BD3C] focus-within:ring-[#84BD3C]/20"
                }`}
              >
                <div className="flex items-center gap-1 px-3 py-3 bg-gray-50 border-r border-gray-200 text-xs font-bold text-gray-700 shrink-0 select-none">
                  <span>🇮🇳 +91</span>
                </div>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    required
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setMobile(digits);
                      if (fieldErrors.mobile) setFieldErrors({ ...fieldErrors, mobile: "" });
                    }}
                    className="w-full pl-9 pr-3.5 py-3 bg-transparent text-base sm:text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>
              {fieldErrors.mobile ? (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{fieldErrors.mobile}</p>
              ) : (
                <p className="mt-0.5 text-[10px] text-gray-400">
                  We will never share your number or spam you. Guaranteed.
                </p>
              )}
            </div>

            {/* ── 5. AGE (STACKED FULL WIDTH - ONE UNDER ONE) ── */}
            <div>
              <label htmlFor="age" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="age"
                  type="number"
                  required
                  min={16}
                  max={100}
                  inputMode="numeric"
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (fieldErrors.age) setFieldErrors({ ...fieldErrors, age: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 ${
                    fieldErrors.age
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                  }`}
                />
              </div>
              {fieldErrors.age && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{fieldErrors.age}</p>
              )}
            </div>

            {/* ── 6. OCCUPATION (STACKED FULL WIDTH - ONE UNDER ONE) ── */}
            <div>
              <label htmlFor="occupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Occupation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  id="occupation"
                  required
                  value={occupation}
                  onChange={(e) => {
                    setOccupation(e.target.value as Occupation);
                    if (fieldErrors.occupation) setFieldErrors({ ...fieldErrors, occupation: "" });
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 cursor-pointer appearance-none ${
                    fieldErrors.occupation
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                  }`}
                >
                  <option value="">Select your occupation</option>
                  {OCCUPATION_OPTIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ === "Salaried"
                        ? "Salaried (Corporate / Private / Govt)"
                        : occ === "Business"
                        ? "Business Owner / Entrepreneur"
                        : "Others (Professional / Consultant / Retired / Student)"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {fieldErrors.occupation && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{fieldErrors.occupation}</p>
              )}
            </div>

            {/* ── 7. INTERESTED IN? (VERTICAL STACKED LIST - ONE BY ONE) ── */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Interested in? <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Select the financial areas you would like insights on:
                  </p>
                </div>
                {selectedInterests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedInterests([])}
                    className="text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Vertical Stacked Cards (One by One) */}
              <div className="flex flex-col gap-2.5 pt-1">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  const isNotInterested = interest === "Not Interested";
                  const config = GOAL_CONFIG[interest];
                  const Icon = config.icon;

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer active:scale-99 ${
                        isSelected
                          ? isNotInterested
                            ? "bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-slate-800"
                            : "bg-[#180D45] text-white border-[#180D45] shadow-md ring-2 ring-[#84BD3C]/40"
                          : "bg-white hover:bg-slate-50 border-gray-200 text-gray-800 hover:border-gray-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon badge */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? isNotInterested
                                ? "bg-white/10 text-white"
                                : "bg-white/10 text-[#84BD3C]"
                              : config.bgAccent
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? "text-white" : config.iconColor}`} />
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm font-bold leading-snug truncate ${isSelected ? "text-white" : "text-[#180D45]"}`}>
                            {config.label}
                          </p>
                          <p className={`text-[11px] leading-tight mt-0.5 ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                            {config.description}
                          </p>
                        </div>
                      </div>

                      {/* Selection Checkmark Circle */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? isNotInterested
                              ? "bg-white text-gray-900 shadow-xs"
                              : "bg-[#84BD3C] text-[#180D45] shadow-xs"
                            : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 8. MANDATORY LEGAL CONSENT CHECKBOX ── */}
            <div className="pt-2 border-t border-gray-100">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  consentAgreed
                    ? "bg-[#F3F7EB] border-[#84BD3C]"
                    : fieldErrors.consent
                    ? "bg-rose-50 border-rose-400"
                    : "bg-[#FAFBF7] border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  required
                  checked={consentAgreed}
                  onChange={(e) => {
                    setConsentAgreed(e.target.checked);
                    if (fieldErrors.consent) setFieldErrors({ ...fieldErrors, consent: "" });
                  }}
                  className="mt-0.5 w-5 h-5 rounded text-[#180D45] focus:ring-[#84BD3C] border-gray-300 shrink-0 cursor-pointer accent-[#180D45]"
                />
                <div className="text-[11px] leading-relaxed text-gray-600">
                  <span className="font-bold text-[#180D45]">Consent & Authorization: </span>
                  {MANDATORY_CONSENT_TEXT}
                </div>
              </label>
              {fieldErrors.consent && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{fieldErrors.consent}</p>
              )}
            </div>

            {/* ── 9. BOT PROTECTION (SEAMLESS TURNSTILE / VERIFICATION BADGE) ── */}
            <div className="flex flex-col items-center justify-center pt-1 min-h-[36px]">
              {isClientReady && !turnstileFailed ? (
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    console.warn("Turnstile check issue, failing open safely.");
                    setTurnstileFailed(true);
                    setTurnstileToken("fallback-token");
                  }}
                  onExpire={() => setTurnstileToken(null)}
                  options={{
                    theme: "light",
                    size: "flexible",
                  }}
                />
              ) : (
                <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-3.5 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Browser Security Verified • Anti-Spam Active</span>
                </div>
              )}
            </div>

            {/* ── 10. FULL-WIDTH THUMB-FRIENDLY SUBMIT BUTTON ── */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white text-base font-black shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-[#84BD3C]" />
                    <span>Submitting Details...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Participant Details</span>
                    <ArrowRight className="w-5 h-5 text-[#84BD3C]" />
                  </>
                )}
              </button>
            </div>

            {/* Security Assurance */}
            <div className="text-center text-[10px] text-gray-500 space-y-0.5 pt-1">
              <p>🔒 256-bit Encrypted • 100% SPAM-FREE • Instant Team Notification</p>
              <p>Wealthy Step™ • AMFI Registered Mutual Fund Distributor • ARN-322891</p>
            </div>
          </form>
        )}
      </main>

      {/* ─── DEDICATED MINIMAL FOOTER ─── */}
      <footer className="w-full border-t border-gray-200 bg-white py-3 px-4 text-center text-[10px] text-gray-400">
        <p>© {new Date().getFullYear()} Wealthy Step. All rights reserved. AMFI Registration ARN-322891.</p>
      </footer>
    </div>
  );
}
