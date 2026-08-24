"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  swpTotalInvestmentAtom, 
  swpMonthlyWithdrawalAtom, 
  swpReturnRateAtom,
  swpDurationAtom
} from "@/store/calculator-store";
import { calculateSWP, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ResultBar } from "./ResultBar";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";

export function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useAtom(swpTotalInvestmentAtom);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useAtom(swpMonthlyWithdrawalAtom);
  const [returnRate, setReturnRate] = useAtom(swpReturnRateAtom);
  const [duration, setDuration] = useAtom(swpDurationAtom);

  const results = calculateSWP(totalInvestment, monthlyWithdrawal, returnRate, duration);
  const withdrawnPercent = Math.min((results.totalWithdrawn / (results.totalWithdrawn + results.finalBalance)) * 100, 100);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Inputs Panel */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-sage/30 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-6 text-navy">
          <ArrowDownUp className="h-6 w-6 text-gold" />
          <h2 className="text-xl font-bold font-heading">SWP Calculator</h2>
        </div>
        <p className="text-sm text-text-body mb-8">Systematic Withdrawal Plan for regular income</p>

        {/* Total Investment */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Total Investment</label>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={totalInvestment} 
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={100000}
                max={100000000}
              />
            </div>
          </div>
          <Slider 
            value={[totalInvestment]} 
            onValueChange={([val]) => setTotalInvestment(val)} 
            min={100000} 
            max={100000000} 
            step={100000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹1 Lakh</span>
            <span>₹10 Cr</span>
          </div>
        </div>

        {/* Monthly Withdrawal */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Monthly Withdrawal</label>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={monthlyWithdrawal} 
                onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={5000}
                max={500000}
              />
            </div>
          </div>
          <Slider 
            value={[monthlyWithdrawal]} 
            onValueChange={([val]) => setMonthlyWithdrawal(val)} 
            min={5000} 
            max={500000} 
            step={1000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹5,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>

        {/* Expected Return Rate */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Expected Return Rate</label>
            <div className="relative w-24">
              <Input 
                type="number" 
                value={returnRate} 
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="pr-6 text-right font-semibold text-navy"
                min={1}
                max={20}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body font-medium">%</span>
            </div>
          </div>
          <Slider 
            value={[returnRate]} 
            onValueChange={([val]) => setReturnRate(val)} 
            min={1} 
            max={20} 
            step={0.5}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>1%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Withdrawal Period */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Withdrawal Period</label>
            <div className="relative w-28">
              <Input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="pr-12 text-right font-semibold text-navy"
                min={1}
                max={40}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body text-xs font-medium">years</span>
            </div>
          </div>
          <Slider 
            value={[duration]} 
            onValueChange={([val]) => setDuration(val)} 
            min={1} 
            max={40} 
            step={1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>1 year</span>
            <span>40 years</span>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-cream p-6 md:p-8 rounded-2xl border border-border-sage/20 shadow-sm h-full flex flex-col">
        <h3 className="text-xl font-bold font-heading text-navy mb-2">SWP Results</h3>
        <p className="text-sm text-text-body mb-8">Your withdrawal plan summary</p>

        <div className="bg-white rounded-xl p-6 border border-border-sage/30 shadow-sm mb-4">
          <ResultBar 
            labelLeft="Withdrawn" 
            labelRight="Balance" 
            percentLeft={withdrawnPercent} 
          />
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Initial Investment</p>
          <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.initialInvestment)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Total Amount Withdrawn</p>
          <p className="text-2xl font-bold text-gold">{formatCurrencyExact(results.totalWithdrawn)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gold shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Final Balance</p>
          <p className="text-3xl font-bold text-navy">{formatCurrencyExact(results.finalBalance)}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-auto">
          <p className="text-sm text-text-body mb-1">Withdrawal Duration</p>
          <p className="text-2xl font-bold text-navy">{duration} years</p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-6 border-t border-border-sage/30">
          <Button variant="gold" className="w-full font-heading">Start SWP</Button>
        </div>
      </div>
    </div>
  );
}
