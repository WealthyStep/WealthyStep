"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  eduCurrentAgeAtom, 
  eduCollegeAgeAtom, 
  eduCurrentCostAtom,
  eduCurrentSavingsAtom
} from "@/store/calculator-store";
import { calculateEducation, formatCurrency, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ResultBar } from "./ResultBar";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function EducationCalculator() {
  const [currentAge, setCurrentAge] = useAtom(eduCurrentAgeAtom);
  const [collegeAge, setCollegeAge] = useAtom(eduCollegeAgeAtom);
  const [currentCost, setCurrentCost] = useAtom(eduCurrentCostAtom);
  const [currentSavings, setCurrentSavings] = useAtom(eduCurrentSavingsAtom);

  const results = calculateEducation(currentAge, collegeAge, currentCost, currentSavings);
  
  // Future value of current savings over corpus required
  const futureValueOfSavings = currentSavings * Math.pow(1 + 12 / 100, results.yearsToCollege); // Assuming 12% return for the visual gap
  const coveredPercent = results.corpusRequired > 0 
    ? Math.min((futureValueOfSavings / results.corpusRequired) * 100, 100)
    : 100;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Inputs Panel */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-sage/30 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-6 text-navy">
          <GraduationCap className="h-6 w-6 text-gold" />
          <h2 className="text-xl font-bold font-heading">Education Calculator</h2>
        </div>
        <p className="text-sm text-text-body mb-8">Plan for your child's higher education</p>

        {/* Current Age */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Child's Current Age</label>
            <div className="relative w-28">
              <Input 
                type="number" 
                value={currentAge} 
                onChange={(e) => setCurrentAge(Math.min(Number(e.target.value), collegeAge - 1))}
                className="pr-12 text-right font-semibold text-navy"
                min={0}
                max={17}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body text-xs font-medium">years</span>
            </div>
          </div>
          <Slider 
            value={[currentAge]} 
            onValueChange={([val]) => setCurrentAge(Math.min(val, collegeAge - 1))} 
            min={0} 
            max={17} 
            step={1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>0 years</span>
            <span>17 years</span>
          </div>
        </div>

        {/* College Age */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">College Start Age</label>
            <div className="relative w-28">
              <Input 
                type="number" 
                value={collegeAge} 
                onChange={(e) => setCollegeAge(Math.max(Number(e.target.value), currentAge + 1))}
                className="pr-12 text-right font-semibold text-navy"
                min={16}
                max={25}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-body text-xs font-medium">years</span>
            </div>
          </div>
          <Slider 
            value={[collegeAge]} 
            onValueChange={([val]) => setCollegeAge(Math.max(val, currentAge + 1))} 
            min={16} 
            max={25} 
            step={1}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>16 years</span>
            <span>25 years</span>
          </div>
        </div>

        {/* Current Education Cost */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-dark">Current Cost of Education</label>
            <div className="relative w-32">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-body font-medium">₹</span>
              <Input 
                type="number" 
                value={currentCost} 
                onChange={(e) => setCurrentCost(Number(e.target.value))}
                className="pl-7 text-right font-semibold text-navy"
                min={100000}
                max={50000000}
              />
            </div>
          </div>
          <Slider 
            value={[currentCost]} 
            onValueChange={([val]) => setCurrentCost(val)} 
            min={100000} 
            max={50000000} 
            step={50000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹1 Lakh</span>
            <span>₹5 Cr</span>
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
                max={10000000}
              />
            </div>
          </div>
          <Slider 
            value={[currentSavings]} 
            onValueChange={([val]) => setCurrentSavings(val)} 
            min={0} 
            max={10000000} 
            step={50000}
          />
          <div className="flex justify-between text-xs text-text-body/70">
            <span>₹0</span>
            <span>₹1 Cr</span>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-cream p-6 md:p-8 rounded-2xl border border-border-sage/20 shadow-sm h-full flex flex-col">
        <h3 className="text-xl font-bold font-heading text-navy mb-2">Education Plan</h3>
        <p className="text-sm text-text-body mb-8">Your college fund roadmap</p>

        <div className="bg-white rounded-xl p-6 border border-border-sage/30 shadow-sm mb-4">
          <ResultBar 
            labelLeft="Covered" 
            labelRight="Gap" 
            percentLeft={coveredPercent}
            colorLeft="bg-navy"
            colorRight="bg-gold"
          />
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Years to College</p>
          <p className="text-2xl font-bold text-navy">{results.yearsToCollege} years</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-gold shadow-sm mb-4">
          <p className="text-sm text-text-body mb-1">Estimated Future Cost</p>
          <p className="text-3xl font-bold text-navy">{formatCurrency(results.corpusRequired)}</p>
          <p className="text-xs text-text-body mt-1">Assuming 10% education inflation</p>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-border-sage/30 shadow-sm mb-auto space-y-4">
          <div>
            <p className="text-sm text-text-body mb-1">Additional Corpus Needed</p>
            <p className="text-2xl font-bold text-gold">{formatCurrency(results.additionalSavingsNeeded)}</p>
          </div>
          <div className="pt-4 border-t border-border-sage/30">
            <p className="text-sm text-text-body mb-1">Monthly SIP Required</p>
            <p className="text-2xl font-bold text-navy">{formatCurrencyExact(results.monthlySipRequired)}</p>
            <p className="text-xs text-text-body mt-1">Assuming 12% annual returns</p>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="gold" className="w-full font-heading">Get Education Plan</Button>
        </div>
      </div>
    </div>
  );
}
