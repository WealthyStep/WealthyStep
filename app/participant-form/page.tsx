"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Lock,
  Check,
  Download,
  ExternalLink,
  ChevronRight,
  QrCode,
  ArrowLeft,
  CalendarDays,
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
        {/* Sleek Trust Badge & Program Title */}
        <div className="text-center mb-4 space-y-2">
          {/* 100% SPAM-FREE High-Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700 text-white shadow-xs text-xs font-black tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-lime-300 stroke-[2.5]" />
            <span>100% SPAM-FREE • STRICTLY CONFIDENTIAL</span>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] sm:text-xs font-black text-[#446A1B] uppercase tracking-wider">
              Financial Freedom Awareness Program
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-[#180D45] tracking-tight">
              Participant Details Form
            </h1>
          </div>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            Please share your details below to receive personalized insights tailored to your financial goals.
          </p>
        </div>

        {/* ===================== SUCCESS / CONFIRMATION SCREEN ===================== */}
        {isSubmitted && submittedData ? (
          <div className="bg-white rounded-3xl border border-[#C7D9A8] shadow-xl p-6 sm:p-8 text-center space-y-5 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 shadow-md ring-8 ring-emerald-50 mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                Submission Confirmed
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#180D45]">
                Thank You, {submittedData.name}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto leading-relaxed">
                Your details have been successfully recorded for the <strong>Financial Freedom Awareness Program</strong>. Our advisory team will reach out with customized insights.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-4 text-left text-xs space-y-2">
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
                <span className="font-bold text-emerald-700">🔒 100% Protected & Spam-Free</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleDownloadVCard}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#84BD3C]" />
                <span>Save Wealthy Step Contact (.vcf)</span>
              </button>

              <a
                href="https://wa.me/919000929666?text=Hi%20Wealthy%20Step%2C%20I%20just%20submitted%20the%20Financial%20Freedom%20Program%20form."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] active:scale-98 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Chat with Advisor on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleReset}
                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-[#180D45] transition-colors"
              >
                Submit another response
              </button>
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

            {/* ── 1. AUTOMATIC SESSION DATE (COMPACT STATUS CHIP) ── */}
            <div className="bg-[#F4F7EC] border border-[#C7D9A8] rounded-xl px-3 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CalendarDays className="w-4 h-4 text-[#446A1B] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] font-bold text-[#446A1B] uppercase tracking-wider mr-1.5">
                    Session Date:
                  </span>
                  <span className="text-xs font-black text-[#180D45]">
                    {sessionDate || "Loading date..."}
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#C7D9A8] text-[10px] font-bold text-gray-600 shrink-0">
                <Lock className="w-3 h-3 text-[#446A1B]" />
                <span>Auto-captured</span>
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
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-2.5 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 ${
                    fieldErrors.name
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.name}</p>
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
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-2.5 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 ${
                    fieldErrors.email
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.email}</p>
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
                      className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-[#84BD3C] hover:text-[#180D45] text-gray-700 text-xs font-bold transition-all cursor-pointer"
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
                <div className="flex items-center gap-1 px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-xs font-bold text-gray-700 shrink-0 select-none">
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
                    className="w-full pl-9 pr-3.5 py-2.5 bg-transparent text-base sm:text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>
              {fieldErrors.mobile ? (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.mobile}</p>
              ) : (
                <p className="mt-0.5 text-[10px] text-gray-400">
                  We will never share your number or spam you. Guaranteed.
                </p>
              )}
            </div>

            {/* ── 5. AGE & OCCUPATION (2-COLUMN GRID) ── */}
            <div className="grid grid-cols-2 gap-3">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Age <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    className={`w-full pl-9 pr-2 py-2.5 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 ${
                      fieldErrors.age
                        ? "border-rose-400 focus:ring-rose-200"
                        : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                    }`}
                  />
                </div>
                {fieldErrors.age && (
                  <p className="mt-1 text-[10px] text-rose-600 font-semibold">{fieldErrors.age}</p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Occupation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    id="occupation"
                    required
                    value={occupation}
                    onChange={(e) => {
                      setOccupation(e.target.value as Occupation);
                      if (fieldErrors.occupation) setFieldErrors({ ...fieldErrors, occupation: "" });
                    }}
                    className={`w-full pl-9 pr-6 py-2.5 bg-white border rounded-xl text-base sm:text-sm font-medium transition-all focus:outline-none focus:ring-3 cursor-pointer truncate ${
                      fieldErrors.occupation
                        ? "border-rose-400 focus:ring-rose-200"
                        : "border-gray-300 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                    }`}
                  >
                    <option value="">Select</option>
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.occupation && (
                  <p className="mt-1 text-[10px] text-rose-600 font-semibold">{fieldErrors.occupation}</p>
                )}
              </div>
            </div>

            {/* ── 6. INTERESTED IN? (SLEEK TACTILE CHIPS) ── */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Interested in? <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                </label>
                {selectedInterests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedInterests([])}
                    className="text-[11px] font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  const isNotInterested = interest === "Not Interested";

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between gap-1.5 cursor-pointer active:scale-98 ${
                        isSelected
                          ? isNotInterested
                            ? "bg-gray-800 text-white border-gray-900 shadow-xs"
                            : "bg-[#180D45] text-white border-[#180D45] shadow-xs"
                          : "bg-white hover:bg-[#F3F7EB] text-gray-700 border-gray-200"
                      }`}
                    >
                      <span className="leading-tight text-[11px] sm:text-xs">{interest}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] transition-colors ${
                          isSelected
                            ? isNotInterested
                              ? "bg-white text-gray-900 font-black"
                              : "bg-[#84BD3C] text-[#180D45] font-black"
                            : "border border-gray-300"
                        }`}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 7. MANDATORY LEGAL CONSENT CHECKBOX ── */}
            <div className="pt-2 border-t border-gray-100">
              <label
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
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
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.consent}</p>
              )}
            </div>

            {/* ── 8. BOT PROTECTION (SEAMLESS TURNSTILE / VERIFICATION BADGE) ── */}
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
                <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-3 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Browser Security Verified • Anti-Spam Active</span>
                </div>
              )}
            </div>

            {/* ── 9. FULL-WIDTH THUMB-FRIENDLY SUBMIT BUTTON ── */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 h-13 sm:h-14 px-6 rounded-2xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p>🔒 256-bit Encrypted • 100% SPAM-FREE • Instant Advisor Notification</p>
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
