/**
 * Standard SIP Formula
 * M = P × ({[1 + i]^n - 1} / i) × (1 + i)
 * P = regular investment amount, i = periodic interest rate (annual rate / 12), n = total number of payments
 */
export function calculateSIP(monthlyInvestment: number, annualReturnRate: number, years: number) {
  const i = annualReturnRate / 100 / 12;
  const n = years * 12;
  const totalInvestment = monthlyInvestment * n;
  
  // Future Value (Maturity Value)
  const maturityValue = Math.round(monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const estimatedReturns = maturityValue - totalInvestment;
  
  return {
    totalInvestment,
    estimatedReturns,
    maturityValue,
  };
}

/**
 * Step-Up SIP Formula
 * Sum of multiple SIPs starting at different times
 */
export function calculateStepUpSIP(initialMonthly: number, stepUpPercent: number, annualReturnRate: number, years: number) {
  const i = annualReturnRate / 100 / 12;
  let totalInvestment = 0;
  let maturityValue = 0;
  let currentMonthly = initialMonthly;

  for (let year = 1; year <= years; year++) {
    // Investment made in this year will compound for (years - year + 1) years
    const n = (years - year + 1) * 12;
    // The SIP part started this year (which is actually just the increment if we think of it additively, 
    // but easier to sum yearly cashflows Future Value)
    
    // Actually, calculating Future Value of 12 monthly payments for this specific year
    // The amount invested in year Y grows for the remaining years.
    // Standard approach:
    const monthsLeft = (years - year + 1) * 12;
    const monthsThisYear = 12;
    
    // FV of these 12 payments at the end of the investment period
    // First, find FV of these 12 payments at the end of their year
    const fvAtEndOfYear = currentMonthly * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
    // Then compound this FV for the remaining (years - year) years
    const fvAtMaturity = fvAtEndOfYear * Math.pow(1 + i, (years - year) * 12);
    
    maturityValue += fvAtMaturity;
    totalInvestment += currentMonthly * 12;
    
    // Step up for next year
    currentMonthly += currentMonthly * (stepUpPercent / 100);
  }

  const finalMonthlySIP = currentMonthly / (1 + (stepUpPercent / 100)); // The amount paid in the last year

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(maturityValue - totalInvestment),
    maturityValue: Math.round(maturityValue),
    finalMonthlySIP: Math.round(finalMonthlySIP),
  };
}

/**
 * EMI Formula
 * E = P x r x (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEMI(principal: number, annualRate: number, years: number) {
  if (annualRate === 0) {
    const emi = principal / (years * 12);
    return {
      monthlyEMI: Math.round(emi),
      totalInterest: 0,
      totalPayment: principal,
      principal
    };
  }
  const r = annualRate / 100 / 12;
  const n = years * 12;
  
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principal
  };
}

/**
 * SWP (Systematic Withdrawal Plan)
 */
export function calculateSWP(totalInvestment: number, monthlyWithdrawal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  
  let currentBalance = totalInvestment;
  let totalWithdrawn = 0;
  
  for (let month = 1; month <= n; month++) {
    // Interest earned this month
    const interest = currentBalance * r;
    currentBalance += interest;
    
    // Withdrawal
    if (currentBalance >= monthlyWithdrawal) {
      currentBalance -= monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
    } else {
      // Fund depleted early
      totalWithdrawn += currentBalance;
      currentBalance = 0;
      break;
    }
  }

  return {
    initialInvestment: totalInvestment,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(currentBalance),
  };
}

/**
 * Retirement Calculator
 * Calculates corpus required at retirement based on current expenses and inflation.
 */
export function calculateRetirement(
  currentAge: number, 
  retirementAge: number, 
  currentMonthlyExpense: number, 
  currentSavings: number, 
  annualReturnRate: number = 12,
  inflationRate: number = 6,
  postRetirementReturnRate: number = 8,
  lifeExpectancy: number = 85
) {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  if (yearsToRetirement <= 0 || yearsInRetirement <= 0) {
    return {
      corpusRequired: 0,
      additionalSavingsNeeded: 0,
      monthlySipRequired: 0,
      futureValueOfSavings: currentSavings,
      yearsToRetirement,
    };
  }

  // 1. Calculate future monthly expense at retirement
  const futureMonthlyExpense = currentMonthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // 2. Calculate Required Corpus at retirement (Present Value of Growing Annuity)
  // Adjusted return rate (real rate of return)
  const r = postRetirementReturnRate / 100;
  const g = inflationRate / 100;
  const realRate = (1 + r) / (1 + g) - 1;
  
  let corpusRequired = 0;
  if (realRate === 0) {
    corpusRequired = futureAnnualExpense * yearsInRetirement;
  } else {
    // Payment at beginning of year assumption
    corpusRequired = futureAnnualExpense * ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate) * (1 + realRate);
  }

  // 3. Calculate Future Value of current savings at retirement
  const futureValueOfSavings = currentSavings * Math.pow(1 + annualReturnRate / 100, yearsToRetirement);

  // 4. Calculate Shortfall
  const additionalSavingsNeeded = Math.max(0, corpusRequired - futureValueOfSavings);

  // 5. Calculate Monthly SIP required to meet the shortfall
  let monthlySipRequired = 0;
  if (additionalSavingsNeeded > 0) {
    const i = annualReturnRate / 100 / 12;
    const n = yearsToRetirement * 12;
    // P = M / [({[1 + i]^n - 1} / i) * (1 + i)]
    monthlySipRequired = additionalSavingsNeeded / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  return {
    corpusRequired: Math.round(corpusRequired),
    additionalSavingsNeeded: Math.round(additionalSavingsNeeded),
    monthlySipRequired: Math.round(monthlySipRequired),
    futureValueOfSavings: Math.round(futureValueOfSavings),
    yearsToRetirement
  };
}

/**
 * Education Calculator (Very similar to Retirement, but shorter timeframe and lump sum payout)
 */
export function calculateEducation(
  currentAge: number,
  collegeAge: number,
  currentCost: number,
  currentSavings: number,
  annualReturnRate: number = 12,
  educationInflationRate: number = 10
) {
  const yearsToCollege = collegeAge - currentAge;
  
  if (yearsToCollege <= 0) {
    return {
      corpusRequired: currentCost,
      additionalSavingsNeeded: Math.max(0, currentCost - currentSavings),
      monthlySipRequired: 0,
      futureValueOfSavings: currentSavings,
      yearsToCollege,
    };
  }

  // 1. Future cost of education
  const corpusRequired = currentCost * Math.pow(1 + educationInflationRate / 100, yearsToCollege);

  // 2. Future value of current savings
  const futureValueOfSavings = currentSavings * Math.pow(1 + annualReturnRate / 100, yearsToCollege);

  // 3. Shortfall
  const additionalSavingsNeeded = Math.max(0, corpusRequired - futureValueOfSavings);

  // 4. Monthly SIP
  let monthlySipRequired = 0;
  if (additionalSavingsNeeded > 0) {
    const i = annualReturnRate / 100 / 12;
    const n = yearsToCollege * 12;
    monthlySipRequired = additionalSavingsNeeded / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  return {
    corpusRequired: Math.round(corpusRequired),
    additionalSavingsNeeded: Math.round(additionalSavingsNeeded),
    monthlySipRequired: Math.round(monthlySipRequired),
    futureValueOfSavings: Math.round(futureValueOfSavings),
    yearsToCollege
  };
}

// Utility to format currency (Indian Rupee)
export function formatCurrency(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

// Exact formatting for full numbers
export function formatCurrencyExact(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
