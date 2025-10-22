import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class FeeAndRevenueAdmin {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Fee & revenue admin' }),
			'"Fee & revenue admin" header should be visible'
		).toBeVisible();
	}
}
