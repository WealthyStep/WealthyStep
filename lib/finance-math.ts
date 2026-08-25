// ============================================================================
// FINANCIAL CALCULATION ENGINE
// All formulas use full floating-point precision during computation.
// Only final returned values are rounded via Math.round().
// All money inputs are raw numbers (never formatted strings).
// ============================================================================

// --- Shared Types ---

export interface YearlyDataPoint {
  year: number;
  [key: string]: number;
}

// --- Formatting Utilities ---

/**
 * Format a number as Indian Rupee currency (full exact value).
 * Example: 1161695 → "₹11,61,695"
 */
export function formatCurrencyExact(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as shorthand Indian Rupee.
 * Example: 11400000 → "₹1.14 Cr", 543900 → "₹5.44 Lakhs"
 */
export function formatCurrency(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "₹0";
  if (Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakhs`;
  }
  return formatCurrencyExact(value);
}

// --- Validation Helpers ---

function safePositive(val: number, fallback: number = 0): number {
  if (!isFinite(val) || isNaN(val) || val < 0) return fallback;
  return val;
}

function safeRate(val: number): number {
  if (!isFinite(val) || isNaN(val) || val < 0) return 0;
  return val;
}

// ============================================================================
// 1. SIP CALCULATOR
// Formula: M = P × [((1+r)^n - 1) / r] × (1+r)   (beginning-of-month)
// ============================================================================

export interface SIPResult {
  totalInvestment: number;
  estimatedReturns: number;
  maturityValue: number;
  wealthGainPercent: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateSIP(
  monthlyInvestment: number,
  annualReturnRate: number,
  years: number,
  stepUpPercent: number = 0
): SIPResult {
  const P = safePositive(monthlyInvestment, 500);
  const rate = safeRate(annualReturnRate);
  const Y = Math.max(1, Math.round(safePositive(years, 1)));
  const stepUp = safeRate(stepUpPercent);

  const r = rate / 100 / 12; // monthly rate
  let totalInvestment = 0;
  let balance = 0;
  let currentMonthly = P;

  const yearlyData: YearlyDataPoint[] = [
    { year: 0, investedAmount: 0, maturityValue: 0 },
  ];

  for (let year = 1; year <= Y; year++) {
    for (let month = 1; month <= 12; month++) {
      // Beginning-of-month: contribution is added first, then grows
      if (r === 0) {
        balance += currentMonthly;
      } else {
        balance = (balance + currentMonthly) * (1 + r);
      }
      totalInvestment += currentMonthly;
    }

    yearlyData.push({
      year,
      investedAmount: Math.round(totalInvestment),
      maturityValue: Math.round(balance),
    });

    // Step up for next year
    if (stepUp > 0) {
      currentMonthly = currentMonthly * (1 + stepUp / 100);
    }
  }

  const maturityValue = Math.round(balance);
  const estimatedReturns = maturityValue - Math.round(totalInvestment);
  const wealthGainPercent =
    totalInvestment > 0
      ? parseFloat((((balance - totalInvestment) / totalInvestment) * 100).toFixed(1))
      : 0;

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns,
    maturityValue,
    wealthGainPercent,
    yearlyData,
  };
}

// ============================================================================
// 2. LUMPSUM CALCULATOR
// Formula: M = P × (1 + r)^t
// ============================================================================

export interface LumpsumResult {
  initialInvestment: number;
  estimatedReturns: number;
  maturityValue: number;
  growthPercent: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateLumpsum(
  initialInvestment: number,
  annualReturnRate: number,
  years: number
): LumpsumResult {
  const P = safePositive(initialInvestment, 1000);
  const rate = safeRate(annualReturnRate);
  const Y = Math.max(1, Math.round(safePositive(years, 1)));

  const r = rate / 100;
  const yearlyData: YearlyDataPoint[] = [
    { year: 0, investedAmount: Math.round(P), maturityValue: Math.round(P) },
  ];

  let maturityValue = P;
  for (let year = 1; year <= Y; year++) {
    maturityValue = maturityValue * (1 + r);
    yearlyData.push({
      year,
      investedAmount: Math.round(P),
      maturityValue: Math.round(maturityValue),
    });
  }

  const estimatedReturns = maturityValue - P;
  const growthPercent =
    P > 0 ? parseFloat(((estimatedReturns / P) * 100).toFixed(1)) : 0;

  return {
    initialInvestment: Math.round(P),
    estimatedReturns: Math.round(estimatedReturns),
    maturityValue: Math.round(maturityValue),
    growthPercent,
    yearlyData,
  };
}

// ============================================================================
// 3. RETIREMENT CALCULATOR
// Uses PV of inflation-adjusted annuity for corpus calculation
// ============================================================================

export interface RetirementResult {
  yearsToRetirement: number;
  retirementDuration: number;
  futureMonthlyExpense: number;
  corpusRequired: number;
  futureValueOfSavings: number;
  additionalSavingsNeeded: number;
  monthlySipRequired: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  currentMonthlyExpense: number,
  currentSavings: number,
  preRetirementReturn: number = 12,
  inflationRate: number = 6,
  postRetirementReturn: number = 7,
  lifeExpectancy: number = 85
): RetirementResult {
  const age = Math.max(18, Math.round(safePositive(currentAge, 30)));
  const retAge = Math.max(age + 1, Math.round(safePositive(retirementAge, 60)));
  const expense = safePositive(currentMonthlyExpense, 10000);
  const savings = safePositive(currentSavings, 0);
  const preReturn = safeRate(preRetirementReturn);
  const inflation = safeRate(inflationRate);
  const postReturn = safeRate(postRetirementReturn);
  const lifeExp = Math.max(retAge + 1, Math.round(safePositive(lifeExpectancy, 85)));

  const yearsToRetirement = retAge - age;
  const retirementDuration = lifeExp - retAge;

  // 1. Future monthly expense at retirement (adjusted for inflation)
  const futureMonthlyExpense =
    expense * Math.pow(1 + inflation / 100, yearsToRetirement);

  // 2. Required retirement corpus using PV of inflation-adjusted annuity
  // Real monthly return = ((1 + postReturn) / (1 + inflation)) ^ (1/12) - 1
  const realAnnualReturn = (1 + postReturn / 100) / (1 + inflation / 100) - 1;
  const realMonthlyReturn = Math.pow(1 + realAnnualReturn, 1 / 12) - 1;
  const n_retirement = retirementDuration * 12;

  let corpusRequired: number;
  if (realMonthlyReturn === 0 || !isFinite(realMonthlyReturn)) {
    corpusRequired = futureMonthlyExpense * n_retirement;
  } else {
    // PV of annuity-due (withdrawals at beginning of month)
    corpusRequired =
      futureMonthlyExpense *
      ((1 - Math.pow(1 + realMonthlyReturn, -n_retirement)) / realMonthlyReturn) *
      (1 + realMonthlyReturn);
  }

  // 3. Future value of current savings at retirement
  const futureValueOfSavings =
    savings * Math.pow(1 + preReturn / 100, yearsToRetirement);

  // 4. Shortfall
  const additionalSavingsNeeded = Math.max(0, corpusRequired - futureValueOfSavings);

  // 5. Monthly SIP required (beginning-of-month, FV annuity-due)
  let monthlySipRequired = 0;
  if (additionalSavingsNeeded > 0) {
    const i = preReturn / 100 / 12;
    const n_sip = yearsToRetirement * 12;
    if (i === 0) {
      monthlySipRequired = additionalSavingsNeeded / n_sip;
    } else {
      // FV annuity-due: FV = PMT × [((1+i)^n - 1) / i] × (1+i)
      // So PMT = FV / [((1+i)^n - 1) / i × (1+i)]
      monthlySipRequired =
        additionalSavingsNeeded /
        (((Math.pow(1 + i, n_sip) - 1) / i) * (1 + i));
    }
  }

  // 6. Yearly data for chart
  const yearlyData: YearlyDataPoint[] = [];
  if (yearsToRetirement > 0) {
    const i = preReturn / 100 / 12;
    let accSavings = savings;
    let accSIP = 0;

    yearlyData.push({
      year: 0,
      totalCorpus: Math.round(savings),
      targetCorpus: Math.round(corpusRequired),
    });

    for (let year = 1; year <= yearsToRetirement; year++) {
      // Savings compound
      accSavings = accSavings * (1 + preReturn / 100);

      // SIP contributions compound
      if (monthlySipRequired > 0 && i > 0) {
        const fvYear =
          monthlySipRequired *
          ((Math.pow(1 + i, 12) - 1) / i) *
          (1 + i);
        accSIP = accSIP * (1 + preReturn / 100) + fvYear;
      } else if (monthlySipRequired > 0) {
        accSIP += monthlySipRequired * 12;
      }

      yearlyData.push({
        year,
        totalCorpus: Math.round(accSavings + accSIP),
        targetCorpus: Math.round(corpusRequired),
      });
    }
  }

  return {
    yearsToRetirement,
    retirementDuration,
    futureMonthlyExpense: Math.round(futureMonthlyExpense),
    corpusRequired: Math.round(corpusRequired),
    futureValueOfSavings: Math.round(futureValueOfSavings),
    additionalSavingsNeeded: Math.round(additionalSavingsNeeded),
    monthlySipRequired: Math.round(monthlySipRequired),
    yearlyData,
  };
}

// ============================================================================
// 4. CHILD EDUCATION CALCULATOR
// ============================================================================

export interface EducationResult {
  yearsToCollege: number;
  futureCost: number;
  futureValueOfSavings: number;
  additionalSavingsNeeded: number;
  monthlySipRequired: number;
  totalInvestment: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateEducation(
  currentAge: number,
  collegeAge: number,
  currentCost: number,
  currentSavings: number,
  annualReturnRate: number = 12,
  educationInflationRate: number = 8
): EducationResult {
  const age = Math.max(0, Math.round(safePositive(currentAge, 5)));
  const colAge = Math.max(age + 1, Math.round(safePositive(collegeAge, 18)));
  const cost = safePositive(currentCost, 100000);
  const savings = safePositive(currentSavings, 0);
  const returnRate = safeRate(annualReturnRate);
  const inflationRate = safeRate(educationInflationRate);

  const yearsToCollege = colAge - age;

  // 1. Future education cost
  const futureCost = cost * Math.pow(1 + inflationRate / 100, yearsToCollege);

  // 2. Future value of current savings
  const futureValueOfSavings =
    savings * Math.pow(1 + returnRate / 100, yearsToCollege);

  // 3. Shortfall
  const additionalSavingsNeeded = Math.max(0, futureCost - futureValueOfSavings);

  // 4. Monthly SIP required (beginning-of-month)
  let monthlySipRequired = 0;
  if (additionalSavingsNeeded > 0) {
    const i = returnRate / 100 / 12;
    const n = yearsToCollege * 12;
    if (i === 0) {
      monthlySipRequired = additionalSavingsNeeded / n;
    } else {
      monthlySipRequired =
        additionalSavingsNeeded /
        (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    }
  }

  // 5. Total investment
  const totalInvestment = monthlySipRequired * yearsToCollege * 12;

  // 6. Yearly data
  const yearlyData: YearlyDataPoint[] = [];
  if (yearsToCollege > 0) {
    const i = returnRate / 100 / 12;
    let accSavings = savings;
    let accSIP = 0;

    yearlyData.push({
      year: 0,
      totalCorpus: Math.round(savings),
      targetCost: Math.round(futureCost),
    });

    for (let year = 1; year <= yearsToCollege; year++) {
      accSavings = accSavings * (1 + returnRate / 100);

      if (monthlySipRequired > 0 && i > 0) {
        const fvYear =
          monthlySipRequired *
          ((Math.pow(1 + i, 12) - 1) / i) *
          (1 + i);
        accSIP = accSIP * (1 + returnRate / 100) + fvYear;
      } else if (monthlySipRequired > 0) {
        accSIP += monthlySipRequired * 12;
      }

      yearlyData.push({
        year,
        totalCorpus: Math.round(accSavings + accSIP),
        targetCost: Math.round(futureCost),
      });
    }
  }

  return {
    yearsToCollege,
    futureCost: Math.round(futureCost),
    futureValueOfSavings: Math.round(futureValueOfSavings),
    additionalSavingsNeeded: Math.round(additionalSavingsNeeded),
    monthlySipRequired: Math.round(monthlySipRequired),
    totalInvestment: Math.round(totalInvestment),
    yearlyData,
  };
}

// ============================================================================
// 5. EMI / HOME LOAN CALCULATOR
// Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
// ============================================================================

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  years: number
): EMIResult {
  const P = safePositive(principal, 100000);
  const rate = safeRate(annualRate);
  const Y = Math.max(1, Math.round(safePositive(years, 1)));
  const n = Y * 12;

  // 0% interest edge case
  if (rate === 0) {
    const emi = P / n;
    const yearlyData: YearlyDataPoint[] = [
      { year: 0, principalPaid: 0, interestPaid: 0, balance: Math.round(P) },
    ];
    for (let yr = 1; yr <= Y; yr++) {
      const paid = emi * 12 * yr;
      yearlyData.push({
        year: yr,
        principalPaid: Math.round(Math.min(paid, P)),
        interestPaid: 0,
        balance: Math.round(Math.max(0, P - paid)),
      });
    }
    return {
      monthlyEMI: Math.round(emi),
      totalInterest: 0,
      totalPayment: Math.round(P),
      principal: Math.round(P),
      yearlyData,
    };
  }

  const r = rate / 100 / 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  // Month-by-month amortization for yearly data
  let balance = P;
  let accInterest = 0;
  let accPrincipal = 0;

  const yearlyData: YearlyDataPoint[] = [
    { year: 0, principalPaid: 0, interestPaid: 0, balance: Math.round(P) },
  ];

  for (let yr = 1; yr <= Y; yr++) {
    for (let month = 1; month <= 12; month++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      accInterest += interestForMonth;
      accPrincipal += principalForMonth;
      balance -= principalForMonth;
    }
    yearlyData.push({
      year: yr,
      principalPaid: Math.round(accPrincipal),
      interestPaid: Math.round(accInterest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principal: Math.round(P),
    yearlyData,
  };
}

// ============================================================================
// 6. SIP STEP-UP CALCULATOR
// Month-by-month simulation; SIP increases every year by stepUpPercent.
// ============================================================================

export interface StepUpSIPResult {
  totalInvestment: number;
  estimatedReturns: number;
  maturityValue: number;
  wealthGainPercent: number;
  finalMonthlySIP: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateStepUpSIP(
  initialMonthly: number,
  stepUpPercent: number,
  annualReturnRate: number,
  years: number
): StepUpSIPResult {
  const P = safePositive(initialMonthly, 500);
  const stepUp = safeRate(stepUpPercent);
  const rate = safeRate(annualReturnRate);
  const Y = Math.max(1, Math.round(safePositive(years, 1)));

  const r = rate / 100 / 12;
  let balance = 0;
  let totalInvestment = 0;
  let currentMonthly = P;

  const yearlyData: YearlyDataPoint[] = [
    { year: 0, investedAmount: 0, maturityValue: 0 },
  ];

  for (let year = 1; year <= Y; year++) {
    for (let month = 1; month <= 12; month++) {
      if (r === 0) {
        balance += currentMonthly;
      } else {
        balance = (balance + currentMonthly) * (1 + r);
      }
      totalInvestment += currentMonthly;
    }

    yearlyData.push({
      year,
      investedAmount: Math.round(totalInvestment),
      maturityValue: Math.round(balance),
    });

    // Step up for next year (after recording this year's data)
    if (stepUp > 0 && year < Y) {
      currentMonthly = currentMonthly * (1 + stepUp / 100);
    }
  }

  const maturityValue = Math.round(balance);
  const estimatedReturns = maturityValue - Math.round(totalInvestment);
  const wealthGainPercent =
    totalInvestment > 0
      ? parseFloat((((balance - totalInvestment) / totalInvestment) * 100).toFixed(1))
      : 0;

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns,
    maturityValue,
    wealthGainPercent,
    finalMonthlySIP: Math.round(currentMonthly),
    yearlyData,
  };
}

// ============================================================================
// 7. SWP CALCULATOR
// Month-by-month simulation with corpus exhaustion detection.
// ============================================================================

export interface SWPResult {
  initialInvestment: number;
  totalWithdrawn: number;
  finalBalance: number;
  corpusSurvivalMonths: number;
  isExhausted: boolean;
  totalReturnsGenerated: number;
  yearlyData: YearlyDataPoint[];
}

export function calculateSWP(
  totalInvestment: number,
  monthlyWithdrawal: number,
  annualRate: number,
  years: number
): SWPResult {
  const investment = safePositive(totalInvestment, 100000);
  const withdrawal = safePositive(monthlyWithdrawal, 1000);
  const rate = safeRate(annualRate);
  const Y = Math.max(1, Math.round(safePositive(years, 1)));

  // Monthly rate via compounding: (1 + annualRate)^(1/12) - 1
  const monthlyRate = rate === 0 ? 0 : Math.pow(1 + rate / 100, 1 / 12) - 1;
  const totalMonths = Y * 12;

  let balance = investment;
  let totalWithdrawn = 0;
  let corpusSurvivalMonths = totalMonths;
  let isExhausted = false;

  const yearlyData: YearlyDataPoint[] = [
    { year: 0, balance: Math.round(investment), withdrawn: 0 },
  ];

  for (let yr = 1; yr <= Y; yr++) {
    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) {
        // Already exhausted
        break;
      }

      // Growth first
      balance = balance * (1 + monthlyRate);

      // Then withdrawal
      if (balance >= withdrawal) {
        balance -= withdrawal;
        totalWithdrawn += withdrawal;
      } else {
        // Partial withdrawal — corpus exhausted
        totalWithdrawn += balance;
        corpusSurvivalMonths = (yr - 1) * 12 + month;
        balance = 0;
        isExhausted = true;
        break;
      }
    }

    yearlyData.push({
      year: yr,
      balance: Math.max(0, Math.round(balance)),
      withdrawn: Math.round(totalWithdrawn),
    });

    if (isExhausted) {
      // Fill remaining years with zero balance
      for (let remaining = yr + 1; remaining <= Y; remaining++) {
        yearlyData.push({
          year: remaining,
          balance: 0,
          withdrawn: Math.round(totalWithdrawn),
        });
      }
      break;
    }
  }

  if (!isExhausted) {
    corpusSurvivalMonths = totalMonths;
  }

  const totalReturnsGenerated = Math.max(
    0,
    Math.round(balance) + Math.round(totalWithdrawn) - investment
  );

  return {
    initialInvestment: investment,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.max(0, Math.round(balance)),
    corpusSurvivalMonths,
    isExhausted,
    totalReturnsGenerated,
    yearlyData,
  };
}
