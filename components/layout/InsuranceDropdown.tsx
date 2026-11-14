"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  HeartPulse,
  Car,
  Plane,
  Building2,
  FileCheck2,
  ShieldCheck,
  Shield,
  ArrowRight,
} from "lucide-react";

interface InsuranceDropdownProps {
  onItemClick?: () => void;
}

export function InsuranceDropdown({ onItemClick }: InsuranceDropdownProps) {
  return (
    <div
      role="menu"
      aria-label="Insurance menu"
      className="w-[960px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(24,13,69,0.14)] border border-gray-100 p-6 text-left"
    >
      <div className="grid grid-cols-4 gap-5">
        
        {/* ── Category A: Group Insurance ── */}
        <div className="flex flex-col justify-between border-r border-gray-100 pr-4">
          <div>
            <Link
              href="/services/insurance/group-insurance/"
              onClick={onItemClick}
              className="group flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-navy leading-tight group-hover:text-purple-700 transition-colors">
                Group Insurance
              </h3>
            </Link>
            <p className="text-[11px] text-gray-500 leading-snug mb-3">
              Insurance solutions for employee groups and organisations.
            </p>

            <ul className="space-y-1.5 text-[11px] text-navy/80 mb-3 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Group Health Insurance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Group Term Life Insurance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Group Personal Accident</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/services/insurance/group-insurance/"
              onClick={onItemClick}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-navy transition-colors group"
            >
              <span>Explore Group Insurance</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Category B: Retail Insurance ── */}
        <div className="flex flex-col justify-between border-r border-gray-100 pr-4">
          <div>
            <Link
              href="/services/insurance/retail-insurance/"
              onClick={onItemClick}
              className="group flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-navy leading-tight group-hover:text-teal-800 transition-colors">
                Retail Insurance
              </h3>
            </Link>
            <p className="text-[11px] text-gray-500 leading-snug mb-3">
              Insurance solutions for individuals and families.
            </p>

            <ul className="space-y-1.5 text-[11px] text-navy/80 mb-2.5 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Individual Health Cover</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Family Floater Health</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Life Insurance Protection</span>
              </li>
            </ul>

            {/* Specialised Health Highlight Card -> Direct Form Link */}
            <Link
              href="/health-insurance-form"
              onClick={onItemClick}
              className="block p-2 rounded-lg bg-emerald-50/90 border border-emerald-200 hover:bg-emerald-100/80 transition-colors mb-2 group/card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Health Insurance Form</span>
                </div>
                <ArrowRight className="w-2.5 h-2.5 text-emerald-700 group-hover/card:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[9.5px] text-emerald-900/80 leading-tight mt-0.5">
                Personal details intake &amp; 80D tax planning proposal.
              </p>
            </Link>

            {/* Life & Term Insurance Link */}
            <Link
              href="/life-insurance-form"
              onClick={onItemClick}
              className="block p-2 rounded-lg bg-blue-50/90 border border-blue-200 hover:bg-blue-100/80 transition-colors mb-2 group/card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-800">
                  <Shield className="w-3 h-3 text-blue-600" />
                  <span>Life Insurance Form</span>
                </div>
                <ArrowRight className="w-2.5 h-2.5 text-blue-700 group-hover/card:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[9.5px] text-blue-900/80 leading-tight mt-0.5">
                Life &amp; term proposal, 80C certificate &amp; KYC intake.
              </p>
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/services/insurance/retail-insurance/"
              onClick={onItemClick}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-navy transition-colors group"
            >
              <span>Explore Retail Insurance</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Category C: General Insurance ── */}
        <div className="flex flex-col justify-between border-r border-gray-100 pr-4">
          <div>
            <Link
              href="/services/insurance/general-insurance/"
              onClick={onItemClick}
              className="group flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <Car className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-navy leading-tight group-hover:text-amber-700 transition-colors">
                General Insurance
              </h3>
            </Link>
            <p className="text-[11px] text-gray-500 leading-snug mb-3">
              Protection for vehicles, travel and eligible general assets.
            </p>

            <div className="space-y-2 mb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Motor Insurance:
                </span>
                <ul className="text-[11px] text-navy/80 space-y-0.5 pl-2 mt-0.5">
                  <li>• Car Insurance</li>
                  <li>• Two-Wheeler Insurance</li>
                </ul>
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                  Travel Insurance:
                </span>
                <ul className="text-[11px] text-navy/80 space-y-0.5 pl-2 mt-0.5">
                  <li>• Domestic Travel Cover</li>
                  <li>• International Travel Cover</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/services/insurance/general-insurance/"
              onClick={onItemClick}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-navy transition-colors group"
            >
              <span>Explore General Insurance</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Category D: Commercial Insurance ── */}
        <div className="flex flex-col justify-between">
          <div>
            <Link
              href="/services/insurance/commercial-insurance/"
              onClick={onItemClick}
              className="group flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-navy leading-tight group-hover:text-slate-800 transition-colors">
                Commercial Insurance
              </h3>
            </Link>
            <p className="text-[11px] text-gray-500 leading-snug mb-3">
              Insurance and guarantees for businesses, contractors and tenders.
            </p>

            <ul className="space-y-1.5 text-[11px] text-navy/80 mb-3 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                <span>
                  <strong className="font-bold">EMD Guarantee:</strong> Tender &amp; bidding security
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                <span>
                  <strong className="font-bold">Performance Guarantee:</strong> Contract execution
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                <span>
                  <strong className="font-bold">Workers&apos; Comp (WC):</strong> Workplace injury liability
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/services/insurance/commercial-insurance/"
              onClick={onItemClick}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-navy transition-colors group"
            >
              <span>Explore Commercial Insurance</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* Underwriting footnote */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <p className="text-[9px] text-gray-400 leading-normal">
          Insurance products are underwritten by respective IRDAI-registered insurance companies. Acceptance, waiting periods and benefits depend on insurer underwriting.
        </p>
      </div>
    </div>
  );
}
