"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown, User } from "lucide-react";
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
                  src="/logo.png"
                  alt="Wealthy Step Logo"
                  width={220}
                  height={60}
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                  priority
                />
              </Link>

              {/* AMFI Registration Info — Desktop/Tablet (md and up) */}
              <div className="hidden md:flex items-center gap-4">
                <div className="w-px h-10 lg:h-12 bg-gray-200" />
                <div className="flex flex-col text-[12px] xl:text-[14px] leading-snug font-medium text-navy/80 whitespace-nowrap">
                  <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR ,</span>
                  <span>AMFI REGISTERED SIF DISTRIBUTOR , ARN - 322891</span>
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
              {/* Phone Icon (desktop only) */}
              <a
                href="tel:+919000929666"
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-lime/40 text-lime hover:bg-lime/5 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4" />
              </a>

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

            {/* Mobile AMFI Info */}
            <div className="flex flex-col text-[12px] text-navy/60 font-medium leading-relaxed py-4 border-b border-gray-50">
              <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR</span>
              <span>AMFI REGISTERED SIF DISTRIBUTOR , ARN - 322891</span>
            </div>

            {/* Mobile Actions */}
            <div className="flex gap-3 pt-5 pb-4">
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
        </div>
      )}
    </header>

    {/* AMFI Info — Mobile row (scrolls with page naturally, not sticky) */}
    <div className="md:hidden bg-gray-50/50 border-b border-gray-100 px-4 py-3 flex justify-center">
      <div className="flex flex-col items-center text-[10px] sm:text-[11px] leading-snug font-medium text-navy/80 whitespace-nowrap text-center">
        <span>AMFI REGISTERED MUTUAL FUND DISTRIBUTOR ,</span>
        <span>AMFI REGISTERED SIF DISTRIBUTOR , ARN - 322891</span>
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
