import { expect, Page } from '@playwright/test';
import { ProductHub } from './productHub';

export class Homepage {
	readonly page: Page;

	readonly productHub: ProductHub;

	constructor(page: Page) {
		this.page = page;
		this.productHub = new ProductHub(page);
	}

	async open() {
		await this.page.goto('/');
	}

	async shouldBeVisible() {
		await expect(this.page.getByText('The best place to Borrow and Earn in DeFi')).toBeVisible({
			timeout: 10_000,
		});
	}

	async connectWallet() {
		await this.page.getByText('Connect a wallet').click();
	}
}
