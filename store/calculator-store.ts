import { atom } from "jotai";

// SIP State
export const sipMonthlyInvestmentAtom = atom<number | "">(5000);
export const sipReturnRateAtom = atom<number | "">(12);
export const sipDurationAtom = atom<number | "">(10);
export const sipStepUpAtom = atom<number | "">(0);

// Lumpsum State
export const lumpsumInvestmentAtom = atom<number | "">(100000);
export const lumpsumReturnRateAtom = atom<number | "">(12);
export const lumpsumDurationAtom = atom<number | "">(10);

// Step-Up SIP State
export const stepUpInitialInvestmentAtom = atom<number | "">(5000);
export const stepUpReturnRateAtom = atom<number | "">(12);
export const stepUpDurationAtom = atom<number | "">(15);
export const stepUpAnnualIncrementAtom = atom<number | "">(10);

// EMI State
export const emiLoanAmountAtom = atom<number | "">(3000000);
export const emiInterestRateAtom = atom<number | "">(8.5);
export const emiDurationAtom = atom<number | "">(20);

// SWP State
export const swpTotalInvestmentAtom = atom<number | "">(5000000);
export const swpMonthlyWithdrawalAtom = atom<number | "">(40000);
export const swpReturnRateAtom = atom<number | "">(10);
export const swpDurationAtom = atom<number | "">(20);

// Retirement State
export const retCurrentAgeAtom = atom<number | "">(30);
export const retRetirementAgeAtom = atom<number | "">(60);
export const retMonthlyExpenseAtom = atom<number | "">(50000);
export const retCurrentSavingsAtom = atom<number | "">(500000);
export const retInflationRateAtom = atom<number | "">(6);
export const retPreReturnRateAtom = atom<number | "">(12);
export const retPostReturnRateAtom = atom<number | "">(7);
export const retLifeExpectancyAtom = atom<number | "">(85);

// Education State
export const eduCurrentAgeAtom = atom<number | "">(5);
export const eduCollegeAgeAtom = atom<number | "">(18);
export const eduCurrentCostAtom = atom<number | "">(1500000);
export const eduCurrentSavingsAtom = atom<number | "">(200000);
export const eduInflationRateAtom = atom<number | "">(8);
export const eduReturnRateAtom = atom<number | "">(12);

// Annual SIP State
export const annualSipInvestmentAtom = atom<number | "">(50000);
export const annualSipReturnRateAtom = atom<number | "">(12);
export const annualSipDurationAtom = atom<number | "">(10);

// Target Amount SIP State
export const targetSipAmountAtom = atom<number | "">(10000000);
export const targetSipDurationAtom = atom<number | "">(10);
export const targetSipInflationAtom = atom<number | "">(6);
export const targetSipReturnRateAtom = atom<number | "">(12);

// Lumpsum Target State
export const lumpsumTargetAmountAtom = atom<number | "">(10000000);
export const lumpsumTargetDurationAtom = atom<number | "">(10);
export const lumpsumTargetReturnRateAtom = atom<number | "">(12);
