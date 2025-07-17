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
			this.page.getByRole('heading', { name: 'Closed Access Vaults by Lazy Summer Protocol' }),
			'"Closed Access Vaults by Lazy Summer Protocol" headre should be visible'
		).toBeVisible();
	}
}
