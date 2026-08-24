"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
  duration = 0.5,
  once = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: 30, x: 0 };
      case "down":
        return { y: -30, x: 0 };
      case "left":
        return { x: 30, y: 0 };
      case "right":
        return { x: -30, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, ...getDirectionOffset() };

  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : duration,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Helper for staggering children
export function FadeInStagger({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-50px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const shouldReduceMotion = useReducedMotion();
  
  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: 30, x: 0 };
      case "down": return { y: -30, x: 0 };
      case "left": return { x: 30, y: 0 };
      case "right": return { x: -30, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const item = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, ...getDirectionOffset() },
    show: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      transition: { duration: 0.5 } 
    },
  };

  return (
    <motion.div variants={item} className={cn(className)}>
      {children}
    </motion.div>
  );
}

