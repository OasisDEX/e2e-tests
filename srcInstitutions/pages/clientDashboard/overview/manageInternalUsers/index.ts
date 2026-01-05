import { expect, step } from '#institutionsNoWalletFixtures';
import { Locator, Page } from '@playwright/test';
import { Roles } from 'srcInstitutions/utils/types';
import { Edit } from './edit';

export class ManageInternalUsers {
	readonly page: Page;

	readonly edit: Edit;

	constructor(page: Page) {
		this.page = page;
		this.edit = new Edit(page);
	}

	userLocator(userName: string): Locator {
		return this.page.locator(
			`[class*="PanelManageInternalUsers_tableContainer_"] tbody tr:has-text("${userName}")`
		);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Manage Internal Users'),
			'Panel Header should be visible'
		).toBeVisible();
	}

	@step
	async shouldNotHavePermission() {
		await expect(
			this.page.getByText('You do not have permission to view this page.'),
			'Should display "No permission" message'
		).toBeVisible();
	}

	@step
	async shouldHaveUsers(
		users: { name: string; email?: string; role?: Roles; createdAt?: string }[]
	) {
		for (const user of users) {
			if (user.name) {
				await expect(this.userLocator(user.name).getByRole('cell').nth(0)).toContainText(user.name);
			}

			if (user.email) {
				await expect(this.userLocator(user.name).getByRole('cell').nth(1)).toContainText(
					user.email
				);
			}

			if (user.role) {
				await expect(this.userLocator(user.name).getByRole('cell').nth(2)).toContainText(user.role);
			}

			if (user.createdAt) {
				await expect(this.userLocator(user.name).getByRole('cell').nth(3)).toContainText(
					user.createdAt
				);
			}
		}
	}

	@step
	async editUser(userName: string) {
		await this.page
			.locator('[class*="PanelManageInternalUsers_"] tr')
			.filter({ hasText: userName })
			.getByRole('link', { name: 'Edit' })
			.click();
	}
}
