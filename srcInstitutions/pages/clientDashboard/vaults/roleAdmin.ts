import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';

export class RoleAdmin {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Roles' }),
			'"Roles" header should be visible'
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Add new role' }),
			'"Add new role" header should be visible'
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Transaction Queue' }),
			'"Transaction Queue" header should be visible'
		).toBeVisible();
	}
}
