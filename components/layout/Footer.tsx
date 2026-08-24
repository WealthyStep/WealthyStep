import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A0520] py-16 text-cream border-t border-white/10 relative z-10">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col items-start outline-none relative z-50 cursor-pointer">
              <div className="mb-2 bg-white/10 p-2 rounded-sm inline-flex">
                <Image 
                  src="/logo.png" 
                  alt="Wealthy Step Logo" 
                  width={200} 
                  height={50} 
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </div>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed pr-4">
              Empowering your future with smart financial planning, expert investment advice and comprehensive insurance solutions.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="LinkedIn">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="X (Twitter)">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="YouTube">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="Instagram">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="mb-6 font-heading text-lg font-bold text-white">
              Our Services
            </h3>
            <ul className="space-y-4 text-sm text-cream/70">
              <li>
                <Link href="/investments" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Mutual Fund Investments
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Insurance Services
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Personal Financial Planning
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/nri-services" className="flex items-center justify-between hover:text-lime transition-colors group">
                  NRI Financial Services
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="mb-6 font-heading text-lg font-bold text-white">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm text-cream/70">
              <li>
                <Link href="/about" className="flex items-center justify-between hover:text-lime transition-colors group">
                  About Us
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/goal-calculators" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Smart Calculators
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Knowledge Center
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/careers" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Careers
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center justify-between hover:text-lime transition-colors group">
                  Contact Us
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="mb-6 font-heading text-lg font-bold text-white">
              Contact Us
            </h3>
            <address className="space-y-5 text-sm font-normal not-italic text-cream/70">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1.5 leading-relaxed">
                  Wealthy Step Fintech Pvt Ltd<br/>
                  123 Financial District, Suite 400<br/>
                  Mumbai, Maharashtra 400001
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1.5">
                  <a href="mailto:info@wealthystep.com" className="hover:text-lime transition-colors">info@wealthystep.com</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1.5">
                  <a href="tel:+919876543210" className="hover:text-lime transition-colors">+91 98765 43210</a>
                </div>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 text-[13px] text-cream/50 md:flex-row">
          <p>© {new Date().getFullYear()} Wealthy Step. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span className="hidden md:inline">|</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
