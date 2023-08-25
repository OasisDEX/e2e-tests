import { Page } from '@playwright/test';
import { ProductHub } from '../productHub';

export class Multiply {
	readonly page: Page;

	readonly productHub: ProductHub;

	constructor(page: Page) {
		this.page = page;
		this.productHub = new ProductHub(page);
	}

	async open() {
		await this.page.goto('/multiply');
	}
}
