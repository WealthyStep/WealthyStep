"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import QRCode from "qrcode";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Sparkles,
  QrCode,
  Download,
  Copy,
  Check,
  Maximize2,
  Trash2,
  Edit,
  Eye,
  FileSpreadsheet,
  MessageSquare,
  Clock,
  ChevronDown,
  Tag,
  ShieldCheck,
  Send,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import {
  OCCUPATION_OPTIONS,
  INTEREST_OPTIONS,
  STATUS_OPTIONS,
  ParticipantStatus,
  Occupation,
  normalizeMobile,
  isValidEmail,
  isValidMobile,
} from "@/lib/feedback-validation";
import { downloadBrandedQrCard, downloadCleanQrCode } from "@/lib/qr-card-generator";

export interface ProgramParticipant {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  occupation: string;
  interested_in: string[];
  consent_given: boolean;
  consent_text?: string;
  status: string;
  notes: string;
  source?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

interface ProgramFeedbackTabProps {
  authToken: string | null;
  handleSessionExpired: () => void;
  showFeedback: (type: "success" | "error", message: string) => void;
  onTotalCountChange?: (count: number) => void;
}

const QUICK_NOTE_PRESETS = [
  "Interested in Mutual Fund SIP",
  "Needs Health / Term Insurance",
  "Call Evening (6 PM - 8 PM)",
  "Call Weekend (Sat / Sun)",
  "Follow Up Tomorrow",
  "Wants Retirement Calculation",
  "Child Education Planning",
  "Busy / Requested Callback",
  "Not Interested Right Now",
];

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Contacted: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Interested: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Not Interested": { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" },
  "Call Evening": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Call Tomorrow": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Call Weekend": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Follow Up": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Converted: { bg: "bg-lime-50", text: "text-lime-800", border: "border-lime-300" },
  Closed: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export function ProgramFeedbackTab({
  authToken,
  handleSessionExpired,
  showFeedback,
  onTotalCountChange,
}: ProgramFeedbackTabProps) {
  // Main Data State
  const [participants, setParticipants] = useState<ProgramParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    newCount: 0,
    followUpCount: 0,
    interestedCount: 0,
    convertedCount: 0,
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [occupationFilter, setOccupationFilter] = useState("ALL");
  const [interestFilter, setInterestFilter] = useState("ALL");

  // QR Code State
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isDownloadingClean, setIsDownloadingClean] = useState(false);
  const [tableSetupRequired, setTableSetupRequired] = useState(false);
  const [isCopiedSql, setIsCopiedSql] = useState(false);

  // Notes Modal/Drawer State
  const [activeParticipantForNotes, setActiveParticipantForNotes] = useState<ProgramParticipant | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteStatus, setNoteStatus] = useState("New");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // View Details Modal State
  const [viewingParticipant, setViewingParticipant] = useState<ProgramParticipant | null>(null);

  // Add / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<ProgramParticipant | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    occupation: "Salaried",
    interested_in: [] as string[],
    status: "New",
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Delete State
  const [participantToDelete, setParticipantToDelete] = useState<ProgramParticipant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Participant Form URL
  const formUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/participant-form/`;
    }
    return "https://wealthystep.com/participant-form/";
  }, []);

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(formUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#180D45",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error:", err));
  }, [formUrl]);

  // Callback refs to prevent unnecessary re-fetches
  const showFeedbackRef = React.useRef(showFeedback);
  showFeedbackRef.current = showFeedback;

  const onTotalCountChangeRef = React.useRef(onTotalCountChange);
  onTotalCountChangeRef.current = onTotalCountChange;

  const handleSessionExpiredRef = React.useRef(handleSessionExpired);
  handleSessionExpiredRef.current = handleSessionExpired;

  const SQL_MIGRATION_TEXT = `-- Run this in your Supabase Dashboard > SQL Editor:
CREATE TABLE IF NOT EXISTS public.program_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    age INTEGER NOT NULL,
    occupation TEXT NOT NULL DEFAULT 'Salaried',
    interested_in TEXT[] NOT NULL DEFAULT '{}'::text[],
    consent_given BOOLEAN NOT NULL DEFAULT true,
    consent_text TEXT NOT NULL,
    session_date TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'New',
    notes TEXT DEFAULT '',
    source TEXT DEFAULT 'Financial Freedom Awareness Program',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_program_participants_created_at ON public.program_participants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_participants_status ON public.program_participants(status);
CREATE INDEX IF NOT EXISTS idx_program_participants_email ON public.program_participants(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_program_participants_mobile ON public.program_participants(mobile);

GRANT ALL ON TABLE public.program_participants TO postgres, anon, authenticated, service_role;
ALTER TABLE public.program_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access to program_participants" ON public.program_participants;
CREATE POLICY "Allow service_role full access to program_participants" ON public.program_participants FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access to program_participants" ON public.program_participants;
CREATE POLICY "Allow authenticated full access to program_participants" ON public.program_participants FOR ALL TO authenticated USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
SELECT count(*) AS ready_participants FROM public.program_participants;`;

  const handleCopyMigrationSql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_TEXT);
    setIsCopiedSql(true);
    showFeedbackRef.current("success", "Supabase SQL migration copied to clipboard!");
    setTimeout(() => setIsCopiedSql(false), 3000);
  };

  // Fetch Participants
  const fetchParticipants = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (occupationFilter !== "ALL") params.set("occupation", occupationFilter);
      if (interestFilter !== "ALL") params.set("interest", interestFilter);

      const res = await fetch(`/api/admin/program-participants?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpiredRef.current();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load participants.");

      if (data.tableSetupRequired) {
        setTableSetupRequired(true);
      } else {
        setTableSetupRequired(false);
      }

      const list: ProgramParticipant[] = data.participants || [];
      setParticipants(list);
      if (data.metrics) setMetrics(data.metrics);
      if (onTotalCountChangeRef.current) onTotalCountChangeRef.current(list.length);
    } catch (err: any) {
      console.error("Fetch participants error:", err);
      showFeedbackRef.current("error", err.message || "Failed to load participant submissions.");
    } finally {
      setIsLoading(false);
    }
  }, [authToken, searchQuery, statusFilter, occupationFilter, interestFilter]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Copy Link Handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    setIsCopiedLink(true);
    showFeedbackRef.current("success", "Participant Form link copied to clipboard!");
    setTimeout(() => setIsCopiedLink(false), 3000);
  };

  // Download Ultra-Premium Branded Presentation Slide Card (1200x1500 PNG)
  const handleDownloadBrandedCard = async () => {
    try {
      setIsDownloadingCard(true);
      await downloadBrandedQrCard(formUrl, "WealthyStep_Financial_Freedom_Program_Slide.png");
      showFeedback("success", "Ultra-Premium Presentation Slide Card (1200x1500 PNG) downloaded!");
    } catch (err: any) {
      console.error("Card download error:", err);
      showFeedback("error", "Failed to generate branded presentation card.");
    } finally {
      setIsDownloadingCard(false);
    }
  };

  // Download High-Res Clean QR Code PNG (1024x1024)
  const handleDownloadCleanQr = async () => {
    try {
      setIsDownloadingClean(true);
      await downloadCleanQrCode(formUrl, "WealthyStep_Participant_Form_QR.png");
      showFeedback("success", "Clean High-Resolution QR Code (1024x1024 PNG) downloaded!");
    } catch (err: any) {
      console.error("QR Download error:", err);
      showFeedback("error", "Failed to download QR code.");
    } finally {
      setIsDownloadingClean(false);
    }
  };

  // Open Notes Drawer
  const handleOpenNotes = (p: ProgramParticipant) => {
    setActiveParticipantForNotes(p);
    setNoteContent(p.notes || "");
    setNoteStatus(p.status || "New");
  };

  // Save Notes and Status
  const handleSaveNotes = async () => {
    if (!activeParticipantForNotes || !authToken) return;
    setIsSavingNotes(true);

    try {
      const res = await fetch(`/api/admin/program-participants/${activeParticipantForNotes.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          notes: noteContent,
          status: noteStatus,
        }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update notes.");

      // Optimistic update
      setParticipants((prev) =>
        prev.map((item) =>
          item.id === activeParticipantForNotes.id
            ? { ...item, notes: noteContent, status: noteStatus }
            : item
        )
      );

      showFeedback("success", `Notes & status updated for ${activeParticipantForNotes.name}.`);
      setActiveParticipantForNotes(null);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Quick In-Row Status Change
  const handleInlineStatusChange = async (id: string, newStatus: string) => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/admin/program-participants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");

      setParticipants((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      showFeedback("success", `Status changed to "${newStatus}".`);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to update status.");
    }
  };

  // Open Form Modal (Add / Edit)
  const handleOpenAddModal = () => {
    setEditingParticipant(null);
    setFormValues({
      name: "",
      email: "",
      mobile: "",
      age: "",
      occupation: "Salaried",
      interested_in: [],
      status: "New",
      notes: "",
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (p: ProgramParticipant) => {
    setEditingParticipant(p);
    setFormValues({
      name: p.name,
      email: p.email,
      mobile: p.mobile,
      age: String(p.age),
      occupation: p.occupation,
      interested_in: p.interested_in || [],
      status: p.status,
      notes: p.notes || "",
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Save Participant Form (Add or Edit)
  const handleSaveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formValues.name.trim() || formValues.name.trim().length < 2) {
      setFormError("Full Name is required (minimum 2 characters).");
      return;
    }
    if (!formValues.email.trim() || !isValidEmail(formValues.email)) {
      setFormError("A valid email address is required.");
      return;
    }
    const cleanMob = normalizeMobile(formValues.mobile);
    if (!cleanMob || !isValidMobile(cleanMob)) {
      setFormError("A valid 10-digit Indian mobile number is required.");
      return;
    }
    const ageNum = parseInt(formValues.age, 10);
    if (!formValues.age || isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
      setFormError("Age must be between 16 and 100.");
      return;
    }

    setIsSubmittingForm(true);

    try {
      const url = editingParticipant
        ? `/api/admin/program-participants/${editingParticipant.id}`
        : `/api/admin/program-participants`;
      const method = editingParticipant ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...formValues,
          mobile: cleanMob,
          age: ageNum,
        }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save participant.");

      showFeedback(
        "success",
        editingParticipant
          ? `Updated details for ${formValues.name}.`
          : `Added new participant ${formValues.name}.`
      );

      setIsFormModalOpen(false);
      fetchParticipants();
    } catch (err: any) {
      setFormError(err.message || "Failed to save participant details.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Delete Participant
  const handleDeleteParticipant = async () => {
    if (!participantToDelete || !authToken) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/program-participants/${participantToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete participant.");

      setParticipants((prev) => prev.filter((p) => p.id !== participantToDelete.id));
      showFeedback("success", `Participant "${participantToDelete.name}" deleted.`);
      setParticipantToDelete(null);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to delete participant.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (participants.length === 0) {
      showFeedback("error", "No participant data to export.");
      return;
    }

    const headers = [
      "ID",
      "Submission Date",
      "Full Name",
      "Email Address",
      "Mobile Number",
      "Age",
      "Occupation",
      "Interests",
      "Status",
      "Notes",
      "Source",
      "IP Address",
    ];

    const rows = participants.map((p) => [
      `"${p.id}"`,
      `"${new Date(p.created_at).toLocaleString("en-IN")}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.mobile}"`,
      `"${p.age}"`,
      `"${p.occupation}"`,
      `"${(p.interested_in || []).join(", ").replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${(p.notes || "").replace(/"/g, '""')}"`,
      `"${(p.source || "").replace(/"/g, '""')}"`,
      `"${p.ip_address || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WealthyStep_Awareness_Participants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showFeedback("success", `Exported ${participants.length} participant records to CSV.`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* ── 0. DATABASE TABLE SETUP WARNING (IF TABLE NOT YET CREATED IN SUPABASE) ── */}
      {tableSetupRequired && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm text-amber-950 space-y-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
                  <span>Supabase Database Setup Required</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Action Needed
                  </span>
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed max-w-2xl">
                  The <code className="px-1.5 py-0.5 rounded-md bg-amber-200/60 font-mono font-bold text-amber-950 text-[11px]">program_participants</code> table does not exist in your Supabase project yet.
                  Copy the SQL script below and paste it into your <strong>Supabase Dashboard &gt; SQL Editor</strong> to complete setup.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={handleCopyMigrationSql}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {isCopiedSql ? <Check className="w-3.5 h-3.5 text-lime-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedSql ? "SQL Copied!" : "1. Copy SQL Script"}</span>
              </button>
              <a
                href="https://supabase.com/dashboard/project/cfovajnpjxawuctmnwuy/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-200/80 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-all shadow-xs border border-amber-400/50"
              >
                <span>2. Open Supabase SQL</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-900" />
              </a>
              <button
                onClick={() => fetchParticipants()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                title="Check if table is ready"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>3. Re-check Table</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. PRESENTATION QR CODE & WEBINAR SHOWCASE BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#180D45] via-[#21145C] to-[#120836] rounded-3xl border border-[#84BD3C]/30 shadow-xl p-5 sm:p-7 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#84BD3C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 justify-between">
          {/* Left: Info */}
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#84BD3C] text-[11px] font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#84BD3C]" />
              <span>Webinar & Meeting Live Lead Capture</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
              Financial Freedom Awareness Program
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Show this QR code in your presentation slides or project it on screen. Participants can scan it with their phone camera to instantly fill their details.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#180D45] border border-white/20 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedLink ? "Link Copied!" : "Copy Form Link"}</span>
              </button>

              <button
                onClick={handleDownloadBrandedCard}
                disabled={isDownloadingCard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#84BD3C] hover:bg-[#97D444] text-[#180D45] text-xs font-black transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDownloadingCard ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Download Slide Card (PNG)</span>
              </button>

              <button
                onClick={handleDownloadCleanQr}
                disabled={isDownloadingClean}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Download pure QR code without background card"
              >
                {isDownloadingClean ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                ) : (
                  <QrCode className="w-3.5 h-3.5 text-[#84BD3C]" />
                )}
                <span>Clean QR</span>
              </button>

              <button
                onClick={() => setIsPresentationOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#84BD3C]" />
                <span>Fullscreen Slide Mode</span>
              </button>

              <a
                href="/presentation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-semibold transition-all"
                title="Open Standalone Stage Presenter in new tab"
              >
                <span>Stage Link</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>

          {/* Right: QR Code Visual Card */}
          <div className="bg-white p-3.5 rounded-2xl shadow-2xl border-4 border-[#84BD3C] flex flex-col items-center justify-center shrink-0">
            {qrDataUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Participant Details Form QR Code"
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white p-1.5 border-2 border-[#84BD3C] flex items-center justify-center shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icon.png"
                      alt="Wealthy Step Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <RefreshCw className="w-6 h-6 animate-spin text-[#180D45]" />
              </div>
            )}
            <p className="mt-2 text-[10px] font-black text-[#180D45] tracking-widest uppercase">
              SCAN TO SUBMIT DETAILS
            </p>
            <p className="text-[10px] font-mono text-gray-500 truncate max-w-[170px]">
              wealthystep.com/participant-form
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. LIVE METRICS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Submissions */}
        <div className="bg-white p-4 rounded-2xl border border-[#C7D9A8]/70 shadow-2xs">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Total Submissions</p>
          <h3 className="text-2xl sm:text-3xl font-black text-[#180D45] mt-1">{metrics.total}</h3>
          <span className="text-[10px] text-gray-500 mt-1 block">All participants recorded</span>
        </div>

        {/* New / Uncontacted */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs">
          <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider">New / Uncontacted</p>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">{metrics.newCount}</h3>
          <span className="text-[10px] text-blue-600 mt-1 block">Awaiting initial outreach</span>
        </div>

        {/* Follow Ups Scheduled */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Follow-Ups Pending</p>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">{metrics.followUpCount}</h3>
          <span className="text-[10px] text-amber-600 mt-1 block">Call evening / weekend / tomorrow</span>
        </div>

        {/* High Interest */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">High Interest</p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">{metrics.interestedCount}</h3>
          <span className="text-[10px] text-emerald-600 mt-1 block">Expressed clear goal interests</span>
        </div>
      </div>

      {/* ── 3. SEARCH, FILTERS & ACTION BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-[#C7D9A8]/70 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, email, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C] focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Download spreadsheet of all participant submissions"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#84BD3C]" />
              <span>Add Participant Manually</span>
            </button>

            <button
              onClick={fetchParticipants}
              className="p-2 rounded-xl bg-[#FAFBF7] hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-[#180D45] transition-all cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#84BD3C]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filters:</span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#FAFBF7] border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#84BD3C] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Occupation Filter */}
          <select
            value={occupationFilter}
            onChange={(e) => setOccupationFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#FAFBF7] border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#84BD3C] cursor-pointer"
          >
            <option value="ALL">All Occupations</option>
            {OCCUPATION_OPTIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </select>

          {/* Interest Filter */}
          <select
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#FAFBF7] border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#84BD3C] cursor-pointer"
          >
            <option value="ALL">All Goals / Interests</option>
            {INTEREST_OPTIONS.map((int) => (
              <option key={int} value={int}>
                {int}
              </option>
            ))}
          </select>

          {(statusFilter !== "ALL" || occupationFilter !== "ALL" || interestFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setOccupationFilter("ALL");
                setInterestFilter("ALL");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── 4. DATA TABLE (RESPONSIVE) ── */}
      <div className="bg-white border border-[#C7D9A8]/70 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#84BD3C] mx-auto" />
            <p className="text-xs font-bold">Loading participant submissions...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-3 max-w-sm mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F3F7EB] text-[#446A1B] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#180D45]">No Participants Found</h4>
            <p className="text-xs text-gray-500">
              {searchQuery || statusFilter !== "ALL"
                ? "No participant records matched your filter criteria."
                : "No submissions recorded yet. Share the QR code in your seminar to start collecting participant details!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#FAFBF7] border-b border-gray-200/80 uppercase text-[10px] font-black text-gray-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Profile</th>
                  <th className="py-3.5 px-4">Interests</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Advisor Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participants.map((p) => {
                  const statusStyle = STATUS_COLOR_MAP[p.status] || STATUS_COLOR_MAP.New;
                  const cleanPhone = normalizeMobile(p.mobile);

                  return (
                    <tr key={p.id} className="hover:bg-[#FAFBF7]/60 transition-colors">
                      {/* Name & Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#180D45] text-white flex items-center justify-center font-black text-[11px] shrink-0 shadow-2xs">
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <span className="font-extrabold text-[#180D45] text-xs block">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(p.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Channels (Direct Call & WhatsApp) */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-gray-800">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a href={`tel:+91${cleanPhone}`} className="hover:text-[#3C6415] hover:underline">
                            +91 {cleanPhone}
                          </a>
                          {/* WhatsApp Shortcut */}
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(
                              p.name
                            )},%20thank%20you%20for%20attending%20the%20Wealthy%20Step%20Financial%20Freedom%20Awareness%20Program!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <a href={`mailto:${p.email}`} className="hover:underline truncate">
                            {p.email}
                          </a>
                        </div>
                      </td>

                      {/* Profile (Age & Occupation) */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">{p.age} years</span>
                        <span className="text-[11px] text-gray-500 font-medium">{p.occupation}</span>
                      </td>

                      {/* Interests Chips */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        {p.interested_in && p.interested_in.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.interested_in.slice(0, 2).map((int, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 truncate max-w-[120px]"
                                title={int}
                              >
                                {int}
                              </span>
                            ))}
                            {p.interested_in.length > 2 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#F3F7EB] text-[#3C6415]">
                                +{p.interested_in.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">None specified</span>
                        )}
                      </td>

                      {/* Quick Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => handleInlineStatusChange(p.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer focus:outline-none ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="bg-white text-gray-900">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Notes Section with Direct Modal Trigger */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <button
                          onClick={() => handleOpenNotes(p)}
                          className="w-full text-left group p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          {p.notes ? (
                            <p className="text-[11px] text-gray-700 font-medium line-clamp-2 leading-relaxed group-hover:text-[#180D45]">
                              {p.notes}
                            </p>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 group-hover:text-[#3C6415] font-semibold italic">
                              <Plus className="w-3 h-3" /> Add note...
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingParticipant(p)}
                            className="p-1.5 text-gray-400 hover:text-[#180D45] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setParticipantToDelete(p)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 5. FULLSCREEN PRESENTATION QR MODAL (FOR WEBINAR SLIDES) ── */}
      {isPresentationOpen && (
        <div className="fixed inset-0 z-50 bg-[#180D45]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in text-white">
          <button
            onClick={() => setIsPresentationOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#180D45] transition-all cursor-pointer"
            title="Exit Presentation Mode"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#84BD3C] text-[#180D45] text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              LIVE WEBINAR REGISTRATION
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Financial Freedom Awareness Program
            </h2>

            <p className="text-sm sm:text-base text-white/80">
              Please take out your phone, open your camera, and scan this QR code to fill your details.
            </p>

            {/* Giant QR Card */}
            <div className="p-6 bg-white rounded-3xl shadow-2xl border-8 border-[#84BD3C] inline-block mx-auto mt-4">
              {qrDataUrl && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="Presentation QR Code"
                    className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-2.5 border-4 border-[#84BD3C] flex items-center justify-center shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/icon.png"
                        alt="Wealthy Step Icon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
              <p className="mt-3 text-xs font-black text-[#180D45] tracking-widest uppercase text-center">
                SCAN WITH MOBILE CAMERA
              </p>
              <p className="text-xs font-mono text-gray-500 text-center font-bold">
                {formUrl}
              </p>
            </div>

            {/* Modal Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handleDownloadBrandedCard}
                disabled={isDownloadingCard}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84BD3C] hover:bg-[#97D444] text-[#180D45] text-xs font-black transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDownloadingCard ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Download Slide Card (PNG)</span>
              </button>

              <button
                onClick={handleDownloadCleanQr}
                disabled={isDownloadingClean}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {isDownloadingClean ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                ) : (
                  <QrCode className="w-3.5 h-3.5 text-[#84BD3C]" />
                )}
                <span>Download Clean QR</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer"
              >
                {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>

            <p className="text-xs text-white/60 pt-4">
              Wealthy Step™ • AMFI Registered Mutual Fund Distributor (ARN-322891)
            </p>
          </div>
        </div>
      )}

      {/* ── 6. ADVISOR NOTES & STATUS EDIT DRAWER / MODAL ── */}
      {activeParticipantForNotes && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#180D45] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#84BD3C]" />
                  Advisor Notes & Status
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Participant: <strong className="text-gray-900">{activeParticipantForNotes.name}</strong> (+91 {activeParticipantForNotes.mobile})
                </p>
              </div>
              <button
                onClick={() => setActiveParticipantForNotes(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Current Lead Status
              </label>
              <select
                value={noteStatus}
                onChange={(e) => setNoteStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Note Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Quick Preset Tags (Click to Insert)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#FAFBF7] rounded-xl border border-gray-100">
                {QUICK_NOTE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      const prefix = noteContent.trim() ? `${noteContent.trim()}\n• ` : "• ";
                      setNoteContent(`${prefix}${preset}`);
                    }}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-white hover:bg-[#F3F7EB] hover:text-[#3C6415] border border-gray-200 text-gray-600 transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Conversation Notes & Follow-up Details
              </label>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="e.g. Spoke on 5 Nov, interested in SIP for child education (₹15,000/mo). Requested callback on Saturday afternoon."
                className="w-full p-3 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* CTAs */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveParticipantForNotes(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingNotes}
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs font-black transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSavingNotes ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#84BD3C]" />
                    <span>Save Notes & Status</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. VIEW PARTICIPANT DETAILS MODAL ── */}
      {viewingParticipant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#180D45] text-white flex items-center justify-center font-black text-sm">
                  {getInitials(viewingParticipant.name)}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#180D45]">{viewingParticipant.name}</h3>
                  <span className="text-xs text-gray-500">{viewingParticipant.occupation} • Age {viewingParticipant.age}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingParticipant(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAFBF7] p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 font-semibold block">Mobile:</span>
                  <a href={`tel:+91${viewingParticipant.mobile}`} className="font-bold text-gray-900 font-mono hover:text-[#3C6415]">
                    +91 {viewingParticipant.mobile}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Email:</span>
                  <a href={`mailto:${viewingParticipant.email}`} className="font-bold text-gray-900 hover:underline truncate block">
                    {viewingParticipant.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Lead Status:</span>
                  <span className="font-bold text-[#180D45]">{viewingParticipant.status}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block">Submitted At:</span>
                  <span className="font-bold text-gray-900">
                    {new Date(viewingParticipant.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Interests */}
              <div>
                <span className="text-gray-500 font-bold block mb-1.5 uppercase text-[10px] tracking-wider">
                  Expressed Goal Interests:
                </span>
                {viewingParticipant.interested_in && viewingParticipant.interested_in.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {viewingParticipant.interested_in.map((item, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#180D45] text-white">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No specific interest marked.</span>
                )}
              </div>

              {/* Notes */}
              <div>
                <span className="text-gray-500 font-bold block mb-1.5 uppercase text-[10px] tracking-wider">
                  Advisor Notes:
                </span>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {viewingParticipant.notes || "No notes recorded yet."}
                </div>
              </div>

              {/* Consent Audit */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Consent legally recorded and verified at submission time.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <a
                href={`https://wa.me/91${viewingParticipant.mobile}?text=Hi%20${encodeURIComponent(
                  viewingParticipant.name
                )},%20this%20is%20from%20Wealthy%20Step.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message on WhatsApp</span>
              </a>

              <button
                onClick={() => setViewingParticipant(null)}
                className="px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. ADD / EDIT PARTICIPANT MODAL ── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#180D45]">
                {editingParticipant ? `Edit Participant: ${editingParticipant.name}` : "Add Participant Manually"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-950 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveParticipant} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formValues.mobile}
                    onChange={(e) => setFormValues({ ...formValues, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min={16}
                    max={100}
                    value={formValues.age}
                    onChange={(e) => setFormValues({ ...formValues, age: e.target.value })}
                    placeholder="e.g. 35"
                    className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                  placeholder="anand@example.com"
                  className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Occupation *
                  </label>
                  <select
                    value={formValues.occupation}
                    onChange={(e) => setFormValues({ ...formValues, occupation: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                  >
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Lead Status
                  </label>
                  <select
                    value={formValues.status}
                    onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Advisor Notes
                </label>
                <textarea
                  rows={3}
                  value={formValues.notes}
                  onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })}
                  placeholder="Any discussion notes..."
                  className="w-full p-2.5 bg-[#FAFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs font-black shadow-sm disabled:opacity-50"
                >
                  {isSubmittingForm ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingParticipant ? "Update Participant" : "Add Participant"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 9. DELETE CONFIRMATION MODAL ── */}
      {participantToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-gray-900">Delete Participant?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete the submission for{" "}
                <strong className="text-gray-900">{participantToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setParticipantToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteParticipant}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

