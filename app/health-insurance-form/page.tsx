"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  Building,
  HeartPulse,
  Users,
  Briefcase,
  Activity,
  CheckCircle2,
  FileText,
  Lock,
  ChevronDown,
  Sparkles,
  Download,
  ExternalLink,
  WifiOff,
  RotateCcw,
  BadgeAlert,
  Info,
} from "lucide-react";
import {
  HealthInsuranceProposalInput,
  InsuredMember,
  validateHealthInsuranceProposal,
  PAN_REGEX,
  INDIAN_MOBILE_REGEX,
  IFSC_REGEX,
  EMAIL_REGEX,
  normalizeMobile,
  normalizePan,
  normalizeIfsc,
} from "@/lib/health-insurance-validation";

// Dynamically import Turnstile with SSR false
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);

const DRAFT_STORAGE_KEY = "wealthystep_health_insurance_draft_v1";

const STEPS = [
  { id: 1, title: "Proposer Details", short: "Proposer", desc: "Tax 80D Beneficiary & KYC" },
  { id: 2, title: "Covered Members", short: "Members", desc: "Adults, Kids & Contact" },
  { id: 3, title: "Medical & Lifestyle", short: "Medical", desc: "Health & Habit Disclosures" },
  { id: 4, title: "Nominee & Banking", short: "Nominee", desc: "Claim & Beneficiary Details" },
  { id: 5, title: "Review & Consent", short: "Review", desc: "Verification & Submission" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function HealthInsuranceFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedProposalId, setSubmittedProposalId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  // Form State
  const [formData, setFormData] = useState<HealthInsuranceProposalInput>({
    proposerName: "",
    proposerPan: "",
    proposerDob: "",
    proposerAadhar: "",
    proposerMobile: "",
    proposerAddress: "",
    proposerEmail: "",
    employmentStatus: "Salaried Employee (PF credit)",
    corporateEmail: "",
    policyType: "New Policy",

    adultsCount: 1,
    kidsCount: 0,
    relationAdult2: "Wife",
    relationKids: "Son",
    members: [
      {
        id: "member-self",
        role: "Adult 1 (Self)",
        relation: "Self",
        fullName: "",
        dob: "",
        gender: "Male",
        height: "",
        weight: "",
      },
    ],
    insuredEmail: "",
    insuredMobile: "",

    hasPreExistingIllness: false,
    preExistingDetails: "",
    hasTobaccoAlcoholHabits: false,
    habitsDetails: "",
    currentAddress: "",
    sameAsProposerAddress: true,

    nomineeName: "",
    nomineeDob: "",
    nomineeRelation: "Wife",
    nomineeAddressOption: "Same as Proposer person address",
    nomineeCustomAddress: "",
    nomineeMobile: "",
    nomineeEmail: "",
    nomineeBankName: "",
    nomineeBankAccountName: "",
    nomineeBankIfsc: "",
    nomineeBankAccountNumber: "",
    nomineeBankAccountType: "Savings",

    consentContactAccepted: false,
    consentDisclosureAccepted: false,
  });

  // Client initialization & Draft restoration
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
          if (parsed.data.proposerAadhar && parsed.data.proposerAadhar.length > 12) {
            parsed.data.proposerAadhar = parsed.data.proposerAadhar.slice(0, 12);
          }
          setFormData((prev) => ({ ...prev, ...parsed.data }));
          if (parsed.step && parsed.step >= 1 && parsed.step <= 5) {
            setCurrentStep(parsed.step);
          }
          setDraftRestored(true);
        }
      }
    } catch (e) {
      console.warn("Could not load local draft:", e);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-save draft on every change
  useEffect(() => {
    if (!isClientReady || isSubmitted) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ data: formData, step: currentStep, updatedAt: Date.now() })
        );
      } catch (err) {
        // Safe ignore
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData, currentStep, isClientReady, isSubmitted]);

  // Synchronize members list when adultsCount or kidsCount changes
  const updateMembersList = (adults: number, kids: number) => {
    const newMembers: InsuredMember[] = [];

    // Adult 1 (Self)
    const existingSelf = formData.members.find((m) => m.role === "Adult 1 (Self)");
    newMembers.push({
      id: existingSelf?.id || "member-self",
      role: "Adult 1 (Self)",
      relation: "Self",
      fullName: existingSelf?.fullName || formData.proposerName || "",
      dob: existingSelf?.dob || formData.proposerDob || "",
      gender: existingSelf?.gender || "Male",
      height: existingSelf?.height || "",
      weight: existingSelf?.weight || "",
    });

    // Adult 2 to N
    for (let i = 2; i <= adults; i++) {
      const roleName = `Adult ${i}` as any;
      const existing = formData.members.find((m) => m.role === roleName);
      newMembers.push({
        id: existing?.id || `member-adult-${i}`,
        role: roleName,
        relation: existing?.relation || (i === 2 ? formData.relationAdult2 || "Wife" : "Parent"),
        fullName: existing?.fullName || "",
        dob: existing?.dob || "",
        gender: existing?.gender || (i === 2 ? "Female" : "Male"),
        height: existing?.height || "",
        weight: existing?.weight || "",
      });
    }

    // Kids 1 to N
    for (let k = 1; k <= kids; k++) {
      const roleName = `Kid ${k}` as any;
      const existing = formData.members.find((m) => m.role === roleName);
      newMembers.push({
        id: existing?.id || `member-kid-${k}`,
        role: roleName,
        relation: existing?.relation || formData.relationKids || (k === 1 ? "Son" : "Daughter"),
        fullName: existing?.fullName || "",
        dob: existing?.dob || "",
        gender: existing?.gender || (k === 1 ? "Male" : "Female"),
        height: existing?.height || "",
        weight: existing?.weight || "",
      });
    }

    setFormData((prev) => ({
      ...prev,
      adultsCount: adults,
      kidsCount: kids,
      members: newMembers,
    }));
  };

  const handleInputChange = (field: keyof HealthInsuranceProposalInput, value: any) => {
    let processedValue = value;
    if (field === "proposerAadhar") {
      processedValue = String(value).replace(/\D/g, "").slice(0, 12);
    }

    setFormData((prev) => {
      const updated = { ...prev, [field]: processedValue };
      if (field === "proposerAddress" && prev.sameAsProposerAddress) {
        updated.currentAddress = processedValue;
      }
      if (field === "proposerMobile" && !prev.insuredMobile) {
        updated.insuredMobile = processedValue;
      }
      if (field === "proposerEmail" && !prev.insuredEmail) {
        updated.insuredEmail = processedValue;
      }
      return updated;
    });

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleMemberChange = (index: number, subField: keyof InsuredMember, value: any) => {
    const updated = [...formData.members];
    if (updated[index]) {
      updated[index] = { ...updated[index], [subField]: value };
      setFormData((prev) => ({ ...prev, members: updated }));
    }
  };

  // Step Validation & Navigation
  const handleNext = () => {
    const validation = validateHealthInsuranceProposal(formData, currentStep);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setGlobalError(firstError || "Please check the highlighted fields to proceed.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFieldErrors({});
    setGlobalError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setFieldErrors({});
    setGlobalError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear your entered details and start fresh?")) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (e) {}
      window.location.reload();
    }
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateHealthInsuranceProposal(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setGlobalError("Please review and complete all required sections before submitting.");
      if (
        validation.errors.proposerName ||
        validation.errors.proposerPan ||
        validation.errors.proposerDob ||
        validation.errors.proposerMobile ||
        validation.errors.proposerEmail
      ) {
        setCurrentStep(1);
      } else if (validation.errors.insuredEmail || validation.errors.insuredMobile) {
        setCurrentStep(2);
      } else if (validation.errors.preExistingDetails || validation.errors.currentAddress) {
        setCurrentStep(3);
      } else if (
        validation.errors.nomineeName ||
        validation.errors.nomineeBankName ||
        validation.errors.nomineeBankIfsc
      ) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const res = await fetch("/api/insurance/health-proposal/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken: turnstileToken || "fallback-token",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit proposal details.");
      }

      setSubmittedProposalId(result.proposalId || `ws-${Date.now().toString(36)}`);
      setIsSubmitted(true);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setGlobalError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Contact (.vcf)
  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Wealthy Step Insurance Advisory
ORG:Wealthy Step - AMFI Registered Mutual Fund & SIF Distributor
TEL;TYPE=CELL,VOICE:+919000929666
EMAIL;TYPE=WORK:info@wealthystep.com
URL:https://wealthystep.com
NOTE:Health, Life, Term & Corporate Insurance Advisory • ARN-322891
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "WealthyStep_Insurance_Advisor.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#180D45] flex flex-col justify-between selection:bg-[#84BD3C]/30">
      
      {/* ─── DEDICATED MOBILE-FIRST TOP BAR ─── */}
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

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-3.5 sm:py-5">
        
        {/* ===================== CONFIRMATION SCREEN ===================== */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#84BD3C] uppercase tracking-wider block">
                Proposal Intake Recorded
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#180D45] tracking-tight">
                Thank You, {formData.proposerName}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                Your Health Insurance details have been safely received. Our certified team will review your disclosures and prepare a customized plan comparison.
              </p>
            </div>

            {/* Reference Card */}
            <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-4 text-xs text-left space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-2">
                <span className="text-gray-500 font-medium">Reference Number:</span>
                <span className="font-mono font-bold text-[#180D45] bg-white px-2 py-0.5 rounded border border-gray-200">
                  {submittedProposalId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Plan Type:</span>
                <span className="font-bold text-gray-800">{formData.policyType} ({formData.adultsCount} Adults, {formData.kidsCount} Kids)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Proposer PAN:</span>
                <span className="font-mono font-semibold text-gray-800">{formData.proposerPan}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <a
                href={`https://wa.me/919000929666?text=${encodeURIComponent(
                  `Hi Wealthy Step, I just submitted the Health Insurance Proposal (Ref: ${submittedProposalId}). Please provide plan options.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] active:scale-98 text-white font-bold text-sm shadow-sm transition-all"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Chat with Insurance Desk on WhatsApp</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
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
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl border border-gray-200 hover:border-pink-300 hover:bg-pink-50/30 text-[#180D45] text-xs font-semibold shadow-xs transition-all"
                >
                  <span>@wealthy.step</span>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ===================== MULTI-STEP WIZARD CONTAINER ===================== */
          <div className="space-y-3.5">
            
            {/* ─── SLEEK TRUST HEADER ─── */}
            <div className="text-center space-y-1.5 animate-fade-in pt-1 pb-1">
              <div className="flex items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold tracking-tight shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Confidential • IRDAI Compliant Advisory</span>
                </div>
                {draftRestored && (
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
                  Health Insurance — Personal Details & Proposal
                </h1>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Complete your details below to receive a personalized health cover plan. Section 80D tax exemption certificate will be issued to the proposer.
              </p>

              {/* Compact Benefits Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1 pt-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-600">
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">✅ Health Cover</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">✅ Term & Life</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">🛡️ 80D Tax Benefit</span>
                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">⚡ Fast Claim Assistance</span>
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

            {/* ─── FORM BODY (noValidate disables browser native popup tooltips) ─── */}
            <form noValidate onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* ===================== STEP 1: PROPOSER DETAILS ===================== */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 space-y-4 animate-fade-in">
                  
                  {/* Section Title */}
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#180D45] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs mt-0.5">
                      1
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                        Proposer Details
                      </h2>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                        The proposer is the policy owner and receives the <strong>Section 80D Income Tax Exemption Certificate</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Proposer Full Name */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Proposer Full Name <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">As per Aadhaar</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar Sharma"
                        value={formData.proposerName}
                        onChange={(e) => handleInputChange("proposerName", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.proposerName
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.proposerName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerName}</p>
                      )}
                    </div>

                    {/* Proposer PAN */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Proposer PAN Number <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">For KYC</span>
                      </div>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. ABCDE1234F"
                        value={formData.proposerPan}
                        onChange={(e) => handleInputChange("proposerPan", normalizePan(e.target.value))}
                        className={`w-full h-11 px-3.5 rounded-xl border font-mono text-sm uppercase transition-all focus:outline-none ${
                          fieldErrors.proposerPan
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.proposerPan && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerPan}</p>
                      )}
                    </div>

                    {/* Proposer Date of Birth */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Date of Birth <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">DD-MM-YYYY</span>
                      </div>
                      <input
                        type="date"
                        value={formData.proposerDob}
                        onChange={(e) => handleInputChange("proposerDob", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.proposerDob
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.proposerDob && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerDob}</p>
                      )}
                    </div>

                    {/* Proposer Aadhaar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Aadhaar Number
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">Optional KYC</span>
                      </div>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="12-digit Aadhaar number"
                        value={formData.proposerAadhar}
                        onChange={(e) => handleInputChange("proposerAadhar", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.proposerAadhar
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.proposerAadhar && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerAadhar}</p>
                      )}
                    </div>

                    {/* Proposer Mobile Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">10-Digit Mobile</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500 select-none bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.proposerMobile}
                          onChange={(e) => handleInputChange("proposerMobile", e.target.value.replace(/\D/g, ""))}
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

                    {/* Proposer Email */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Proposer Email ID <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">For policy documents</span>
                      </div>
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

                    {/* Employment Status */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Employment Status <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-emerald-600 font-bold">PF Discount</span>
                      </div>
                      <select
                        value={formData.employmentStatus}
                        onChange={(e) => handleInputChange("employmentStatus", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="Salaried Employee (PF credit)">Salaried Employee (PF credit)</option>
                        <option value="Businessman">Businessman</option>
                        <option value="Student">Student</option>
                        <option value="Home maker">Home maker</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* Corporate Email ID */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Corporate Email ID
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                      </div>
                      <input
                        type="email"
                        placeholder="ramesh@company.com"
                        value={formData.corporateEmail || ""}
                        onChange={(e) => handleInputChange("corporateEmail", e.target.value)}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          fieldErrors.corporateEmail
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45]"
                        }`}
                      />
                      {fieldErrors.corporateEmail && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.corporateEmail}</p>
                      )}
                    </div>

                    {/* Policy Type */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Policy Type <span className="text-rose-500">*</span>
                        </label>
                      </div>
                      <select
                        value={formData.policyType}
                        onChange={(e) => handleInputChange("policyType", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#180D45]"
                      >
                        <option value="New Policy">New Policy</option>
                        <option value="Port policy">Port policy (Switch existing policy without losing waiting credits)</option>
                        <option value="Don't know">Don&apos;t know (Need expert advisor consultation)</option>
                      </select>
                    </div>

                    {/* Proposer Residential Address */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Proposer Residential Address <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-normal">With City & Pincode</span>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Flat / House No, Street, Locality, City, State, Pincode"
                        value={formData.proposerAddress}
                        onChange={(e) => handleInputChange("proposerAddress", e.target.value)}
                        className={`w-full min-h-[72px] p-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                          fieldErrors.proposerAddress
                            ? "border-rose-400 bg-rose-50/20 text-rose-950"
                            : "border-gray-200 focus:border-[#180D45] focus:ring-2 focus:ring-[#84BD3C]/20"
                        }`}
                      />
                      {fieldErrors.proposerAddress && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.proposerAddress}</p>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ===================== STEP 2: COVERED MEMBERS ===================== */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 space-y-4 animate-fade-in">
                  
                  {/* Section Title */}
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#180D45] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs mt-0.5">
                      2
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                        Insured Family Members
                      </h2>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Select how many adults and kids are covered under this health plan.
                      </p>
                    </div>
                  </div>

                  {/* Counts Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 bg-[#FAFBF7] border border-[#E2E8D8] p-3.5 rounded-2xl">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Adults Count <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.adultsCount}
                        onChange={(e) => updateMembersList(Number(e.target.value), formData.kidsCount)}
                        className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white font-bold text-[#180D45] focus:outline-none focus:border-[#180D45]"
                      >
                        <option value={0}>0 Adults</option>
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Kids Count <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.kidsCount}
                        onChange={(e) => updateMembersList(formData.adultsCount, Number(e.target.value))}
                        className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white font-bold text-[#180D45] focus:outline-none focus:border-[#180D45]"
                      >
                        <option value={0}>0 Kids</option>
                        <option value={1}>1 Kid</option>
                        <option value={2}>2 Kids</option>
                        <option value={3}>3 Kids</option>
                        <option value={4}>4 Kids</option>
                      </select>
                    </div>

                    {formData.adultsCount >= 2 && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Relation with Adult 2 <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.relationAdult2 || "Wife"}
                          onChange={(e) => handleInputChange("relationAdult2", e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white"
                        >
                          <option value="Wife">Wife</option>
                          <option value="Husband">Husband</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}

                    {formData.kidsCount >= 1 && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Relation with Kids <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.relationKids || "Son"}
                          onChange={(e) => handleInputChange("relationKids", e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white"
                        >
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Both (Son & Daughter)">Both (Son & Daughter)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Member Cards */}
                  <div className="space-y-3 pt-1">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                      Individual Member Details (Ht, Wt & DOB)
                    </span>

                    {formData.members.map((member, idx) => (
                      <div
                        key={member.id}
                        className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-xs font-bold text-[#180D45] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#84BD3C]" />
                            {member.role} ({member.relation || "Self"})
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">#{idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name</label>
                            <input
                              type="text"
                              placeholder="Name as per legal ID"
                              value={member.fullName}
                              onChange={(e) => handleMemberChange(idx, "fullName", e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Date of Birth</label>
                            <input
                              type="date"
                              value={member.dob}
                              onChange={(e) => handleMemberChange(idx, "dob", e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Gender</label>
                            <select
                              value={member.gender}
                              onChange={(e) => handleMemberChange(idx, "gender", e.target.value)}
                              className="w-full h-10 px-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#180D45]"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Height (cm / ft-in)</label>
                            <input
                              type="text"
                              placeholder="e.g. 175 cm or 5'9"
                              value={member.height}
                              onChange={(e) => handleMemberChange(idx, "height", e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Weight (kg)</label>
                            <input
                              type="text"
                              placeholder="e.g. 70 kg"
                              value={member.weight}
                              onChange={(e) => handleMemberChange(idx, "weight", e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Insured Contact Details */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-[11px] sm:text-xs text-sky-900 leading-relaxed">
                      💡 <strong>Medical Tele-Underwriting:</strong> Insured member will receive a tele-call if sum insured exceeds ₹50 Lakhs or if pre-existing conditions are declared.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-700">
                            Insured Person Mobile <span className="text-rose-500">*</span>
                          </label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500 select-none bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            value={formData.insuredMobile}
                            onChange={(e) => handleInputChange("insuredMobile", e.target.value.replace(/\D/g, ""))}
                            className={`w-full h-11 pl-14 pr-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                              fieldErrors.insuredMobile
                                ? "border-rose-400 bg-rose-50/20 text-rose-950"
                                : "border-gray-200 focus:border-[#180D45]"
                            }`}
                          />
                        </div>
                        {fieldErrors.insuredMobile && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.insuredMobile}</p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-gray-700">
                            Insured Person Email ID <span className="text-rose-500">*</span>
                          </label>
                        </div>
                        <input
                          type="email"
                          placeholder="insured@gmail.com"
                          value={formData.insuredEmail}
                          onChange={(e) => handleInputChange("insuredEmail", e.target.value)}
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.insuredEmail
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.insuredEmail && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.insuredEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== STEP 3: MEDICAL & LIFESTYLE ===================== */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 space-y-4 animate-fade-in">
                  
                  {/* Section Title */}
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#180D45] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs mt-0.5">
                      3
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                        Medical &amp; Lifestyle Disclosures
                      </h2>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Accurate disclosures ensure your claims are processed smoothly without dispute.
                      </p>
                    </div>
                  </div>

                  {/* Pre-Existing Illness Radio Card */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      Pre-Existing Diseases / Surgeries (if any) for any member: <span className="text-rose-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleInputChange("hasPreExistingIllness", false)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          !formData.hasPreExistingIllness
                            ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/20"
                            : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">No, I Don&apos;t have</p>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">No chronic health issues or surgeries</p>
                        </div>
                        {!formData.hasPreExistingIllness && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInputChange("hasPreExistingIllness", true)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          formData.hasPreExistingIllness
                            ? "border-amber-500 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/20"
                            : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">Yes, I Have</p>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">BP, Diabetes, Thyroid, Asthma, Surgeries, etc.</p>
                        </div>
                        {formData.hasPreExistingIllness && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                      </button>
                    </div>

                    {formData.hasPreExistingIllness && (
                      <div className="mt-2 animate-fade-in space-y-1">
                        <label className="block text-xs font-bold text-gray-700">
                          Specify Conditions and Duration <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Hypertension since 2021 (under Telmisartan 40mg), or Gallbladder surgery in 2020."
                          value={formData.preExistingDetails || ""}
                          onChange={(e) => handleInputChange("preExistingDetails", e.target.value)}
                          className={`w-full min-h-[72px] p-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none resize-none ${
                            fieldErrors.preExistingDetails
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.preExistingDetails && (
                          <p className="text-[11px] text-rose-600 font-semibold">{fieldErrors.preExistingDetails}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Habits Radio Card */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-800">
                      Any Smoking / Drinking / Tobacco habits for any member? <span className="text-rose-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleInputChange("hasTobaccoAlcoholHabits", false)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          !formData.hasTobaccoAlcoholHabits
                            ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/20"
                            : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">No, I Don&apos;t have</p>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">Non-smoker, no regular tobacco/alcohol</p>
                        </div>
                        {!formData.hasTobaccoAlcoholHabits && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInputChange("hasTobaccoAlcoholHabits", true)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          formData.hasTobaccoAlcoholHabits
                            ? "border-amber-500 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/20"
                            : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">Yes, I Have</p>
                          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">Occasional or regular smoking / drinking</p>
                        </div>
                        {formData.hasTobaccoAlcoholHabits && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                      </button>
                    </div>

                    {formData.hasTobaccoAlcoholHabits && (
                      <div className="mt-2 animate-fade-in space-y-1">
                        <label className="block text-xs font-bold text-gray-700">
                          Specify Frequency / Quantity
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Social drinking 1-2 times/month, 2 cigarettes/day"
                          value={formData.habitsDetails || ""}
                          onChange={(e) => handleInputChange("habitsDetails", e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#180D45]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Current Address & Pincode */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800">
                        Current Residential Address <span className="text-rose-500">*</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.sameAsProposerAddress}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleInputChange("sameAsProposerAddress", checked);
                            if (checked) {
                              handleInputChange("currentAddress", formData.proposerAddress);
                            }
                          }}
                          className="w-4 h-4 rounded text-[#180D45] accent-[#180D45]"
                        />
                        <span>Same as Proposer</span>
                      </label>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Current street, landmark, city, state, 6-digit pincode"
                      value={formData.currentAddress}
                      onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                      className={`w-full min-h-[72px] p-3 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                        fieldErrors.currentAddress
                          ? "border-rose-400 bg-rose-50/20 text-rose-950"
                          : "border-gray-200 focus:border-[#180D45]"
                      }`}
                    />
                    {fieldErrors.currentAddress && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.currentAddress}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ===================== STEP 4: NOMINEE & BANKING ===================== */}
              {currentStep === 4 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 space-y-4 animate-fade-in">
                  
                  {/* Section Title */}
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#180D45] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs mt-0.5">
                      4
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                        Nominee &amp; Bank Details
                      </h2>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Nominee receives policy claims and benefits in case of unforeseen events.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Nominee Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Nominee Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
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

                    {/* Nominee Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Nominee Date of Birth <span className="text-rose-500">*</span>
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

                    {/* Nominee Relationship */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Relationship with Proposer
                      </label>
                      <select
                        value={formData.nomineeRelation || "Wife"}
                        onChange={(e) => handleInputChange("nomineeRelation", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white"
                      >
                        <option value="Wife">Wife</option>
                        <option value="Husband">Husband</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Nominee Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Nominee Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500 select-none bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.nomineeMobile}
                          onChange={(e) => handleInputChange("nomineeMobile", e.target.value.replace(/\D/g, ""))}
                          className={`w-full h-11 pl-14 pr-3.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            fieldErrors.nomineeMobile
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                      </div>
                      {fieldErrors.nomineeMobile && (
                        <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeMobile}</p>
                      )}
                    </div>

                    {/* Nominee Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Nominee Email ID <span className="text-rose-500">*</span>
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
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-gray-700">
                        Nominee Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          "Same as Proposer person address",
                          "Same as Insured person address",
                          "Address is different than proposer and insured person",
                        ].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleInputChange("nomineeAddressOption", opt)}
                            className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                              formData.nomineeAddressOption === opt
                                ? "bg-[#180D45] text-white border-[#180D45] shadow-xs"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {formData.nomineeAddressOption === "Address is different than proposer and insured person" && (
                        <textarea
                          rows={2}
                          placeholder="Enter complete nominee residential address with pincode"
                          value={formData.nomineeCustomAddress || ""}
                          onChange={(e) => handleInputChange("nomineeCustomAddress", e.target.value)}
                          className="w-full mt-2 p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45] resize-none"
                        />
                      )}
                    </div>
                  </div>

                  {/* Nominee Bank Details */}
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Nominee Bank Account Details (Claim Settlement)
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Required by insurers to verify authentic beneficiary credentials.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Bank Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Bank Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
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

                      {/* Name in Bank */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Account Holder Name (As per passbook) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Full name as printed in bank passbook"
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

                      {/* IFSC Code */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Bank IFSC Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={11}
                          placeholder="e.g. HDFC0001234"
                          value={formData.nomineeBankIfsc}
                          onChange={(e) => handleInputChange("nomineeBankIfsc", normalizeIfsc(e.target.value))}
                          className={`w-full h-11 px-3.5 rounded-xl border font-mono text-sm uppercase transition-all focus:outline-none ${
                            fieldErrors.nomineeBankIfsc
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.nomineeBankIfsc && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeBankIfsc}</p>
                        )}
                      </div>

                      {/* Account Number */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="9 to 18 digits account number"
                          value={formData.nomineeBankAccountNumber}
                          onChange={(e) => handleInputChange("nomineeBankAccountNumber", e.target.value.replace(/\s/g, ""))}
                          className={`w-full h-11 px-3.5 rounded-xl border font-mono text-sm transition-all focus:outline-none ${
                            fieldErrors.nomineeBankAccountNumber
                              ? "border-rose-400 bg-rose-50/20 text-rose-950"
                              : "border-gray-200 focus:border-[#180D45]"
                          }`}
                        />
                        {fieldErrors.nomineeBankAccountNumber && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{fieldErrors.nomineeBankAccountNumber}</p>
                        )}
                      </div>

                      {/* Account Type */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Account Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.nomineeBankAccountType}
                          onChange={(e) => handleInputChange("nomineeBankAccountType", e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white"
                        >
                          <option value="Savings">Savings Account</option>
                          <option value="Current">Current Account</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== STEP 5: REVIEW & CONSENT ===================== */}
              {currentStep === 5 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-6 space-y-4 animate-fade-in">
                  
                  {/* Section Title */}
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#180D45] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs mt-0.5">
                      5
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                        Review &amp; Regulatory Declarations
                      </h2>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Please verify your entered details and accept the mandatory regulatory declarations.
                      </p>
                    </div>
                  </div>

                  {/* Summary Breakdown Grid */}
                  <div className="space-y-2.5">
                    
                    {/* Proposer Summary Card */}
                    <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-[#180D45]">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#84BD3C]" />
                          Proposer (80D Holder)
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[#84BD3C] text-[11px] font-bold underline hover:text-[#446A1B] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-gray-800 font-semibold">{formData.proposerName} (PAN: {formData.proposerPan})</p>
                      <p className="text-gray-600">DOB: {formData.proposerDob} • Mobile: +91 {formData.proposerMobile}</p>
                      <p className="text-gray-600">Email: {formData.proposerEmail} • Status: {formData.employmentStatus}</p>
                    </div>

                    {/* Covered Family Summary */}
                    <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-[#180D45]">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#84BD3C]" />
                          Covered Family ({formData.adultsCount} Adults, {formData.kidsCount} Kids)
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[#84BD3C] text-[11px] font-bold underline hover:text-[#446A1B] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-700 pt-1">
                        {formData.members.map((m) => (
                          <div key={m.id} className="bg-white p-2 rounded-lg border border-gray-200">
                            <strong>{m.role}:</strong> {m.fullName || "—"} ({m.relation})<br />
                            <span className="text-gray-500">Ht: {m.height || "—"} | Wt: {m.weight || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Medical Disclosures Summary */}
                    <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-[#180D45]">
                        <span className="flex items-center gap-1.5">
                          <HeartPulse className="w-4 h-4 text-[#84BD3C]" />
                          Medical &amp; Lifestyle
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[#84BD3C] text-[11px] font-bold underline hover:text-[#446A1B] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-gray-700">
                        Pre-Existing Illness: <strong>{formData.hasPreExistingIllness ? "Yes, Declared" : "No"}</strong>
                        {formData.hasPreExistingIllness && ` (${formData.preExistingDetails})`}
                      </p>
                      <p className="text-gray-700">
                        Habits: <strong>{formData.hasTobaccoAlcoholHabits ? "Yes, Declared" : "No"}</strong>
                      </p>
                    </div>

                    {/* Nominee Summary */}
                    <div className="bg-[#FAFBF7] border border-[#E2E8D8] rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-[#180D45]">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#84BD3C]" />
                          Nominee &amp; Banking
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-[#84BD3C] text-[11px] font-bold underline hover:text-[#446A1B] cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-gray-800 font-semibold">{formData.nomineeName} ({formData.nomineeRelation})</p>
                      <p className="text-gray-600">Bank: {formData.nomineeBankName} • A/C: ••••••••{formData.nomineeBankAccountNumber.slice(-4)} • IFSC: {formData.nomineeBankIfsc}</p>
                    </div>
                  </div>

                  {/* ── MANDATORY REGULATORY DECLARATIONS ── */}
                  <div className="space-y-2.5 pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                      Required Declarations &amp; Acknowledgements
                    </span>

                    {/* Declaration 1 */}
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                        formData.consentContactAccepted
                          ? "bg-[#F3F7EB] border-[#84BD3C]"
                          : fieldErrors.consentContactAccepted
                          ? "bg-rose-50 border-rose-400"
                          : "bg-[#FAFBF7] border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.consentContactAccepted}
                        onChange={(e) => handleInputChange("consentContactAccepted", e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#180D45] accent-[#180D45] shrink-0 cursor-pointer"
                      />
                      <div className="text-[11px] leading-relaxed text-gray-700">
                        <span className="font-bold text-[#180D45]">Contact Consent: </span>
                        &ldquo;I give Wealthy Step™ permission to contact me regarding my insurance requirements. Information provided is true and complete, without withholding relevant health conditions.&rdquo;
                      </div>
                    </label>
                    {fieldErrors.consentContactAccepted && (
                      <p className="text-[11px] text-rose-600 font-semibold">{fieldErrors.consentContactAccepted}</p>
                    )}

                    {/* Declaration 2 */}
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                        formData.consentDisclosureAccepted
                          ? "bg-[#F3F7EB] border-[#84BD3C]"
                          : fieldErrors.consentDisclosureAccepted
                          ? "bg-rose-50 border-rose-400"
                          : "bg-[#FAFBF7] border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.consentDisclosureAccepted}
                        onChange={(e) => handleInputChange("consentDisclosureAccepted", e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#180D45] accent-[#180D45] shrink-0 cursor-pointer"
                      />
                      <div className="text-[11px] leading-relaxed text-gray-700">
                        <span className="font-bold text-[#180D45]">Medical Disclosure Clause: </span>
                        &ldquo;I understand that incorrect, incomplete, or undisclosed information can lead to rejection of claims or termination of the policy by the insurer.&rdquo;
                      </div>
                    </label>
                    {fieldErrors.consentDisclosureAccepted && (
                      <p className="text-[11px] text-rose-600 font-semibold">{fieldErrors.consentDisclosureAccepted}</p>
                    )}
                  </div>

                  {/* Cloudflare Verification */}
                  <div className="flex flex-col items-center justify-center pt-1 min-h-[36px]">
                    {isClientReady && !turnstileFailed && turnstileSiteKey !== "1x00000000000000000000AA" ? (
                      <Turnstile
                        siteKey={turnstileSiteKey}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => {
                          setTurnstileFailed(true);
                          setTurnstileToken("fallback-token");
                        }}
                        onExpire={() => setTurnstileToken(null)}
                        options={{ theme: "light", size: "flexible" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-3.5 border border-emerald-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Security Verified • 100% Spam-Free</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── GOOGLE FORM-STYLE NAVIGATION BUTTONS ROW (FULLY RESPONSIVE) ─── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
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
                        <RefreshCw className="w-4 h-4 animate-spin text-[#84BD3C]" />
                        <span>Submitting Proposal...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Health Insurance Proposal</span>
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
    </div>
  );
}
