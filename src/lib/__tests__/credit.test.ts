import { describe, it, expect } from "vitest";
import {
  calculatePayment,
  validateApplication,
  fmtCOP,
  fmtPct,
  formatCurrencyCOP,
} from "@/lib/credit";

/**
 * Slice 1 acceptance gate. These assertions are the contract: the ported
 * pricing/eligibility functions must reproduce the prototype's numbers exactly
 * before any UI is built. The formula is ported verbatim from `app.js` and is
 * NOT tuned to satisfy any single number.
 */

describe("calculatePayment — verification numbers (amount 500.000)", () => {
  it("12 months monthly → payment 49.039, totalCost 588.468, EA 36,07%", () => {
    const s = calculatePayment(500000, 12, "monthly");
    expect(s.payment).toBe(49039);
    expect(s.totalCost).toBe(588468);
    expect(fmtCOP(s.totalCost)).toBe("588.468");
    expect(fmtPct(s.ea, 2)).toBe("36,07");
    expect(s.unit).toBe("/mes");
    expect(s.valid).toBe(true);
  });

  it("6 months monthly → payment 91.079", () => {
    expect(calculatePayment(500000, 6, "monthly").payment).toBe(91079);
  });

  it("24 months monthly → payment 28.266", () => {
    expect(calculatePayment(500000, 24, "monthly").payment).toBe(28266);
  });

  /**
   * Biweekly: the verbatim formula (nPeriods = termMonths × 2, periodRate =
   * MONTHLY_RATE / 2) yields 24.386 for term=12. The README's "12mo quincenal →
   * 14.068" is internally inconsistent: 14.068 is exactly the term=24 biweekly
   * result (48 fortnights), and 14.068 × 24 = 337.632 < principal, so it cannot
   * amortize a 12-month loan. We pin BOTH true outputs and leave the formula
   * untouched; the canonical fixture can be flipped in one line once the
   * intended month count is confirmed.
   */
  it("12 months biweekly → payment 24.386 /quincena (verbatim formula, term=12)", () => {
    const s = calculatePayment(500000, 12, "biweekly");
    expect(s.payment).toBe(24386);
    expect(s.unit).toBe("/quincena");
    expect(s.nPeriods).toBe(24);
  });

  it("24 months biweekly → payment 14.068 /quincena (the figure the README labeled '12mo')", () => {
    expect(calculatePayment(500000, 24, "biweekly").payment).toBe(14068);
  });
});

describe("validateApplication — eligibility gate", () => {
  it("monto mínimo (100.000) solo permite 1 mes", () => {
    expect(validateApplication(100000, 1, "monthly").ok).toBe(true);
    expect(validateApplication(100000, 2, "monthly").ok).toBe(false);
    expect(validateApplication(100000, 3, "monthly").ok).toBe(false);
    expect(validateApplication(150000, 2, "monthly").ok).toBe(true);
    expect(calculatePayment(100000, 2, "monthly").valid).toBe(false);
  });

  it("amount > 800.000 && term < 3 → invalid", () => {
    expect(validateApplication(900000, 2, "monthly").ok).toBe(false);
    expect(calculatePayment(900000, 2, "monthly").valid).toBe(false);
    // boundary: exactly 800.000 is allowed (rule is strict >)
    expect(validateApplication(800000, 2, "monthly").ok).toBe(true);
    // boundary: term 3 with high amount is allowed
    expect(validateApplication(900000, 3, "monthly").ok).toBe(true);
  });

  it("carries the guidance message onto the Simulation when invalid", () => {
    const s = calculatePayment(100000, 2, "monthly");
    expect(s.valid).toBe(false);
    expect(s.message).toContain("1 mes");
    const s2 = calculatePayment(900000, 2, "monthly");
    expect(s2.valid).toBe(false);
    expect(s2.message).toContain("3 meses");
  });
});

describe("formatters", () => {
  it("fmtCOP groups thousands with '.'", () => {
    expect(fmtCOP(588468)).toBe("588.468");
    expect(fmtCOP(500000)).toBe("500.000");
    expect(fmtCOP(49039)).toBe("49.039");
    expect(fmtCOP(1000000)).toBe("1.000.000");
  });

  it("fmtCOP rounds before formatting", () => {
    expect(fmtCOP(49038.6)).toBe("49.039");
  });

  it("fmtPct renders with a comma decimal separator", () => {
    expect(fmtPct(0.3607, 2)).toBe("36,07");
    expect(fmtPct(0.026, 1)).toBe("2,6");
  });

  it("formatCurrencyCOP is deterministic via fmtCOP (no Intl)", () => {
    expect(formatCurrencyCOP(500000)).toBe("$500.000");
    expect(formatCurrencyCOP(1000000)).toBe("$1.000.000");
    expect(formatCurrencyCOP(100000)).toBe("$100.000");
  });
});
