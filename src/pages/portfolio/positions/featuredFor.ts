import { expect, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';

export class FeaturedFor {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Featured for'),
			'"Featured for" should be visible'
		).toBeVisible();
	}
}
