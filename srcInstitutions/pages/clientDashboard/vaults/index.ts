import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Vaults {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Vault exposure' }),
			'"Vault exposure" panel should be visible'
		).toBeVisible();
	}
}
