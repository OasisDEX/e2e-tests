import { expect, Locator } from '@playwright/test';
import { Pool } from './pool';

export class ProductsList {
	readonly listLocator: Locator;

	readonly pool: Pool;

	constructor(productHubLocator: Locator) {
		this.listLocator = productHubLocator.getByRole('table');
		this.pool = new Pool(this.listLocator);
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

	async shouldHaveTokensPair(pair: string) {
		await expect(this.listLocator.locator('[role="link"] td:nth-child(1)').nth(0)).toContainText(
			pair
		);
	}

	async openPoolFinder() {
		await this.listLocator.getByRole('button', { name: 'Search custom pools' }).click();
	}
}
