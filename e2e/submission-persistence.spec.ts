import { test, expect } from '@playwright/test';

test.describe('Application submission persistence', () => {
  test('persists submitted application state across modal close and re-open', async ({ page }) => {
    page.on('console', (msg) => console.log('[BROWSER]', msg.text()));
    await page.goto('/');

    // Simulate an already submitted application saved in localStorage
    await page.evaluate(() => {
      const submission = {
        radicado: 'CR-2026-PERSIST01',
        workspaceUrl: 'https://workspace.example.com/w/mock-token-abc123',
        submittedAt: Date.now(),
        values: {
          fullName: 'Juan Camilo Gómez',
          idNumber: '1.098.765.432',
          phone: '310 987 6543',
          email: 'juan@example.com',
          incomeType: 'monthly',
          income: '$ 3.000.000',
          hasBank: 'yes',
          bankEntity: 'Bancolombia',
        },
        terms: {
          amount: 800000,
          term: 6,
          frequency: 'monthly',
          payment: 148500,
          totalCost: 891000,
          periodRate: 0.023,
          monthlyRate: 0.023,
          ea: 0.312,
          nPeriods: 6,
          unit: '/mes',
          adminFeePerPeriod: 0,
          guaranteeFeeTotal: 0,
          legalInterestAmount: 0,
          platformFeeAmount: 0,
          guaranteeFeeAmount: 0,
          platformFeeRate: 0.03,
          guaranteeFeeRate: 0.036,
          acceptsPlatform: false,
          acceptsGuarantee: false,
          valid: true,
          message: '',
        },
      };
      // Encode with the same logic as draft-storage.ts (btoa + encodeURIComponent)
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(submission))));
      localStorage.setItem('plataxi_submission_v1', encoded);
    });
    // "Ver estado" (the resume entry point) only renders once the page has read storage.
    await page.reload();

    // Open the modal
    await page.locator('#simula').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Ver estado' }).first().click();

    // Verify the dialog is visible and shows the success state instead of resetting to step 1
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Solicitud en evaluación')).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-PERSIST01' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: /ir a mi espacio de crédito/i })).toBeVisible();
    await expect(dialog.getByText('$800.000', { exact: true }).first()).toBeVisible();

    // Close the modal
    await dialog.getByRole('button', { name: 'Cerrar' }).click();
    await expect(dialog).not.toBeVisible();

    // Re-open the modal: verify state was NOT wiped out
    await page.getByRole('button', { name: 'Ver estado' }).first().click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Solicitud en evaluación')).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-PERSIST01' })).toBeVisible();

    // Now test "Nueva solicitud"
    await dialog.getByRole('button', { name: 'Nueva solicitud', exact: true }).click();

    // The modal should now reset to Step 1
    await expect(dialog.getByLabel(/nombre completo/i)).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-PERSIST01' })).not.toBeVisible();
  });

  // The persisted snapshot must reprice with the rates frozen at submit time,
  // not today's defaults (regression: resumed panel showed a different cuota).
  test('a resumed submission keeps the fee rates it was submitted with', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const submission = {
        radicado: 'CR-2026-RATES001',
        workspaceUrl: null,
        submittedAt: Date.now(),
        values: { fullName: 'Ana Argüello', idNumber: '1.098.765.432' },
        terms: {
          amount: 500000, term: 1, frequency: 'monthly', payment: 0, totalCost: 0,
          periodRate: 0.025, monthlyRate: 0.025, ea: 0, nPeriods: 1, unit: '/mes',
          adminFeePerPeriod: 0, guaranteeFeeTotal: 0, legalInterestAmount: 0,
          platformFeeAmount: 0, guaranteeFeeAmount: 0,
          platformFeeRate: 0.02, guaranteeFeeRate: 0.05,
          acceptsPlatform: true, acceptsGuarantee: true, valid: true, message: '',
        },
      };
      localStorage.setItem('plataxi_submission_v1', btoa(unescape(encodeURIComponent(JSON.stringify(submission)))));
    });
    await page.reload();
    await page.locator('#simula').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Ver estado' }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Interés Legal (2,5%):')).toBeVisible();
    await expect(dialog.getByText('Plataforma (2,0%):')).toBeVisible();
    await expect(dialog.getByText('Fianza (5,0%):')).toBeVisible();
    await expect(dialog).not.toContainText(/\d{2,}%\)|\.\d{5,}/);
  });
});

test.describe('Submit failure recovery', () => {
  // A draft parked on step 3 with consent ticked lets us reach "Enviar solicitud"
  // without typing the whole form; the endpoint is mocked so no Core is needed.
  async function openAtReview(page: import('@playwright/test').Page) {
    await page.goto('/');
    await page.evaluate(() => {
      const draft = {
        step: 3, fullName: 'Laura Martínez', idNumber: '1.020.304.050', phone: '310 123 4567',
        contactName: 'Carlos Martínez', contactPhone: '320 987 6543', email: 'laura@example.com',
        income: '$ 2.500.000', incomeType: 'monthly', hasBank: 'yes', bankEntity: 'Bancolombia',
        consent: true,
      };
      localStorage.setItem('plataxi_draft_v1', btoa(unescape(encodeURIComponent(JSON.stringify(draft)))));
    });
    await page.locator('#simula').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /pedir mi crédito|iniciar solicitud|ver estado/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    return dialog;
  }

  test('an applicant-fixable rejection lets them go back and edit', async ({ page }) => {
    await page.route('**/api/application', (route) =>
      route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ code: 'invalid' }) }),
    );
    const dialog = await openAtReview(page);
    await dialog.getByRole('button', { name: /enviar solicitud/i }).click();

    await expect(dialog.getByText('Revisa tus datos')).toBeVisible();
    await expect(dialog.getByRole('button', { name: /reintentar envío/i })).toHaveCount(0);

    await dialog.getByRole('button', { name: 'Revisar mis datos' }).click();
    await expect(dialog.getByLabel(/nombre completo/i)).toBeVisible();
  });

  test('a backend failure retries, then a later success clears the stale error', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/application', (route) => {
      calls += 1;
      return calls === 1
        ? route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ code: 'backend' }) })
        : route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ radicado: 'CR-2026-RETRY001', workspaceUrl: null }) });
    });
    const dialog = await openAtReview(page);
    await dialog.getByRole('button', { name: /enviar solicitud/i }).click();

    await expect(dialog.getByText(/tardando más de lo normal/i)).toBeVisible();
    await dialog.getByRole('button', { name: /reintentar envío/i }).click();

    await expect(dialog.getByText('Solicitud en evaluación')).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-RETRY001' })).toBeVisible();
    // Fee rates render as clean percentages, never "30%" or long float tails.
    await expect(dialog).not.toContainText(/\d{2,}%\)|\.\d{5,}/);
  });
});
