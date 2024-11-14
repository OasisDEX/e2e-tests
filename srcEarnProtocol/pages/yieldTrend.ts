import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';

export class YieldTrend {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		// Locator TO BE UPDATED
		await expect(this.page.locator('h3:has-text("Sorry, page not found")')).toBeVisible();
	}
}
