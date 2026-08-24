# Product Requirements Document (PRD)
## Wealthy Step — Website Rebuild (Next.js + TypeScript + Tailwind)

**Version:** 1.1
**Date:** August 24, 2026
**Prepared for:** Wealthy Step Fintech Private Limited
**Brand name:** Wealthy Step
**Tagline:** "Legacy Through Mindful Steps"
**Source of truth for visuals:** Existing live site screenshots (Home, Investments, Insurance, NRI Services, Goal Calculators, Contact Us) + extracted design-system reference + official logo file

---

## 1. Project Summary

Rebuild the existing Wealthy Step marketing + tools website as a modern, high-performance, premium-feeling web application. The new build must **visually match the current brand** (colors, layout rhythm, component shapes, imagery style) while dramatically upgrading the underlying engineering: framework, performance, accessibility, animation quality, and maintainability.

This is a **redesign-in-place**, not a rebrand — same navy/lime/green palette, same section structure, same core pages and calculators, but rebuilt on a modern stack with production-grade performance and polish.

---

## 2. Goals & Success Criteria

| Goal | Target |
|---|---|
| Perceived load speed | First Contentful Paint < 1.0s, Largest Contentful Paint < 1.8s on 4G |
| Core Web Vitals | LCP < 2.5s, INP < 200ms, CLS < 0.1 (all "Good" per Google) |
| Lighthouse scores | Performance ≥ 95, Accessibility ≥ 95, Best Practices 100, SEO 100 |
| Time to Interactive | < 2.5s on mid-tier mobile |
| Bundle size | Initial JS payload < 150KB gzipped per route |
| Responsiveness | Flawless at 360px, 768px, 1024px, 1440px, 1920px |
| SEO | Fully server-rendered/static, indexable, structured data on key pages |
| Visual fidelity | Pixel-close match to existing design system (see Section 5) |

> Note: "Load in milliseconds" is reframed here as **perceived speed** — instant-feeling navigation via prefetching, static generation, and skeleton/optimistic UI — since true multi-millisecond full-page loads aren't achievable over a real network. The above are the real, measurable equivalents.

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (latest stable) — App Router** | SSG/ISR, image optimization, routing, SEO, scalable to future CMS/dashboard |
| Language | **TypeScript** | Type safety, maintainability, fewer runtime bugs |
| Styling | **Tailwind CSS** | Fast, consistent, responsive-first, easy to theme |
| UI primitives | **shadcn/ui** (customized, not default look) | Accessible forms, dialogs, tabs, sheets, dropdowns — themed to brand |
| Icons | **Lucide React** | Consistent line-icon set, tree-shakeable |
| Premium/animated icons | **Custom SVG + Lottie** (sparingly, high-value sections only) | Distinct premium feel without bloating bundle |
| Motion | **motion** (Framer Motion successor) | Scroll reveals, hover states, page transitions |
| Forms | **react-hook-form + zod + @hookform/resolvers** | Performant, type-safe validation (Contact form, Goal Calculators) |
| State | **Jotai** | Lightweight atomic state for calculator inputs, tabs, theme |
| Charts | **Recharts** (primary) + **Chart.js/react-chartjs-2** (fallback for specific chart types) | Investment vs. Growth bars, ticker sparklines, calculator visualizations |
| Deployment | Vercel (recommended) or any Node-compatible host | Native Next.js support, edge caching, ISR |

### Install command (as specified)
```bash
npm install motion lucide-react react-hook-form zod @hookform/resolvers jotai recharts chart.js react-chartjs-2
```

### Additional required packages
```bash
npx create-next-app@latest wealthwagon --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
npx shadcn@latest init
npm install clsx tailwind-merge class-variance-authority
npm install lottie-react
npm install next-seo
npm install @next/bundle-analyzer -D
```

---

## 4. Information Architecture / Sitemap

Based on the existing nav and screenshots provided:

```
/                          Home
/insurance                 Insurance Solutions (Life + Health)
/investments                Investment Solutions (6 product cards)
/nri-services               NRI Services
/goal-calculators            Goal Calculators hub (tabbed: SIP, Retirement, Education, EMI, Step-Up SIP, SWP)
/knowledge                  Knowledge Center (dropdown in nav — blog/insights index)
/knowledge/[slug]           Individual article
/careers                    Careers
/about                       About Us
/contact                     Get In Touch (form + info)
/privacy-policy
/terms-conditions
```

Goal Calculators should be a **single dynamic route** with client-side tab switching (`?type=sip`) rather than 6 separate pages, to preserve state and avoid full reloads — matching the current tabbed UI in the screenshot.

---

## 5. Design System (extracted from existing site — source of truth)

### 5.1 Color Tokens

```ts
// tokens/colors.ts
export const colors = {
  navy: '#180D45',        // primary dark bg
  navyCard: '#1B0F4D',    // card / button on white
  navyAlt: '#281475',     // hover state
  accentPurple: '#240C7A',// headline accent word
  lime: '#84BD3C',        // eyebrow labels, accents
  ctaGreen: '#83C120',    // primary CTA buttons
  white: '#FFFFFF',
  cream: '#FFFDF9',
  textDark: '#141414',
  textBody: '#4A4A4A',
  borderSage: '#C7D9A8',
  black: '#000000',
  positive: '#4CAF50',
  negative: '#E53935',
  // Site also uses a warm yellow/gold for primary CTAs (visible in screenshots:
  // "Contact Us", "Send Message", "Know More" pill) — verify exact hex via
  // devtools; approx #F5B921 / #FFC233. Treat as a THIRD accent alongside lime/CTA green.
} as const;
```

> ⚠️ **Design QA flag:** The screenshots show a **gold/amber** CTA color (nav "Contact Us" button, hero "Know More", footer buttons, "Send Message") that is distinct from the lime/CTA-green in the original extracted reference doc. Before dev starts, pull the real hex values from the live site's computed styles (DevTools → Inspect → Computed) for: gold CTA, navy backgrounds, and body text — the values above are close approximations from screenshots and should not be treated as final.

### 5.1.1 Logo Asset

Official logo confirmed: angular two-tone **lime-green "W" mark** (two overlapping check/arrow strokes) + **"Wealthy Step"** wordmark in navy, with the tagline **"LEGACY THROUGH MINDFUL STEPS"** set in small, letter-spaced caps beneath — the "MINDFUL" portion rendered in the lime-green brand color, the rest in navy/gray. This logo should be:
- Exported as SVG for the navbar (crisp at all sizes, no raster blur).
- Recolored to an all-white/all-light variant for use on navy backgrounds (footer, dark hero sections) — do not place the navy-wordmark version directly on navy.
- Used as the base reference for the lime-green token (`colors.lime`) — sample the exact hex from the supplied logo file rather than from a compressed screenshot.

### 5.2 Typography

| Style | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| H1 Hero | Poppins | 700 | 44–48px | 30–34px |
| H2 Section | Poppins | 700 | 30–32px | 24–26px |
| Eyebrow label | Poppins | 600, uppercase, tracked | 13px | 12px |
| H3 Card title | Poppins | 600 | 19px | 17px |
| Body | Inter | 400 | 16px | 15px |
| Button | Poppins | 600 | 15px | 14px |
| Meta/small | Inter | 400–500 | 13px | 12px |

Fonts loaded via `next/font/google` (Poppins + Inter) — zero layout shift, self-hosted automatically.

### 5.3 Spacing, Radius, Shadow

```ts
export const radius = { card: '16px', pill: '9999px', input: '10px' };
export const spacing = { sectionY: { desktop: '96px', mobile: '56px' }, container: '1200px' };
export const shadow = { card: '0 8px 24px rgba(24,13,69,0.08)', cardHover: '0 12px 32px rgba(24,13,69,0.14)' };
export const motionTiming = { fast: '150ms', base: '250ms', slow: '400ms', ease: 'cubic-bezier(0.4,0,0.2,1)' };
```

### 5.4 Section Rhythm

Alternating **white → navy → white → navy** bands, exactly as in the screenshots (Hero navy → Stats white → Services white → Goals light-gray → CTA navy → Footer navy). This alternation is a core brand pattern and must be preserved page to page.

---

## 6. Component Inventory (build once, reuse everywhere)

| Component | Notes |
|---|---|
| `<Navbar />` | Sticky, white, logo (lime-green angular "W" mark + "Wealthy Step" wordmark, "Legacy Through Mindful Steps" tagline in small caps beneath) + centered pill nav + gold "Contact Us" CTA; collapses to hamburger/sheet (shadcn `Sheet`) under 1024px |
| `<Footer />` | 4-column navy footer, ARN badge, social icons, reused on every page |
| `<Hero />` | Variant A (Home — split with stat card) / Variant B (inner pages — centered, icon + title + subtitle + CTA) |
| `<StatCard />` | White floating card, icon badge, big number, label — used in hero and stats strip |
| `<ServiceCard />` | White card, icon badge (image-overlap style on Home, simple icon on inner pages), title, description, "Learn More →" link |
| `<GoalCard />` | Icon (colored square), title, description, pill "Build My Goal" button |
| `<ToolCard />` | Dark navy/indigo variant for "Smart Tools" style 3×2 grids |
| `<Tabs />` | shadcn Tabs, restyled — active = navy bg + white text; used in Goal Calculators and NRI Taxation |
| `<CalculatorPanel />` | Generic two-column (inputs left / results right) shell — reused for SIP, Retirement, Education, EMI, Step-Up SIP, SWP, Return-to-India |
| `<Slider />` | Custom-themed range slider (navy track/thumb) for calculator inputs |
| `<ResultBar />` | Horizontal split bar (Invested vs Returns) using Recharts or pure CSS |
| `<CTASection />` | Full-width navy band with heading, subtext, gold + outline button pair, trust bullets |
| `<ContactForm />` | react-hook-form + zod validated Name/Email/Phone/Message |
| `<InfoCard />` | Icon + heading + body — used in Contact "Office Address / Phone / Email" and NRI service cards |
| `<TickerBar />` | Black strip, scrolling marquee of index values (green/red) — top of Home |
| `<Badge />` | Pill badges ("Trusted by 1000+ Clients", eyebrow labels) |

All components built as **server components by default**; only interactive pieces (`Tabs`, `Slider`, `ContactForm`, `TickerBar`, calculators) marked `"use client"`.

---

## 7. Performance & Loading Strategy

1. **Rendering:** Static Generation (SSG) for all marketing pages; ISR (revalidate: 3600) for Knowledge Center articles if backed by a CMS later.
2. **Images:** All imagery through `next/image` — AVIF/WebP, responsive `sizes`, `priority` only on the single LCP hero image, everything else lazy-loaded natively.
3. **Code splitting:** Calculators, charts, and Lottie animations loaded via `next/dynamic` with `ssr: false` and a lightweight skeleton — they're below-the-fold or interaction-triggered on most pages.
4. **Fonts:** `next/font` self-hosted, `display: swap`, subset to Latin.
5. **Icons:** Lucide imported per-icon (tree-shaken), never the full barrel import.
6. **Lottie budget:** Max 2–3 Lottie animations site-wide (e.g., hero micro-animation, calculator success state), each < 50KB, lazy-loaded on scroll-into-view.
7. **Third-party scripts:** None blocking render; analytics deferred via `next/script strategy="lazyOnload"`.
8. **Caching:** Static assets on CDN with long-lived `Cache-Control`; HTML revalidated via ISR.
9. **Bundle monitoring:** `@next/bundle-analyzer` run in CI; fail build if a route's first-load JS exceeds budget.
10. **Prefetching:** Next.js `<Link>` auto-prefetch keeps in-app nav feeling instant after first load.

---

## 8. Animation Strategy

- **Micro-interactions** (button hover/press, card lift, tab switch): `motion`, 150–250ms, ease-out — subtle, never gratuitous.
- **Scroll reveals:** Sections fade/slide in once, `viewport={{ once: true }}` to avoid re-triggering and jank.
- **Calculator results:** Numbers animate via `motion`'s number-transition or a small custom hook — not raw Lottie, to keep it lightweight and instant-feeling.
- **Lottie:** Reserved for 2–3 genuinely high-value moments (e.g., hero illustration, a "goal achieved" state) — never used for basic UI icons.
- **Reduced motion:** All animations respect `prefers-reduced-motion`.

---

## 9. Accessibility & SEO

- Semantic HTML landmarks (`<nav>`, `<main>`, `<footer>`), skip-to-content link.
- All interactive components via shadcn/Radix primitives → keyboard nav, focus states, ARIA out of the box.
- Color contrast checked against navy/white/gold combos (WCAG AA minimum).
- Per-page metadata via Next.js `generateMetadata`, Open Graph + Twitter cards, canonical URLs.
- JSON-LD structured data: `Organization`, `FinancialService`, `BreadcrumbList` on service pages, `FAQPage` where applicable.
- `sitemap.xml` and `robots.txt` auto-generated via Next.js file conventions.

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Key behavior |
|---|---|---|
| `sm` | 360–639px | Single column, hamburger nav, stacked calculator (inputs then results) |
| `md` | 640–1023px | 2-column card grids, nav still collapsed |
| `lg` | 1024–1279px | Full nav, 3-column grids, 2-column calculator |
| `xl` | 1280–1535px | Design reference target width (~1200px container) |
| `2xl` | 1536px+ | Container stays capped at 1200px, extra breathing room on sides |

---

## 11. Folder Structure (App Router)

```
src/
 ├─ app/
 │   ├─ layout.tsx
 │   ├─ page.tsx                    # Home
 │   ├─ insurance/page.tsx
 │   ├─ investments/page.tsx
 │   ├─ nri-services/page.tsx
 │   ├─ goal-calculators/page.tsx
 │   ├─ knowledge/[slug]/page.tsx
 │   ├─ contact/page.tsx
 │   ├─ about/page.tsx
 │   ├─ careers/page.tsx
 │   ├─ sitemap.ts
 │   └─ robots.ts
 ├─ components/
 │   ├─ ui/                         # shadcn primitives, themed
 │   ├─ layout/                     # Navbar, Footer
 │   ├─ sections/                   # Hero, CTASection, TickerBar...
 │   ├─ cards/                      # ServiceCard, GoalCard, ToolCard, StatCard
 │   └─ calculators/                # SIP, Retirement, Education, EMI, StepUpSIP, SWP
 ├─ lib/
 │   ├─ finance-math.ts             # SIP/EMI/retirement formulas
 │   └─ utils.ts
 ├─ tokens/                         # colors.ts, typography.ts, spacing.ts
 └─ types/
```

---

## 12. Calculator Logic Requirements

Each calculator (SIP, Step-Up SIP, SWP, EMI, Retirement, Education, Return-to-India Planning) needs:
- Pure, unit-tested calculation functions in `lib/finance-math.ts` (no logic inside components).
- Debounced/instant recompute on slider or input change via Jotai atoms.
- Results panel: Investment vs. Growth bar, Total Investment, Estimated Returns, Maturity Value, % growth — matching the existing SIP Calculator screenshot layout exactly.
- Input validation (zod) — e.g., duration between 1–40 years, return rate 1–30%.

---

## 13. Phased Delivery Plan

| Phase | Scope | Est. Duration |
|---|---|---|
| 1. Foundation | Next.js/TS/Tailwind/shadcn setup, design tokens, fonts, Navbar/Footer, homepage shell | 1–1.5 weeks |
| 2. Core pages | Insurance, Investments, NRI Services, About, Contact (with form) | 1.5–2 weeks |
| 3. Calculators | All 7 calculators + shared panel/slider/result components | 1.5–2 weeks |
| 4. Knowledge Center | Article listing + detail template (CMS-ready) | 1 week |
| 5. Polish | Motion/Lottie pass, responsive QA, accessibility audit, Lighthouse tuning | 1 week |
| 6. Launch | SEO metadata, analytics, deployment, monitoring | 3–4 days |

---

## 14. Open Items / Decisions Needed

1. Confirm exact gold/CTA hex and font family from live site DevTools (flagged in 5.1).
2. Confirm whether Knowledge Center is static content or backed by a future CMS (affects ISR strategy).
3. Confirm whether the stock ticker bar pulls live data or is static/decorative.
4. Confirm analytics provider (GA4 / other) for `next/script` integration.
5. Confirm hosting target (Vercel vs. self-hosted Node) — affects ISR/ image optimization setup.

---

*This PRD should be treated as a living document — update Section 14 as decisions are confirmed and re-circulate before Phase 1 kickoff.*