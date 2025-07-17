import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class PublicAccessVaults {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', {
				name: 'DeFi’s highest quality strategies continuously optimised',
			}),
			'"DeFi’s highest quality strategies continuously optimised" headre should be visible'
		).toBeVisible();
	}
}
