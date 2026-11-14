"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  Building2,
  Users,
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Upload,
  Check,
  CreditCard,
  FileText,
  FileImage,
  Camera,
  AlertTriangle,
  Send,
  Database,
  HeartPulse,
  Briefcase,
  Award,
} from "lucide-react";
import { LifeInsuranceFileMeta } from "@/lib/life-insurance-validation";

export interface LifeInsuranceProposalRecord {
  id: string;
  full_name: string;
  proposer_email: string;
  proposer_mobile: string;
  marital_status: string;
  dob: string;
  qualification: string;
  height: string;
  weight: number;
  mother_full_name: string;
  father_full_name: string;
  employment_type: string;
  has_existing_policies: boolean;
  existing_coverage: string;
  current_address: string;

  company_name: string;
  designation: string;
  company_email: string;
  industry: string;
  annual_income: string;

  has_pre_existing_illness: boolean;
  pre_existing_details?: string;
  is_smoker: boolean;
  is_drinker: boolean;
  chews_tobacco: boolean;

  nominee_name: string;
  is_nominee_minor: boolean;
  nominee_relation: string;
  nominee_dob: string;
  nominee_address_option: string;
  nominee_address: string;
  nominee_mobile: string;
  nominee_email: string;
  nominee_bank_name: string;
  nominee_bank_account_name: string;
  nominee_bank_ifsc: string;
  nominee_bank_account_number: string;
  nominee_bank_account_type: string;

  aadhar_number: string;
  pan_number: string;
  proposer_bank_name: string;
  proposer_bank_account_number: string;
  proposer_bank_ifsc: string;
  proposer_bank_branch: string;
  proposer_bank_account_name: string;

  aadhar_files: LifeInsuranceFileMeta[];
  pan_files: LifeInsuranceFileMeta[];
  selfie_files: LifeInsuranceFileMeta[];
  cheque_files: LifeInsuranceFileMeta[];
  company_id_files: LifeInsuranceFileMeta[];
  payslip_files: LifeInsuranceFileMeta[];
  other_files: LifeInsuranceFileMeta[];
  client_notes?: string;

  status: string;
  priority: string;
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

interface LifeInsuranceProposalsTabProps {
  authToken: string | null;
  handleSessionExpired: () => void;
  showFeedback: (type: "success" | "error", message: string) => void;
  onTotalCountChange?: (count: number) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Under Review": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Medical Scheduled": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Policy Issued": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Follow-up Needed": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export function LifeInsuranceProposalsTab({
  authToken,
  handleSessionExpired,
  showFeedback,
  onTotalCountChange,
}: LifeInsuranceProposalsTabProps) {
  const [proposals, setProposals] = useState<LifeInsuranceProposalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [empFilter, setEmpFilter] = useState("ALL");

  // Detail Modal
  const [selectedProposal, setSelectedProposal] = useState<LifeInsuranceProposalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Follow-up state
  const [newFollowupText, setNewFollowupText] = useState("");
  const [isAddingFollowup, setIsAddingFollowup] = useState(false);

  // Delete State
  const [proposalToDelete, setProposalToDelete] = useState<LifeInsuranceProposalRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Copied SQL state
  const [isSqlCopied, setIsSqlCopied] = useState(false);

  // 1. Fetch Proposals
  const fetchProposals = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (empFilter !== "ALL") params.set("employmentType", empFilter);

      const res = await fetch(`/api/admin/life-insurance-proposals/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        showFeedback("error", err.error || "Failed to load life insurance proposals");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setProposals(data.proposals || []);
      if (onTotalCountChange) {
        onTotalCountChange(data.total || 0);
      }
    } catch (err: any) {
      console.error("fetchProposals error:", err);
      showFeedback("error", "Network error while loading life insurance proposals");
    } finally {
      setIsLoading(false);
    }
  }, [authToken, searchQuery, statusFilter, empFilter, handleSessionExpired, showFeedback, onTotalCountChange]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Status Update Helper
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/admin/life-insurance-proposals/${id}/`, {
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

      if (!res.ok) {
        showFeedback("error", "Failed to update status");
        return;
      }

      showFeedback("success", `Status updated to "${newStatus}"`);
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      if (selectedProposal?.id === id) {
        setSelectedProposal((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      showFeedback("error", "Error updating status");
    }
  };

  // Add Follow-up Note
  const handleAddFollowup = async () => {
    if (!selectedProposal || !newFollowupText.trim() || !authToken) return;
    setIsAddingFollowup(true);

    try {
      const res = await fetch(`/api/admin/life-insurance-proposals/${selectedProposal.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
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
      setSelectedProposal(resData.proposal);
      setProposals((prev) =>
        prev.map((p) => (p.id === selectedProposal.id ? resData.proposal : p))
      );
    } catch (e) {
      showFeedback("error", "Failed to add follow-up note");
    } finally {
      setIsAddingFollowup(false);
    }
  };

  // Delete Record
  const confirmDelete = async () => {
    if (!proposalToDelete || !authToken) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/life-insurance-proposals/${proposalToDelete.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        showFeedback("error", "Failed to delete proposal");
        setIsDeleting(false);
        return;
      }

      showFeedback("success", "Proposal deleted successfully");
      setProposals((prev) => prev.filter((p) => p.id !== proposalToDelete.id));
      setProposalToDelete(null);
      if (selectedProposal?.id === proposalToDelete.id) {
        setIsDetailModalOpen(false);
        setSelectedProposal(null);
      }
    } catch (e) {
      showFeedback("error", "Error deleting proposal");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (proposals.length === 0) {
      showFeedback("error", "No proposals to export");
      return;
    }

    const headers = [
      "ID",
      "Full Name",
      "Mobile",
      "Email",
      "PAN",
      "Aadhaar",
      "Employment Type",
      "Company Name",
      "Designation",
      "Annual Income",
      "Pre-existing Illness",
      "Smoker",
      "Drinker",
      "Nominee Name",
      "Nominee Relation",
      "Status",
      "Submission Date",
    ];

    const rows = proposals.map((p) => [
      p.id,
      `"${p.full_name}"`,
      `"${p.proposer_mobile}"`,
      `"${p.proposer_email}"`,
      `"${p.pan_number}"`,
      `"${p.aadhar_number}"`,
      `"${p.employment_type}"`,
      `"${p.company_name}"`,
      `"${p.designation}"`,
      `"${p.annual_income}"`,
      p.has_pre_existing_illness ? `"YES: ${p.pre_existing_details || ''}"` : '"NO"',
      p.is_smoker ? '"YES"' : '"NO"',
      p.is_drinker ? '"YES"' : '"NO"',
      `"${p.nominee_name}"`,
      `"${p.nominee_relation}"`,
      `"${p.status}"`,
      `"${new Date(p.created_at).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `life-insurance-proposals-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    if (proposals.length === 0) {
      showFeedback("error", "No proposals to export");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proposals, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `life-insurance-proposals-${new Date().toISOString().slice(0, 10)}.json`);
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

      const res = await fetch("/api/admin/life-insurance-proposals/", {
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
      showFeedback("success", `Imported ${resData.importedCount || 0} proposal(s) successfully!`);
      setIsImportModalOpen(false);
      setImportJsonText("");
      fetchProposals();
    } catch (e: any) {
      showFeedback("error", "Invalid JSON format. Please check your data.");
    } finally {
      setIsImporting(false);
    }
  };

  // Copy Supabase SQL
  const handleCopySql = () => {
    const sqlCode = `-- Supabase Table Creation Script for Life Insurance Proposals
CREATE TABLE IF NOT EXISTS public.life_insurance_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    proposer_email TEXT NOT NULL,
    proposer_mobile TEXT NOT NULL,
    marital_status TEXT NOT NULL DEFAULT 'Single',
    dob TEXT NOT NULL,
    qualification TEXT NOT NULL DEFAULT 'Graduate',
    height TEXT NOT NULL,
    weight NUMERIC NOT NULL,
    mother_full_name TEXT NOT NULL,
    father_full_name TEXT NOT NULL,
    employment_type TEXT NOT NULL DEFAULT 'Salaried Employee',
    has_existing_policies BOOLEAN NOT NULL DEFAULT false,
    existing_coverage TEXT DEFAULT '0',
    current_address TEXT NOT NULL,
    company_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    company_email TEXT NOT NULL,
    industry TEXT NOT NULL,
    annual_income TEXT NOT NULL,
    has_pre_existing_illness BOOLEAN NOT NULL DEFAULT false,
    pre_existing_details TEXT DEFAULT '',
    is_smoker BOOLEAN NOT NULL DEFAULT false,
    is_drinker BOOLEAN NOT NULL DEFAULT false,
    chews_tobacco BOOLEAN NOT NULL DEFAULT false,
    nominee_name TEXT NOT NULL,
    is_nominee_minor BOOLEAN NOT NULL DEFAULT false,
    nominee_relation TEXT NOT NULL,
    nominee_dob TEXT NOT NULL,
    nominee_address_option TEXT NOT NULL DEFAULT 'Same as Insured person address',
    nominee_address TEXT NOT NULL,
    nominee_mobile TEXT NOT NULL,
    nominee_email TEXT NOT NULL,
    nominee_bank_name TEXT NOT NULL,
    nominee_bank_account_name TEXT NOT NULL,
    nominee_bank_ifsc TEXT NOT NULL,
    nominee_bank_account_number TEXT NOT NULL,
    nominee_bank_account_type TEXT NOT NULL DEFAULT 'Savings',
    aadhar_number TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    proposer_bank_name TEXT NOT NULL,
    proposer_bank_account_number TEXT NOT NULL,
    proposer_bank_ifsc TEXT NOT NULL,
    proposer_bank_branch TEXT NOT NULL,
    proposer_bank_account_name TEXT NOT NULL,
    aadhar_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    pan_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    selfie_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    cheque_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    company_id_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    payslip_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    other_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_notes TEXT DEFAULT '',
    consent_contact_accepted BOOLEAN NOT NULL DEFAULT true,
    consent_disclosure_accepted BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT NOT NULL DEFAULT 'Medium',
    admin_notes TEXT DEFAULT '',
    followup_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'Life Insurance Form',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.life_insurance_proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on life_insurance_proposals" ON public.life_insurance_proposals FOR ALL TO service_role USING (true) WITH CHECK (true);`;

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
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-base font-black text-[#180D45]">Life &amp; Term Insurance Proposals</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              {proposals.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Review proposer financial eligibility, corporate salary profiles, medical disclosures, nominees, and documents.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchProposals}
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
            {isSqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Database className="w-3.5 h-3.5 text-emerald-600" />}
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
            placeholder="Search by name, email, mobile, PAN, company..."
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
          <option value="Medical Scheduled">Medical Scheduled</option>
          <option value="Policy Issued">Policy Issued</option>
          <option value="Follow-up Needed">Follow-up Needed</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Employment Filter */}
        <select
          value={empFilter}
          onChange={(e) => setEmpFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#180D45]"
        >
          <option value="ALL">All Employment Types</option>
          <option value="Salaried Employee">Salaried Employee</option>
          <option value="Businessman">Businessman / Self-Employed</option>
        </select>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <div className="w-6 h-6 border-2 border-[#180D45] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading Life &amp; Term Insurance proposals...
          </div>
        ) : proposals.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            No proposals match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF7] border-b border-gray-200 text-[#180D45] font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Insured Person</th>
                  <th className="py-3 px-4">Employment &amp; Income</th>
                  <th className="py-3 px-4">Medical / Lifestyle</th>
                  <th className="py-3 px-4">Nominee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {proposals.map((prop) => {
                  const statusStyle = STATUS_COLORS[prop.status] || {
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                    border: "border-gray-200",
                  };
                  return (
                    <tr key={prop.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Insured Person */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#180D45] text-sm">{prop.full_name}</div>
                        <div className="text-gray-500 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>+91 {prop.proposer_mobile}</span>
                          <span>&bull;</span>
                          <span className="font-mono">{prop.pan_number}</span>
                        </div>
                      </td>

                      {/* Employment & Income */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#180D45]">{prop.company_name}</div>
                        <div className="text-gray-500 text-[11px]">
                          {prop.designation} &bull; <strong className="text-emerald-700">{prop.annual_income}</strong>
                        </div>
                      </td>

                      {/* Medical / Lifestyle */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              prop.has_pre_existing_illness
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {prop.has_pre_existing_illness ? "Has Illness" : "No Illness"}
                          </span>
                          {(prop.is_smoker || prop.is_drinker || prop.chews_tobacco) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Habits
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Nominee */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#180D45]">{prop.nominee_name}</div>
                        <div className="text-[11px] text-gray-500">{prop.nominee_relation}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={prop.status}
                          onChange={(e) => handleStatusUpdate(prop.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Medical Scheduled">Medical Scheduled</option>
                          <option value="Policy Issued">Policy Issued</option>
                          <option value="Follow-up Needed">Follow-up Needed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {new Date(prop.created_at).toLocaleDateString("en-IN", {
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
                              setSelectedProposal(prop);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-[#180D45] hover:text-white transition-colors"
                            title="View Full Details & Follow-up Notes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`https://wa.me/91${prop.proposer_mobile}?text=${encodeURIComponent(
                              `Hello ${prop.full_name}, this is from Wealthy Step regarding your Life & Term Insurance proposal.`
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
                            onClick={() => setProposalToDelete(prop)}
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
      {isDetailModalOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ref ID: {selectedProposal.id}
                </span>
                <h3 className="text-xl font-black text-[#180D45] mt-1">{selectedProposal.full_name}</h3>
                <p className="text-xs text-gray-500">
                  Submitted on {new Date(selectedProposal.created_at).toLocaleString("en-IN")}
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

            {/* Content Sections */}
            <div className="space-y-6 text-xs">
              {/* 1. Personal Details */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  1. Insured Person Details
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>Mobile:</strong> +91 {selectedProposal.proposer_mobile}</div>
                  <div><strong>Email:</strong> {selectedProposal.proposer_email}</div>
                  <div><strong>DOB:</strong> {selectedProposal.dob}</div>
                  <div><strong>Marital:</strong> {selectedProposal.marital_status}</div>
                  <div><strong>Qualification:</strong> {selectedProposal.qualification}</div>
                  <div><strong>Height / Weight:</strong> {selectedProposal.height} &bull; {selectedProposal.weight} Kgs</div>
                  <div><strong>Mother&apos;s Name:</strong> {selectedProposal.mother_full_name}</div>
                  <div><strong>Father&apos;s Name:</strong> {selectedProposal.father_full_name}</div>
                  <div><strong>Existing Coverage:</strong> {selectedProposal.has_existing_policies ? selectedProposal.existing_coverage : "None"}</div>
                  <div className="col-span-2 sm:col-span-3"><strong>Current Address:</strong> {selectedProposal.current_address}</div>
                </div>
              </div>

              {/* 2. Employment & Income */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  2. Employment &amp; Income
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>Type:</strong> {selectedProposal.employment_type}</div>
                  <div><strong>Company:</strong> {selectedProposal.company_name}</div>
                  <div><strong>Designation:</strong> {selectedProposal.designation}</div>
                  <div><strong>Official Email:</strong> {selectedProposal.company_email}</div>
                  <div><strong>Industry:</strong> {selectedProposal.industry}</div>
                  <div><strong>Annual Income:</strong> <span className="font-bold text-emerald-700">{selectedProposal.annual_income}</span></div>
                </div>
              </div>

              {/* 3. Medical Disclosures & Habits */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  3. Health Conditions &amp; Lifestyle Habits
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-700">
                  <div><strong>Pre-existing Illness:</strong> {selectedProposal.has_pre_existing_illness ? "YES" : "NO"}</div>
                  <div><strong>Smoker:</strong> {selectedProposal.is_smoker ? "YES" : "NO"}</div>
                  <div><strong>Drinker:</strong> {selectedProposal.is_drinker ? "YES" : "NO"}</div>
                  <div><strong>Tobacco:</strong> {selectedProposal.chews_tobacco ? "YES" : "NO"}</div>
                  {selectedProposal.has_pre_existing_illness && (
                    <div className="col-span-2 sm:col-span-4 text-rose-700">
                      <strong>Illness Details:</strong> {selectedProposal.pre_existing_details}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Nominee Details & Bank */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  4. Nominee Details &amp; Bank
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>Nominee Name:</strong> {selectedProposal.nominee_name} ({selectedProposal.is_nominee_minor ? "Minor" : "Adult"})</div>
                  <div><strong>Relation:</strong> {selectedProposal.nominee_relation}</div>
                  <div><strong>DOB:</strong> {selectedProposal.nominee_dob}</div>
                  <div><strong>Mobile:</strong> {selectedProposal.nominee_mobile}</div>
                  <div><strong>Email:</strong> {selectedProposal.nominee_email}</div>
                  <div><strong>Address:</strong> {selectedProposal.nominee_address}</div>
                  <div><strong>Bank Name:</strong> {selectedProposal.nominee_bank_name}</div>
                  <div><strong>A/C Holder Name:</strong> {selectedProposal.nominee_bank_account_name}</div>
                  <div><strong>A/C Number:</strong> <span className="font-mono">{selectedProposal.nominee_bank_account_number}</span></div>
                  <div><strong>IFSC:</strong> <span className="font-mono">{selectedProposal.nominee_bank_ifsc}</span></div>
                  <div><strong>A/C Type:</strong> {selectedProposal.nominee_bank_account_type}</div>
                </div>
              </div>

              {/* 5. Proposer Bank & Documents */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] block border-b border-gray-200 pb-1">
                  5. Proposer Bank &amp; Uploaded Documents
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
                  <div><strong>Aadhaar Number:</strong> <span className="font-mono font-bold">{selectedProposal.aadhar_number}</span></div>
                  <div><strong>PAN Number:</strong> <span className="font-mono font-bold text-[#180D45]">{selectedProposal.pan_number}</span></div>
                  <div><strong>Bank Name:</strong> {selectedProposal.proposer_bank_name} ({selectedProposal.proposer_bank_branch})</div>
                  <div><strong>Account Number:</strong> <span className="font-mono">{selectedProposal.proposer_bank_account_number}</span></div>
                  <div><strong>IFSC Code:</strong> <span className="font-mono">{selectedProposal.proposer_bank_ifsc}</span></div>
                  <div><strong>Name in Bank:</strong> {selectedProposal.proposer_bank_account_name}</div>
                </div>

                {/* Uploaded Documents */}
                <div className="pt-2 border-t border-gray-200 space-y-1.5">
                  <span className="font-bold text-gray-600 block text-[10px] uppercase">Uploaded Files:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProposal.aadhar_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-emerald-700 hover:bg-emerald-50">
                        <FileImage className="w-3.5 h-3.5" />
                        <span>Aadhaar: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedProposal.pan_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-blue-700 hover:bg-blue-50">
                        <FileText className="w-3.5 h-3.5" />
                        <span>PAN: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedProposal.selfie_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-purple-700 hover:bg-purple-50">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Selfie: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedProposal.cheque_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-amber-700 hover:bg-amber-50">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Cheque: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedProposal.company_id_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-teal-700 hover:bg-teal-50">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>ID Card: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedProposal.payslip_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Payslip: {f.fileName}</span>
                      </a>
                    ))}
                    {selectedProposal.other_files?.map((f, i) => (
                      <a key={f.id || i} href={f.base64 || f.fileUrl || "#"} download={f.fileName} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Doc: {f.fileName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client Notes */}
              {selectedProposal.client_notes && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">Applicant Note:</span>
                  <p className="text-gray-700">{selectedProposal.client_notes}</p>
                </div>
              )}

              {/* Follow-Up Notes Timeline */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                <span className="font-extrabold text-[#180D45] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Follow-up Notes &amp; Action Log
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add follow-up notes (e.g. Tele-medical scheduled, ITR verified...)"
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

                <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                  {selectedProposal.followup_notes && selectedProposal.followup_notes.length > 0 ? (
                    selectedProposal.followup_notes.map((fn) => (
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
                onClick={() => setProposalToDelete(selectedProposal)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800"
              >
                Delete Proposal
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
      {proposalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#180D45]">Delete Proposal?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete the proposal for <strong>{proposalToDelete.full_name}</strong> (PAN: {proposalToDelete.pan_number})?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProposalToDelete(null)}
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
              <h4 className="text-base font-black text-[#180D45]">Import Life Insurance Proposals</h4>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Paste JSON array of life insurance proposal objects to bulk import them.
            </p>
            <textarea
              rows={8}
              placeholder={`[\n  {\n    "fullName": "Ramesh Sharma",\n    "proposerEmail": "ramesh@gmail.com",\n    "proposerMobile": "9876543210",\n    "dob": "1990-05-15",\n    "panNumber": "ABCDE1234F",\n    "aadharNumber": "123456789012",\n    "companyName": "TCS",\n    "designation": "Manager",\n    "companyEmail": "ramesh@tcs.com",\n    "annualIncome": "15 Lakhs"\n  }\n]`}
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
