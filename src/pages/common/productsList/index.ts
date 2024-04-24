import { expect, Locator, Page } from '@playwright/test';
import { Pool } from './pool';
import { step } from '#noWalletFixtures';

export class ProductsList {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly pool: Pool;

	readonly poolLocator: Locator;

	readonly poolPairLocator: Locator;

	constructor(page: Page, productHubLocator: Locator) {
		this.page = page;
		this.listLocator = productHubLocator.getByRole('table');
		this.pool = new Pool(this.poolLocator);
		this.poolLocator = this.listLocator.locator('tbody tr');
		this.poolPairLocator = this.poolLocator.locator('td:nth-child(1)');
	}

	get first() {
		return this.nthPool(0);
	}

	nthPool(nth: number) {
		return new Pool(this.poolLocator.nth(nth));
	}

	byPairPool(pair: string) {
		return new Pool(this.poolLocator.filter({ has: this.page.getByText(pair, { exact: true }) }));
	}

	@step
	async getNumberOfPools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		const count = await this.poolLocator.count();
		return count;
	}

	@step
	async getAllPairs() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		const allPairs = await this.poolPairLocator.allInnerTexts();
		return allPairs;
	}

	@step
	async allPoolsShouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		const poolButton = this.poolLocator.getByRole('button');
		// Wait for 1st item to be displayed to avoid random fails
		await poolButton.first().waitFor();

		const poolButtons = await poolButton.all();

		for (let i = 0; i < poolButtons.length; i++) {
			await expect(poolButton.nth(i)).toHaveText(positionCategory);
		}
	}

	@step
	async allPoolsCollateralShouldContain(token: string) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolPairLocator.first().waitFor();

		const pools = await this.poolPairLocator.all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.poolPairLocator.nth(i)).toContainText(token + '/');
		}
	}

	@step
	async allPoolsQuoteShouldContain(token: string) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolPairLocator.first().waitFor();

		const pools = await this.poolPairLocator.all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.poolPairLocator.nth(i)).toContainText('/' + token);
		}
	}

	@step
	async shouldHavePoolsCount(count: number) {
		const rowLocator = this.poolLocator;
		await expect(rowLocator.nth(0), 'First pool row should be visible').toBeVisible();

		const rowsCount = this.poolLocator.count();
		expect(await rowsCount).toEqual(count);
	}

	@step
	async shouldHaveOneOrMorePools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.poolLocator.first().waitFor();

		expect(await this.poolLocator.count()).toBeGreaterThanOrEqual(1);
	}

	@step
	async shouldHaveTokensPair(pair: string) {
		await expect(this.poolPairLocator.nth(0)).toContainText(pair);
	}

	@step
	async openPoolFinder() {
		await this.listLocator.getByRole('button', { name: 'Search custom pools' }).click();
	}
}
