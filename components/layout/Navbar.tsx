"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown, ChevronRight, User, Calendar, Globe, TrendingUp, Layers, Users, HeartPulse, Car, Building2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isIsolatedRoute } from "@/lib/utils";
import { InvestmentsDropdown } from "@/components/layout/InvestmentsDropdown";
import { InsuranceDropdown } from "@/components/layout/InsuranceDropdown";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Investments", href: "/services/investments/indian-investments/", hasDropdown: true },
  { name: "Insurance", href: "/services/insurance/group-insurance/", hasDropdown: true },
  { name: "Calculators", href: "/goal-calculators" },
  { name: "NRI Services", href: "/nri-services" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"investments" | "insurance" | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<"investments" | "insurance" | null>(null);

  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Secret Admin Access: Logo Triple-Tap & Global Hotkey
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize dropdown and menu states on pathname change (React recommended render-phase adjustment)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
  }

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
      // Secret Admin Hotkey: Ctrl + Shift + A (Windows/Linux) or Cmd + Shift + A (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin/login");
      }
      // Presentation Stage Hotkey: Ctrl + Shift + Q (Windows/Linux) or Cmd + Shift + Q (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        router.push("/presentation");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    };
  }, [router]);

  const handleMouseEnter = (menuKey: "investments" | "insurance") => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);

    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);

    if (nextCount >= 3) {
      e.preventDefault();
      setLogoClickCount(0);
      router.push("/admin/login");
      return;
    }

    logoTimerRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 1200);

    window.scrollTo(0, 0);
  };

  // Suppress standard website navbar on seminar forms, slides, and admin dashboards
  if (isIsolatedRoute(pathname)) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm" ref={navContainerRef}>
        {/* ─── Top Bar ─── */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto max-w-[1400px] px-4 xl:px-0">
            {/* Main row: Logo + Actions */}
            <div className="flex items-center justify-between h-16 md:h-20 py-1 md:py-2">
              {/* Left: Logo + AMFI (desktop) */}
              <div className="flex items-center gap-3 xl:gap-5">
                <Link
                  href="/"
                  onClick={handleLogoClick}
                  className="flex items-center outline-none relative z-50 cursor-pointer shrink-0"
                >
                  <Image
                    src="/logo.svg"
                    alt="Wealthy Step - AMFI Registered Mutual Fund Distributor Logo"
                    width={320}
                    height={95}
                    className="h-11 sm:h-12 md:h-14 lg:h-[56px] xl:h-[60px] w-auto object-contain select-none"
                    priority
                    loading="eager"
                    fetchPriority="high"
                  />
                </Link>

                {/* AMFI Registration Info — Desktop/Tablet (md and up) */}
                <div className="hidden md:flex items-center gap-3 xl:gap-4 pl-1">
                  <div className="w-[1.5px] h-11 md:h-12 bg-gray-200" />
                  <div className="flex flex-col text-[12px] leading-[1.3] font-semibold text-navy/85 whitespace-nowrap">
                    <span className="tracking-tight text-navy/80">AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
                    <span className="tracking-tight text-navy/80">
                      AMFI REGISTERED SIF DISTRIBUTOR <span className="text-gray-300 mx-1 font-light">|</span> ARN - 322891
                    </span>
                    <div className="flex items-center gap-2 text-[12px] font-black text-navy tracking-wider mt-0.5">
                      <span>MUTUAL FUND</span>
                      <span className="text-[#48a43f] font-black">|</span>
                      <span>INSURANCE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
                {/* App Store Icon */}
                <a
                  href="https://apps.apple.com/us/app/wealthy-step/id6751190719"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm text-navy hover:border-navy hover:shadow-md transition-all"
                  aria-label="Download on App Store"
                >
                  <svg viewBox="0 0 384 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                </a>

                {/* Google Play Icon */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.wealthystep.wealthystep&hl=en_IN"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm text-navy hover:border-navy hover:shadow-md transition-all"
                  aria-label="Get it on Google Play"
                >
                  <svg viewBox="0 0 512 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                </a>

                {/* Phone Icon (desktop only) */}
                <a
                  href="tel:+919000929666"
                  className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-white border border-lime shadow-sm text-lime hover:bg-lime hover:text-navy hover:shadow-md transition-all"
                  aria-label="Call us"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                {/* Book a Call Button */}
                <Button
                  className="hidden lg:flex h-9 rounded-full bg-navy px-5 text-xs font-bold text-white transition-all hover:bg-lime hover:text-navy whitespace-nowrap gap-2"
                  asChild
                >
                  <Link
                    href="https://calendly.com/wealthystep-info/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book a Call
                  </Link>
                </Button>

                {/* Login Button */}
                <Button
                  className="hidden lg:flex h-9 rounded-full bg-lime px-5 text-xs font-bold text-navy transition-all hover:bg-cta-green hover:text-white whitespace-nowrap gap-2"
                  asChild
                >
                  <Link
                    href="https://wealthelite.in/client-login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <User className="w-3.5 h-3.5" />
                    Login
                  </Link>
                </Button>

                {/* Mobile Hamburger */}
                <button
                  type="button"
                  className="relative z-[60] flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg text-navy hover:bg-gray-100 active:bg-gray-200 transition-colors lg:hidden cursor-pointer touch-manipulation"
                  aria-label="Toggle menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Navigation Bar (desktop only) ─── */}
        <div className="hidden lg:block border-b border-gray-100 relative">
          <div className="container mx-auto max-w-[1400px] px-4 xl:px-0">
            <nav className="flex items-center justify-center gap-1 xl:gap-2 h-10">
              {navLinks.map((item) => {
                const isActive =
                  (item.name === "Investments" && (pathname.startsWith("/services/investments") || pathname === "/investments" || pathname === "/investments/")) ||
                  (item.name === "Insurance" && (pathname.startsWith("/services/insurance") || pathname === "/insurance" || pathname === "/insurance/")) ||
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                // Dropdown 1: Investments
                if (item.name === "Investments") {
                  const isMenuOpen = activeDropdown === "investments";
                  return (
                    <div
                      key={item.name}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => handleMouseEnter("investments")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(isMenuOpen ? null : "investments")}
                        className={`flex items-center gap-1 px-4 xl:px-5 h-full text-[13px] font-semibold transition-all relative group whitespace-nowrap cursor-pointer ${
                          isActive || isMenuOpen
                            ? "text-navy font-bold"
                            : "text-gray-500 hover:text-navy"
                        }`}
                        aria-expanded={isMenuOpen}
                        aria-haspopup="menu"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                            isMenuOpen ? "rotate-180 opacity-100 text-navy" : "group-hover:opacity-100"
                          }`}
                        />
                        {/* Active Underline */}
                        <span
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-lime rounded-full transition-all duration-300 ${
                            isActive ? "w-3/4" : "w-0 group-hover:w-1/2"
                          }`}
                        />
                      </button>

                      {/* Dropdown Container with hover intent bridge */}
                      {isMenuOpen && (
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-['']"
                          onMouseEnter={() => handleMouseEnter("investments")}
                          onMouseLeave={handleMouseLeave}
                        >
                          <InvestmentsDropdown onItemClick={() => setActiveDropdown(null)} />
                        </div>
                      )}
                    </div>
                  );
                }

                // Dropdown 2: Insurance
                if (item.name === "Insurance") {
                  const isMenuOpen = activeDropdown === "insurance";
                  return (
                    <div
                      key={item.name}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => handleMouseEnter("insurance")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(isMenuOpen ? null : "insurance")}
                        className={`flex items-center gap-1 px-4 xl:px-5 h-full text-[13px] font-semibold transition-all relative group whitespace-nowrap cursor-pointer ${
                          isActive || isMenuOpen
                            ? "text-navy font-bold"
                            : "text-gray-500 hover:text-navy"
                        }`}
                        aria-expanded={isMenuOpen}
                        aria-haspopup="menu"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                            isMenuOpen ? "rotate-180 opacity-100 text-navy" : "group-hover:opacity-100"
                          }`}
                        />
                        {/* Active Underline */}
                        <span
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-lime rounded-full transition-all duration-300 ${
                            isActive ? "w-3/4" : "w-0 group-hover:w-1/2"
                          }`}
                        />
                      </button>

                      {/* Dropdown Container with hover intent bridge */}
                      {isMenuOpen && (
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 before:absolute before:inset-x-0 before:-top-2 before:h-2 before:content-['']"
                          onMouseEnter={() => handleMouseEnter("insurance")}
                          onMouseLeave={handleMouseLeave}
                        >
                          <InsuranceDropdown onItemClick={() => setActiveDropdown(null)} />
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard link
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1 px-4 xl:px-5 h-full text-[13px] font-semibold transition-all relative group whitespace-nowrap ${
                      isActive
                        ? "text-navy font-bold"
                        : "text-gray-500 hover:text-navy"
                    }`}
                  >
                    <span>{item.name}</span>
                    {/* Active Underline */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-lime rounded-full transition-all duration-300 ${
                        isActive ? "w-3/4" : "w-0 group-hover:w-1/2"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 md:top-16 bottom-0 bg-white z-50 overflow-y-auto border-t border-gray-100">
            <div className="container mx-auto px-5 py-4 flex flex-col">
              
              {/* Home */}
              <Link
                href="/"
                className="flex items-center justify-between py-3.5 border-b border-gray-100 text-base font-semibold text-navy min-h-[48px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Home</span>
              </Link>

              {/* ── Mobile Accordion: Investments ── */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setMobileExpanded(mobileExpanded === "investments" ? null : "investments")}
                  className="w-full flex items-center justify-between py-3.5 text-base font-semibold text-navy min-h-[48px] touch-manipulation cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>Investments</span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      Global &amp; India
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      mobileExpanded === "investments" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileExpanded === "investments" && (
                  <div className="pl-2 pb-3.5 space-y-2">
                    <div className="pt-1 pb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block px-2 mb-1">
                        Global Investments
                      </span>
                      <div className="space-y-1.5">
                        <Link
                          href="/services/investments/global-investments/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/50 hover:bg-sky-50 text-xs font-bold text-navy min-h-[44px]"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-sky-600" />
                            <span>Global Investments Overview</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                        </Link>
                        <Link
                          href="/services/investments/gift-city/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/50 hover:bg-sky-50 text-xs font-bold text-navy min-h-[44px]"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-sky-600" />
                            <span>GIFT City (IFSC)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                        </Link>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block px-2 mb-1">
                        Indian Investments
                      </span>
                      <div className="space-y-1.5">
                        <Link
                          href="/services/investments/indian-investments/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-navy min-h-[44px]"
                        >
                          <span className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Indian Investments Overview</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                        </Link>
                        <Link
                          href="/services/investments/mutual-funds/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-navy min-h-[44px]"
                        >
                          <span className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mutual Funds (SIP &amp; Schemes)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                        </Link>
                        <Link
                          href="/services/investments/sif/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 hover:bg-purple-50 text-xs font-bold text-navy min-h-[44px]"
                        >
                          <span className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-purple-600" />
                            <span>Specialized Investment Funds (SIF)</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Mobile Accordion: Insurance ── */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setMobileExpanded(mobileExpanded === "insurance" ? null : "insurance")}
                  className="w-full flex items-center justify-between py-3.5 text-base font-semibold text-navy min-h-[48px] touch-manipulation cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>Insurance</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      4 Categories
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      mobileExpanded === "insurance" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileExpanded === "insurance" && (
                  <div className="pl-2 pb-3.5 space-y-1.5 pt-1">
                    <Link
                      href="/services/insurance/group-insurance/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 hover:bg-purple-50 text-xs font-bold text-navy min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>Group Insurance (Corporate Teams)</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                    </Link>

                    <Link
                      href="/services/insurance/retail-insurance/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/50 hover:bg-teal-50 text-xs font-bold text-navy min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                        <span>Retail Insurance (Health &amp; Life)</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                    </Link>

                    <Link
                      href="/services/insurance/retail-insurance/#specialised-health"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-navy min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Specialised Health Cover</span>
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Unconditional
                      </span>
                    </Link>

                    <Link
                      href="/services/insurance/general-insurance/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 text-xs font-bold text-navy min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-amber-600" />
                        <span>General Insurance (Motor &amp; Travel)</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </Link>

                    <Link
                      href="/services/insurance/commercial-insurance/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/60 hover:bg-slate-100 text-xs font-bold text-navy min-h-[44px]"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-700" />
                        <span>Commercial Insurance (EMD, PG, WC)</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Remaining Mobile Links */}
              {[
                { name: "Calculators", href: "/goal-calculators" },
                { name: "NRI Services", href: "/nri-services" },
                { name: "About Us", href: "/about" },
                { name: "Blogs", href: "/blogs" },
                { name: "Knowledge", href: "/knowledge" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between py-3.5 border-b border-gray-100 text-base font-semibold text-navy min-h-[48px]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}

              <div className="flex flex-col text-[12px] text-navy/85 font-semibold leading-[1.3] py-3.5 border-b border-gray-100">
                <span className="text-navy/80">AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
                <span className="text-navy/80">
                  AMFI REGISTERED SIF DISTRIBUTOR <span className="text-gray-300 mx-1 font-light">|</span> ARN - 322891
                </span>
                <div className="flex items-center gap-2 text-[12px] font-black text-navy tracking-wider mt-0.5">
                  <span>MUTUAL FUND</span>
                  <span className="text-[#48a43f] font-black">|</span>
                  <span>INSURANCE</span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 pt-5 pb-2">
                {/* Book a Call */}
                <Button
                  className="w-full min-h-[52px] rounded-full bg-navy text-sm font-bold text-white hover:bg-lime hover:text-navy active:bg-lime active:text-navy gap-2 touch-manipulation shadow-md"
                  asChild
                >
                  <Link
                    href="https://calendly.com/wealthystep-info/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4" />
                    Book a Call
                  </Link>
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 min-h-[52px] rounded-full border-navy/20 text-sm font-semibold text-navy hover:bg-navy hover:text-white active:bg-navy active:text-white touch-manipulation"
                    asChild
                  >
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </Button>
                  <Button
                    className="flex-1 min-h-[52px] rounded-full bg-lime text-sm font-bold text-navy hover:bg-cta-green hover:text-white active:bg-cta-green active:text-white gap-2 touch-manipulation"
                    asChild
                  >
                    <a
                      href="https://wealthelite.in/client-login"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Login
                    </a>
                  </Button>
                </div>
              </div>

              {/* Mobile App Download Actions */}
              <div className="flex gap-3 pb-4">
                <Button
                  variant="outline"
                  className="flex-1 min-h-[52px] rounded-full border-navy/20 text-sm font-semibold text-navy hover:bg-navy/5 active:bg-navy/5 touch-manipulation gap-2"
                  asChild
                >
                  <a
                    href="https://apps.apple.com/us/app/wealthy-step/id6751190719"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                    App Store
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-h-[52px] rounded-full border-navy/20 text-sm font-semibold text-navy hover:bg-navy/5 active:bg-navy/5 touch-manipulation gap-2"
                  asChild
                >
                  <a
                    href="https://play.google.com/store/apps/details?id=com.wealthystep.wealthystep&hl=en_IN"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                    Google Play
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* AMFI Info — Mobile row (scrolls with page naturally, not sticky) */}
      <div className="md:hidden bg-gray-50/70 border-b border-gray-100 px-4 py-2 flex justify-center">
        <div className="flex flex-col items-center text-[12px] leading-[1.3] font-semibold text-navy/85 whitespace-nowrap text-center">
          <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
          <span>
            AMFI REGISTERED SIF DISTRIBUTOR <span className="text-gray-300 mx-1 font-light">|</span> ARN - 322891
          </span>
          <div className="flex items-center justify-center gap-2 text-[12px] font-black text-navy tracking-wider mt-0.5">
            <span>MUTUAL FUND</span>
            <span className="text-[#48a43f] font-black">|</span>
            <span>INSURANCE</span>
          </div>
        </div>
      </div>
    </>
  );
}
