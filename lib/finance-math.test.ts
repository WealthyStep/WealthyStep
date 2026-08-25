import { describe, it, expect } from 'vitest';
import {
  calculateSIP,
  calculateLumpsum,
  calculateRetirement,
  calculateEducation,
  calculateEMI,
  calculateStepUpSIP,
  calculateSWP,
  formatCurrency,
  formatCurrencyExact,
} from './finance-math';

describe('Deep Verification: Financial Calculators', () => {

  describe('Currency Formatting', () => {
    it('formats exact currency correctly', () => {
      expect(formatCurrencyExact(1161695)).toBe('₹11,61,695');
      expect(formatCurrencyExact(NaN)).toBe('₹0');
    });

    it('formats shorthand currency correctly', () => {
      expect(formatCurrency(14300000)).toBe('₹1.43 Cr');
      expect(formatCurrency(543900)).toBe('₹5.44 Lakhs');
      expect(formatCurrency(5000)).toBe('₹5,000');
      expect(formatCurrency(NaN)).toBe('₹0');
    });
  });

  // ==========================================
  // 1. SIP CALCULATOR (8+ tests)
  // ==========================================
  describe('SIP Calculator', () => {
    it('1. Normal benchmark scenario', () => {
      const res = calculateSIP(5000, 12, 10);
      expect(res.totalInvestment).toBe(600000);
      expect(res.maturityValue).toBeCloseTo(1161695, -1);
      expect(res.estimatedReturns).toBeCloseTo(561695, -1);
    });

    it('2. Minimum valid values', () => {
      const res = calculateSIP(500, 1, 1);
      expect(res.totalInvestment).toBe(6000);
      // P * (((1+r)^12 - 1) / r) * (1+r)
      const r = 0.01 / 12;
      const expected = 500 * (((Math.pow(1+r, 12) - 1) / r)) * (1+r);
      expect(res.maturityValue).toBeCloseTo(Math.round(expected), 0);
    });

    it('3. Maximum valid values / large investment', () => {
      const res = calculateSIP(10000000, 30, 40); // 1 Cr/mo for 40 yrs
      expect(res.totalInvestment).toBe(4800000000);
      const r = 0.30 / 12;
      const expected = 10000000 * (((Math.pow(1+r, 480) - 1) / r)) * (1+r);
      expect(res.maturityValue).toBeCloseTo(Math.round(expected), -2); // Huge precision
    });

    it('4. 0% return fallback', () => {
      const res = calculateSIP(5000, 0, 10);
      expect(res.totalInvestment).toBe(600000);
      expect(res.maturityValue).toBe(600000);
      expect(res.estimatedReturns).toBe(0);
      expect(res.wealthGainPercent).toBe(0);
    });

    it('5. Decimal return rates', () => {
      const res = calculateSIP(5000, 12.5, 10);
      const r = 0.125 / 12;
      const expected = 5000 * (((Math.pow(1+r, 120) - 1) / r)) * (1+r);
      expect(res.maturityValue).toBeCloseTo(Math.round(expected), 0);
    });

    it('6. Short duration (1 year)', () => {
      const res = calculateSIP(1000, 10, 1);
      expect(res.totalInvestment).toBe(12000);
      const r = 0.10 / 12;
      const expected = 1000 * (((Math.pow(1+r, 12) - 1) / r)) * (1+r);
      expect(res.maturityValue).toBeCloseTo(Math.round(expected), 0);
    });

    it('7. Long duration (50 years)', () => {
      const res = calculateSIP(5000, 12, 50);
      expect(res.totalInvestment).toBe(3000000); // 5000 * 12 * 50
    });

    it('8. Invalid inputs (negative, NaN)', () => {
      expect(() => calculateSIP(-5000, -10, -5)).toThrowError();
      expect(() => calculateSIP(NaN, 10, 10)).toThrowError();
    });
  });

  // ==========================================
  // 2. LUMPSUM CALCULATOR (6+ tests)
  // ==========================================
  describe('Lumpsum Calculator', () => {
    it('9. Normal benchmark scenario', () => {
      const res = calculateLumpsum(100000, 12, 10);
      expect(res.initialInvestment).toBe(100000);
      expect(res.maturityValue).toBeCloseTo(310585, -1);
      expect(res.estimatedReturns).toBe(res.maturityValue - res.initialInvestment);
    });

    it('10. Minimum valid values', () => {
      const res = calculateLumpsum(1000, 1, 1);
      expect(res.initialInvestment).toBe(1000);
      expect(res.maturityValue).toBe(1010);
    });

    it('11. 0% return', () => {
      const res = calculateLumpsum(100000, 0, 10);
      expect(res.maturityValue).toBe(100000);
      expect(res.estimatedReturns).toBe(0);
      expect(res.growthPercent).toBe(0);
    });

    it('12. Large investment amount', () => {
      const res = calculateLumpsum(50000000, 15, 30);
      const expected = 50000000 * Math.pow(1.15, 30);
      expect(res.maturityValue).toBeCloseTo(Math.round(expected), -2);
    });

    it('13. Decimal return rates', () => {
      const res = calculateLumpsum(100000, 12.75, 10);
      const expected = 100000 * Math.pow(1.1275, 10);
      expect(res.maturityValue).toBeCloseTo(Math.round(expected), 0);
    });

    it('14. Invalid inputs', () => {
      expect(() => calculateLumpsum(-1000, -10, NaN)).toThrowError();
    });
  });

  // ==========================================
  // 3. RETIREMENT CALCULATOR (12+ tests)
  // ==========================================
  describe('Retirement Calculator', () => {
    it('15. Normal benchmark scenario', () => {
      const res = calculateRetirement(30, 60, 50000, 500000, 12, 6, 7, 85);
      expect(res.yearsToRetirement).toBe(30);
      expect(res.retirementDuration).toBe(25);
      expect(res.futureMonthlyExpense).toBeCloseTo(287175, -1);
      expect(res.futureValueOfSavings).toBeCloseTo(14979961, -1);
      
      const realAnnualReturn = (1 + 7/100) / (1 + 6/100) - 1;
      const realMonthlyReturn = realAnnualReturn / 12;
      const n = 25 * 12;
      const corpusExpected = 287174.55 * ((1 - Math.pow(1 + realMonthlyReturn, -n)) / realMonthlyReturn) * (1 + realMonthlyReturn);
      expect(res.corpusRequired).toBeCloseTo(corpusExpected, -1);
    });

    it('16. Current age = Retirement age', () => {
      expect(() => calculateRetirement(60, 60, 50000, 0, 12, 6, 7, 85)).toThrowError("Retirement age must be greater than current age.");
    });

    it('17. Retirement Age >= Life Expectancy', () => {
      expect(() => calculateRetirement(30, 85, 50000, 0, 12, 6, 7, 85)).toThrowError("Life expectancy must be greater than retirement age.");
    });

    it('18. Negative savings fallback', () => {
      expect(() => calculateRetirement(30, 60, 50000, -10000, 12, 6, 7, 85)).toThrowError();
    });

    it('19. 0% inflation', () => {
      const res = calculateRetirement(30, 60, 50000, 0, 12, 0, 7, 85);
      expect(res.futureMonthlyExpense).toBe(50000);
    });

    it('20. 0% pre-retirement return', () => {
      const res = calculateRetirement(30, 60, 50000, 100000, 0, 6, 7, 85);
      expect(res.futureValueOfSavings).toBe(100000);
    });

    it('21. 0% post-retirement return', () => {
      const res = calculateRetirement(30, 60, 50000, 0, 12, 0, 0, 85);
      // Corpus required = 50000 * (85-60) * 12
      expect(res.corpusRequired).toBeCloseTo(50000 * 25 * 12, 0);
    });

    it('22. Huge monthly expense', () => {
      const res = calculateRetirement(30, 60, 10000000, 0, 12, 6, 7, 85);
      expect(res.futureMonthlyExpense).toBeGreaterThan(10000000);
      expect(res.corpusRequired).toBeGreaterThan(0);
    });

    it('23. Short duration to retirement', () => {
      const res = calculateRetirement(58, 60, 50000, 500000, 12, 6, 7, 85);
      expect(res.yearsToRetirement).toBe(2);
    });

    it('24. Missing / undefined values fallbacks', () => {
      expect(() => calculateRetirement(NaN, NaN, NaN, NaN)).toThrowError();
    });
    
    it('25. Exact shortfall math check', () => {
      const res = calculateRetirement(30, 60, 50000, 0, 12, 6, 7, 85);
      expect(res.additionalSavingsNeeded).toBe(res.corpusRequired);
    });

    it('26. When savings exceed required corpus', () => {
      const res = calculateRetirement(50, 60, 50000, 50000000, 12, 6, 7, 85);
      expect(res.additionalSavingsNeeded).toBe(0);
      expect(res.monthlySipRequired).toBe(0);
    });
  });

  // ==========================================
  // 4. CHILD EDUCATION CALCULATOR (8+ tests)
  // ==========================================
  describe('Child Education Calculator', () => {
    it('27. Normal benchmark scenario', () => {
      const res = calculateEducation(5, 18, 2000000, 0, 12, 8);
      expect(res.yearsToCollege).toBe(13);
      expect(res.futureCost).toBeCloseTo(5439247, -1);
    });

    it('28. 0% inflation', () => {
      const res = calculateEducation(5, 18, 2000000, 0, 12, 0);
      expect(res.futureCost).toBe(2000000);
    });

    it('29. 0% return', () => {
      const res = calculateEducation(5, 18, 2000000, 0, 0, 8);
      // SIP required = Shortfall / totalMonths
      expect(res.monthlySipRequired).toBeCloseTo(res.futureCost / (13 * 12), -1);
    });

    it('30. Child age >= College age', () => {
      expect(() => calculateEducation(18, 18, 2000000, 0, 12, 8)).toThrowError("Education start age must be greater than current age.");
    });

    it('31. High inflation', () => {
      const res = calculateEducation(0, 18, 2000000, 0, 12, 20);
      expect(res.futureCost).toBeCloseTo(2000000 * Math.pow(1.20, 18), -1);
    });

    it('32. Large education cost', () => {
      const res = calculateEducation(5, 18, 100000000, 0, 12, 8); // 10 Cr
      expect(res.futureCost).toBeCloseTo(100000000 * Math.pow(1.08, 13), -1);
    });

    it('33. Pre-existing savings covering full cost', () => {
      const res = calculateEducation(5, 18, 2000000, 5000000, 12, 8);
      expect(res.additionalSavingsNeeded).toBe(0);
      expect(res.monthlySipRequired).toBe(0);
    });

    it('34. Missing inputs fallback', () => {
      expect(() => calculateEducation(NaN, NaN, NaN, NaN)).toThrowError();
    });
  });

  // ==========================================
  // 5. EMI CALCULATOR (8+ tests)
  // ==========================================
  describe('EMI Calculator', () => {
    it('35. Normal benchmark scenario', () => {
      const res = calculateEMI(3000000, 8.5, 20);
      // Raw EMI expectation without round
      const P = 3000000;
      const r = 8.5 / 1200;
      const n = 240;
      const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
      expect(res.monthlyEMI).toBe(Math.round(emi));
      // Strict unrounded total payment
      expect(res.totalPayment).toBe(Math.round(emi * n));
      expect(res.totalInterest).toBe(Math.round((emi * n) - P));
    });

    it('36. 0% interest test', () => {
      const res = calculateEMI(3000000, 0, 20);
      expect(res.monthlyEMI).toBe(3000000 / 240);
      expect(res.totalInterest).toBe(0);
      expect(res.totalPayment).toBe(3000000);
    });

    it('37. Minimum duration (1 year)', () => {
      const res = calculateEMI(3000000, 8.5, 1);
      const P = 3000000, r = 8.5 / 1200, n = 12;
      const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
      expect(res.monthlyEMI).toBe(Math.round(emi));
      expect(res.totalPayment).toBe(Math.round(emi * 12));
    });

    it('38. Decimal interest', () => {
      const res = calculateEMI(3000000, 8.25, 20);
      const P = 3000000, r = 8.25 / 1200, n = 240;
      const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
      expect(res.monthlyEMI).toBe(Math.round(emi));
    });

    it('39. High interest (20%)', () => {
      const res = calculateEMI(3000000, 20, 20);
      expect(res.totalInterest).toBeGreaterThan(3000000);
    });

    it('40. Large loan amount', () => {
      const res = calculateEMI(100000000, 8.5, 20); // 10 Cr
      expect(res.totalPayment).toBeGreaterThan(100000000);
    });

    it('41. Invalid negative inputs', () => {
      expect(() => calculateEMI(-3000000, -8.5, -20)).toThrowError();
    });
    
    it('42. Long duration (40 years)', () => {
      const res = calculateEMI(3000000, 8.5, 40);
      const P = 3000000, r = 8.5 / 1200, n = 480;
      const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
      expect(res.monthlyEMI).toBe(Math.round(emi));
    });
  });

  // ==========================================
  // 6. SIP STEP-UP CALCULATOR (10+ tests)
  // ==========================================
  describe('SIP Step-Up Calculator', () => {
    it('43. Normal benchmark scenario', () => {
      const res = calculateStepUpSIP(5000, 10, 12, 15);
      expect(res.totalInvestment).toBeGreaterThan(5000 * 12 * 15); // Step-up increases total
      expect(res.maturityValue).toBeGreaterThan(res.totalInvestment);
    });

    it('44. Step-up logic exactly once per year', () => {
      const res = calculateStepUpSIP(5000, 10, 12, 4);
      // Yr1: 5000*12 = 60000
      // Yr2: 5500*12 = 66000
      // Yr3: 6050*12 = 72600
      // Yr4: 6655*12 = 79860
      // Total investment = 278460
      expect(res.totalInvestment).toBe(278460);
      expect(res.finalMonthlySIP).toBe(6655);
    });

    it('45. 0% step-up', () => {
      const res = calculateStepUpSIP(5000, 0, 12, 15);
      expect(res.totalInvestment).toBe(5000 * 12 * 15);
      expect(res.finalMonthlySIP).toBe(5000);
    });

    it('46. 0% return', () => {
      const res = calculateStepUpSIP(5000, 10, 0, 4);
      expect(res.maturityValue).toBe(278460); // equals total investment
      expect(res.estimatedReturns).toBe(0);
    });

    it('47. 50% step-up', () => {
      const res = calculateStepUpSIP(5000, 50, 12, 10);
      expect(res.finalMonthlySIP).toBe(Math.round(5000 * Math.pow(1.5, 9)));
    });

    it('48. Short duration (1 year)', () => {
      const res = calculateStepUpSIP(5000, 10, 12, 1);
      expect(res.totalInvestment).toBe(60000);
      expect(res.finalMonthlySIP).toBe(5000); // step up not applied in Yr 1
    });

    it('49. Long duration (30 years)', () => {
      const res = calculateStepUpSIP(5000, 10, 12, 30);
      expect(res.finalMonthlySIP).toBe(Math.round(5000 * Math.pow(1.10, 29)));
      expect(res.maturityValue).toBeGreaterThan(res.totalInvestment);
    });

    it('50. Decimal return rates', () => {
      const res = calculateStepUpSIP(5000, 10, 12.5, 10);
      expect(res.maturityValue).toBeGreaterThan(0);
    });

    it('51. Invalid values', () => {
      expect(() => calculateStepUpSIP(-5000, -10, NaN, 0)).toThrowError();
    });

    it('52. Wealth Gain Percent calculation', () => {
      const res = calculateStepUpSIP(5000, 10, 12, 10);
      const wg = ((res.maturityValue - res.totalInvestment) / res.totalInvestment) * 100;
      expect(res.wealthGainPercent).toBe(parseFloat(wg.toFixed(1)));
    });
  });

  // ==========================================
  // 7. SWP CALCULATOR (10+ tests)
  // ==========================================
  describe('SWP Calculator', () => {
    it('53. Normal benchmark scenario (survives)', () => {
      const res = calculateSWP(5000000, 20000, 10, 10); // 20k/mo from 50L at 10%
      expect(res.initialInvestment).toBe(5000000);
      expect(res.totalWithdrawn).toBe(20000 * 12 * 10);
      expect(res.isExhausted).toBe(false);
      expect(res.corpusSurvivalMonths).toBe(120);
    });

    it('54. Corpus exact exhaustion', () => {
      // Find PMT for exact exhaustion
      // P = 100000, n = 12, r = 10%
      const P = 100000;
      const r = 10 / 100 / 12;
      const n = 12;
      // PV = PMT * [1 - (1+r)^-n] / r * (1+r)
      const pmt = P / (((1 - Math.pow(1+r, -n)) / r));
      // Wait, our SWP applies growth then withdraws at end of month or start?
      // "balance = balance * (1 + monthlyRate); balance -= withdrawal;" 
      // This is end of month withdrawal.
      // So PMT = P / [ (1 - (1+r)^-n) / r ]
      const res = calculateSWP(100000, pmt, 10, 1);
      expect(res.finalBalance).toBeCloseTo(0, 0);
      expect(res.isExhausted).toBe(true); // Due to precision, it effectively hits 0 and exhausts 
    });

    it('55. Corpus exhausts early', () => {
      const res = calculateSWP(100000, 20000, 10, 20); // Obviously will exhaust
      expect(res.isExhausted).toBe(true);
      expect(res.corpusSurvivalMonths).toBeLessThan(20 * 12);
      expect(res.finalBalance).toBe(0);
    });

    it('56. 0% return', () => {
      const res = calculateSWP(500000, 10000, 0, 4);
      expect(res.finalBalance).toBe(500000 - (10000 * 48));
      expect(res.totalReturnsGenerated).toBe(0);
    });

    it('57. Withdrawal = 0', () => {
      const res = calculateSWP(500000, 0, 10, 10); // Behaves like lumpsum
      const expected = 500000 * Math.pow(1 + 0.10/12, 120);
      expect(res.finalBalance).toBeCloseTo(Math.round(expected), -1);
      expect(res.totalWithdrawn).toBe(0);
    });

    it('58. High withdrawal amount', () => {
      const res = calculateSWP(100000, 120000, 10, 10); // Exhausts month 1
      expect(res.isExhausted).toBe(true);
      expect(res.corpusSurvivalMonths).toBe(1);
    });

    it('59. Long withdrawal period (50 years)', () => {
      const res = calculateSWP(10000000, 10000, 10, 50); // Small withdrawal, grows
      expect(res.isExhausted).toBe(false);
      expect(res.finalBalance).toBeGreaterThan(10000000);
    });

    it('60. Negative inputs fallback', () => {
      expect(() => calculateSWP(-50000, -10000, -10, NaN)).toThrowError();
    });

    it('61. Decimal rates', () => {
      const res = calculateSWP(5000000, 30000, 10.5, 20);
      expect(res.finalBalance).toBeGreaterThan(0);
    });
    
    it('62. Verify standard monthly rate formula applied', () => {
      const P = 100000;
      const W = 1000;
      const r = 12 / 100 / 12; // 0.01
      const res = calculateSWP(P, W, 12, 1); // 12 months
      
      let bal = P;
      let withdrawn = 0;
      for(let i=1; i<=12; i++){
        bal = bal * 1.01 - W;
        withdrawn += W;
      }
      expect(res.finalBalance).toBe(Math.max(0, Math.round(bal)));
      expect(res.totalWithdrawn).toBe(Math.round(withdrawn));
    });
  });
});
