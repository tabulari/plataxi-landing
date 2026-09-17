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

  describe("Validación exhaustiva de las Dos Fórmulas y los Divisores", () => {
    // Ejemplo canónico con $500.000 a 3 meses (10.2% interés = 51.000)
    // 1. Fórmula Base: Capital (500k) + Interés (51k) = 551.000
    // Divisores: Diario /30 = 18.367, Semanal /4 = 137.750, Quincenal /2 = 275.500, Mensual /1 = 551.000
    it("Fórmula Base: $500.000 a 3 meses en todas las frecuencias (/30, /4, /2, /1)", () => {
      const daily = calculatePayment(500000, 3, "daily", 0.034, false, false);
      expect(daily.totalCost).toBe(551000);
      expect(daily.payment).toBe(18367); // 551.000 / 30

      const weekly = calculatePayment(500000, 3, "weekly", 0.034, false, false);
      expect(weekly.totalCost).toBe(551000);
      expect(weekly.payment).toBe(137750); // 551.000 / 4

      const biweekly = calculatePayment(500000, 3, "biweekly", 0.034, false, false);
      expect(biweekly.totalCost).toBe(551000);
      expect(biweekly.payment).toBe(275500); // 551.000 / 2

      const monthly = calculatePayment(500000, 3, "monthly", 0.034, false, false);
      expect(monthly.totalCost).toBe(551000);
      expect(monthly.payment).toBe(551000); // 551.000 / 1
    });

    // 2. Con Servicios Opcionales: Capital (500k) + Interés (51k) + Plat (15k) + Fianza (18k) = 584.000
    // Divisores: Diario /30 = 19.467, Semanal /4 = 146.000, Quincenal /2 = 292.000, Mensual /1 = 584.000
    it("Fórmula Con Servicios: $500.000 a 3 meses en todas las frecuencias (/30, /4, /2, /1)", () => {
      const daily = calculatePayment(500000, 3, "daily", 0.034, true, true);
      expect(daily.totalCost).toBe(584000);
      expect(daily.payment).toBe(19467); // 584.000 / 30

      const weekly = calculatePayment(500000, 3, "weekly", 0.034, true, true);
      expect(weekly.totalCost).toBe(584000);
      expect(weekly.payment).toBe(146000); // 584.000 / 4

      const biweekly = calculatePayment(500000, 3, "biweekly", 0.034, true, true);
      expect(biweekly.totalCost).toBe(584000);
      expect(biweekly.payment).toBe(292000); // 584.000 / 2

      const monthly = calculatePayment(500000, 3, "monthly", 0.034, true, true);
      expect(monthly.totalCost).toBe(584000);
      expect(monthly.payment).toBe(584000); // 584.000 / 1
    });

    it("Tasas acumuladas por plazo: 1m=3.4%, 2m=6.8%, 3m=10.2%", () => {
      const m1 = calculatePayment(1000000, 1, "monthly", 0.034, false, false);
      expect(m1.legalInterestAmount).toBe(34000); // 3.4%

      const m2 = calculatePayment(1000000, 2, "monthly", 0.034, false, false);
      expect(m2.legalInterestAmount).toBe(68000); // 6.8%

      const m3 = calculatePayment(1000000, 3, "monthly", 0.034, false, false);
      expect(m3.legalInterestAmount).toBe(102000); // 10.2%
    });
  });
});

describe("calculatePayment — tasas dinámicas servidas por Core", () => {
  // Core sirve la tasa mensual y las tasas de los servicios opcionales; el
  // motor ya no las mantiene fijas en código. Los literales de DOMAIN-011
  // (3.4% / 3.0% / 3.6%) son solo los valores históricos de los argumentos.
  it("usa la tasa mensual servida por Core para el interés (ej. 2.6%)", () => {
    const s = calculatePayment(100000, 1, "daily", 0.026, false, false);
    expect(s.legalInterestAmount).toBe(2600); // 2.6% de 100.000
    expect(s.totalCost).toBe(102600);
    expect(s.monthlyRate).toBe(0.026);
    expect(s.ea).toBeCloseTo(Math.pow(1.026, 12) - 1, 10);
  });

  it("usa las tasas de servicio dinámicas cuando Core las cambia", () => {
    const s = calculatePayment(100000, 1, "daily", 0.034, true, true, 0.025, 0.040);
    expect(s.platformFeeAmount).toBe(2500); // 2.5% de 100.000
    expect(s.guaranteeFeeAmount).toBe(4000); // 4.0% de 100.000
    expect(s.totalCost).toBe(109900); // 100.000 + 3.400 + 2.500 + 4.000
    expect(s.payment).toBe(3663); // 109.900 / 30
  });

  it("mantiene los literales históricos como valores por defecto de los argumentos", () => {
    const s = calculatePayment(100000, 1, "daily", 0.034);
    expect(s.platformFeeAmount).toBe(3000); // 3.0%
    expect(s.guaranteeFeeAmount).toBe(3600); // 3.6%
  });

  it("replay de un snapshot con sus propias tasas reproduce exactamente las cifras mostradas", () => {
    // El usuario vio y envió una simulación con las tasas de Core en el momento
    // T1; al volver (T2) las tasas pueden haber cambiado: el replay usa las
    // tasas congeladas del snapshot, nunca las actuales.
    const quoted = calculatePayment(500000, 3, "biweekly", 0.026, true, true, 0.025, 0.040);
    expect(quoted.monthlyRate).toBe(0.026);
    expect(quoted.platformFeeRate).toBe(0.025);
    expect(quoted.guaranteeFeeRate).toBe(0.040);

    // "Hoy" las tasas cambiaron en Core (3.4% / 3.0% / 3.6%): el replay del
    // snapshot ignorará esas y usará las del snapshot (t.monthlyRate, etc.).
    const replayed = calculatePayment(
      quoted.amount,
      quoted.term,
      quoted.frequency,
      quoted.monthlyRate,
      quoted.acceptsPlatform,
      quoted.acceptsGuarantee,
      quoted.platformFeeRate,
      quoted.guaranteeFeeRate,
    );
    expect(replayed).toEqual(quoted);
  });
});

describe("Matriz de Admisibilidad — isTermDisabled e isFrequencyDisabled", () => {
  it("términos respetan el límite según monto", () => {
    expect(isTermDisabled(100000, 1)).toBe(false);
    expect(isTermDisabled(100000, 2)).toBe(true);
    expect(isTermDisabled(100000, 3)).toBe(true);

    expect(isTermDisabled(200000, 1)).toBe(false);
    expect(isTermDisabled(200000, 2)).toBe(false);
    expect(isTermDisabled(200000, 3)).toBe(true);

    expect(isTermDisabled(500000, 1)).toBe(false);
    expect(isTermDisabled(500000, 2)).toBe(false);
    expect(isTermDisabled(500000, 3)).toBe(false);
  });

  it("todas las frecuencias ofrecidas están habilitadas sin deshabilitar ningún botón", () => {
    // Para cualquier monto, diaria, semanal, quincenal y mensual están habilitadas
    for (const amount of [100000, 200000, 500000, 800000]) {
      expect(isFrequencyDisabled(amount, "daily")).toBe(false);
      expect(isFrequencyDisabled(amount, "weekly")).toBe(false);
      expect(isFrequencyDisabled(amount, "biweekly")).toBe(false);
      expect(isFrequencyDisabled(amount, "monthly")).toBe(false);
    }
    // Únicamente las frecuencias no ofrecidas están deshabilitadas
    expect(isFrequencyDisabled(500000, "bimonthly")).toBe(true);
    expect(isFrequencyDisabled(500000, "quarterly")).toBe(true);
  });
});

describe("validateApplication — guidance messages", () => {
  it("valida combinaciones correctas de monto, plazo y frecuencia", () => {
    expect(validateApplication(100000, 1, "daily").ok).toBe(true);
    expect(validateApplication(100000, 1, "monthly").ok).toBe(true);
    expect(validateApplication(200000, 2, "weekly").ok).toBe(true);
    expect(validateApplication(500000, 3, "biweekly").ok).toBe(true);
    expect(validateApplication(500000, 3, "monthly").ok).toBe(true);
    expect(validateApplication(800000, 1, "monthly").ok).toBe(true);
  });

  it("rechaza plazos no disponibles según el monto", () => {
    const r1 = validateApplication(100000, 2, "daily");
    expect(r1.ok).toBe(false);
    expect(r1.message).toContain("1 mes");

    const r2 = validateApplication(200000, 3, "monthly");
    expect(r2.ok).toBe(false);
    expect(r2.message).toContain("2 meses");
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
