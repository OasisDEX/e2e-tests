import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { portfolioTimeout } from 'utils/config';

type ProductTypes = 'All products' | 'Borrow' | 'Earn' | 'Multiply' | 'Migrate';

export class Positions {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Show empty positions', { exact: true }),
			'"Show empty positions" should be visible'
		).toBeVisible();
	}

	@step
	async filterByProductType({
		currentFilter,
		productType,
	}: {
		currentFilter: ProductTypes;
		productType: ProductTypes;
	}) {
		const productFilterLocator = this.page
			.locator(`span:has-text("${currentFilter}")`)
			.locator('../..');

		await this.page.locator(`span:has-text("${currentFilter}")`).click();
		await productFilterLocator.getByRole('listitem').filter({ hasText: productType }).click();
		await expect(
			this.page.locator(`span:has-text("${productType}")`),
			`"${productType}" should be visible`
		).toBeVisible({
			timeout: portfolioTimeout,
		});
	}
}
