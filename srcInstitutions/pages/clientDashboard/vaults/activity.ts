import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class Activity {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Activity' }),
			'"Activity" header should be visible'
		).toBeVisible();
	}
}
