"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Download,
  Lock,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  ChevronRight,
  Eye,
  FolderOpen,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { PremiumDatePicker } from "@/components/ui/PremiumDatePicker";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

interface PolicyDocument {
  id: string;
  title: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

interface ClientData {
  id?: string;
  name: string;
  email: string;
  policyNumber?: string;
}

export default function PolicyDownloadPage() {
  // Step 1: Input Form State
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  // Step 2: OTP State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Step 3: Verified Client & Document State
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    data?: ArrayBuffer | null;
    blobUrl?: string | null;
    title: string;
    fileSize?: number;
  }>({ isOpen: false, data: null, blobUrl: null, title: "" });

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pasted[i] || "";
        }
        setOtp(newOtp);
        const nextIndex = Math.min(pasted.length, 5);
        otpInputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Submit Identity Details -> Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!mobile.trim() || !email.trim() || !dob.trim()) {
      setErrorMsg("Please fill in all verification fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/policy/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, email, dob }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to request verification code.");
      }

      setStep(2);
      setResendCooldown(60);
      setCanResend(false);
      setSuccessMsg(data.message || "Verification code sent to your registered email address.");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/policy/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, email, dob }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code.");

      setResendCooldown(60);
      setCanResend(false);
      setSuccessMsg("A fresh 6-digit code has been dispatched to your email.");
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP -> Receive Session Token & Fetch Documents
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const enteredOtp = otp.join("").trim();

    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/policy/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, email, dob, otp: enteredOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP code.");
      }

      setSessionToken(data.sessionToken);
      setClient(data.client);
      setStep(3);

      await fetchDocuments(data.sessionToken);
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Fetch Client Documents
  const fetchDocuments = async (token: string) => {
    try {
      const res = await fetch("/api/policy/documents", {
        headers: { "x-session-token": token },
      });

      const data = await res.json();
      if (res.ok && data.documents) {
        setDocuments(data.documents);
      } else {
        throw new Error(data.error || "Unable to load documents.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load policy documents.");
    }
  };

  // Download a single document
  const handleDownload = async (docId: string, title: string) => {
    if (!sessionToken) return;
    setDownloadingId(docId);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/policy/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken,
        },
        body: JSON.stringify({ documentId: docId }),
      });

      const data = await res.json();

      if (!res.ok || !data.downloadUrl) {
        throw new Error(data.error || "Could not generate download link.");
      }

      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.setAttribute("download", data.filename || `${title}.pdf`);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to download document. Session may have expired.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Preview Document In-Browser
  const handlePreview = async (docId: string, title: string, fileSize?: number) => {
    if (!sessionToken) return;
    setPreviewingId(docId);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/policy/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken,
        },
        body: JSON.stringify({ documentId: docId, stream: true }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not generate document preview.");
      }

      const arrayBuffer = await res.arrayBuffer();
      const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);

      setPreviewModal({
        isOpen: true,
        data: arrayBuffer,
        blobUrl: blobUrl,
        title: title,
        fileSize: fileSize,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load document preview. Session may have expired.");
    } finally {
      setPreviewingId(null);
    }
  };

  // End Session / Logout
  const handleEndSession = () => {
    setSessionToken(null);
    setClient(null);
    setDocuments([]);
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FAFBF7] via-[#F4F7EE] to-[#E9EFE0] py-5 sm:py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between font-sans selection:bg-[#84BD3C]/30 text-gray-800">
      <div className="max-w-2xl w-full mx-auto space-y-4 sm:space-y-5">
        {/* Header Title & Security Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#84BD3C]/20 border border-[#84BD3C]/40 text-[#2C4A11] text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#446A1B]" />
            <span>256-Bit Encrypted Policy Vault</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-[#180D45] tracking-tight">
            Download Your <span className="text-[#446A1B]">Policy Documents</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Enter your mobile number, email, and date of birth to receive an OTP and download your policy bonds securely.
          </p>
        </div>

        {/* 3-Step Interactive Stepper Indicator */}
        <div className="w-full max-w-lg mx-auto">
          {/* Desktop & Tablet Stepper (sm and up) */}
          <div className="hidden sm:flex items-center justify-between bg-white/95 backdrop-blur-sm p-1.5 rounded-2xl border border-[#C7D9A8] shadow-2xs">
            {/* Step 1 */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                step === 1
                  ? "bg-[#180D45] text-white shadow-xs"
                  : step > 1
                  ? "bg-[#F3F7EB] text-[#3C6415]"
                  : "text-gray-400"
              }`}
            >
              <span className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                step === 1 ? "bg-[#84BD3C] text-[#180D45]" : step > 1 ? "bg-[#84BD3C] text-[#180D45]" : "bg-gray-200 text-gray-600"
              }`}>
                {step > 1 ? "✓" : "1"}
              </span>
              <span>1. Enter Details</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />

            {/* Step 2 */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                step === 2
                  ? "bg-[#180D45] text-white shadow-xs"
                  : step > 2
                  ? "bg-[#F3F7EB] text-[#3C6415]"
                  : "text-gray-400"
              }`}
            >
              <span className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                step === 2 ? "bg-[#84BD3C] text-[#180D45]" : step > 2 ? "bg-[#84BD3C] text-[#180D45]" : "bg-gray-200 text-gray-600"
              }`}>
                {step > 2 ? "✓" : "2"}
              </span>
              <span>2. Enter OTP</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />

            {/* Step 3 */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                step === 3
                  ? "bg-[#84BD3C] text-[#180D45] shadow-xs font-black"
                  : "text-gray-400"
              }`}
            >
              <span className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                step === 3 ? "bg-[#180D45] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                3
              </span>
              <span>3. Download PDF</span>
            </div>
          </div>

          {/* Mobile Stepper (< 640px) */}
          <div className="grid grid-cols-3 gap-1 sm:hidden bg-white/95 backdrop-blur-sm p-1 rounded-2xl border border-[#C7D9A8] shadow-2xs text-center">
            {/* Mobile Step 1 */}
            <div
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all truncate ${
                step === 1
                  ? "bg-[#180D45] text-white shadow-xs"
                  : step > 1
                  ? "bg-[#F3F7EB] text-[#3C6415]"
                  : "text-gray-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                step === 1 ? "bg-[#84BD3C] text-[#180D45]" : step > 1 ? "bg-[#84BD3C] text-[#180D45]" : "bg-gray-200 text-gray-600"
              }`}>
                {step > 1 ? "✓" : "1"}
              </span>
              <span className="truncate">Identity</span>
            </div>

            {/* Mobile Step 2 */}
            <div
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all truncate ${
                step === 2
                  ? "bg-[#180D45] text-white shadow-xs"
                  : step > 2
                  ? "bg-[#F3F7EB] text-[#3C6415]"
                  : "text-gray-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                step === 2 ? "bg-[#84BD3C] text-[#180D45]" : step > 2 ? "bg-[#84BD3C] text-[#180D45]" : "bg-gray-200 text-gray-600"
              }`}>
                {step > 2 ? "✓" : "2"}
              </span>
              <span className="truncate">OTP</span>
            </div>

            {/* Mobile Step 3 */}
            <div
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all truncate ${
                step === 3
                  ? "bg-[#84BD3C] text-[#180D45] shadow-xs font-black"
                  : "text-gray-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                step === 3 ? "bg-[#180D45] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                3
              </span>
              <span className="truncate">Download</span>
            </div>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-950 text-xs sm:text-sm font-medium shadow-2xs animate-fade-in">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-950 text-xs sm:text-sm font-medium shadow-2xs animate-fade-in">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">{successMsg}</div>
          </div>
        )}

        {/* ======================= STEP 1: IDENTITY DETAILS FORM ======================= */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur-md border border-[#C7D9A8] rounded-3xl shadow-xl shadow-[#180D45]/5 p-5 sm:p-7 transition-all">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-[#F3F7EB] flex items-center justify-center text-[#3C6415] shadow-2xs">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#180D45]">Client Identity Verification</h2>
                <p className="text-[11px] text-gray-500">
                  Enter your registered mobile, email, and DOB to receive a single-use access code.
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              {/* Mobile Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Registered Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* DOB Picker */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Date of Birth (DD/MM/YYYY) *
                </label>
                <PremiumDatePicker
                  value={dob}
                  onChange={(dateStr) => setDob(dateStr)}
                  required
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#180D45] hover:bg-[#25156B] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-xl disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#84BD3C]" />
                      <span>Sending Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badge */}
              <p className="text-center text-[11px] text-gray-500 pt-1 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#446A1B]" />
                <span>Zero password storage. Protected by end-to-end TLS encryption.</span>
              </p>
            </form>
          </div>
        )}

        {/* ======================= STEP 2: OTP VERIFICATION FORM ======================= */}
        {step === 2 && (
          <div className="bg-white/95 backdrop-blur-md border border-[#C7D9A8] rounded-3xl shadow-xl shadow-[#180D45]/5 p-5 sm:p-7 transition-all space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#84BD3C]/20 text-[#3C6415] flex items-center justify-center mx-auto shadow-2xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#180D45]">Enter Verification Code</h2>
              <p className="text-xs text-gray-600">
                We sent a 6-digit OTP code to <strong className="text-[#180D45]">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono bg-[#FAFBF7] border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#84BD3C] focus:bg-white transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Resend & Edit Navigation */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-gray-500 hover:text-[#180D45] flex items-center gap-1 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit details</span>
                </button>

                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-[#446A1B] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Resend OTP</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Resend in {resendCooldown}s</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Verify Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#180D45] hover:bg-[#25156B] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-xl disabled:opacity-50 cursor-pointer active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#84BD3C]" />
                      <span>Verifying Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Access Policy Vault</span>
                      <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= STEP 3: VERIFIED CLIENT DOCUMENT VAULT ======================= */}
        {step === 3 && (
          <div className="space-y-4 sm:space-y-5">
            {/* Verified Greeting Card */}
            <div className="bg-gradient-to-r from-[#110834] via-[#180D45] to-[#25156B] rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-[#180D45]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84BD3C]/20 text-[#84BD3C] text-[11px] font-extrabold mb-1.5 border border-[#84BD3C]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticated Secure Session</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  Welcome, {client?.name || "Valued Client"}
                </h2>
                <p className="text-[11px] text-gray-300">
                  Registered Email: {client?.email} {client?.policyNumber && `• Master Policy: ${client.policyNumber}`}
                </p>
              </div>

              <button
                onClick={handleEndSession}
                className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm transition border border-white/10 cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-[#84BD3C]" />
                <span>End Session</span>
              </button>
            </div>

            {/* Document Listing Vault */}
            <div className="bg-white/95 backdrop-blur-md border border-[#C7D9A8] rounded-3xl shadow-xl shadow-[#180D45]/5 p-5 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#F3F7EB] flex items-center justify-center text-[#3C6415] shadow-2xs">
                    <FolderOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#180D45]">Available Policy Documents</h3>
                    <p className="text-[11px] text-gray-500">
                      Encrypted PDF copies available for online preview and instant download.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-[#FAFBF7] px-2.5 py-1 rounded-xl border border-gray-200">
                  <Clock className="w-3.5 h-3.5 text-[#446A1B]" />
                  <span>15 min session</span>
                </div>
              </div>

              {/* Documents List */}
              <div className="mt-4 space-y-2.5">
                {documents.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-[#FAFBF7] rounded-2xl border border-dashed border-gray-200">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700">No Documents Uploaded Yet</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 max-w-sm mx-auto">
                      Your advisor is preparing your policy bonds. Please check back shortly or reach out to our team.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-gray-200/90 bg-[#FAFBF7] hover:bg-white hover:border-[#84BD3C] hover:shadow-xs transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform shadow-2xs shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#180D45] group-hover:text-[#446A1B] transition-colors truncate">
                            {doc.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            PDF • {formatBytes(doc.file_size)} • Uploaded {formatDate(doc.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Inline Preview Button */}
                        <button
                          onClick={() => handlePreview(doc.id, doc.title, doc.file_size)}
                          disabled={previewingId === doc.id}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#180D45] hover:bg-[#180D45] hover:text-white text-[#180D45] text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60 active:scale-95"
                        >
                          {previewingId === doc.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                              <span>Opening...</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-[#446A1B]" />
                              <span>Preview</span>
                            </>
                          )}
                        </button>

                        {/* Direct Download Button */}
                        <button
                          onClick={() => handleDownload(doc.id, doc.title)}
                          disabled={downloadingId === doc.id}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#180D45] hover:bg-[#84BD3C] hover:text-[#180D45] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer disabled:opacity-60 active:scale-95"
                        >
                          {downloadingId === doc.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Assistance Card */}
            <div className="bg-[#F3F7EB] border border-[#C7D9A8] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4.5 h-4.5 text-[#446A1B] shrink-0" />
                <p className="text-[11px] text-[#283C15] font-medium">
                  Have questions regarding your policy documents? Contact your dedicated Wealthy Step advisor anytime.
                </p>
              </div>
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-extrabold text-[#180D45] hover:underline shrink-0"
              >
                <span>Support</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Security Assurance Footer */}
        <div className="text-center text-[11px] text-gray-500 space-y-0.5 pt-2">
          <p className="font-semibold text-gray-700">Wealthy Step • AMFI Registered Mutual Fund Distributor • ARN-322891</p>
          <p className="text-gray-400">All policy files are stored with end-to-end access control and zero third-party disclosure.</p>
        </div>
      </div>

      {/* In-Browser PDF Preview Modal */}
      <PdfViewerModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, data: null, blobUrl: null, title: "" })}
        pdfData={previewModal.data}
        blobUrl={previewModal.blobUrl}
        title={previewModal.title}
        fileSize={previewModal.fileSize}
      />
    </div>
  );
}
