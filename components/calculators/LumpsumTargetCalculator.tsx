"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  lumpsumTargetAmountAtom, 
  lumpsumTargetReturnRateAtom, 
  lumpsumTargetDurationAtom
} from "@/store/calculator-store";
import { calculateLumpsumTarget, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { User, TrendingUp, Wallet, Calculator, Coins, ShieldCheck, PieChart as PieChartIcon, LineChart } from "lucide-react";
import Link from "next/link";

export function LumpsumTargetCalculator() {
  const [targetAmount, setTargetAmount] = useAtom(lumpsumTargetAmountAtom);
  const [returnRate, setReturnRate] = useAtom(lumpsumTargetReturnRateAtom);
  const [duration, setDuration] = useAtom(lumpsumTargetDurationAtom);

  let results: any = null;
  let calculationError: string | null = null;
  try {
    results = calculateLumpsumTarget(targetAmount as number, duration as number, returnRate as number);
  } catch (err: any) {
    calculationError = err.message;
  }
  const safeResults = results || {};

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-4 bg-white p-4 md:p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-5 md:gap-6">
          <div className="flex items-center gap-2 text-navy border-b border-gray-100 pb-4">
            <User className="h-5 w-5 text-lime" />
            <h2 className="text-[15px] font-bold font-heading">Your Goal Details</h2>
          </div>
          <p className="text-[11px] text-text-body -mt-4">Adjust the sliders to see real-time results</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Target Amount</label>
              <div className="relative w-28">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-body text-[12px] font-medium">₹</span>
                <Input 
                  type="number" 
                  value={targetAmount} 
                  onChange={(e) => setTargetAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="pl-5 pr-2 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={100000}
                />
              </div>
            </div>
            <Slider 
              value={[Number(targetAmount)]} 
              onValueChange={([val]) => setTargetAmount(val)} 
              min={100000} 
              max={100000000} 
              step={100000}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>₹1 Lakh</span>
              <span>₹10 Cr</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Investment Duration</label>
              <div className="relative w-24">
                <Input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                  className="pr-10 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={1} max={40}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px] font-medium">Years</span>
              </div>
            </div>
            <Slider 
              value={[Number(duration)]} 
              onValueChange={([val]) => setDuration(val)} 
              min={1} 
              max={40} 
              step={1}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Expected Return (p.a.)</label>
              <div className="relative w-20">
                <Input 
                  type="number" 
                  value={returnRate} 
                  onChange={(e) => setReturnRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={1} max={30}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[12px] font-medium">%</span>
              </div>
            </div>
            <Slider 
              value={[Number(returnRate)]} 
              onValueChange={([val]) => setReturnRate(val)} 
              min={1} 
              max={30} 
              step={0.5}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {calculationError ? (
          <div className="lg:col-span-8 bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 bg-lime/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-lime text-2xl font-bold font-heading">?</span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2 font-heading">Waiting for valid input</h3>
            <p className="text-sm text-text-body max-w-[250px]">{calculationError}</p>
          </div>
        ) : (
          <React.Fragment>
        {/* MIDDLE COLUMN: RESULTS */}
        <div className="lg:col-span-8 bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-navy mb-1">
                <PieChartIcon className="h-5 w-5 text-lime" />
                <h2 className="text-[15px] font-bold font-heading">Target Goal Projection</h2>
              </div>
              <p className="text-[11px] text-text-body">How much you need to invest today to reach your goal</p>
            </div>
            <div className="bg-lime/10 text-lime px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto">
              In {duration} Years
            </div>
          </div>
          
          <div className="bg-navy rounded-[20px] p-6 text-white mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-white/80 mb-1">Required Lumpsum Investment</p>
              <h3 className="text-3xl font-bold text-lime font-heading">{formatCurrencyExact(results.requiredLumpsumInvestment)}</h3>
            </div>
            <div className="h-10 w-px bg-white/20 hidden sm:block"></div>
            <div>
              <p className="text-[12px] font-medium text-white/80 mb-1">Target Amount</p>
              <h3 className="text-2xl font-bold font-heading">{formatCurrencyExact(results.targetAmount)}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <Calculator className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Expected Growth</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.expectedGrowth)}>{formatCurrencyExact(results.expectedGrowth)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-orange-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="text-[10px] font-bold text-orange-700 truncate">Growth %</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-orange-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={`${results.growthPercentage}%`}>{results.growthPercentage}%</div>
            </div>
          </div>
          
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white border border-gray-100 p-5 rounded-[20px] shadow-sm">
                <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Key Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-3 h-3 text-lime" />
                    </div>
                    <p className="text-[11px] text-navy/90 leading-relaxed font-medium">To reach your goal of {formatCurrencyExact(results.targetAmount)} in {duration} years, you just need a one-time investment of <strong>{formatCurrencyExact(results.requiredLumpsumInvestment)}</strong> today.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-lime" />
                    </div>
                    <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Your investment is expected to grow by <strong>{results.growthPercentage}%</strong>.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-navy p-5 rounded-[20px] text-white flex flex-col justify-center">
                <h3 className="text-[15px] font-bold font-heading mb-2">Need Expert Guidance?</h3>
                <p className="text-white/80 text-[11px] mb-4">Our advisors can help you structure your investments.</p>
                <Link href="/contact" className="bg-lime hover:bg-lime/90 text-navy text-[12px] font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
                  Book Consultation <Calculator className="w-3 h-3" />
                </Link>
              </div>
          </div>

        </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
