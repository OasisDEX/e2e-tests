import { Page } from '@playwright/test';
import { ProductHub } from '../productHub';
import { step } from '#noWalletFixtures';

export class Multiply {
	readonly page: Page;

	readonly productHub: ProductHub;

	constructor(page: Page) {
		this.page = page;
		this.productHub = new ProductHub(page);
	}

	@step
	async open() {
		await this.page.goto('/multiply');
	}
}
