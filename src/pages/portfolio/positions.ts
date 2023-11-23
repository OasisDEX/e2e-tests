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
	async shouldNotHavePositions() {
		await expect(
			this.page.getByText('There are no positions for this wallet'),
			'"There are no positions for this wallet" should be visible'
		).toBeVisible({ timeout: 10_000 });
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
