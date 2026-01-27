import { step } from '#institutionsWithWalletFixtures';
import { Page } from '@playwright/test';
import { AddressRoles } from 'srcInstitutions/utils/types';

export class AddNewRole {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async fillAddress(address: string) {
		await this.page.locator('[class*="_addRoleForm_"] input').fill(address);
	}

	@step
	async selectRole(role: AddressRoles) {
		await this.page.locator('[class*="_addRoleForm_"] [class*="_dropdown_"]').click();
		await this.page.locator('[class*="_dropdownOption_"]').filter({ hasText: role }).click();
	}

	@step
	async addRole() {
		await this.page.getByRole('button', { name: 'Add Role' }).click();
	}
}
