import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';

export class PermissionedRwaVault {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Institutional grade DeFi yield.'),
			'"Institutional grade DeFi yield" header should be visible',
		).toBeVisible();
	}
}
