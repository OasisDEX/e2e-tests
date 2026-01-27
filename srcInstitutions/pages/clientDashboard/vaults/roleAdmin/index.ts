import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { AddNewRole } from './addNewRole';
import { AddressAdminActions, AddressRoles } from 'srcInstitutions/utils/types';

export class RoleAdmin {
	readonly page: Page;

	readonly addNewRole: AddNewRole;

	constructor(page: Page) {
		this.page = page;
		this.addNewRole = new AddNewRole(page);
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Roles' }),
			'"Roles" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Add new role' }),
			'"Add new role" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Transaction Queue' }),
			'"Transaction Queue" header should be visible',
		).toBeVisible();
	}

	@step
	async removeRole(address: string) {
		await this.page
			.locator('[class*="PanelRoleAdmin_table_"] tr')
			.filter({ hasText: address })
			.getByRole('button')
			.click();
	}

	@step
	async shouldHaveTxInQueue({
		action,
		role,
		address,
	}: {
		action: AddressAdminActions;
		role: AddressRoles;
		address: string;
	}) {
		const regExp = new RegExp(`${action}.*${role}.*role.*(from|to).*${address}`);

		await expect(this.page.locator('[class*="_transactionDescription_"]').last()).toContainText(
			regExp,
		);
	}

	@step
	async executeLatestTx() {
		await this.page.getByRole('button', { name: 'Execute' }).click();
	}

	@step
	async shouldHaveTxError() {
		await expect(
			this.page.getByRole('button', { name: 'Transaction Error' }),
			'Button should have "Transaction Error" label',
		).toBeVisible();
	}
}
