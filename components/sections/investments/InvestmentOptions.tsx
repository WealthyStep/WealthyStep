"use client";

import React, { useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { CheckCircle2, ArrowRight, Wallet, TrendingUp, Landmark, Layers, PiggyBank, Globe } from "lucide-react";
import Link from "next/link";

const categories = [
  "All Products", 
  "Mutual Funds", 
  "Equity", 
  "Debt", 
  "Hybrid", 
  "Tax Saving", 
  "Alternative", 
  "NRI Solutions"
];

const products = [
  {
    category: "Mutual Funds",
    icon: Wallet,
    title: "Mutual Funds",
    desc: "Professionally managed portfolios diversified across asset classes. Ideal for long-term wealth creation.",
    features: ["Diversified Portfolio", "Expert Fund Management", "SIP & Lump Sum Options", "Flexible & Liquidity"],
    href: "/contact"
  },
  {
    category: "Equity",
    icon: TrendingUp,
    title: "Equity Investments",
    desc: "Invest in stocks with high growth potential and build wealth over the long term.",
    features: ["High Return Potential", "Ownership in Top Companies", "Long Term Wealth Creation", "Market Growth Participation"],
    href: "/contact"
  },
  {
    category: "Debt",
    icon: Landmark,
    title: "Debt Investments",
    desc: "Stable returns with lower risk through government and corporate bonds.",
    features: ["Regular Income", "Low Risk", "Capital Preservation", "Short to Long Term Options"],
    href: "/contact"
  },
  {
    category: "Hybrid",
    icon: Layers,
    title: "Hybrid Funds",
    desc: "A balanced mix of equity and debt to manage risk and optimize returns.",
    features: ["Balanced Approach", "Moderate Risk", "Growth + Stability", "Dynamic Asset Allocation"],
    href: "/contact"
  },
  {
    category: "Tax Saving",
    icon: PiggyBank,
    title: "ELSS (Tax Saving)",
    desc: "Save tax while you invest and grow your wealth with ELSS funds.",
    features: ["Tax Benefit u/s 80C", "Equity Linked Growth", "3 Year Lock-in", "Wealth Creation"],
    href: "/contact"
  },
  {
    category: "NRI Solutions",
    icon: Globe,
    title: "NRI Investments",
    desc: "Specialized investment solutions designed for NRI goals and requirements.",
    features: ["NRI Compliant Solutions", "Repatriation Friendly", "Global Diversification", "Expert Guidance"],
    href: "/contact"
  }
];

export function InvestmentOptions() {
  const [activeTab, setActiveTab] = useState("All Products");

  const filteredProducts = activeTab === "All Products" 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <section className="bg-[#FAFAFA] pt-4 pb-8 md:pt-6 md:pb-10">
      <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy font-heading leading-tight mb-2">
              Explore <span className="text-lime">Investment</span> Options
            </h2>
            <p className="text-text-body text-sm sm:text-base max-w-2xl mx-auto">
              Choose from our wide range of investment solutions tailored to your needs.
            </p>
          </FadeIn>
        </div>

        {/* Tabs */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === cat 
                    ? "bg-navy text-white shadow-sm" 
                    : "bg-white text-text-body border border-gray-200 hover:border-lime hover:text-navy"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
          {filteredProducts.map((product, i) => (
            <FadeIn key={product.title} delay={0.05 * i} direction="up">
              <div className="bg-white rounded-[16px] p-4 lg:p-5 border border-border-sage/20 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative group">
                
                {/* Icon */}
                <div className="mb-3 group-hover:scale-105 transition-transform duration-300 transform origin-left">
                  <div className="relative inline-flex group-hover:animate-bounce">
                    <product.icon className="w-5 h-5 text-lime relative z-10" strokeWidth={1.5} />
                    <div className="absolute top-0 -right-1 w-3 h-3 rounded-full bg-lime/20 z-0" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-navy font-heading mb-1">
                  {product.title}
                </h3>
                
                <p className="text-text-body text-[12px] leading-relaxed mb-3 line-clamp-2">
                  {product.desc}
                </p>

                <div className="mb-3 flex-1">
                  <span className="text-[12px] font-bold text-navy mb-1.5 block">Key Features:</span>
                  <ul className="space-y-1">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-[11px] text-text-body">
                        <CheckCircle2 className="w-3 h-3 text-lime shrink-0 mr-1.5 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <Link
                    href={product.href}
                    className="inline-flex items-center text-[12px] font-bold text-navy group/link hover:text-lime transition-colors"
                  >
                    Explore {product.title}
                    <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>

              </div>
            </FadeIn>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-text-body text-sm">
              More products coming soon in this category.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
