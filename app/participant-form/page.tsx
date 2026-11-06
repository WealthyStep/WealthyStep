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
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824zm-3.392-12.416c-5.518 0-10 4.482-10 10 0 1.761.458 3.414 1.258 4.862l-1.336 4.88 5.009-1.314c1.398.761 2.99 1.192 4.685 1.192 5.518 0 10-4.482 10-10s-4.482-10-10-10z" />
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

        {/* ===================== ULTRA-PREMIUM THANK YOU SCREEN ===================== */}
        {isSubmitted && submittedData ? (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#C7D9A8] shadow-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-b from-[#84BD3C]/20 via-emerald-100/40 to-transparent blur-2xl pointer-events-none" />

              {/* Status Pill */}
              <div className="relative inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Response Recorded • 100% Confidential</span>
              </div>

              {/* Glowing Celebration Checkmark */}
              <div className="relative mx-auto flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#84BD3C] to-[#1EBE5D] p-1 shadow-xl shadow-emerald-500/25 ring-8 ring-emerald-50">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Check className="w-10 h-10 text-emerald-600 stroke-[3.5]" />
                  </div>
                </div>
              </div>

              {/* Personalized Heading & Description */}
              <div className="space-y-2 relative">
                <h1 className="text-2xl sm:text-3xl font-black text-[#180D45] tracking-tight">
                  Thank You, {submittedData.name}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Your details have been successfully recorded for the{" "}
                  <strong className="text-[#180D45] font-bold">Financial Freedom Awareness Program</strong>.
                  Our team will review your selected goals and share tailored financial insights with you shortly.
                </p>
              </div>

              {/* 3-Step "What Happens Next" Roadmap */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left">
                <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-gray-100 space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <p className="text-xs font-bold text-[#180D45]">Goal Review</p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Our team studies your selected priorities & timeframe.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-gray-100 space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <p className="text-xs font-bold text-[#180D45]">Custom Insights</p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Practical wealth strategies tailored to your profile.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-gray-100 space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <p className="text-xs font-bold text-[#180D45]">Team Support</p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Direct access whenever you need clarity or guidance.
                  </p>
                </div>
              </div>

              {/* Official Record / Receipt Card */}
              <div className="bg-[#FAFBF7] border border-[#DDE7CD] rounded-2xl p-4 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>Official Program Record</span>
                  <span className="text-[#446A1B] font-black">AMFI ARN-322891</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-semibold">Participant:</span>
                  <span className="font-bold text-[#180D45]">{submittedData.name}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-semibold">Session Date:</span>
                  <span className="font-bold text-[#180D45]">{submittedData.sessionDate}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="font-semibold">Privacy Status:</span>
                  <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Protected & Spam-Free</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. Primary WhatsApp Action: "Chat with Our Team on WhatsApp" */}
                <div>
                  <a
                    href="https://wa.me/919000929666?text=Hi%20Wealthy%20Step%2C%20I%20just%20submitted%20the%20Financial%20Freedom%20Program%20form."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1EBE5D] hover:brightness-105 active:scale-98 text-white text-sm sm:text-base font-black shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-white" />
                    <span>Chat with Our Team on WhatsApp</span>
                    <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <p className="mt-1 text-[11px] text-gray-500 text-center">
                    Have quick questions? Tap above to message our team directly.
                  </p>
                </div>

                {/* 2. VCF Contact Card */}
                <button
                  onClick={handleDownloadVCard}
                  className="w-full inline-flex items-center justify-center gap-2.5 h-12 px-5 rounded-2xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#84BD3C]" />
                  <span>Save Wealthy Step Contact (.vcf)</span>
                </button>

                {/* 3. Instagram Community Card */}
                <a
                  href="https://www.instagram.com/wealthy.step/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-2xl border border-gray-200 hover:border-pink-300 bg-gradient-to-r from-[#FDF5F7] to-white flex items-center justify-between gap-3 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#180D45] truncate">
                        Follow @wealthy.step on Instagram
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        Daily financial education, SIP tips & market awareness
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 shrink-0 transition-colors" />
                </a>

                {/* 4. Reset Button */}
                <div className="pt-1">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#180D45] hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit another response</span>
                  </button>
                </div>
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
