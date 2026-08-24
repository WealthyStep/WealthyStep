import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

interface InfoCardProps {
  title: string;
  description: React.ReactNode;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function InfoCard({
  title,
  description,
  icon: Icon,
  className,
  delay = 0,
}: InfoCardProps) {
  return (
    <FadeIn delay={delay} className="h-full">
      <div
        className={cn(
          "flex h-full flex-col items-center text-center rounded-2xl bg-cream border border-border-sage/20 p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md duration-300",
          className
        )}
      >
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-card text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mb-3 font-heading text-lg font-semibold text-text-dark">
          {title}
        </h3>
        <div className="text-text-body text-sm leading-relaxed flex-1">
          {description}
        </div>
      </div>
    </FadeIn>
  );
}
