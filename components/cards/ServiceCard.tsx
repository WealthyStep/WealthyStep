import React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  delay?: number;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  className,
  delay = 0,
}: ServiceCardProps) {
  return (
    <FadeIn delay={delay} className="h-full">
      <div
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-border-sage/30 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1",
          className
        )}
      >
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-lime transition-transform group-hover:scale-110 duration-300">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mb-3 font-heading text-xl font-semibold text-text-dark">
            {title}
          </h3>
          <p className="mb-6 text-text-body text-sm leading-relaxed flex-1">
            {description}
          </p>
          <Link
            href={href}
            className="inline-flex items-center text-sm font-semibold text-lime group-hover:text-cta-green transition-colors"
          >
            Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
