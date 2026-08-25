"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  retCurrentAgeAtom, 
  retRetirementAgeAtom, 
  retMonthlyExpenseAtom,
  retCurrentSavingsAtom,
  retInflationRateAtom,
  retPreReturnRateAtom,
  retPostReturnRateAtom,
  retLifeExpectancyAtom
} from "@/store/calculator-store";
import { calculateRetirement, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { TrendingUp, Wallet, ShieldCheck, PieChart as PieChartIcon, ArrowRight, Download, Crown, LineChart, Target, PiggyBank, Briefcase, Info } from "lucide-react";
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
            <span className="text-text-body">{p.name === 'totalCorpus' ? 'Your Corpus' : 'Target Corpus'}</span>
            <span className="font-bold text-navy ml-auto">₹{(p.value / 100000).toFixed(2)}L</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useAtom(retCurrentAgeAtom);
  const [retirementAge, setRetirementAge] = useAtom(retRetirementAgeAtom);
  const [monthlyExpense, setMonthlyExpense] = useAtom(retMonthlyExpenseAtom);
  const [currentSavings, setCurrentSavings] = useAtom(retCurrentSavingsAtom);
  const [inflationRate, setInflationRate] = useAtom(retInflationRateAtom);
  const [preReturnRate, setPreReturnRate] = useAtom(retPreReturnRateAtom);
  const [postReturnRate, setPostReturnRate] = useAtom(retPostReturnRateAtom);
  const [lifeExpectancy, setLifeExpectancy] = useAtom(retLifeExpectancyAtom);

  let results: any = null;
  let calculationError: string | null = null;
  try {
    results = calculateRetirement(currentAge, retirementAge, monthlyExpense, currentSavings, preReturnRate, inflationRate, postReturnRate, lifeExpectancy);
  } catch (err: any) {
    calculationError = err.message;
  }
  const safeResults = results || {};

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "₹0";
    if (tickItem >= 10000000) return `₹${(tickItem / 10000000).toFixed(1)}Cr`;
    if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(0)}L`;
    return `₹${tickItem}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-4 lg:col-span-3 bg-white p-4 md:p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-4 md:gap-5">
          <div className="flex items-center gap-2 text-navy border-b border-gray-100 pb-4">
            <PiggyBank className="h-5 w-5 text-lime" />
            <h2 className="text-[15px] font-bold font-heading">Your Details</h2>
          </div>
          <p className="text-[11px] text-text-body -mt-3">Adjust sliders for real-time results</p>

          {/* Current Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Current Age</label>
              <div className="relative w-20">
                <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Math.min(Number(e.target.value), retirementAge - 1))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={18} max={60} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px] font-medium">yrs</span>
              </div>
            </div>
            <Slider value={[currentAge]} onValueChange={([val]) => setCurrentAge(Math.min(val, retirementAge - 1))} min={18} max={60} step={1} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>18</span><span>60</span></div>
          </div>

          {/* Retirement Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Retirement Age</label>
              <div className="relative w-20">
                <Input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Math.max(Number(e.target.value), currentAge + 1))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={30} max={80} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px] font-medium">yrs</span>
              </div>
            </div>
            <Slider value={[retirementAge]} onValueChange={([val]) => setRetirementAge(Math.max(val, currentAge + 1))} min={30} max={80} step={1} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>30</span><span>80</span></div>
          </div>

          {/* Monthly Expense */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Monthly Expense</label>
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-body text-[12px]">₹</span>
                <Input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} className="pl-5 pr-2 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={10000} />
              </div>
            </div>
            <Slider value={[monthlyExpense]} onValueChange={([val]) => setMonthlyExpense(val)} min={10000} max={500000} step={5000} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>₹10K</span><span>₹5L</span></div>
          </div>

          {/* Current Savings */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Current Savings</label>
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-body text-[12px]">₹</span>
                <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="pl-5 pr-2 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} />
              </div>
            </div>
            <Slider value={[currentSavings]} onValueChange={([val]) => setCurrentSavings(val)} min={0} max={50000000} step={100000} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>₹0</span><span>₹5Cr</span></div>
          </div>

          {/* Inflation Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Inflation Rate</label>
              <div className="relative w-20">
                <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} max={20} step={0.5} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">%</span>
              </div>
            </div>
            <Slider value={[inflationRate]} onValueChange={([val]) => setInflationRate(val)} min={0} max={20} step={0.5} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>0%</span><span>20%</span></div>
          </div>

          {/* Pre-Retirement Return */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Pre-Ret. Return</label>
              <div className="relative w-20">
                <Input type="number" value={preReturnRate} onChange={(e) => setPreReturnRate(Number(e.target.value))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} max={30} step={0.5} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">%</span>
              </div>
            </div>
            <Slider value={[preReturnRate]} onValueChange={([val]) => setPreReturnRate(val)} min={0} max={30} step={0.5} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>0%</span><span>30%</span></div>
          </div>

          {/* Advanced Settings (collapsed) */}
          <details className="group">
            <summary className="text-[11px] font-bold text-lime cursor-pointer flex items-center gap-1 select-none">
              <span className="group-open:rotate-90 transition-transform text-[10px]">▶</span>
              Advanced Settings
            </summary>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[12px] font-bold text-navy">Post-Ret. Return</label>
                <div className="relative w-20">
                  <Input type="number" value={postReturnRate} onChange={(e) => setPostReturnRate(Number(e.target.value))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={0} max={20} step={0.5} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">%</span>
                </div>
              </div>
              <Slider value={[postReturnRate]} onValueChange={([val]) => setPostReturnRate(val)} min={0} max={20} step={0.5} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
              <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>0%</span><span>20%</span></div>
            </div>
          </details>

          {/* Life Expectancy */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Life Expectancy</label>
              <div className="relative w-20">
                <Input type="number" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Math.max(Number(e.target.value), retirementAge + 1))} className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md" min={60} max={100} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px]">yrs</span>
              </div>
            </div>
            <Slider value={[lifeExpectancy]} onValueChange={([val]) => setLifeExpectancy(Math.max(val, retirementAge + 1))} min={60} max={100} step={1} className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200" />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70"><span>60</span><span>100</span></div>
          </div>
        </div>

        {calculationError ? (
          <div className="lg:col-span-8 lg:col-span-9 bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 bg-lime/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-lime text-2xl font-bold font-heading">?</span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2 font-heading">Waiting for valid input</h3>
            <p className="text-sm text-text-body max-w-[250px]">{calculationError}</p>
          </div>
        ) : (
          <React.Fragment>
{/* MIDDLE COLUMN: RESULTS & CHART */}
        <div className="lg:col-span-8 lg:col-span-6 bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-navy mb-1">
                <Target className="h-5 w-5 text-lime" />
                <h2 className="text-[15px] font-bold font-heading">Your Retirement Plan</h2>
              </div>
              <p className="text-[11px] text-text-body">Results update in real-time</p>
            </div>
            <div className="bg-lime/10 text-lime px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto">
              {results.yearsToRetirement} Yrs to Retire · {results.retirementDuration} Yrs in Retirement
            </div>
          </div>

          {/* 6 Stat Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <Wallet className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Future Monthly Exp.</span>
              </div>
              <div className="text-[14px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.futureMonthlyExpense)}>{formatCurrencyExact(results.futureMonthlyExpense)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-purple-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="text-[10px] font-bold text-purple-700 truncate">Target Corpus</span>
              </div>
              <div className="text-[14px] font-bold text-purple-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.corpusRequired)}>{formatCurrencyExact(results.corpusRequired)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <Briefcase className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Projected Savings</span>
              </div>
              <div className="text-[14px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.futureValueOfSavings)}>{formatCurrencyExact(results.futureValueOfSavings)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <LineChart className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Shortfall</span>
              </div>
              <div className="text-[14px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.additionalSavingsNeeded)}>{formatCurrencyExact(results.additionalSavingsNeeded)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-orange-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="text-[10px] font-bold text-orange-700 truncate">Required SIP</span>
              </div>
              <div className="text-[14px] font-bold text-orange-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={`${formatCurrencyExact(results.monthlySipRequired)}/mo`}>{formatCurrencyExact(results.monthlySipRequired)}/mo</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Retirement Span</span>
              </div>
              <div className="text-[14px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={`${results.retirementDuration} Years`}>{results.retirementDuration} Years</div>
            </div>
          </div>

          <div className="text-[13px] font-bold text-navy mb-4">Corpus Growth vs Target</div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-navy"></div><span className="text-[10px] font-medium text-text-body">Your Corpus</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-lime"></div><span className="text-[10px] font-medium text-text-body">Target Corpus</span></div>
          </div>

          <div className="h-[200px] sm:h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.yearlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="retColorTarget" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#84BD3C" stopOpacity={0.8}/><stop offset="95%" stopColor="#84BD3C" stopOpacity={0}/></linearGradient>
                  <linearGradient id="retColorCorpus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#180D45" stopOpacity={0.8}/><stop offset="95%" stopColor="#180D45" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="year" tickFormatter={(val) => val === 0 ? "0" : `${val}Y`} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} />
                <YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="totalCorpus" stroke="#180D45" strokeWidth={2} fillOpacity={1} fill="url(#retColorCorpus)" />
                <Area type="monotone" dataKey="targetCorpus" stroke="#84BD3C" strokeWidth={2} fillOpacity={1} fill="url(#retColorTarget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] text-text-body/60 mt-4">
            * Assumptions: {inflationRate}% inflation, {preReturnRate}% pre-retirement return, {postReturnRate}% post-retirement return, life expectancy {lifeExpectancy} years. SIP at beginning of month.
          </div>
        </div>

        {/* RIGHT COLUMN: INSIGHTS */}
        <div className="lg:col-span-12 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><Target className="w-3 h-3 text-lime" /></div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Save <strong>{formatCurrencyExact(results.monthlySipRequired)}</strong> monthly to build your retirement corpus.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><ShieldCheck className="w-3 h-3 text-lime" /></div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Your ₹{(monthlyExpense / 1000).toFixed(0)}K monthly expense will become <strong>{formatCurrencyExact(results.futureMonthlyExpense)}</strong> at retirement due to inflation.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><TrendingUp className="w-3 h-3 text-lime" /></div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Increasing savings now drastically reduces the required SIP amount.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5"><Wallet className="w-3 h-3 text-lime" /></div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Consult an expert to optimise your post-retirement withdrawal strategy.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Suggested Allocation</h3>
            <div className="flex items-center justify-between">
              <div className="w-[100px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={[{ name: 'Equity', value: 50 },{ name: 'Debt', value: 40 },{ name: 'Hybrid', value: 10 }]} innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none">{PIE_COLORS.map((color, index) => (<Cell key={`cell-${index}`} fill={color} />))}</Pie></PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><PieChartIcon className="w-4 h-4 text-navy" /></div>
              </div>
              <div className="flex-1 pl-4 space-y-2">
                <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[0] }}></div><span className="font-bold text-navy">Equity</span></div><span className="text-text-body font-medium">50%</span></div>
                <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[1] }}></div><span className="font-bold text-navy">Debt</span></div><span className="text-text-body font-medium">40%</span></div>
                <div className="flex items-center justify-between text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[2] }}></div><span className="font-bold text-navy">Hybrid</span></div><span className="text-text-body font-medium">10%</span></div>
              </div>
            </div>
          </div>
        </div>
      
          </React.Fragment>
        )}
</div>

      {/* BOTTOM CTA BANNER */}
      <div className="w-full bg-[#180D45] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-4">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lime/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0"><Crown className="w-6 h-6 text-gold" fill="currentColor" /></div>
          <div className="text-left flex-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-heading leading-tight mb-1">Need Expert Guidance?</h2>
            <p className="text-white/60 text-[11px] max-w-sm leading-relaxed">Talk to our experts and create a personalised retirement plan.</p>
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
