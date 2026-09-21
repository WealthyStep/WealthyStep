"use client";

import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ProtectedImageProps extends ImageProps {
  wrapperClassName?: string;
  disableProtection?: boolean;
}

/**
 * ProtectedImage Component
 * - Preserves 100% Next.js image optimization, LCP preloading, and Googlebot SEO `alt` tags.
 * - Adds client-side right-click context menu and drag protection against accidental image downloads.
 * - Allows explicit aspect ratio or layout bounds to enforce 0.00 CLS (Cumulative Layout Shift).
 */
export function ProtectedImage({
  className,
  wrapperClassName,
  disableProtection = false,
  onContextMenu,
  onDragStart,
  alt,
  ...props
}: ProtectedImageProps) {
  const handleContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!disableProtection) {
      e.preventDefault();
    }
    if (onContextMenu) {
      onContextMenu(e);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    if (!disableProtection) {
      e.preventDefault();
    }
    if (onDragStart) {
      onDragStart(e);
    }
  };

  return (
    <Image
      alt={alt}
      className={cn(
        "select-none pointer-events-auto transition-all",
        !disableProtection && "[-webkit-touch-callout:none] [-webkit-user-drag:none]",
        className
      )}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      {...props}
    />
  );
}
