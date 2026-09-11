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
  contactName: "Carlos Martínez",
  contactPhone: "320 987 6543",
  email: "laura@example.com",
  taxiRole: "Taxi propio" as const,
  taxiPlate: "ABC 123",
  taxiCompany: "Radio Taxi Azul",
  drivingTime: "gt5" as const,
  income: "$ 2.500.000",
  incomeType: "monthly" as const,
  hasBank: "yes" as const,
  bankEntity: "Bancolombia",
  consent: true,
  terms: {
    amount: 800000,
    term: 12,
    monthlyRate: 0.026,
    frequency: "monthly" as const,
  },
};

const context = {
  applicationEndpoint: "https://core.example.com/api/v1/intake/web-lead",
  landingApiKey: "test-key",
  clientIp: "203.0.113.7",
  userAgent: "Vitest",
};

describe("Core web-lead integration", () => {
  it("builds the authoritative Core payload and consent evidence (IP-163)", () => {
    expect(buildCoreLeadPayload(input, context)).toEqual({
      fullName: input.fullName,
      idNumber: "1020304050",
      phone: "3101234567",
      contactName: "Carlos Martínez",
      contactPhone: "3209876543",
      email: input.email,
      taxiRole: "taxi_propio",
      taxiPlate: "ABC 123",
      taxiCompany: "Radio Taxi Azul",
      drivingTime: 6,
      income: "$ 2.500.000",
      hasBank: true,
      bankEntity: "Bancolombia",
      employmentType: "Independiente",
      bank: "Bancolombia",
      consent: true,
      clientIp: "203.0.113.7",
      userAgent: "Vitest",
      consentTextHash: consentTextHash(),
      terms: {
        amount: 800000,
        termMonths: 12,
        monthlyInterestRate: 0.026,
        paymentModality: "monthly",
      },
    });
    expect(consentTextHash()).toBe(
      "c9155be29ad498ce0c1daa4be8187b71fd8c1120864f57f4171a2e2d4e01ad9f",
    );
  });

  it("maps 'Conduzco taxi' role to conduzco_taxi", () => {
    const result = buildCoreLeadPayload({ ...input, taxiRole: "Conduzco taxi", taxiPlate: "" }, context);
    expect(result.taxiRole).toBe("conduzco_taxi");
    expect(result.taxiPlate).toBeNull();
  });

  it("maps each driving-time range to its representative years", () => {
    const cases = [
      { drivingTime: "lt1" as const, expected: 0 },
      { drivingTime: "1to3" as const, expected: 2 },
      { drivingTime: "3to5" as const, expected: 4 },
      { drivingTime: "gt5" as const, expected: 6 },
    ];
    for (const { drivingTime, expected } of cases) {
      expect(buildCoreLeadPayload({ ...input, drivingTime }, context).drivingTime).toBe(expected);
    }
  });

  it("converts daily income to monthly before forwarding", () => {
    const daily = buildCoreLeadPayload({ ...input, income: "$ 80.000", incomeType: "daily" }, context);
    // 80000 * 30 = 2400000
    expect(daily.income).toBe("$ 2.400.000");
    expect(daily.hasBank).toBe(true);
  });

  it("maps hasBank 'no' to false and omits bankEntity", () => {
    const result = buildCoreLeadPayload({ ...input, hasBank: "no", bankEntity: "" }, context);
    expect(result.hasBank).toBe(false);
    expect(result.bankEntity).toBeNull();
  });

  it("omits optional contact fields when empty or only whitespace", () => {
    const result = buildCoreLeadPayload({ ...input, contactName: "  ", contactPhone: "   " }, context);
    expect(result.contactName).toBeNull();
    expect(result.contactPhone).toBeNull();
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
