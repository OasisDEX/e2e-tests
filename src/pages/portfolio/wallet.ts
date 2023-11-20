import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { portfolioTimeout } from 'utils/config';

export class Wallet {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldNotHaveAssets() {
		await expect(
			this.page.getByText('There are no assets in this wallet'),
			'"There are no assets" should be visible'
		).toBeVisible({ timeout: portfolioTimeout });
	}
}
