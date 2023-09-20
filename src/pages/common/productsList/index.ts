import { expect, Locator, Page } from '@playwright/test';
import { Pool } from './pool';

export class ProductsList {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly pool: Pool;

	constructor(page: Page, productHubLocator: Locator) {
		this.page = page;
		this.listLocator = productHubLocator.getByRole('table');
		this.pool = new Pool(this.listLocator.locator('tbody tr'));
	}

	get first() {
		return this.nthPool(0);
	}

	nthPool(nth: number) {
		return new Pool(this.listLocator.locator('tbody tr').nth(nth));
	}

	byPairPool(pair: string) {
		return new Pool(
			this.listLocator
				.locator('[role="link"]')
				.filter({ has: this.page.getByText(pair, { exact: true }) })
		);
	}

	async getNumberOfPools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] td:nth-child(1)').first().waitFor();

		const count = await this.listLocator.locator('tbody tr').count();
		return count;
	}

	async getAllPairs() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] td:nth-child(1)').first().waitFor();

		const allPairs = await this.listLocator
			.locator('[role="link"] td:nth-child(1)')
			.allInnerTexts();
		return allPairs;
	}

	async allPoolsShouldBe(positionCategory: 'Borrow' | 'Multiply' | 'Earn') {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] button').first().waitFor();

		const pools = await this.listLocator.locator('[role="link"] button').all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.listLocator.locator('[role="link"] button').nth(i)).toHaveText(
				positionCategory
			);
		}
	}

	async allPoolsCollateralShouldContain(token: string) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] td:nth-child(1)').first().waitFor();

		const pools = await this.listLocator.locator('[role="link"] td:nth-child(1)').all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.listLocator.locator('[role="link"] td:nth-child(1)').nth(i)).toContainText(
				token + '/'
			);
		}
	}

	async allPoolsQuoteShouldContain(token: string) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] td:nth-child(1)').first().waitFor();

		const pools = await this.listLocator.locator('[role="link"] td:nth-child(1)').all();

		for (let i = 0; i < pools.length; i++) {
			await expect(this.listLocator.locator('[role="link"] td:nth-child(1)').nth(i)).toContainText(
				'/' + token
			);
		}
	}

	async shouldHavePoolsCount(count: number) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"]').first().waitFor();

		expect(await this.listLocator.locator('[role="link"]').count()).toEqual(count);
	}

	async shouldHaveOneOrMorePools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"]').first().waitFor();

		expect(await this.listLocator.locator('[role="link"]').count()).toBeGreaterThanOrEqual(1);
	}

	async shouldHaveTokensPair(pair: string) {
		await expect(this.listLocator.locator('[role="link"] td:nth-child(1)').nth(0)).toContainText(
			pair
		);
	}

	async openPoolFinder() {
		await this.listLocator.getByRole('button', { name: 'Search custom pools' }).click();
	}
}
