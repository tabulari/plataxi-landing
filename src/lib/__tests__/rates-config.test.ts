import { describe, expect, it, vi } from "vitest";
import { getInitialRates, loadRatesConfig, parseRatesConfig } from "../rates-config";

const validPayload = {
  monthly_interest_rate: "0.0320",
  min_amount: "60000.00",
  max_amount: "1200000.00",
  term_options_months: [12, 3, 6, 6],
};

describe("dynamic rates config", () => {
  it("normalizes Core decimals and terms", () => {
    expect(parseRatesConfig(validPayload)).toEqual({
      monthlyRate: 0.032,
      amountMin: 60000,
      amountMax: 1200000,
      termOptions: [3, 6, 12],
      offeredFrequencies: ['daily', 'weekly', 'biweekly', 'monthly'],
    });
  });

  it("accepts Core payloads without terms (Core no longer serves them)", () => {
    const withoutTerms = {
      monthly_interest_rate: "0.0320",
      min_amount: "60000.00",
      max_amount: "1200000.00",
    };
    expect(parseRatesConfig(withoutTerms)).toEqual({
      monthlyRate: 0.032,
      amountMin: 60000,
      amountMax: 1200000,
      termOptions: [],
      offeredFrequencies: ['daily', 'weekly', 'biweekly', 'monthly'],
    });
  });

  it("rejects malformed or unsafe config", () => {
    expect(parseRatesConfig({ ...validPayload, monthly_interest_rate: "invalid" })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, max_amount: "50000" })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, term_options_months: ["x"] })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, term_options_months: [0] })).toBeNull();
  });

  it("returns null when Core is down so the provider retains static defaults", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));

    await expect(
      loadRatesConfig("https://core.example.com/api/v1/sessions/rates-config", fetchMock),
    ).resolves.toBeNull();
  });

  it("respeta el min_amount de Core sin pisos de la landing (Core manda)", async () => {
    const corePayload = {
      monthly_interest_rate: "0.026",
      min_amount: "20000.00",
      max_amount: "1000000.00",
      term_options_months: [3, 6, 12],
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => corePayload,
    } as Response);
    const fallback = {
      monthlyRate: 0.026,
      amountMin: 20000,
      amountMax: 1000000,
      termOptions: [1, 2, 3, 4, 5, 6],
      offeredFrequencies: ['daily', 'weekly', 'biweekly', 'monthly'],
    };
    const { rates, source } = await getInitialRates("https://core.example.com/api/v1/sessions/rates-config", fallback, fetchMock);
    expect(source).toBe("core");
    expect(rates.amountMin).toBe(20000);
    expect(rates.termOptions).toEqual([3, 6, 12]);
  });

  it("fills fallback terms when Core omits them (no term choice)", async () => {
    const coreWithoutTerms = {
      monthly_interest_rate: "0.026",
      min_amount: "20000.00",
      max_amount: "1000000.00",
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => coreWithoutTerms,
    } as Response);
    const fallback = {
      monthlyRate: 0.026,
      amountMin: 20000,
      amountMax: 1000000,
      termOptions: [1, 2, 3, 4, 5, 6],
      offeredFrequencies: ['daily', 'weekly', 'biweekly', 'monthly'],
    };
    const { rates, source } = await getInitialRates("https://core.example.com/api/v1/sessions/rates-config", fallback, fetchMock);
    expect(source).toBe("core");
    expect(rates.monthlyRate).toBe(0.026);
    expect(rates.termOptions).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
