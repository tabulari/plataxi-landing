import { describe, it, expect } from "vitest";
import {
  calculatePayment,
  validateApplication,
  isFrequencyDisabled,
  isTermDisabled,
  fmtCOP,
  fmtPct,
  formatCurrencyCOP,
} from "@/lib/credit";

/**
 * Plataxi Official Credit Specification Tests.
 * Grounded directly on INDICACION PRESTAMOS PLATAXI.pdf and DOMAIN-011.
 */

describe("calculatePayment — Plataxi Document Formulas", () => {
  describe("Caso 1: Rango $100.000 a $150.000 (Solo 1 mes, Solo Diario /30)", () => {
    it("$100.000 a 1 mes diario CON servicios opcionales (Total 110.000, Cuota 3.667)", () => {
      // Capital: 100.000
      // Interés legal 1m: 3.4% = 3.400
      // Plataforma: 3.0% = 3.000
      // Fianza: 3.6% = 3.600
      // Total = 110.000, Cuota /30 = 3.667
      const s = calculatePayment(100000, 1, "daily", 0.034, true, true);
      expect(s.totalCost).toBe(110000);
      expect(s.payment).toBe(3667);
      expect(s.legalInterestAmount).toBe(3400);
      expect(s.platformFeeAmount).toBe(3000);
      expect(s.guaranteeFeeAmount).toBe(3600);
      expect(s.unit).toBe("/día");
      expect(s.valid).toBe(true);
    });

    it("$100.000 a 1 mes diario FÓRMULA BASE (sin plataforma ni fianza)", () => {
      // Capital: 100.000
      // Interés legal 1m: 3.4% = 3.400
      // Total = 103.400, Cuota /30 = 3.447
      const s = calculatePayment(100000, 1, "daily", 0.034, false, false);
      expect(s.totalCost).toBe(103400);
      expect(s.payment).toBe(3447);
      expect(s.platformFeeAmount).toBe(0);
      expect(s.guaranteeFeeAmount).toBe(0);
      expect(s.valid).toBe(true);
    });
  });

  describe("Caso 2: Rango $200.000 a $250.000 (1 o 2 meses, Diario o Semanal)", () => {
    it("$200.000 a 2 meses diario con servicios (Total 226.800, Cuota 7.560)", () => {
      // Interés 2m: 6.8% = 13.600
      // Plataforma: 3.0% = 6.000
      // Fianza: 3.6% = 7.200
      // Total = 226.800, Cuota /30 = 7.560
      const s = calculatePayment(200000, 2, "daily", 0.034, true, true);
      expect(s.totalCost).toBe(226800);
      expect(s.payment).toBe(7560);
      expect(s.valid).toBe(true);
    });

    it("$200.000 a 2 meses semanal con servicios (Total 226.800, Cuota /4 = 56.700)", () => {
      const s = calculatePayment(200000, 2, "weekly", 0.034, true, true);
      expect(s.totalCost).toBe(226800);
      expect(s.payment).toBe(56700);
      expect(s.unit).toBe("/semana");
      expect(s.valid).toBe(true);
    });
  });

  describe("Caso 3: Rango $300.000 a $600.000 (1, 2 o 3 meses, Diario, Semanal o Quincenal)", () => {
    it("$500.000 a 3 meses quincenal con servicios (Total 584.000, Cuota /2 = 292.000)", () => {
      // Interés 3m: 10.2% = 51.000
      // Plataforma: 3.0% = 15.000
      // Fianza: 3.6% = 18.000
      // Total = 584.000, Cuota /2 = 292.000
      const s = calculatePayment(500000, 3, "biweekly", 0.034, true, true);
      expect(s.totalCost).toBe(584000);
      expect(s.payment).toBe(292000);
      expect(s.unit).toBe("/quincena");
      expect(s.valid).toBe(true);
    });
  });

  describe("Caso 4: Rango $600.000 a $1.000.000 (Incluye Mensual)", () => {
    it("$800.000 a 1 mes mensual con servicios (Total 880.000, Cuota /1 = 880.000)", () => {
      // Interés 1m: 3.4% = 27.200
      // Plataforma: 3.0% = 24.000
      // Fianza: 3.6% = 28.800
      // Total = 880.000, Cuota /1 = 880.000
      const s = calculatePayment(800000, 1, "monthly", 0.034, true, true);
      expect(s.totalCost).toBe(880000);
      expect(s.payment).toBe(880000);
      expect(s.unit).toBe("/mes");
      expect(s.valid).toBe(true);
    });
  });
});

describe("Matriz de Admisibilidad — isTermDisabled y isFrequencyDisabled", () => {
  it("$100.000 y $150.000: solo 1 mes y solo diario", () => {
    expect(isTermDisabled(100000, 1)).toBe(false);
    expect(isTermDisabled(100000, 2)).toBe(true);
    expect(isTermDisabled(100000, 3)).toBe(true);

    expect(isFrequencyDisabled(100000, "daily")).toBe(false);
    expect(isFrequencyDisabled(100000, "weekly")).toBe(true);
    expect(isFrequencyDisabled(100000, "biweekly")).toBe(true);
    expect(isFrequencyDisabled(100000, "monthly")).toBe(true);
  });

  it("$200.000 y $250.000: 1 y 2 meses, diario o semanal", () => {
    expect(isTermDisabled(200000, 1)).toBe(false);
    expect(isTermDisabled(200000, 2)).toBe(false);
    expect(isTermDisabled(200000, 3)).toBe(true);

    expect(isFrequencyDisabled(200000, "daily")).toBe(false);
    expect(isFrequencyDisabled(200000, "weekly")).toBe(false);
    expect(isFrequencyDisabled(200000, "biweekly")).toBe(true);
    expect(isFrequencyDisabled(200000, "monthly")).toBe(true);
  });

  it("$300.000 a $600.000: 1, 2 y 3 meses, diario, semanal o quincenal (no mensual)", () => {
    expect(isTermDisabled(500000, 1)).toBe(false);
    expect(isTermDisabled(500000, 2)).toBe(false);
    expect(isTermDisabled(500000, 3)).toBe(false);

    expect(isFrequencyDisabled(500000, "daily")).toBe(false);
    expect(isFrequencyDisabled(500000, "weekly")).toBe(false);
    expect(isFrequencyDisabled(500000, "biweekly")).toBe(false);
    expect(isFrequencyDisabled(500000, "monthly")).toBe(true);
  });

  it("$600.000 a $1.000.000: todas las frecuencias permitidas", () => {
    expect(isFrequencyDisabled(800000, "daily")).toBe(false);
    expect(isFrequencyDisabled(800000, "weekly")).toBe(false);
    expect(isFrequencyDisabled(800000, "biweekly")).toBe(false);
    expect(isFrequencyDisabled(800000, "monthly")).toBe(false);
  });
});

describe("validateApplication — guidance messages", () => {
  it("valida combinaciones correctas", () => {
    expect(validateApplication(100000, 1, "daily").ok).toBe(true);
    expect(validateApplication(200000, 2, "weekly").ok).toBe(true);
    expect(validateApplication(500000, 3, "biweekly").ok).toBe(true);
    expect(validateApplication(800000, 1, "monthly").ok).toBe(true);
  });

  it("rechaza combinaciones inválidas con mensajes claros", () => {
    const r1 = validateApplication(100000, 1, "weekly");
    expect(r1.ok).toBe(false);
    expect(r1.message).toContain("diarios");

    const r2 = validateApplication(500000, 1, "monthly");
    expect(r2.ok).toBe(false);
    expect(r2.message).toContain("600.000");
  });
});

describe("formatters", () => {
  it("fmtCOP groups thousands with '.'", () => {
    expect(fmtCOP(588468)).toBe("588.468");
    expect(fmtCOP(500000)).toBe("500.000");
    expect(fmtCOP(1000000)).toBe("1.000.000");
  });

  it("fmtPct renders with a comma decimal separator", () => {
    expect(fmtPct(0.034, 1)).toBe("3,4");
    expect(fmtPct(0.068, 1)).toBe("6,8");
    expect(fmtPct(0.102, 1)).toBe("10,2");
  });

  it("formatCurrencyCOP is deterministic via fmtCOP (no Intl)", () => {
    expect(formatCurrencyCOP(500000)).toBe("$500.000");
    expect(formatCurrencyCOP(1000000)).toBe("$1.000.000");
    expect(formatCurrencyCOP(100000)).toBe("$100.000");
  });
});
