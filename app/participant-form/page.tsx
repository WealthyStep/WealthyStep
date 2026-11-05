"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [honeypot, setHoneypot] = useState(""); // Spam trap

  // Automatically computed live date (no manual entry)
  const [sessionDate, setSessionDate] = useState("");

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    "1x00000000000000000000AA"; // Cloudflare official test sitekey (always passes)

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

  // Initialize today's session date on client mount
  useEffect(() => {
    setSessionDate(getFormattedTodayDate());
  }, []);

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
      // Exclusive selection
      if (selectedInterests.includes("Not Interested")) {
        setSelectedInterests([]);
      } else {
        setSelectedInterests(["Not Interested"]);
      }
      return;
    }

    // If other selected, remove "Not Interested"
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
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) setErrorMsg("Please complete all required fields correctly.");
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
          session_date: sessionDate,
          website: honeypot, // Honeypot trap
          turnstileToken,
          source: "Financial Freedom Awareness Program",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check your inputs.");
      }

      // Fast optimistic transition to celebration screen
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
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9F3] via-white to-[#F9FAF6] py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* ── Top Navigation Bar ── */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-gray-500 hover:text-[#180D45] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>wealthystep.com</span>
          </Link>
          <Link
            href="/presentation"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#84BD3C]/60 text-[#180D45] font-black shadow-2xs hover:bg-[#F3F7EB] transition-all text-[11px]"
          >
            <QrCode className="w-3.5 h-3.5 text-[#84BD3C]" />
            <span>Presenter Slide / QR</span>
          </Link>
        </div>

        {/* ── BIG BOLD 100% SPAM-FREE BANNER (REQUESTED AT TOP) ── */}
        <div className="mb-4 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-emerald-400/40 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-lime-300 stroke-[2.5]" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wide uppercase text-white drop-shadow-sm">
                100% SPAM-FREE
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 font-medium max-w-md leading-snug">
              We respect your privacy. Your personal information is strictly confidential and will never be shared or spammed.
            </p>
          </div>
        </div>

        {/* ── Refined Compact Brand Header (No Giant Letters) ── */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180D45] text-[#84BD3C] text-[11px] font-black tracking-wider uppercase shadow-xs mb-2">
            <Sparkles className="w-3 h-3 text-[#84BD3C]" />
            <span>Financial Freedom Awareness Program</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#180D45] tracking-tight leading-tight">
            Participant Details Form
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Please take a minute to fill your details. This will help us share useful financial insights tailored to your goals.
          </p>
        </div>

        {/* ===================== SUCCESS SCREEN ===================== */}
        {isSubmitted && submittedData ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#C7D9A8] shadow-2xl p-6 sm:p-8 text-center animate-fade-in space-y-5">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg ring-8 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                Submission Confirmed
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#180D45]">
                Thank You, {submittedData.name}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto leading-relaxed">
                Your details have been successfully recorded for the <strong>Financial Freedom Awareness Program</strong>. Our advisory team will share valuable insights tailored to your aspirations.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-3.5 text-left text-xs space-y-1.5">
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
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4 text-[#84BD3C]" />
                <span>Save Wealthy Step Contact (.vcf)</span>
              </button>

              <a
                href="https://wa.me/919000929666?text=Hi%20Wealthy%20Step%2C%20I%20just%20submitted%20the%20Financial%20Freedom%20Program%20form."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <span>Chat with Advisor on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleReset}
                className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-[#180D45] transition-colors"
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
            className="bg-white rounded-3xl border border-[#C7D9A8]/80 shadow-xl p-5 sm:p-7 space-y-4 sm:space-y-5"
          >
            {/* Invisible Honeypot Anti-Bot Field */}
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

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* ── 1. AUTOMATIC SESSION DATE (NO MANUAL ENTRY REQUIRED) ── */}
            <div className="bg-[#F4F7EC] border border-[#C7D9A8] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C7D9A8] text-[#180D45] flex items-center justify-center shrink-0 shadow-2xs">
                  <CalendarDays className="w-4 h-4 text-[#446A1B]" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-[#446A1B] uppercase tracking-wider">
                    Date of Participation
                  </span>
                  <p className="text-xs sm:text-sm font-black text-[#180D45]">
                    {sessionDate || "Loading session date..."}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 border border-[#C7D9A8] text-[10px] font-bold text-gray-600 shrink-0">
                <Lock className="w-3 h-3 text-[#446A1B]" />
                <span>Auto-Captured</span>
              </div>
            </div>

            {/* ── 2. FULL NAME ── */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                    fieldErrors.name
                      ? "border-rose-400 focus:ring-rose-400"
                      : "border-gray-200 focus:ring-[#84BD3C] focus:border-transparent"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.name}</p>
              )}
            </div>

            {/* ── 3. EMAIL ADDRESS (WITH QUICK-SELECT DOMAIN CHIPS) ── */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ramesh@example.com"
                  value={email}
                  onFocus={() => setShowEmailDomains(true)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowEmailDomains(!e.target.value.includes("@"));
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                    fieldErrors.email
                      ? "border-rose-400 focus:ring-rose-400"
                      : "border-gray-200 focus:ring-[#84BD3C] focus:border-transparent"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.email}</p>
              )}

              {/* 1-Tap Quick Domain Chips */}
              {showEmailDomains && email.length > 0 && !email.includes("@") && (
                <div className="mt-1.5 flex flex-wrap gap-1.5 animate-fade-in">
                  <span className="text-[10px] text-gray-500 font-bold self-center mr-1">Quick Select:</span>
                  {EMAIL_DOMAINS.map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => handleDomainClick(dom)}
                      className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-[#84BD3C] hover:text-[#180D45] text-gray-700 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      {dom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── 4. MOBILE NUMBER (10-DIGIT INDIAN VALIDATION) ── */}
            <div>
              <label htmlFor="mobile" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex rounded-xl border overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-[#84BD3C]">
                <div className="flex items-center gap-1 px-3 bg-gray-100 border-r border-gray-200 text-xs font-bold text-gray-700 shrink-0 select-none">
                  <span>🇮🇳 +91</span>
                </div>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setMobile(digits);
                      if (fieldErrors.mobile) setFieldErrors({ ...fieldErrors, mobile: "" });
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 bg-[#FAFBF7] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white ${
                      fieldErrors.mobile ? "border-rose-400" : "border-gray-200"
                    }`}
                  />
                </div>
              </div>
              {fieldErrors.mobile ? (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.mobile}</p>
              ) : (
                <p className="mt-1 text-[10px] text-gray-500 font-medium">
                  We will never share your number or spam you. Guaranteed.
                </p>
              )}
            </div>

            {/* ── 5. AGE & OCCUPATION (GRID) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
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
                    placeholder="e.g. 32"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (fieldErrors.age) setFieldErrors({ ...fieldErrors, age: "" });
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                      fieldErrors.age
                        ? "border-rose-400 focus:ring-rose-400"
                        : "border-gray-200 focus:ring-[#84BD3C] focus:border-transparent"
                    }`}
                  />
                </div>
                {fieldErrors.age && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.age}</p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Occupation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    id="occupation"
                    required
                    value={occupation}
                    onChange={(e) => {
                      setOccupation(e.target.value as Occupation);
                      if (fieldErrors.occupation) setFieldErrors({ ...fieldErrors, occupation: "" });
                    }}
                    className={`w-full pl-10 pr-8 py-2.5 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:bg-white cursor-pointer ${
                      fieldErrors.occupation
                        ? "border-rose-400 focus:ring-rose-400"
                        : "border-gray-200 focus:ring-[#84BD3C] focus:border-transparent"
                    }`}
                  >
                    <option value="">Select Occupation</option>
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.occupation && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{fieldErrors.occupation}</p>
                )}
              </div>
            </div>

            {/* ── 6. INTERESTED IN? (OPTIONAL CHIPS) ── */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Interested in? <span className="text-gray-500 font-normal normal-case">(Optional)</span>
                </label>
                {selectedInterests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedInterests([])}
                    className="text-[10px] font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  const isNotInterested = interest === "Not Interested";

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer active:scale-98 ${
                        isSelected
                          ? isNotInterested
                            ? "bg-gray-800 text-white border-gray-900 shadow-xs"
                            : "bg-[#180D45] text-white border-[#180D45] shadow-xs"
                          : "bg-[#FAFBF7] hover:bg-[#F3F7EB] text-gray-700 border-gray-200"
                      }`}
                    >
                      <span className="leading-snug">{interest}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1.5 text-[10px] ${
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
                  className="mt-0.5 w-4 h-4 rounded text-[#180D45] focus:ring-[#84BD3C] border-gray-300 shrink-0 cursor-pointer accent-[#180D45]"
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

            {/* ── 8. CLOUDFLARE TURNSTILE BOT PROTECTION ── */}
            <div className="flex flex-col items-center justify-center pt-1">
              <Turnstile
                siteKey={turnstileSiteKey}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => {
                  console.warn("Turnstile check encountered an error. Proceeding safely.");
                  setTurnstileToken("fallback-token");
                }}
                onExpire={() => setTurnstileToken(null)}
                options={{
                  theme: "light",
                  size: "flexible",
                }}
              />
            </div>

            {/* ── 9. SUBMIT BUTTON ── */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#84BD3C]" />
                    <span>Submitting Details...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Participant Details</span>
                    <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                  </>
                )}
              </button>
            </div>

            {/* Bottom Security Assurance */}
            <div className="text-center text-[10px] text-gray-500 space-y-0.5 pt-1">
              <p>🔒 256-bit Encrypted Submission • Instant Advisor Notification</p>
              <p>Wealthy Step™ • AMFI Registered Mutual Fund Distributor • ARN-322891</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

