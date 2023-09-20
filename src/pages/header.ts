import { expect, Locator, Page } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';

export class Header {
	readonly page: Page;

	headerLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.headerLocator = page.locator('header');
	}

	async shouldHavePortfolioCount(count: string) {
		await expect(this.headerLocator.getByText('Portfolio')).toContainText(count, {
			timeout: portfolioTimeout,
		});
	}
}
