import { expect, Page } from '@playwright/test';
import { ProductHub } from './productHub';
import { step } from '#noWalletFixtures';

export class Homepage {
	readonly page: Page;

	readonly productHub: ProductHub;

	constructor(page: Page) {
		this.page = page;
		this.productHub = new ProductHub(page);
	}

	@step
	async open() {
		await this.page.goto('');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('The best place to Borrow and Earn in DeFi'),
			'"The best place to Borrow and Earn in DeFi" should be visible'
		).toBeVisible({
			timeout: 10_000,
		});
	}

	@step
	async connectWallet() {
		await this.page.getByText('Connect a wallet').click();
	}
}
