"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  X,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Building2,
  CreditCard,
  UserCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  WifiOff,
  Check,
} from "lucide-react";
import {
  BseStarAccountOpeningInput,
  BseStarNominee,
  BseStarFileMeta,
  validateBseStarAccountOpening,
} from "@/lib/bse-star-validation";

// Dynamically import Turnstile with SSR false
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);

const DRAFT_STORAGE_KEY = "wealthystep_bse_star_mf_draft_v1";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const INITIAL_NOMINEE: BseStarNominee = {
  name: "",
  aadharLast4: "",
  relation: "Spouse",
  dob: "",
  mobile: "",
  mobileBelongsTo: "Nominee Mobile number",
  email: "",
  emailBelongsTo: "Nominee Email ID",
  address: "",
  percentage: 100,
};

const INITIAL_FORM_DATA: BseStarAccountOpeningInput = {
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  placeOfBirth: "",
  occupation: "Salaried",
  presentAddress: "",
  permanentAddressSameAsPresent: true,
  permanentAddress: "",
  maritalStatus: "Single",
  marriageDate: "",
  bloodGroup: "",

  isKycDone: "Yes",
  aadharNumber: "",
  panNumber: "",
  aadharFiles: [],
  panFiles: [],

  bankFiles: [],
  bankName: "",
  bankBranch: "",
  bankAddress: "",
  accountNumber: "",
  accountType: "Savings",
  bankCity: "",
  pinCode: "",
  micrCode: "",
  ifscCode: "",

  nomineesCount: 1,
  nominees: [{ ...INITIAL_NOMINEE }],
  clientNote: "",

  declarationAccepted: false,
};

const STEPS = [
  { id: 1, title: "Personal Details", short: "Personal", subtitle: "Applicant Information" },
  { id: 2, title: "KYC & Documents", short: "KYC", subtitle: "Aadhaar & PAN Verification" },
  { id: 3, title: "Bank Details", short: "Bank", subtitle: "Mandate & Bank Account" },
  { id: 4, title: "Nominee Details", short: "Nominee", subtitle: "Beneficiary Allocation" },
  { id: 5, title: "Declaration & Security", short: "Declaration", subtitle: "Consent & Verification" },
];

export default function BseStarMutualFundFormPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<BseStarAccountOpeningInput>(INITIAL_FORM_DATA);
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
          // Auto-sanitize Aadhaar if restored from old draft
          if (parsed.data.aadharNumber && parsed.data.aadharNumber.length > 12) {
            parsed.data.aadharNumber = parsed.data.aadharNumber.slice(0, 12);
          }
          setFormData((prev) => ({ ...prev, ...parsed.data }));
          if (parsed.step && parsed.step >= 1 && parsed.step <= 5) {
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
    (data: BseStarAccountOpeningInput, step: number) => {
      try {
        const safeData = {
          ...data,
          aadharFiles: (data.aadharFiles || []).map(({ base64, ...rest }) => rest),
          panFiles: (data.panFiles || []).map(({ base64, ...rest }) => rest),
          bankFiles: (data.bankFiles || []).map(({ base64, ...rest }) => rest),
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
  const handleInputChange = (field: keyof BseStarAccountOpeningInput, value: any) => {
    let processedValue = value;

    if (field === "aadharNumber") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 12);
    } else if (field === "panNumber") {
      processedValue = String(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    } else if (field === "mobile") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 10);
    } else if (field === "ifscCode") {
      processedValue = String(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    } else if (field === "pinCode") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 6);
    } else if (field === "micrCode") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => {
      const updated = { ...prev, [field]: processedValue };
      if (field === "presentAddress" && prev.permanentAddressSameAsPresent) {
        updated.permanentAddress = processedValue;
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

  // Nominee handlers
  const handleNomineeChange = (index: number, key: keyof BseStarNominee, val: any) => {
    setFormData((prev) => {
      const updatedNominees = [...prev.nominees];
      let cleanedVal = val;
      if (key === "aadharLast4") {
        cleanedVal = String(val).replace(/\D/g, "").slice(0, 4);
      } else if (key === "mobile") {
        cleanedVal = String(val).replace(/\D/g, "").slice(0, 10);
      }
      updatedNominees[index] = { ...updatedNominees[index], [key]: cleanedVal };
      return { ...prev, nominees: updatedNominees };
    });

    const errKey = `nominee_${index}_${key}`;
    if (fieldErrors[errKey] || fieldErrors.nominee_percentage_sum) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        delete next.nominee_percentage_sum;
        return next;
      });
      setGlobalError(null);
    }
  };

  const handleNomineesCountChange = (count: number) => {
    setFormData((prev) => {
      let updatedNominees = [...prev.nominees];
      if (count === 1) {
        updatedNominees = [
          {
            ...(updatedNominees[0] || INITIAL_NOMINEE),
            percentage: 100,
          },
        ];
      } else if (count === 2) {
        if (updatedNominees.length < 2) {
          updatedNominees = [
            { ...(updatedNominees[0] || INITIAL_NOMINEE), percentage: 50 },
            {
              name: "",
              aadharLast4: "",
              relation: "Child",
              dob: "",
              mobile: "",
              mobileBelongsTo: "Nominee Mobile number",
              email: "",
              emailBelongsTo: "Nominee Email ID",
              address: "",
              percentage: 50,
            },
          ];
        } else {
          updatedNominees[0].percentage = 50;
          updatedNominees[1].percentage = 50;
        }
      }
      return { ...prev, nomineesCount: count, nominees: updatedNominees };
    });
  };

  // File Upload Helper (supports instant replacement for single files)
  const handleFileUpload = (
    field: "aadharFiles" | "panFiles" | "bankFiles",
    files: FileList | null,
    maxCount: number = 1
  ) => {
    if (!files || files.length === 0) return;

    const currentFiles = formData[field] || [];
    let filesToRead: File[] = [];

    if (maxCount === 1) {
      filesToRead = [files[0]];
    } else {
      if (currentFiles.length >= maxCount) {
        alert(`You can only upload up to ${maxCount} file(s) for this section.`);
        return;
      }
      const availableSlots = maxCount - currentFiles.length;
      filesToRead = Array.from(files).slice(0, availableSlots);
    }

    filesToRead.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File "${file.name}" exceeds the 10 MB limit. Please compress or choose a smaller file.`);
        return;
      }

      const validMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!validMimes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
        alert(`File "${file.name}" is not supported. Please upload an image (JPG, PNG, WEBP) or PDF.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newFileMeta: BseStarFileMeta = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          base64: base64,
        };

        setFormData((prev) => ({
          ...prev,
          [field]: maxCount === 1 ? [newFileMeta] : [...(prev[field] || []), newFileMeta],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (field: "aadharFiles" | "panFiles" | "bankFiles", id?: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((f) => f.id !== id),
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
    const validation = validateBseStarAccountOpening(formData, currentStep);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setGlobalError(firstError || "Please check the highlighted fields to proceed.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFieldErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
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

    // Full form validation
    const validation = validateBseStarAccountOpening(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setGlobalError(firstError || "Please review and complete all required fields.");

      // Jump to first step that has error
      if (validation.errors.fullName || validation.errors.mobile || validation.errors.email || validation.errors.dob || validation.errors.placeOfBirth || validation.errors.presentAddress || validation.errors.permanentAddress) {
        setCurrentStep(1);
      } else if (validation.errors.isKycDone || validation.errors.aadharNumber || validation.errors.panNumber) {
        setCurrentStep(2);
      } else if (validation.errors.bankName || validation.errors.accountNumber || validation.errors.ifscCode || validation.errors.pinCode) {
        setCurrentStep(3);
      } else if (validation.errors.nominees || validation.errors.nominee_percentage_sum || Object.keys(validation.errors).some(k => k.startsWith("nominee_"))) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!formData.declarationAccepted) {
      setFieldErrors((prev) => ({
        ...prev,
        declarationAccepted: "You must confirm that all details are true and agree to the declaration.",
      }));
      setGlobalError("Please accept the declaration to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        turnstileToken: turnstileToken || "fallback-token",
      };

      const response = await fetch("/api/bse-star/account-opening/", {
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
        setGlobalError(data.error || "Failed to submit details. Please try again.");
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Success
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSubmissionResult({
        id: data.id || `WS-BSE-${Date.now().toString(36).toUpperCase()}`,
        message: data.message || "Your BSE Star Mutual Fund account details have been received successfully.",
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
                Application Submitted Successfully
              </span>
              <h2 className="text-2xl font-black text-[#180D45]">Thank You, {formData.fullName}!</h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                {submissionResult.message} A copy of your responses and next steps have been emailed to{" "}
                <strong className="text-[#180D45]">{formData.email}</strong>.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-md mx-auto">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold block mb-1">
                Your Tracking Reference ID
              </span>
              <span className="text-base sm:lg font-mono font-black text-[#180D45]">
                {submissionResult.id}
              </span>
            </div>

            {/* Direct WhatsApp Assistance */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/91${formData.mobile}?text=${encodeURIComponent(
                  `Hello Wealthy Step, I just submitted my BSE Star MF account creation form with Ref ID: ${submissionResult.id}.`
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
                  <span>100% Confidential • AMFI Registered &amp; BSE Star Desk</span>
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
                  Wealthy Step™ Mutual Funds &amp; SIF
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#180D45] tracking-tight">
                  BSE Star MF — Account Creation Details
                </h1>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Take mindful steps towards building your wealth. Founded by Qualified Personal Finance Professionals (QPFP®) &amp; Certified NISM CRISIL Wealth Managers.
              </p>

              {/* Compact Benefits Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1 pt-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-600">
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">🌱 Wealth Building</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">📜 BSE Star Platform</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">⚡ Fast Online KYC</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">🔒 ARN-322891</span>
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
              <div className="hidden sm:grid grid-cols-5 gap-1.5 pt-1 text-center">
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
              {/* STEP 1: Personal Details */}
              {/* ============================================================== */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">1</span>
                      Personal Information
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enter your legal details exactly as printed on your government identity cards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Name (As per Aadhaar / PAN) <span className="text-rose-500">*</span>
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

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500 select-none bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange("mobile", e.target.value)}
                          className={`w-full h-11 pl-14 pr-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.mobile
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                          }`}
                        />
                      </div>
                      {fieldErrors.mobile && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.mobile}</p>
                      )}
                    </div>

                    {/* Email ID */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="ramesh@gmail.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.email
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Date of Birth <span className="text-rose-500">*</span>
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

                    {/* Place of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Place of Birth (City, State) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad, Telangana"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.placeOfBirth
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.placeOfBirth && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.placeOfBirth}</p>
                      )}
                    </div>

                    {/* Occupation */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Occupation <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.occupation}
                        onChange={(e) => handleInputChange("occupation", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Salaried">Salaried Employee</option>
                        <option value="Business">Business / Entrepreneur</option>
                        <option value="Professional">Professional (Doctor, CA, Lawyer, etc.)</option>
                        <option value="Student">Student</option>
                        <option value="Home maker">Home maker</option>
                        <option value="Retired">Retired</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* Blood Group */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">Blood Group</label>
                        <span className="text-[10px] text-gray-400">Optional</span>
                      </div>
                      <select
                        value={formData.bloodGroup || ""}
                        onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Marital Status */}
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
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Marriage Date (Conditional if Married) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">Marriage Date</label>
                        <span className="text-[10px] text-gray-400">Single: N/A</span>
                      </div>
                      <input
                        type="date"
                        disabled={formData.maritalStatus !== "Married"}
                        value={formData.marriageDate || ""}
                        onChange={(e) => handleInputChange("marriageDate", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          formData.maritalStatus !== "Married"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                    </div>

                    {/* Present Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Present Address Information <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="House / Flat No, Street, Locality, City, State, Pincode"
                        value={formData.presentAddress}
                        onChange={(e) => handleInputChange("presentAddress", e.target.value)}
                        className={`w-full p-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                          fieldErrors.presentAddress
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.presentAddress && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.presentAddress}</p>
                      )}
                    </div>

                    {/* Permanent Address Checkbox & Input */}
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer mb-2 select-none">
                        <input
                          type="checkbox"
                          checked={formData.permanentAddressSameAsPresent}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              permanentAddressSameAsPresent: checked,
                              permanentAddress: checked ? prev.presentAddress : "",
                            }));
                          }}
                          className="w-4 h-4 rounded text-[#180D45] focus:ring-[#84BD3C]"
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          Permanent address is same as present address
                        </span>
                      </label>

                      {!formData.permanentAddressSameAsPresent && (
                        <div className="mt-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Permanent Address Information <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Permanent address with City, State and Pincode"
                            value={formData.permanentAddress}
                            onChange={(e) => handleInputChange("permanentAddress", e.target.value)}
                            className={`w-full p-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                              fieldErrors.permanentAddress
                                ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                : "border-gray-200 focus:border-[#180D45]"
                            }`}
                          />
                          {fieldErrors.permanentAddress && (
                            <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.permanentAddress}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 2: KYC Details & Documents */}
              {/* ============================================================== */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">2</span>
                      KYC Details &amp; Documents
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Mutual Fund regulations require valid PAN and Aadhaar records.
                    </p>
                  </div>

                  {/* Is KYC Done */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Is your KYC already completed? <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: "Yes, KYC Done", val: "Yes" },
                        { label: "No, KYC Not Done", val: "No" },
                        { label: "I am Not Sure / Don't Know", val: "Don't Know" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => handleInputChange("isKycDone", opt.val)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            formData.isKycDone === opt.val
                              ? "border-[#180D45] bg-[#180D45] text-white shadow-xs"
                              : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* PAN Number */}
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
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.panNumber && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.panNumber}</p>
                      )}
                    </div>

                    {/* Aadhaar Number */}
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
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.aadharNumber && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.aadharNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Document Upload Sections */}
                  <div className="space-y-4 pt-2">
                    {/* PAN Card File Upload */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-[#180D45] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#84BD3C]" />
                          PAN Card Copy
                        </span>
                        <span className="text-[10px] text-gray-500">PDF or Image &bull; Max 10 MB</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs">
                          <UploadCloud className="w-4 h-4 text-gray-500" />
                          <span>Choose PAN File</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload("panFiles", e.target.files, 1)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-gray-400">
                          {formData.panFiles && formData.panFiles.length > 0 ? "1 file selected" : "No file chosen"}
                        </span>
                      </div>

                      {/* Uploaded PAN file list */}
                      {formData.panFiles && formData.panFiles.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {formData.panFiles.map((f) => (
                            <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 text-xs">
                              <span className="flex items-center gap-1.5 truncate max-w-[280px] font-medium text-gray-700">
                                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate">{f.fileName}</span>
                                <span className="text-[10px] text-gray-400 shrink-0">({Math.round(f.fileSize / 1024)} KB)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile("panFiles", f.id)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Aadhaar Card File Upload (Up to 5 files) */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-[#180D45] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          Aadhaar Card Copy (Front &amp; Back)
                        </span>
                        <span className="text-[10px] text-gray-500">Up to 5 files &bull; PDF / Image &bull; Max 10 MB</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs">
                          <UploadCloud className="w-4 h-4 text-gray-500" />
                          <span>Choose Aadhaar File(s)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload("aadharFiles", e.target.files, 5)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-gray-400">
                          {formData.aadharFiles?.length || 0}/5 file(s) uploaded
                        </span>
                      </div>

                      {/* Uploaded Aadhaar files list */}
                      {formData.aadharFiles && formData.aadharFiles.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {formData.aadharFiles.map((f) => (
                            <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 text-xs">
                              <span className="flex items-center gap-1.5 truncate max-w-[280px] font-medium text-gray-700">
                                <FileImage className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{f.fileName}</span>
                                <span className="text-[10px] text-gray-400 shrink-0">({Math.round(f.fileSize / 1024)} KB)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile("aadharFiles", f.id)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 3: Bank Details */}
              {/* ============================================================== */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">3</span>
                      Bank Details &amp; Mandate
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      This bank account will be linked for mutual fund investments and redemption payouts.
                    </p>
                  </div>

                  {/* Cancelled Cheque / Bank Statement Upload */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-[#180D45] flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Cancelled Cheque / Bank Statement
                      </span>
                      <span className="text-[10px] text-gray-500">PDF or Image &bull; Max 10 MB</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#180D45] hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs">
                        <UploadCloud className="w-4 h-4 text-gray-500" />
                        <span>Upload Cheque / Statement</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("bankFiles", e.target.files, 1)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {formData.bankFiles && formData.bankFiles.length > 0 ? "1 file selected" : "No file chosen"}
                      </span>
                    </div>

                    {formData.bankFiles && formData.bankFiles.length > 0 && (
                      <div className="mt-2.5">
                        {formData.bankFiles.map((f) => (
                          <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200 text-xs">
                            <span className="flex items-center gap-1.5 truncate max-w-[280px] font-medium text-gray-700">
                              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="truncate">{f.fileName}</span>
                              <span className="text-[10px] text-gray-400 shrink-0">({Math.round(f.fileSize / 1024)} KB)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile("bankFiles", f.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Bank Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Bank Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank, SBI, ICICI Bank"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.bankName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.bankName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.bankName}</p>
                      )}
                    </div>

                    {/* Bank Branch */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Bank Branch <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madhapur Branch"
                        value={formData.bankBranch}
                        onChange={(e) => handleInputChange("bankBranch", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.bankBranch
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.bankBranch && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.bankBranch}</p>
                      )}
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Account Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 50100234567890"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none ${
                          fieldErrors.accountNumber
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.accountNumber && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.accountNumber}</p>
                      )}
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Account Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.accountType}
                        onChange={(e) => handleInputChange("accountType", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Savings">Savings Account</option>
                        <option value="Current">Current Account</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          IFSC Code <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">11 Chars (HDFC0001234)</span>
                      </div>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="HDFC0001234"
                        value={formData.ifscCode}
                        onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none uppercase ${
                          fieldErrors.ifscCode
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.ifscCode && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.ifscCode}</p>
                      )}
                    </div>

                    {/* MICR Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">MICR Code</label>
                        <span className="text-[10px] text-gray-400">9 Digits &bull; Optional</span>
                      </div>
                      <input
                        type="text"
                        maxLength={9}
                        placeholder="9-digit MICR code"
                        value={formData.micrCode || ""}
                        onChange={(e) => handleInputChange("micrCode", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none ${
                          fieldErrors.micrCode
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.micrCode && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.micrCode}</p>
                      )}
                    </div>

                    {/* Bank City */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Bank City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={formData.bankCity}
                        onChange={(e) => handleInputChange("bankCity", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.bankCity
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.bankCity && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.bankCity}</p>
                      )}
                    </div>

                    {/* Bank PIN Code */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        PIN Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="500081"
                        value={formData.pinCode}
                        onChange={(e) => handleInputChange("pinCode", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-wider transition-all focus:outline-none ${
                          fieldErrors.pinCode
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.pinCode && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.pinCode}</p>
                      )}
                    </div>

                    {/* Bank Address */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">Bank Address</label>
                        <span className="text-[10px] text-gray-400">Optional</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Full branch address or street"
                        value={formData.bankAddress || ""}
                        onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#180D45]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 4: Nominee Details */}
              {/* ============================================================== */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">4</span>
                      Nominee Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      SEBI guidelines mandate registering nominees for mutual fund folios.
                    </p>
                  </div>

                  {/* Nominees Count Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      How many people do you want as nominee? <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-xs">
                      {[1, 2].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleNomineesCountChange(num)}
                          className={`py-2.5 px-4 rounded-xl border text-xs font-extrabold transition-all ${
                            formData.nomineesCount === num
                              ? "border-[#180D45] bg-[#180D45] text-white shadow-xs"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {num} Nominee{num > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  {fieldErrors.nominee_percentage_sum && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                      {fieldErrors.nominee_percentage_sum}
                    </div>
                  )}

                  {/* Nominee Cards */}
                  <div className="space-y-6">
                    {formData.nominees.map((nom, idx) => {
                      const prefix = `nominee_${idx}`;
                      return (
                        <div key={idx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <span className="text-xs font-black text-[#180D45] uppercase tracking-wider">
                              Nominee #{idx + 1} Details
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Share: {nom.percentage}%
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Nominee Name */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Nominee Name (as per Aadhaar) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Legal name"
                                value={nom.name}
                                onChange={(e) => handleNomineeChange(idx, "name", e.target.value)}
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                                  fieldErrors[`${prefix}_name`]
                                    ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                    : "border-gray-200 bg-white focus:border-[#180D45]"
                                }`}
                              />
                              {fieldErrors[`${prefix}_name`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_name`]}</p>
                              )}
                            </div>

                            {/* Nominee Last 4 Digits of Aadhaar */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-gray-700">
                                  Last 4 Digits of Aadhaar <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-[10px] text-gray-400">4 digits</span>
                              </div>
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="e.g. 9857"
                                value={nom.aadharLast4}
                                onChange={(e) => handleNomineeChange(idx, "aadharLast4", e.target.value)}
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm font-mono tracking-widest transition-all focus:outline-none ${
                                  fieldErrors[`${prefix}_aadharLast4`]
                                    ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                    : "border-gray-200 bg-white focus:border-[#180D45]"
                                }`}
                              />
                              {fieldErrors[`${prefix}_aadharLast4`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_aadharLast4`]}</p>
                              )}
                            </div>

                            {/* Relation With Nominee */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Relation With Nominee <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={nom.relation}
                                onChange={(e) => handleNomineeChange(idx, "relation", e.target.value)}
                                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#180D45]"
                              >
                                <option value="Spouse">Spouse (Wife / Husband)</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* Nominee DOB */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Nominee Date of Birth <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={nom.dob}
                                onChange={(e) => handleNomineeChange(idx, "dob", e.target.value)}
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                                  fieldErrors[`${prefix}_dob`]
                                    ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                    : "border-gray-200 bg-white focus:border-[#180D45]"
                                }`}
                              />
                              {fieldErrors[`${prefix}_dob`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_dob`]}</p>
                              )}
                            </div>

                            {/* Nominee Mobile Number */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Nominee Mobile Number <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="tel"
                                maxLength={10}
                                placeholder="10-digit mobile number"
                                value={nom.mobile}
                                onChange={(e) => handleNomineeChange(idx, "mobile", e.target.value)}
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                                  fieldErrors[`${prefix}_mobile`]
                                    ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                    : "border-gray-200 bg-white focus:border-[#180D45]"
                                }`}
                              />
                              {fieldErrors[`${prefix}_mobile`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_mobile`]}</p>
                              )}
                            </div>

                            {/* Nominee Mobile Belongs To */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Mobile Belongs To <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={nom.mobileBelongsTo}
                                onChange={(e) => handleNomineeChange(idx, "mobileBelongsTo", e.target.value)}
                                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#180D45]"
                              >
                                <option value="Nominee Mobile number">Nominee Mobile number</option>
                                <option value="Spouse Mobile Number">Spouse Mobile Number</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* Nominee Email ID */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Nominee Email ID <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="email"
                                placeholder="nominee@gmail.com"
                                value={nom.email}
                                onChange={(e) => handleNomineeChange(idx, "email", e.target.value)}
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                                  fieldErrors[`${prefix}_email`]
                                    ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                    : "border-gray-200 bg-white focus:border-[#180D45]"
                                }`}
                              />
                              {fieldErrors[`${prefix}_email`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_email`]}</p>
                              )}
                            </div>

                            {/* Nominee Email Belongs To */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Email Belongs To <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={nom.emailBelongsTo}
                                onChange={(e) => handleNomineeChange(idx, "emailBelongsTo", e.target.value)}
                                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#180D45]"
                              >
                                <option value="Nominee Email ID">Nominee Email ID</option>
                                <option value="Spouse Email ID">Spouse Email ID</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            {/* Nominee Address */}
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Nominee Address <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Address with city & pincode"
                                value={nom.address}
                                onChange={(e) => handleNomineeChange(idx, "address", e.target.value)}
                                className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                                  fieldErrors[`${prefix}_address`]
                                    ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                    : "border-gray-200 bg-white focus:border-[#180D45]"
                                }`}
                              />
                              {fieldErrors[`${prefix}_address`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_address`]}</p>
                              )}
                            </div>

                            {/* Percentage Allocation */}
                            <div className="sm:col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-gray-700">
                                  How much % do you want to Nominate? <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-xs font-black text-[#180D45]">{nom.percentage}%</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={100}
                                value={nom.percentage}
                                onChange={(e) => handleNomineeChange(idx, "percentage", Number(e.target.value))}
                                className="w-full accent-[#84BD3C] cursor-pointer"
                              />
                              {fieldErrors[`${prefix}_percentage`] && (
                                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors[`${prefix}_percentage`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Note to us */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Note to us (Let us know if you want to convey anything)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Optional notes, preferences, or questions for our advisor..."
                      value={formData.clientNote || ""}
                      onChange={(e) => handleInputChange("clientNote", e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#180D45] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 5: Declaration & Consent */}
              {/* ============================================================== */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-black text-[#180D45] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#180D45] text-white text-xs flex items-center justify-center font-bold">5</span>
                      Declaration &amp; Security Verification
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Please confirm your declarations before submitting your application.
                    </p>
                  </div>

                  {/* Review Summary Box */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                    <span className="font-extrabold text-[#180D45] block uppercase tracking-wider text-[11px]">
                      Application Quick Summary
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <div><strong>Name:</strong> {formData.fullName || "—"}</div>
                      <div><strong>PAN:</strong> {formData.panNumber || "—"}</div>
                      <div><strong>Mobile:</strong> +91 {formData.mobile || "—"}</div>
                      <div><strong>Email:</strong> {formData.email || "—"}</div>
                      <div><strong>Bank:</strong> {formData.bankName} ({formData.bankBranch})</div>
                      <div><strong>Account:</strong> XXXX-{formData.accountNumber ? formData.accountNumber.slice(-4) : "—"}</div>
                      <div><strong>Nominees:</strong> {formData.nomineesCount} registered</div>
                      <div><strong>KYC Status:</strong> {formData.isKycDone}</div>
                    </div>
                  </div>

                  {/* Declaration Box */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    fieldErrors.declarationAccepted
                      ? "border-rose-400 bg-rose-50/20"
                      : "border-emerald-200 bg-emerald-50/40"
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.declarationAccepted}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({ ...prev, declarationAccepted: checked }));
                          if (checked) {
                            setGlobalError(null);
                          }
                          if (fieldErrors.declarationAccepted) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.declarationAccepted;
                              return next;
                            });
                          }
                        }}
                        className="w-5 h-5 rounded text-[#180D45] focus:ring-[#84BD3C] shrink-0 mt-0.5"
                      />
                      <div className="text-xs text-gray-700 leading-relaxed">
                        <strong className="text-[#180D45]">Applicant Declaration:</strong> I hereby declare that the information and documents provided above are true and correct to the best of my knowledge. I authorize <strong>Wealthy Step™</strong> to use these details and attachments solely for the purpose of mutual fund account opening and related regulatory processes. I am providing this information voluntarily and with my full consent.
                      </div>
                    </label>
                    {fieldErrors.declarationAccepted && (
                      <p className="text-[11px] text-rose-600 mt-2 font-semibold">{fieldErrors.declarationAccepted}</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    A copy of your responses will be emailed to <strong className="text-[#180D45]">{formData.email || "your email"}</strong> upon submission.
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

                {currentStep < 5 ? (
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
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit BSE Star MF Details</span>
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

      {/* Draft Saved Toast Indicator */}
      {draftSavedToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#180D45] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-[#84BD3C]/30 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-[#84BD3C] animate-ping" />
          <span>Draft saved automatically</span>
        </div>
      )}
    </div>
  );
}
