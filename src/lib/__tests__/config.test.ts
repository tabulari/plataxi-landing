import { describe, expect, it, vi } from "vitest";
import {
  PLACEHOLDER_KEYS,
  PLACEHOLDERS,
  findUnresolvedPlaceholders,
  assertProductionConfig,
} from "@/lib/config";

/**
 * The placeholder-in-prod guard. These assertions are the contract that blocks a
 * production build until every ⚠️ business value is real.
 */

const allRealEnv = (): Record<string, string> => {
  const env: Record<string, string> = {};
  for (const k of PLACEHOLDER_KEYS) env[k] = `real-${k}`;
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
