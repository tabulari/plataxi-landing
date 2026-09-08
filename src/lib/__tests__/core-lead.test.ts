import { describe, expect, it, vi } from "vitest";
import {
  buildCoreLeadPayload,
  consentTextHash,
  forwardApplicationToCore,
} from "../core-lead";

const input = {
  fullName: "Laura Martínez",
  idNumber: "1.020.304.050",
  phone: "310 123 4567",
  email: "laura@example.com",
  employmentType: "Empleado",
  income: "$ 2.500.000",
  incomeType: "monthly" as const,
  bank: "Bancolombia",
  consent: true,
  terms: {
    amount: 800000,
    term: 12,
    monthlyRate: 0.026,
    frequency: "monthly",
  },
} as const;

const context = {
  applicationEndpoint: "https://core.example.com/api/v1/intake/web-lead",
  landingApiKey: "test-key",
  clientIp: "203.0.113.7",
  userAgent: "Vitest",
};

describe("Core web-lead integration", () => {
  it("builds the authoritative Core payload and consent evidence", () => {
    expect(buildCoreLeadPayload(input, context)).toEqual({
      fullName: input.fullName,
      idNumber: "1020304050",
      phone: "3101234567",
      email: input.email,
      employmentType: "Empleado",
      income: "$ 2.500.000",
      bank: "Bancolombia",
      consent: true,
      clientIp: "203.0.113.7",
      userAgent: "Vitest",
      consentTextHash: consentTextHash(),
      terms: {
        amount: 800000,
        termMonths: 12,
        monthlyInterestRate: 0.026,
        frequency: "monthly",
      },
    });
    expect(consentTextHash()).toBe(
      "c9155be29ad498ce0c1daa4be8187b71fd8c1120864f57f4171a2e2d4e01ad9f",
    );
  });

  it("forwards with the server-only key and returns Core's radicado", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          radicado: "CR-2026-ABC12345",
          application_id: "application-id",
          customer_id: "customer-id",
          workspace_url: "https://edge.example.com/s/token",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await forwardApplicationToCore(input, context, fetchMock);

    expect(result.radicado).toBe("CR-2026-ABC12345");
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      context.applicationEndpoint,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Landing-Api-Key": "test-key",
        },
      }),
    );
  });

  it("throws CoreLeadError with the upstream status when Core rejects", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("nope", { status: 401 }));

    await expect(
      forwardApplicationToCore(input, context, fetchMock),
    ).rejects.toMatchObject({ status: 401 });
  });
});
