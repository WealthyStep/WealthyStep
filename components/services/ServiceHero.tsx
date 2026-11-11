import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, ShieldCheck, CheckCircle2, LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ServiceHeroProps {
  badge: string;
  badgeIcon?: LucideIcon;
  title: string;
  highlightedTitle?: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  themeColor?: "blue" | "emerald" | "purple" | "amber" | "slate" | "rose" | "teal";
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  visualBadge?: string;
  heroImage?: string;
  heroImageAlt?: string;
  trustPoints?: string[];
}

export function ServiceHero({
  badge,
  badgeIcon: BadgeIcon = ShieldCheck,
  title,
  highlightedTitle,
  description,
  breadcrumbs,
  themeColor = "blue",
  primaryCtaText = "Enquire Now",
  primaryCtaHref = "/contact",
  secondaryCtaText = "Book a Call",
  secondaryCtaHref = "https://calendly.com/wealthystep-info/30min",
  visualBadge,
  heroImage,
  heroImageAlt,
  trustPoints,
}: ServiceHeroProps) {
  const colorMap = {
    blue: {
      badgeBg: "bg-sky-50",
      badgeText: "text-sky-700",
      badgeBorder: "border-sky-200",
      highlightText: "text-[#0284C7]",
      glow: "from-sky-500/10 via-transparent to-transparent",
    },
    teal: {
      badgeBg: "bg-teal-50",
      badgeText: "text-teal-800",
      badgeBorder: "border-teal-200",
      highlightText: "text-teal-600",
      glow: "from-teal-500/10 via-transparent to-transparent",
    },
    emerald: {
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      badgeBorder: "border-emerald-200",
      highlightText: "text-[#84BD3C]",
      glow: "from-emerald-500/10 via-transparent to-transparent",
    },
    purple: {
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-700",
      badgeBorder: "border-purple-200",
      highlightText: "text-purple-600",
      glow: "from-purple-500/10 via-transparent to-transparent",
    },
    amber: {
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200",
      highlightText: "text-amber-600",
      glow: "from-amber-500/10 via-transparent to-transparent",
    },
    slate: {
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-800",
      badgeBorder: "border-slate-300",
      highlightText: "text-slate-700",
      glow: "from-slate-500/10 via-transparent to-transparent",
    },
    rose: {
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-700",
      badgeBorder: "border-rose-200",
      highlightText: "text-rose-600",
      glow: "from-rose-500/10 via-transparent to-transparent",
    },
  };

  const currentTheme = colorMap[themeColor];

  const defaultTrustPoints = [
    "IRDAI / SEBI Aligned Distribution",
    "Transparent Product Comparisons",
    "Dedicated Assistance & Support",
  ];

  return (
    <section className="relative bg-[#F5F9FD] text-[#180D45] overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-10 border-b border-gray-200/80">
      {/* Background Soft Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.glow} pointer-events-none`}
      />

      <div className="container mx-auto max-w-[1240px] px-4 sm:px-6 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-gray-500 mb-5 flex-wrap">
          <Link href="/" className="hover:text-navy transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={`${crumb.href}-${crumb.label}-${idx}`}>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-bold text-navy">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-navy transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Hero 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (7 cols): Content & CTAs */}
          <div className="lg:col-span-7">
            
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.badgeBorder} shadow-2xs mb-3`}
            >
              <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">{badge}</span>
              {visualBadge && (
                <span className="text-[10px] font-semibold opacity-75 hidden sm:inline">
                  • {visualBadge}
                </span>
              )}
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-navy font-heading leading-[1.15] tracking-tight mb-3">
              {title} {highlightedTitle && <span className={currentTheme.highlightText}>{highlightedTitle}</span>}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-text-body font-normal leading-relaxed mb-6 max-w-xl">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={primaryCtaHref}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-navy hover:bg-[#240C7A] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={secondaryCtaHref}
                target={secondaryCtaHref.startsWith("http") ? "_blank" : undefined}
                rel={secondaryCtaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-gray-50 border-2 border-navy text-navy text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{secondaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-navy" />
              </Link>
            </div>

            {/* Micro Trust Bullets */}
            <div className="mt-5 pt-4 border-t border-gray-200/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-600">
              {(trustPoints || defaultTrustPoints).map((point, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column (5 cols): Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            {heroImage ? (
              <div className="relative w-full max-w-[440px] aspect-[16/11] rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-gradient-to-br from-white via-gray-50/60 to-white flex items-center justify-center group">
                <Image
                  src={heroImage}
                  alt={heroImageAlt || title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className={
                    heroImage.endsWith(".png")
                      ? "object-contain p-5 group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
                      : "object-cover group-hover:scale-105 transition-transform duration-700"
                  }
                  priority
                />
                {!heroImage.endsWith(".png") && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180D45]/80 via-[#180D45]/15 to-transparent pointer-events-none" />
                )}
                {visualBadge && (
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        heroImage.endsWith(".png")
                          ? "text-navy bg-white/95 px-3 py-1 rounded-full shadow-xs border border-gray-200"
                          : "text-white"
                      }`}
                    >
                      {visualBadge}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        heroImage.endsWith(".png")
                          ? "text-navy bg-white/80 border border-gray-200"
                          : "bg-white/20 backdrop-blur-xs text-white"
                      }`}
                    >
                      Comprehensive Cover
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-[420px] rounded-3xl bg-white p-6 sm:p-7 border border-gray-200/90 shadow-lg space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${currentTheme.badgeBg} ${currentTheme.badgeText} flex items-center justify-center shrink-0 border ${currentTheme.badgeBorder}`}>
                    <BadgeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block">
                      Protected Solutions
                    </span>
                    <h3 className="text-base font-black text-navy leading-snug">
                      {title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-text-body leading-relaxed border-t border-b border-gray-100 py-3">
                  Structured distribution support aligned with institutional standards, regulatory filings, and verified provider networks.
                </p>

                <div className="space-y-2 text-xs font-bold text-navy">
                  {(trustPoints || defaultTrustPoints).map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

