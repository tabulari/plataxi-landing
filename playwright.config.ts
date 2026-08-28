import { defineConfig } from "@playwright/test";

/**
 * E2E config for the accessibility (axe) checks. When E2E_BASE_URL is set (CI),
 * Playwright runs against an already-running server; otherwise it starts the
 * dev server itself.
 */
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3210";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL, headless: true },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npx next start -p 3210",
        url: "http://localhost:3210",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
