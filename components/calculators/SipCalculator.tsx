"use client";

import React from "react";
import { useAtom } from "jotai";
import { 
  sipMonthlyInvestmentAtom, 
  sipReturnRateAtom, 
  sipDurationAtom
} from "@/store/calculator-store";
import { calculateSIP, formatCurrencyExact } from "@/lib/finance-math";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { User, TrendingUp, Wallet, Calculator, Coins, ShieldCheck, PieChart as PieChartIcon, ArrowRight, Download, Crown, LineChart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

const PIE_COLORS = ['#1B0F4D', '#84BD3C', '#7C3AED', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-[11px]">
        <p className="font-bold text-navy mb-2">{label} Years</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-navy"></div>
          <span className="text-text-body">Estimated Returns</span>
          <span className="font-bold text-navy ml-auto">₹{(payload[1]?.value / 100000).toFixed(2)}L</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime"></div>
          <span className="text-text-body">Invested Amount</span>
          <span className="font-bold text-navy ml-auto">₹{(payload[0]?.value / 100000).toFixed(2)}L</span>
        </div>
      </div>
    );
  }
  return null;
};

export function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useAtom(sipMonthlyInvestmentAtom);
  const [returnRate, setReturnRate] = useAtom(sipReturnRateAtom);
  const [duration, setDuration] = useAtom(sipDurationAtom);

  let results: any = null;
  let calculationError: string | null = null;
  try {
    results = calculateSIP(monthlyInvestment, returnRate, duration);
  } catch (err: any) {
    calculationError = err.message;
  }
  const safeResults = results || {};
  const wealthGainPercent = safeResults.wealthGainPercent;

  // Formatting Y-axis for chart
  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "₹0";
    if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(0)}L`;
    return `₹${tickItem}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-4 lg:col-span-3 bg-white p-4 md:p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-5 md:gap-6">
          <div className="flex items-center gap-2 text-navy border-b border-gray-100 pb-4">
            <User className="h-5 w-5 text-lime" />
            <h2 className="text-[15px] font-bold font-heading">Your Investment Details</h2>
          </div>
          <p className="text-[11px] text-text-body -mt-4">Adjust the sliders to see real-time results</p>

          {/* Monthly Investment */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Monthly Investment</label>
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-body text-[12px] font-medium">₹</span>
                <Input 
                  type="number" 
                  value={monthlyInvestment} 
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="pl-5 pr-2 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={500}
                />
              </div>
            </div>
            <Slider 
              value={[monthlyInvestment]} 
              onValueChange={([val]) => setMonthlyInvestment(val)} 
              min={500} 
              max={100000} 
              step={500}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>₹500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Expected Return Rate (p.a.)</label>
              <div className="relative w-20">
                <Input 
                  type="number" 
                  value={returnRate} 
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={1} max={30}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[12px] font-medium">%</span>
              </div>
            </div>
            <Slider 
              value={[returnRate]} 
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

          {/* Investment Duration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Investment Duration</label>
              <div className="relative w-24">
                <Input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="pr-10 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={1} max={40}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px] font-medium">Years</span>
              </div>
            </div>
            <Slider 
              value={[duration]} 
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
                <PieChartIcon className="h-5 w-5 text-lime" />
                <h2 className="text-[15px] font-bold font-heading">Your Potential Returns</h2>
              </div>
              <p className="text-[11px] text-text-body">Results update in real-time based on your inputs</p>
            </div>
            <div className="bg-lime/10 text-lime px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto">
              Projected in {duration} Years
            </div>
          </div>

          {/* 4 Stat Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <Wallet className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Total Investment</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.totalInvestment)}>{formatCurrencyExact(results.totalInvestment)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <Calculator className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Estimated Returns</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.estimatedReturns)}>{formatCurrencyExact(results.estimatedReturns)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-purple-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <ShieldCheck className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="text-[10px] font-bold text-purple-700 truncate">Maturity Value</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-purple-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.maturityValue)}>{formatCurrencyExact(results.maturityValue)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-orange-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <Coins className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="text-[10px] font-bold text-orange-700 truncate">Wealth Gain</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-orange-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={`${wealthGainPercent}%`}>{wealthGainPercent}%</div>
            </div>
          </div>

          <div className="text-[13px] font-bold text-navy mb-4">Investment Growth Over Time</div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-navy"></div>
              <span className="text-[10px] font-medium text-text-body">Invested Amount</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-lime"></div>
              <span className="text-[10px] font-medium text-text-body">Estimated Returns</span>
            </div>
          </div>

          <div className="h-[200px] sm:h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.yearlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#180D45" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#180D45" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84BD3C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#84BD3C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="year" 
                  tickFormatter={(val) => val === 0 ? "0" : `${val}Y`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#888' }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatYAxis} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* We render Returns first (which is Maturity Value = Invested + Returns) so it's taller, 
                    then Invested on top so it shows properly in an overlapping area chart */}
                <Area type="monotone" dataKey="maturityValue" stroke="#180D45" strokeWidth={2} fillOpacity={1} fill="url(#colorReturns)" />
                <Area type="monotone" dataKey="investedAmount" stroke="#84BD3C" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] text-text-body/60 mt-4">* SIP assumed at the beginning of every month. Values are estimated and for illustration purpose only.</div>

        </div>

        {/* RIGHT COLUMN: INSIGHTS */}
        <div className="lg:col-span-12 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Key Insights</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Your money can grow <strong>{(results.maturityValue / results.totalInvestment).toFixed(2)}x</strong> in {duration} years</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <LineChart className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Starting early gives you the power of compounding</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Increase your SIP amount annually to beat inflation</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Stay invested for long-term wealth creation</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Suggested Allocation</h3>
            
            <div className="flex items-center justify-between">
              <div className="w-[100px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Equity', value: 65 },
                        { name: 'Debt', value: 20 },
                        { name: 'Hybrid', value: 10 },
                        { name: 'Others', value: 5 },
                      ]}
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {PIE_COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PieChartIcon className="w-4 h-4 text-navy" />
                </div>
              </div>

              <div className="flex-1 pl-4 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[0] }}></div>
                    <span className="font-bold text-navy">Equity Funds</span>
                  </div>
                  <span className="text-text-body font-medium">65%</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[1] }}></div>
                    <span className="font-bold text-navy">Debt Funds</span>
                  </div>
                  <span className="text-text-body font-medium">20%</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[2] }}></div>
                    <span className="font-bold text-navy">Hybrid Funds</span>
                  </div>
                  <span className="text-text-body font-medium">10%</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[3] }}></div>
                    <span className="font-bold text-navy">Others</span>
                  </div>
                  <span className="text-text-body font-medium">5%</span>
                </div>
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
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-gold" fill="currentColor" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-heading leading-tight mb-1">
              Need Expert Guidance?
            </h2>
            <p className="text-white/60 text-[11px] max-w-sm leading-relaxed">
              Talk to our experts and create a personalised plan tailored to your financial goals.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-end sm:justify-start">
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-lime hover:bg-cta-green text-white px-6 py-2.5 text-sm font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Talk to an Expert
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-full border border-white/20 hover:border-white text-white px-6 py-2.5 text-sm font-bold transition-all whitespace-nowrap"
          >
            Download Report
            <Download className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
