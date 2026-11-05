"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  QrCode,
} from "lucide-react";
import { downloadBrandedQrCard, downloadCleanQrCode } from "@/lib/qr-card-generator";
import QRCode from "qrcode";

export default function PresentationStagePage() {
  const [formUrl, setFormUrl] = useState("https://wealthystep.com/participant-form/");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isDownloadingClean, setIsDownloadingClean] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/participant-form/`;
      setFormUrl(url);

      QRCode.toDataURL(url, {
        errorCorrectionLevel: "H",
        width: 600,
        margin: 1,
        color: {
          dark: "#180D45",
          light: "#FFFFFF",
        },
      })
        .then((data) => setQrDataUrl(data))
        .catch((err) => console.error("QR Generation error:", err));
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleDownloadBranded = async () => {
    try {
      setIsDownloadingCard(true);
      await downloadBrandedQrCard(formUrl, "WealthyStep_Financial_Freedom_Program_Slide.png");
    } catch (err) {
      console.error(err);
      alert("Failed to download presentation card.");
    } finally {
      setIsDownloadingCard(false);
    }
  };

  const handleDownloadClean = async () => {
    try {
      setIsDownloadingClean(true);
      await downloadCleanQrCode(formUrl, "WealthyStep_Participant_QR_Code.png");
    } catch (err) {
      console.error(err);
      alert("Failed to download QR code.");
    } finally {
      setIsDownloadingClean(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#180D45] via-[#1B0F4C] to-[#0A051E] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#84BD3C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Controls ── */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/participant-form"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <span>Live Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#84BD3C]" />
          </Link>
        </div>

        {/* Action Controls for Presentation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-[#180D45] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Link Copied!" : "Copy Form Link"}</span>
          </button>

          <button
            onClick={handleDownloadBranded}
            disabled={isDownloadingCard}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84BD3C] hover:bg-[#96D645] text-[#180D45] text-xs font-black transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {isDownloadingCard ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download Slide Card (PNG)</span>
          </button>

          <button
            onClick={handleDownloadClean}
            disabled={isDownloadingClean}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            title="Download pure QR code without background card"
          >
            <QrCode className="w-3.5 h-3.5 text-[#84BD3C]" />
            <span>Clean QR</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#84BD3C]" />
            <span>{isFullscreen ? "Exit Fullscreen" : "Projector Mode"}</span>
          </button>
        </div>
      </header>

      {/* ── Main Presentation Centerpiece ── */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto py-8 text-center max-w-4xl mx-auto space-y-6">
        {/* AMFI & Program Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#84BD3C]/40 text-[#84BD3C] text-xs sm:text-sm font-black tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-[#84BD3C]" />
          <span>Wealthy Step™ • AMFI Registered ARN-322891</span>
        </div>

        {/* Big Bold Stage Titles */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Financial Freedom Awareness Program
          </h1>
          <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto font-medium">
            Please scan this QR code with your mobile camera to share your details and receive personalized financial insights.
          </p>
        </div>

        {/* Center QR Code Display */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#84BD3C] via-lime-300 to-[#84BD3C] rounded-[40px] blur-md opacity-75 group-hover:opacity-100 transition duration-500" />

          <div className="relative bg-white p-6 sm:p-8 rounded-[36px] shadow-2xl border-4 border-[#84BD3C] flex flex-col items-center justify-center">
            {qrDataUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Financial Freedom Awareness Program Form QR Code"
                  className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl object-contain"
                />
                {/* Centered Brand Mark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#180D45] border-4 border-[#84BD3C] flex items-center justify-center shadow-lg">
                    <span className="text-[#84BD3C] font-black text-sm sm:text-base tracking-wider">WS</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center bg-gray-100 rounded-2xl">
                <RefreshCw className="w-8 h-8 animate-spin text-[#180D45]" />
              </div>
            )}

            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-[#180D45] text-white text-[11px] font-black tracking-wider uppercase">
                SCAN WITH MOBILE CAMERA
              </span>
              <p className="mt-1 text-xs font-mono font-bold text-gray-500">
                {formUrl}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Step Instruction Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-2">
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#84BD3C] text-[#180D45] font-black flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-white">Open Phone Camera</p>
              <p className="text-[10px] text-white/60">No special app required</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#84BD3C] text-[#180D45] font-black flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-white">Point at QR Code</p>
              <p className="text-[10px] text-white/60">Tap the link banner</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#84BD3C] text-[#180D45] font-black flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-white">Submit in 60 Sec</p>
              <p className="text-[10px] text-white/60">Receive valuable insights</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Disclaimers ── */}
      <footer className="relative z-10 text-center text-xs text-white/60 space-y-1 border-t border-white/10 pt-4">
        <p className="font-bold text-white/80">
          Wealthy Step™ • AMFI Registered Mutual Fund Distributor • ARN - 322891
        </p>
        <p className="text-[11px] text-white/50">
          Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing.
        </p>
      </footer>
    </div>
  );
}
