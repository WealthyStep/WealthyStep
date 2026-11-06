"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  ShieldCheck,
} from "lucide-react";
import { downloadBrandedQrCard, downloadCleanQrCode } from "@/lib/qr-card-generator";
import QRCode from "qrcode";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function PresentationStagePage() {
  const [formUrl, setFormUrl] = useState("https://wealthystep.com/participant-form/");
  const instagramUrl = "https://www.instagram.com/wealthy.step/";

  const [formQrDataUrl, setFormQrDataUrl] = useState<string>("");
  const [instagramQrDataUrl, setInstagramQrDataUrl] = useState<string>("");

  const [isCopiedForm, setIsCopiedForm] = useState(false);
  const [isCopiedIg, setIsCopiedIg] = useState(false);
  const [isDownloadingForm, setIsDownloadingForm] = useState(false);
  const [isDownloadingIg, setIsDownloadingIg] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const liveFormUrl = `${window.location.origin}/participant-form/`;
      setFormUrl(liveFormUrl);

      // Generate Participant Form QR
      QRCode.toDataURL(liveFormUrl, {
        errorCorrectionLevel: "H",
        width: 600,
        margin: 1,
        color: {
          dark: "#180D45",
          light: "#FFFFFF",
        },
      })
        .then((data) => setFormQrDataUrl(data))
        .catch((err) => console.error("Form QR error:", err));

      // Generate Instagram QR
      QRCode.toDataURL(instagramUrl, {
        errorCorrectionLevel: "H",
        width: 600,
        margin: 1,
        color: {
          dark: "#180D45",
          light: "#FFFFFF",
        },
      })
        .then((data) => setInstagramQrDataUrl(data))
        .catch((err) => console.error("Instagram QR error:", err));
    }
  }, [instagramUrl]);

  const handleCopyFormLink = () => {
    navigator.clipboard.writeText(formUrl);
    setIsCopiedForm(true);
    setTimeout(() => setIsCopiedForm(false), 2500);
  };

  const handleCopyIgLink = () => {
    navigator.clipboard.writeText(instagramUrl);
    setIsCopiedIg(true);
    setTimeout(() => setIsCopiedIg(false), 2500);
  };

  const handleDownloadFormQr = async () => {
    try {
      setIsDownloadingForm(true);
      await downloadCleanQrCode(formUrl, "WealthyStep_Participant_Form_QR.png", { type: "form" });
    } catch (err) {
      console.error(err);
      alert("Failed to download QR code.");
    } finally {
      setIsDownloadingForm(false);
    }
  };

  const handleDownloadIgQr = async () => {
    try {
      setIsDownloadingIg(true);
      await downloadCleanQrCode(instagramUrl, "WealthyStep_Instagram_QR.png", { type: "instagram" });
    } catch (err) {
      console.error(err);
      alert("Failed to download Instagram QR code.");
    } finally {
      setIsDownloadingIg(false);
    }
  };

  const handleDownloadBrandedSlide = async () => {
    try {
      setIsDownloadingCard(true);
      await downloadBrandedQrCard(formUrl, "WealthyStep_Financial_Freedom_Slide.png");
    } catch (err) {
      console.error(err);
      alert("Failed to download presentation card.");
    } finally {
      setIsDownloadingCard(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#180D45] via-[#1B0F4C] to-[#0A051E] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Ambient glowing orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#84BD3C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Controls ── */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/participant-form"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <span>Live Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#84BD3C]" />
          </Link>

          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60 font-medium">
            ⚡ Presenter Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Ctrl+Shift+Q</kbd>
          </span>
        </div>

        {/* Action Controls for Presenter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadBrandedSlide}
            disabled={isDownloadingCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#84BD3C] hover:bg-[#96D645] text-[#180D45] text-xs font-black transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {isDownloadingCard ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Download Slide PNG</span>
            <span className="sm:hidden">Slide PNG</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#84BD3C]" />
            <span>{isFullscreen ? "Exit Fullscreen" : "Projector Mode"}</span>
          </button>
        </div>
      </header>

      {/* ── Main Presentation Centerpiece ── */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto py-6 sm:py-8 text-center max-w-5xl mx-auto space-y-6 w-full">
        {/* AMFI & Program Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#84BD3C]/40 text-[#84BD3C] text-xs sm:text-sm font-black tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-[#84BD3C]" />
          <span>Wealthy Step™ • AMFI Registered ARN-322891</span>
        </div>

        {/* Big Bold Stage Titles */}
        <div className="space-y-1.5 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Financial Freedom Awareness Program
          </h1>
          <p className="text-xs sm:text-base text-white/80 font-medium">
            Please scan the QR code with your mobile camera to participate and stay connected with our community.
          </p>
        </div>

        {/* ── DUAL QR CODE SHOWCASE (SIDE BY SIDE) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-4xl pt-2">
          
          {/* ── CARD 1: PARTICIPANT DETAILS FORM ── */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#84BD3C] via-lime-400 to-[#84BD3C] rounded-[32px] blur-sm opacity-80 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-white text-[#180D45] p-5 sm:p-6 rounded-[28px] shadow-2xl border-4 border-[#84BD3C] flex flex-col items-center justify-between h-full">
              
              {/* Header Badge */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% SPAM-FREE
                </span>
                <span className="text-[11px] font-bold text-gray-400">1-Min Form</span>
              </div>

              {/* Title */}
              <div className="py-2 text-center">
                <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                  Participant Details Form
                </h2>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Share your details for personalized financial insights
                </p>
              </div>

              {/* QR Image with Center Brand Icon */}
              <div className="relative my-2">
                {formQrDataUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formQrDataUrl}
                      alt="Participant Form QR Code"
                      className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-contain mx-auto"
                    />
                    {/* Centered Brand Mark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 border-3 border-[#84BD3C] flex items-center justify-center shadow-xl">
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
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#180D45]" />
                  </div>
                )}
              </div>

              {/* Footer URL & Action Pills */}
              <div className="w-full pt-2 text-center space-y-2">
                <p className="text-[11px] font-mono font-bold text-gray-500 bg-gray-50 py-1 px-2.5 rounded-lg border border-gray-100 truncate">
                  wealthystep.com/participant-form
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleCopyFormLink}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-[#180D45] hover:text-white text-gray-700 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {isCopiedForm ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopiedForm ? "Copied" : "Copy Link"}</span>
                  </button>
                  <button
                    onClick={handleDownloadFormQr}
                    disabled={isDownloadingForm}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#84BD3C]/20 hover:bg-[#84BD3C] text-[#180D45] text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download QR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 2: OFFICIAL INSTAGRAM COMMUNITY ── */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-[32px] blur-sm opacity-80 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-white text-[#180D45] p-5 sm:p-6 rounded-[28px] shadow-2xl border-4 border-[#E1306C] flex flex-col items-center justify-between h-full">
              
              {/* Header Badge */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border border-pink-200 text-[#E1306C] text-[10px] font-black uppercase tracking-wider">
                  <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
                  INSTAGRAM COMMUNITY
                </span>
                <span className="text-[11px] font-bold text-gray-400">Daily Updates</span>
              </div>

              {/* Title */}
              <div className="py-2 text-center">
                <h2 className="text-base sm:text-lg font-black text-[#180D45] leading-tight">
                  Follow @wealthy.step
                </h2>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Daily mutual fund insights, reels & financial tips
                </p>
              </div>

              {/* QR Image with Center Instagram Icon */}
              <div className="relative my-2">
                {instagramQrDataUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={instagramQrDataUrl}
                      alt="Instagram QR Code"
                      className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-contain mx-auto"
                    />
                    {/* Centered Instagram Mark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] p-2.5 flex items-center justify-center shadow-xl border-3 border-white">
                        <InstagramIcon className="w-full h-full text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#180D45]" />
                  </div>
                )}
              </div>

              {/* Footer URL & Action Pills */}
              <div className="w-full pt-2 text-center space-y-2">
                <p className="text-[11px] font-mono font-bold text-gray-500 bg-gray-50 py-1 px-2.5 rounded-lg border border-gray-100 truncate">
                  instagram.com/wealthy.step
                </p>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white text-[11px] font-bold transition-all shadow-xs hover:opacity-90 cursor-pointer"
                  >
                    <span>Open Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={handleDownloadIgQr}
                    disabled={isDownloadingIg}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#E1306C] text-[11px] font-bold transition-all cursor-pointer border border-pink-200"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download QR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Step Instruction Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-1">
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-2.5 flex items-center gap-2.5 text-left">
            <div className="w-7 h-7 rounded-full bg-[#84BD3C] text-[#180D45] font-black flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-white">Open Phone Camera</p>
              <p className="text-[10px] text-white/60">No scanner app required</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-2.5 flex items-center gap-2.5 text-left">
            <div className="w-7 h-7 rounded-full bg-[#84BD3C] text-[#180D45] font-black flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-white">Point at Either QR</p>
              <p className="text-[10px] text-white/60">Form details or Instagram</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-2.5 flex items-center gap-2.5 text-left">
            <div className="w-7 h-7 rounded-full bg-[#84BD3C] text-[#180D45] font-black flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-white">Submit or Follow</p>
              <p className="text-[10px] text-white/60">Receive valuable insights</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Disclaimers ── */}
      <footer className="relative z-10 text-center text-xs text-white/60 space-y-0.5 border-t border-white/10 pt-3">
        <p className="font-bold text-white/80">
          Wealthy Step™ • AMFI Registered Mutual Fund Distributor • ARN - 322891
        </p>
        <p className="text-[10px] text-white/50">
          Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing.
        </p>
      </footer>
    </div>
  );
}
