import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { LumpsumCalculator } from "@/components/calculators/LumpsumCalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { EducationCalculator } from "@/components/calculators/EducationCalculator";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { StepUpSipCalculator } from "@/components/calculators/StepUpSipCalculator";
import { SwpCalculator } from "@/components/calculators/SwpCalculator";
import { Calculator, CheckCircle2, ShieldCheck, LineChart, TrendingUp, Users, GraduationCap, Coins, Wallet, Landmark, PiggyBank } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goal Calculators | Wealthy Step",
  description: "Calculate your SIP, Retirement, EMI, and more with our interactive financial tools.",
};

export default function GoalCalculatorsPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pb-20">
      
      {/* Header Section */}
      <section className="bg-white pt-12 md:pt-16 pb-8 md:pb-12 shadow-sm relative z-20">
        <div className="container mx-auto max-w-[1300px] px-4 xl:px-0 text-center">
          
          <div className="w-12 h-12 bg-lime/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-6 h-6 text-lime" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-navy font-heading leading-tight mb-4 tracking-tight">
            Goal Calculators
          </h1>
          <p className="text-text-body text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Plan your investments, estimate returns and achieve your financial goals with confidence.
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
                <div className="text-sm font-bold text-navy leading-tight">100% Accurate</div>
                <div className="text-[11px] text-text-body">Advanced calculations you can trust</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center shrink-0">
                <LineChart className="w-4 h-4 text-lime" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-navy leading-tight">Smart Planning</div>
                <div className="text-[11px] text-text-body">Make data-driven financial decisions</div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Tabs and Calculators */}
      <section className="pt-8">
        <div className="container mx-auto max-w-[1300px] px-4 xl:px-0">
          <Tabs defaultValue="sip" className="w-full flex flex-col">
            
            <div className="w-full overflow-x-auto pb-4 mb-6 hide-scrollbar px-1">
              <TabsList className="bg-transparent h-auto p-0 inline-flex gap-2 w-max min-w-full lg:justify-center">
                <TabsTrigger 
                  value="sip"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm data-[state=active]:shadow-md transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <TrendingUp className="w-4 h-4 text-lime" />
                  SIP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="lumpsum"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm data-[state=active]:shadow-md transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Landmark className="w-4 h-4" />
                  Lumpsum Calculator
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
                  value="step-up"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <LineChart className="w-4 h-4" />
                  Step-Up SIP Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="swp"
                  className="data-[state=active]:bg-navy data-[state=active]:text-white bg-white text-navy border border-gray-200 px-6 py-3 rounded-[12px] font-bold text-[13px] shadow-sm transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Wallet className="w-4 h-4" />
                  SWP Calculator
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="w-full mt-2">
              <TabsContent value="sip" className="mt-0">
                <SipCalculator />
              </TabsContent>
              <TabsContent value="lumpsum" className="mt-0">
                <LumpsumCalculator />
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
              <TabsContent value="step-up" className="mt-0">
                <StepUpSipCalculator />
              </TabsContent>
              <TabsContent value="swp" className="mt-0">
                <SwpCalculator />
              </TabsContent>
            </div>

          </Tabs>
        </div>
      </section>

    </main>
  );
}
