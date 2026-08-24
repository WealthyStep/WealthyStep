"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  stepUpInitialInvestmentAtom, 
  stepUpReturnRateAtom, 
  stepUpDurationAtom,
  stepUpAnnualIncrementAtom
} from "@/store/calculator-store";
import { calculateStepUpSIP, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ResultBar } from "./ResultBar";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export function StepUpSipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useAtom(stepUpInitialInvestmentAtom);
  const [returnRate, setReturnRate] = useAtom(stepUpReturnRateAtom);
  const [duration, setDuration] = useAtom(stepUpDurationAtom);
  const [annualStepUp, setAnnualStepUp] = useAtom(stepUpAnnualIncrementAtom);

  const results = calculateStepUpSIP(monthlyInvestment, annualStepUp, returnRate, duration);
  const investPercent = (results.totalInvestment / results.maturityValue) * 100;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Inputs Panel */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-sage/30 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-6 text-navy">
          <TrendingUp className="h-6 w-6 text-gold" />
          <h2 className="text-xl font-bold font-heading">SIP Step-Up Calculator</h2>
        </div>
        <p className="text-sm text-text-body mb-8">Increase your SIP amount annually for higher returns</p>

        {/* Starting Monthly Investment */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Starting Monthly Investment</label>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={monthlyInvestment} 
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={500}
                max={200000}
              />
            </div>
          </div>
          <Slider 
            value={[monthlyInvestment]} 
            onValueChange={([val]) => setMonthlyInvestment(val)} 
            min={500} 
            max={200000} 
            step={500}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹1,000</span>
            <span>₹2,00,000</span>
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
                max={30}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body font-medium">%</span>
            </div>
          </div>
          <Slider 
            value={[returnRate]} 
            onValueChange={([val]) => setReturnRate(val)} 
            min={1} 
            max={30} 
            step={0.5}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Investment Duration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Investment Duration</label>
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

        {/* Annual Step-Up */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Annual Step-Up</label>
            <div className="relative w-24">
              <Input 
                type="number" 
                value={annualStepUp} 
                onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                className="pr-6 text-right font-semibold text-navy"
                min={0}
                max={50}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body font-medium">%</span>
            </div>
          </div>
          <Slider 
            value={[annualStepUp]} 
            onValueChange={([val]) => setAnnualStepUp(val)} 
            min={0} 
            max={50} 
            step={1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-cream p-6 md:p-8 rounded-2xl border border-border-sage/20 shadow-sm h-full flex flex-col">
        <h3 className="text-xl font-bold font-heading text-navy mb-2">Step-Up Results</h3>
        <p className="text-sm text-text-body mb-8">Power of increasing your investments</p>

        <div className="bg-white rounded-xl p-6 border border-border-sage/30 shadow-sm mb-4">
          <ResultBar 
            labelLeft="Invested" 
            labelRight="Returns" 
            percentLeft={investPercent} 
          />
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Total Investment</p>
          <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.totalInvestment)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Estimated Returns</p>
          <p className="text-2xl font-bold text-gold">{formatCurrencyExact(results.estimatedReturns)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gold shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Maturity Value</p>
          <p className="text-3xl font-bold text-navy">{formatCurrencyExact(results.maturityValue)}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-auto">
          <p className="text-sm text-text-body mb-1">Final Monthly SIP</p>
          <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.finalMonthlySIP)}</p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-6 border-t border-border-sage/30">
          <Button variant="gold" className="w-full font-heading">Start Step-Up SIP</Button>
        </div>
      </div>
    </div>
  );
}
