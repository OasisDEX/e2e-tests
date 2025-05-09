import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';

export class RebalancingActivity {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.locator('h2:has-text("Rebalance Activity")')).toBeVisible();
	}
}
