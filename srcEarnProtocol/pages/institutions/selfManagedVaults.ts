import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class SelfManagedVaults {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'self-managed Vaults' }),
			'"self-managed Vaults" headre should be visible'
		).toBeVisible();
	}
}
