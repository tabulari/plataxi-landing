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
    });
  });

  it("rejects malformed or unsafe config", () => {
    expect(parseRatesConfig({ ...validPayload, monthly_interest_rate: "invalid" })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, max_amount: "50000" })).toBeNull();
    expect(parseRatesConfig({ ...validPayload, term_options_months: [] })).toBeNull();
  });

  it("returns null when Core is down so the provider retains static defaults", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));

    await expect(
      loadRatesConfig("https://core.example.com/api/v1/sessions/rates-config", fetchMock),
    ).resolves.toBeNull();
  });

  it("clamps amountMin to landing floor (100k) when Core still sends 50k", async () => {
    const corePayload = {
      monthly_interest_rate: "0.026",
      min_amount: "50000.00",
      max_amount: "1000000.00",
      term_options_months: [3, 6, 12],
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => corePayload,
    } as Response);
    const fallback = {
      monthlyRate: 0.026,
      amountMin: 100000,
      amountMax: 1000000,
      termOptions: [1, 2, 3, 4, 5, 6],
    };
    const { rates, source } = await getInitialRates("https://core.example.com/api/v1/sessions/rates-config", fallback, fetchMock);
    expect(source).toBe("core");
    expect(rates.amountMin).toBe(100000);
    expect(rates.termOptions).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
