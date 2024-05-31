import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';
import { ProductHub } from '../productHub';
import { ProductsList } from '../common/productsList';
import { expectDefaultTimeout } from 'utils/config';

export type Reason =
	| 'Switch to higher max Loan To Value'
	| 'Switch to lower my cost'
	| 'Change direction of my position'
	| 'Switch to an Earn position';

export class Swap {
	readonly page: Page;

	readonly productHub: ProductHub;

	readonly productList: ProductsList;

	readonly refinanceLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.productHub = new ProductHub(page);
		this.productList = new ProductsList(
			page,
			this.page.locator('#product-hub'),
			this.page.locator('#product-hub tbody tr[role="button"]')
		);
		this.refinanceLocator = this.page.locator('#modalCard').filter({ hasText: 'Swap your' });
	}

	@step
	async selectReason(reason: Reason) {
		await this.page.getByRole('button', { name: reason }).click();
	}

	@step
	async shouldHaveMaxTransactionCost(cost: string) {
		const regExp = new RegExp(cost);
		await expect(this.refinanceLocator.getByText('Max transaction cost').locator('..')).toHaveText(
			regExp,
			{ timeout: expectDefaultTimeout * 4 }
		);
	}

	@step
	async confirm() {
		await this.refinanceLocator.getByRole('button', { name: 'Confirm' }).click();
	}

	@step
	async confirmOrRetry() {
		const confirm = this.refinanceLocator.getByRole('button', { name: 'Confirm' });
		const retry = this.refinanceLocator.getByRole('button', { name: 'Retry', exact: true });

		if (await confirm.isVisible()) {
			await confirm.click();
		} else if (await retry.isVisible()) {
			await retry.click();
		}
	}
}
