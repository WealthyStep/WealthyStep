"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  emiLoanAmountAtom, 
  emiInterestRateAtom, 
  emiDurationAtom 
} from "@/store/calculator-store";
import { calculateEMI, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ResultBar } from "./ResultBar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useAtom(emiLoanAmountAtom);
  const [interestRate, setInterestRate] = useAtom(emiInterestRateAtom);
  const [duration, setDuration] = useAtom(emiDurationAtom);

  const results = calculateEMI(loanAmount, interestRate, duration);
  const principalPercent = (results.principal / results.totalPayment) * 100;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Inputs Panel */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-sage/30 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-6 text-navy">
          <Home className="h-6 w-6 text-gold" />
          <h2 className="text-xl font-bold font-heading">EMI / Home Loan Calculator</h2>
        </div>
        <p className="text-sm text-text-body mb-8">Calculate your loan EMI and total interest</p>

        {/* Loan Amount */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Loan Amount</label>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={100000}
                max={100000000}
              />
            </div>
          </div>
          <Slider 
            value={[loanAmount]} 
            onValueChange={([val]) => setLoanAmount(val)} 
            min={100000} 
            max={100000000} 
            step={100000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹1 Lakh</span>
            <span>₹10 Cr</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Interest Rate</label>
            <div className="relative w-24">
              <Input 
                type="number" 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="pr-6 text-right font-semibold text-navy"
                min={5}
                max={20}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body font-medium">%</span>
            </div>
          </div>
          <Slider 
            value={[interestRate]} 
            onValueChange={([val]) => setInterestRate(val)} 
            min={5} 
            max={20} 
            step={0.1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Loan Tenure</label>
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
        <h3 className="text-xl font-bold font-heading text-navy mb-2">Loan Summary</h3>
        <p className="text-sm text-text-body mb-8">Your EMI breakdown</p>

        <div className="bg-white rounded-xl p-6 border border-border-sage/30 shadow-sm mb-4">
          <ResultBar 
            labelLeft="Principal" 
            labelRight="Interest" 
            percentLeft={principalPercent} 
          />
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gold shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Monthly EMI</p>
          <p className="text-3xl font-bold text-navy">{formatCurrencyExact(results.monthlyEMI)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Principal Amount</p>
          <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.principal)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-gold">{formatCurrencyExact(results.totalInterest)}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-auto">
          <p className="text-sm text-text-body mb-1">Total Payment (Principal + Interest)</p>
          <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.totalPayment)}</p>
        </div>

        <div className="mt-6">
          <Button variant="gold" className="w-full font-heading">Apply for Loan</Button>
        </div>
      </div>
    </div>
  );
}
