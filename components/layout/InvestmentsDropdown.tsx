"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, TrendingUp, Layers, ArrowRight } from "lucide-react";

interface InvestmentsDropdownProps {
  onItemClick?: () => void;
}

export function InvestmentsDropdown({ onItemClick }: InvestmentsDropdownProps) {
  return (
    <div
      role="menu"
      aria-label="Investments menu"
      className="w-[720px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(24,13,69,0.14)] border border-gray-100 p-6 text-left"
    >
      <div className="grid grid-cols-12 gap-6">
        
        {/* ── Column 1: Global Investments (5 Cols) ── */}
        <div className="col-span-5 flex flex-col justify-between border-r border-gray-100 pr-5">
          <div>
            {/* Category Header (Clickable to Global Investments main page) */}
            <Link
              href="/services/investments/global-investments/"
              onClick={onItemClick}
              className="group flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-navy leading-none group-hover:text-sky-600 transition-colors">
                  Global Investments
                </h3>
                <span className="text-[10px] text-gray-500 font-medium">
                  International Markets &amp; GIFT City
                </span>
              </div>
            </Link>

            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              Explore investment opportunities through international financial markets and GIFT City IFSC.
            </p>

            {/* Sub-item: GIFT City */}
            <Link
              href="/services/investments/gift-city/"
              onClick={onItemClick}
              className="group block p-3.5 rounded-xl bg-gradient-to-br from-[#F5F9FD] to-white border border-sky-100/80 hover:border-sky-300 hover:shadow-xs transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-sky-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/services/gift-city-skyline.jpg"
                    alt="GIFT City International Finance Centre Skyline"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy group-hover:text-sky-600 transition-colors">
                      GIFT City
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-gray-600 leading-tight mt-1">
                    Explore opportunities through GIFT City International Financial Services Centre (GIFT IFSC).
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                    Explore GIFT City &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Notice */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[9px] text-gray-400 leading-normal">
              Wealthy Step coordinates distribution via sanctioned IFSC channels. Does not operate directly as an IFSC entity.
            </p>
          </div>
        </div>

        {/* ── Column 2: Indian Investments (7 Cols) ── */}
        <div className="col-span-7 flex flex-col justify-between">
          <div>
            {/* Category Header (Clickable to Indian Investments main page) */}
            <Link
              href="/services/investments/indian-investments/"
              onClick={onItemClick}
              className="group flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-navy leading-none group-hover:text-emerald-700 transition-colors">
                  Indian Investments
                </h3>
                <span className="text-[10px] text-gray-500 font-medium">
                  India&apos;s Financial Markets &amp; Mutual Funds
                </span>
              </div>
            </Link>

            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              Explore mutual fund investment opportunities and strategy-specific funds across India&apos;s markets.
            </p>

            {/* List of 2 Subcategories */}
            <div className="space-y-2.5">
              
              {/* 1. Mutual Funds */}
              <Link
                href="/services/investments/mutual-funds/"
                onClick={onItemClick}
                className="group block p-3 rounded-xl bg-gradient-to-br from-[#FBFDFB] to-white border border-emerald-100/80 hover:border-emerald-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-emerald-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                    <Image
                      src="/images/services/mutual-funds-growth.jpg"
                      alt="Mutual Funds Growth"
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy group-hover:text-emerald-700 transition-colors">
                        Mutual Funds
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-gray-600 leading-tight mt-0.5">
                      Explore mutual fund schemes across diverse asset categories and investment approaches.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["SIP", "Equity Funds", "Debt Funds", "Hybrid Funds"].map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {/* 2. Specialized Investment Funds (SIF) */}
              <Link
                href="/services/investments/sif/"
                onClick={onItemClick}
                className="group block p-3 rounded-xl bg-gradient-to-br from-white to-[#FAF5FF] border border-purple-100/80 hover:border-purple-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-purple-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                    <Image
                      src="/images/services/sif-growth-portfolio.jpg"
                      alt="Specialized Investment Funds (SIF)"
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy group-hover:text-purple-700 transition-colors">
                        Specialized Investment Funds (SIF)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-600 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-gray-600 leading-tight mt-0.5">
                      Distinct investment product category within SEBI&apos;s mutual fund framework.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["Specialized Investment Funds", "Investment Strategies", "Product Information"].map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {/* 3. Mutual Fund Account Creation */}
              <Link
                href="/mutual-funds-form"
                onClick={onItemClick}
                className="group block p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-[#F6F8F2] border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-black text-navy group-hover:text-emerald-700 transition-colors">
                      Mutual Funds Account Opening Form
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    Start Intake &rarr;
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Statutory Mutual Fund Notice */}
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-[9px] text-gray-400 leading-normal">
              Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
