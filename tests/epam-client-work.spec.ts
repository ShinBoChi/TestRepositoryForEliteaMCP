import { test, expect } from '@playwright/test';

test.describe('EPAM website - Client Work navigation', () => {
  test('navigate from Home -> Services -> Explore Our Client Work and verify Client Work heading', async ({ page }) => {
    // Navigate to EPAM home page
    await page.goto('https://www.epam.com/');
    await page.waitForLoadState('networkidle');

    // Accept cookies banner if present (common on corporate sites)
    const acceptButton = page.locator('button', { hasText: /accept|agree/i }).first();
    if (await acceptButton.count() > 0) {
      try {
        await acceptButton.click({ timeout: 2000 });
      } catch (e) {
        // ignore if not clickable
      }
    }

    // Locate "Services" in the header and open its menu (hover to reveal dropdown if needed)
    const servicesLink = page.getByRole('link', { name: /services/i }).first();
    await servicesLink.scrollIntoViewIfNeeded();
    await servicesLink.hover();

    // Click the "Explore Our Client Work" link. Use a case-insensitive text match to be resilient.
    const exploreLink = page.getByRole('link', { name: /explore our client work/i });
    if (await exploreLink.count() === 0) {
      // Fallback: try a text locator
      await page.locator('text=/explore our client work/i').first().click();
    } else {
      await exploreLink.first().click();
    }

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Verify that "Client Work" text is visible on the page
    const clientWorkHeading = page.locator('text=Client Work');
    await expect(clientWorkHeading).toBeVisible({ timeout: 10000 });
  });
});
