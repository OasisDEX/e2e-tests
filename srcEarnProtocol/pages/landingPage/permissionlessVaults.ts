import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class PermissionlessVaults {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByText('Automated access to DeFi’s best yields,'),
			'"Automated access to" header should be visible',
		).toBeVisible();
	}
}
