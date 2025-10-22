import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Overview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Performance' }),
			'"Performance" header should be visible'
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'AUM' }),
			'"AUM" header should be visible'
		).toBeVisible();
	}
}
