import { expect, test } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

test('Staging (Lazy) should be ready for testing', async ({ page }) => {
	test.setTimeout(600_000);

	// Test will re-execute in interval of 40 seconds:
	//     20 seconds from expect timeout + 20 seconds from 'intervals'
	await expect(async () => {
		await page.goto('');
		await expect(
			page.locator('h2:has-text("Earn")'),
			'"Earn" header should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 4 });
	}).toPass({ intervals: [1_000, 20_000, 20_000] });
});
