import { expect, Locator, Page } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';
import { Products } from './products';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	readonly products: Products;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
		this.products = new Products(page, this.headerLocator);
	}

	async shouldHavePortfolioCount(count: string) {
		await expect(this.headerLocator.getByText('Portfolio')).toContainText(count, {
			timeout: portfolioTimeout,
		});
	}

	async connectWallet() {
		await this.headerLocator.getByText('Connect Wallet').click();
	}
}
