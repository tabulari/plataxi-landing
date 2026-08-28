import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility gate. Runs axe-core (WCAG 2.0/2.1 A + AA) against the landing
 * page, the apply modal in its open state (focus trap / dialog semantics), and
 * a legal page. Any violation fails CI.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Next.js injects a dev-only overlay element (<nextjs-portal>); it is not part
// of the app and is absent from the production build CI tests against.
const EXCLUDE = "nextjs-portal";

test("landing page has no axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .exclude(EXCLUDE)
    // .phone is a decorative product mockup (aria-hidden); treat like an image.
    .exclude(".phone, .phone-wrapper")
    .withTags(TAGS)
    .analyze();
  expect(results.violations).toEqual([]);
});

test("apply modal (open) has no axe violations", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Solicitar crédito" })
    .first()
    .click();
  await page.getByRole("dialog").waitFor();
  const results = await new AxeBuilder({ page })
    .include("[role='dialog']")
    .withTags(TAGS)
    .analyze();
  expect(results.violations).toEqual([]);
});

test("legal page has no axe violations", async ({ page }) => {
  await page.goto("/legal/privacidad");
  const results = await new AxeBuilder({ page })
    .exclude(EXCLUDE)
    .withTags(TAGS)
    .analyze();
  expect(results.violations).toEqual([]);
});
