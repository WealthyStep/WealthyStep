"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfData?: ArrayBuffer | null;
  blobUrl?: string | null;
  title: string;
  fileSize?: number;
  onDownload?: () => void;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfData,
  blobUrl: providedBlobUrl,
  title,
  fileSize,
  onDownload,
}: PdfViewerModalProps) {
  const [internalBlobUrl, setInternalBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Manage in-memory blob URL lifecycle safely
  useEffect(() => {
    if (!isOpen) {
      if (internalBlobUrl && !providedBlobUrl) {
        URL.revokeObjectURL(internalBlobUrl);
      }
      setInternalBlobUrl(null);
      setIsLoading(true);
      setErrorMsg(null);
      setIsFullscreen(false);
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";
    setIsLoading(true);
    setErrorMsg(null);

    if (providedBlobUrl) {
      setInternalBlobUrl(providedBlobUrl);
      setIsLoading(false);
      return;
    }

    if (pdfData && pdfData.byteLength > 0) {
      try {
        const blob = new Blob([pdfData], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setInternalBlobUrl(url);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to generate PDF blob URL:", err);
        setErrorMsg("Unable to format document for display.");
        setIsLoading(false);
      }
    } else {
      setErrorMsg("No document data received.");
      setIsLoading(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, pdfData, providedBlobUrl]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeBlobUrl = providedBlobUrl || internalBlobUrl;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleOpenNewTab = () => {
    if (activeBlobUrl) {
      window.open(activeBlobUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (activeBlobUrl) {
      const a = document.createElement("a");
      a.href = activeBlobUrl;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9._-]/g, "_") || "policy_document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 animate-fade-in"
    >
      {/* Modal Container */}
      <div
        className={`bg-[#0F0826] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "w-full max-w-5xl h-[92vh] max-h-[900px]"
        }`}
      >
        {/* Top Luxury Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#180D45] border-b border-white/10 text-white shrink-0">
          {/* Document Title & Badge */}
          <div className="flex items-center gap-3 min-w-0 mr-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3
                id="pdf-modal-title"
                className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg"
              >
                {title}
              </h3>
              {fileSize ? (
                <span className="text-[10px] font-mono text-gray-300">
                  {formatFileSize(fileSize)} &bull; Secure Document Preview
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400">
                  Verified &bull; Confidential Policy Document
                </span>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Direct Download button */}
            <button
              onClick={handleDownload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84BD3C] hover:bg-[#72A633] text-[#180D45] text-xs font-bold transition shadow-xs cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            {/* Open in New Tab */}
            {activeBlobUrl && (
              <button
                onClick={handleOpenNewTab}
                className="p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-white/10 transition cursor-pointer ml-1"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="relative flex-1 w-full bg-[#161226] overflow-hidden flex items-center justify-center">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0826]/90 text-white z-10">
              <Loader2 className="w-9 h-9 animate-spin text-[#84BD3C] mb-3" />
              <p className="text-xs text-gray-300 font-medium">
                Loading secure document preview...
              </p>
            </div>
          )}

          {/* Error View */}
          {errorMsg ? (
            <div className="p-8 text-center max-w-md my-auto">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h4 className="text-white font-bold text-sm mb-1">
                Unable to Display Document
              </h4>
              <p className="text-xs text-gray-400 mb-4">{errorMsg}</p>
              <div className="flex items-center justify-center gap-3">
                {activeBlobUrl && (
                  <button
                    onClick={handleOpenNewTab}
                    className="px-4 py-2 bg-[#84BD3C] text-[#180D45] rounded-xl text-xs font-bold hover:bg-[#72A633] transition cursor-pointer"
                  >
                    Open in New Tab
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition cursor-pointer"
                >
                  Download File
                </button>
              </div>
            </div>
          ) : activeBlobUrl ? (
            /* Sandboxed Native PDF Renderer */
            <iframe
              src={`${activeBlobUrl}#toolbar=1&navpanes=0&view=FitH`}
              title={title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
