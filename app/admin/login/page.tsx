"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { ShieldCheck, Lock, Mail, ArrowRight, RefreshCw, AlertCircle, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    async function checkAuth() {
      const isExpiredParam = typeof window !== "undefined" && window.location.search.includes("expired=1");

      if (isExpiredParam) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ws_admin_session");
          document.cookie = "sb-access-token=; path=/; max-age=0";
        }
        setErrorMessage("Your session has expired. Please sign in again with your admin credentials.");
        return;
      }

      // Check if user already has an active valid session in localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("ws_admin_session");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const isExpired = parsed?.expires_at ? parsed.expires_at * 1000 <= Date.now() : false;
            if (parsed?.access_token && !isExpired) {
              window.location.href = "/admin/dashboard/";
              return;
            }
          } catch {}
        }
      }

      // Check active session via cookie on /api/admin/me/
      try {
        const res = await fetch("/api/admin/me/", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.authenticated) {
            window.location.href = "/admin/dashboard/";
          }
        }
      } catch {}
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both your authorized email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid login credentials. Please verify your email and password.");
        return;
      }

      // Store session for client components and dashboard
      if (typeof window !== "undefined") {
        const sessionPayload = data.session || {
          access_token: data.token,
          user: data.user,
          expires_at: Math.floor(Date.now() / 1000) + 604800,
        };
        localStorage.setItem("ws_admin_session", JSON.stringify(sessionPayload));
        if (data.token) {
          document.cookie = `sb-access-token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          try {
            await supabaseBrowser.auth.setSession({
              access_token: data.token,
              refresh_token: data.session?.refresh_token || "",
            });
          } catch {}
        }
      }

      // Navigate directly to dashboard
      window.location.href = "/admin/dashboard/";
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setErrorMessage(err.message || "An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F8FE] via-[#FFFFFF] to-[#F1F6ED] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans selection:bg-[#84BD3C]/30 text-gray-800 relative overflow-hidden">
      {/* Ambient Lighting Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#84BD3C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#180D45]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-5 relative z-10">
        {/* WealthyStep Logo & Header */}
        <div className="text-center space-y-2.5">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo.svg"
              alt="Wealthy Step - Legacy Through Mindful Steps"
              width={240}
              height={70}
              className="h-10 sm:h-11 w-auto object-contain mx-auto"
              priority
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#84BD3C]/50 text-[#180D45] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#84BD3C]" />
            <span>Authorized Admin Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#180D45] tracking-tight">
            Admin <span className="text-[#84BD3C]">Vault Console</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
            Secure administrative access for client policy management and document repository.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl shadow-[#180D45]/5 p-6 sm:p-7">
          <div className="flex items-center gap-3 pb-3.5 mb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-2xl bg-[#180D45]/5 flex items-center justify-center text-[#180D45] shadow-2xs">
              <KeyRound className="w-4.5 h-4.5 text-[#84BD3C]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#180D45]">Sign in with Credentials</h2>
              <p className="text-[11px] text-gray-500">Enter your administrator email and password.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs font-medium animate-fade-in shadow-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@wealthystep.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFBFD] border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#180D45] focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-[#FAFBFD] border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#180D45] focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#180D45] transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-1.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#180D45] hover:bg-[#25156B] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#84BD3C]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Vault Console</span>
                    <ArrowRight className="w-4 h-4 text-[#84BD3C]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Regulatory Footer */}
        <div className="text-center text-[11px] text-gray-500 space-y-0.5">
          <p className="font-semibold text-gray-700">Wealthy Step • AMFI Registered Mutual Fund Distributor • ARN-322891</p>
          <p className="text-gray-400">
            Restricted access portal. All login sessions and IP addresses are audited.
          </p>
        </div>
      </div>
    </div>
  );
}
