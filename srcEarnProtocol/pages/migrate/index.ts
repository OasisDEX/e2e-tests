import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class Migrate {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Why Migrate?' }),
			'"Why Migrate?" headershould be visible'
		).toBeVisible();
	}
}
