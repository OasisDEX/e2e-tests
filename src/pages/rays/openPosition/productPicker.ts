import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class ProductPicker {
	readonly page: Page;

	readonly productPickerLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.productPickerLocator = this.page.locator('div[class*="ProductPicker_content"]');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.productPickerLocator.getByRole('button', { name: 'earn', exact: true })
		).toBeVisible();
	}

	@step
	async shouldDisplayTabs(tabs: ('Migrate' | 'Earn' | 'Borrow' | 'Multiply')[]) {
		for (const tab of tabs) {
			await expect(
				this.productPickerLocator.getByRole('button', { name: 'earn', exact: true }),
				`'${tab}' tab should be visible`
			).toBeVisible();
		}
	}

	@step
	async firstProductShouldBeMigratable() {
		await expect(
			this.productPickerLocator.locator('*[class*="MigrateProductCard_titleRow"]')
		).toContainText('Migrate');
	}
}
