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
import { User, TrendingUp, Info, Wallet, Calculator, Coins, ShieldCheck, PieChart as PieChartIcon, ArrowRight, Download, Crown, LineChart, Home, Target, Briefcase } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

const PIE_COLORS = ['#1B0F4D', '#84BD3C', '#7C3AED', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-[11px]">
        <p className="font-bold text-navy mb-2">Year {label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-navy"></div>
          <span className="text-text-body">Remaining Balance</span>
          <span className="font-bold text-navy ml-auto">₹{(payload[1]?.value / 100000).toFixed(2)}L</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime"></div>
          <span className="text-text-body">Principal Paid</span>
          <span className="font-bold text-navy ml-auto">₹{(payload[0]?.value / 100000).toFixed(2)}L</span>
        </div>
      </div>
    );
  }
  return null;
};

export function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useAtom(emiLoanAmountAtom);
  const [interestRate, setInterestRate] = useAtom(emiInterestRateAtom);
  const [duration, setDuration] = useAtom(emiDurationAtom);

  let results: any = null;
  let calculationError: string | null = null;
  try {
    results = calculateEMI(loanAmount as number, interestRate as number, duration as number);
  } catch (err: any) {
    calculationError = err.message;
  }
  const safeResults = results || {};

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "₹0";
    if (tickItem >= 100000) return `₹${(tickItem / 100000).toFixed(0)}L`;
    return `₹${tickItem}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-3 bg-white p-4 md:p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-5 md:gap-6">
          <div className="flex items-center gap-2 text-navy border-b border-gray-100 pb-4">
            <Home className="h-5 w-5 text-lime" />
            <h2 className="text-[15px] font-bold font-heading">Loan Details</h2>
          </div>
          <p className="text-[11px] text-text-body -mt-4">Adjust the sliders to see real-time results</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Loan Amount</label>
              <div className="relative w-28">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-body text-[12px] font-medium">₹</span>
                <Input 
                  type="number" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="pl-5 pr-2 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={100000}
                />
              </div>
            </div>
            <Slider 
              value={[Number(loanAmount)]} 
              onValueChange={([val]) => setLoanAmount(val)} 
              min={100000} max={100000000} step={100000}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>₹1 Lakh</span>
              <span>₹10 Cr</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Interest Rate (p.a.)</label>
              <div className="relative w-20">
                <Input 
                  type="number" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={5} max={20} step={0.1}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px] font-medium">%</span>
              </div>
            </div>
            <Slider 
              value={[Number(interestRate)]} 
              onValueChange={([val]) => setInterestRate(val)} 
              min={5} max={20} step={0.1}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-bold text-navy">Loan Tenure</label>
              <div className="relative w-20">
                <Input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                  className="pr-6 h-8 text-right font-bold text-[13px] text-navy rounded-md"
                  min={1} max={40}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-text-body text-[11px] font-medium">yrs</span>
              </div>
            </div>
            <Slider 
              value={[Number(duration)]} 
              onValueChange={([val]) => setDuration(val)} 
              min={1} max={40} step={1}
              className="[&>.relative>.absolute]:bg-navy [&>.relative]:bg-gray-200"
            />
            <div className="flex justify-between text-[10px] font-medium text-text-body/70">
              <span>1 yr</span>
              <span>40 yrs</span>
            </div>
          </div>
        </div>

        {calculationError ? (
          <div className="lg:col-span-9 bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 bg-lime/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-lime text-2xl font-bold font-heading">?</span>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2 font-heading">Waiting for valid input</h3>
            <p className="text-sm text-text-body max-w-[250px]">{calculationError}</p>
          </div>
        ) : (
          <React.Fragment>
{/* MIDDLE COLUMN: RESULTS & CHART */}
        <div className="lg:col-span-6 bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-navy mb-1">
                <PieChartIcon className="h-5 w-5 text-lime" />
                <h2 className="text-[15px] font-bold font-heading">Loan Summary</h2>
              </div>
              <p className="text-[11px] text-text-body">Results update in real-time based on your inputs</p>
            </div>
            <div className="bg-lime/10 text-lime px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto">
              {duration} Years Total
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="border border-gray-100 p-3 rounded-xl bg-orange-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <Target className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="text-[10px] font-bold text-orange-700 truncate">Monthly EMI</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-orange-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.monthlyEMI)}>{formatCurrencyExact(results.monthlyEMI)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <Wallet className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Principal Amount</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.principal)}>{formatCurrencyExact(results.principal)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="w-3 h-3 text-lime shrink-0" />
                <span className="text-[10px] font-bold text-text-body truncate">Total Interest</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-navy overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.totalInterest)}>{formatCurrencyExact(results.totalInterest)}</div>
            </div>
            <div className="border border-gray-100 p-3 rounded-xl bg-purple-50/50 min-w-0">
              <div className="flex items-center gap-1 mb-2">
                <ShieldCheck className="w-3 h-3 text-purple-500 shrink-0" />
                <span className="text-[10px] font-bold text-purple-700 truncate">Total Payment</span>
              </div>
              <div className="text-[14px] md:text-[16px] font-bold text-purple-900 overflow-x-auto whitespace-nowrap hide-scrollbar" title={formatCurrencyExact(results.totalPayment)}>{formatCurrencyExact(results.totalPayment)}</div>
            </div>
          </div>

          <div className="text-[13px] font-bold text-navy mb-4">Loan Amortization Over Time</div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-lime"></div>
              <span className="text-[10px] font-medium text-text-body">Principal Paid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-navy"></div>
              <span className="text-[10px] font-medium text-text-body">Remaining Balance</span>
            </div>
          </div>

          <div className="h-[200px] sm:h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.yearlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrincipalPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84BD3C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#84BD3C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#180D45" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#180D45" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="balance" stroke="#180D45" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                <Area type="monotone" dataKey="principalPaid" stroke="#84BD3C" strokeWidth={2} fillOpacity={1} fill="url(#colorPrincipalPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] text-text-body/60 mt-4">* These calculations are illustrative estimates based on the inputs and assumptions provided. They are not a guarantee of future returns or outcomes.</div>

        </div>

        {/* RIGHT COLUMN: INSIGHTS */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Key Insights</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">You will pay an extra <strong>{((results.totalInterest / results.principal) * 100).toFixed(1)}%</strong> in interest over the life of the loan.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Consider making extra principal payments to shorten tenure.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Interest portions are heavily front-loaded in the early years.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-lime/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Wallet className="w-3 h-3 text-lime" />
                </div>
                <p className="text-[11px] text-navy/90 leading-relaxed font-medium">Make sure your EMI does not exceed 40% of your net income.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[14px] font-bold text-navy font-heading mb-4 pb-3 border-b border-gray-100">Payment Breakdown</h3>
            
            <div className="flex items-center justify-between">
              <div className="w-[100px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Principal', value: results.principal },
                        { name: 'Interest', value: results.totalInterest },
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
                    <span className="font-bold text-navy">Principal</span>
                  </div>
                  <span className="text-text-body font-medium">{((results.principal / results.totalPayment) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[1] }}></div>
                    <span className="font-bold text-navy">Interest</span>
                  </div>
                  <span className="text-text-body font-medium">{((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      
          </React.Fragment>
        )}
</div>

      {/* BOTTOM CTA BANNER */}
      <div className="w-full max-w-5xl mx-auto bg-[#180D45] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-4">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lime/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-gold" fill="currentColor" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-heading leading-tight mb-1">
              Need Assistance?
            </h2>
            <p className="text-white/60 text-[11px] max-w-sm leading-relaxed">
              Talk to our experts and explore available loan options.
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
          
        </div>
      </div>

    </div>
  );
}
