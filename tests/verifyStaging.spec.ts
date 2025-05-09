import { expect, test } from '@playwright/test';

test('Staging should be ready for testing', async ({ page }) => {
	test.setTimeout(600_000);

	// Test will re-execute in interval of 30 seconds:
	//     10 seconds from expect timeout + 20 seconds from 'intervals'
	await expect(async () => {
		await page.goto('');
		await expect(page.getByText('The best place to Borrow and Earn in DeFi')).toBeVisible({
			timeout: 10_000,
		});
	}).toPass({ intervals: [1_000, 20_000, 20_000] });
});
