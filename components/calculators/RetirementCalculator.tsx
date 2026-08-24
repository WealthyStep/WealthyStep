"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  retCurrentAgeAtom, 
  retRetirementAgeAtom, 
  retMonthlyExpenseAtom,
  retCurrentSavingsAtom
} from "@/store/calculator-store";
import { calculateRetirement, formatCurrency, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ResultBar } from "./ResultBar";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useAtom(retCurrentAgeAtom);
  const [retirementAge, setRetirementAge] = useAtom(retRetirementAgeAtom);
  const [monthlyExpense, setMonthlyExpense] = useAtom(retMonthlyExpenseAtom);
  const [currentSavings, setCurrentSavings] = useAtom(retCurrentSavingsAtom);

  const results = calculateRetirement(currentAge, retirementAge, monthlyExpense, currentSavings);
  const coveredPercent = results.corpusRequired > 0 
    ? Math.min((results.futureValueOfSavings / results.corpusRequired) * 100, 100)
    : 100;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Inputs Panel */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-sage/30 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-6 text-navy">
          <PiggyBank className="h-6 w-6 text-gold" />
          <h2 className="text-xl font-bold font-heading">Retirement Calculator</h2>
        </div>
        <p className="text-sm text-text-body mb-8">Plan your retirement corpus</p>

        {/* Current Age */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Current Age</label>
            <div className="relative w-28">
              <Input 
                type="number" 
                value={currentAge} 
                onChange={(e) => setCurrentAge(Math.min(Number(e.target.value), retirementAge - 1))}
                className="pr-12 text-right font-semibold text-navy"
                min={18}
                max={60}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body text-xs font-medium">years</span>
            </div>
          </div>
          <Slider 
            value={[currentAge]} 
            onValueChange={([val]) => setCurrentAge(Math.min(val, retirementAge - 1))} 
            min={18} 
            max={60} 
            step={1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>18 years</span>
            <span>60 years</span>
          </div>
        </div>

        {/* Retirement Age */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Retirement Age</label>
            <div className="relative w-28">
              <Input 
                type="number" 
                value={retirementAge} 
                onChange={(e) => setRetirementAge(Math.max(Number(e.target.value), currentAge + 1))}
                className="pr-12 text-right font-semibold text-navy"
                min={30}
                max={80}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body text-xs font-medium">years</span>
            </div>
          </div>
          <Slider 
            value={[retirementAge]} 
            onValueChange={([val]) => setRetirementAge(Math.max(val, currentAge + 1))} 
            min={30} 
            max={80} 
            step={1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>30 years</span>
            <span>80 years</span>
          </div>
        </div>

        {/* Current Monthly Expense */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Current Monthly Expense</label>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={monthlyExpense} 
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={10000}
                max={500000}
              />
            </div>
          </div>
          <Slider 
            value={[monthlyExpense]} 
            onValueChange={([val]) => setMonthlyExpense(val)} 
            min={10000} 
            max={500000} 
            step={5000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹10,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>

        {/* Current Savings */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Current Savings</label>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={currentSavings} 
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={0}
                max={50000000}
              />
            </div>
          </div>
          <Slider 
            value={[currentSavings]} 
            onValueChange={([val]) => setCurrentSavings(val)} 
            min={0} 
            max={50000000} 
            step={100000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹0</span>
            <span>₹5 Cr</span>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-cream p-6 md:p-8 rounded-2xl border border-border-sage/20 shadow-sm h-full flex flex-col">
        <h3 className="text-xl font-bold font-heading text-navy mb-2">Retirement Plan</h3>
        <p className="text-sm text-text-body mb-8">Your retirement roadmap</p>

        <div className="bg-white rounded-xl p-6 border border-border-sage/30 shadow-sm mb-4">
          <ResultBar 
            labelLeft="Covered" 
            labelRight="Gap" 
            percentLeft={coveredPercent}
            colorLeft="bg-gold"
            colorRight="bg-border-sage/50"
          />
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Years to Retirement</p>
          <p className="text-2xl font-bold text-navy">{results.yearsToRetirement} years</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gold shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Required Retirement Corpus</p>
          <p className="text-3xl font-bold text-navy">{formatCurrency(results.corpusRequired)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-auto space-y-4">
          <div>
            <p className="text-sm text-text-body mb-1">Additional Savings Needed</p>
            <p className="text-2xl font-bold text-gold">{formatCurrency(results.additionalSavingsNeeded)}</p>
          </div>
          <div className="pt-4 border-t border-border-sage/30">
            <p className="text-sm text-text-body mb-1">Monthly SIP Required</p>
            <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.monthlySipRequired)}</p>
            <p className="text-xs text-text-body mt-1">Assuming 12% annual returns</p>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="gold" className="w-full font-heading">Get Retirement Plan</Button>
        </div>
      </div>
    </div>
  );
}
