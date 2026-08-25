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
              <a href="https://x.com/Wealthy_Step" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="X (Twitter)">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@WealthyStep" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="YouTube">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.instagram.com/wealthy.step/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-lime hover:bg-white/5 transition-all group" aria-label="Instagram">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
            
            <div className="pt-4 flex gap-3">
              <a href="https://apps.apple.com/us/app/wealthy-step/id6751190719" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-white/20 hover:border-lime hover:bg-white/5 rounded-md py-2 px-3 transition-all text-[11px] font-semibold w-max">
                <svg viewBox="0 0 384 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.wealthystep.wealthystep&hl=en_IN" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border border-white/20 hover:border-lime hover:bg-white/5 rounded-md py-2 px-3 transition-all text-[11px] font-semibold w-max">
                <svg viewBox="0 0 512 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                Google Play
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
                <Link href="/goal-calculators" className="flex items-center justify-between hover:text-lime transition-colors group">
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
                  Wealthy Step<br/>
                  Pranava Business Part, 7th Floor, Kondapur,<br/>
                  Hyderabad, Telangana 500081
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
                  <a href="tel:+919000929666" className="hover:text-lime transition-colors">+91 9000929666</a>
                </div>
              </div>
            </address>
          </div>
        </div>

        {/* AMFI Registration & Logos */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <div className="bg-white rounded-md px-3 py-2 flex items-center justify-center min-w-[100px] h-[60px]">
            <Image src="/images/amfi-logo.png" alt="AMFI" width={60} height={45} className="object-contain w-auto h-full" />
          </div>
          <div className="text-white text-lg font-semibold tracking-widest text-center">
            ARN - 322891
          </div>
          <div className="bg-white rounded-md px-3 py-2 flex items-center justify-center min-w-[200px] h-[60px]">
            <Image src="/images/mf-sahi-hai.png" alt="Mutual Funds Sahi Hai" width={180} height={45} className="object-contain w-auto h-full" />
          </div>
        </div>

        {/* Bottom Links Bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-white/10 pt-6 pb-4 text-xs md:text-sm text-cream/70 md:flex-row gap-4">
          <p className="whitespace-nowrap text-center">© {new Date().getFullYear()} Wealthy Step. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
            <Link href="/risk-factors" className="py-1 hover:text-white transition-colors">Risk Factors</Link>
            <span className="hidden md:inline py-1">|</span>
            <Link href="/terms-conditions" className="py-1 hover:text-white transition-colors">Terms & Conditions</Link>
            <span className="hidden md:inline py-1">|</span>
            <a href="https://www.sebi.gov.in/filings/mutual-funds.html" target="_blank" rel="noreferrer" className="py-1 hover:text-white transition-colors">SID/SAI/KIM</a>
            <span className="hidden md:inline py-1">|</span>
            <a href="/AMFI_Code-of-Conduct.pdf" target="_blank" rel="noreferrer" className="py-1 hover:text-white transition-colors">Code of Conduct</a>
            <span className="hidden md:inline py-1">|</span>
            <Link href="/investor-grievance" className="py-1 hover:text-white transition-colors">Investor Grievance Redressal</Link>
            <span className="hidden md:inline py-1">|</span>
            <Link href="/important-links" className="py-1 hover:text-white transition-colors">Important links</Link>
            <span className="hidden md:inline py-1">|</span>
            <a href="https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListingAll=yes&search=Mutual+Funds" target="_blank" rel="noreferrer" className="py-1 hover:text-white transition-colors">SEBI Circulars</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
