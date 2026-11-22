"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp,
  Search,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  User,
  Building2,
  Users,
  Download,
  Trash2,
  Edit,
  Eye,
  FileSpreadsheet,
  MessageSquare,
  Clock,
  ExternalLink,
  Upload,
  Copy,
  Check,
  CreditCard,
  FileText,
  FileImage,
  AlertTriangle,
  Send,
  Database,
} from "lucide-react";
import { BseStarNominee, BseStarFileMeta } from "@/lib/bse-star-validation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export interface BseStarAccountRecord {
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  dob: string;
  place_of_birth: string;
  occupation: string;
  present_address: string;
  permanent_address: string;
  marital_status: string;
  marriage_date?: string;
  blood_group?: string;

  is_kyc_done: string;
  aadhar_number: string;
  pan_number: string;
  aadhar_files: BseStarFileMeta[];
  pan_files: BseStarFileMeta[];

  bank_files: BseStarFileMeta[];
  bank_name: string;
  bank_branch: string;
  bank_address?: string;
  account_number: string;
  account_type: string;
  bank_city: string;
  pin_code: string;
  micr_code?: string;
  ifsc_code: string;

  nominees_count: number;
  nominees: BseStarNominee[];
  client_note?: string;

  status: string; // New, Under Review, KYC Pending, Account Created, Follow-up Needed, Rejected
  priority: string; // Low, Medium, High, Urgent
  admin_notes: string;
  followup_notes: Array<{
    id: string;
    createdAt: string;
    author: string;
    text: string;
  }>;
  source?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

interface BseStarAccountsTabProps {
  authToken: string | null;
  handleSessionExpired: () => void;
  showFeedback: (type: "success" | "error", message: string) => void;
  onTotalCountChange?: (count: number) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Under Review": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "KYC Pending": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Account Created": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Follow-up Needed": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export function BseStarAccountsTab({
  authToken,
  handleSessionExpired,
  showFeedback,
  onTotalCountChange,
}: BseStarAccountsTabProps) {
  const [accounts, setAccounts] = useState<BseStarAccountRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [kycFilter, setKycFilter] = useState("ALL");

  // Detail Modal
  const [selectedAccount, setSelectedAccount] = useState<BseStarAccountRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Follow-up state inside modal
  const [newFollowupText, setNewFollowupText] = useState("");
  const [isAddingFollowup, setIsAddingFollowup] = useState(false);

  // Delete State
  const [accountToDelete, setAccountToDelete] = useState<BseStarAccountRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Copied SQL state
  const [isSqlCopied, setIsSqlCopied] = useState(false);

  // 1. Fetch Accounts (supports silent background sync for live updates)
  const fetchAccounts = useCallback(async (isSilent = false) => {
    if (!authToken) return;
    if (!isSilent) setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (kycFilter !== "ALL") params.set("isKycDone", kycFilter);

      const authHeaders: Record<string, string> = {};
      if (authToken && authToken !== "cookie-authenticated") {
        authHeaders["Authorization"] = `Bearer ${authToken}`;
      }
      const res = await fetch(`/api/admin/bse-star-accounts/?${params.toString()}`, {
        headers: authHeaders,
        credentials: "include",
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        if (!isSilent) showFeedback("error", err.error || "Failed to load Mutual Fund accounts");
        if (!isSilent) setIsLoading(false);
        return;
      }

      const data = await res.json();
      setAccounts(data.accounts || []);
      if (onTotalCountChange) {
        onTotalCountChange(data.total || 0);
      }
    } catch (err: any) {
      console.error("fetchAccounts error:", err);
      if (!isSilent) showFeedback("error", "Network error while loading Mutual Fund accounts");
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [authToken, searchQuery, statusFilter, kycFilter, handleSessionExpired, showFeedback, onTotalCountChange]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Real-time Supabase subscription + fallback polling
  useEffect(() => {
    if (!authToken) return;

    const channel = supabaseBrowser
      .channel("realtime-bse-star-accounts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bse_star_mf_accounts" },
        () => {
          fetchAccounts(true);
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchAccounts(true);
      }
    }, 15000);

    return () => {
      supabaseBrowser.removeChannel(channel);
      clearInterval(interval);
    };
  }, [authToken, fetchAccounts]);

  // Status Update Helper
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!authToken) return;

    try {
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken && authToken !== "cookie-authenticated") {
        authHeaders["Authorization"] = `Bearer ${authToken}`;
      }
      const res = await fetch(`/api/admin/bse-star-accounts/${id}/`, {
        method: "PATCH",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        showFeedback("error", "Failed to update status");
        return;
      }

      showFeedback("success", `Status updated to "${newStatus}"`);
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      if (selectedAccount?.id === id) {
        setSelectedAccount((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      showFeedback("error", "Error updating status");
    }
  };

  // Add Follow-up Note
  const handleAddFollowup = async () => {
    if (!selectedAccount || !newFollowupText.trim() || !authToken) return;
    setIsAddingFollowup(true);

    try {
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken && authToken !== "cookie-authenticated") {
        authHeaders["Authorization"] = `Bearer ${authToken}`;
      }
      const res = await fetch(`/api/admin/bse-star-accounts/${selectedAccount.id}/`, {
        method: "PATCH",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({ newFollowupNote: newFollowupText.trim() }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        showFeedback("error", "Failed to add follow-up note");
        setIsAddingFollowup(false);
        return;
      }

      const resData = await res.json();
      showFeedback("success", "Follow-up note logged");
      setNewFollowupText("");
      setSelectedAccount(resData.account);
      setAccounts((prev) =>
        prev.map((a) => (a.id === selectedAccount.id ? resData.account : a))
      );
    } catch (e) {
      showFeedback("error", "Failed to add follow-up note");
    } finally {
      setIsAddingFollowup(false);
    }
  };

  // Delete Record
  const confirmDelete = async () => {
    if (!accountToDelete || !authToken) return;
    setIsDeleting(true);

    try {
      const authHeaders: Record<string, string> = {};
      if (authToken && authToken !== "cookie-authenticated") {
        authHeaders["Authorization"] = `Bearer ${authToken}`;
      }
      const res = await fetch(`/api/admin/bse-star-accounts/${accountToDelete.id}/`, {
        method: "DELETE",
        headers: authHeaders,
        credentials: "include",
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        showFeedback("error", "Failed to delete record");
        setIsDeleting(false);
        return;
      }

      showFeedback("success", "Application deleted successfully");
      setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
      setAccountToDelete(null);
      if (selectedAccount?.id === accountToDelete.id) {
        setIsDetailModalOpen(false);
        setSelectedAccount(null);
      }
    } catch (e) {
      showFeedback("error", "Error deleting application");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (accounts.length === 0) {
      showFeedback("error", "No accounts to export");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Mobile",
      "Email",
      "DOB",
      "Place of Birth",
      "Occupation",
      "PAN",
      "Aadhaar",
      "KYC Done",
      "Bank Name",
      "Branch",
      "Account Number",
      "Account Type",
      "IFSC",
      "Nominees Count",
      "Status",
      "Submission Date",
    ];

    const rows = accounts.map((a) => [
      a.id,
      `"${a.full_name}"`,
      `"${a.mobile}"`,
      `"${a.email}"`,
      `"${a.dob}"`,
      `"${a.place_of_birth}"`,
      `"${a.occupation}"`,
      `"${a.pan_number}"`,
      `"${a.aadhar_number}"`,
      `"${a.is_kyc_done}"`,
      `"${a.bank_name}"`,
      `"${a.bank_branch}"`,
      `"${a.account_number}"`,
      `"${a.account_type}"`,
      `"${a.ifsc_code}"`,
      a.nominees_count,
      `"${a.status}"`,
      `"${new Date(a.created_at).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mutual-fund-accounts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    if (accounts.length === 0) {
      showFeedback("error", "No accounts to export");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(accounts, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `mutual-fund-accounts-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Import JSON / Records
  const handleImport = async () => {
    if (!importJsonText.trim() || !authToken) return;
    setIsImporting(true);

    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch("/api/admin/bse-star-accounts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(items),
      });

      if (!res.ok) {
        const err = await res.json();
        showFeedback("error", err.error || "Import failed");
        setIsImporting(false);
        return;
      }

      const resData = await res.json();
      showFeedback("success", `Imported ${resData.importedCount || 0} account(s) successfully!`);
      setIsImportModalOpen(false);
      setImportJsonText("");
      fetchAccounts();
    } catch (e: any) {
      showFeedback("error", "Invalid JSON format. Please check your data.");
    } finally {
      setIsImporting(false);
    }
  };

  // Copy Supabase SQL
  const handleCopySql = () => {
    const sqlCode = `-- Supabase Table Creation Script for Mutual Fund Accounts
CREATE TABLE IF NOT EXISTS public.bse_star_mf_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    dob TEXT NOT NULL,
    place_of_birth TEXT NOT NULL,
    occupation TEXT NOT NULL,
    present_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    marital_status TEXT NOT NULL DEFAULT 'Single',
    marriage_date TEXT DEFAULT '',
    blood_group TEXT DEFAULT '',
    is_kyc_done TEXT NOT NULL DEFAULT 'No',
    aadhar_number TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    aadhar_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    pan_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    bank_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    bank_name TEXT NOT NULL,
    bank_branch TEXT NOT NULL,
    bank_address TEXT DEFAULT '',
    account_number TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'Savings',
    bank_city TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    micr_code TEXT DEFAULT '',
    ifsc_code TEXT NOT NULL,
    nominees_count INTEGER NOT NULL DEFAULT 1,
    nominees JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_note TEXT DEFAULT '',
    declaration_accepted BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT NOT NULL DEFAULT 'Medium',
    admin_notes TEXT DEFAULT '',
    followup_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'Mutual Funds Form',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.bse_star_mf_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on bse_star_mf_accounts" ON public.bse_star_mf_accounts FOR ALL TO service_role USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlCode);
    setIsSqlCopied(true);
    setTimeout(() => setIsSqlCopied(false), 3000);
    showFeedback("success", "Supabase SQL script copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header & Action Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-base font-black text-[#180D45]">Mutual Fund Accounts</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800">
              {accounts.length} Total
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage applicant KYC, bank accounts, nominee shares, follow-up notes, and export Mutual Fund onboardings.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAccounts()}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isSqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Database className="w-3.5 h-3.5 text-purple-600" />}
            <span>{isSqlCopied ? "SQL Copied!" : "Copy Supabase SQL"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#180D45] text-white text-xs font-bold hover:bg-[#25156B] transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, pan, mobile, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#180D45]"
        >
          <option value="ALL">All Application Statuses</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="KYC Pending">KYC Pending</option>
          <option value="Account Created">Account Created</option>
          <option value="Follow-up Needed">Follow-up Needed</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* KYC Status Filter */}
        <select
          value={kycFilter}
          onChange={(e) => setKycFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#180D45]"
        >
          <option value="ALL">All KYC Statuses</option>
          <option value="Yes">KYC Done (Yes)</option>
          <option value="No">KYC Pending (No)</option>
          <option value="Don't Know">Not Sure</option>
        </select>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <div className="w-6 h-6 border-2 border-[#180D45] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading Mutual Fund applications...
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            No applications match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF7] border-b border-gray-200 text-[#180D45] font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">PAN &amp; KYC</th>
                  <th className="py-3 px-4">Bank &amp; Account</th>
                  <th className="py-3 px-4">Nominees</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.map((acc) => {
                  const statusStyle = STATUS_COLORS[acc.status] || {
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                    border: "border-gray-200",
                  };
                  return (
                    <tr key={acc.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Applicant */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#180D45] text-sm">{acc.full_name}</div>
                        <div className="text-gray-500 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>+91 {acc.mobile}</span>
                          <span>&bull;</span>
                          <span className="truncate max-w-[150px]">{acc.email}</span>
                        </div>
                      </td>

                      {/* PAN & KYC */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#180D45]">{acc.pan_number}</div>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              acc.is_kyc_done === "Yes"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            KYC: {acc.is_kyc_done}
                          </span>
                        </div>
                      </td>

                      {/* Bank & Account */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#180D45]">{acc.bank_name}</div>
                        <div className="text-gray-500 font-mono text-[11px]">
                          {acc.account_number} ({acc.ifsc_code})
                        </div>
                      </td>

                      {/* Nominees */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#180D45]">{acc.nominees_count} Nominee(s)</span>
                        {acc.nominees && acc.nominees[0] && (
                          <div className="text-[11px] text-gray-500 truncate max-w-[140px]">
                            {acc.nominees[0].name} ({acc.nominees[0].percentage}%)
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={acc.status}
                          onChange={(e) => handleStatusUpdate(acc.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="KYC Pending">KYC Pending</option>
                          <option value="Account Created">Account Created</option>
                          <option value="Follow-up Needed">Follow-up Needed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {new Date(acc.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAccount(acc);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-[#180D45] hover:text-white transition-colors"
                            title="View Full Details & Follow-up Notes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`https://wa.me/91${acc.mobile}?text=${encodeURIComponent(
                              `Hello ${acc.full_name}, this is from Wealthy Step regarding your Mutual Fund account creation.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setAccountToDelete(acc)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
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

      {/* ── Detail Modal ── */}
      {isDetailModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Ref ID: {selectedAccount.id}
                </span>
                <h3 className="text-xl font-black text-[#180D45] mt-1">{selectedAccount.full_name}</h3>
                <p className="text-xs text-gray-500">
                  Submitted on {new Date(selectedAccount.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Tabs / Sections */}
            <div className="space-y-6 text-xs">
              {/* 1. Personal Details */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  1. Personal Information
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>Mobile:</strong> +91 {selectedAccount.mobile}</div>
                  <div><strong>Email:</strong> {selectedAccount.email}</div>
                  <div><strong>DOB:</strong> {selectedAccount.dob}</div>
                  <div><strong>Birth Place:</strong> {selectedAccount.place_of_birth}</div>
                  <div><strong>Occupation:</strong> {selectedAccount.occupation}</div>
                  <div><strong>Marital:</strong> {selectedAccount.marital_status} {selectedAccount.marriage_date ? `(${selectedAccount.marriage_date})` : ""}</div>
                  <div><strong>Blood Group:</strong> {selectedAccount.blood_group || "—"}</div>
                  <div className="col-span-2"><strong>Present Address:</strong> {selectedAccount.present_address}</div>
                  <div className="col-span-2"><strong>Permanent Address:</strong> {selectedAccount.permanent_address}</div>
                </div>
              </div>

              {/* 2. KYC Details & Uploads */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  2. KYC &amp; Identification Documents
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>KYC Completed:</strong> {selectedAccount.is_kyc_done}</div>
                  <div><strong>PAN Number:</strong> <span className="font-mono font-bold text-[#180D45]">{selectedAccount.pan_number}</span></div>
                  <div><strong>Aadhaar Number:</strong> <span className="font-mono font-bold">{selectedAccount.aadhar_number}</span></div>
                </div>

                {/* Document Downloads/Previews */}
                <div className="pt-2 border-t border-gray-200 space-y-1.5">
                  <span className="font-bold text-gray-600 block text-[10px] uppercase">Uploaded Files:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.pan_files?.map((f, i) => (
                      <a
                        key={f.id || i}
                        href={f.fileUrl || (f.fileKey ? `/api/admin/attachments/view?key=${encodeURIComponent(f.fileKey)}` : f.base64 || "#")}
                        download={f.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-blue-700 hover:bg-blue-50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PAN: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedAccount.aadhar_files?.map((f, i) => (
                      <a
                        key={f.id || i}
                        href={f.fileUrl || (f.fileKey ? `/api/admin/attachments/view?key=${encodeURIComponent(f.fileKey)}` : f.base64 || "#")}
                        download={f.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                      >
                        <FileImage className="w-3.5 h-3.5" />
                        <span>Aadhaar: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedAccount.bank_files?.map((f, i) => (
                      <a
                        key={f.id || i}
                        href={f.fileUrl || (f.fileKey ? `/api/admin/attachments/view?key=${encodeURIComponent(f.fileKey)}` : f.base64 || "#")}
                        download={f.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-purple-700 hover:bg-purple-50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Cheque/Statement: {f.fileName}</span>
                      </a>
                    ))}
                    {(!selectedAccount.pan_files?.length && !selectedAccount.aadhar_files?.length && !selectedAccount.bank_files?.length) && (
                      <span className="text-gray-400 italic">No files attached</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Bank Details */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  3. Bank Details &amp; Mandate
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>Bank Name:</strong> {selectedAccount.bank_name}</div>
                  <div><strong>Branch:</strong> {selectedAccount.bank_branch}</div>
                  <div><strong>Account Number:</strong> <span className="font-mono font-bold">{selectedAccount.account_number}</span></div>
                  <div><strong>Account Type:</strong> {selectedAccount.account_type}</div>
                  <div><strong>IFSC Code:</strong> <span className="font-mono font-bold">{selectedAccount.ifsc_code}</span></div>
                  <div><strong>MICR Code:</strong> {selectedAccount.micr_code || "—"}</div>
                  <div><strong>Bank City:</strong> {selectedAccount.bank_city}</div>
                  <div><strong>PIN Code:</strong> {selectedAccount.pin_code}</div>
                  {selectedAccount.bank_address && <div className="col-span-2"><strong>Bank Address:</strong> {selectedAccount.bank_address}</div>}
                </div>
              </div>

              {/* 4. Nominees */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  4. Nominees ({selectedAccount.nominees_count})
                </span>
                <div className="space-y-2.5">
                  {selectedAccount.nominees?.map((n, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-[#180D45]">#{i + 1}: {n.name} ({n.relation})</strong>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                          {n.percentage}% Share
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-gray-600 text-[11px]">
                        <div>Aadhaar Last 4: XXXX-{n.aadharLast4}</div>
                        <div>DOB: {n.dob}</div>
                        <div>Mobile: {n.mobile} ({n.mobileBelongsTo})</div>
                        <div>Email: {n.email} ({n.emailBelongsTo})</div>
                        <div className="col-span-2">Address: {n.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Note */}
              {selectedAccount.client_note && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">Applicant Note:</span>
                  <p className="text-gray-700">{selectedAccount.client_note}</p>
                </div>
              )}

              {/* 5. Follow-Up Notes Timeline */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  Follow-up Notes &amp; Action Log
                </span>

                {/* Input new follow-up note */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add follow-up notes (e.g. KYC verified with KRA, bank proof verified...)"
                    value={newFollowupText}
                    onChange={(e) => setNewFollowupText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFollowup()}
                    className="flex-1 h-9 px-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFollowup}
                    disabled={isAddingFollowup || !newFollowupText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#180D45] text-white text-xs font-bold hover:bg-[#25156B] disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Follow-up history */}
                <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                  {selectedAccount.followup_notes && selectedAccount.followup_notes.length > 0 ? (
                    selectedAccount.followup_notes.map((fn) => (
                      <div key={fn.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                          <span className="font-bold text-[#180D45]">{fn.author}</span>
                          <span>{new Date(fn.createdAt).toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-gray-700">{fn.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-center py-2">No follow-up notes logged yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAccountToDelete(selectedAccount)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800"
              >
                Delete Application
              </button>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#180D45]">Delete Application?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete the application for <strong>{accountToDelete.full_name}</strong> (PAN: {accountToDelete.pan_number})?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Modal ── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-base font-black text-[#180D45]">Import Mutual Fund Accounts</h4>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Paste JSON array of Mutual Fund account objects to bulk import them into the system.
            </p>
            <textarea
              rows={8}
              placeholder={`[\n  {\n    "fullName": "Ramesh Sharma",\n    "mobile": "9876543210",\n    "email": "ramesh@gmail.com",\n    "dob": "1990-05-15",\n    "panNumber": "ABCDE1234F",\n    "aadharNumber": "123456789012",\n    "bankName": "HDFC Bank",\n    "accountNumber": "50100234567890",\n    "ifscCode": "HDFC0001234",\n    "bankBranch": "Madhapur",\n    "bankCity": "Hyderabad",\n    "pinCode": "500081",\n    "placeOfBirth": "Hyderabad",\n    "presentAddress": "Madhapur, Hyderabad",\n    "nominees": []\n  }\n]`}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 font-mono text-xs focus:outline-none focus:border-[#180D45] resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={isImporting || !importJsonText.trim()}
                className="px-6 py-2 rounded-xl bg-[#180D45] text-white text-xs font-bold hover:bg-[#25156B] disabled:opacity-50"
              >
                {isImporting ? "Importing..." : "Import Records"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
