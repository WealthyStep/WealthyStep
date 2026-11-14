import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Routes that require a completely distraction-free, dedicated viewport
 * (no global navigation, no live ticker, no footer, no floating WhatsApp or chatbot buttons).
 */
export function isIsolatedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/participant-form") ||
    pathname.startsWith("/health-insurance-form") ||
    pathname.startsWith("/insurance-form") ||
    pathname.startsWith("/bse-star-mutual-fund-form") ||
    pathname.startsWith("/bse-star-form") ||
    pathname.startsWith("/life-insurance-form") ||
    pathname.startsWith("/life-insurance-details") ||
    pathname.startsWith("/presentation") ||
    pathname.startsWith("/feedback") ||
    pathname.startsWith("/admin")
  );
}

