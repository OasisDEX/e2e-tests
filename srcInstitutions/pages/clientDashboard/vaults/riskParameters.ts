import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class RiskParameters {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Vault Risk Parameters' }),
			'"Vault Risk Parameters" header should be visible'
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Market Risk Parameters' }),
			'"Market Risk Parameters" header should be visible'
		).toBeVisible();
	}
}
