import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class Wallet {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.locator('[class*="PotfolioAssets_headerWrapper_"]').getByText('Total Assets'),
			'"Total Assets" should be visible'
		).toBeVisible({ timeout: expectDefaultTimeout * 2 });

		await expect(
			this.page.locator('section:has-text("You might like")'),
			'"You might like" section should be visible'
		).toBeVisible();

		await expect(
			this.page.getByText('Crypto Utilities', { exact: true }),
			'"Crypto Utilities" should be visible'
		).toBeVisible();
	}
}
