"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  Users,
  FileText,
  Upload,
  Trash2,
  Edit,
  Plus,
  Search,
  LogOut,
  ShieldCheck,
  History,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  FilePlus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FolderOpen,
  Eye,
  Download,
  Database,
  Cloud,
  HardDrive,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { PremiumDatePicker } from "@/components/ui/PremiumDatePicker";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

interface StorageMetrics {
  b2: {
    provider: string;
    bucket: string;
    region: string;
    usedBytes: number;
    totalBytes: number;
    freeBytes: number;
    usedFormatted: string;
    totalFormatted: string;
    freeFormatted: string;
    usagePercent: number;
    fileCount: number;
    tier: string;
    status: string;
  };
  supabase: {
    provider: string;
    usedBytes: number;
    totalBytes: number;
    freeBytes: number;
    usedFormatted: string;
    totalFormatted: string;
    freeFormatted: string;
    usagePercent: number;
    tier: string;
    status: string;
    tableCounts: {
      clients: number;
      documents: number;
      auditLogs: number;
      otpRequests: number;
      verifiedSessions: number;
      totalRows: number;
    };
  };
}

interface PolicyDoc {
  id: string;
  client_id: string;
  title: string;
  file_key: string;
  file_size: number;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  mobile: string;
  email: string;
  dob: string;
  created_at: string;
  documents?: PolicyDoc[];
}

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  details?: Record<string, any>;
  ip_address?: string | null;
  created_at: string;
}

interface UploadProgressState {
  current: number;
  total: number;
  currentFileName: string;
  percent: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"clients" | "audit">("clients");

  // Clients state
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  // Client Modal States (Add / Edit) - ONLY 4 REQUIRED FIELDS
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
  });
  const [clientFormError, setClientFormError] = useState<string | null>(null);
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Delete Client State
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  // Multi-Document Upload & Management State
  const [selectedClientForDocs, setSelectedClientForDocs] = useState<Client | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // Alerts
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // PDF Preview State
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    data?: ArrayBuffer | null;
    blobUrl?: string | null;
    title: string;
    fileSize?: number;
    docId?: string;
  }>({ isOpen: false, data: null, blobUrl: null, title: "" });
  const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [isPurgingLogs, setIsPurgingLogs] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeOption, setPurgeOption] = useState<number>(0); // 0 = Clear All, 7 = >7 Days, 30 = >30 Days
  const [storageMetrics, setStorageMetrics] = useState<StorageMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Handle Session Expiry & Auto-Redirect to Login
  const handleSessionExpired = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ws_admin_session");
      document.cookie = "sb-access-token=; path=/; max-age=0";
    }
    setAdminUser(null);
    setAuthToken(null);
    try {
      supabaseBrowser.auth.signOut();
    } catch {}
    window.location.href = "/admin/login?expired=1";
  }, []);

  // 1. Authenticate Session
  useEffect(() => {
    async function checkAuth() {
      const stored = typeof window !== "undefined" ? localStorage.getItem("ws_admin_session") : null;
      let token: string | null = null;
      let user: any = null;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const isExpired = parsed?.expires_at ? parsed.expires_at * 1000 <= Date.now() : false;
          if (parsed?.access_token && !isExpired) {
            token = parsed.access_token;
            user = parsed.user || { email: "admin@wealthystep.com" };
          }
        } catch {}
      }

      if (!token) {
        try {
          const { data: { session } } = await supabaseBrowser.auth.getSession();
          if (session?.user && session?.access_token) {
            token = session.access_token;
            user = session.user;
            if (typeof window !== "undefined") {
              localStorage.setItem("ws_admin_session", JSON.stringify(session));
            }
          }
        } catch {}
      }

      if (token && user) {
        setAdminUser(user);
        setAuthToken(token);
      } else {
        handleSessionExpired();
      }
    }
    checkAuth();
  }, [handleSessionExpired]);

  // 2. Fetch Clients List
  const fetchClients = useCallback(async (silent = false) => {
    if (!authToken) return;
    if (!silent) setIsLoadingClients(true);
    try {
      const res = await fetch("/api/admin/clients", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && data.clients) {
        setClients(data.clients);
      } else {
        showFeedback("error", data.error || "Failed to load clients.");
      }
    } catch {
      showFeedback("error", "Error connecting to clients service.");
    } finally {
      setIsLoadingClients(false);
    }
  }, [authToken, handleSessionExpired]);

  // 3. Fetch Audit Logs
  const fetchAuditLogs = useCallback(
    async (page: number = 1, silent = false) => {
      if (!authToken) return;
      if (!silent) setIsLoadingAudit(true);
      try {
        const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=25`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (res.status === 401) {
          handleSessionExpired();
          return;
        }

        const data = await res.json();
        if (res.ok && data.logs) {
          setAuditLogs(data.logs);
          setAuditPage(data.pagination.page);
          setAuditTotalPages(data.pagination.totalPages || 1);
        } else {
          showFeedback("error", data.error || "Failed to load audit logs.");
        }
      } catch {
        showFeedback("error", "Error loading audit records.");
      } finally {
        setIsLoadingAudit(false);
      }
    },
    [authToken, handleSessionExpired]
  );

  // 4. Fetch Real-time Cloud & DB Storage Metrics
  const fetchStorageMetrics = useCallback(
    async (fresh: boolean = false) => {
      if (!authToken) return;
      setIsLoadingMetrics(true);
      try {
        const res = await fetch(`/api/admin/storage/metrics${fresh ? "?fresh=true" : ""}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (res.status === 401) {
          handleSessionExpired();
          return;
        }

        const data = await res.json();
        if (res.ok && data.b2 && data.supabase) {
          setStorageMetrics(data);
        }
      } catch {
        // Non-blocking
      } finally {
        setIsLoadingMetrics(false);
      }
    },
    [authToken, handleSessionExpired]
  );

  // Initial load once authToken is available
  useEffect(() => {
    if (authToken) {
      fetchClients();
      fetchStorageMetrics();
    }
  }, [authToken, fetchClients, fetchStorageMetrics]);

  // Load audit tab when first switched to
  useEffect(() => {
    if (authToken && activeTab === "audit") {
      fetchAuditLogs(1, auditLogs.length > 0);
    }
  }, [authToken, activeTab, fetchAuditLogs, auditLogs.length]);

  // Purge Audit Records & Ephemeral Tokens (Custom Options: All, 7 Days, 30 Days)
  const handlePurgeOldLogs = async (days: number = 0) => {
    if (!authToken) return;

    setIsPurgingLogs(true);
    try {
      const res = await fetch("/api/admin/audit-logs/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ days }),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to purge audit records.");

      showFeedback("success", data.message || "Audit records cleared successfully.");
      setIsPurgeModalOpen(false);
      fetchAuditLogs(1);
      fetchStorageMetrics(true);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to clear audit records.");
    } finally {
      setIsPurgingLogs(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ws_admin_session");
      document.cookie = "sb-access-token=; path=/; max-age=0";
    }
    try {
      await supabaseBrowser.auth.signOut();
    } catch {}
    window.location.href = "/admin/login";
  };

  // Open Add/Edit Client Modal
  const openAddClientModal = () => {
    setEditingClient(null);
    setClientForm({ name: "", mobile: "", email: "", dob: "" });
    setClientFormError(null);
    setIsClientModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      mobile: client.mobile,
      email: client.email,
      dob: client.dob,
    });
    setClientFormError(null);
    setIsClientModalOpen(true);
  };

  // Save Client Form (Create or Update)
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setClientFormError(null);

    // Client-side quick validations
    const cleanName = clientForm.name.trim();
    const cleanMobile = clientForm.mobile.replace(/\D/g, "");
    const cleanEmail = clientForm.email.trim();
    const cleanDob = clientForm.dob.trim();

    if (!cleanName || cleanName.length < 2) {
      setClientFormError("Client full name must be at least 2 characters.");
      return;
    }

    if (cleanMobile.length < 10) {
      setClientFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setClientFormError("Please enter a valid email address (e.g. client@example.com).");
      return;
    }

    if (!cleanDob) {
      setClientFormError("Date of Birth is required.");
      return;
    }

    setIsSavingClient(true);
    try {
      const url = editingClient ? `/api/admin/clients/${editingClient.id}` : "/api/admin/clients";
      const method = editingClient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(clientForm),
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || "Failed to save client.";
        setClientFormError(errorMsg);
        showFeedback("error", errorMsg);
        return;
      }

      showFeedback("success", editingClient ? "Client updated successfully." : "Client created successfully.");
      setIsClientModalOpen(false);
      fetchClients();
      fetchStorageMetrics(true);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to save client.";
      setClientFormError(errorMsg);
      showFeedback("error", errorMsg);
    } finally {
      setIsSavingClient(false);
    }
  };

  // Delete Client & B2 Files
  const handleDeleteClient = async () => {
    if (!clientToDelete || !authToken) return;
    setIsDeletingClient(true);

    try {
      const res = await fetch(`/api/admin/clients/${clientToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete client.");

      showFeedback("success", "Client and all associated files deleted.");
      setClientToDelete(null);
      if (selectedClientForDocs?.id === clientToDelete.id) {
        setSelectedClientForDocs(null);
      }
      fetchClients();
      fetchStorageMetrics(true);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to delete client.");
    } finally {
      setIsDeletingClient(false);
    }
  };

  // Handle Multi-file Selection
  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const pdfFiles: File[] = [];
    const oversizedFiles: string[] = [];

    Array.from(files).forEach((f) => {
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        if (f.size <= 15 * 1024 * 1024) {
          pdfFiles.push(f);
        } else {
          oversizedFiles.push(f.name);
        }
      }
    });

    if (oversizedFiles.length > 0) {
      showFeedback("error", `Some files exceed the 15MB limit: ${oversizedFiles.join(", ")}`);
    }

    setSelectedFiles((prev) => [...prev, ...pdfFiles]);
  };

  const removeFileFromQueue = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Batch / Multi-Document Upload with Real-time Progress Bar
  const handleUploadMultipleDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForDocs || selectedFiles.length === 0 || !authToken) return;

    setIsUploadingDocs(true);
    const totalFiles = selectedFiles.length;
    let successCount = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      const percent = Math.round(((i + 1) / totalFiles) * 100);

      setUploadProgress({
        current: i + 1,
        total: totalFiles,
        currentFileName: file.name,
        percent,
      });

      try {
        const formData = new FormData();
        formData.append("clientId", selectedClientForDocs.id);
        formData.append("title", file.name.replace(/\.pdf$/i, ""));
        formData.append("file", file);

        const res = await fetch("/api/admin/documents/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        });

        if (res.status === 401) {
          handleSessionExpired();
          return;
        }

        if (res.ok) {
          successCount++;
        }
      } catch (uploadErr) {
        console.error(`Failed to upload ${file.name}:`, uploadErr);
      }
    }

    // Refresh client docs
    try {
      const clientRes = await fetch(`/api/admin/clients/${selectedClientForDocs.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (clientRes.status === 401) {
        handleSessionExpired();
        return;
      }
      const updatedData = await clientRes.json();
      if (clientRes.ok && updatedData.client) {
        setSelectedClientForDocs(updatedData.client);
      }
    } catch {}

    fetchClients();
    fetchStorageMetrics(true);

    setTimeout(() => {
      setIsUploadingDocs(false);
      setUploadProgress(null);
      setSelectedFiles([]);
      showFeedback("success", `Successfully uploaded ${successCount} of ${totalFiles} documents to Backblaze B2.`);
    }, 800);
  };

  // Delete Individual Document
  const handleDeleteDocument = async (docId: string) => {
    if (!authToken) return;

    setDeletingDocId(docId);
    try {
      const res = await fetch(`/api/admin/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete document.");

      showFeedback("success", "Document deleted from storage.");

      if (selectedClientForDocs) {
        const clientRes = await fetch(`/api/admin/clients/${selectedClientForDocs.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (clientRes.status === 401) {
          handleSessionExpired();
          return;
        }
        const updatedData = await clientRes.json();
        if (clientRes.ok && updatedData.client) {
          setSelectedClientForDocs(updatedData.client);
        }
      }
      fetchClients();
      fetchStorageMetrics(true);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to delete document.");
    } finally {
      setDeletingDocId(null);
    }
  };

  // Preview Document In-Browser
  const handlePreviewDocument = async (docId: string, title: string, fileSize?: number) => {
    if (!authToken) return;
    setPreviewLoadingId(docId);
    try {
      const res = await fetch(`/api/admin/documents/${docId}/preview?stream=1`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load document preview.");
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
        docId: docId,
      });
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to load document preview.");
    } finally {
      setPreviewLoadingId(null);
    }
  };

  // Direct Document Download
  const handleAdminDownload = async (docId: string, title: string) => {
    if (!authToken) return;
    setDownloadingDocId(docId);
    try {
      const res = await fetch(`/api/admin/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate download.");

      if (data.downloadUrl) {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = data.filename || (title.endsWith(".pdf") ? title : `${title}.pdf`);
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showFeedback("success", `Downloading "${title}"...`);
      }
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to download document.");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.mobile.includes(q)
    );
  });

  const totalDocumentsCount = clients.reduce((acc, c) => acc + (c.documents?.length || 0), 0);

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "WS";
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#110834] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
          <RefreshCw className="w-8 h-8 animate-spin text-[#84BD3C]" />
        </div>
        <p className="text-sm font-medium text-gray-300">Authenticating Vault Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFBF7] via-[#F6F8F2] to-[#EEF3E6] flex flex-col font-sans selection:bg-[#84BD3C]/30 text-gray-800">
      {/* Clean Top Action Bar */}
      <div className="border-b border-gray-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Simple Vault Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F3F7EB] text-[#3C6415] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-[#180D45]">
                Admin <span className="text-[#446A1B]">Vault Console</span>
              </h1>
            </div>
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
              <div className="w-5 h-5 rounded-md bg-[#180D45] text-[#84BD3C] font-black flex items-center justify-center text-[10px]">
                A
              </div>
              <span className="hidden sm:inline font-medium max-w-[180px] truncate">
                {adminUser.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-md transition-all animate-fade-in ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-950 border border-emerald-300"
                : "bg-red-50 text-red-950 border border-red-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="p-1 rounded-lg hover:bg-black/5 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4-Card Luxury Real-Time Storage & Metric Monitor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Registered Clients */}
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#C7D9A8]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Registered Clients</p>
                <h3 className="text-3xl font-black text-[#180D45] mt-1 tracking-tight">{clients.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#180D45]/5 text-[#180D45] flex items-center justify-center shrink-0 group-hover:bg-[#180D45] group-hover:text-white transition-all shadow-xs">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="font-medium">Active Investor Profiles</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>

          {/* Card 2: Policy Documents */}
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#C7D9A8]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#84BD3C]/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Policy Documents</p>
                <h3 className="text-3xl font-black text-[#180D45] mt-1 tracking-tight">{totalDocumentsCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#84BD3C]/15 text-[#446A1B] flex items-center justify-center shrink-0 group-hover:bg-[#84BD3C] group-hover:text-[#180D45] transition-all shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="font-medium">Stored Policy Bonds</span>
              <span className="font-extrabold text-[#180D45]">
                {storageMetrics ? storageMetrics.b2.usedFormatted : "Calculating..."}
              </span>
            </div>
          </div>

          {/* Card 3: Backblaze B2 Storage (10 GB Free Tier) */}
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#C7D9A8]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Backblaze B2</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                    10 GB FREE
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-black text-[#180D45] font-mono">
                    {storageMetrics ? storageMetrics.b2.usedFormatted : "—"}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">/ 10 GB</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-xs">
                <Cloud className="w-6 h-6" />
              </div>
            </div>

            {/* B2 Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-gray-200/50">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.min(100, (storageMetrics?.b2.usagePercent || 0) * 10))}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-gray-500">
                <span className="text-purple-700">{storageMetrics?.b2.usagePercent || 0}% Used</span>
                <span className="text-emerald-700">{storageMetrics ? storageMetrics.b2.freeFormatted : "10 GB"} Free</span>
              </div>
            </div>
          </div>

          {/* Card 4: Supabase Database Storage (500 MB Free Tier) */}
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-[#C7D9A8]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Supabase DB</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    500 MB FREE
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-black text-[#180D45] font-mono">
                    {storageMetrics ? storageMetrics.supabase.usedFormatted : "—"}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">/ 500 MB</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                <Database className="w-6 h-6" />
              </div>
            </div>

            {/* Supabase Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-gray-200/50">
                <div
                  className="bg-gradient-to-r from-[#84BD3C] to-emerald-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.min(100, (storageMetrics?.supabase.usagePercent || 0) * 5))}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-gray-500">
                <span className="text-[#3C6415]">{storageMetrics?.supabase.usagePercent || 0}% Used</span>
                <span className="text-emerald-700">{storageMetrics ? storageMetrics.supabase.freeFormatted : "498 MB"} Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar (Fully Responsive) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-gray-200/80 pb-3">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 bg-white/90 border border-gray-200/80 rounded-2xl shadow-xs">
            <button
              onClick={() => setActiveTab("clients")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "clients"
                  ? "bg-[#180D45] text-white shadow-xs"
                  : "text-gray-500 hover:text-[#180D45] hover:bg-gray-100/60"
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Client Vault</span>
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                  activeTab === "clients" ? "bg-[#84BD3C] text-[#180D45]" : "bg-gray-200 text-gray-700"
                }`}
              >
                {clients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-[#180D45] text-white shadow-xs"
                  : "text-gray-500 hover:text-[#180D45] hover:bg-gray-100/60"
              }`}
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Audit Logs</span>
            </button>
          </div>

          {/* Quick Stats Refresh */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === "clients") fetchClients();
                if (activeTab === "audit") fetchAuditLogs(1);
                fetchStorageMetrics(true);
              }}
              className="p-2.5 bg-white border border-gray-200/80 hover:border-gray-300 rounded-xl text-gray-600 hover:text-[#180D45] transition-all shadow-xs cursor-pointer active:scale-95"
              title="Refresh dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingClients || isLoadingAudit || isLoadingMetrics ? "animate-spin text-[#84BD3C]" : ""}`} />
            </button>
          </div>
        </div>

        {/* ======================= TAB 1: CLIENTS & POLICIES ======================= */}
        {activeTab === "clients" && (
          <div className="space-y-5">
            {/* Search & Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client name, mobile, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#84BD3C] focus:border-transparent transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={openAddClientModal}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#84BD3C]" />
                  <span>Register New Client</span>
                </button>
              </div>
            </div>

            {/* DESKTOP TABLE VIEW (Screens >= 768px) */}
            <div className="hidden md:block bg-white border border-[#C7D9A8]/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#FAFBF7] border-b border-gray-200/80 uppercase text-[10px] font-extrabold text-gray-500 tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Investor Name</th>
                      <th className="py-4 px-5">Mobile</th>
                      <th className="py-4 px-5">Email Address</th>
                      <th className="py-4 px-5">Date of Birth</th>
                      <th className="py-4 px-5">Vault Documents</th>
                      <th className="py-4 px-5 text-right">Vault Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoadingClients ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-gray-400">
                          <RefreshCw className="w-8 h-8 animate-spin text-[#84BD3C] mx-auto mb-3" />
                          <span className="font-semibold text-xs">Loading secure client records...</span>
                        </td>
                      </tr>
                    ) : filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-gray-400">
                          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="font-semibold text-gray-600">No matching clients found.</p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            Click "Register New Client" above to create an investor account.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedClientForDocs(c)}
                          className="hover:bg-[#FAFBF7] transition-all group cursor-pointer"
                        >
                          {/* Client Name with Avatar */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#180D45] to-[#25156B] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                                {getInitials(c.name)}
                              </div>
                              <div>
                                <div className="font-extrabold text-[#180D45] group-hover:text-[#446A1B] transition-colors flex items-center gap-1.5">
                                  <span>{c.name}</span>
                                  <FolderOpen className="w-3.5 h-3.5 text-[#84BD3C] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-[10px] text-gray-400">ID: {c.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </td>

                          {/* Mobile */}
                          <td className="py-4 px-5 font-mono font-medium text-gray-800">
                            {c.mobile}
                          </td>

                          {/* Email */}
                          <td className="py-4 px-5 text-gray-600 max-w-[200px] truncate">
                            {c.email}
                          </td>

                          {/* DOB */}
                          <td className="py-4 px-5 font-mono font-semibold text-[#180D45]">
                            {c.dob}
                          </td>

                          {/* Document count pill button */}
                          <td className="py-4 px-5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientForDocs(c);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F7EB] hover:bg-[#84BD3C] text-[#3C6415] hover:text-[#180D45] font-extrabold text-[11px] transition-all shadow-2xs cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{c.documents?.length || 0} Files</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setSelectedClientForDocs(c)}
                                className="p-2 text-gray-500 hover:text-[#180D45] hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                                title="Manage & Upload Documents"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditClientModal(c)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                                title="Edit client"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setClientToDelete(c)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                title="Delete client"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARD DECK (Screens < 768px) */}
            <div className="block md:hidden space-y-3.5">
              {isLoadingClients ? (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-gray-200">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#84BD3C] mx-auto mb-2" />
                  <p className="text-xs font-semibold">Loading clients...</p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-gray-200">
                  <p className="text-xs font-semibold">No clients match your search.</p>
                </div>
              ) : (
                filteredClients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientForDocs(c)}
                    className="bg-white p-4.5 rounded-2xl border border-[#C7D9A8]/70 shadow-xs hover:border-[#84BD3C] transition-all space-y-3.5 active:bg-gray-50 cursor-pointer"
                  >
                    {/* Header Row: Avatar + Name + Doc Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#180D45] to-[#25156B] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#180D45] text-sm leading-tight">{c.name}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">DOB: {c.dob}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-[#F3F7EB] text-[#3C6415] text-[11px] font-black border border-[#C7D9A8]">
                        {c.documents?.length || 0} Docs
                      </span>
                    </div>

                    {/* Contact details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-[#FAFBF7] p-2.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-mono truncate">{c.mobile}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    </div>

                    {/* Action buttons (Full-width touch targets) */}
                    <div
                      className="flex items-center gap-2 pt-1 border-t border-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setSelectedClientForDocs(c)}
                        className="flex-1 py-2 rounded-xl bg-[#180D45] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#84BD3C]" />
                        <span>Manage Vault</span>
                      </button>

                      <button
                        onClick={() => openEditClientModal(c)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setClientToDelete(c)}
                        className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: AUDIT LOGS ======================= */}
        {activeTab === "audit" && (
          <div className="space-y-5">
            {/* Header & Clean Up Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80">
              <div>
                <h3 className="text-sm font-extrabold text-[#180D45]">System Access & Document Audit Trail</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Automated storage optimization active: 30-day retention keeps Supabase DB well within the 500 MB free quota.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPurgeModalOpen(true)}
                  disabled={isPurgingLogs}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer"
                  title="Purge or clear audit records"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Purge Audit Logs</span>
                </button>

                <button
                  onClick={() => fetchAuditLogs(auditPage)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#180D45] text-white text-xs font-bold hover:bg-[#25156B] transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAudit ? "animate-spin text-[#84BD3C]" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white border border-[#C7D9A8]/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#FAFBF7] border-b border-gray-200 uppercase text-[10px] font-extrabold text-gray-500 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Timestamp (IST)</th>
                      <th className="py-3.5 px-4">Actor</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-4">Target Type</th>
                      <th className="py-3.5 px-4">IP Address</th>
                      <th className="py-3.5 px-4">Activity Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoadingAudit ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#84BD3C] mx-auto mb-2" />
                          <span>Loading audit records...</span>
                        </td>
                      </tr>
                    ) : auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          No audit log records found.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#180D45] max-w-[160px] truncate">
                            {log.actor}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                log.action.includes("DELETE")
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : log.action.includes("UPLOAD") || log.action.includes("CREATE")
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 uppercase text-[10px] text-gray-500 font-bold">
                            {log.target_type}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                            {log.ip_address || "—"}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-gray-600 max-w-xs truncate">
                            {JSON.stringify(log.details)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Audit Pagination */}
              {auditTotalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">Page {auditPage} of {auditTotalPages}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchAuditLogs(auditPage - 1)}
                      disabled={auditPage <= 1 || isLoadingAudit}
                      className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fetchAuditLogs(auditPage + 1)}
                      disabled={auditPage >= auditTotalPages || isLoadingAudit}
                      className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ======================= MODAL 1: ADD / EDIT CLIENT (4 REQUIRED FIELDS) ======================= */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F3F7EB] text-[#3C6415] flex items-center justify-center shadow-2xs">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#180D45]">
                  {editingClient ? "Edit Client Profile" : "Register New Client"}
                </h3>
              </div>
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {clientFormError && (
              <div className="mb-3.5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold leading-relaxed">
                  {clientFormError}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={clientForm.name}
                  onChange={(e) => {
                    setClientForm({ ...clientForm, name: e.target.value });
                    if (clientFormError) setClientFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#84BD3C] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (Unique) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={clientForm.mobile}
                  onChange={(e) => {
                    setClientForm({ ...clientForm, mobile: e.target.value });
                    if (clientFormError) setClientFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#84BD3C] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address (Unique) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  value={clientForm.email}
                  onChange={(e) => {
                    setClientForm({ ...clientForm, email: e.target.value });
                    if (clientFormError) setClientFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAFBF7] border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#84BD3C] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Date of Birth (DD/MM/YYYY) *
                </label>
                <PremiumDatePicker
                  value={clientForm.dob}
                  onChange={(dateStr) => setClientForm({ ...clientForm, dob: dateStr })}
                  required
                  inline={true}
                />
              </div>

              <div className="pt-2 flex gap-2 sm:gap-2.5 items-center">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-bold hover:bg-gray-50 transition cursor-pointer flex items-center justify-center whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingClient}
                  className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-md disabled:opacity-60 whitespace-nowrap"
                >
                  {isSavingClient ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingClient ? "Save Changes" : "Create Account"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL 2: DELETE CLIENT CONFIRMATION ======================= */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#180D45]">Delete Client Record?</h3>
            <p className="text-xs text-gray-600 mt-2">
              Are you sure you want to permanently delete <strong>{clientToDelete.name}</strong>?
            </p>
            <div className="text-[11px] text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 mt-3 text-left">
              ⚠️ <strong>Warning:</strong> This permanently deletes all associated policy PDF files from Backblaze B2 storage as well.
            </div>

            <div className="pt-5 flex gap-2 sm:gap-3 items-center">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-bold hover:bg-gray-50 transition cursor-pointer flex items-center justify-center whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteClient}
                disabled={isDeletingClient}
                className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-60 whitespace-nowrap"
              >
                {isDeletingClient ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL 3: MULTI-DOCUMENT MANAGEMENT & UPLOAD ======================= */}
      {selectedClientForDocs && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F3F7EB] text-[#3C6415] flex items-center justify-center shadow-xs">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#180D45]">
                    Document Vault: {selectedClientForDocs.name}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {selectedClientForDocs.email} • {selectedClientForDocs.mobile} • DOB: {selectedClientForDocs.dob}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedClientForDocs(null);
                  setSelectedFiles([]);
                  setUploadProgress(null);
                }}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
              {/* Multi-PDF Drag and Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-3xl p-5 sm:p-6 transition-all ${
                  isDragOver ? "border-[#84BD3C] bg-[#84BD3C]/10" : "border-[#C7D9A8] bg-[#FAFBF7]"
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#84BD3C]/20 text-[#3C6415] flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#180D45] uppercase tracking-wider">
                    Upload Multiple Policy PDFs (1, 2, 5, 10+ Files)
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Drag and drop PDF documents here, or click to browse (Max 15MB each)
                  </p>

                  <label className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95">
                    <Plus className="w-4 h-4 text-[#84BD3C]" />
                    <span>Select PDF Files</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                    />
                  </label>
                </div>

                {/* Selected Files Queue */}
                {selectedFiles.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs font-bold text-[#180D45] mb-2">
                      <span>Ready to Upload ({selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"})</span>
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="text-[11px] text-red-500 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="truncate font-bold text-gray-800">{file.name}</span>
                            <span className="text-[10px] text-gray-400 shrink-0">({formatBytes(file.size)})</span>
                          </div>
                          {!isUploadingDocs && (
                            <button
                              type="button"
                              onClick={() => removeFileFromQueue(idx)}
                              className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Real-Time Upload Progress Meter */}
                    {isUploadingDocs && uploadProgress && (
                      <div className="mt-4 p-3.5 bg-white rounded-2xl border border-[#84BD3C]/50 shadow-sm animate-fade-in space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#180D45]">
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                            <span>Uploading {uploadProgress.current} of {uploadProgress.total}</span>
                          </span>
                          <span className="font-mono text-[#446A1B] font-extrabold">{uploadProgress.percent}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-gray-200/50">
                          <div
                            className="bg-gradient-to-r from-[#84BD3C] to-emerald-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress.percent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">
                          File: <strong>{uploadProgress.currentFileName}</strong>
                        </p>
                      </div>
                    )}

                    {!isUploadingDocs && (
                      <button
                        type="button"
                        onClick={handleUploadMultipleDocuments}
                        className="mt-3.5 w-full py-3 px-4 rounded-xl bg-[#84BD3C] hover:bg-[#83C120] text-[#180D45] text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Start Uploading {selectedFiles.length} Documents to B2</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Uploaded Documents List */}
              <div>
                <h4 className="text-xs font-bold text-[#180D45] uppercase tracking-wider mb-3">
                  Current Vault Documents ({selectedClientForDocs.documents?.length || 0})
                </h4>

                <div className="space-y-2.5">
                  {!selectedClientForDocs.documents || selectedClientForDocs.documents.length === 0 ? (
                    <div className="text-xs text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                      <p className="font-medium text-gray-600">No policy documents uploaded yet.</p>
                      <p className="text-[10px] text-gray-400">Use the upload box above to add policy PDFs.</p>
                    </div>
                  ) : (
                    selectedClientForDocs.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-gray-200/90 bg-white hover:border-[#84BD3C]/60 hover:shadow-xs transition-all gap-2.5 sm:gap-3"
                      >
                        {/* Doc Info */}
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-[#180D45] truncate" title={doc.title}>{doc.title}</div>
                            <div className="text-[10px] text-gray-400">
                              {formatBytes(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString("en-IN")}
                            </div>
                          </div>
                        </div>

                        {/* Doc Actions */}
                        <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <button
                            onClick={() => handlePreviewDocument(doc.id, doc.title, doc.file_size)}
                            disabled={previewLoadingId === doc.id}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-[#180D45] bg-[#F3F7EB] hover:bg-[#84BD3C] rounded-xl transition-all cursor-pointer"
                            title="Preview document"
                          >
                            {previewLoadingId === doc.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#84BD3C]" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => handleAdminDownload(doc.id, doc.title)}
                            disabled={downloadingDocId === doc.id}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#180D45] hover:bg-[#25156B] rounded-xl transition-all cursor-pointer"
                            title="Download document"
                          >
                            {downloadingDocId === doc.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span>Download</span>
                          </button>

                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            disabled={deletingDocId === doc.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer shrink-0"
                            title="Delete file"
                          >
                            {deletingDocId === doc.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setSelectedClientForDocs(null);
                  setSelectedFiles([]);
                  setUploadProgress(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center whitespace-nowrap"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL 4: PURGE AUDIT LOGS MODAL ======================= */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-2xs">
                  <Trash2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#180D45]">Purge & Clean Audit Trail</h3>
                  <p className="text-[11px] text-gray-500">Select which audit records to permanently remove.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPurgeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Option 1: Clear All */}
              <label
                onClick={() => setPurgeOption(0)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  purgeOption === 0
                    ? "border-red-500 bg-red-50/60 shadow-xs ring-1 ring-red-400/30"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      purgeOption === 0
                        ? "border-red-600 bg-red-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {purgeOption === 0 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Clear All Audit Logs (100% Wipe)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Deletes all historical access records, token generation logs, and expired OTPs immediately.
                  </div>
                </div>
              </label>

              {/* Option 2: Older than 7 Days */}
              <label
                onClick={() => setPurgeOption(7)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  purgeOption === 7
                    ? "border-red-500 bg-red-50/60 shadow-xs ring-1 ring-red-400/30"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      purgeOption === 7
                        ? "border-red-600 bg-red-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {purgeOption === 7 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Purge Logs Older than 7 Days</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Retains this week's records and removes everything older.
                  </div>
                </div>
              </label>

              {/* Option 3: Older than 30 Days */}
              <label
                onClick={() => setPurgeOption(30)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  purgeOption === 30
                    ? "border-red-500 bg-red-50/60 shadow-xs ring-1 ring-red-400/30"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      purgeOption === 30
                        ? "border-red-600 bg-red-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {purgeOption === 30 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Purge Logs Older than 30 Days</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Standard monthly archive pruning to free up database storage.
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-3 flex gap-2 sm:gap-2.5 items-center">
              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(false)}
                className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-bold hover:bg-gray-50 transition cursor-pointer flex items-center justify-center whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePurgeOldLogs(purgeOption)}
                disabled={isPurgingLogs}
                className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-60 whitespace-nowrap"
              >
                {isPurgingLogs ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <span>Confirm & Purge</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF In-Browser Previewer Modal */}
      <PdfViewerModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, data: null, blobUrl: null, title: "", docId: undefined })}
        pdfData={previewModal.data}
        blobUrl={previewModal.blobUrl}
        title={previewModal.title}
        fileSize={previewModal.fileSize}
        onDownload={previewModal.docId ? () => handleAdminDownload(previewModal.docId!, previewModal.title) : undefined}
      />
    </div>
  );
}
