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

	@step
	async shouldHaveAssetAllocationBar() {
		await expect(
			this.page.getByText('Asset allocation'),
			'"Asset allocation" label should be visible'
		).toBeVisible();

		await expect(
			this.page.locator('[class*="_allocationBarItem_"]').first(),
			'Asset allocation bar should be visible'
		).toBeVisible();
	}
}
