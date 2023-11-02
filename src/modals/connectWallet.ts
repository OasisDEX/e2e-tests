import { step } from '#noWalletFixtures';
import { expect, Page } from '@playwright/test';

export class ConnectWallet {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Available Wallets'),
			'"Available Wallets" should be visible'
		).toBeVisible({ timeout: 20_000 });
	}
}
