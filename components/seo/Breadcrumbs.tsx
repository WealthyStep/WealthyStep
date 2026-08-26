import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaList = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 2, // 1 is Home
    "name": item.label,
    "item": `https://wealthystep.com${item.href}`
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wealthystep.com/"
      },
      ...schemaList
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 md:mb-6 flex items-center text-xs md:text-sm font-medium text-cream/70">
        <ol className="flex items-center flex-wrap gap-y-2">
          <li className="flex items-center">
            <Link href="/" className="flex items-center hover:text-lime transition-colors">
              <Home className="mr-1 h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center max-w-[full]">
              <ChevronRight className="mx-1 md:mx-2 h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0 text-cream/40" />
              {index === items.length - 1 ? (
                <span className="text-white truncate max-w-[150px] sm:max-w-[250px] md:max-w-md inline-block align-bottom" title={item.label} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-lime transition-colors whitespace-nowrap">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
