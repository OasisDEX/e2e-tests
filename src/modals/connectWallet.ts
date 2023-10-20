import { expect, Page } from '@playwright/test';

export class ConnectWallet {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldBeVisible() {
		await expect(this.page.getByText('Available Wallets')).toBeVisible();
	}
}
