import { test, expect } from '@playwright/test';

test.describe('Application submission persistence', () => {
  test('persists submitted application state across modal close and re-open', async ({ page }) => {
    page.on('console', (msg) => console.log('[BROWSER]', msg.text()));
    await page.goto('/');

    // Simulate an already submitted application saved in localStorage
    await page.evaluate(() => {
      const submission = {
        radicado: 'CR-2026-PERSIST01',
        workspaceUrl: 'http://localhost:3027/s/mock-token-abc123',
        submittedAt: Date.now(),
        values: {
          fullName: 'Juan Camilo Gómez',
          idNumber: '1.098.765.432',
          phone: '310 987 6543',
          email: 'juan@example.com',
          employmentType: 'independent',
          income: '$ 3.000.000',
          bank: 'Bancolombia',
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
          valid: true,
          message: '',
        },
      };
      // Encode with the same logic as draft-storage.ts (btoa + encodeURIComponent)
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(submission))));
      localStorage.setItem('plataxi_submission_v1', encoded);
    });

    // Open the modal
    await page.locator('#simula').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /pedir mi crédito|iniciar solicitud/i }).first().click();

    // Verify the dialog is visible and shows the success state instead of resetting to step 1
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('¡Solicitud enviada con éxito!')).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-PERSIST01' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: /ir a mi espacio de crédito/i })).toBeVisible();
    await expect(dialog.getByText('$800.000', { exact: true })).toBeVisible();

    // Close the modal
    await dialog.getByRole('button', { name: 'Entendido' }).click();
    await expect(dialog).not.toBeVisible();

    // Re-open the modal: verify state was NOT wiped out
    await page.getByRole('button', { name: /pedir mi crédito|iniciar solicitud/i }).first().click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('¡Solicitud enviada con éxito!')).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-PERSIST01' })).toBeVisible();

    // Now test "Nueva solicitud"
    await dialog.getByRole('button', { name: 'Nueva solicitud', exact: true }).click();

    // The modal should now reset to Step 1
    await expect(dialog.getByLabel(/nombre completo/i)).toBeVisible();
    await expect(dialog.locator('b', { hasText: 'CR-2026-PERSIST01' })).not.toBeVisible();
  });
});
