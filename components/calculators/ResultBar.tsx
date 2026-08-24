import React from "react";
import { cn } from "@/lib/utils";

interface ResultBarProps {
  labelLeft: string;
  labelRight: string;
  percentLeft: number; // 0 to 100
  colorLeft?: string;
  colorRight?: string;
  className?: string;
}

export function ResultBar({
  labelLeft,
  labelRight,
  percentLeft,
  colorLeft = "bg-navy",
  colorRight = "bg-gold",
  className,
}: ResultBarProps) {
  // Ensure percentage stays between 0 and 100
  const clampedPercent = Math.min(Math.max(percentLeft, 0), 100);

  return (
    <div className={cn("w-full mb-6", className)}>
      <div className="flex justify-between text-xs text-text-body mb-2">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
      <div className="h-4 w-full rounded-full overflow-hidden flex">
        <div 
          className={cn("h-full transition-all duration-500 ease-out", colorLeft)} 
          style={{ width: `${clampedPercent}%` }}
        />
        <div 
          className={cn("h-full transition-all duration-500 ease-out", colorRight)} 
          style={{ width: `${100 - clampedPercent}%` }}
        />
      </div>
    </div>
  );
}
