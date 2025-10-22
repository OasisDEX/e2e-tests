import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class VaultExposure {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Vault exposure' }),
			'"Vault exposure" header should be visible'
		).toBeVisible();
	}
}
