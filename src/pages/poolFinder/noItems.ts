import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';

export class NoItems {
	readonly page: Page;

	readonly noItemsLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.noItemsLocator = page.getByText('There are no items matching your criteria').locator('..');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.noItemsLocator,
			'"There are no items matching your criteria" should be visible'
		).toBeVisible();
	}

	@step
	async createPool() {
		await this.noItemsLocator.getByRole('link', { name: 'create one by yourself' }).click();
	}
}
