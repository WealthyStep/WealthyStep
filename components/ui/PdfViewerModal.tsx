"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  FileText,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
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

// Load local PDF.js script from /pdfjs/pdf.min.js
function loadLocalPdfJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject("Not in browser");
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="/pdfjs/pdf.min.js"]');
    if (existing) {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
      } else {
        existing.addEventListener("load", () => resolve((window as any).pdfjsLib));
        existing.addEventListener("error", reject);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "/pdfjs/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
        resolve(lib);
      } else {
        reject(new Error("PDF.js failed to initialize"));
      }
    };
    script.onerror = () => reject(new Error("Unable to load local PDF viewing engine"));
    document.head.appendChild(script);
  });
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfData,
  blobUrl,
  title,
  fileSize,
  onDownload,
}: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setScale(1.2);
      setRotation(0);
      setIsLoading(true);
      setErrorMsg(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsFullscreen(false);
      pdfDocRef.current = null;
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, pdfData]);

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

  // Load PDF Document directly from in-memory ArrayBuffer
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      if (!isOpen || !pdfData) return;

      setIsLoading(true);
      setErrorMsg(null);

      try {
        const pdfjsLib = await loadLocalPdfJs();

        // Pass ArrayBuffer directly - ZERO network fetch calls inside modal
        const dataCopy = new Uint8Array(pdfData);
        const loadingTask = pdfjsLib.getDocument({ data: dataCopy });
        const doc = await loadingTask.promise;

        if (!isCancelled) {
          pdfDocRef.current = doc;
          setNumPages(doc.numPages);
          setPageNumber(1);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Local PDF parsing error:", err);
        if (!isCancelled) {
          setErrorMsg(err.message || "Failed to render PDF document.");
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, pdfData]);

  // Render active page onto HTML5 Canvas
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || isLoading) return;

    async function renderPage() {
      try {
        const page = await pdfDocRef.current.getPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Cancel previous render task if active
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const viewport = page.getViewport({ scale, rotation });

        // High DPI resolution for sharp text
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Canvas render error:", err);
        }
      }
    }

    renderPage();
  }, [pageNumber, scale, rotation, isLoading]);

  if (!isOpen || !pdfData) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 animate-fade-in">
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
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
                {title}
              </h3>
              {fileSize && (
                <span className="text-[10px] font-mono text-gray-300">
                  {formatFileSize(fileSize)} &bull; Native Canvas PDF
                </span>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Direct Download button */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84BD3C] hover:bg-[#72A633] text-[#180D45] text-xs font-bold transition shadow-xs cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}

            {/* Open in New Tab */}
            {blobUrl && (
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

        {/* Floating Secondary Toolbar: Page Navigation & Zoom */}
        {numPages > 0 && !isLoading && !errorMsg && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#1E1540] border-b border-white/10 text-white text-xs shrink-0 flex-wrap gap-2">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs text-gray-200">
                Page <strong className="text-white">{pageNumber}</strong> of{" "}
                <strong className="text-white">{numPages}</strong>
              </span>

              <button
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom & Rotation Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[11px] text-gray-300 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition cursor-pointer ml-1"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PDF Viewer Body: Canvas Rendering Surface */}
        <div className="relative flex-1 w-full bg-[#161226] overflow-auto flex items-start justify-center p-4 sm:p-6 select-none">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0826]/90 text-white z-10">
              <Loader2 className="w-9 h-9 animate-spin text-[#84BD3C] mb-3" />
              <p className="text-xs text-gray-300 font-medium">
                Rendering policy document with canvas engine...
              </p>
            </div>
          )}

          {/* Error View */}
          {errorMsg ? (
            <div className="p-8 text-center max-w-md my-auto">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h4 className="text-white font-bold text-sm mb-1">
                Unable to Render Document
              </h4>
              <p className="text-xs text-gray-400 mb-4">{errorMsg}</p>
              <div className="flex items-center justify-center gap-3">
                {blobUrl && (
                  <button
                    onClick={handleOpenNewTab}
                    className="px-4 py-2 bg-[#84BD3C] text-[#180D45] rounded-xl text-xs font-bold hover:bg-[#72A633] transition cursor-pointer"
                  >
                    Open in New Tab
                  </button>
                )}
                {onDownload && (
                  <button
                    onClick={onDownload}
                    className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition cursor-pointer"
                  >
                    Download File
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* HTML5 Canvas */
            <div className="shadow-2xl rounded-sm overflow-hidden bg-white my-auto border border-gray-300">
              <canvas ref={canvasRef} className="block mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
