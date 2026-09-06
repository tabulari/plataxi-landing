import { describe, expect, it, vi } from "vitest";
import {
  PLACEHOLDER_KEYS,
  PLACEHOLDERS,
  findUnresolvedPlaceholders,
  findUnresolvedRate,
  assertProductionConfig,
} from "@/lib/config";

/**
 * The placeholder-in-prod guard. These assertions are the contract that blocks a
 * production build until every ⚠️ business value is real.
 */

const allRealEnv = (): Record<string, string> => {
  const env: Record<string, string> = {};
  for (const k of PLACEHOLDER_KEYS) env[k] = `real-${k}`;
  env.NEXT_PUBLIC_CREDIT_MONTHLY_RATE = "0.032";
  return env;
};

describe("production placeholder guard", () => {
  it("flags every key when all values are still placeholders", () => {
    const env: Record<string, string> = {};
    for (const k of PLACEHOLDER_KEYS) env[k] = PLACEHOLDERS[k];
    expect(findUnresolvedPlaceholders(env).sort()).toEqual(
      [...PLACEHOLDER_KEYS].sort(),
    );
  });

  it("flags missing and empty values", () => {
    expect(findUnresolvedPlaceholders({}).sort()).toEqual(
      [...PLACEHOLDER_KEYS].sort(),
    );
    const env = allRealEnv();
    env.RATES_CONFIG_ENDPOINT = "";
    expect(findUnresolvedPlaceholders(env)).toContain(
      "RATES_CONFIG_ENDPOINT",
    );
  });

  it("passes when every placeholder is replaced with a real value", () => {
    expect(findUnresolvedPlaceholders(allRealEnv())).toEqual([]);
    expect(() => assertProductionConfig(allRealEnv())).not.toThrow();
  });

  it("throws and names the unresolved keys", () => {
    const env = allRealEnv();
    env.RATES_CONFIG_ENDPOINT = PLACEHOLDERS.RATES_CONFIG_ENDPOINT;
    env.APPLICATION_ENDPOINT = PLACEHOLDERS.APPLICATION_ENDPOINT;
    expect(() => assertProductionConfig(env)).toThrow(
      /RATES_CONFIG_ENDPOINT/,
    );
    expect(() => assertProductionConfig(env)).toThrow(/APPLICATION_ENDPOINT/);
  });

  it("uses the deployment-provided Core rates endpoint", async () => {
    vi.stubEnv(
      "RATES_CONFIG_ENDPOINT",
      "https://core.example.com/api/v1/sessions/rates-config",
    );
    vi.resetModules();

    const { config: deployedConfig } = await import("@/lib/config");

    expect(deployedConfig.ratesConfigEndpoint).toBe(
      "https://core.example.com/api/v1/sessions/rates-config",
    );
    vi.unstubAllEnvs();
  });
});

describe("monthly rate production guard", () => {
  it("passes when a valid rate is set", () => {
    expect(findUnresolvedRate({ NEXT_PUBLIC_CREDIT_MONTHLY_RATE: "0.032" })).toEqual([]);
  });

  it("passes when rate is missing (uses Core or compile-time fallback 0.026)", () => {
    expect(findUnresolvedRate({})).toEqual([]);
  });

  it("passes when rate is empty string (uses fallback)", () => {
    expect(findUnresolvedRate({ NEXT_PUBLIC_CREDIT_MONTHLY_RATE: "" })).toEqual([]);
  });

  it("flags a non-numeric rate", () => {
    expect(
      findUnresolvedRate({ NEXT_PUBLIC_CREDIT_MONTHLY_RATE: "invalid" }),
    ).toEqual(["NEXT_PUBLIC_CREDIT_MONTHLY_RATE"]);
  });

  it("flags a zero rate", () => {
    expect(
      findUnresolvedRate({ NEXT_PUBLIC_CREDIT_MONTHLY_RATE: "0" }),
    ).toEqual(["NEXT_PUBLIC_CREDIT_MONTHLY_RATE"]);
  });

  it("flags a rate >= 1 (not a decimal)", () => {
    expect(
      findUnresolvedRate({ NEXT_PUBLIC_CREDIT_MONTHLY_RATE: "1.5" }),
    ).toEqual(["NEXT_PUBLIC_CREDIT_MONTHLY_RATE"]);
  });

  it("assertProductionConfig passes when rate is omitted (Core is source of truth)", () => {
    const env = allRealEnv();
    delete env.NEXT_PUBLIC_CREDIT_MONTHLY_RATE;
    expect(() => assertProductionConfig(env)).not.toThrow();
  });

  it("assertProductionConfig throws on invalid rate even when endpoints are real", () => {
    const env = allRealEnv();
    env.NEXT_PUBLIC_CREDIT_MONTHLY_RATE = "0";
    expect(() => assertProductionConfig(env)).toThrow(
      /monthly interest rate/,
    );
  });

  it("assertProductionConfig passes when rate and endpoints are all real", () => {
    expect(() => assertProductionConfig(allRealEnv())).not.toThrow();
  });
});
