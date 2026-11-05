"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  HeartHandshake,
  Check,
  Download,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  QrCode,
  ArrowLeft,
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
  normalizeMobile,
} from "@/lib/feedback-validation";

const EMAIL_DOMAINS = ["@gmail.com", "@yahoo.com", "@outlook.com", "@icloud.com"];

export default function FeedbackPage() {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState<Occupation | "">("");
  const [selectedInterests, setSelectedInterests] = useState<InterestOption[]>([]);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [websiteHoneypot, setWebsiteHoneypot] = useState(""); // Bot honeypot

  // Turnstile State
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAErV96vDrW-3FJQ6";

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    mobile: string;
    occupation: string;
    interests: string[];
  } | null>(null);

  // Email auto-suggestion helpers
  const [showEmailDomains, setShowEmailDomains] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Toggle Interests
  const handleToggleInterest = (interest: InterestOption) => {
    if (interest === "Not Interested") {
      // If clicking "Not Interested", clear all others and keep only "Not Interested"
      if (selectedInterests.includes("Not Interested")) {
        setSelectedInterests([]);
      } else {
        setSelectedInterests(["Not Interested"]);
      }
      return;
    }

    // If selecting any actual goal, remove "Not Interested"
    const withoutNotInterested = selectedInterests.filter(
      (item) => item !== "Not Interested"
    );

    if (withoutNotInterested.includes(interest)) {
      setSelectedInterests(withoutNotInterested.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...withoutNotInterested, interest]);
    }
  };

  // Quick domain click helper
  const handleDomainClick = (domain: string) => {
    const atIndex = email.indexOf("@");
    const base = atIndex > -1 ? email.slice(0, atIndex) : email;
    setEmail(`${base}${domain}`);
    setShowEmailDomains(false);
    emailInputRef.current?.focus();
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = "Please enter your full name (minimum 2 characters).";
    }

    if (!email.trim() || !isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    const cleanMob = normalizeMobile(mobile);
    if (!cleanMob || !isValidMobile(cleanMob)) {
      errors.mobile = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    const ageNum = parseInt(age.trim(), 10);
    if (!age.trim() || isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
      errors.age = "Please enter your age (between 16 and 100).";
    }

    if (!occupation) {
      errors.occupation = "Please select your occupation.";
    }

    if (!consentAgreed) {
      errors.consent = "Please check the box to agree to the consent terms.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) {
      setErrorMsg("Please correct the highlighted fields before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: normalizeMobile(mobile),
        age: parseInt(age.trim(), 10),
        occupation,
        interested_in: selectedInterests,
        consent_given: consentAgreed,
        website: websiteHoneypot,
        turnstileToken,
        source: "Financial Freedom Awareness Program",
      };

      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit form. Please try again.");
      }

      // Success! Instant state transition
      setSubmittedData({
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile,
        occupation: payload.occupation,
        interests: payload.interested_in,
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // vCard Generator for "Save Contact" button
  const handleSaveContact = () => {
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

  // Reset form for new submission
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
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF5] via-white to-[#FAFBF7] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Top Quick Links Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#180D45] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>wealthystep.com</span>
          </Link>
          <Link
            href="/feedback/presentation"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#84BD3C]/60 text-[#180D45] text-[11px] sm:text-xs font-black shadow-2xs hover:bg-[#F3F7EB] transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-[#84BD3C]" />
            <span>Presenter QR / Slide View</span>
          </Link>
        </div>

        {/* Brand Top Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="text-2xl sm:text-3xl font-black text-[#180D45] tracking-tight">
              Wealthy<span className="text-[#84BD3C]">Step</span>™
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180D45] text-[#84BD3C] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Financial Freedom Awareness Program</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#180D45] tracking-tight leading-tight">
            Participant Details Form
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Please take a minute to fill your details. This will help us share useful financial insights tailored to your aspirations.
          </p>

          {/* Spam-Free & Confidential Assurance Pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-bold text-gray-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Spam-Free
            </span>
            <span className="inline-flex items-center gap-1 text-[#180D45] bg-[#F3F7EB] px-2.5 py-1 rounded-full border border-[#C7D9A8]">
              <Lock className="w-3 h-3 text-[#446A1B]" />
              Strictly Confidential
            </span>
            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
              ⚡ 60-Second Form
            </span>
          </div>
        </div>

        {/* ===================== SUCCESS SCREEN ===================== */}
        {isSubmitted && submittedData ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#C7D9A8] shadow-2xl p-6 sm:p-10 text-center animate-fade-in space-y-6">
            {/* Celebration Icon */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg ring-8 ring-emerald-50 animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#84BD3C] text-[#180D45] flex items-center justify-center text-xs font-black shadow-md">
                ✓
              </div>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#446A1B] bg-[#F3F7EB] px-3 py-1 rounded-full border border-[#C7D9A8]">
                Submission Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#180D45] mt-3">
                Thank You, {submittedData.name}!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your details have been successfully received for the{" "}
                <strong className="text-[#180D45]">Financial Freedom Awareness Program</strong>. We will share personalized, actionable financial insights directly with you.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="bg-[#FAFBF7] border border-gray-200 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-3 shadow-2xs">
              <p className="font-extrabold text-[#180D45] text-xs uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#84BD3C]" />
                Summary of Your Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-gray-500 font-semibold block">Full Name:</span>
                  <span className="text-gray-900 font-bold">{submittedData.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block">Registered Email:</span>
                  <span className="text-gray-900 font-bold">{submittedData.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block">Contact Number:</span>
                  <span className="text-gray-900 font-bold">+91 {submittedData.mobile}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block">Occupation:</span>
                  <span className="text-gray-900 font-bold">{submittedData.occupation}</span>
                </div>
              </div>

              {submittedData.interests && submittedData.interests.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 font-semibold block mb-1.5">
                    Areas of Interest:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {submittedData.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#180D45] text-white"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSaveContact}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs sm:text-sm font-extrabold transition-all shadow-md hover:shadow-xl cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4 text-[#84BD3C]" />
                <span>Save Wealthy Step Official Contact to Phone</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-white border border-gray-200 hover:border-[#84BD3C] text-gray-700 hover:text-[#180D45] font-bold text-xs transition-all shadow-2xs hover:shadow-sm"
                >
                  <span>Explore Wealthy Step Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#F3F7EB] hover:bg-[#E5F0D4] text-[#3C6415] font-bold text-xs transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Submit Another Participant Response</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              Wealthy Step™ • AMFI Registered Mutual Fund Distributor (ARN-322891) • Hyderabad, Telangana
            </p>
          </div>
        ) : (
          /* ===================== FORM CARD ===================== */
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#C7D9A8] shadow-xl shadow-[#180D45]/5 p-5 sm:p-8 transition-all">
            {/* Global Error Banner */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-950 text-xs font-semibold shadow-2xs animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Hidden Bot Honeypot */}
              <input
                type="text"
                name="website"
                value={websiteHoneypot}
                onChange={(e) => setWebsiteHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    name="name"
                    id="name"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs ${
                      fieldErrors.name
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* 2. Email Address with Auto-domain Completion Helper */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    ref={emailInputRef}
                    type="email"
                    required
                    name="email"
                    id="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="e.g. rahul.sharma@gmail.com"
                    value={email}
                    onFocus={() => {
                      if (email && !email.includes("@")) setShowEmailDomains(true);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      setShowEmailDomains(val.length > 2 && !val.includes("@"));
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs ${
                      fieldErrors.email
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                    }`}
                  />
                </div>

                {/* Quick Domain Completion Chips */}
                {showEmailDomains && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5 items-center animate-fade-in">
                    <span className="text-[10px] font-bold text-gray-400">Quick complete:</span>
                    {EMAIL_DOMAINS.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleDomainClick(domain)}
                        className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-[#F3F7EB] hover:text-[#3C6415] border border-gray-200 text-[10px] font-bold text-gray-600 transition-colors cursor-pointer"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                )}

                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* 3. Mobile Number & Age (2-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    {mobile && (
                      <span className="text-[10px] font-mono font-bold text-gray-400">
                        {normalizeMobile(mobile).length}/10
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>+91</span>
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      name="tel"
                      id="mobile"
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="9876543210"
                      maxLength={15}
                      value={mobile}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setMobile(raw);
                        if (fieldErrors.mobile) setFieldErrors({ ...fieldErrors, mobile: "" });
                      }}
                      className={`w-full pl-16 pr-4 py-2.5 sm:py-3 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs font-mono ${
                        fieldErrors.mobile
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-200 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                      }`}
                    />
                    {isValidMobile(mobile) && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-600 pointer-events-none">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {fieldErrors.mobile && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.mobile}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      required
                      min={16}
                      max={100}
                      name="age"
                      id="age"
                      placeholder="e.g. 32"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                        if (fieldErrors.age) setFieldErrors({ ...fieldErrors, age: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs ${
                        fieldErrors.age
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-200 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.age && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Occupation (Dropdown) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Occupation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    required
                    value={occupation}
                    onChange={(e) => {
                      setOccupation(e.target.value as Occupation);
                      if (fieldErrors.occupation)
                        setFieldErrors({ ...fieldErrors, occupation: "" });
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs appearance-none cursor-pointer ${
                      fieldErrors.occupation
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:border-[#84BD3C] focus:ring-[#84BD3C]/20"
                    }`}
                  >
                    <option value="" disabled>
                      -- Select Occupation --
                    </option>
                    {OCCUPATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
                {fieldErrors.occupation && (
                  <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.occupation}
                  </p>
                )}
              </div>

              {/* 5. Interested in? (Optional Multi-Select) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Interested in? <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <span className="text-[10px] text-gray-400">Select any that apply</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    const isNotInterested = interest === "Not Interested";

                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleInterest(interest)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? isNotInterested
                              ? "bg-gray-100 text-gray-700 border-gray-400 shadow-xs"
                              : "bg-[#180D45] text-white border-[#180D45] shadow-xs"
                            : "bg-[#FAFBF7] hover:bg-white text-gray-700 border-gray-200 hover:border-[#84BD3C]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] shrink-0 transition-colors ${
                            isSelected
                              ? isNotInterested
                                ? "bg-gray-700 text-white border-gray-700"
                                : "bg-[#84BD3C] text-[#180D45] border-[#84BD3C]"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <span className="flex-1 leading-snug">{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Consent Text & Checkbox (Mandatory) */}
              <div className="p-4 rounded-2xl bg-[#F3F7EB] border border-[#C7D9A8]/80 text-[#180D45] space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#3C6415] shrink-0 mt-0.5" />
                  <div className="space-y-1.5 text-[11px] leading-relaxed text-gray-700">
                    <p className="font-medium">
                      I hereby provide my consent to <strong className="text-[#180D45]">Wealthy Step™</strong> to collect, store, and use my personal information for the purpose of financial planning, insurance advisory, and investment-related services.
                    </p>
                    <p className="text-gray-600">
                      I understand that the information shared by me will be kept confidential and will not be disclosed to third parties without my consent, except as required for service delivery or as per applicable regulations.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-2 border-t border-[#C7D9A8]/60 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={consentAgreed}
                    onChange={(e) => {
                      setConsentAgreed(e.target.checked);
                      if (fieldErrors.consent) setFieldErrors({ ...fieldErrors, consent: "" });
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#180D45] focus:ring-[#84BD3C] cursor-pointer"
                  />
                  <span className="text-xs font-black text-[#180D45] group-hover:text-[#3C6415] transition-colors">
                    * I Agree & Confirm Consent
                  </span>
                </label>

                {fieldErrors.consent && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.consent}
                  </p>
                )}
              </div>

              {/* 7. Cloudflare Turnstile Bot Verification */}
              <div className="pt-1 flex flex-col items-center justify-center">
                <Turnstile
                  siteKey={siteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => console.warn("Turnstile widget verification failed/mocked in dev")}
                  onExpire={() => setTurnstileToken(null)}
                  options={{
                    theme: "light",
                    size: "normal",
                  }}
                />
                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#84BD3C]" />
                  Protected by Cloudflare Turnstile • Spam-Free Guarantee
                </span>
              </div>

              {/* 8. Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#180D45] hover:bg-[#25156B] text-white font-black text-sm transition-all shadow-md hover:shadow-xl disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#84BD3C]" />
                      <span>Submitting Your Details...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit My Details</span>
                      <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer Trust Note */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500">
                  Wealthy Step™ respects your privacy. Zero spam. Safe and encrypted transmission.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

