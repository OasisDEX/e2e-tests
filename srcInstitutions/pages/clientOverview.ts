import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

export class ClientOverview {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByRole('heading', { name: 'TestClient Corporation' })).toBeVisible({
			timeout: expectDefaultTimeout * 3,
		});
	}

	@step
	async shouldHaveRoles({
		user,
		wallet,
	}: {
		user?: 'Viewer';
		wallet?: 'No role' | 'No wallet connected';
	}) {
		if (user) {
			await expect(this.page.locator(':has-text("User role:") + p')).toHaveText(user);
		}

		if (wallet) {
			await expect(this.page.locator(':has-text("Wallet role:") + p')).toHaveText(wallet);
		}
	}
}
