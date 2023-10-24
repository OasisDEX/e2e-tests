import { expect, Locator, Page } from '@playwright/test';
import { Pool } from './pool';
import { step } from '#noWalletFixtures';

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

	@step
	async getNumberOfPools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] td:nth-child(1)').first().waitFor();

		const count = await this.listLocator.locator('tbody tr').count();
		return count;
	}

	@step
	async getAllPairs() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"] td:nth-child(1)').first().waitFor();

		const allPairs = await this.listLocator
			.locator('[role="link"] td:nth-child(1)')
			.allInnerTexts();
		return allPairs;
	}

	@step
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

	@step
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

	@step
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

	@step
	async shouldHavePoolsCount(count: number) {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"]').first().waitFor();

		expect(await this.listLocator.locator('[role="link"]').count()).toEqual(count);
	}

	@step
	async shouldHaveOneOrMorePools() {
		// Wait for 1st item to be displayed to avoid random fails
		await this.listLocator.locator('[role="link"]').first().waitFor();

		expect(await this.listLocator.locator('[role="link"]').count()).toBeGreaterThanOrEqual(1);
	}

	@step
	async shouldHaveTokensPair(pair: string) {
		await expect(this.listLocator.locator('[role="link"] td:nth-child(1)').nth(0)).toContainText(
			pair
		);
	}

	@step
	async openPoolFinder() {
		await this.listLocator.getByRole('button', { name: 'Search custom pools' }).click();
	}
}
