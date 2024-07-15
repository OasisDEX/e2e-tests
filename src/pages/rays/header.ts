import { Locator, Page } from '@playwright/test';
// import { portfolioTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
	}

	@step
	async connectWallet() {
		await this.headerLocator.getByText('Connect Wallet').click();
	}
}
