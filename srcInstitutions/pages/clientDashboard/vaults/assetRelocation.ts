import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class AssetRelocation {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Asset relocation' }),
			'"Asset relocation" header should be visible'
		).toBeVisible();
	}
}
