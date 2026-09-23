import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";

/**
 * Handler-level tests: a real Request goes in, Core is faked at `fetch`, and we
 * assert on what the browser would receive. This is the contract the apply form
 * depends on (`code` drives the error copy and whether the applicant can edit).
 */

const validBody = {
  fullName: "Laura Martínez",
  idNumber: "1.020.304.050",
  phone: "310 123 4567",
  contactName: "Carlos Martínez",
  contactPhone: "320 987 6543",
  email: "laura@example.com",
  taxiRole: "Taxi propio",
  taxiPlate: "ABC 123",
  taxiCompany: "Radio Taxi Azul",
  drivingTime: "gt5",
  income: "$ 2.500.000",
  incomeType: "monthly",
  hasBank: "yes",
  bankEntity: "Bancolombia",
  consent: true,
  terms: { amount: 300000, term: 2, monthlyRate: 0.034, frequency: "weekly" },
};

let ipCounter = 0;
function post(body: unknown, query = "") {
  // A fresh IP per call keeps the in-memory rate limiter out of the way.
  ipCounter += 1;
  return POST(
    new NextRequest(`http://localhost:3000/api/application${query}`, {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        "content-type": "application/json",
        "x-forwarded-for": `198.51.100.${ipCounter}`,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

function coreReplies(status: number, json: unknown) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(
      new Response(JSON.stringify(json), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/application", () => {
  it("returns Core's radicado and workspace url on success", async () => {
    coreReplies(201, {
      radicado: "CR-2026-ABC12345",
      workspace_url: "https://edge.example.com/w/abc",
    });

    const res = await post(validBody);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      radicado: "CR-2026-ABC12345",
      workspaceUrl: "https://edge.example.com/w/abc",
    });
  });

  it("ignores the old ?forceSuccess/?forceError test hooks in every environment", async () => {
    const fetchMock = coreReplies(201, { radicado: "CR-REAL", workspace_url: null });

    const res = await post(validBody, "?forceSuccess=1&forceError=1");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(await res.json()).toMatchObject({ radicado: "CR-REAL" });
  });

  it("rejects malformed JSON as an applicant-fixable 'invalid'", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ code: "invalid" });
  });

  it("rejects a payload that fails the shared schema without calling Core", async () => {
    const fetchMock = coreReplies(201, { radicado: "x" });

    const res = await post({ ...validBody, consent: false });

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ code: "invalid" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("blocks a cross-site origin before doing any work", async () => {
    const fetchMock = coreReplies(201, { radicado: "x" });

    const res = await POST(
      new NextRequest("http://localhost:3000/api/application", {
        method: "POST",
        headers: {
          origin: "https://evil.example",
          "x-forwarded-for": "198.51.100.250",
        },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps Core 409 national_id_already_registered to its own code", async () => {
    coreReplies(409, { detail: { code: "national_id_already_registered" } });
    const res = await post(validBody);
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ code: "national_id_already_registered" });
  });

  it("maps a Core identity_conflict 422 to identity_conflict, not the cédula copy", async () => {
    coreReplies(422, { detail: [{ msg: "identity_conflict" }] });
    const res = await post(validBody);
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ code: "identity_conflict" });
  });

  it("maps any other Core 422 to 'invalid' (edit and resend), not 'backend'", async () => {
    coreReplies(422, { detail: [{ loc: ["body", "phone"], msg: "bad phone" }] });
    const res = await post(validBody);
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ code: "invalid" });
  });

  it("surfaces a Core 429 as rate_limited with a Retry-After", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response("slow down", { status: 429, headers: { "Retry-After": "12" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await post(validBody);

    expect(res.status).toBe(429);
    expect(await res.json()).toMatchObject({ code: "rate_limited" });
  });

  it("reports a Core outage as 'backend' and never leaks upstream detail", async () => {
    coreReplies(500, { detail: "stack trace with secrets" });

    const res = await post(validBody);
    const text = await res.text();

    expect(res.status).toBe(502);
    expect(JSON.parse(text)).toMatchObject({ code: "backend" });
    expect(text).not.toContain("secrets");
  });
});
