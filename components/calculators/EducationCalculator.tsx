"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  eduCurrentAgeAtom, 
  eduCollegeAgeAtom, 
  eduCurrentCostAtom,
  eduInflationRateAtom,
  eduReturnRateAtom
} from "@/store/calculator-store";
import { calculateEducation, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { TrendingUp, Wallet, ShieldCheck, PieChart as PieChartIcon, ArrowRight, Download, Crown, LineChart, GraduationCap, BookOpen, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

const PIE_COLORS = ['#1B0F4D', '#84BD3C', '#7C3AED', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-[11px]">
        <p className="font-bold text-navy mb-2">Year {label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
            <span className="text-text-body">{p.dataKey === 'totalCorpus' ? 'Your Corpus' : 'Target Cost'}</span>
            <span className="font-bold text-navy ml-auto">₹{(p.value / 100000).toFixed(2)}L</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function EducationCalculator() {
  const [currentAge, setCurrentAge] = useAtom(eduCurrentAgeAtom);
  const [collegeAge, setCollegeAge] = useAtom(eduCollegeAgeAtom);
  const [currentCost, setCurrentCost] = useAtom(eduCurrentCostAtom);
  const [inflationRate, setInflationRate] = useAtom(eduInflationRateAtom);
  const [returnRate, setReturnRate] = useAtom(eduReturnRateAtom);

  const results = calculateEducation(currentAge, collegeAge, currentCost, 0, returnRate, inflationRate);

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "₹0";
    if (tickItem >= 10000000) return `₹${(tickItem / 10000000).toFixed(1)}Cr`;
    if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(0)}L`;
    return `₹${tickItem}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="md:col-span-4 lg:col-span-3 bg-white p-4 md:p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-4 md:gap-5">
          <div className="flex items-center gap-2 text-navy border-b border-gray-100 pb-4">
            <GraduationCap className="h-5 w-5 text-lime" />
            <h2 className="text-[15px] font-bold font-heading">Education Details</h2>
          </div>
          <p className="text-[11px] text-text-body -mt-3">Adjust sliders for real-time results</p>

          {/* Child's Current Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Child's Age</label>
              <div className="relative w-20">
                <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Math.min(Number(e.target.value), collegeAge - 1))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} max={17} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">yrs</span>
              </div>
            </div>
            <Slider value={[currentAge]} onValueChange={([val]) => setCurrentAge(Math.min(val, collegeAge - 1))} min={0} max={17} step={1} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>0</span><span>17</span></div>
          </div>

          {/* College Start Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">College Start Age</label>
              <div className="relative w-20">
                <Input type="number" value={collegeAge} onChange={(e) => setCollegeAge(Math.max(Number(e.target.value), currentAge + 1))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={16} max={25} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">yrs</span>
              </div>
            </div>
            <Slider value={[collegeAge]} onValueChange={([val]) => setCollegeAge(Math.max(val, currentAge + 1))} min={16} max={25} step={1} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>16</span><span>25</span></div>
          </div>

          {/* Current Education Cost */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Current Cost</label>
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-body text-[12px]">₹</span>
                <Input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} className="pl-5 pr-2 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={100000} />
              </div>
            </div>
            <Slider value={[currentCost]} onValueChange={([val]) => setCurrentCost(val)} min={100000} max={50000000} step={50000} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>₹1L</span><span>₹5Cr</span></div>
          </div>

          {/* Education Inflation Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Edu. Inflation</label>
              <div className="relative w-20">
                <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} max={20} step={0.5} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">%</span>
              </div>
            </div>
            <Slider value={[inflationRate]} onValueChange={([val]) => setInflationRate(val)} min={0} max={20} step={0.5} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>0%</span><span>20%</span></div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Expected Return</label>
              <div className="relative w-20">
                <Input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} max={30} step={0.5} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">%</span>
              </div>
            </div>
            <Slider value={[returnRate]} onValueChange={([val]) => setReturnRate(val)} min={0} max={30} step={0.5} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>0%</span><span>30%</span></div>
          </div>
        </div>

        {/* MIDDLE COLUMN: RESULTS & CHART */}
        <div className="md:col-span-8 lg:col-span-6 bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-navy mb-1"><Target className="h-5 w-5 text-lime" /><h2 className="text-[15px] font-bold font-heading">Education Fund Plan</h2></div>
              <p className="text-[11px] text-text-body">Results update in real-time</p>
            </div>
            <div className="bg-lime/10 text-lime px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto">{results.yearsToCollege} Years Left</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="border border-gray-100 p-3 rounded-xl bg-purple-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-1"><Target className="w-3 h-3 text-purple-500 shrink-0" /><span className="text-[10px] font-bold text-purple-700 truncate">Future Cost</span></div>
              <div className="text-[14px] font-bold text-purple-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.futureCost)}>{formatCurrencyExact(results.futureCost)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-orange-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-1"><TrendingUp className="w-3 h-3 text-orange-500 shrink-0" /><span className="text-[10px] font-bold text-orange-700 truncate">Required SIP</span></div>
              <div className="text-[14px] font-bold text-orange-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={`${formatCurrencyExact(results.monthlySipRequired)}/mo`}>{formatCurrencyExact(results.monthlySipRequired)}/mo</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-1"><Wallet className="w-3 h-3 text-lime shrink-0" /><span className="text-[10px] font-bold text-text-body truncate">Total Investment</span></div>
              <div className="text-[14px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.totalInvestment)}>{formatCurrencyExact(results.totalInvestment)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-1"><LineChart className="w-3 h-3 text-lime shrink-0" /><span className="text-[10px] font-bold text-text-body truncate">Est. Returns</span></div>
              <div className="text-[14px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(Math.max(0, results.futureCost - results.totalInvestment))}>{formatCurrencyExact(Math.max(0, results.futureCost - results.totalInvestment))}</div>
            </div>
          </div>

          <div className="text-[13px] font-bold text-navy mb-4">Savings Growth vs Target Cost</div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-navy"></div><span className="text-[10px] font-medium text-text-body">Your Corpus</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-lime"></div><span className="text-[10px] font-medium text-text-body">Target Cost</span></div>
          </div>

          <div className="h-[200px] sm:h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.yearlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="eduColorTarget" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#84BD3C" stopOpacity={0.8}/><stop offset="95%" stopColor="#84BD3C" stopOpacity={0}/></linearGradient>
                  <linearGradient id="eduColorCorpus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#180D45" stopOpacity={0.8}/><stop offset="95%" stopColor="#180D45" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="year" tickFormatter={(val) => val === 0 ? "0" : `${val}Y`} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} />
                <YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="totalCorpus" stroke="#180D45" strokeWidth={2} fillOpacity={1} fill="url(#eduColorCorpus)" />
                <Area type="monotone" dataKey="targetCost" stroke="#84BD3C" strokeWidth={2} fillOpacity={1} fill="url(#eduColorTarget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] text-text-body/60 mt-4">* Assumptions: {inflationRate}% education inflation, {returnRate}% expected return. SIP at beginning of month.</div>
        </div>

        {/* RIGHT COLUMN: INSIGHTS */}
        <div className="md:col-span-12 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><Target className="w-3 h-3 text-lime" /></div><p className="text-[11px] text-navy/90 leading-relaxed font-medium">Start an SIP of <strong>{formatCurrencyExact(results.monthlySipRequired)}</strong> to secure their education.</p></div>
              <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><BookOpen className="w-3 h-3 text-lime" /></div><p className="text-[11px] text-navy/90 leading-relaxed font-medium">Education inflation ({inflationRate}%) is higher than regular inflation.</p></div>
              <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><TrendingUp className="w-3 h-3 text-lime" /></div><p className="text-[11px] text-navy/90 leading-relaxed font-medium">Starting early allows compounding to do the heavy lifting.</p></div>
              <div className="flex items-start gap-3"><div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><Wallet className="w-3 h-3 text-lime" /></div><p className="text-[11px] text-navy/90 leading-relaxed font-medium">Gradually shift to debt funds as the college age approaches.</p></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Suggested Allocation</h3>
            <div className="flex items-center justify-between">
              <div className="w-[100px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Equity', value: 70 },{ name: 'Debt', value: 20 },{ name: 'Hybrid', value: 10 }]} innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none">{PIE_COLORS.map((color, index) => (<Cell key={`cell-${index}`} fill={color} />))}</Pie></PieChart></ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><PieChartIcon className="w-4 h-4 text-navy" /></div>
              </div>
              <div className="flex-1 pl-4 space-y-2">
                <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[0] }}></div><span className="font-bold text-navy">Equity</span></div><span className="text-text-body font-medium">70%</span></div>
                <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[1] }}></div><span className="font-bold text-navy">Debt</span></div><span className="text-text-body font-medium">20%</span></div>
                <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[2] }}></div><span className="font-bold text-navy">Hybrid</span></div><span className="text-text-body font-medium">10%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CTA BANNER */}
      <div className="w-full bg-[#0F172A] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-4">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lime/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0"><Crown className="w-6 h-6 text-gold" fill="currentColor" /></div>
          <div className="text-left flex-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-heading leading-tight mb-1">Need Expert Guidance?</h2>
            <p className="text-white/60 text-[11px] max-w-sm leading-relaxed">Talk to our experts and create a personalised education plan.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-end sm:justify-start">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-6 py-2.5 text-sm font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap">Talk to an Expert<ArrowRight className="ml-2 w-4 h-4" /></Link>
          <button className="inline-flex items-center justify-center rounded-full border border-white/20 hover:border-white text-white px-6 py-2.5 text-sm font-bold transition-all whitespace-nowrap">Download Report<Download className="ml-2 w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
