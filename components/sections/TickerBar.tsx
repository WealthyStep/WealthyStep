"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TickerItem } from "@/types/ticker";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TickerBar() {
  const { data, error, isLoading } = useSWR<TickerItem[]>("/api/ticker", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // If there's a permanent error and no data, we hide the bar
  if (error && !data) return null;

  const renderItem = (item: TickerItem, idx: number) => {
    const isPositive = item.change >= 0;
    return (
      <div key={`${item.symbol}-${idx}`} className="flex items-center gap-2 whitespace-nowrap px-6 shrink-0 border-l border-white/10 first:border-0">
        <span className="font-semibold text-white/90 text-sm tracking-wide">{item.label}</span>
        <span className="text-white text-sm">{item.value.toFixed(2)}</span>
        <div 
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            isPositive ? "bg-positive/20 text-positive" : "bg-negative/20 text-negative"
          )}
        >
          {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          <span>{Math.abs(item.change).toFixed(2)}</span>
          <span>({Math.abs(item.changePercent).toFixed(2)}%)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#180D45] border-b border-white/10 overflow-hidden relative flex items-center h-12">
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        {isLoading && !data ? (
          <div className="flex gap-12 w-full px-8 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
                <div className="h-5 w-24 bg-white/10 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div
            className={cn(
              "flex items-center flex-nowrap w-max transition-transform",
              !shouldReduceMotion && "animate-marquee"
            )}
            style={{ 
              animationPlayState: isHovered && !shouldReduceMotion ? "paused" : "running",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Double the data array to create a seamless loop */}
            {data.map((item, idx) => renderItem(item, idx))}
            {data.map((item, idx) => renderItem(item, idx + data.length))}
          </div>
        ) : (
          <div className="px-8 text-white/50 text-sm">Market data currently unavailable.</div>
        )}
      </div>
    </div>
  );
}
