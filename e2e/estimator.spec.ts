import { test, expect } from '@playwright/test';

test.describe('Kensei Spec E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to local development/preview server
    await page.goto('http://localhost:4173');
  });

  test('should load application successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/KENSEI SPEC/);
    
    // Check main elements are visible

    await page.locator('button', { hasText: /Step 2|Proceed/i }).first().click();

    await page.locator('button', { hasText: /View/i }).first().click();

    await expect(page.locator('text=Awaiting Component Selection')).toBeVisible();
  });

  test('should simulate bottleneck warnings and compute performance on selections', async ({ page }) => {
    // Search and select an older/weak CPU that supports DDR2
    const cpuInput = page.getByRole('textbox').first();
    await cpuInput.fill('Core 2 Quad Q6600');
    await page.getByText('Core 2 Quad Q6600').click();

    // Wait for the CPU selection to trigger RAM dropdown availability
    const ramSelect = page.locator('select').first();
    await expect(ramSelect).toBeEnabled();

    // Select compatible RAM by ID/value
    await ramSelect.selectOption({ value: 'ram-ddr2-4gb' });

    // Search and select a fast GPU (this creates a bottleneck)
    const gpuInput = page.getByRole('textbox').first();
    await gpuInput.fill('RTX 4090');
    // Click the actual suggestion
    await page.getByText('GeForce RTX 4090').first().click();

    // Select HDD storage for extra performance penalty/warnings
    await page.getByText('HDD').click();

    await page.locator('button', { hasText: /Step 2|Proceed/i }).first().click();

    // Select a light game to see some FPS calculation
    await page.getByRole('textbox').first().fill('Valorant');
    await page.getByText('Valorant').first().click();

    await page.locator('button', { hasText: /View/i }).first().click();

    // Confirm diagnostics card renders warnings (using regex for flexibility)
    await expect(page.getByText(/Generational Asymmetry|Generational Mismatch/i)).toBeVisible();
    await expect(page.getByText(/Low RAM capacity/i)).toBeVisible();
    await expect(page.getByText(/Mechanical Storage/i)).toBeVisible();
    await expect(page.getByText(/bottleneck/i).first()).toBeVisible();

    // Ensure FPS average and 1% low can be calculated
    const avgFpsContainer = page.locator('.select-all');
    await expect(avgFpsContainer).not.toHaveText('--');
  });
});
