import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class ManageInternalUsers {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Manage Internal Users'),
			'Panel Header should be visible'
		).toBeVisible();
	}
}
