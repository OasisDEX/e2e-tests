import { expect, Locator, Page } from '@playwright/test';
import { ProductsList } from '../common/productsList';

export class PoolFinder {
	readonly page: Page;

	readonly finderLocator: Locator;

	readonly list: ProductsList;

	constructor(page: Page) {
		this.page = page;
		this.finderLocator = page.locator('main');
		this.list = new ProductsList(this.finderLocator);
	}

	async open(positionCategory: 'borrow' | 'earn') {
		await this.page.goto(`/ajna/pool-finder/${positionCategory}`);
	}

	async shouldHaveHeader(positionCategory: 'Borrow' | 'Earn') {
		await expect(this.finderLocator.locator('h1 span').nth(0)).toHaveText(positionCategory);
	}

	async shouldLinkToBlog(positionCategory: 'Borrow' | 'Earn') {
		const element = this.finderLocator.getByRole('link', { name: `Summer.fi ${positionCategory}` });

		await expect(element).toHaveAttribute(
			'href',
			`https://docs.summer.fi/products/${positionCategory.toLocaleLowerCase()}`
		);
		await expect(element).toHaveAttribute('target', '_blank');
	}

	async selectPositionCategory(positionCategory: 'Borrow' | 'Earn') {
		await this.finderLocator.locator('h1 > div').click();
		await this.finderLocator.locator(`h1 li:has-text("${positionCategory}")`).click();
	}

	async filterBy({
		filter,
		value,
	}: {
		filter: 'Pool address' | 'Collateral token' | 'Quote token';
		value: string;
	}) {
		await this.finderLocator.locator(`[id="${filter}"]`).fill(value);
	}
}
