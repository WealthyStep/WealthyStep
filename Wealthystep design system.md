# Wealthy Step — Design System Reference
Extracted from screenshot for redesign reference. Colors were sampled directly from pixels, so treat hexes as very close approximations of the real brand colors.

---

## 1. Color Palette

### Primary / Brand
| Name | Hex | Usage |
|---|---|---|
| Deep Navy (Primary BG) | `#180D45` | Main dark section backgrounds (Services, Tools, footer, dark bands) |
| Indigo Card / Button | `#1B0F4D` | Card backgrounds on navy sections, "Know More" button, dark tool cards |
| Indigo Button Alt | `#281475` | Secondary button shade / hover state on dark buttons |
| Brand Lime Green | `#84BD3C` | Eyebrow labels ("OUR SERVICES", "FEATURES"), accent icons, highlight text |
| CTA Green | `#83C120` | Primary action buttons ("Invest Now", "Send Message"), rounded pill buttons |
| Headline Purple Accent | `#240C7A` | Accent word inside hero headline ("Wealthy Step") |

### Neutrals
| Name | Hex | Usage |
|---|---|---|
| Pure White | `#FFFFFF` | Card backgrounds on white sections, text on navy |
| Off-White / Cream | `#FFFDF9` | Body copy on dark backgrounds (slightly warm white) |
| Near Black | `#141414` | Headline text on white sections |
| Body Gray | `#4A4A4A` (approx) | Paragraph text on white background |
| Light Border Green | `#C7D9A8` (approx, muted sage) | Card borders in "Explore Top Funds" module |
| Ticker Black | `#000000` | Top stock-ticker strip background |

### Semantic
| Name | Hex | Usage |
|---|---|---|
| Positive Green | `#4CAF50` (approx) | Up-tickers, positive fund returns |
| Negative Red | `#E53935` (approx) | Down-tickers |

---

## 2. Typography

**Heading font:** A rounded/geometric bold sans-serif — visually close to **Poppins**, **Jost**, or **DM Sans** (SemiBold/Bold weights). Recommend Poppins as the safe substitute.

**Body font:** A clean humanist sans — visually close to **Inter**, **Open Sans**, or **Nunito Sans**.

| Style | Font | Weight | Approx Size | Usage |
|---|---|---|---|---|
| H1 Hero | Poppins | 700 | 42–48px | "Empowering Your Future with Smart Financial Solutions" |
| H2 Section Title | Poppins | 700 | 28–32px | "Explore What We Offer", "Smart Tools to Simplify Your Finances" |
| Eyebrow Label | Poppins | 600, uppercase, letter-spaced | 13–14px | "OUR SERVICES", "FEATURES", "TOP FUNDS" — always brand green |
| H3 Card Title | Poppins | 600 | 18–20px | Service card titles, tool card titles |
| Body Text | Inter / Open Sans | 400 | 15–16px | Paragraph copy |
| Button Text | Poppins | 600 | 14–15px | All CTAs, uppercase or title case |
| Small/Meta | Inter | 400–500 | 12–13px | Table sub-labels, dates, fund category tags |

**Text color pairing rule:**
- On white background → near-black headings, gray body
- On navy background → white headings, off-white/light-gray body, lime green eyebrow label

---

## 3. Layout & Structure

- **Container width:** ~1200px max-width, centered, generous side padding (~24–40px on desktop)
- **Section rhythm:** alternating white → deep navy → white → navy bands, each with generous vertical padding (~80–100px top/bottom)
- **Grid patterns:**
  - 3-column card grids (Services, Feature icons, Planning calculators)
  - 2-column split layout (SIP Calculator inputs left / results right; About Us image collage left / text right)
  - 6-item 3x2 grid for "Smart Tools" icon cards
- **Cards:** white cards on navy sections; navy/indigo cards on white sections — the palette deliberately inverts per section for contrast
- **Border radius:** consistently rounded — ~12–16px on cards, fully pill-shaped (~9999px) on buttons
- **Shadows:** soft drop shadows on white cards floating over navy backgrounds

---

## 4. Components

### Buttons
- **Primary dark button** (e.g. "Know More"): indigo `#1B0F4D` bg, white text, pill-shaped, medium padding
- **Primary green button** (e.g. "Invest Now", "Send Message"): lime/CTA green `#83C120` bg, white bold text, pill-shaped
- **Tab buttons** (Equity/Hybrid/Debt): white bg with light border when inactive, navy `#180D45` bg + white text when active

### Cards
- **Service/feature cards:** white bg, image on top, circular icon badge (navy circle bg, colorful flat icon) overlapping image bottom edge, title + short description below
- **Dark tool cards:** navy/indigo bg, small icon in white rounded square top-left, bold white title, light gray description
- **Stat badge card:** white floating card with green star icon + bold number ("10+") + label, layered over hero image

### Icons
- Flat, colorful (multi-color) illustrative icon style — not line icons. Used inside white rounded squares (tool cards) or circular navy badges (service cards)

### Navbar
- White sticky bar, logo left (green "W" mark + "Wealthy Step" wordmark + tagline), centered pill-shaped nav links, dark "Login" pill button right

### Footer
- Solid navy `#180D45` background, 4-column layout (Logo/blurb, Services links, Quick Links, Contact Us), white/light-gray text, green social icons

### Ticker bar (top of page)
- Full-width black strip, small-caps ticker items with white index name, green (up) or red (down) value + arrow

---

## 5. Imagery Style
- Real photography: professional headshots (advisor in shirt/tie), lifestyle finance imagery (hands with coins/plants, documents, calculators)
- Photos often sit on a soft organic green blob/shape background in the hero
- About Us section uses a 3-photo asymmetric collage

---

## 6. Suggested CSS Variables

```css
:root {
  /* Brand */
  --color-navy: #180D45;
  --color-navy-card: #1B0F4D;
  --color-navy-alt: #281475;
  --color-accent-purple: #240C7A;
  --color-lime: #84BD3C;
  --color-cta-green: #83C120;

  /* Neutrals */
  --color-white: #FFFFFF;
  --color-cream: #FFFDF9;
  --color-text-dark: #141414;
  --color-text-body: #4A4A4A;
  --color-border-sage: #C7D9A8;
  --color-black: #000000;

  /* Semantic */
  --color-positive: #4CAF50;
  --color-negative: #E53935;

  /* Typography */
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', 'Open Sans', sans-serif;

  /* Radius */
  --radius-card: 16px;
  --radius-pill: 9999px;
}
```

---

## Notes / Caveats
- Colors were sampled from a compressed screenshot, so minor drift from the real brand hex values is expected — grab exact values from the live site's CSS/devtools if pixel-perfect accuracy matters.
- Exact font family couldn't be confirmed visually — verify via browser inspector on the live site (right-click → Inspect → check `font-family` in Computed styles) for a perfect match.
- Let me know if you want me to pull the live site's actual CSS (colors, fonts, spacing) via web fetch instead of estimating from the screenshot — that would be more accurate if the site is publicly accessible.