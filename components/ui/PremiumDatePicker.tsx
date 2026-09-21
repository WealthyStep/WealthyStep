"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  ChevronUp,
} from "lucide-react";

interface PremiumDatePickerProps {
  value: string; // Expected in YYYY-MM-DD format
  onChange: (dateStr: string) => void; // Emits YYYY-MM-DD format
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  placement?: "top" | "bottom" | "auto" | "inline";
  maxYear?: number;
  minYear?: number;
  allowFuture?: boolean;
  inline?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Convert YYYY-MM-DD -> DD/MM/YYYY
export function formatToDDMMYYYY(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

type CalendarViewMode = "days" | "months" | "years";

export function PremiumDatePicker({
  value,
  onChange,
  placeholder = "DD / MM / YYYY",
  required = false,
  className = "",
  disabled = false,
  placement = "inline",
  maxYear,
  minYear = 1930,
  allowFuture = false,
  inline = true,
}: PremiumDatePickerProps) {
  const isInline = inline || placement === "inline";
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(formatToDDMMYYYY(value));
  const [viewMode, setViewMode] = useState<CalendarViewMode>("days");
  const uniqueId = useId();

  // Dynamic current & effective max year (automatically updates every new year)
  const currentCalendarYear = new Date().getFullYear();
  const effectiveMaxYear = maxYear !== undefined ? maxYear : allowFuture ? currentCalendarYear + 30 : currentCalendarYear;

  // Initial reference date
  const getInitialView = () => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return { year: d.getFullYear(), month: d.getMonth() };
      }
    }
    return { year: 1995, month: 0 };
  };

  const initial = getInitialView();
  const [viewYear, setViewYear] = useState<number>(initial.year);
  const [viewMonth, setViewMonth] = useState<number>(initial.month);
  const [decadeStart, setDecadeStart] = useState<number>(
    Math.floor(initial.year / 12) * 12
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [openUpwards, setOpenUpwards] = useState(false);

  // Sync external value changes
  useEffect(() => {
    setInputText(formatToDDMMYYYY(value));
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        setDecadeStart(Math.floor(d.getFullYear() / 12) * 12);
      }
    }
  }, [value]);

  // Reset view mode to days whenever opened
  useEffect(() => {
    if (isOpen) {
      setViewMode("days");
    }
  }, [isOpen]);

  // Smart upward/downward positioning for non-inline mode
  useEffect(() => {
    if (isOpen && containerRef.current && !isInline) {
      if (placement === "top") {
        setOpenUpwards(true);
      } else if (placement === "bottom") {
        setOpenUpwards(false);
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpwards(spaceBelow < 360 && rect.top > 360);
      }
    }
  }, [isOpen, placement, isInline]);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle direct typing with DD/MM/YYYY auto-masking
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";

    if (raw.length > 0) {
      formatted = raw.slice(0, 2);
      if (raw.length >= 3) {
        formatted += "/" + raw.slice(2, 4);
      }
      if (raw.length >= 5) {
        formatted += "/" + raw.slice(4, 8);
      }
    }

    setInputText(formatted);

    if (raw.length === 8) {
      const d = parseInt(raw.slice(0, 2), 10);
      const m = parseInt(raw.slice(2, 4), 10);
      const y = parseInt(raw.slice(4, 8), 10);

      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= minYear && y <= effectiveMaxYear) {
        const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        onChange(iso);
        setViewYear(y);
        setViewMonth(m - 1);
        setDecadeStart(Math.floor(y / 12) * 12);
      }
    } else if (raw.length === 0) {
      onChange("");
    }
  };

  // Day Selection
  const handleSelectDay = (day: number) => {
    const formattedIso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formattedIso);
    setInputText(formatToDDMMYYYY(formattedIso));
    setIsOpen(false);
  };

  // Month Selection from Month Grid
  const handleSelectMonth = (monthIndex: number) => {
    setViewMonth(monthIndex);
    setViewMode("days");
  };

  // Year Selection from Year Grid
  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setViewMode("days");
  };

  // Previous navigation (month / decade)
  const handlePrev = () => {
    if (viewMode === "days") {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((prev) => Math.max(minYear, prev - 1));
      } else {
        setViewMonth((prev) => prev - 1);
      }
    } else if (viewMode === "years") {
      setDecadeStart((prev) => Math.max(minYear - 4, prev - 12));
    }
  };

  // Next navigation (month / decade)
  const handleNext = () => {
    if (viewMode === "days") {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((prev) => Math.min(effectiveMaxYear, prev + 1));
      } else {
        setViewMonth((prev) => prev + 1);
      }
    } else if (viewMode === "years") {
      setDecadeStart((prev) => Math.min(effectiveMaxYear, prev + 12));
    }
  };

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  // Highlight selected day
  let selectedDay: number | null = null;
  if (value) {
    const valDate = new Date(value);
    if (
      !isNaN(valDate.getTime()) &&
      valDate.getFullYear() === viewYear &&
      valDate.getMonth() === viewMonth
    ) {
      selectedDay = valDate.getDate();
    }
  }

  const today = new Date();
  const isTodayCurrentView =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;

  // Years for decade grid
  const decadeYears = Array.from({ length: 12 }, (_, i) => decadeStart + i);

  // Dynamic quick decades for instant jump (automatically spans from 1950 up to the current/max decade)
  const latestDecade = Math.floor(effectiveMaxYear / 10) * 10;
  const quickDecades: number[] = [];
  for (let dec = 1950; dec <= latestDecade; dec += 10) {
    quickDecades.push(dec);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field with Calendar Trigger */}
      <div className="relative flex items-center group">
        <input
          id={`date-picker-${uniqueId}`}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={10}
          className={`w-full pl-3.5 pr-16 py-2.5 bg-[#FAFBF7] border rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#84BD3C] focus:bg-white transition-all cursor-pointer placeholder:text-gray-400 shadow-2xs ${
            isOpen ? "border-[#84BD3C] ring-2 ring-[#84BD3C]/20 bg-white" : "border-gray-200 group-hover:border-gray-300"
          }`}
        />

        <div className="absolute right-1.5 top-0 bottom-0 flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setInputText("");
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 transition cursor-pointer"
              title="Clear date"
              tabIndex={-1}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`p-1.5 rounded-lg text-gray-500 hover:text-[#180D45] hover:bg-[#F3F7EB] transition-colors cursor-pointer ${
              isOpen ? "text-[#180D45] bg-[#F3F7EB]" : ""
            }`}
            tabIndex={-1}
            aria-label="Toggle Calendar"
          >
            {isOpen && isInline ? (
              <ChevronUp className="w-4 h-4 text-[#446A1B]" />
            ) : (
              <CalendarIcon className="w-4 h-4 text-[#446A1B]" />
            )}
          </button>
        </div>
      </div>

      {/* Calendar Body: Inline Expansion OR Floating Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`${
            isInline
              ? "mt-2 w-full bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-[#C7D9A8] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150"
              : `absolute z-[100] left-0 right-0 sm:left-0 sm:right-auto w-full sm:w-[320px] bg-white rounded-3xl p-4 shadow-2xl border border-[#C7D9A8] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 ${
                  openUpwards ? "bottom-full mb-2" : "top-full mt-2"
                }`
          }`}
          style={!isInline ? { maxWidth: "calc(100vw - 2rem)" } : undefined}
        >
          {/* Top Bar: Month & Year View Switchers */}
          <div className="flex items-center justify-between gap-1 pb-2.5 mb-2 border-b border-gray-100">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={viewMode === "months"}
              className="p-1 rounded-xl text-gray-600 hover:text-[#180D45] hover:bg-[#F3F7EB] active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Custom Interactive Month & Year Buttons */}
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {/* Month Selector Button */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "months" ? "days" : "months")}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs ${
                  viewMode === "months"
                    ? "bg-[#180D45] text-white font-extrabold shadow-xs"
                    : "text-[#180D45] bg-[#F3F7EB] hover:bg-[#E5EED3]"
                }`}
              >
                <span>{MONTH_NAMES[viewMonth]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${viewMode === "months" ? "rotate-180" : ""}`} />
              </button>

              {/* Year Selector Button */}
              <button
                type="button"
                onClick={() => {
                  if (viewMode === "years") {
                    setViewMode("days");
                  } else {
                    setDecadeStart(Math.floor(viewYear / 12) * 12);
                    setViewMode("years");
                  }
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1 cursor-pointer shadow-2xs ${
                  viewMode === "years"
                    ? "bg-[#180D45] text-white font-extrabold shadow-xs"
                    : "text-[#180D45] bg-[#F3F7EB] hover:bg-[#E5EED3]"
                }`}
              >
                <span>{viewYear}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${viewMode === "years" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={viewMode === "months"}
              className="p-1 rounded-xl text-gray-600 hover:text-[#180D45] hover:bg-[#F3F7EB] active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ================= VIEW 1: DAYS VIEW ================= */}
          {viewMode === "days" && (
            <div className="animate-in fade-in duration-150">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1 select-none">
                {DAYS_OF_WEEK.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-xs mt-1">
                {/* Trailing days from previous month */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <span
                    key={`prev-${i}`}
                    className="h-7.5 w-7.5 mx-auto flex items-center justify-center text-gray-300 text-[10px] select-none"
                  >
                    {prevMonthDays - firstDayIndex + i + 1}
                  </span>
                ))}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const isSelected = selectedDay === day;
                  const isToday = isTodayCurrentView && today.getDate() === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-7.5 w-7.5 mx-auto rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#180D45] text-white font-extrabold shadow-sm ring-2 ring-[#84BD3C] scale-105"
                          : isToday
                          ? "bg-[#84BD3C]/15 text-[#446A1B] font-extrabold border border-[#84BD3C]/60 hover:bg-[#84BD3C]/25"
                          : "text-gray-700 hover:bg-[#F3F7EB] hover:text-[#180D45]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= VIEW 2: MONTHS GRID (3x4) ================= */}
          {viewMode === "months" && (
            <div className="py-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
                Select Month
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MONTH_NAMES_SHORT.map((mName, idx) => {
                  const isSelected = viewMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => handleSelectMonth(idx)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                        isSelected
                          ? "bg-[#180D45] text-white font-black shadow-xs ring-2 ring-[#84BD3C]"
                          : "bg-[#FAFBF7] hover:bg-[#F3F7EB] text-gray-800 hover:text-[#180D45] border border-gray-100 hover:border-[#C7D9A8]"
                      }`}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= VIEW 3: YEARS GRID (4x3 Decade Grid) ================= */}
          {viewMode === "years" && (
            <div className="py-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
                Select Year ({decadeStart} – {decadeStart + 11})
              </div>

              {/* 12 Years Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {decadeYears.map((yr) => {
                  const isSelected = viewYear === yr;
                  const isDisabled = yr < minYear || yr > effectiveMaxYear;
                  return (
                    <button
                      key={yr}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectYear(yr)}
                      className={`py-1.5 px-1 rounded-xl text-xs font-bold font-mono transition cursor-pointer text-center ${
                        isSelected
                          ? "bg-[#180D45] text-white font-black shadow-xs ring-2 ring-[#84BD3C]"
                          : isDisabled
                          ? "opacity-25 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "bg-[#FAFBF7] hover:bg-[#F3F7EB] text-gray-800 hover:text-[#180D45] border border-gray-100 hover:border-[#C7D9A8]"
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>

              {/* Quick Jump Decades */}
              <div className="mt-2.5 pt-2 border-t border-gray-100">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-center">
                  Quick Decade
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {quickDecades.map((dec) => (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => setDecadeStart(dec)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                        decadeStart === dec
                          ? "bg-[#84BD3C] text-[#180D45] font-black shadow-2xs"
                          : "bg-gray-100 text-gray-600 hover:bg-[#F3F7EB] hover:text-[#180D45]"
                      }`}
                    >
                      {dec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Quick Actions */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-100 text-xs">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setInputText("");
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-gray-400 hover:text-red-600 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                onChange(iso);
                setInputText(formatToDDMMYYYY(iso));
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                setViewMode("days");
                setIsOpen(false);
              }}
              className="text-xs font-bold text-[#446A1B] hover:text-[#180D45] transition cursor-pointer px-2.5 py-1 rounded-lg hover:bg-[#F3F7EB]"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-[#180D45] text-white rounded-xl font-bold text-xs hover:bg-[#25156B] transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-[#84BD3C]" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



