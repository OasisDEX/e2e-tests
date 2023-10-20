import { expect, Locator, Page } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';
import { Products } from './products';
import { Protocols } from './protocols';

export class Header {
	readonly page: Page;

	readonly headerLocator: Locator;

	readonly products: Products;

	readonly protocols: Protocols;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
		this.products = new Products(page, this.headerLocator);
		this.protocols = new Protocols(page, this.headerLocator);
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