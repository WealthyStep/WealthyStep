import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

const SipCalculator = dynamic(() => import('@/components/calculators/SipCalculator').then(mod => mod.SipCalculator));
const LumpsumCalculator = dynamic(() => import('@/components/calculators/LumpsumCalculator').then(mod => mod.LumpsumCalculator));
const RetirementCalculator = dynamic(() => import('@/components/calculators/RetirementCalculator').then(mod => mod.RetirementCalculator));
const EducationCalculator = dynamic(() => import('@/components/calculators/EducationCalculator').then(mod => mod.EducationCalculator));
const EmiCalculator = dynamic(() => import('@/components/calculators/EmiCalculator').then(mod => mod.EmiCalculator));
const StepUpSipCalculator = dynamic(() => import('@/components/calculators/StepUpSipCalculator').then(mod => mod.StepUpSipCalculator));
const SwpCalculator = dynamic(() => import('@/components/calculators/SwpCalculator').then(mod => mod.SwpCalculator));
const AnnualSipCalculator = dynamic(() => import('@/components/calculators/AnnualSipCalculator').then(mod => mod.AnnualSipCalculator));
const TargetAmountSipCalculator = dynamic(() => import('@/components/calculators/TargetAmountSipCalculator').then(mod => mod.TargetAmountSipCalculator));
const LumpsumTargetCalculator = dynamic(() => import('@/components/calculators/LumpsumTargetCalculator').then(mod => mod.LumpsumTargetCalculator));
import { Calculator, CheckCircle2, ShieldCheck, LineChart, TrendingUp, Users, GraduationCap, Coins, Wallet, Landmark, PiggyBank } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Goal Calculators | Wealthy Step",
  description: "Use our educational SIP, Lumpsum, and retirement calculators to explore illustrative mutual fund projections.",
  alternates: {
    canonical: '/goal-calculators'
  },
  openGraph: {
    title: "Investment Goal Calculators | Wealthy Step",
    description: "Use our educational SIP, Lumpsum, and retirement calculators to explore illustrative mutual fund projections.",
    url: '/goal-calculators',
    type: "website",
  },
};

export default function GoalCalculatorsPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pb-10">
      
      {/* Header Section */}
      <section className="bg-white pt-6 md:pt-8 pb-6 md:pb-8 shadow-sm relative z-20">
        <div className="container mx-auto max-w-[1300px] px-4 xl:px-0 text-center">
          
          <div className="w-12 h-12 bg-lime/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-6 h-6 text-lime" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-navy font-heading leading-tight mb-4 tracking-tight">
            Goal Calculators
          </h1>
          <p className="text-text-body text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Explore mutual fund scenarios and project possible outcomes based on your assumptions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-lime" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-navy leading-tight">Real-time Results</div>
                <div className="text-[11px] text-text-body">See results as you change inputs</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-lime" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-navy leading-tight">Real-Time Estimates</div>
                <div className="text-[11px] text-text-body">Projections based on assumed rates</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center shrink-0">
                <LineChart className="w-4 h-4 text-lime" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-navy leading-tight">Smart Investing</div>
                <div className="text-[11px] text-text-body">Make data-driven financial decisions</div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Tabs and Calculators */}
      <section className="pt-4">
        <div className="container mx-auto max-w-[1300px] px-4 xl:px-0">
          <Tabs defaultValue="sip" className="w-full flex flex-col">
            
            <div className="w-full mb-2 px-1 overflow-x-auto hide-scrollbar">
              <TabsList className="bg-transparent h-auto p-0 flex flex-row flex-nowrap sm:flex-wrap gap-2 w-max sm:w-full justify-start sm:justify-center">
                <TabsTrigger 
                  value="sip"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm data-[state=active]:shadow-md transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <TrendingUp className="w-4 h-4 text-lime" />
                  SIP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="step-up"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <LineChart className="w-4 h-4" />
                  Step-Up SIP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="lumpsum"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm data-[state=active]:shadow-md transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Landmark className="w-4 h-4" />
                  Lumpsum Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="swp"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Wallet className="w-4 h-4" />
                  SWP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="retirement"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Users className="w-4 h-4" />
                  Retirement Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="education"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <GraduationCap className="w-4 h-4" />
                  Education Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="emi"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Coins className="w-4 h-4" />
                  EMI Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="annual-sip"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <TrendingUp className="w-4 h-4" />
                  Annual SIP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="target-sip"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <PiggyBank className="w-4 h-4" />
                  Target SIP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="lumpsum-target"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Landmark className="w-4 h-4" />
                  Lumpsum Target Calculator
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="w-full mt-2">
              <TabsContent value="sip" className="mt-0">
                <SipCalculator />
              </TabsContent>
              <TabsContent value="step-up" className="mt-0">
                <StepUpSipCalculator />
              </TabsContent>
              <TabsContent value="lumpsum" className="mt-0">
                <LumpsumCalculator />
              </TabsContent>
              <TabsContent value="swp" className="mt-0">
                <SwpCalculator />
              </TabsContent>
              <TabsContent value="retirement" className="mt-0">
                <RetirementCalculator />
              </TabsContent>
              <TabsContent value="education" className="mt-0">
                <EducationCalculator />
              </TabsContent>
              <TabsContent value="emi" className="mt-0">
                <EmiCalculator />
              </TabsContent>
              <TabsContent value="annual-sip" className="mt-0">
                <AnnualSipCalculator />
              </TabsContent>
              <TabsContent value="target-sip" className="mt-0">
                <TargetAmountSipCalculator />
              </TabsContent>
              <TabsContent value="lumpsum-target" className="mt-0">
                <LumpsumTargetCalculator />
              </TabsContent>
            </div>

          </Tabs>
        </div>
      </section>

    </main>
  );
}
