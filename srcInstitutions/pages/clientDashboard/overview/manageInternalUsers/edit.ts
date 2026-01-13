import { expect, step } from '#institutionsWithWalletFixtures';
import { Page } from '@playwright/test';

export class Edit {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Editing user'),
			'"Editing user" header should be visible'
		).toBeVisible();
	}

	@step
	async enterNewUsername(newUsername: string) {
		await this.page.locator('input[name="name"]').fill(newUsername);
	}

	@step
	async confirmEdit() {
		await this.page.getByRole('button', { name: 'Edit User' }).click();
	}
}
