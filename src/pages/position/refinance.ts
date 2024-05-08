import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';
import { ProductsList } from '../common/productsList';
import { expectDefaultTimeout } from 'utils/config';

export class Refinance {
	readonly page: Page;

	readonly productList: ProductsList;

	readonly refinanceLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.productList = new ProductsList(
			page,
			this.page.locator('#product-hub'),
			this.page.locator('#product-hub tbody tr[role="button"]')
		);
		this.refinanceLocator = this.page.locator('#modalCard').filter({ hasText: 'Refinance' });
	}

	@step
	async selectReason(
		reason:
			| 'Switch to higher max Loan To Value'
			| 'Switch to lower my cost'
			| 'Change direction of my position'
			| 'Switch to an Earn position'
	) {
		await this.page.getByRole('button', { name: reason }).click();
	}

	@step
	async shouldHaveMaxTransactionCost() {
		const regExp = new RegExp('\\$[0-9]{1,2}.[0-9]{1,2}');
		await expect(this.refinanceLocator.getByText('Max transaction cost').locator('..')).toHaveText(
			regExp,
			{ timeout: expectDefaultTimeout * 4 }
		);
	}

	@step
	async confirm() {
		await this.refinanceLocator.getByRole('button', { name: 'Confirm' }).click();
	}
}
