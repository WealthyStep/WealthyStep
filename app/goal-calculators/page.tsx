import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InnerHero } from "@/components/sections/InnerHero";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { EducationCalculator } from "@/components/calculators/EducationCalculator";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { StepUpSipCalculator } from "@/components/calculators/StepUpSipCalculator";
import { SwpCalculator } from "@/components/calculators/SwpCalculator";
import { Calculator } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goal Calculators | Wealthy Step",
  description: "Calculate your SIP, Retirement, EMI, and more with our interactive financial tools.",
};

export default function GoalCalculatorsPage() {
  return (
    <>
      <InnerHero
        title="Financial Calculators"
        subtitle="Plan Your Future"
        description="Take the guesswork out of your financial planning. Use our interactive tools to chart your path to wealth."
        icon={Calculator}
        bgImage="/11.jpg"
      />

      <section className="section-white py-16">
        <div className="container mx-auto max-w-[1000px] px-4 xl:px-0">
          <Tabs defaultValue="sip" className="w-full flex flex-col items-center">
            
            <div className="w-full overflow-x-auto pb-4 mb-8 flex justify-center">
              <TabsList>
                <TabsTrigger value="sip">SIP</TabsTrigger>
                <TabsTrigger value="retirement">Retirement</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="emi">EMI</TabsTrigger>
                <TabsTrigger value="step-up">Step-Up SIP</TabsTrigger>
                <TabsTrigger value="swp">SWP</TabsTrigger>
              </TabsList>
            </div>

            <div className="w-full">
              <TabsContent value="sip">
                <SipCalculator />
              </TabsContent>
              <TabsContent value="retirement">
                <RetirementCalculator />
              </TabsContent>
              <TabsContent value="education">
                <EducationCalculator />
              </TabsContent>
              <TabsContent value="emi">
                <EmiCalculator />
              </TabsContent>
              <TabsContent value="step-up">
                <StepUpSipCalculator />
              </TabsContent>
              <TabsContent value="swp">
                <SwpCalculator />
              </TabsContent>
            </div>

          </Tabs>
        </div>
      </section>
    </>
  );
}
