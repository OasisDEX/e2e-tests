import { expect, Locator, Page } from '@playwright/test';

export class NoItems {
	readonly page: Page;

	readonly noItemsLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.noItemsLocator = page.getByText('There are no items matching your criteria').locator('..');
	}

	async shouldBeVisible() {
		await expect(this.noItemsLocator).toBeVisible();
	}

	async createPool() {
		await this.noItemsLocator.getByRole('link', { name: 'create one by yourself' }).click();
	}
}
