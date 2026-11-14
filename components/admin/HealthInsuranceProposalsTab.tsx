"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ShieldCheck,
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
  HeartPulse,
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
  Building,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { InsuredMember } from "@/lib/health-insurance-validation";

export interface HealthProposalRecord {
  id: string;
  proposer_name: string;
  proposer_pan: string;
  proposer_dob: string;
  proposer_aadhar?: string;
  proposer_mobile: string;
  proposer_email: string;
  proposer_address: string;
  employment_status: string;
  corporate_email?: string;
  policy_type: string;
  adults_count: number;
  kids_count: number;
  members: InsuredMember[];
  insured_email: string;
  insured_mobile: string;
  has_pre_existing_illness: boolean;
  pre_existing_details?: string;
  has_tobacco_alcohol_habits: boolean;
  habits_details?: string;
  current_address: string;
  nominee_name: string;
  nominee_dob: string;
  nominee_relation?: string;
  nominee_address: string;
  nominee_mobile: string;
  nominee_email: string;
  nominee_bank_name: string;
  nominee_bank_account_name: string;
  nominee_bank_ifsc: string;
  nominee_bank_account_number: string;
  nominee_bank_account_type: string;
  status: string; // New, Contacted, In Review, Quotation Sent, Policy Issued, Rejected, Closed
  priority: string; // Low, Medium, High, Urgent
  notes: string;
  followup_notes: Array<{
    id: string;
    timestamp: string;
    author: string;
    note: string;
    status: string;
  }>;
  source?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

interface HealthInsuranceProposalsTabProps {
  authToken: string | null;
  handleSessionExpired: () => void;
  showFeedback: (type: "success" | "error", message: string) => void;
  onTotalCountChange?: (count: number) => void;
}

const STATUS_OPTIONS = [
  "ALL",
  "New",
  "Contacted",
  "In Review",
  "Quotation Sent",
  "Policy Issued",
  "Rejected",
  "Closed",
];

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Contacted: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  "In Review": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Quotation Sent": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Policy Issued": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Closed: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" },
};

const NOTE_PRESETS = [
  "Called client - Discussed sum insured options",
  "Requested KYC / Previous policy copy for porting",
  "Quotation prepared and shared on WhatsApp & Email",
  "Medical tele-underwriting scheduled with insurer",
  "Client agreed on premium - Payment link shared",
  "Proposal pending medical tests",
  "Policy issued successfully - Welcome kit sent",
];

export function HealthInsuranceProposalsTab({
  authToken,
  handleSessionExpired,
  showFeedback,
  onTotalCountChange,
}: HealthInsuranceProposalsTabProps) {
  const [proposals, setProposals] = useState<HealthProposalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    newCount: 0,
    inReviewCount: 0,
    quotedCount: 0,
    issuedCount: 0,
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [policyTypeFilter, setPolicyTypeFilter] = useState("ALL");

  // Modals
  const [viewingProposal, setViewingProposal] = useState<HealthProposalRecord | null>(null);
  const [activeProposalForNotes, setActiveProposalForNotes] = useState<HealthProposalRecord | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteStatus, setNoteStatus] = useState("New");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Edit / Add Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<HealthProposalRecord | null>(null);
  const [editForm, setEditForm] = useState({
    proposer_name: "",
    proposer_mobile: "",
    proposer_email: "",
    policy_type: "New Policy",
    status: "New",
    priority: "Medium",
    notes: "",
  });

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Fetch Proposals
  const fetchProposals = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);

    try {
      const url = new URL("/api/admin/insurance-proposals/", window.location.origin);
      if (searchQuery) url.searchParams.set("q", searchQuery);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (policyTypeFilter !== "ALL") url.searchParams.set("policyType", policyTypeFilter);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load proposals");

      setProposals(data.proposals || []);
      if (data.metrics) setMetrics(data.metrics);
      if (onTotalCountChange) onTotalCountChange(data.proposals?.length || 0);
    } catch (err: any) {
      showFeedback("error", err.message || "Error loading proposals");
    } finally {
      setIsLoading(false);
    }
  }, [authToken, searchQuery, statusFilter, policyTypeFilter, handleSessionExpired, showFeedback, onTotalCountChange]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Open Notes Modal
  const handleOpenNotes = (item: HealthProposalRecord) => {
    setActiveProposalForNotes(item);
    setNoteContent("");
    setNoteStatus(item.status);
  };

  // Submit Follow-up Note
  const handleSaveFollowupNote = async () => {
    if (!activeProposalForNotes || !noteContent.trim() || !authToken) return;
    setIsSavingNote(true);

    try {
      const res = await fetch(`/api/admin/insurance-proposals/${activeProposalForNotes.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: noteStatus,
          newFollowupNote: noteContent.trim(),
        }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save note");

      showFeedback("success", "Follow-up note added successfully!");
      setActiveProposalForNotes(null);
      fetchProposals();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to update follow-up");
    } finally {
      setIsSavingNote(false);
    }
  };

  // Quick Status Change on Row
  const handleQuickStatusChange = async (proposalId: string, newStatus: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/insurance-proposals/${proposalId}/`, {
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

      showFeedback("success", `Status updated to ${newStatus}`);
      fetchProposals();
    } catch (err: any) {
      showFeedback("error", "Failed to update status");
    }
  };

  // Delete Proposal
  const handleDeleteProposal = async (proposalId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete proposal for ${name}?`)) return;
    if (!authToken) return;

    try {
      const res = await fetch(`/api/admin/insurance-proposals/${proposalId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      showFeedback("success", "Proposal deleted successfully");
      fetchProposals();
    } catch (err: any) {
      showFeedback("error", "Failed to delete proposal");
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (proposals.length === 0) {
      showFeedback("error", "No proposal records to export");
      return;
    }

    const headers = [
      "ID",
      "Proposer Name",
      "PAN Number",
      "DOB",
      "Mobile",
      "Email",
      "Employment Status",
      "Policy Type",
      "Adults Count",
      "Kids Count",
      "Pre-Existing Illness",
      "Illness Details",
      "Tobacco/Alcohol",
      "Nominee Name",
      "Nominee Relation",
      "Nominee Bank",
      "Nominee A/C",
      "Nominee IFSC",
      "Status",
      "Submission Date",
    ];

    const rows = proposals.map((p) => [
      `"${p.id}"`,
      `"${p.proposer_name.replace(/"/g, '""')}"`,
      `"${p.proposer_pan}"`,
      `"${p.proposer_dob}"`,
      `"${p.proposer_mobile}"`,
      `"${p.proposer_email}"`,
      `"${p.employment_status}"`,
      `"${p.policy_type}"`,
      p.adults_count,
      p.kids_count,
      p.has_pre_existing_illness ? "Yes" : "No",
      `"${(p.pre_existing_details || "").replace(/"/g, '""')}"`,
      p.has_tobacco_alcohol_habits ? "Yes" : "No",
      `"${p.nominee_name.replace(/"/g, '""')}"`,
      `"${p.nominee_relation || ""}"`,
      `"${p.nominee_bank_name}"`,
      `"${p.nominee_bank_account_number}"`,
      `"${p.nominee_bank_ifsc}"`,
      `"${p.status}"`,
      `"${p.created_at}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wealthystep_health_proposals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback("success", "Exported proposals to CSV successfully");
  };

  // Import JSON / Bulk
  const handleImportJson = async () => {
    if (!importJsonText.trim() || !authToken) return;
    setIsImporting(true);

    try {
      const parsed = JSON.parse(importJsonText);
      const list = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch("/api/admin/insurance-proposals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ proposals: list }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import");

      showFeedback("success", `Successfully imported ${data.count || list.length} proposal records!`);
      setIsImportModalOpen(false);
      setImportJsonText("");
      fetchProposals();
    } catch (err: any) {
      showFeedback("error", `Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ─── METRIC CARDS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <p className="text-xs font-semibold text-gray-500">Total Proposals</p>
          <p className="text-2xl font-black text-[#180D45] mt-1">{metrics.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs">
          <p className="text-xs font-semibold text-blue-700">New Intakes</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{metrics.newCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
          <p className="text-xs font-semibold text-amber-700">In Review</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{metrics.inReviewCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs">
          <p className="text-xs font-semibold text-purple-700">Quotes Shared</p>
          <p className="text-2xl font-black text-purple-700 mt-1">{metrics.quotedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-emerald-700">Policies Issued</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.issuedCount}</p>
        </div>
      </div>

      {/* ─── SEARCH & ACTION CONTROLS ─── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Proposer Name, PAN, Mobile, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#180D45]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 font-semibold"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>Status: {opt}</option>
            ))}
          </select>

          <select
            value={policyTypeFilter}
            onChange={(e) => setPolicyTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 font-semibold"
          >
            <option value="ALL">All Policy Types</option>
            <option value="New Policy">New Policy</option>
            <option value="Port policy">Port Policy</option>
            <option value="Don't know">Don&apos;t know</option>
          </select>

          <button
            type="button"
            onClick={fetchProposals}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#84BD3C]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* ─── DATA TABLE ─── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF7] border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Proposer & KYC</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Policy & Family</th>
                <th className="py-3 px-4">Medical Alert</th>
                <th className="py-3 px-4">Nominee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#84BD3C]" />
                    <span>Loading insurance proposals...</span>
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No proposals match the selected filters.
                  </td>
                </tr>
              ) : (
                proposals.map((item) => {
                  const statusStyle = STATUS_COLOR_MAP[item.status] || STATUS_COLOR_MAP.New;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Proposer & KYC */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#180D45] text-sm">{item.proposer_name}</div>
                        <div className="font-mono text-[11px] text-gray-500 font-semibold mt-0.5">
                          PAN: {item.proposer_pan}
                        </div>
                        <div className="text-[10px] text-gray-400">DOB: {item.proposer_dob}</div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                          <Phone className="w-3 h-3 text-[#84BD3C]" />
                          <span>+91 {item.proposer_mobile}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[140px]">{item.proposer_email}</span>
                        </div>
                      </td>

                      {/* Policy & Family */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {item.policy_type}
                        </span>
                        <div className="text-[11px] text-gray-600 mt-1">
                          {item.adults_count} Adults, {item.kids_count} Kids
                        </div>
                      </td>

                      {/* Medical Alert */}
                      <td className="py-3.5 px-4">
                        {item.has_pre_existing_illness ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Pre-Existing</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold">Clean</span>
                        )}
                        {item.has_tobacco_alcohol_habits && (
                          <span className="block text-[10px] text-amber-700 mt-0.5">Habits declared</span>
                        )}
                      </td>

                      {/* Nominee */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800">{item.nominee_name}</div>
                        <div className="text-[10px] text-gray-500">{item.nominee_bank_name}</div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none`}
                        >
                          {STATUS_OPTIONS.filter((s) => s !== "ALL").map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingProposal(item)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#180D45] hover:bg-gray-100 cursor-pointer"
                            title="View Full Proposal Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenNotes(item)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#84BD3C] hover:bg-gray-100 cursor-pointer relative"
                            title="Add / View Follow-up Notes"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {item.followup_notes && item.followup_notes.length > 0 && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#84BD3C]" />
                            )}
                          </button>

                          <a
                            href={`https://wa.me/91${item.proposer_mobile.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                              `Hello ${item.proposer_name}, regarding your Health Insurance inquiry with Wealthy Step...`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-gray-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            title="WhatsApp Client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteProposal(item.id, item.proposer_name)}
                            className="p-1.5 rounded-lg border border-gray-200 text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== VIEW FULL DETAILS MODAL ===================== */}
      {viewingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#84BD3C] uppercase tracking-wider block">
                  Proposal Intake File
                </span>
                <h2 className="text-xl font-black text-[#180D45]">
                  {viewingProposal.proposer_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingProposal(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAFBF7] border border-[#E2E8D8] p-3 rounded-2xl text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">+91 {viewingProposal.proposer_mobile}</span>
                <span className="text-gray-500">{viewingProposal.proposer_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${viewingProposal.proposer_mobile.replace(/\D/g, "").slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-bold text-xs hover:bg-[#20BA5A] transition-all"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:+91${viewingProposal.proposer_mobile}`}
                  className="px-3 py-1.5 rounded-lg bg-[#180D45] text-white font-bold text-xs"
                >
                  Call
                </a>
              </div>
            </div>

            {/* Section 1: Proposer Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#180D45] uppercase tracking-wider border-b border-gray-100 pb-1">
                1. Proposer & Tax 80D Beneficiary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Full Name:</span> <strong>{viewingProposal.proposer_name}</strong></div>
                <div><span className="text-gray-500">PAN Number:</span> <strong className="font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{viewingProposal.proposer_pan}</strong></div>
                <div><span className="text-gray-500">DOB:</span> {viewingProposal.proposer_dob}</div>
                <div><span className="text-gray-500">Aadhaar:</span> {viewingProposal.proposer_aadhar ? `••••••••${viewingProposal.proposer_aadhar.slice(-4)}` : "Not provided"}</div>
                <div><span className="text-gray-500">Employment:</span> {viewingProposal.employment_status}</div>
                <div><span className="text-gray-500">Corporate Email:</span> {viewingProposal.corporate_email || "None"}</div>
                <div className="col-span-2"><span className="text-gray-500">Address:</span> {viewingProposal.proposer_address}</div>
              </div>
            </div>

            {/* Section 2: Members Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#180D45] uppercase tracking-wider border-b border-gray-100 pb-1">
                2. Covered Members ({viewingProposal.adults_count} Adults, {viewingProposal.kids_count} Kids)
              </h3>
              <p className="text-[11px] text-gray-500">
                Primary Insured Phone: <strong>+91 {viewingProposal.insured_mobile}</strong> • Email: <strong>{viewingProposal.insured_email}</strong>
              </p>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="p-2">Role</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Relation</th>
                      <th className="p-2">DOB</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">Height / Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewingProposal.members && viewingProposal.members.length > 0 ? (
                      viewingProposal.members.map((m, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-bold text-[#180D45]">{m.role}</td>
                          <td className="p-2">{m.fullName || "—"}</td>
                          <td className="p-2">{m.relation || "Self"}</td>
                          <td className="p-2">{m.dob || "—"}</td>
                          <td className="p-2">{m.gender || "—"}</td>
                          <td className="p-2">{m.height || "—"} / {m.weight || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="p-2 text-center text-gray-400">No dynamic member list</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Medical Disclosures */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#180D45] uppercase tracking-wider border-b border-gray-100 pb-1">
                3. Medical & Lifestyle Disclosures
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${viewingProposal.has_pre_existing_illness ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <p className="font-bold">Pre-Existing Illness: {viewingProposal.has_pre_existing_illness ? "YES" : "NO"}</p>
                  {viewingProposal.has_pre_existing_illness && (
                    <p className="mt-1 text-gray-700">{viewingProposal.pre_existing_details || "No details"}</p>
                  )}
                </div>

                <div className={`p-3 rounded-xl border ${viewingProposal.has_tobacco_alcohol_habits ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <p className="font-bold">Tobacco / Smoking / Alcohol: {viewingProposal.has_tobacco_alcohol_habits ? "YES" : "NO"}</p>
                  {viewingProposal.has_tobacco_alcohol_habits && (
                    <p className="mt-1 text-gray-700">{viewingProposal.habits_details || "No details"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Nominee & Bank Details */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#180D45] uppercase tracking-wider border-b border-gray-100 pb-1">
                4. Nominee & Bank Account Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Nominee Name:</span> <strong>{viewingProposal.nominee_name}</strong></div>
                <div><span className="text-gray-500">DOB:</span> {viewingProposal.nominee_dob}</div>
                <div><span className="text-gray-500">Mobile:</span> +91 {viewingProposal.nominee_mobile}</div>
                <div><span className="text-gray-500">Email:</span> {viewingProposal.nominee_email}</div>
                <div><span className="text-gray-500">Bank Name:</span> <strong>{viewingProposal.nominee_bank_name}</strong></div>
                <div><span className="text-gray-500">A/C Holder:</span> {viewingProposal.nominee_bank_account_name}</div>
                <div><span className="text-gray-500">Account Number:</span> <span className="font-mono font-bold">{viewingProposal.nominee_bank_account_number}</span></div>
                <div><span className="text-gray-500">IFSC Code:</span> <span className="font-mono font-bold uppercase">{viewingProposal.nominee_bank_ifsc}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Nominee Address:</span> {viewingProposal.nominee_address}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewingProposal(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FOLLOW-UP NOTES MODAL ===================== */}
      {activeProposalForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#84BD3C] uppercase tracking-wider block">
                  CRM Follow-Up & Notes
                </span>
                <h3 className="text-lg font-black text-[#180D45]">
                  {activeProposalForNotes.proposer_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProposalForNotes(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Add New Note / Interaction Record:</label>
              <textarea
                rows={3}
                placeholder="Type note details here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#180D45]"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1 pt-1">
                {NOTE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNoteContent(preset)}
                    className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Update */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">Update Status:</span>
                <select
                  value={noteStatus}
                  onChange={(e) => setNoteStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                >
                  {STATUS_OPTIONS.filter((s) => s !== "ALL").map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={isSavingNote || !noteContent.trim()}
                onClick={handleSaveFollowupNote}
                className="px-5 py-2 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white font-bold text-xs disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSavingNote ? "Saving..." : "Save Note"}
              </button>
            </div>

            {/* Note History Timeline */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-xs font-bold text-gray-700 block">Interaction Timeline:</span>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {activeProposalForNotes.followup_notes && activeProposalForNotes.followup_notes.length > 0 ? (
                  activeProposalForNotes.followup_notes.map((n) => (
                    <div key={n.id} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span className="font-semibold text-gray-700">{n.author}</span>
                        <span>{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-800">{n.note}</p>
                      {n.status && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700">
                          {n.status}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-3">No previous follow-up notes recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== BULK IMPORT MODAL ===================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-[#180D45]">Import Proposal Records</h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Paste JSON array of proposal objects with keys like <code>proposerName</code>, <code>proposerMobile</code>, <code>proposerPan</code>, etc.
            </p>

            <textarea
              rows={8}
              placeholder={`[\n  {\n    "proposerName": "Ramesh Kumar",\n    "proposerMobile": "9876543210",\n    "proposerPan": "ABCDE1234F"\n  }\n]`}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#180D45]"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isImporting || !importJsonText.trim()}
                onClick={handleImportJson}
                className="px-5 py-2 rounded-xl bg-[#180D45] text-white font-bold text-xs disabled:opacity-50"
              >
                {isImporting ? "Importing..." : "Import Proposals"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

