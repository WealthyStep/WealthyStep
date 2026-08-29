"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown, User, Calendar } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Investments", href: "/investments", hasDropdown: true },
  { name: "Insurance", href: "/insurance", hasDropdown: true },
  { name: "Calculators", href: "/goal-calculators", hasDropdown: true },
  { name: "NRI Services", href: "/nri-services" },
  { name: "About Us", href: "/about" },
];

const mobileLinks = [
  { name: "Home", href: "/" },
  { name: "Investments", href: "/investments" },
  { name: "Insurance", href: "/insurance" },
  { name: "Calculators", href: "/goal-calculators" },
  { name: "NRI Services", href: "/nri-services" },
  { name: "About Us", href: "/about" },
  { name: "Blogs", href: "/blogs" },
  { name: "Knowledge", href: "/knowledge" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        {/* ─── Top Bar ─── */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          {/* Main row: Logo + Actions */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: Logo + AMFI (desktop) */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center outline-none relative z-50 cursor-pointer shrink-0"
              >
                <Image
                  src="/logo.svg"
                  alt="Wealthy Step Logo"
                  width={280}
                  height={80}
                  className="h-12 md:h-14 lg:h-16 w-auto object-contain"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </Link>

              {/* AMFI Registration Info — Desktop/Tablet (md and up) */}
              <div className="hidden md:flex items-center gap-4">
                <div className="w-px h-10 lg:h-12 bg-gray-200" />
                <div className="flex flex-col text-[12px] xl:text-[14px] leading-snug font-medium text-navy/80 whitespace-nowrap">
                  <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
                  <span>AMFI REGISTERED SIF DISTRIBUTOR | ARN - 322891</span>
                  <div className="flex items-center gap-2 text-[12px] xl:text-[14px] font-bold text-navy tracking-wider mt-0.5">
                    <span>MUTUAL FUND</span>
                    <span className="text-lime">|</span>
                    <span>INSURANCE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
              {/* App Store Icon */}
              <a
                href="https://apps.apple.com/us/app/wealthy-step/id6751190719"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-navy/20 text-navy hover:bg-navy/5 transition-colors"
                aria-label="Download on App Store"
              >
                <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
              </a>

              {/* Google Play Icon */}
              <a
                href="https://play.google.com/store/apps/details?id=com.wealthystep.wealthystep&hl=en_IN"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-navy/20 text-navy hover:bg-navy/5 transition-colors"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
              </a>

              {/* Phone Icon (desktop only) */}
              <a
                href="tel:+919000929666"
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-lime/40 text-lime hover:bg-lime/5 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Book a Call Button */}
              <Button
                className="hidden lg:flex h-10 rounded-full bg-navy px-6 text-xs font-bold text-white transition-all hover:bg-lime hover:text-navy whitespace-nowrap gap-2"
                asChild
              >
                <Link
                  href="https://calendly.com/wealthystep-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Call
                </Link>
              </Button>

              {/* Contact Us Button */}
              <Button
                variant="outline"
                className="hidden lg:flex h-10 rounded-full border-navy/20 px-6 text-xs font-semibold text-navy transition-all hover:bg-navy hover:text-white hover:border-navy whitespace-nowrap"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>

              {/* Login Button */}
              <Button
                className="hidden lg:flex h-10 rounded-full bg-lime px-6 text-xs font-bold text-navy transition-all hover:bg-cta-green hover:text-white whitespace-nowrap gap-2"
                asChild
              >
                <Link
                  href="https://wealthelite.in/client-login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              </Button>

              {/* Mobile Hamburger */}
              <button
                type="button"
                className="relative z-[60] flex items-center justify-center w-12 h-12 min-w-[48px] min-h-[48px] rounded-lg text-navy hover:bg-gray-100 active:bg-gray-200 transition-colors lg:hidden cursor-pointer touch-manipulation"
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
      <div className="hidden lg:block border-b border-gray-100">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <nav className="flex items-center justify-center gap-1 xl:gap-2 h-12">
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1 px-4 xl:px-5 h-full text-[13px] font-semibold transition-all relative group whitespace-nowrap ${
                    isActive
                      ? "text-navy"
                      : "text-gray-500 hover:text-navy"
                  }`}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                  {/* Active Underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-lime rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-3/4"
                        : "w-0 group-hover:w-1/2"
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
        <div className="lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 bg-white z-50 overflow-y-auto border-t border-gray-100">
          <div className="container mx-auto px-5 py-4 flex flex-col">
            {mobileLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between py-4 border-b border-gray-50 text-base font-semibold transition-colors min-h-[48px] touch-manipulation ${
                    isActive ? "text-navy" : "text-gray-600 hover:text-navy active:text-navy"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-lime shrink-0" />
                  )}
                </Link>
              );
            })}

            <div className="flex flex-col text-[11px] text-navy/60 font-bold leading-relaxed py-4 border-b border-gray-50">
              <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
              <span>AMFI REGISTERED SIF DISTRIBUTOR | ARN - 322891</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span>MUTUAL FUND</span>
                <span className="text-lime">|</span>
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
                  <Link
                    href="https://wealthelite.in/client-login"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
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
    <div className="md:hidden bg-gray-50/50 border-b border-gray-100 px-4 py-3 flex justify-center">
      <div className="flex flex-col items-center text-[10px] sm:text-[11px] leading-snug font-medium text-navy/80 whitespace-nowrap text-center">
        <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
        <span>AMFI REGISTERED SIF DISTRIBUTOR | ARN - 322891</span>
        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-navy tracking-wider mt-1">
          <span>MUTUAL FUND</span>
          <span className="text-lime">|</span>
          <span>INSURANCE</span>
        </div>
      </div>
    </div>
    </>
  );
}
