import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';
import { 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  LineChart, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Coins, 
  Wallet, 
  Landmark, 
  PiggyBank 
} from "lucide-react";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

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

export const metadata = constructMetadata(ROUTES_SEO.goalCalculators);

const CALCULATORS = [
  { id: "sip", name: "SIP Calculator", icon: TrendingUp },
  { id: "step-up", name: "Step-Up SIP", icon: LineChart },
  { id: "lumpsum", name: "Lumpsum", icon: Landmark },
  { id: "swp", name: "SWP Calculator", icon: Wallet },
  { id: "retirement", name: "Retirement", icon: Users },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "target-sip", name: "Target SIP", icon: PiggyBank },
  { id: "lumpsum-target", name: "Lumpsum Target", icon: Landmark },
  { id: "annual-sip", name: "Annual SIP", icon: TrendingUp },
  { id: "emi", name: "EMI Calculator", icon: Coins },
];

export default function GoalCalculatorsPage() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen pb-10">
      
      {/* ── Compact, High-Impact Header Strip (Zero Wasted Space) ── */}
      <section className="bg-white border-b border-gray-200/80 pt-3 pb-3 px-4 shadow-2xs relative z-20">
        <div className="container mx-auto max-w-[1340px] px-0 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Left: Compact Title, Icon & Description */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#180D45] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calculator className="w-5 h-5 text-[#84BD3C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-navy font-heading tracking-tight leading-none">
                  Goal Calculators
                </h1>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  AMFI Aligned
                </span>
              </div>
              <p className="text-xs text-text-body font-normal mt-0.5 line-clamp-1">
                Explore mutual fund growth scenarios, compound interest projections, and goal estimates.
              </p>
            </div>
          </div>

          {/* Right: Sleek Micro-Trust Pills in a Single Clean Strip */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant Output</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-[11px]">
              <LineChart className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Dynamic Visualizer</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Hypothetical Projections</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Tabs & Interactive Calculator Engine ── */}
      <section className="pt-3 sm:pt-4">
        <div className="container mx-auto max-w-[1340px] px-3.5 sm:px-4">
          <Tabs defaultValue="sip" className="w-full flex flex-col">
            
            {/* Structured, Modern Horizontal Tab Pill Selector */}
            <div className="w-full mb-3 overflow-x-auto hide-scrollbar pb-1">
              <TabsList className="bg-white p-1 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-nowrap md:flex-wrap items-center gap-1 w-max md:w-full justify-start md:justify-center h-auto">
                {CALCULATORS.map((calc) => {
                  const IconComponent = calc.icon;
                  return (
                    <TabsTrigger 
                      key={calc.id}
                      value={calc.id}
                      className="data-[state=active]:bg-[#180D45] data-[state=active]:text-white text-gray-700 hover:text-navy hover:bg-gray-50 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer shadow-none data-[state=active]:shadow-xs"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-[#84BD3C] shrink-0" />
                      <span>{calc.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Calculators Content (Starts Immediately Above The Fold) */}
            <div className="w-full">
              <TabsContent value="sip" className="mt-0 focus-visible:outline-hidden">
                <SipCalculator />
              </TabsContent>
              <TabsContent value="step-up" className="mt-0 focus-visible:outline-hidden">
                <StepUpSipCalculator />
              </TabsContent>
              <TabsContent value="lumpsum" className="mt-0 focus-visible:outline-hidden">
                <LumpsumCalculator />
              </TabsContent>
              <TabsContent value="swp" className="mt-0 focus-visible:outline-hidden">
                <SwpCalculator />
              </TabsContent>
              <TabsContent value="retirement" className="mt-0 focus-visible:outline-hidden">
                <RetirementCalculator />
              </TabsContent>
              <TabsContent value="education" className="mt-0 focus-visible:outline-hidden">
                <EducationCalculator />
              </TabsContent>
              <TabsContent value="emi" className="mt-0 focus-visible:outline-hidden">
                <EmiCalculator />
              </TabsContent>
              <TabsContent value="annual-sip" className="mt-0 focus-visible:outline-hidden">
                <AnnualSipCalculator />
              </TabsContent>
              <TabsContent value="target-sip" className="mt-0 focus-visible:outline-hidden">
                <TargetAmountSipCalculator />
              </TabsContent>
              <TabsContent value="lumpsum-target" className="mt-0 focus-visible:outline-hidden">
                <LumpsumTargetCalculator />
              </TabsContent>
            </div>

          </Tabs>

          {/* Statutory Calculator Disclaimer */}
          <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200/80 text-center max-w-4xl mx-auto shadow-2xs">
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              <strong className="text-navy">Regulatory Notice:</strong> Calculator illustrations are provided for informational and financial scenario planning only, assuming a hypothetical constant rate of return. Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance may or may not be sustained in the future and does not guarantee future results.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
