"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-[80px] max-w-[1200px] items-center justify-between px-4 xl:px-0">
        {/* Logo Area */}
        <Link href="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center outline-none relative z-50 cursor-pointer">
          <Image 
            src="/logo.png" 
            alt="Wealthy Step Logo" 
            width={320} 
            height={80} 
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav - Classic Minimalist */}
        <nav className="hidden lg:flex items-center gap-10">
          {[
            { name: "Home", href: "/" },
            { name: "Investments", href: "/investments" },
            { name: "Insurance", href: "/insurance" },
            { name: "Calculators", href: "/goal-calculators" },
            { name: "NRI Services", href: "/nri-services" },
            { name: "Blogs", href: "/blogs" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:text-[#281475]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions - Flat, Solid, Confident Buttons */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="hidden lg:flex h-10 rounded-sm border-gray-300 px-6 text-[13px] font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#281475]"
            asChild
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
          
          <Button 
            className="hidden lg:flex h-10 rounded-sm bg-[#281475] px-8 text-[13px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#180D45]"
            asChild
          >
            <Link href="https://wealthelite.in/client-login" target="_blank" rel="noopener noreferrer">Login</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {[
              { name: "Home", href: "/" },
              { name: "Investments", href: "/investments" },
              { name: "Insurance", href: "/insurance" },
              { name: "Calculators", href: "/goal-calculators" },
              { name: "NRI Services", href: "/nri-services" },
              { name: "Blogs", href: "/blogs" },
              { name: "Contact Us", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[14px] font-semibold uppercase tracking-wider text-gray-700 hover:text-[#281475]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Button 
                className="w-full h-10 rounded-sm bg-[#281475] text-[13px] font-semibold uppercase tracking-wider text-white hover:bg-[#180D45]"
                asChild
              >
                <Link href="https://wealthelite.in/client-login" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
