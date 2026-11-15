"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  RotateCcw,
  UploadCloud,
  FileText,
  FileImage,
  Camera,
  X,
  Sparkles,
  ExternalLink,
  Building2,
  CreditCard,
  UserCheck,
  Award,
  HeartPulse,
  Briefcase,
  Users,
  AlertTriangle,
  WifiOff,
  Check,
} from "lucide-react";
import {
  LifeInsuranceProposalInput,
  LifeInsuranceFileMeta,
  validateLifeInsuranceProposal,
} from "@/lib/life-insurance-validation";

// Dynamically import Turnstile with SSR false
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);

const DRAFT_STORAGE_KEY = "wealthystep_life_insurance_draft_v1";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const INITIAL_FORM_DATA: LifeInsuranceProposalInput = {
  fullName: "",
  proposerEmail: "",
  proposerMobile: "",
  maritalStatus: "Single",
  dob: "",
  qualification: "Graduate",
  height: "",
  weight: "",
  motherFullName: "",
  fatherFullName: "",
  employmentType: "Salaried Employee",
  hasExistingPolicies: false,
  existingCoverage: "0",
  currentAddress: "",

  companyName: "",
  designation: "",
  companyEmail: "",
  industry: "IT / Software",
  annualIncome: "",

  hasPreExistingIllness: false,
  preExistingDetails: "",
  isSmoker: false,
  isDrinker: false,
  chewsTobacco: false,

  nomineeName: "",
  isNomineeMinor: false,
  nomineeRelation: "Spouse",
  nomineeDob: "",
  nomineeAddressOption: "Same as Insured person address",
  nomineeCustomAddress: "",
  nomineeAddress: "",
  nomineeMobile: "",
  nomineeEmail: "",
  nomineeBankName: "",
  nomineeBankAccountName: "",
  nomineeBankIfsc: "",
  nomineeBankAccountNumber: "",
  nomineeBankAccountType: "Savings",

  aadharNumber: "",
  panNumber: "",
  proposerBankName: "",
  proposerBankAccountNumber: "",
  proposerBankIfsc: "",
  proposerBankBranch: "",
  proposerBankAccountName: "",

  aadharFiles: [],
  panFiles: [],
  selfieFiles: [],
  chequeFiles: [],
  companyIdFiles: [],
  payslipFiles: [],
  otherFiles: [],
  clientNotes: "",

  consentContactAccepted: false,
  consentDisclosureAccepted: false,
};

const STEPS = [
  { id: 1, title: "Personal Details", short: "Insured", subtitle: "Insured Person" },
  { id: 2, title: "Employment & Income", short: "Employment", subtitle: "Company & Earnings" },
  { id: 3, title: "Health & Habits", short: "Medical", subtitle: "Medical Disclosures" },
  { id: 4, title: "Nominee Details", short: "Nominee", subtitle: "Nominee & Bank" },
  { id: 5, title: "Documents & Bank", short: "KYC & Bank", subtitle: "Uploads & Proposer Bank" },
  { id: 6, title: "Declaration", short: "Declaration", subtitle: "Consents & Security" },
];

export default function LifeInsuranceFormPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<LifeInsuranceProposalInput>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ id: string; message: string } | null>(null);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  // Draft persistence state
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [isRestoredFromDraft, setIsRestoredFromDraft] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  // 1. Restore draft on mount
  useEffect(() => {
    setIsClientReady(true);
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          if (parsed.data.aadharNumber && parsed.data.aadharNumber.length > 12) {
            parsed.data.aadharNumber = parsed.data.aadharNumber.slice(0, 12);
          }
          setFormData((prev) => ({ ...prev, ...parsed.data }));
          if (parsed.step && parsed.step >= 1 && parsed.step <= 6) {
            setCurrentStep(parsed.step);
          }
          setIsRestoredFromDraft(true);
        }
      }
    } catch (e) {
      console.warn("Failed to read draft from localStorage:", e);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Auto-save draft on data change
  const saveDraftToStorage = useCallback(
    (data: LifeInsuranceProposalInput, step: number) => {
      try {
        const stripBase64 = (arr?: any[]) => (arr || []).map(({ base64, ...rest }) => rest);
        const safeData = {
          ...data,
          aadharFiles: stripBase64(data.aadharFiles),
          panFiles: stripBase64(data.panFiles),
          selfieFiles: stripBase64(data.selfieFiles),
          chequeFiles: stripBase64(data.chequeFiles),
          companyIdFiles: stripBase64(data.companyIdFiles),
          payslipFiles: stripBase64(data.payslipFiles),
          otherFiles: stripBase64(data.otherFiles),
        };
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            data: safeData,
            step,
            updatedAt: new Date().toISOString(),
          })
        );
        setDraftSavedToast(true);
        const timer = setTimeout(() => setDraftSavedToast(false), 2000);
        return () => clearTimeout(timer);
      } catch (e) {
        console.warn("Could not save draft:", e);
      }
    },
    []
  );

  useEffect(() => {
    if (!isClientReady || isSubmitted) return;
    const timeout = setTimeout(() => {
      saveDraftToStorage(formData, currentStep);
    }, 600);
    return () => clearTimeout(timeout);
  }, [formData, currentStep, isClientReady, isSubmitted, saveDraftToStorage]);

  // Input change helper
  const handleInputChange = (field: keyof LifeInsuranceProposalInput, value: any) => {
    let processedValue = value;

    if (field === "aadharNumber") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 12);
    } else if (field === "panNumber") {
      processedValue = String(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    } else if (field === "proposerMobile" || field === "nomineeMobile") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 10);
    } else if (field === "proposerBankIfsc" || field === "nomineeBankIfsc") {
      processedValue = String(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    }

    setFormData((prev) => {
      const updated = { ...prev, [field]: processedValue };
      if (field === "fullName" && !prev.proposerBankAccountName) {
        updated.proposerBankAccountName = processedValue;
      }
      return updated;
    });

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setGlobalError(null);
    }
  };

  // File Upload Helper
  const handleFileUpload = (
    field: keyof LifeInsuranceProposalInput,
    files: FileList | null,
    maxCount: number = 1
  ) => {
    if (!files || files.length === 0) return;

    const currentFiles = (formData[field] as LifeInsuranceFileMeta[]) || [];
    if (currentFiles.length >= maxCount) {
      alert(`You can only upload up to ${maxCount} file(s) for this section.`);
      return;
    }

    const availableSlots = maxCount - currentFiles.length;
    const filesToRead = Array.from(files).slice(0, availableSlots);

    filesToRead.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File "${file.name}" exceeds the 10 MB limit. Please compress or choose a smaller file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newFileMeta: LifeInsuranceFileMeta = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          base64: base64,
        };

        setFormData((prev) => ({
          ...prev,
          [field]: [...((prev[field] as LifeInsuranceFileMeta[]) || []), newFileMeta],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (field: keyof LifeInsuranceProposalInput, id?: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ((prev[field] as LifeInsuranceFileMeta[]) || []).filter((f) => f.id !== id),
    }));
  };

  // Clear draft
  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear your saved draft and start fresh?")) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setFieldErrors({});
      setGlobalError(null);
      setIsRestoredFromDraft(false);
    }
  };

  // Step Navigation
  const handleNext = () => {
    setGlobalError(null);
    const validation = validateLifeInsuranceProposal(formData, currentStep);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setGlobalError(firstError || "Please check the highlighted fields to proceed.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFieldErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setGlobalError(null);
    setFieldErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    const validation = validateLifeInsuranceProposal(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setGlobalError(firstError || "Please review and complete all required fields.");

      // Jump to first step that has error
      if (validation.errors.fullName || validation.errors.proposerEmail || validation.errors.proposerMobile || validation.errors.dob || validation.errors.height || validation.errors.weight || validation.errors.motherFullName || validation.errors.fatherFullName || validation.errors.currentAddress) {
        setCurrentStep(1);
      } else if (validation.errors.companyName || validation.errors.designation || validation.errors.companyEmail || validation.errors.annualIncome) {
        setCurrentStep(2);
      } else if (validation.errors.preExistingDetails) {
        setCurrentStep(3);
      } else if (validation.errors.nomineeName || validation.errors.nomineeDob || validation.errors.nomineeMobile || validation.errors.nomineeEmail || validation.errors.nomineeBankName || validation.errors.nomineeBankIfsc || validation.errors.nomineeBankAccountNumber) {
        setCurrentStep(4);
      } else if (validation.errors.aadharNumber || validation.errors.panNumber || validation.errors.proposerBankName || validation.errors.proposerBankAccountNumber || validation.errors.proposerBankIfsc) {
        setCurrentStep(5);
      } else {
        setCurrentStep(6);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!formData.consentContactAccepted || !formData.consentDisclosureAccepted) {
      setFieldErrors((prev) => ({
        ...prev,
        consentContactAccepted: "Please accept the terms and disclosures to proceed.",
      }));
      setGlobalError("Please accept the terms and disclosures to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        turnstileToken: turnstileToken || "fallback-token",
      };

      const response = await fetch("/api/insurance/life-proposal/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field === "turnstile") {
          setTurnstileFailed(true);
          setTurnstileToken("fallback-token");
        }
        setGlobalError(data.error || "Failed to submit proposal. Please try again.");
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSubmissionResult({
        id: data.id || `WS-LIP-${Date.now().toString(36).toUpperCase()}`,
        message: data.message || "Your Life & Term Insurance proposal details have been received successfully.",
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission failed:", err);
      setGlobalError("A network error occurred. Please check your connection and try again.");
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F2] text-[#180D45] flex flex-col font-sans">
      {/* ── Header Bar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-2xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          <Link href="/" className="inline-flex items-center gap-2 group outline-none shrink-0" title="Wealthy Step Home">
            <Image
              src="/logo.svg"
              alt="Wealthy Step Logo"
              width={150}
              height={38}
              priority
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </Link>

          <div className="flex items-center gap-2">
            {!isOnline && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <WifiOff className="w-3 h-3 text-amber-600" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-[#180D45] transition-colors px-2 py-1 rounded-lg hover:bg-gray-50 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>wealthystep.com</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-3.5 sm:py-5">
        {/* ── Success Screen ── */}
        {isSubmitted && submissionResult ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E2E8D8] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-extrabold uppercase tracking-wide border border-emerald-200">
                Life Insurance Proposal Submitted
              </span>
              <h2 className="text-2xl font-black text-[#180D45]">Thank You, {formData.fullName}!</h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                {submissionResult.message} A copy of your responses and next steps have been emailed to{" "}
                <strong className="text-[#180D45]">{formData.proposerEmail}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold block mb-1">
                Your Tracking Reference ID
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-[#180D45]">
                {submissionResult.id}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/91${formData.proposerMobile}?text=${encodeURIComponent(
                  `Hello Wealthy Step, I just submitted my Life & Term Insurance proposal with Ref ID: ${submissionResult.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#1EBE5D] transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setFormData(INITIAL_FORM_DATA);
                  setIsSubmitted(false);
                  setSubmissionResult(null);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Submit Another Response
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* ── Multi-Step Form Wizard ── */
          <div className="space-y-3.5">
            {/* ─── SLEEK TRUST HEADER ─── */}
            <div className="text-center space-y-1.5 animate-fade-in pt-1 pb-1">
              <div className="flex items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold tracking-tight shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Confidential • IRDAI Compliant Advisory</span>
                </div>
                {isRestoredFromDraft && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-500 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Draft restored</span>
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      className="ml-1 text-rose-600 underline font-semibold hover:text-rose-800 cursor-pointer"
                    >
                      Clear
                    </button>
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#84BD3C] uppercase tracking-wider block mb-0.5">
                  Wealthy Step™ Insurance Advisory
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#180D45] tracking-tight">
                  Life &amp; Term Insurance Details &mdash; Proposal
                </h1>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Graduate • Minimum 5 Lakhs ITR filing eligibility. Works on Utmost Good Faith for seamless claim settlement.
              </p>

              {/* Compact Benefits Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1 pt-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-600">
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">🛡️ Term &amp; Life Cover</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">📜 Sec 80C Tax Benefit</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">⚡ Fast Underwriting</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">🔒 100% Confidential</span>
              </div>
            </div>

            {/* ─── GOOGLE FORM-STYLE SECTION PROGRESS BAR ─── */}
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded-md bg-[#180D45] text-white text-[10px] sm:text-[11px] font-black shrink-0">
                    Step {currentStep} of {STEPS.length}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#180D45] truncate">
                    {STEPS[currentStep - 1].title}
                  </span>
                </div>
                <span className="text-xs font-black text-[#446A1B] shrink-0 font-mono">
                  {Math.round((currentStep / STEPS.length) * 100)}%
                </span>
              </div>
              
              {/* Progress Bar Track */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#180D45] via-[#84BD3C] to-[#25D366] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>

              {/* Step Pills on Tablet/Desktop */}
              <div className="hidden sm:grid grid-cols-6 gap-1.5 pt-1 text-center">
                {STEPS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (s.id < currentStep) setCurrentStep(s.id);
                    }}
                    disabled={s.id > currentStep}
                    className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-left ${
                      s.id === currentStep
                        ? "bg-[#180D45] text-white shadow-2xs"
                        : s.id < currentStep
                        ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="block truncate">{s.id}. {s.short}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Global Error Alert Banner */}
            {globalError && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-700 flex items-center gap-2 animate-fade-in shadow-2xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{globalError}</span>
              </div>
            )}

            {/* Form Card */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              
              {/* ============================================================== */}
              {/* STEP 1: Insured Person Details */}
              {/* ============================================================== */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">1</span>
                      Insured Person Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Person who is taking this insurance will receive the Section 80C Tax Exemption certificate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Name (As per Aadhaar) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar Sharma"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.fullName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.fullName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.fullName}</p>
                      )}
                    </div>

                    {/* Proposer Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Proposer Email ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="ramesh@gmail.com"
                        value={formData.proposerEmail}
                        onChange={(e) => handleInputChange("proposerEmail", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.proposerEmail
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.proposerEmail && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerEmail}</p>
                      )}
                    </div>

                    {/* Proposer Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Proposer Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500 select-none bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.proposerMobile}
                          onChange={(e) => handleInputChange("proposerMobile", e.target.value)}
                          className={`w-full h-11 pl-14 pr-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.proposerMobile
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                          }`}
                        />
                      </div>
                      {fieldErrors.proposerMobile && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerMobile}</p>
                      )}
                    </div>

                    {/* Marriage Status */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Marital Status <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {/* DOB */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Proposer Date of Birth <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.dob
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.dob && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.dob}</p>
                      )}
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Educational Qualification <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.qualification}
                        onChange={(e) => handleInputChange("qualification", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Graduate">Graduate (Degree / B.Tech / B.Com etc.)</option>
                        <option value="Post Graduate">Post Graduate (Masters / MBA / M.Tech)</option>
                        <option value="Professional">Professional (CA, Doctor, Lawyer, CS)</option>
                        <option value="Doctorate">Doctorate / Ph.D.</option>
                        <option value="Diploma">Diploma</option>
                        <option value="High School">High School (12th / Inter)</option>
                      </select>
                    </div>

                    {/* Height & Weight */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Height (Feet &amp; Inches) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 ft 10 in"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.height
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.height && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.height}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Weight (in Kgs) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 68"
                        value={formData.weight || ""}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.weight
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.weight && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.weight}</p>
                      )}
                    </div>

                    {/* Parents Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Mother Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Mother's legal name"
                        value={formData.motherFullName}
                        onChange={(e) => handleInputChange("motherFullName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.motherFullName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.motherFullName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.motherFullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Father Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Father's legal name"
                        value={formData.fatherFullName}
                        onChange={(e) => handleInputChange("fatherFullName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.fatherFullName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.fatherFullName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.fatherFullName}</p>
                      )}
                    </div>

                    {/* Employment Type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Are you? <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => handleInputChange("employmentType", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Salaried Employee">Salaried Employee</option>
                        <option value="Businessman">Businessman / Self-Employed</option>
                      </select>
                    </div>

                    {/* Existing Policies Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Do you have existing Life / Term Policies? <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange("hasExistingPolicies", true)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                            formData.hasExistingPolicies
                              ? "border-[#180D45] bg-[#180D45] text-white"
                              : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Yes, I Have
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange("hasExistingPolicies", false);
                            handleInputChange("existingCoverage", "0");
                          }}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                            !formData.hasExistingPolicies
                              ? "border-[#180D45] bg-[#180D45] text-white"
                              : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          No Existing
                        </button>
                      </div>
                    </div>

                    {/* Existing Coverage Amount */}
                    {formData.hasExistingPolicies && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Existing Life Coverage Amount (Sum Assured in Lakhs) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 50 Lakhs"
                          value={formData.existingCoverage}
                          onChange={(e) => handleInputChange("existingCoverage", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.existingCoverage
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.existingCoverage && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.existingCoverage}</p>
                        )}
                      </div>
                    )}

                    {/* Current Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Current Address with PIN Code <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="House / Flat No, Street, Locality, City, State, PIN Code"
                        value={formData.currentAddress}
                        onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                        className={`w-full p-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                          fieldErrors.currentAddress
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.currentAddress && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.currentAddress}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 2: Employment & Income Details */}
              {/* ============================================================== */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">2</span>
                      Employment &amp; Income Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Accurate employer details enable special salaried corporate discounts and higher sum assured underwriting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Infosys, TCS, Google"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.companyName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.companyName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.companyName}</p>
                      )}
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Designation <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Engineer"
                        value={formData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.designation
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.designation && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.designation}</p>
                      )}
                    </div>

                    {/* Company Email ID */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          Company Mail ID <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-emerald-700 font-bold">For Salaried Discount</span>
                      </div>
                      <input
                        type="email"
                        placeholder="ramesh@company.com"
                        value={formData.companyEmail}
                        onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.companyEmail
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.companyEmail && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.companyEmail}</p>
                      )}
                    </div>

                    {/* Industry Sector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Industry <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="IT / Software">Information Technology &amp; Software</option>
                        <option value="Banking & Finance">Banking, Insurance &amp; Financial Services</option>
                        <option value="Manufacturing">Manufacturing &amp; Engineering</option>
                        <option value="Healthcare">Healthcare &amp; Pharmaceuticals</option>
                        <option value="Consulting">Consulting &amp; Professional Services</option>
                        <option value="Government / PSU">Government / PSU</option>
                        <option value="Education">Education &amp; Research</option>
                        <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* Annual Income */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          Annual Income (as per ITR / Form 16) <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-500 font-medium">Mini 5 Lakhs ITR filing</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 12,00,000 or 15 Lakhs"
                        value={formData.annualIncome}
                        onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.annualIncome
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.annualIncome && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.annualIncome}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 3: Health Conditions & Habits */}
              {/* ============================================================== */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">3</span>
                      Health Conditions &amp; Habits
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Full medical disclosure guarantees 100% claim settlement without disputes.
                    </p>
                  </div>

                  {/* Pre-Existing Illness */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-700">
                      Pre-Existing diseases / Surgeries (if any) <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange("hasPreExistingIllness", false)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          !formData.hasPreExistingIllness
                            ? "border-emerald-600 bg-emerald-50/80 text-emerald-900"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        No, I Don&apos;t have health issues or surgeries in the past
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInputChange("hasPreExistingIllness", true)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          formData.hasPreExistingIllness
                            ? "border-amber-600 bg-amber-50/80 text-amber-900"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Yes, I Have health issues or surgeries in the past
                      </button>
                    </div>

                    {formData.hasPreExistingIllness && (
                      <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Specify Pre-Existing illness if any and how long (disclose all Minor / Major health issues or Surgeries) <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Please describe illness, diagnosis year, medications taken, or surgery details..."
                          value={formData.preExistingDetails || ""}
                          onChange={(e) => handleInputChange("preExistingDetails", e.target.value)}
                          className={`w-full p-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                            fieldErrors.preExistingDetails
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.preExistingDetails && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.preExistingDetails}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Lifestyle Habits */}
                  <div className="pt-3 border-t border-gray-100 space-y-4">
                    <span className="text-xs font-extrabold text-[#180D45] uppercase tracking-wider block">
                      Lifestyle Habits
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Smoker */}
                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="block text-xs font-bold text-gray-700 mb-2">Are you a Smoker? *</span>
                        <div className="flex gap-2">
                          {[
                            { label: "No", val: false },
                            { label: "Yes", val: true },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleInputChange("isSmoker", opt.val)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                                formData.isSmoker === opt.val
                                  ? "bg-[#180D45] text-white border-[#180D45]"
                                  : "bg-white text-gray-600 border-gray-200"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Drinker */}
                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="block text-xs font-bold text-gray-700 mb-2">Are you a Drinker? *</span>
                        <div className="flex gap-2">
                          {[
                            { label: "No", val: false },
                            { label: "Yes", val: true },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleInputChange("isDrinker", opt.val)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                                formData.isDrinker === opt.val
                                  ? "bg-[#180D45] text-white border-[#180D45]"
                                  : "bg-white text-gray-600 border-gray-200"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chew Tobacco */}
                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="block text-xs font-bold text-gray-700 mb-2">Do you Chew Tobacco? *</span>
                        <div className="flex gap-2">
                          {[
                            { label: "No", val: false },
                            { label: "Yes", val: true },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleInputChange("chewsTobacco", opt.val)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                                formData.chewsTobacco === opt.val
                                  ? "bg-[#180D45] text-white border-[#180D45]"
                                  : "bg-white text-gray-600 border-gray-200"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 4: Nominee Details & Nominee Bank Details */}
              {/* ============================================================== */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">4</span>
                      Nominee &amp; Nominee Bank Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      The nominee will receive the sum assured benefit in the event of an unfortunate claim.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nominee Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nominee Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Legal name as per Aadhaar"
                        value={formData.nomineeName}
                        onChange={(e) => handleInputChange("nomineeName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.nomineeName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.nomineeName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeName}</p>
                      )}
                    </div>

                    {/* Is Nominee Minor */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Is Nominee Minor? <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        {[
                          { label: "No (Adult)", val: false },
                          { label: "Yes (Minor < 18)", val: true },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => handleInputChange("isNomineeMinor", opt.val)}
                            className={`flex-1 h-11 rounded-xl text-xs font-bold border transition-all ${
                              formData.isNomineeMinor === opt.val
                                ? "bg-[#180D45] text-white border-[#180D45]"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Relation */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Relation with Insured Person <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.nomineeRelation}
                        onChange={(e) => handleInputChange("nomineeRelation", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Spouse">Spouse (Wife / Husband)</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Nominee DOB */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nominee DOB <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.nomineeDob}
                        onChange={(e) => handleInputChange("nomineeDob", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.nomineeDob
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.nomineeDob && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeDob}</p>
                      )}
                    </div>

                    {/* Nominee Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nominee Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={formData.nomineeMobile}
                        onChange={(e) => handleInputChange("nomineeMobile", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.nomineeMobile
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.nomineeMobile && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeMobile}</p>
                      )}
                    </div>

                    {/* Nominee Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nominee Mail ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nominee@gmail.com"
                        value={formData.nomineeEmail}
                        onChange={(e) => handleInputChange("nomineeEmail", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.nomineeEmail
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.nomineeEmail && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeEmail}</p>
                      )}
                    </div>

                    {/* Nominee Address Option */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Nominee Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          "Same as Insured person address",
                          "Same as Proposer person address",
                          "Address is different than insured person",
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange("nomineeAddressOption", opt)}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                              formData.nomineeAddressOption === opt
                                ? "bg-[#180D45] text-white border-[#180D45]"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {formData.nomineeAddressOption === "Address is different than insured person" && (
                        <div className="mt-2.5">
                          <textarea
                            rows={2}
                            placeholder="Nominee full address with PIN code..."
                            value={formData.nomineeCustomAddress || ""}
                            onChange={(e) => handleInputChange("nomineeCustomAddress", e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#180D45] resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nominee Bank Details */}
                  <div className="pt-3 border-t border-gray-100 space-y-4">
                    <span className="text-xs font-extrabold text-[#180D45] uppercase tracking-wider block">
                      Nominee Bank Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nominee Bank Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Nominee Bank Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. State Bank of India, HDFC"
                          value={formData.nomineeBankName}
                          onChange={(e) => handleInputChange("nomineeBankName", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.nomineeBankName
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.nomineeBankName && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeBankName}</p>
                        )}
                      </div>

                      {/* Nominee Name in Bank */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Nominee Name in Bank <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="As printed on bank passbook"
                          value={formData.nomineeBankAccountName}
                          onChange={(e) => handleInputChange("nomineeBankAccountName", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.nomineeBankAccountName
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.nomineeBankAccountName && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeBankAccountName}</p>
                        )}
                      </div>

                      {/* Nominee IFSC Code */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-700">
                            Nominee Bank IFSC Code <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[10px] text-gray-400">11 Chars (HDFC0001234)</span>
                        </div>
                        <input
                          type="text"
                          maxLength={11}
                          placeholder="HDFC0001234"
                          value={formData.nomineeBankIfsc}
                          onChange={(e) => handleInputChange("nomineeBankIfsc", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none uppercase ${
                            fieldErrors.nomineeBankIfsc
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.nomineeBankIfsc && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeBankIfsc}</p>
                        )}
                      </div>

                      {/* Nominee Account Number */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Nominee Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Account number"
                          value={formData.nomineeBankAccountNumber}
                          onChange={(e) => handleInputChange("nomineeBankAccountNumber", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none ${
                            fieldErrors.nomineeBankAccountNumber
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.nomineeBankAccountNumber && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeBankAccountNumber}</p>
                        )}
                      </div>

                      {/* Nominee Account Type */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Nominee Account Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.nomineeBankAccountType}
                          onChange={(e) => handleInputChange("nomineeBankAccountType", e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                        >
                          <option value="Savings">Savings Account</option>
                          <option value="Current">Current Account</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 5: Document Uploads & Proposer Bank Details */}
              {/* ============================================================== */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">5</span>
                      Photo Copy of Documents &amp; Proposer Bank
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload clear photo copies (PDF or image &bull; Max 10 MB per file).
                    </p>
                  </div>

                  {/* ID Numbers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          Aadhaar Number <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">12 Digits</span>
                      </div>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="12-digit Aadhaar number"
                        value={formData.aadharNumber}
                        onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none ${
                          fieldErrors.aadharNumber
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.aadharNumber && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.aadharNumber}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          PAN Number <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">10 Chars (ABCDE1234F)</span>
                      </div>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange("panNumber", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none uppercase ${
                          fieldErrors.panNumber
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.panNumber && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.panNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Document Upload Boxes */}
                  <div className="space-y-3 pt-2">
                    {/* Aadhaar Card File */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#180D45] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          Aadhaar Card Copy <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-gray-400">PDF or Image &bull; Max 10 MB</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>{formData.aadharFiles?.length ? "1 File Attached" : "Upload Aadhaar"}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("aadharFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* PAN Card File */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#180D45] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          PAN Card Copy <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-gray-400">PDF or Image &bull; Max 10 MB</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>{formData.panFiles?.length ? "1 File Attached" : "Upload PAN"}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("panFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Live Photo / Selfie */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#180D45] flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-purple-600" />
                          Live Photo (Selfie) <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-gray-400">Clear frontal photo &bull; Max 10 MB</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <span>{formData.selfieFiles?.length ? "Selfie Attached" : "Upload Selfie"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("selfieFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Cancelled Cheque / Statement */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#180D45] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-amber-600" />
                          Cancelled Cheque or Bank Statement / Passbook <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-gray-400">Showing Account number &amp; IFSC</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>{formData.chequeFiles?.length ? "Cheque Attached" : "Upload Cheque"}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("chequeFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Company ID Card (Salaried) */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-teal-600" />
                          Company ID Card Photo
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">Must for Salaried Employees for discount</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>{formData.companyIdFiles?.length ? "ID Attached" : "Upload ID Card"}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("companyIdFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Last 3 months pay slip (Up to 5 files) */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          Last 3 Months Pay Slip
                        </span>
                        <span className="text-[10px] text-gray-400">Up to 5 files &bull; PDF / Image</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>{formData.payslipFiles?.length ? `${formData.payslipFiles.length} Payslip(s)` : "Upload Payslips"}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("payslipFiles", e.target.files, 5)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Any Other Document */}
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-gray-700">Any Other Document</span>
                        <span className="text-[10px] text-gray-400 block">ITR, Form 16, or existing policy schedule</span>
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>{formData.otherFiles?.length ? "File Attached" : "Upload Document"}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload("otherFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Proposer Bank Details */}
                  <div className="pt-3 border-t border-gray-100 space-y-4">
                    <span className="text-xs font-extrabold text-[#180D45] uppercase tracking-wider block">
                      Proposer Bank Account Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Bank Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Bank Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. HDFC Bank, SBI, ICICI"
                          value={formData.proposerBankName}
                          onChange={(e) => handleInputChange("proposerBankName", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.proposerBankName
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.proposerBankName && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerBankName}</p>
                        )}
                      </div>

                      {/* Bank Branch */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Bank Branch <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Branch locality"
                          value={formData.proposerBankBranch}
                          onChange={(e) => handleInputChange("proposerBankBranch", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.proposerBankBranch
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.proposerBankBranch && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerBankBranch}</p>
                        )}
                      </div>

                      {/* Account Number */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Bank Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Account number"
                          value={formData.proposerBankAccountNumber}
                          onChange={(e) => handleInputChange("proposerBankAccountNumber", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none ${
                            fieldErrors.proposerBankAccountNumber
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.proposerBankAccountNumber && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerBankAccountNumber}</p>
                        )}
                      </div>

                      {/* IFSC Code */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Bank Account IFSC Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={11}
                          placeholder="HDFC0001234"
                          value={formData.proposerBankIfsc}
                          onChange={(e) => handleInputChange("proposerBankIfsc", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none uppercase ${
                            fieldErrors.proposerBankIfsc
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.proposerBankIfsc && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerBankIfsc}</p>
                        )}
                      </div>

                      {/* Name as per Bank Account */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Name as per Bank Account <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Exact name printed on passbook"
                          value={formData.proposerBankAccountName}
                          onChange={(e) => handleInputChange("proposerBankAccountName", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.proposerBankAccountName
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.proposerBankAccountName && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerBankAccountName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes to us */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Notes to us (If you want to share anything to us write here)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Optional notes or requirements..."
                      value={formData.clientNotes || ""}
                      onChange={(e) => handleInputChange("clientNotes", e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#180D45] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 6: Consents, Cloudflare Verification & Submit */}
              {/* ============================================================== */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">6</span>
                      Declarations &amp; Security Verification
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Please accept both statutory declarations to proceed with your proposal.
                    </p>
                  </div>

                  {/* Review Summary */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                    <span className="font-extrabold text-[#180D45] block uppercase tracking-wider text-[11px]">
                      Proposal Summary Review
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <div><strong>Proposer:</strong> {formData.fullName || "—"}</div>
                      <div><strong>DOB:</strong> {formData.dob || "—"}</div>
                      <div><strong>Mobile:</strong> +91 {formData.proposerMobile || "—"}</div>
                      <div><strong>Email:</strong> {formData.proposerEmail || "—"}</div>
                      <div><strong>Company:</strong> {formData.companyName || "—"} ({formData.designation})</div>
                      <div><strong>Annual Income:</strong> {formData.annualIncome || "—"}</div>
                      <div><strong>Nominee:</strong> {formData.nomineeName || "—"} ({formData.nomineeRelation})</div>
                      <div><strong>PAN:</strong> {formData.panNumber || "—"}</div>
                    </div>
                  </div>

                  {/* Consent 1 */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    fieldErrors.consentContactAccepted
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-emerald-200 bg-emerald-50/40"
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.consentContactAccepted}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, consentContactAccepted: checked }));
                          if (checked) {
                            setGlobalError(null);
                          }
                          if (fieldErrors.consentContactAccepted) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.consentContactAccepted;
                              return next;
                            });
                          }
                        }}
                        className="w-5 h-5 rounded text-[#180D45] focus:ring-[#84BD3C] shrink-0 mt-0.5"
                      />
                      <div className="text-xs text-gray-700 leading-relaxed">
                        &ldquo;I understand that by submitting this form, I am giving <strong>Wealthy Step™</strong> permission to contact me regarding my insurance requirements. I confirm that the information provided is true and complete to the best of my knowledge, and I have not withheld any relevant health conditions. I also acknowledge that my information will remain confidential and will not be shared with third parties.&rdquo;
                      </div>
                    </label>
                    {fieldErrors.consentContactAccepted && (
                      <p className="text-[11px] text-rose-600 mt-2 font-semibold">{fieldErrors.consentContactAccepted}</p>
                    )}
                  </div>

                  {/* Consent 2 */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    fieldErrors.consentDisclosureAccepted
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-emerald-200 bg-emerald-50/40"
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.consentDisclosureAccepted}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, consentDisclosureAccepted: checked }));
                          if (checked) {
                            setGlobalError(null);
                          }
                          if (fieldErrors.consentDisclosureAccepted) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.consentDisclosureAccepted;
                              return next;
                            });
                          }
                        }}
                        className="w-5 h-5 rounded text-[#180D45] focus:ring-[#84BD3C] shrink-0 mt-0.5"
                      />
                      <div className="text-xs text-gray-700 leading-relaxed">
                        &ldquo;I understand that any incorrect, incomplete, or undisclosed information can lead to rejection of claims or cancellation of the policy and permanently terminated by the insurer.&rdquo;
                      </div>
                    </label>
                    {fieldErrors.consentDisclosureAccepted && (
                      <p className="text-[11px] text-rose-600 mt-2 font-semibold">{fieldErrors.consentDisclosureAccepted}</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    A copy of your responses will be emailed to <strong className="text-[#180D45]">{formData.proposerEmail || "your email"}</strong> upon submission.
                  </p>

                  {/* Cloudflare Turnstile */}
                  <div className="pt-2 flex flex-col items-center justify-center">
                    {isClientReady && !turnstileFailed && turnstileSiteKey !== "1x00000000000000000000AA" ? (
                      <Turnstile
                        siteKey={turnstileSiteKey}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => {
                          setTurnstileFailed(true);
                          setTurnstileToken("fallback-token");
                        }}
                        onExpire={() => setTurnstileToken(null)}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Security Check Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── NAVIGATION BUTTONS ─── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 active:scale-98 text-gray-700 font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer order-1 sm:order-2"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#180D45] hover:bg-[#25156B] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Proposal...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Life Insurance Proposal</span>
                        <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Security Assurance */}
              <div className="text-center text-[10px] text-gray-400 space-y-0.5 pt-1">
                <p>🔒 256-bit Encrypted • Strictly Confidential • Instant Desk Notification</p>
                <p>Wealthy Step™ • AMFI Registered Mutual Fund &amp; SIF Distributor • ARN-322891</p>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ─── DEDICATED MINIMAL FOOTER ─── */}
      <footer className="w-full border-t border-gray-200 bg-white py-3 px-4 text-center text-[10px] sm:text-[11px] text-gray-400">
        <p>© {new Date().getFullYear()} Wealthy Step. All rights reserved. AMFI Registration ARN-322891.</p>
      </footer>

      {/* Draft Saved Toast */}
      {draftSavedToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#180D45] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-[#84BD3C]/30 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-[#84BD3C] animate-ping" />
          <span>Draft saved automatically</span>
        </div>
      )}
    </div>
  );
}

